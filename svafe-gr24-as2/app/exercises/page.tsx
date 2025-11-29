'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import ExerciseForm from '@/app/components/ExerciseForm';

interface Exercise {
  exerciseId: number;
  name: string;
  description?: string;
  sets?: number;
  repetitions?: number;
  time?: string;
  workoutProgramId?: number;
  personalTrainerId?: number;
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      // Load exercises
      const exercisesData = await apiFetch('/api/Exercises');
      setExercises(Array.isArray(exercisesData) ? exercisesData : []);

      // Load programs for the trainer
      const programsData = await apiFetch('/api/WorkoutPrograms/trainer');
      setPrograms(Array.isArray(programsData) ? programsData : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  const handleExerciseAdded = () => {
    loadData();
    setShowForm(false);
  };

  const unassignedExercises = exercises.filter((e) => !e.workoutProgramId);

  return (
    <ProtectedRoute requiredRole="PersonalTrainer">
      <main style={{ padding: 16 }}>
        <header style={{
          marginBottom: 32,
          paddingBottom: 16,
          borderBottom: '2px solid var(--c-2)'
        }}>
          <h1 style={{ margin: 0, fontSize: '2em', fontWeight: 'bold' }}>Exercises</h1>
          <p style={{ margin: '8px 0 0 0', color: 'var(--c-3)', fontSize: '1.1em' }}>
            Manage exercises and assign them to workout programs
          </p>
        </header>

        {loading && <div>Loading exercises...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}

        {!loading && !error && (
          <div style={{ display: 'grid', gap: 32 }}>
            {/* Unassigned Exercises Section */}
            <section style={{ 
              padding: 24, 
              border: '2px solid var(--c-2)', 
              borderRadius: 12, 
              background: 'rgba(255,255,255,0.03)',
              borderTop: '4px solid var(--c-3)'
            }}>
              <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: '1.5em' }}>Unassigned Exercises</h2>
              {unassignedExercises.length === 0 ? (
                <div style={{ padding: 16, color: 'var(--c-3)' }}>No unassigned exercises</div>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {unassignedExercises.map((exercise) => (
                    <div
                      key={exercise.exerciseId}
                      style={{
                        padding: 16,
                        border: '1px solid var(--c-2)',
                        borderRadius: 8,
                        background: 'rgba(255,255,255,0.02)',
                      }}
                    >
                      <div>
                        <strong>{exercise.name}</strong>
                      </div>
                      {exercise.description && (
                        <div style={{ marginTop: 4, color: 'var(--c-3)' }}>
                          {exercise.description}
                        </div>
                      )}
                      <div style={{ marginTop: 8, fontSize: '0.9em', color: 'var(--c-3)' }}>
                        Sets: {exercise.sets || 'N/A'} |{' '}
                        {exercise.repetitions
                          ? `Reps: ${exercise.repetitions}`
                          : exercise.time
                          ? `Time: ${exercise.time}`
                          : 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* All Exercises Section */}
            <section style={{ 
              padding: 24, 
              border: '2px solid var(--c-2)', 
              borderRadius: 12, 
              background: 'rgba(255,255,255,0.03)',
              borderTop: '4px solid var(--c-3)'
            }}>
              <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: '1.5em' }}>All Exercises</h2>
              {exercises.length === 0 ? (
                <div style={{ padding: 16, color: 'var(--c-3)' }}>No exercises found</div>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {exercises.map((exercise) => (
                    <div
                      key={exercise.exerciseId}
                      style={{
                        padding: 16,
                        border: '1px solid var(--c-2)',
                        borderRadius: 8,
                        background: 'rgba(255,255,255,0.02)',
                      }}
                    >
                      <div>
                        <strong>{exercise.name}</strong>
                        {exercise.workoutProgramId && (
                          <span style={{ marginLeft: 8, fontSize: '0.85em', color: 'var(--c-3)' }}>
                            (Assigned to Program {exercise.workoutProgramId})
                          </span>
                        )}
                      </div>
                      {exercise.description && (
                        <div style={{ marginTop: 4, color: 'var(--c-3)' }}>
                          {exercise.description}
                        </div>
                      )}
                      <div style={{ marginTop: 8, fontSize: '0.9em', color: 'var(--c-3)' }}>
                        Sets: {exercise.sets || 'N/A'} |{' '}
                        {exercise.repetitions
                          ? `Reps: ${exercise.repetitions}`
                          : exercise.time
                          ? `Time: ${exercise.time}`
                          : 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Create Exercise Section */}
            <section style={{ 
              padding: 24, 
              border: '2px solid var(--c-2)', 
              borderRadius: 12, 
              background: 'rgba(255,255,255,0.03)',
              borderTop: '4px solid var(--c-3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: '1.5em' }}>Add Exercise to Program</h2>
                <button onClick={() => setShowForm(!showForm)}>
                  {showForm ? 'Cancel' : 'Create Exercise'}
                </button>
              </div>
              {showForm && (
                <div style={{ padding: 20, border: '1px solid var(--c-2)', borderRadius: 8, background: 'rgba(255,255,255,0.05)' }}>
                  <label style={{ display: 'block', marginBottom: 8 }}>
                    Select Program:
                    <select
                      value={selectedProgramId}
                      onChange={(e) => setSelectedProgramId(e.target.value)}
                      style={{ marginTop: 8 }}
                    >
                      <option value="">-- Select a program --</option>
                      {programs.map((p) => (
                        <option key={p.workoutProgramId} value={p.workoutProgramId}>
                          {p.name || `Program ${p.workoutProgramId}`}
                        </option>
                      ))}
                    </select>
                  </label>
                  {selectedProgramId && (
                    <div style={{ marginTop: 16 }}>
                      <ExerciseForm
                        programId={selectedProgramId}
                        onAdded={handleExerciseAdded}
                      />
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}

