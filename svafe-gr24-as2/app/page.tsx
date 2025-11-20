import Link from 'next/link';

export default function HomePage(){
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome to SWAFE Fitness</h1>
        <p>Personal trainer tools and client programs in one place.</p>
      </header>

      <section className="dashboard-grid">
        <Link href="/programs" className="card">
          <h3>Programs</h3>
          <p>View all workout programs</p>
        </Link>

        <Link href="/programs/create" className="card">
          <h3>Create Program</h3>
          <p>Create a workout program for a client</p>
        </Link>

        <Link href="/createUsers" className="card">
          <h3>Create Users</h3>
          <p>Create managers, trainers, and clients</p>
        </Link>

        <Link href="/logIn" className="card">
          <h3>Log In</h3>
          <p>Sign in to access protected features</p>
        </Link>
      </section>
    </div>
  );
}
