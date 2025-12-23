import type { JSX } from 'preact/jsx-runtime';
import styles from './Navigation.module.css';

export const Navigation = ({ children }: { children: JSX.Element }) => {
  return <div class={styles.wrapper}>{children}</div>;
};
