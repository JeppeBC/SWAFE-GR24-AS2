import LoginForm from '@/app/components/LoginForm';

export default function Page() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'var(--page-bg)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 480,
        padding: 48,
        border: '2px solid var(--c-2)',
        borderRadius: 16,
        background: 'rgba(255,255,255,0.03)',
        borderTop: '4px solid var(--c-3)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
      }}>
        <header style={{
          marginBottom: 32,
          textAlign: 'center'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '2.5em',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, var(--c-4), var(--c-3))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 8
          }}>
            Welcome to SWAFE Fitness
          </h1>
          <p style={{
            margin: '8px 0 0 0',
            color: 'var(--c-3)',
            fontSize: '1.1em'
          }}>
            Sign in to access your workout programs
          </p>
        </header>
        <LoginForm />
      </div>
    </main>
  );
}