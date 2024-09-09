import React, { useCallback, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import ToastContext, { Toast } from '../contexts/ToastContext';

type ToastWithId = Toast & { id: string };

const defaultExpireMillis = 5000;

/**
 * Renders toast messages and provides a ToastContext to allow children to
 * create toasts.
 */
export default function Toaster({ children }: React.PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastWithId[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((old) => old.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback((t: Toast) => {
    const toast = { ...t, id: uuid() };
    setToasts((old) => [...old, toast]);

    // schedule auto-removal
    const expireMillis = toast.expireMillis ?? defaultExpireMillis;
    if (expireMillis !== 'never') {
      setTimeout(() => removeToast(toast.id), expireMillis);
    }
  }, []);

  return (
    <ToastContext.Provider value={useMemo(() => ({ pushToast }), [pushToast])}>
      <div>
        <div>
          {children}
        </div>
        <div aria-live="polite">
          {
            toasts.map((toast) => (
              <div key={toast.id} role={toast.type === 'error' ? 'alert' : undefined}>
                {toast.message}
                <button type="button" onClick={() => removeToast(toast.id)}>
                  Close
                </button>
              </div>
            ))
          }
        </div>
      </div>
    </ToastContext.Provider>
  );
}
