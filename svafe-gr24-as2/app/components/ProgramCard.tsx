'use client';
import Link from 'next/link';

export default function ProgramCard({ program }: { program: any }) {
  const id = program.workoutProgramId ?? program.id ?? program.workoutProgramID;
  return (
    <div style={{border:'1px solid #ddd',padding:12,borderRadius:6}}>
      <h3>{program.name}</h3>
      <p>{program.description}</p>
      <div><Link href={`/programs/${id}`}>View program</Link></div>
    </div>
  );
}
