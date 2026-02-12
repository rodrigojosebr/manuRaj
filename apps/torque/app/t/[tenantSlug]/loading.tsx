import { Skeleton, SkeletonCard } from '@pitkit';
import { css } from '../../../../../styled-system/css';

export default function Loading() {
  return (
    <div className={css({ padding: 'page' })}>
      {/* Greeting */}
      <Skeleton height="28px" width="200px" />
      <Skeleton height="24px" width="100px" className={css({ marginTop: '2' })} rounded />

      {/* Stats grid */}
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'card-gap',
          marginTop: 'section',
        })}
      >
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height="80px" />
        ))}
      </div>

      {/* Recent WOs section */}
      <div
        className={css({
          marginTop: 'section',
          display: 'flex',
          flexDirection: 'column',
          gap: 'card-gap',
        })}
      >
        <Skeleton height="20px" width="160px" />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Preventive plans section */}
      <div
        className={css({
          marginTop: 'section',
          display: 'flex',
          flexDirection: 'column',
          gap: 'card-gap',
        })}
      >
        <Skeleton height="20px" width="200px" />
        <Skeleton height="56px" />
        <Skeleton height="56px" />
      </div>
    </div>
  );
}
