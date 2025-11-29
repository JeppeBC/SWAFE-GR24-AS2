'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import CreateUserForm from '@/app/components/CreateUserForm';

interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  accountType: string;
  personalTrainerId?: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const loadUsers = async () => {
    try {
      const data = await apiFetch('/api/Users');
      setUsers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleUserCreated = () => {
    loadUsers();
    setShowCreateForm(false);
  };

  const getRoleDisplayName = (role: string) => {
    if (role === 'PersonalTrainer') return 'Personal Trainer';
    if (role === 'Manager') return 'Manager';
    return role;
  };

  return (
    <ProtectedRoute requiredRole="Manager">
      <main style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1>Users</h1>
          <button onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Cancel' : 'Create New User'}
          </button>
        </div>

        {showCreateForm && (
          <div style={{ marginBottom: 24, padding: 16, border: '1px solid var(--c-2)', borderRadius: 8, background: 'rgba(255,255,255,0.05)' }}>
            <h2 style={{ marginTop: 0 }}>Create New User</h2>
            <CreateUserForm onUserCreated={handleUserCreated} />
          </div>
        )}

        {loading && <div>Loading users...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        
        {!loading && !error && (
          <div style={{ display: 'grid', gap: 12 }}>
            {users.length === 0 ? (
              <div>No users found</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ccc' }}>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Email</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Role</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Trainer ID</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.userId} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '8px' }}>
                        {user.firstName} {user.lastName}
                      </td>
                      <td style={{ padding: '8px' }}>{user.email}</td>
                      <td style={{ padding: '8px' }}>{getRoleDisplayName(user.accountType)}</td>
                      <td style={{ padding: '8px' }}>
                        {user.personalTrainerId || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}

