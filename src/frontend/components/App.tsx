import React from 'react';
import Header from './Header';
import Backend from '../backend';
import Dashboard from './Dashboard';
import Toaster from './Toaster';
import * as styles from './App.module.css';

type Props = {
  backend: Backend
};

/** Top-level component that renders everything else. */
export default function App({ backend }: Props) {
  return (
    <div className={styles.app}>
      <Header />
      <main>
        <Toaster>
          <Dashboard backend={backend} />
        </Toaster>
      </main>
    </div>
  );
}
