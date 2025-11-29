'use client';
import ProgramForm from '@/app/components/ProgramForm';
import ProtectedRoute from '@/app/components/ProtectedRoute';

export default function Page(){
  return (
    <ProtectedRoute requiredRole="PersonalTrainer">
      <main style={{padding:16}}>
        <h1>Create Program</h1>
        <ProgramForm />
      </main>
    </ProtectedRoute>
  );
}
