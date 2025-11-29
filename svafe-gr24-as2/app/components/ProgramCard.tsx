'use client';
import Link from 'next/link';

export default function ProgramCard({ program }: { program: any }) {
  const id = program.workoutProgramId ?? program.id ?? program.workoutProgramID ?? program.WorkoutProgramId;
  
  if (!id) {
    return (
      <div style={{border:'1px solid #ddd',padding:12,borderRadius:6, color:'red'}}>
        <h3>{program.name || 'Unknown Program'}</h3>
        <p>Error: Program ID not found</p>
      </div>
    );
  }
  
  return (
    <div style={{border:'1px solid var(--c-2)',padding:16,borderRadius:8,background:'rgba(255,255,255,0.02)'}}>
      <h3>{program.name || 'Unnamed Program'}</h3>
      {program.description && <p style={{color:'var(--c-3)',marginTop:8}}>{program.description}</p>}
      <div style={{marginTop:12}}>
        <Link href={`/programs/${id}`} style={{color:'var(--c-3)'}}>View program →</Link>
      </div>
    </div>
  );
}
