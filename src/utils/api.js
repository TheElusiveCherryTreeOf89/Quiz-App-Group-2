import { getToken } from './db';
import { handleMockRequest, seedDemoData } from './mockApi';

// Toggle IDB-only mock mode here. Set to true to intercept /api calls.
const USE_IDB_ONLY = true;

let _seeded = false;

export async function fetchWithAuth(url, options = {}) {
  if (USE_IDB_ONLY) {
    if (!_seeded) {
      _seeded = true;
      seedDemoData().catch(()=>{});
    }
    // route to mock API
    try {
      const resp = await handleMockRequest(url, options);
      return resp;
    } catch (e) {
      console.error('[fetchWithAuth] mock request failed', e);
      throw e;
    }
  }

  // Prefer synchronous localStorage token for compatibility, fall back to IndexedDB
  let token = localStorage.getItem('token');
  if (!token) {
    try {
      token = await getToken();
    } catch (e) {
      console.warn('[fetchWithAuth] Failed to read token from IndexedDB', e);
    }
  }
  if (!options.headers) options.headers = {};

  // Ensure Authorization header is present
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn('[fetchWithAuth] Missing token for request:', url);
  }

  // Don't set Content-Type when body is FormData (browser sets the boundary)
  if (options.body && !options.headers['Content-Type'] && !(options.body instanceof FormData)) {
    options.headers['Content-Type'] = 'application/json';
  }

  try {
    const resp = await fetch(url, options);

    // Always read text and try to parse JSON so callers can safely access parsed data
    const text = await resp.text().catch(() => '');
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (err) {
      data = text;
    }

    if (!resp.ok) {
      console.error(`[fetchWithAuth] Request failed: ${url} status=${resp.status} body=${text}`);
    }

    return {
      ok: resp.ok,
      status: resp.status,
      headers: resp.headers,
      data,
      json: async () => data,
      text: async () => (typeof text === 'string' ? text : JSON.stringify(text)),
    };
  } catch (err) {
    console.error('[fetchWithAuth] Network error for', url, err);
    throw err;
  }
}

export function getAuthToken() {
  return localStorage.getItem('token');
}

export async function getAuthTokenAsync() {
  const local = localStorage.getItem('token');
  if (local) return local;
  try {
    return await getToken();
  } catch (e) {
    return null;
  }
}
