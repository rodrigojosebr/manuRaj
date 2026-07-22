import { Skeleton } from '@pitkit';
import { styled } from '../../../../../../styled-system/jsx';

const Page = styled('div', { base: { padding: 'page' } });
const SkeletonMt1 = styled(Skeleton, { base: { marginTop: '1' } });
const FormFields = styled('div', {
  base: { marginTop: 'section', display: 'flex', flexDirection: 'column', gap: 'field-gap' },
});

export default function Loading() {
  return (
    <Page>
      <Skeleton height="28px" width="200px" />
      <SkeletonMt1 height="14px" width="280px" />

      <FormFields>
        <div>
          <Skeleton height="14px" width="80px" />
          <SkeletonMt1 height="40px" />
        </div>
        <div>
          <Skeleton height="14px" width="80px" />
          <SkeletonMt1 height="40px" />
        </div>
        <div>
          <Skeleton height="14px" width="140px" />
          <SkeletonMt1 height="100px" />
        </div>
        <Skeleton height="44px" />
      </FormFields>
    </Page>
  );
}
