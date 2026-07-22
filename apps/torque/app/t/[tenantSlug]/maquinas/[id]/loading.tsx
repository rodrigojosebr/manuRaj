import { Skeleton } from '@pitkit';
import { styled } from '../../../../../../../styled-system/jsx';

const Page = styled('div', { base: { padding: 'page' } });
const SkeletonMt4 = styled(Skeleton, { base: { marginTop: '4' } });
const BadgesRow = styled('div', { base: { display: 'flex', gap: '2', marginTop: '2' } });
const InfoSection = styled('div', {
  base: { marginTop: 'section', display: 'flex', flexDirection: 'column', gap: '3' },
});

export default function Loading() {
  return (
    <Page>
      <Skeleton height="16px" width="80px" />
      <SkeletonMt4 height="28px" width="250px" />

      <BadgesRow>
        <Skeleton height="24px" width="80px" rounded />
        <Skeleton height="24px" width="80px" rounded />
      </BadgesRow>

      <InfoSection>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height="48px" />
        ))}
      </InfoSection>
    </Page>
  );
}
