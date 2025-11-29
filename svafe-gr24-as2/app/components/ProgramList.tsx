'use client';
import { useEffect, useState } from 'react';
import ProgramCard from './ProgramCard';
import { apiFetch } from '@/lib/api';

export default function ProgramList() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(()=>{
    (async ()=>{
      try {
        const data = await apiFetch('/api/WorkoutPrograms');
        const programsList = Array.isArray(data) ? data : [];
        setPrograms(programsList);
      } catch (err: any) {
        setError(err.message || 'Failed');
      } finally { setLoading(false); }
    })();
  },[]);

  if (loading) return <div>Loading programs...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;
  if (!programs.length) return <div>No programs found</div>;

  return (
    <div style={{display:'grid',gap:12}}>
      {programs.map(p=> <ProgramCard key={p.workoutProgramId} program={p} />)}
    </div>
  );
}
