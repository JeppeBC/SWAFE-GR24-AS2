import { getStoredToken, isTokenExpired } from './auth';

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://assignment2.swafe.dk';

export async function apiFetch(path: string, options: RequestInit = {}) {
  const url = `${API_BASE}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  const token = getStoredToken();
  if (token) {
    if (isTokenExpired(token)) {
      // Token expired, clear it
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      throw new Error('Session expired. Please login again.');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });
  
  // Handle 401 Unauthorized - token might be invalid
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      // Redirect to login if we're not already there
      if (!window.location.pathname.includes('/logIn')) {
        window.location.href = '/logIn';
      }
    }
    throw new Error('Unauthorized. Please login again.');
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}
