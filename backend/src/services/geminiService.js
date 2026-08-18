import { GoogleGenerativeAI } from '@google/generative-ai';
import { MockRoastService } from './mockRoastService.js';
import dotenv from 'dotenv';

dotenv.config();

const SYSTEM_INSTRUCTION = `You are a stand-up comedy roaster and executive career coach.
Your job is to read candidate resumes and generate a completely unique, creative critique for every submission without using any emojis:

1. "summary": An objective, 2-3 sentence honest summary of the candidate's actual background and skills.
2. "one_liner": A completely fresh, hilarious roast punchline (under 20 words) making fun of their specific resume clichés or background. Do not include emojis.
3. "savage_roast": 2-4 detailed paragraphs of comedy roasting their specific projects, buzzwords, awkward bullet points, and experience claims based on the requested intensity. Do not include emojis.
4. "overall_score": An honest hireability score integer between 10 and 90.
5. "flaws": An array of 3-4 specific flaw objects based on THIS specific resume, each with "title" (the flaw name without emojis) and "description" (why it hurts their chances).
6. "improvements": An array of 3-4 clear, high-impact, actionable suggestions tailored to fixing the specific weaknesses in this resume without emojis.

You MUST respond strictly with valid raw JSON adhering to this schema. Do not include markdown code block ticks (\`\`\`json). Do not use emojis anywhere.`;

export const GeminiService = {
  /**
   * Roast a resume using Gemini AI
   */
  async roastResume({ text, imageBuffer, imageMimeType, intensity = 'spicy', userApiKey }) {
    const activeKey = (userApiKey && userApiKey.trim() !== '') 
      ? userApiKey.trim() 
      : process.env.GEMINI_API_KEY;

    if (!activeKey || activeKey === 'your_gemini_api_key_here' || activeKey.trim() === '') {
      console.log('[AI Engine]: No Gemini API key provided. Using randomized local roast engine.');
      return MockRoastService.generateRoast({ text: text || 'Sample Resume', intensity });
    }

    try {
      const genAI = new GoogleGenerativeAI(activeKey);

      const intensityInstructions = {
        mild: "Tone: Mild banter. 70% constructive advice, 30% light sarcasm. Playful and encouraging.",
        spicy: "Tone: Savage and witty. Tear apart buzzwords, generic claims, and clichés with sharp comedy humor.",
        nuclear: "Tone: Maximum reality check. Zero sugarcoating, ruthless comedy roast."
      };

      const randomSeed = Math.random().toString(36).substring(7);

      const promptText = `
[Request ID: ${randomSeed}]
Intensity Level: "${intensity.toUpperCase()}"
${intensityInstructions[intensity] || intensityInstructions.spicy}

Candidate Resume Content to Analyze:
${text ? text.substring(0, 12000) : 'Analyze the attached resume image directly.'}

Generate a 100% original, unique roast and breakdown. Return ONLY valid JSON with this exact structure without emojis:
{
  "title": "Resume Roast and Review",
  "summary": "2-3 sentence overview of this specific candidate",
  "one_liner": "A completely fresh, unique roast punchline",
  "savage_roast": "2-4 paragraphs of comedic roast tailored directly to their text and claims",
  "overall_score": <number between 10 and 90>,
  "flaws": [
    { "title": "Specific Flaw Title", "description": "Specific flaw explanation tailored to this resume" }
  ],
  "improvements": [
    "Specific actionable improvement 1",
    "Specific actionable improvement 2",
    "Specific actionable improvement 3"
  ]
}
`;

      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: SYSTEM_INSTRUCTION,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.95,
          topP: 0.95
        }
      });

      const parts = [];

      if (imageBuffer) {
        parts.push({
          inlineData: {
            data: imageBuffer.toString('base64'),
            mimeType: imageMimeType || 'image/jpeg'
          }
        });
      }

      parts.push(promptText);

      console.log('[AI Engine]: Calling Google Gemini AI for live unique roast generation...');
      const result = await model.generateContent(parts);
      const response = await result.response;
      const responseText = response.text()?.trim() || '{}';
      
      const cleanedJson = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      const parsedData = JSON.parse(cleanedJson);

      return {
        ...parsedData,
        intensity,
        is_ai_generated: true,
        is_fallback: false
      };
    } catch (error) {
      console.warn('[AI Engine Note]: Gemini API call failed or hit quota, using fallback:', error.message);
      const fallback = MockRoastService.generateRoast({
        text: text || 'Candidate Resume',
        intensity
      });
      return {
        ...fallback,
        api_error_notice: `AI service note: ${error.message}. Generated using local engine.`
      };
    }
  }
};
