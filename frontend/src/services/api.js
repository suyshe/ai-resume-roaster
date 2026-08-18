/**
 * API Service for AI Resume Roaster
 */

const TOKEN_KEY = 'resume_roaster_token';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://ai-resume-roaster-dpqw.onrender.com';

const getApiBase = () => {
  return `${API_URL}/api`;
};

/* =========================
   AUTH TOKEN HELPERS
========================= */

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/* =========================
   SAFE FETCH
========================= */

async function safeFetch(url, options = {}) {
  const headers = options.headers
    ? { ...options.headers }
    : {};

  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  options.headers = headers;

  let response;

  try {
    response = await fetch(url, options);
  } catch (networkError) {
    console.error('[API Network Error]:', networkError);

    throw new Error(
      'Cannot connect to the backend server. Please try again later.'
    );
  }

  const rawText = await response.text();

  if (!rawText || rawText.trim() === '') {
    throw new Error(
      `Server returned status ${response.status} with empty body.`
    );
  }

  let data;

  try {
    data = JSON.parse(rawText);
  } catch (parseError) {
    console.error(
      '[API Parse Error]:',
      rawText.substring(0, 500)
    );

    throw new Error(
      `Invalid response from backend (Status: ${response.status}).`
    );
  }

  if (!response.ok || !data.success) {
    throw new Error(
      data.error ||
      `Request failed with status ${response.status}`
    );
  }

  return data;
}

/* =========================
   API
========================= */

export const api = {

  /* =========================
     REGISTER
  ========================= */

  async register(email, password) {
    const data = await safeFetch(
      `${getApiBase()}/auth/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    setToken(data.data.token);

    return data.data;
  },

  /* =========================
     LOGIN
  ========================= */

  async login(email, password) {
    const data = await safeFetch(
      `${getApiBase()}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    setToken(data.data.token);

    return data.data;
  },

  /* =========================
     LOGOUT
  ========================= */

  logout() {
    clearToken();
  },

  /* =========================
     AUTH STATUS
  ========================= */

  isAuthenticated() {
    return Boolean(getToken());
  },

  /* =========================
     SUBMIT ROAST
  ========================= */

  async submitRoast({
    text = '',
    file = null,
    intensity = 'spicy',
  }) {
    const apiBase = getApiBase();

    let options = {};

    /*
     * PDF / IMAGE UPLOAD
     */

    if (file) {
      const formData = new FormData();

      formData.append('resumeFile', file);
      formData.append('intensity', intensity);

      if (text) {
        formData.append('text', text);
      }

      options = {
        method: 'POST',
        body: formData,
      };
    }

    /*
     * TEXT RESUME
     */

    else {
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          intensity,
        }),
      };
    }

    const data = await safeFetch(
      `${apiBase}/roast`,
      options
    );

    return data.data;
  },

  /* =========================
     GET ROAST HISTORY
  ========================= */

  async getRoasts(limit = 15) {
    const data = await safeFetch(
      `${getApiBase()}/roasts?limit=${limit}`,
      {
        method: 'GET',
      }
    );

    return data.data;
  },

  /* =========================
     GET SINGLE ROAST
  ========================= */

  async getRoastById(id) {
    const data = await safeFetch(
      `${getApiBase()}/roasts/${id}`,
      {
        method: 'GET',
      }
    );

    return data.data;
  },

  /* =========================
     HEALTH CHECK
  ========================= */

  async checkHealth() {
    try {
      const response = await fetch(
        `${getApiBase()}/health`
      );

      const rawText = await response.text();

      if (!rawText) {
        return {
          status: 'offline',
        };
      }

      return JSON.parse(rawText);

    } catch (error) {
      console.error(
        '[Health Check Error]:',
        error
      );

      return {
        status: 'offline',
        isPostgresConnected: false,
      };
    }
  },
};