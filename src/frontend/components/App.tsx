import React from 'react';
import Header from './Header';
import Backend from '../backend';
import Dashboard from './Dashboard';

type Props = {
  backend: Backend
};

/** Top-level component that renders everything else. */
export default function App({ backend }: Props) {
  return (
    <>
      <Header />
      <main>
        <Dashboard backend={backend} />
      </main>
    </>
  );
}
