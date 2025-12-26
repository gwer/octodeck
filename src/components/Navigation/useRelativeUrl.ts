import { useLocationHash } from './useLocationHash';

/**
 * In development environment Bun runtime doesn't support trailing slashes.
 * In production we use GitHub Pages which forces trailing slashes.
 */

export const useRelativeUrl = (path: string) => {
  const hash = useLocationHash();
  const isTrailingSlashExists = location.pathname.endsWith('/');

  if (isTrailingSlashExists) {
    return `../${path}/${hash}`;
  }

  return `./${path}${hash}`;
};
