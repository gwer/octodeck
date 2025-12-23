import { useSyncExternalStore } from 'preact/compat';
import { Navigation } from './Navigation';
import { hashSubscribe } from './hashStore';

export const ViewNavigation = () => {
  const hash = useSyncExternalStore(hashSubscribe, () => window.location.hash);
  const editUrl = `/v1/edit${hash}`;

  return (
    <Navigation>
      <div>
        <a href={editUrl}>Edit</a>
      </div>
    </Navigation>
  );
};
