import { Skeleton, SkeletonCard } from '@pitkit';
import { css } from '../../../../../../styled-system/css';

export default function Loading() {
  return (
    <div className={css({ padding: 'page' })}>
      {/* Heading + subtitle */}
      <Skeleton height="28px" width="180px" />
      <Skeleton height="14px" width="140px" className={css({ marginTop: '1' })} />

      {/* Tab strip */}
      <div className={css({ display: 'flex', gap: '2', marginTop: 'section', marginBottom: 'section' })}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height="36px" width="90px" rounded />
        ))}
      </div>

      {/* Cards */}
      <div className={css({ display: 'flex', flexDirection: 'column', gap: 'card-gap' })}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
