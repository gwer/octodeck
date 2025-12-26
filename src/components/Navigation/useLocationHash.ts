import { useEffect, useState } from 'preact/hooks';

export const useLocationHash = () => {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handler = () => {
      setHash(window.location.hash);
    };

    window.addEventListener('hashchange', handler);

    return () => window.removeEventListener('hashchange', handler);
  }, []);

  return hash;
};
