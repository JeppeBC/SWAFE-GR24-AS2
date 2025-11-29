'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import ProgramCard from '@/app/components/ProgramCard';
import { use } from 'react';

interface Props {
  params: Promise<{ id: string }> | { id: string };
}

export default function ClientProgramsPage({ params }: Props) {
  const resolvedParams = 'then' in params ? use(params) : params;
  const id = resolvedParams?.id;
  
  const [programs, setPrograms] = useState<any[]>([]);
  const [client, setClient] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || id === 'undefined') {
      setError('Invalid client ID');
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const clientData = await apiFetch(`/api/Users/${id}`);
        setClient(clientData);

        const data = await apiFetch(`/api/WorkoutPrograms/client/${id}`);
        setPrograms(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || 'Failed to load programs');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (!id || id === 'undefined') {
    return (
      <ProtectedRoute requiredRole="PersonalTrainer">
        <main style={{ padding: 16 }}>
          <div style={{ color: 'red' }}>Invalid client ID. Please go back and try again.</div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="PersonalTrainer">
      <main style={{ padding: 16 }}>
        <header style={{
          marginBottom: 32,
          paddingBottom: 16,
          borderBottom: '2px solid var(--c-2)'
        }}>
          <h1 style={{ margin: 0, fontSize: '2em', fontWeight: 'bold' }}>
            {client 
              ? `${client.firstName || ''} ${client.lastName || ''}`.trim() || 'Client Programs'
              : 'Client Programs'
            }
          </h1>
          <p style={{ margin: '8px 0 0 0', color: 'var(--c-3)', fontSize: '1.1em' }}>
            {client 
              ? `Workout programs for ${client.firstName || 'client'}`
              : `Workout programs for client ID: ${id}`
            }
          </p>
        </header>

        {loading && <div>Loading programs...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {!loading && !error && (
          <section style={{ 
            padding: 24, 
            border: '2px solid var(--c-2)', 
            borderRadius: 12, 
            background: 'rgba(255,255,255,0.03)',
            borderTop: '4px solid var(--c-3)'
          }}>
            {programs.length === 0 ? (
              <div style={{ padding: 16, color: 'var(--c-3)', textAlign: 'center' }}>
                No programs found for this client
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {programs.map((p) => (
                  <ProgramCard key={p.workoutProgramId} program={p} />
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </ProtectedRoute>
  );
}

