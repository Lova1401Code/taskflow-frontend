import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@app/App';
import { ServerStatusProvider, useServerStatus } from '@shared/context/ServerStatusContext';
import { ServerWakingOverlay } from '@shared/components/ServerWakingOverlay';
import { configureServerStatusCallbacks } from '@services/httpClient';
import '@/styles/index.css';

function ServerStatusBridge() {
  const {
    notifyWaking,
    notifyRetry,
    notifyError,
    notifyRequestStart,
    notifyRequestEnd,
  } = useServerStatus();

  configureServerStatusCallbacks({
    onWarn: notifyWaking,
    onRetry: notifyRetry,
    onError: notifyError,
    onRequestStart: notifyRequestStart,
    onRequestEnd: notifyRequestEnd,
  });

  return null;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ServerStatusProvider>
      <ServerStatusBridge />
      <App />
      <ServerWakingOverlay />
    </ServerStatusProvider>
  </React.StrictMode>
);