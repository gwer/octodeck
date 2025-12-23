import { Navigation } from './Navigation';

export const EditNavigation = () => {
  const viewUrl = `/v1/view${window.location.hash}`;

  return (
    <Navigation>
      <div>
        <a href={viewUrl}>View</a>
      </div>
    </Navigation>
  );
};
