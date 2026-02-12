import { Skeleton } from '@pitkit';
import { css } from '../../../../../../styled-system/css';

export default function Loading() {
  return (
    <div className={css({ padding: 'page' })}>
      {/* Heading + subtitle */}
      <Skeleton height="28px" width="200px" />
      <Skeleton height="14px" width="280px" className={css({ marginTop: '1' })} />

      {/* Form fields */}
      <div className={css({ marginTop: 'section', display: 'flex', flexDirection: 'column', gap: 'field-gap' })}>
        <div>
          <Skeleton height="14px" width="80px" />
          <Skeleton height="40px" className={css({ marginTop: '1' })} />
        </div>
        <div>
          <Skeleton height="14px" width="80px" />
          <Skeleton height="40px" className={css({ marginTop: '1' })} />
        </div>
        <div>
          <Skeleton height="14px" width="140px" />
          <Skeleton height="100px" className={css({ marginTop: '1' })} />
        </div>
        <Skeleton height="44px" />
      </div>
    </div>
  );
}
