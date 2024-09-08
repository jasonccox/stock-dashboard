import React, { useCallback, useState } from 'react';
import AsyncButton from './AsyncButton';

type Props = {
  onAdd: (symbol: string) => Promise<void>
};

/** Form used to add a new stock to the watch list. */
export default function StockAdder({ onAdd }: Props) {
  const [symbol, setSymbol] = useState('');

  const handleClick = useCallback(async () => {
    await onAdd(symbol);
    setSymbol('');
  }, [onAdd, symbol]);

  // TODO: validate that symbol is non-empty and doesn't contain spaces

  return (
    <form action="" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="adder">
        Symbol
        <input
          type="text"
          id="adder"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        />
      </label>
      <AsyncButton type="submit" onClick={handleClick}>
        Add
      </AsyncButton>
    </form>
  );
}
