'use client';
import ProgramDetail from '@/app/components/ProgramDetail';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { use } from 'react';

interface Props { 
  params: Promise<{ id: string }> | { id: string };
}

export default function Page({ params }: Props){
  const resolvedParams = 'then' in params ? use(params) : params;
  const id = resolvedParams?.id;
  
  if (!id || id === 'undefined') {
    return (
      <ProtectedRoute>
        <main style={{padding:16}}>
          <div style={{color:'red'}}>Invalid program ID. Please go back and try again.</div>
        </main>
      </ProtectedRoute>
    );
  }
  
  return (
    <ProtectedRoute>
      <main style={{padding:16}}>
        <ProgramDetail programId={String(id)} />
      </main>
    </ProtectedRoute>
  );
}
