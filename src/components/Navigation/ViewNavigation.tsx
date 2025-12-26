import { Navigation } from './Navigation';
import { useLocationHash } from './useLocationHash';

export const ViewNavigation = () => {
  const hash = useLocationHash();
  const editUrl = `../edit${hash}`;

  return (
    <Navigation>
      <div>
        <a href={editUrl}>Edit</a>
      </div>
    </Navigation>
  );
};
