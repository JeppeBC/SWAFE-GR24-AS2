import ProgramDetail from '@/app/components/ProgramDetail';

interface Props { params: { id: string } }

export default function Page({ params }: Props){
  const { id } = params;
  return (
      <main style={{padding:16}}>
        <ProgramDetail programId={id} />
      </main>
  );
}
