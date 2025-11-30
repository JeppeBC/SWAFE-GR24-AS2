'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function ExerciseForm({ programId, onAdded }: { programId: string, onAdded?: ()=>void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sets, setSets] = useState(3);
  const [repsOrTime, setRepsOrTime] = useState('10');
  const [mode, setMode] = useState<'reps'|'time'>('reps');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Pre-defined exercise templates (name, description, sets, mode, repetitions/time)
  const TEMPLATES = [
    {
      id: 'squat',
      name: 'Squat',
      description: 'Stand with your feet spread shoulder-width apart. Lower your body as far as you can by pushing your hips back and bending your knees. Pause, and then slowly push yourself back to the starting position.',
      sets: 3,
      mode: 'reps',
      value: '20'
    },
    {
      id: 'pushups',
      name: 'Push ups',
      description: 'Place your hands on the floor with legs straight out behind you resting on your toes. Bend your arms and slowly lower your chest until it nearly touches the floor, then push back up to the starting position.',
      sets: 3,
      mode: 'reps',
      value: '10'
    },
    {
      id: 'plank',
      name: 'Plank',
      description: 'Place your elbows on the floor shoulder-width apart with legs stretched out behind you so only your elbows and toes are in contact with the ground. Use your abdominal muscles to keep your body aligned.',
      sets: 1,
      mode: 'time',
      value: '30'
    }
  ];
  const [template, setTemplate] = useState<string>('');
  const [customTemplates, setCustomTemplates] = useState<any[]>([]);
  const [savingTemplateName, setSavingTemplateName] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

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

  function applyTemplate(id: string) {
    setTemplate(id);
    if (!id) return;
    const t = TEMPLATES.find(t => t.id === id) || customTemplates.find(t => t.id === id);
    if (!t) return;
    setName(t.name);
    setDescription(t.description);
    setSets(t.sets);
    setMode(t.mode as 'reps'|'time');
    setRepsOrTime(t.value);
  }

  // load saved templates from localStorage
  useEffect(()=>{
    try {
      const raw = localStorage.getItem('exerciseTemplates');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setCustomTemplates(parsed);
    } catch (err) {
      console.warn('Failed to load custom templates', err);
    }
  },[]);

  function persistTemplates(list: any[]) {
    setCustomTemplates(list);
    try { localStorage.setItem('exerciseTemplates', JSON.stringify(list)); } catch {}
  }

  function saveCustomTemplate() {
    const name = savingTemplateName.trim();
    if (!name) { setNotice('Enter a name for the template'); return; }
    const id = `custom-${Date.now()}`;
    const tmpl = { id, name, description, sets, mode, value: String(repsOrTime) };
    const next = [tmpl, ...customTemplates];
    persistTemplates(next);
    setSavingTemplateName('');
    setTemplate(id);
    setNotice('Template saved');
    setTimeout(()=>setNotice(null),2000);
  }

  function deleteCustomTemplate(id: string) {
    const next = customTemplates.filter(t=>t.id !== id);
    persistTemplates(next);
    if (template === id) setTemplate('');
    setNotice('Template deleted');
    setTimeout(()=>setNotice(null),2000);
  }

  return (
    <form onSubmit={submit} style={{display:'grid',gap:8,maxWidth:640}}>
      <h4>Add exercise</h4>
      <label>Choose template
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <select value={template} onChange={e=>applyTemplate(e.target.value)} style={{flex:1}}>
            <option value="">— custom / pick template —</option>
            <optgroup label="Built-in">
              {TEMPLATES.map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}
            </optgroup>
            {customTemplates.length ? <optgroup label="Saved templates">{customTemplates.map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}</optgroup> : null}
          </select>
          {template.startsWith('custom-') ? (
            <button type="button" onClick={()=>deleteCustomTemplate(template)} style={{padding:'6px 8px'}} aria-label="Delete template">Delete</button>
          ) : null}
        </div>
      </label>
      {notice && <div style={{color:'var(--c-2)'}}>{notice}</div>}
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <input placeholder="Template name (save current)" value={savingTemplateName} onChange={e=>setSavingTemplateName(e.target.value)} />
        <button type="button" onClick={saveCustomTemplate}>Save template</button>
      </div>
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
