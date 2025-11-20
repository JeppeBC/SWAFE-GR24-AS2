'use client';
import { useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function ExerciseForm({ programId, onAdded }: { programId: string, onAdded?: ()=>void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sets, setSets] = useState(3);
  const [repsOrTime, setRepsOrTime] = useState('10');
  const [mode, setMode] = useState<'reps'|'time'>('reps');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setMsg(null);
    try {
      // Swagger endpoint: POST /api/Exercises/Program/{programId} with CreateExerciseDto
      const body: any = { name, description, sets };
      if (mode === 'reps') body.repetitions = Number(repsOrTime || 0);
      else body.time = String(repsOrTime || '');
      await apiFetch(`/api/Exercises/Program/${programId}`, { method: 'POST', body: JSON.stringify(body) });
      setMsg('Exercise added'); setName(''); setDescription(''); setSets(3); setRepsOrTime('10');
      onAdded?.();
    } catch (err: any) { setMsg(err.message || 'Failed'); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit} style={{display:'grid',gap:8,maxWidth:640}}>
      <h4>Add exercise</h4>
      <label>Name<input value={name} onChange={e=>setName(e.target.value)} required /></label>
      <label>Description<textarea value={description} onChange={e=>setDescription(e.target.value)} /></label>
      <label>Sets<input type="number" value={sets} onChange={e=>setSets(Number(e.target.value))} min={1} /></label>
      <label>Mode
        <select value={mode} onChange={e=>setMode(e.target.value as any)}>
          <option value="reps">Reps</option>
          <option value="time">Time</option>
        </select>
      </label>
      <label>Reps / Time<input value={repsOrTime} onChange={e=>setRepsOrTime(e.target.value)} /></label>
      <div><button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Exercise'}</button></div>
      {msg && <div>{msg}</div>}
    </form>
  );
}
