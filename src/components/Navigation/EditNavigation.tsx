import { Navigation } from './Navigation';
import { useRelativeUrl } from './useRelativeUrl';

export const EditNavigation = () => {
  const viewUrl = useRelativeUrl('view');

  return (
    <Navigation>
      <div>
        <a href={viewUrl}>View</a>
      </div>
    </Navigation>
  );
};
