'use client';
import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/app/contexts/AuthContext';

interface CreateUserFormProps {
  onUserCreated?: () => void;
}

export default function CreateUserForm({ onUserCreated }: CreateUserFormProps) {
  const { user, hasRole } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState(hasRole('PersonalTrainer') ? 'Client' : 'PersonalTrainer');
  const [personalTrainerId, setPersonalTrainerId] = useState<string|number | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const isPersonalTrainer = hasRole('PersonalTrainer');
  const isManager = hasRole('Manager');

  const getTrainerId = async (): Promise<number | null> => {
    const userId = user?.userId || 
                   user?.id || 
                   user?.sub || 
                   user?.nameid ||
                   user?.UserId ||
                   user?.Id;
    
    if (userId) return Number(userId);
    
    if (user?.email) {
      try {
        const allUsers = await apiFetch('/api/Users');
        const currentUser = Array.isArray(allUsers) 
          ? allUsers.find((u: any) => u.email === user.email)
          : null;
        
        if (currentUser?.userId) {
          return currentUser.userId;
        }
      } catch (err) {
      }
    }
    
    return null;
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const body: any = { firstName, lastName, email, password, accountType };
      
      if (isPersonalTrainer && accountType === 'Client') {
        const trainerId = await getTrainerId();
        if (trainerId) {
          body.personalTrainerId = trainerId;
        }
      } else if (personalTrainerId) {
        body.personalTrainerId = Number(personalTrainerId);
      }
      
      await apiFetch('/api/Users', { method: 'POST', body: JSON.stringify(body) });
      setMsg('User created successfully');
      setFirstName(''); 
      setLastName(''); 
      setEmail(''); 
      setPassword(''); 
      setAccountType(hasRole('PersonalTrainer') ? 'Client' : 'PersonalTrainer');
      setPersonalTrainerId(null);
      
      if (onUserCreated) {
        setTimeout(() => {
          onUserCreated();
        }, 500);
      }
    } catch (err: any) {
      setMsg(err.message || 'Failed to create user');
    } finally { 
      setLoading(false); 
    }
  }

  return (
    <form onSubmit={submit} style={{display:'grid',gap:8,maxWidth:640}}>
      <label>First name<input value={firstName} onChange={e=>setFirstName(e.target.value)} required /></label>
      <label>Last name<input value={lastName} onChange={e=>setLastName(e.target.value)} required /></label>
      <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" required /></label>
      <label>Password<input value={password} onChange={e=>setPassword(e.target.value)} type="password" required /></label>
      <label>Account type
        <select 
          value={accountType} 
          onChange={e=>setAccountType(e.target.value)}
          disabled={isPersonalTrainer}
        >
          {isManager && <option value="PersonalTrainer">Personal Trainer</option>}
          <option value="Client">Client</option>
        </select>
      </label>
      {isManager && accountType === 'Client' && (
        <label>Personal trainer id (optional)
          <input 
            value={personalTrainerId ?? ''} 
            onChange={e=>setPersonalTrainerId(e.target.value ? Number(e.target.value) : null)} 
            placeholder="trainer id" 
          />
        </label>
      )}
      {isPersonalTrainer && accountType === 'Client' && (
        <div style={{padding:8,background:'rgba(255,255,255,0.1)',borderRadius:6,fontSize:'0.9em',color:'var(--page-foreground)'}}>
          This client will be assigned to you automatically.
        </div>
      )}
      <div><button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create User'}</button></div>
      {msg && <div>{msg}</div>}
    </form>
  );
}
