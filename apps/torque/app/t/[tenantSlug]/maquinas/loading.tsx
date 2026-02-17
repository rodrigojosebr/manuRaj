import { Skeleton, SkeletonCard } from '@pitkit';
import { styled } from '../../../../../../styled-system/jsx';

const Page = styled('div', { base: { padding: 'page' } });
const SkeletonMt1 = styled(Skeleton, { base: { marginTop: '1' } });
const TabStrip = styled('div', {
  base: { display: 'flex', gap: '2', marginTop: 'section', marginBottom: 'section' },
});
const CardList = styled('div', {
  base: { display: 'flex', flexDirection: 'column', gap: 'card-gap' },
});

export default function Loading() {
  return (
    <Page>
      <Skeleton height="28px" width="180px" />
      <SkeletonMt1 height="14px" width="140px" />

      <TabStrip>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height="36px" width="90px" rounded />
        ))}
      </TabStrip>

      <CardList>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </CardList>
    </Page>
  );
}
