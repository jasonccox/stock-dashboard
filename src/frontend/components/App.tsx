import React from 'react';
import Header from './Header';
import Backend from '../backend';
import Dashboard from './Dashboard';
import Toaster from './Toaster';

type Props = {
  backend: Backend
};

/** Top-level component that renders everything else. */
export default function App({ backend }: Props) {
  return (
    <>
      <Header />
      <main>
        <Toaster>
          <Dashboard backend={backend} />
        </Toaster>
      </main>
    </>
  );
}
