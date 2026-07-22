import { Skeleton, SkeletonCard } from '@pitkit';
import { styled } from '../../../../../styled-system/jsx';

const Page = styled('div', { base: { padding: 'page' } });
const StatsGrid = styled('div', {
  base: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'card-gap', marginTop: 'section' },
});
const Section = styled('div', {
  base: { marginTop: 'section', display: 'flex', flexDirection: 'column', gap: 'card-gap' },
});
const Mt2 = styled('div', { base: { marginTop: '2' } });

export default function Loading() {
  return (
    <Page>
      {/* Greeting */}
      <Skeleton height="28px" width="200px" />
      <Mt2><Skeleton height="24px" width="100px" rounded /></Mt2>

      {/* Stats grid */}
      <StatsGrid>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height="80px" />
        ))}
      </StatsGrid>

      {/* Recent WOs section */}
      <Section>
        <Skeleton height="20px" width="160px" />
        <SkeletonCard />
        <SkeletonCard />
      </Section>

      {/* Preventive plans section */}
      <Section>
        <Skeleton height="20px" width="200px" />
        <Skeleton height="56px" />
        <Skeleton height="56px" />
      </Section>
    </Page>
  );
}
