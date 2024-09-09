import { createContext } from 'react';

export type Toast = {
  type: 'error' | 'info'
  message: string
  expireMillis?: number | 'never' // omit for default value
};

type Value = {
  pushToast: (t: Toast) => void
};

/** Allows children to create toast messages. */
const ToastContext = createContext<Value>({ pushToast: () => {} });

export default ToastContext;
