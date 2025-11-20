import ProgramList from '@/app/components/ProgramList';
import Link from 'next/link';

export default function Page(){
  return (
      <main style={{padding:16}}>
        <h1>Programs</h1>
        <div style={{marginBottom:12}}><Link href="/programs/create">Create new program</Link></div>
        <ProgramList />
      </main>
  );
}
