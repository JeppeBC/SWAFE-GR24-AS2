'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { API_BASE } from '@/lib/api';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/Users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Invalid credentials');
      }
      const data = await res.json();
      // Swagger TokenDto has property `jwt`
      const token = data?.jwt;
      if (token) {
        login(token);
        router.push('/');
      } else {
        throw new Error('No token received from server');
      }
    } catch (err: any) {
      setError(err.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} style={{
      display: 'grid',
      gap: 20
    }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <label style={{
          display: 'block',
          marginBottom: 6,
          color: 'var(--page-foreground)',
          fontWeight: 500,
          fontSize: '0.95em'
        }}>
          Email
        </label>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          required
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '2px solid var(--c-2)',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.05)',
            color: 'var(--page-foreground)',
            fontSize: '1em',
            transition: 'border-color 0.2s ease, background 0.2s ease',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--c-3)';
            e.target.style.background = 'rgba(255,255,255,0.08)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--c-2)';
            e.target.style.background = 'rgba(255,255,255,0.05)';
          }}
          placeholder="Enter your email"
        />
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        <label style={{
          display: 'block',
          marginBottom: 6,
          color: 'var(--page-foreground)',
          fontWeight: 500,
          fontSize: '0.95em'
        }}>
          Password
        </label>
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          required
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '2px solid var(--c-2)',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.05)',
            color: 'var(--page-foreground)',
            fontSize: '1em',
            transition: 'border-color 0.2s ease, background 0.2s ease',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--c-3)';
            e.target.style.background = 'rgba(255,255,255,0.08)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--c-2)';
            e.target.style.background = 'rgba(255,255,255,0.05)';
          }}
          placeholder="Enter your password"
        />
      </div>

      <div style={{ marginTop: 8 }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px 24px',
            background: loading ? 'var(--c-2)' : 'var(--c-3)',
            color: 'var(--c-4)',
            border: 'none',
            borderRadius: 8,
            fontSize: '1.1em',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s ease, transform 0.1s ease',
            opacity: loading ? 0.6 : 1,
            boxShadow: loading ? 'none' : '0 2px 8px rgba(0,0,0,0.2)'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.background = 'var(--c-2)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.background = 'var(--c-3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(220, 53, 69, 0.1)',
          border: '1px solid rgba(220, 53, 69, 0.3)',
          borderRadius: 8,
          color: '#ff6b6b',
          fontSize: '0.95em',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}
    </form>
  );
}
