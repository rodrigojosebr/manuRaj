import { Skeleton, SkeletonCard } from '@pitkit';
import { css } from '../../../../../../styled-system/css';

export default function Loading() {
  return (
    <div className={css({ padding: 'page' })}>
      {/* Heading + subtitle */}
      <Skeleton height="28px" width="160px" />
      <Skeleton height="14px" width="220px" className={css({ marginTop: '1' })} />

      {/* Form sections */}
      <div className={css({ marginTop: 'section', display: 'flex', flexDirection: 'column', gap: 'section' })}>
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
