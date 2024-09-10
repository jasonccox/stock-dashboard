import React, { useCallback, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faClose } from '@fortawesome/free-solid-svg-icons';
import ToastContext, { Toast } from '../contexts/ToastContext';
import * as styles from './Toaster.module.css';

type ToastWithId = Toast & { id: string };

const defaultExpireMillis = 2500;
const defaultExpireMillisError = 5000;

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
    const expireMillis = toast.expireMillis ?? (
      toast.type === 'error'
        ? defaultExpireMillisError
        : defaultExpireMillis
    );

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
        <div className={styles.toasts} aria-live="polite">
          {
            toasts.map((toast) => (
              <div
                key={toast.id}
                className={`${styles.toast} ${toast.type === 'error' ? styles.error : ''}`}
                role={toast.type === 'error' ? 'alert' : undefined}
              >
                { toast.type === 'error' && (
                  <FontAwesomeIcon
                    icon={faCircleExclamation}
                    className={styles.icon}
                  />
                )}
                <div className={styles.message}>
                  {toast.message}
                </div>
                <button
                  className={styles.close}
                  type="button"
                  onClick={() => removeToast(toast.id)}
                >
                  <FontAwesomeIcon icon={faClose} />
                  <div className="a11y-only">Close</div>
                </button>
              </div>
            ))
          }
        </div>
      </div>
    </ToastContext.Provider>
  );
}
