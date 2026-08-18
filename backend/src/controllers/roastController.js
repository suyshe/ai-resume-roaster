import { ParserService } from '../services/parserService.js';
import { GeminiService } from '../services/geminiService.js';
import { RoastModel, getDbStatus } from '../config/db.js';

export const RoastController = {
  /**
   * Process a resume roast request (text, PDF, or image)
   */
  async roastResume(req, res) {
    try {
      const { text, intensity = 'spicy', apiKey: bodyApiKey } = req.body;
      const file = req.file;
      const headerApiKey = req.headers['x-gemini-key'];
      const userApiKey = headerApiKey || bodyApiKey;

      let extractedText = text || '';
      let imageBuffer = null;
      let imageMimeType = null;
      let inputType = 'text';

      if (file) {
        const mime = file.mimetype;
        if (mime === 'application/pdf') {
          inputType = 'pdf';
          try {
            extractedText = await ParserService.extractTextFromPdf(file.buffer);
          } catch (pdfErr) {
            console.warn('[PDF Parser Note]:', pdfErr.message);
            extractedText = `[Scanned PDF Document: ${file.originalname}]`;
          }
        } else if (mime.startsWith('image/')) {
          inputType = 'image';
          imageBuffer = file.buffer;
          imageMimeType = mime;
          extractedText = `[Image Resume: ${file.originalname}]`;
        }
      }

      if (!extractedText && !imageBuffer) {
        return res.status(400).json({
          success: false,
          error: 'Please provide resume text or upload a valid PDF or Image file.'
        });
      }

      console.log(`[Roast Request]: Processing ${inputType} input with ${intensity} intensity.`);

      // Run AI Roast Generation
      const roastResult = await GeminiService.roastResume({
        text: extractedText,
        imageBuffer,
        imageMimeType,
        intensity,
        userApiKey
      });

      // Save to Storage / Database
      const savedRecord = await RoastModel.create({
        title: roastResult.title || 'Resume Roast',
        target_role: 'Candidate',
        intensity,
        input_type: inputType,
        raw_text: extractedText,
        savage_roast: roastResult.savage_roast,
        one_liner: roastResult.one_liner,
        overall_score: roastResult.overall_score,
        red_flags: roastResult.flaws || [],
        actionable_tips: roastResult.improvements || [],
        rewritten_summary: roastResult.summary || ''
      });

      return res.status(200).json({
        success: true,
        data: {
          id: savedRecord.id,
          created_at: savedRecord.created_at,
          ...roastResult
        }
      });
    } catch (error) {
      console.error('[Roast Error]:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Internal Server Error while roasting resume.'
      });
    }
  },

  /**
   * Get past roasts
   */
  async getRoasts(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 15;
      const roasts = await RoastModel.getAll(limit);
      return res.status(200).json({
        success: true,
        data: roasts
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  /**
   * Get single roast by ID
   */
  async getRoastById(req, res) {
    try {
      const { id } = req.params;
      const roast = await RoastModel.getById(id);
      if (!roast) {
        return res.status(404).json({
          success: false,
          error: 'Roast not found.'
        });
      }
      return res.status(200).json({
        success: true,
        data: roast
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  /**
   * Health check
   */
  async healthCheck(req, res) {
    const dbStatus = getDbStatus();
    return res.status(200).json({
      status: 'online',
      service: 'AI Resume Roaster Backend',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '')
    });
  }
};
