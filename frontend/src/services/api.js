/**
 * API Service for AI Resume Roaster
 */

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://ai-resume-roaster-dpqw.onrender.com';

const getApiBase = () => {
  return `${API_URL}/api`;
};

const getStoredApiKey = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('gemini_api_key') || '';
  }
  return '';
};

/**
 * Safely executes a fetch request and parses JSON
 */
async function safeFetch(url, options = {}) {
  const userKey = getStoredApiKey();

  const headers = options.headers ? { ...options.headers } : {};

  if (userKey && !headers['x-gemini-key']) {
    headers['x-gemini-key'] = userKey;
  }

  options.headers = headers;

  let response;

  try {
    response = await fetch(url, options);
  } catch (networkError) {
    throw new Error(
      'Cannot connect to the backend server. Please try again later.'
    );
  }

  const rawText = await response.text();

  if (!rawText || rawText.trim() === '') {
    if (!response.ok) {
      throw new Error(
        `Server returned status ${response.status} with empty body.`
      );
    }

    throw new Error('Server returned an empty response.');
  }

  let data;

  try {
    data = JSON.parse(rawText);
  } catch (parseError) {
    console.error(
      'Non-JSON response received:',
      rawText.substring(0, 200)
    );

    throw new Error(
      `Invalid response from backend (Status: ${response.status}).`
    );
  }

  if (!response.ok || !data.success) {
    throw new Error(
      data.error || `Request failed with status ${response.status}`
    );
  }

  return data;
}

export const api = {
  /**
   * Submit a resume for roasting
   */
  async submitRoast({ text, file, intensity = 'spicy' }) {
    const apiBase = getApiBase();
    const userKey = getStoredApiKey();

    let options = {};

    if (file) {
      const formData = new FormData();

      formData.append('resumeFile', file);
      formData.append('intensity', intensity);

      if (text) {
        formData.append('text', text);
      }

      if (userKey) {
        formData.append('apiKey', userKey);
      }

      options = {
        method: 'POST',
        body: formData,
      };
    } else {
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          intensity,
          apiKey: userKey,
        }),
      };
    }

    const data = await safeFetch(`${apiBase}/roast`, options);

    return data.data;
  },

  /**
   * Fetch recent roasts
   */
  async getRoasts(limit = 15) {
    const apiBase = getApiBase();

    const data = await safeFetch(
      `${apiBase}/roasts?limit=${limit}`
    );

    return data.data;
  },

  /**
   * Fetch a single roast
   */
  async getRoastById(id) {
    const apiBase = getApiBase();

    const data = await safeFetch(
      `${apiBase}/roasts/${id}`
    );

    return data.data;
  },

  /**
   * Check backend health
   */
  async checkHealth() {
    const apiBase = getApiBase();

    try {
      const response = await fetch(`${apiBase}/health`);
      const rawText = await response.text();

      if (!rawText) {
        return { status: 'offline' };
      }

      return JSON.parse(rawText);
    } catch {
      return {
        status: 'offline',
        isPostgresConnected: false,
      };
    }
  },
};