import { Navigation } from './Navigation';
import { useRelativeUrl } from './useRelativeUrl';

export const ViewNavigation = () => {
  const editUrl = useRelativeUrl('edit');

  return (
    <Navigation>
      <div>
        <a href={editUrl}>Edit</a>
      </div>
    </Navigation>
  );
};
