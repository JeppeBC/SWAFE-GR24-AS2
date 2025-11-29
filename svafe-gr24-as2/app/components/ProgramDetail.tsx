'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/app/contexts/AuthContext';
import ExerciseForm from './ExerciseForm';

export default function ProgramDetail({ programId }: { programId: string }) {
  const { hasRole } = useAuth();
  const [program, setProgram] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!programId || programId === 'undefined') {
      setError('Invalid program ID');
      setLoading(false);
      return;
    }
    
    setLoading(true); setError(null);
    try {
      const data = await apiFetch(`/api/WorkoutPrograms/${programId}`);
      setProgram(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load program');
    } finally { setLoading(false); }
  }

  useEffect(()=>{ load(); },[programId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;
  if (!program) return <div>Program not found</div>;

  return (
    <div style={{display:'grid',gap:32}}>
      <header style={{
        paddingBottom: 16,
        borderBottom: '2px solid var(--c-2)'
      }}>
        <h1 style={{ margin: 0, fontSize: '2em', fontWeight: 'bold' }}>
          {program.name || 'Unnamed Program'}
        </h1>
        {program.workoutProgramId && (
          <div style={{ marginTop: 8, color: 'var(--c-3)', fontSize: '0.9em' }}>
            Program ID: {program.workoutProgramId}
          </div>
        )}
      </header>

      {program.description && (
        <section style={{ 
          padding: 24, 
          border: '2px solid var(--c-2)', 
          borderRadius: 12, 
          background: 'rgba(255,255,255,0.03)',
          borderTop: '4px solid var(--c-3)'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: '1.5em' }}>Description</h2>
          <p style={{ margin: 0, color: 'var(--page-foreground)', lineHeight: 1.6 }}>
            {program.description}
          </p>
        </section>
      )}

      <section style={{ 
        padding: 24, 
        border: '2px solid var(--c-2)', 
        borderRadius: 12, 
        background: 'rgba(255,255,255,0.03)',
        borderTop: '4px solid var(--c-3)'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: '1.5em' }}>Exercises</h2>
        {Array.isArray(program.exercises) && program.exercises.length ? (
          <div style={{ display: 'grid', gap: 12 }}>
            {program.exercises.map((ex:any)=> (
              <div
                key={ex.exerciseId}
                style={{
                  padding: 16,
                  border: '1px solid var(--c-2)',
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                  <strong style={{ fontSize: '1.1em' }}>{ex.name}</strong>
                  {ex.exerciseId && (
                    <span style={{ color: 'var(--c-3)', fontSize: '0.85em' }}>
                      (ID: {ex.exerciseId})
                    </span>
                  )}
                </div>
                {ex.description && (
                  <div style={{ 
                    fontSize: '0.95em', 
                    color: 'var(--c-3)', 
                    marginTop: 8,
                    marginBottom: 12,
                    lineHeight: 1.5
                  }}>
                    {ex.description}
                  </div>
                )}
                <div style={{ 
                  fontSize: '0.9em', 
                  color: 'var(--c-3)',
                  display: 'flex',
                  gap: 16,
                  flexWrap: 'wrap'
                }}>
                  <span>Sets: <strong>{ex.sets ?? 'N/A'}</strong></span>
                  {ex.repetitions && (
                    <span>Reps: <strong>{ex.repetitions}</strong></span>
                  )}
                  {ex.time && (
                    <span>Time: <strong>{ex.time}</strong></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: 16, color: 'var(--c-3)', textAlign: 'center' }}>
            No exercises yet. {hasRole('PersonalTrainer') && 'Add exercises below.'}
          </div>
        )}
      </section>

      {hasRole('PersonalTrainer') && (
        <section style={{ 
          padding: 24, 
          border: '2px solid var(--c-2)', 
          borderRadius: 12, 
          background: 'rgba(255,255,255,0.03)',
          borderTop: '4px solid var(--c-3)'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: '1.5em' }}>Add Exercise</h2>
          <ExerciseForm programId={programId} onAdded={load} />
        </section>
      )}
    </div>
  );
}
