'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function ProgramForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [clientsError, setClientsError] = useState<string | null>(null);
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

  useEffect(()=>{
    let mounted = true;
    (async ()=>{
      setClientsLoading(true);
      setClientsError(null);
      try {
        // Fetch clients for the logged-in trainer
        const data = await apiFetch('/api/Users/Clients');
        if (!mounted) return;
        if (Array.isArray(data)) setClients(data);
        else setClients([]);
      } catch (err: any) {
        // fallback: try to fetch all users and filter clients (manager scenario)
        try {
          const all = await apiFetch('/api/Users');
          if (!mounted) return;
          if (Array.isArray(all)) setClients(all.filter((u:any)=> u.accountType?.toLowerCase?.() === 'client'));
        } catch (err2:any) {
          if (!mounted) return;
          setClientsError(err?.message || err2?.message || 'Could not load clients');
        }
      } finally { if (mounted) setClientsLoading(false); }
    })();
    return ()=>{ mounted = false };
  },[]);

  return (
    <form onSubmit={submit} style={{display:'grid',gap:8,maxWidth:680}}>
      <label>Name<input value={name} onChange={e=>setName(e.target.value)} required /></label>
      <label>Description<textarea value={description} onChange={e=>setDescription(e.target.value)} /></label>
      <label>Assign to client
        {clientsLoading ? (
          <div style={{padding:8}}>Loading clients…</div>
        ) : clientsError ? (
          <div style={{padding:8,color:'orange'}}>Unable to load clients: {clientsError}</div>
        ) : clients.length ? (
          <select value={clientId} onChange={e=>setClientId(e.target.value)}>
            <option value="">— select client —</option>
            {clients.map(c=> (
              <option key={c.userId ?? c.userID ?? c.id} value={String(c.userId ?? c.userID ?? c.id)}>{(c.firstName || c.first_name || '') + ' ' + (c.lastName || c.last_name || '') + (c.email ? ` (${c.email})` : '')}</option>
            ))}
          </select>
        ) : (
          <input value={clientId} onChange={e=>setClientId(e.target.value)} placeholder="client id" />
        )}
      </label>
      <div><button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Program'}</button></div>
      {msg && <div>{msg}</div>}
    </form>
  );
}
