import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './components/App';
import Backend from './backend';

const container = document.getElementById('root');
if (!container) {
  throw Error('missing container element');
}

const backend = new Backend(`${window.location.protocol}//${window.location.host}/api`);
const root = createRoot(container);
root.render(<App backend={backend} />);
