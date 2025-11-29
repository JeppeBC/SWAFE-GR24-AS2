'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { apiFetch } from '@/lib/api';

export default function NavBar() {
  const [open, setOpen] = useState(true);
  const { isAuthenticated, user, logout, hasRole, accountType } = useAuth();
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const idFromJWT = user?.userId || 
                      user?.id || 
                      user?.sub || 
                      user?.nameid ||
                      user?.UserId ||
                      user?.Id;
    
    if (idFromJWT) {
      setUserId(Number(idFromJWT));
    } else if (isAuthenticated && user?.email) {
      (async () => {
        try {
          const allUsers = await apiFetch('/api/Users');
          const currentUser = Array.isArray(allUsers) 
            ? allUsers.find((u: any) => u.email === user.email)
            : null;
          
          if (currentUser?.userId) {
            setUserId(currentUser.userId);
          }
        } catch (err) {
        }
      })();
    }
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    logout();
    router.push('/logIn');
  };

  const getRoleDisplayName = () => {
    if (!accountType) return 'Guest';
    const role = accountType;
    if (role.toLowerCase() === 'personaltrainer') return 'Personal Trainer';
    if (role.toLowerCase() === 'manager') return 'Manager';
    if (role.toLowerCase() === 'client') return 'Client';
    return role;
  };

  const getUserDisplayName = () => {
    if (!user) return 'Guest';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };


  return (
    <aside className={`sidebar ${open ? 'open' : 'closed'}`}>
      <div className="brand">
        <strong>Group 24 - Fitness</strong>
        <button className="toggle" onClick={()=>setOpen(s=>!s)} aria-label="Toggle menu">{open ? '«' : '»'}</button>
      </div>
      <nav className="menu">
        <Link href="/" className="menu-item" aria-label="Home">
          <span className="icon" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 11.5L12 4l9 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 21V12h14v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          <span className="label">Home</span>
        </Link>

        {isAuthenticated && (
          <>
            {!hasRole('Manager') && (
              <Link href="/programs" className="menu-item" aria-label="Programs">
                <span className="icon" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <span className="label">Programs</span>
              </Link>
            )}
            {hasRole('PersonalTrainer') && (
              <Link href="/exercises" className="menu-item" aria-label="Exercises">
                <span className="icon" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <span className="label">Exercises</span>
              </Link>
            )}

            {hasRole('Manager') && (
              <Link href="/users" className="menu-item" aria-label="Users">
                <span className="icon" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <span className="label">Users</span>
              </Link>
            )}

            {hasRole('PersonalTrainer') && (
              <Link href="/clients" className="menu-item" aria-label="Clients">
                <span className="icon" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <span className="label">Clients</span>
              </Link>
            )}
          </>
        )}

        {!isAuthenticated ? (
          <Link href="/logIn" className="menu-item" aria-label="Log In">
            <span className="icon" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 10v6a2 2 0 0 1-2 2h-4v-4H7v-6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 14v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <span className="label">Log In</span>
          </Link>
        ) : (
          <button onClick={handleLogout} className="menu-item" aria-label="Log Out" style={{border:'none',background:'transparent',cursor:'pointer',textAlign:'left',width:'100%',padding:0}}>
            <span className="icon" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <span className="label">Log Out</span>
          </button>
        )}
      </nav>
      <div className="sidebar-footer">
        {isAuthenticated ? (
          <div style={{fontSize:'0.85em'}}>
            <div style={{fontWeight:'bold'}}>{getUserDisplayName()}</div>
            <div style={{opacity:0.8}}>{getRoleDisplayName()}</div>
            {userId && (
              <div style={{opacity:0.7, fontSize:'0.9em', marginTop:4}}>ID: {userId}</div>
            )}
          </div>
        ) : (
          'Guest'
        )}
      </div>
    </aside>
  );
}

