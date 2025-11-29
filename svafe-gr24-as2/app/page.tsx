'use client';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function HomePage(){
  const { isAuthenticated, hasRole, user } = useAuth();
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user?.email) {
      setLoading(false);
      return;
    }

    const userId = user.userId || 
                   user.id || 
                   user.sub || 
                   user.nameid ||
                   user.UserId ||
                   user.Id;

    (async () => {
      try {
        let currentUser: any = null;

        if (userId) {
          try {
            currentUser = await apiFetch(`/api/Users/${userId}`);
          } catch (err) {
          }
        }

        if (!currentUser) {
          const allUsers = await apiFetch('/api/Users');
          currentUser = Array.isArray(allUsers) 
            ? allUsers.find((u: any) => u.email === user.email)
            : null;
        }
        
        if (currentUser) {
          if (currentUser.firstName && currentUser.lastName) {
            setUserName(`${currentUser.firstName} ${currentUser.lastName}`);
          } else if (currentUser.firstName) {
            setUserName(currentUser.firstName);
          } else {
            setUserName(user.email?.split('@')[0] || 'User');
          }
        } else {
          setUserName(user.email?.split('@')[0] || 'User');
        }
      } catch (err) {
        setUserName(user.email?.split('@')[0] || 'User');
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated, user]);

  const displayName = userName || user?.firstName || user?.email?.split('@')[0] || 'User';
  
  return (
    <div className="dashboard">
      <header className="dashboard-header" style={{
        padding: '32px 0',
        marginBottom: 32,
        borderBottom: '2px solid var(--c-2)'
      }}>
        {isAuthenticated ? (
          <>
            <h1 style={{ 
              margin: 0, 
              fontSize: '3em', 
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, var(--c-4), var(--c-3))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Welcome {loading ? '...' : displayName}
            </h1>
            <p style={{ 
              margin: '16px 0 0 0', 
              color: 'var(--c-3)', 
              fontSize: '1.2em' 
            }}>
              Manage your workout programs and fitness journey
            </p>
          </>
        ) : (
          <>
            <h1 style={{ 
              margin: 0, 
              fontSize: '3em', 
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, var(--c-4), var(--c-3))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Welcome to SWAFE Fitness
            </h1>
            <p style={{ 
              margin: '16px 0 0 0', 
              color: 'var(--c-3)', 
              fontSize: '1.2em' 
            }}>
              Please log in to access your workout programs and tools
            </p>
          </>
        )}
      </header>

      {isAuthenticated ? (
        <section className="dashboard-grid">
          {!hasRole('Manager') && (
            <Link href="/programs" className="card">
              <h3>Programs</h3>
              <p>View all workout programs</p>
            </Link>
          )}

          {hasRole('PersonalTrainer') && (
            <>
              <Link href="/exercises" className="card">
                <h3>Exercises</h3>
                <p>Manage exercises and add them to programs</p>
              </Link>
              <Link href="/clients" className="card">
                <h3>Clients</h3>
                <p>View and manage your clients</p>
              </Link>
            </>
          )}

          {hasRole('Manager') && (
            <Link href="/users" className="card">
              <h3>Users</h3>
              <p>View and manage all users</p>
            </Link>
          )}
        </section>
      ) : (
        <section className="dashboard-grid">
          <Link href="/logIn" className="card">
            <h3>Log In</h3>
            <p>Sign in to access protected features</p>
          </Link>
        </section>
      )}
    </div>
  );
}
