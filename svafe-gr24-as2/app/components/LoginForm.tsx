'use client';
import { useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // POST to /api/Users/login (Swagger)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'https://assignment2.swafe.dk'}/api/Users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      // Swagger TokenDto has property `jwt`
      const token = data?.jwt;
      if (token) localStorage.setItem('token', token);
      else console.warn('Login response shape unknown', data);
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} style={{maxWidth:480,display:'grid',gap:8}}>
      <label>
        Email
        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
      </label>
      <label>
        Password
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
      </label>
      <div>
        <button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
      </div>
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  );
}
