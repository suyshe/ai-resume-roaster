import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MockRoastService } from './mockRoastService.js';
import dotenv from 'dotenv';

dotenv.config();

const SYSTEM_INSTRUCTION = `
You are a stand-up comedy roaster and executive career coach.

Analyze the candidate's resume and produce a unique, specific critique.

Rules:
1. summary:
   Give an objective 2-3 sentence summary of the candidate's actual background and skills.

2. one_liner:
   Give a fresh, hilarious roast punchline under 20 words.
   Make it specific to this resume.
   Do not use emojis.

3. savage_roast:
   Write 2-4 paragraphs roasting the actual resume.
   Mention specific technologies, projects, claims, buzzwords, weak bullets,
   missing metrics, or other concrete issues found in the resume.
   Match the requested intensity.
   Do not invent experience that isn't present.
   Do not use emojis.

4. overall_score:
   Integer from 10 to 90 representing resume quality/hireability.

5. flaws:
   Array of 3-4 objects.
   Each object must contain:
   - title
   - description

6. improvements:
   Array of 3-4 specific, actionable improvements.

Return ONLY valid JSON.
Do not use markdown code fences.
Do not use emojis.
`;

const intensityInstructions = {
  mild:
    '70% constructive advice and 30% light sarcasm. Keep it playful.',
  spicy:
    'Savage and witty. Use sharp comedy while remaining useful.',
  nuclear:
    'Maximum reality check. Ruthless comedy but still specific and constructive.'
};

function validateResponse(data, provider) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error(`${provider} returned an invalid response object.`);
  }

  if (typeof data.summary !== 'string') {
    throw new Error(`${provider} response is missing summary.`);
  }

  if (typeof data.one_liner !== 'string') {
    throw new Error(`${provider} response is missing one_liner.`);
  }

  if (typeof data.savage_roast !== 'string') {
    throw new Error(`${provider} response is missing savage_roast.`);
  }

  if (
    typeof data.overall_score !== 'number' ||
    !Number.isInteger(data.overall_score) ||
    data.overall_score < 10 ||
    data.overall_score > 90
  ) {
    throw new Error(`${provider} returned an invalid overall_score.`);
  }

  if (!Array.isArray(data.flaws)) {
    throw new Error(`${provider} response is missing flaws.`);
  }

  if (!Array.isArray(data.improvements)) {
    throw new Error(`${provider} response is missing improvements.`);
  }

  for (const flaw of data.flaws) {
    if (
      !flaw ||
      typeof flaw !== 'object' ||
      typeof flaw.title !== 'string' ||
      typeof flaw.description !== 'string'
    ) {
      throw new Error(`${provider} returned an invalid flaw structure.`);
    }
  }

  for (const improvement of data.improvements) {
    if (typeof improvement !== 'string') {
      throw new Error(`${provider} returned an invalid improvement.`);
    }
  }

  return true;
}

function cleanJson(responseText) {
  return responseText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

/* =========================================
   CLAUDE
========================================= */

async function roastWithClaude({
  text,
  imageBuffer,
  imageMimeType,
  intensity
}) {
  const key = process.env.ANTHROPIC_API_KEY?.trim();

  if (!key) {
    throw new Error('ANTHROPIC_API_KEY is not configured.');
  }

  const anthropic = new Anthropic({
    apiKey: key
  });

  const prompt = `
Intensity:
${intensityInstructions[intensity] || intensityInstructions.spicy}

Resume:

${text || 'No extracted text available. Analyze the attached resume image.'}

Return ONLY JSON using exactly this structure:

{
  "title": "Resume Roast and Review",
  "summary": "2-3 sentence objective summary",
  "one_liner": "Fresh roast punchline",
  "savage_roast": "2-4 paragraphs of specific roast",
  "overall_score": 50,
  "flaws": [
    {
      "title": "Specific flaw",
      "description": "Specific explanation"
    }
  ],
  "improvements": [
    "Specific improvement 1",
    "Specific improvement 2",
    "Specific improvement 3"
  ]
}
`;

  const content = [];

  if (imageBuffer) {
    content.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: imageMimeType || 'image/jpeg',
        data: imageBuffer.toString('base64')
      }
    });
  }

  content.push({
    type: 'text',
    text: prompt
  });

  console.log('[AI Engine]: Trying Claude...');

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2500,
    system: SYSTEM_INSTRUCTION,
    messages: [
      {
        role: 'user',
        content
      }
    ]
  });

  const responseText = message.content
    ?.filter(item => item.type === 'text')
    ?.map(item => item.text)
    ?.join('')
    ?.trim();

  if (!responseText) {
    throw new Error('Claude returned an empty response.');
  }

  const parsedData = JSON.parse(cleanJson(responseText));

  validateResponse(parsedData, 'Claude');

  return {
    ...parsedData,
    intensity,
    is_ai_generated: true,
    is_fallback: false,
    ai_provider: 'claude'
  };
}

/* =========================================
   GEMINI
========================================= */

async function roastWithGemini({
  text,
  imageBuffer,
  imageMimeType,
  intensity
}) {
  const key = process.env.GEMINI_API_KEY?.trim();

  if (!key) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  console.log('[AI Engine]: Claude failed. Trying Gemini...');

  const genAI = new GoogleGenerativeAI(key);

  const model = genAI.getGenerativeModel({
    model: 'gemini-3.6-flash',
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      responseMimeType: 'application/json'
    }
  });

  const prompt = `
Intensity:
${intensityInstructions[intensity] || intensityInstructions.spicy}

Resume:

${text || 'No extracted text available. Analyze the attached resume image.'}

Return ONLY JSON using exactly this structure:

{
  "title": "Resume Roast and Review",
  "summary": "2-3 sentence objective summary",
  "one_liner": "Fresh roast punchline",
  "savage_roast": "2-4 paragraphs of specific roast",
  "overall_score": 50,
  "flaws": [
    {
      "title": "Specific flaw",
      "description": "Specific explanation"
    }
  ],
  "improvements": [
    "Specific improvement 1",
    "Specific improvement 2",
    "Specific improvement 3"
  ]
}
`;

  const parts = [];

  if (imageBuffer) {
    parts.push({
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType: imageMimeType || 'image/jpeg'
      }
    });
  }

  parts.push(prompt);

  const result = await model.generateContent(parts);
  const response = await result.response;

  const responseText = response.text()?.trim();

  if (!responseText) {
    throw new Error('Gemini returned an empty response.');
  }

  const parsedData = JSON.parse(cleanJson(responseText));

  validateResponse(parsedData, 'Gemini');

  return {
    ...parsedData,
    intensity,
    is_ai_generated: true,
    is_fallback: false,
    ai_provider: 'gemini'
  };
}

/* =========================================
   MAIN SERVICE
   CLAUDE → GEMINI → MOCK
========================================= */

export const ClaudeService = {
  async roastResume({
    text,
    imageBuffer,
    imageMimeType,
    intensity = 'spicy'
  }) {

    /*
     * 1. CLAUDE
     */

    try {
      return await roastWithClaude({
        text,
        imageBuffer,
        imageMimeType,
        intensity
      });
    } catch (claudeError) {
      console.warn(
        '[AI Engine]: Claude failed:',
        claudeError.message
      );
    }

    /*
     * 2. GEMINI
     */

    try {
      return await roastWithGemini({
        text,
        imageBuffer,
        imageMimeType,
        intensity
      });
    } catch (geminiError) {
      console.warn(
        '[AI Engine]: Gemini failed:',
        geminiError.message
      );
    }

    /*
     * 3. MOCK FALLBACK
     */

    console.warn(
      '[AI Engine]: Claude and Gemini unavailable. Using Mock Roast Service.'
    );

    const fallback = MockRoastService.generateRoast({
      text: text || 'Candidate Resume',
      intensity
    });

    return {
      ...fallback,
      intensity,
      is_ai_generated: false,
      is_fallback: true,
      ai_provider: 'mock',
      api_error_notice:
        'AI providers unavailable. Generated using local fallback.'
    };
  }
};