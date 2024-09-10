import React from 'react';
import * as styles from './Header.module.css';

/** Page header component. */
export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.contents}>
        Jason&apos;s Stock Dashboard
      </div>
    </header>
  );
}
