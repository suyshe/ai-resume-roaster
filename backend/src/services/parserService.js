import pdfParse from 'pdf-parse';

export const ParserService = {
  /**
   * Extract text from an uploaded PDF file buffer
   * @param {Buffer} buffer 
   * @returns {Promise<string>}
   */
  async extractTextFromPdf(buffer) {
    try {
      const data = await pdfParse(buffer);
      const text = data.text ? data.text.trim() : '';
      if (!text || text.length < 20) {
        throw new Error('PDF contains too little extractable text or consists mostly of scanned images.');
      }
      return text;
    } catch (error) {
      console.error('PDF parsing error:', error.message);
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
  },

  /**
   * Format image buffer to base64 inline data for Gemini multimodal processing
   * @param {Buffer} buffer 
   * @param {string} mimeType 
   * @returns {object}
   */
  formatImageForGemini(buffer, mimeType) {
    return {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType: mimeType || 'image/jpeg'
      }
    };
  }
};
