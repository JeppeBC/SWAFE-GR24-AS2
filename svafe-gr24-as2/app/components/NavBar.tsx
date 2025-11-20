'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function NavBar() {
  const [open, setOpen] = useState(true);
  return (
    <aside className={`sidebar ${open ? 'open' : 'closed'}`}>
      <div className="brand">
        <strong>Group 24 - Fitness</strong>
        <button className="toggle" onClick={()=>setOpen(s=>!s)} aria-label="Toggle menu">☰</button>
      </div>
      <nav className="menu">
        <Link href="/">Home</Link>
        <Link href="/programs">Programs</Link>
        <Link href="/programs/create">Create Program</Link>
        <Link href="/createUsers">Create Users</Link>
        <Link href="/logIn">Log In</Link>
      </nav>
      <div className="sidebar-footer">Personal Trainer Dashboard</div>
    </aside>
  );
}

