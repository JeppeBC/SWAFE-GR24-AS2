'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import CreateUserForm from '@/app/components/CreateUserForm';

interface Client {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  accountType: string;
  personalTrainerId?: number;
}

export default function ClientsPage() {
  const [myClients, setMyClients] = useState<Client[]>([]);
  const [unassignedClients, setUnassignedClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const loadClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const myClientsData = await apiFetch('/api/Users/Clients');
      setMyClients(Array.isArray(myClientsData) ? myClientsData : []);

      const allUsersData = await apiFetch('/api/Users');
      const allUsers = Array.isArray(allUsersData) ? allUsersData : [];
      const unassigned = allUsers.filter(
        (u: Client) => u.accountType === 'Client' && !u.personalTrainerId
      );
      setUnassignedClients(unassigned);
    } catch (err: any) {
      setError(err.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleUserCreated = () => {
    loadClients();
    setShowCreateForm(false);
  };

  return (
    <ProtectedRoute requiredRole="PersonalTrainer">
      <main style={{ padding: 16 }}>
        <header style={{
          marginBottom: 32,
          paddingBottom: 16,
          borderBottom: '2px solid var(--c-2)'
        }}>
          <h1 style={{ margin: 0, fontSize: '2em', fontWeight: 'bold' }}>Clients</h1>
          <p style={{ margin: '8px 0 0 0', color: 'var(--c-3)', fontSize: '1.1em' }}>
            Manage your clients and assign new ones to your account
          </p>
        </header>

        {loading && <div>Loading clients...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}

        {!loading && !error && (
          <div style={{ display: 'grid', gap: 32 }}>
            <section style={{ 
              padding: 24, 
              border: '2px solid var(--c-2)', 
              borderRadius: 12, 
              background: 'rgba(255,255,255,0.03)',
              borderTop: '4px solid var(--c-3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: '1.5em' }}>Create New Client</h2>
                <button onClick={() => setShowCreateForm(!showCreateForm)}>
                  {showCreateForm ? 'Cancel' : 'Create Client'}
                </button>
              </div>
              {showCreateForm && (
                <div style={{ padding: 20, border: '1px solid var(--c-2)', borderRadius: 8, background: 'rgba(255,255,255,0.05)' }}>
                  <CreateUserForm onUserCreated={handleUserCreated} />
                </div>
              )}
            </section>

            <section style={{ 
              padding: 24, 
              border: '2px solid var(--c-2)', 
              borderRadius: 12, 
              background: 'rgba(255,255,255,0.03)',
              borderTop: '4px solid var(--c-3)'
            }}>
              <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: '1.5em' }}>My Clients</h2>
              {myClients.length === 0 ? (
                <div style={{ padding: 16, color: 'var(--c-3)' }}>No clients assigned to you</div>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {myClients.map((client) => (
                    <div
                      key={client.userId}
                      style={{
                        padding: 16,
                        border: '1px solid var(--c-2)',
                        borderRadius: 8,
                        background: 'rgba(255,255,255,0.02)',
                        display: 'grid',
                        gap: 8,
                      }}
                    >
                      <div>
                        <strong>
                          {client.firstName} {client.lastName}
                        </strong>
                        <span style={{ marginLeft: 8, color: 'var(--c-3)', fontSize: '0.9em' }}>
                          (ID: {client.userId})
                        </span>
                      </div>
                      <div style={{ color: 'var(--c-3)' }}>Email: {client.email}</div>
                      <div>
                        <Link href={`/programs/client/${client.userId}`} style={{ color: 'var(--c-3)' }}>
                          View Programs →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section style={{ 
              padding: 24, 
              border: '2px solid var(--c-2)', 
              borderRadius: 12, 
              background: 'rgba(255,255,255,0.03)',
              borderTop: '4px solid var(--c-3)'
            }}>
              <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: '1.5em' }}>Unassigned Clients</h2>
              {unassignedClients.length === 0 ? (
                <div style={{ padding: 16, color: 'var(--c-3)' }}>No unassigned clients available</div>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {unassignedClients.map((client) => (
                    <div
                      key={client.userId}
                      style={{
                        padding: 16,
                        border: '1px solid var(--c-2)',
                        borderRadius: 8,
                        background: 'rgba(255,255,255,0.02)',
                        display: 'grid',
                        gap: 8,
                      }}
                    >
                      <div>
                        <strong>
                          {client.firstName} {client.lastName}
                        </strong>
                        <span style={{ marginLeft: 8, color: 'var(--c-3)', fontSize: '0.9em' }}>
                          (ID: {client.userId})
                        </span>
                      </div>
                      <div style={{ color: 'var(--c-3)' }}>Email: {client.email}</div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}

