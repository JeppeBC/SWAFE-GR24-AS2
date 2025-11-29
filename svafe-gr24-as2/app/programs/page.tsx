'use client';
import ProgramList from '@/app/components/ProgramList';
import Link from 'next/link';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { useAuth } from '@/app/contexts/AuthContext';

export default function Page(){
  const { hasRole } = useAuth();
  const isClient = hasRole('Client');
  
  return (
    <ProtectedRoute>
      <main style={{padding:16}}>
        <header style={{
          marginBottom: 32,
          paddingBottom: 16,
          borderBottom: '2px solid var(--c-2)'
        }}>
          <h1 style={{ margin: 0, fontSize: '2em', fontWeight: 'bold' }}>
            {isClient ? 'My Programs' : 'Programs'}
          </h1>
          <p style={{ margin: '8px 0 0 0', color: 'var(--c-3)', fontSize: '1.1em' }}>
            {isClient 
              ? 'View your assigned workout programs'
              : 'View and manage workout programs'
            }
          </p>
        </header>
        <section style={{ 
          padding: 24, 
          border: '2px solid var(--c-2)', 
          borderRadius: 12, 
          background: 'rgba(255,255,255,0.03)',
          borderTop: '4px solid var(--c-3)',
          marginBottom: 32
        }}>
          <ProgramList />
        </section>
        {hasRole('PersonalTrainer') && (
          <section style={{ 
            padding: 24, 
            border: '2px solid var(--c-2)', 
            borderRadius: 12, 
            background: 'rgba(255,255,255,0.03)',
            borderTop: '4px solid var(--c-3)',
            textAlign: 'center'
          }}>
            <Link href="/programs/create">
              <button style={{ fontSize: '1em', padding: '12px 24px' }}>Create New Program</button>
            </Link>
          </section>
        )}
      </main>
    </ProtectedRoute>
  );
}
