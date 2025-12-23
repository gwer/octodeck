import { useSyncExternalStore } from 'preact/compat';
import { Navigation } from './Navigation';
import { hashSubscribe } from './hashStore';

export const EditNavigation = () => {
  const hash = useSyncExternalStore(hashSubscribe, () => window.location.hash);
  const viewUrl = `/v1/view${hash}`;

  return (
    <Navigation>
      <div>
        <a href={viewUrl}>View</a>
      </div>
    </Navigation>
  );
};
