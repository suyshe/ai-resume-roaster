/**
 * Safe API Service for AI Resume Roaster
 */

const getApiBase = () => {
  if (typeof window !== 'undefined') {
    const isViteDev = window.location.port === '3000' || window.location.port === '5173';
    return isViteDev ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');
  }
  return '/api';
};

const getStoredApiKey = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('gemini_api_key') || '';
  }
  return '';
};

/**
 * Safely executes a fetch request and parses JSON with robust error handling
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
    if (url.startsWith('/api') && typeof window !== 'undefined') {
      try {
        const directUrl = url.replace('/api', 'http://localhost:5000/api');
        response = await fetch(directUrl, options);
      } catch (directError) {
        throw new Error(
          'Cannot connect to backend server. Please ensure backend is running at http://localhost:5000.'
        );
      }
    } else {
      throw new Error(
        'Network error: Cannot reach the backend server at http://localhost:5000.'
      );
    }
  }

  const rawText = await response.text();
  
  if (!rawText || rawText.trim() === '') {
    if (!response.ok) {
      throw new Error(`Server returned status ${response.status} with empty body.`);
    }
    throw new Error('Server returned an empty response.');
  }

  let data;
  try {
    data = JSON.parse(rawText);
  } catch (parseError) {
    console.error('Non-JSON response received:', rawText.substring(0, 200));
    throw new Error(
      `Invalid response format from server (Status: ${response.status}). Verify backend is running on port 5000.`
    );
  }

  if (!response.ok || !data.success) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  /**
   * Submit a resume for roasting (supports text, PDF, and image)
   */
  async submitRoast({ text, file, intensity = 'spicy' }) {
    const apiBase = getApiBase();
    const userKey = getStoredApiKey();
    let options = {};

    if (file) {
      const formData = new FormData();
      formData.append('resumeFile', file);
      formData.append('intensity', intensity);
      if (text) formData.append('text', text);
      if (userKey) formData.append('apiKey', userKey);

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
          apiKey: userKey
        }),
      };
    }

    const data = await safeFetch(`${apiBase}/roast`, options);
    return data.data;
  },

  /**
   * Fetch recent roasts from database
   */
  async getRoasts(limit = 15) {
    const apiBase = getApiBase();
    const data = await safeFetch(`${apiBase}/roasts?limit=${limit}`);
    return data.data;
  },

  /**
   * Fetch single roast by ID
   */
  async getRoastById(id) {
    const apiBase = getApiBase();
    const data = await safeFetch(`${apiBase}/roasts/${id}`);
    return data.data;
  },

  /**
   * Check backend health and DB status
   */
  async checkHealth() {
    const apiBase = getApiBase();
    try {
      const response = await fetch(`${apiBase}/health`);
      const rawText = await response.text();
      if (!rawText) return { status: 'offline' };
      return JSON.parse(rawText);
    } catch {
      try {
        const directRes = await fetch('http://localhost:5000/api/health');
        const raw = await directRes.text();
        return raw ? JSON.parse(raw) : { status: 'offline' };
      } catch {
        return { status: 'offline', isPostgresConnected: false };
      }
    }
  }
};
