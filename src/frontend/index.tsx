import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const container = document.getElementById('root');
if (!container) {
  throw Error('missing container element');
}

const root = createRoot(container);
root.render(<h1>Jason&apos;s Stock Dashboard</h1>);
