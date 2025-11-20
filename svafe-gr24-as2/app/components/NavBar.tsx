'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function NavBar() {
  const [open, setOpen] = useState(true);
  return (
    <aside className={`sidebar ${open ? 'open' : 'closed'}`}>
      <div className="brand">
        <strong>Group 24 - Fitness</strong>
        <button className="toggle" onClick={()=>setOpen(s=>!s)} aria-label="Toggle menu">{open ? '«' : '»'}</button>
      </div>
      <nav className="menu">
        <Link href="/" className="menu-item" aria-label="Home">
          <span className="icon" aria-hidden>
            {/* Home icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 11.5L12 4l9 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 21V12h14v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          <span className="label">Home</span>
        </Link>

        <Link href="/programs" className="menu-item" aria-label="Programs">
          <span className="icon" aria-hidden>
            {/* Programs / list icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          <span className="label">Programs</span>
        </Link>

        <Link href="/programs/create" className="menu-item" aria-label="Create Program">
          <span className="icon" aria-hidden>
            {/* Plus / create icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          <span className="label">Create Program</span>
        </Link>

        <Link href="/createUsers" className="menu-item" aria-label="Create Users">
          <span className="icon" aria-hidden>
            {/* User icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          <span className="label">Create Users</span>
        </Link>

        <Link href="/logIn" className="menu-item" aria-label="Log In">
          <span className="icon" aria-hidden>
            {/* Key / login icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 10v6a2 2 0 0 1-2 2h-4v-4H7v-6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 14v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          <span className="label">Log In</span>
        </Link>
      </nav>
      <div className="sidebar-footer">Personal Trainer Dashboard</div>
    </aside>
  );
}

