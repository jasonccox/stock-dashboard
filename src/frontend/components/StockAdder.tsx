import React, {
  useCallback, useContext, useRef, useState,
} from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import AsyncButton from './AsyncButton';
import ToastContext from '../contexts/ToastContext';
import * as styles from './StockAdder.module.css';

type Props = {
  onAdd: (symbol: string) => Promise<void>
};

/** Form used to add a new stock to the watch list. */
export default function StockAdder({ onAdd }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [symbol, setSymbol] = useState('');
  const { pushToast } = useContext(ToastContext);

  const handleClick = useCallback(async () => {
    if (input.current?.checkValidity()) {
      await onAdd(symbol);
      setSymbol('');
    } else if (input.current?.validity.valueMissing) {
      pushToast({
        type: 'error',
        message: 'No symbol specified.',
      });
    } else if (input.current?.validity.patternMismatch) {
      pushToast({
        type: 'error',
        message: 'Symbol must not contain spaces.',
      });
    } else {
      console.warn('unexpected invalid state for symbol input', input.current?.validity);
      pushToast({
        type: 'error',
        message: 'Invalid symbol.',
      });
    }
  }, [onAdd, symbol]);

  return (
    <div>
      <p>Use the text box below to add stocks to your watch list.</p>

      <form
        className={styles.form}
        action=""
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <label className={styles.label} htmlFor="adder">
          Symbol
          <input
            className={styles.input}
            ref={input}
            type="text"
            id="adder"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            pattern="[^ ]*"
            required
          />
        </label>
        <AsyncButton type="submit" onClick={handleClick} icon={faPlus}>
          Add
        </AsyncButton>
      </form>
    </div>
  );
}
