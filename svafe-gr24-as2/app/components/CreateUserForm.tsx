'use client';
import { useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function CreateUserForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('Client');
  const [personalTrainerId, setPersonalTrainerId] = useState<string|number | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      // CreateUserDto per Swagger: firstName, lastName, email, password, accountType, optional personalTrainerId
      const body: any = { firstName, lastName, email, password, accountType };
      if (personalTrainerId) body.personalTrainerId = Number(personalTrainerId);
      await apiFetch('/api/Users', { method: 'POST', body: JSON.stringify(body) });
      setMsg('User created');
      setFirstName(''); setLastName(''); setEmail(''); setPassword(''); setAccountType('Client'); setPersonalTrainerId(null);
    } catch (err: any) {
      setMsg(err.message || 'Failed');
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit} style={{maxWidth:640,display:'grid',gap:8}}>
      <label>First name<input value={firstName} onChange={e=>setFirstName(e.target.value)} required /></label>
      <label>Last name<input value={lastName} onChange={e=>setLastName(e.target.value)} required /></label>
      <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" required /></label>
      <label>Password<input value={password} onChange={e=>setPassword(e.target.value)} type="password" required /></label>
      <label>Account type
        <select value={accountType} onChange={e=>setAccountType(e.target.value)}>
          <option value="Manager">Manager</option>
          <option value="PersonalTrainer">PersonalTrainer</option>
          <option value="Client">Client</option>
        </select>
      </label>
      <label>Personal trainer id (optional)<input value={personalTrainerId ?? ''} onChange={e=>setPersonalTrainerId(e.target.value ? Number(e.target.value) : null)} placeholder="trainer id" /></label>
      <div><button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create User'}</button></div>
      {msg && <div>{msg}</div>}
    </form>
  );
}
