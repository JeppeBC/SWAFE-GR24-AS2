'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import ExerciseForm from './ExerciseForm';

export default function ProgramDetail({ programId }: { programId: string }) {
  const [program, setProgram] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true); setError(null);
    try {
      // GET /api/WorkoutPrograms/{id}
      const data = await apiFetch(`/api/WorkoutPrograms/${programId}`);
      setProgram(data);
    } catch (err: any) {
      setError(err.message || 'Failed');
    } finally { setLoading(false); }
  }

  useEffect(()=>{ load(); },[programId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;
  if (!program) return <div>Program not found</div>;

  return (
    <div style={{display:'grid',gap:12}}>
      <h2>{program.name}</h2>
      <p>{program.description}</p>
      <section>
        <h3>Exercises</h3>
        {Array.isArray(program.exercises) && program.exercises.length ? (
          <ul>
            {program.exercises.map((ex:any)=> (
              <li key={ex.exerciseId}>{ex.name} — {ex.sets ?? ''} sets — {ex.time ? ex.time + ' sec' : (ex.repetitions ? ex.repetitions + ' reps' : '')}</li>
            ))}
          </ul>
        ) : <div>No exercises yet</div>}
      </section>

      <ExerciseForm programId={programId} onAdded={load} />
    </div>
  );
}
