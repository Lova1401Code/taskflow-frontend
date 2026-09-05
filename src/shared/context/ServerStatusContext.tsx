import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';

export const ServerStatus = {
  IDLE: 'idle',
  WAKING: 'waking',
  RETRYING: 'retrying',
  ERROR: 'error',
} as const;

type ServerStatusValue = (typeof ServerStatus)[keyof typeof ServerStatus];

interface RetryInfo {
  attempt: number;
  max: number;
}

interface ServerStatusContextValue {
  status: ServerStatusValue;
  retryInfo: RetryInfo | null;
  notifyWaking: () => void;
  notifyRetry: (attempt: number, max: number) => void;
  notifyError: () => void;
  notifyRequestStart: () => void;
  notifyRequestEnd: () => void;
  dismiss: () => void;
}

const ServerStatusContext = createContext<ServerStatusContextValue | null>(null);

export function ServerStatusProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ServerStatusValue>(ServerStatus.IDLE);
  const [retryInfo, setRetryInfo] = useState<RetryInfo | null>(null);
  const pendingCountRef = useRef(0);

  const resetIfIdle = useCallback(() => {
    pendingCountRef.current -= 1;
    if (pendingCountRef.current <= 0) {
      pendingCountRef.current = 0;
      setStatus(ServerStatus.IDLE);
      setRetryInfo(null);
    }
  }, []);

  const notifyWaking = useCallback(() => {
    setStatus(ServerStatus.WAKING);
  }, []);

  const notifyRetry = useCallback((attempt: number, max: number) => {
    setStatus(ServerStatus.RETRYING);
    setRetryInfo({ attempt, max });
  }, []);

  const notifyError = useCallback(() => {
    setStatus(ServerStatus.ERROR);
  }, []);

  const notifyRequestStart = useCallback(() => {
    pendingCountRef.current += 1;
  }, []);

  const notifyRequestEnd = useCallback(() => {
    resetIfIdle();
  }, []);

  const dismiss = useCallback(() => {
    setStatus(ServerStatus.IDLE);
    setRetryInfo(null);
  }, []);

  const value: ServerStatusContextValue = {
    status,
    retryInfo,
    notifyWaking,
    notifyRetry,
    notifyError,
    notifyRequestStart,
    notifyRequestEnd,
    dismiss,
  };

  return (
    <ServerStatusContext.Provider value={value}>
      {children}
    </ServerStatusContext.Provider>
  );
}

export function useServerStatus(): ServerStatusContextValue {
  const ctx = useContext(ServerStatusContext);
  if (!ctx) {
    throw new Error('useServerStatus must be used within ServerStatusProvider');
  }
  return ctx;
}