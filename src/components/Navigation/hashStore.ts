export const hashSubscribe = (callback: (event: HashChangeEvent) => void) => {
  window.addEventListener('hashchange', callback);

  return () => window.removeEventListener('hashchange', callback);
};
