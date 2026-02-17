import { Skeleton, SkeletonCard } from '@pitkit';
import { styled } from '../../../../../../styled-system/jsx';

const Page = styled('div', { base: { padding: 'page' } });
const SkeletonMt1 = styled(Skeleton, { base: { marginTop: '1' } });
const FormSections = styled('div', {
  base: { marginTop: 'section', display: 'flex', flexDirection: 'column', gap: 'section' },
});

export default function Loading() {
  return (
    <Page>
      <Skeleton height="28px" width="160px" />
      <SkeletonMt1 height="14px" width="220px" />

      <FormSections>
        <SkeletonCard />
        <SkeletonCard />
      </FormSections>
    </Page>
  );
}
