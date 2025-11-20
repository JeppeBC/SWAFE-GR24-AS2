'use client';
import { useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function ProgramForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMsg(null);
    try {
      // CreateWorkoutDto per Swagger: name, description, exercises (array), clientId
      const body: any = { name, description, clientId: clientId ? Number(clientId) : undefined };
      // no exercises at creation by default
      await apiFetch('/api/WorkoutPrograms', { method: 'POST', body: JSON.stringify(body) });
      setMsg('Program created'); setName(''); setDescription(''); setClientId('');
    } catch (err: any) {
      setMsg(err.message || 'Failed');
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit} style={{display:'grid',gap:8,maxWidth:680}}>
      <label>Name<input value={name} onChange={e=>setName(e.target.value)} required /></label>
      <label>Description<textarea value={description} onChange={e=>setDescription(e.target.value)} /></label>
      <label>Client ID (assign to)
        <input value={clientId} onChange={e=>setClientId(e.target.value)} placeholder="client id" />
      </label>
      <div><button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Program'}</button></div>
      {msg && <div>{msg}</div>}
    </form>
  );
}
