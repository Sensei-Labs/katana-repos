import dynamic from 'next/dynamic';
import FilterTreasuriesHeader from '@/Components/Molecules/FilterHeader';
import Title from '@/Components/Atoms/Title';

const ProjectsAll = dynamic(
  () => import('@/Components/Organisms/ProjectsAll'),
  { ssr: false }
);

const Treasuries = () => {
  return (
    <div>
      <Title
        className="mt-8"
        fontFamily="font-sans"
        fontSize="2.5rem"
        level="h1"
      >
        Projects
      </Title>

      <FilterTreasuriesHeader />

      <ProjectsAll />
    </div>
  );
};

export default Treasuries;
