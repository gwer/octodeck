import { useLocationHash } from './useLocationHash';

export const useRelativeUrl = (path: string) => {
  const hash = useLocationHash();

  return `../${path}/${hash}`;
};
