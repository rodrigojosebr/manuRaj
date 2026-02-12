import { Skeleton } from '@pitkit';
import { css } from '../../../../../../../styled-system/css';

export default function Loading() {
  return (
    <div className={css({ padding: 'page' })}>
      {/* Back link */}
      <Skeleton height="16px" width="80px" />

      {/* Title */}
      <Skeleton height="28px" width="250px" className={css({ marginTop: '4' })} />

      {/* Badges */}
      <div className={css({ display: 'flex', gap: '2', marginTop: '2' })}>
        <Skeleton height="24px" width="80px" rounded />
        <Skeleton height="24px" width="80px" rounded />
        <Skeleton height="24px" width="80px" rounded />
      </div>

      {/* Info sections */}
      <div className={css({ marginTop: 'section', display: 'flex', flexDirection: 'column', gap: '3' })}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height="48px" />
        ))}
      </div>
    </div>
  );
}
