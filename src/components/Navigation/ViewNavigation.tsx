import { Navigation } from './Navigation';

export const ViewNavigation = () => {
  const editUrl = `/v1/edit${window.location.hash}`;

  return (
    <Navigation>
      <div>
        <a href={editUrl}>Edit</a>
      </div>
    </Navigation>
  );
};
