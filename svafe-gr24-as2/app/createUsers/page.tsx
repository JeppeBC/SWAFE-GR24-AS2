'use client';
import CreateUserForm from '@/app/components/CreateUserForm';
import ProtectedRoute from '@/app/components/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute requiredRole={['Manager', 'PersonalTrainer']}>
      <main style={{padding:16}}>
        <h1>Create Users</h1>
        <CreateUserForm />
      </main>
    </ProtectedRoute>
  );
}