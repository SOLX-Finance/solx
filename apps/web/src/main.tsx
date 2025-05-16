import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import { Buffer } from 'buffer';

import App from './app/app';
import AppProviders from './providers/AppProviders';

window.Buffer ||= Buffer;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
