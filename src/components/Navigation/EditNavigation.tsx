import { Navigation } from './Navigation';
import { useLocationHash } from './useLocationHash';

export const EditNavigation = () => {
  const hash = useLocationHash();
  const viewUrl = `../view${hash}`;

  return (
    <Navigation>
      <div>
        <a href={viewUrl}>View</a>
      </div>
    </Navigation>
  );
};
