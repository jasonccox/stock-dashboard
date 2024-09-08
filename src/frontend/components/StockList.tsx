import React, { useMemo } from 'react';
import AsyncButton from './AsyncButton';
import { Prices, Symbols } from '../../types';

type Props = {
  symbols: Symbols
  prices: Prices
  onRemove: (symbol: string) => Promise<void>
};

/**
 * List of all watched stocks and their prices. If a price is null, a loading
 * indicator is shown for that stock.
 */
export default function StockList({
  symbols,
  prices,
  onRemove,
}: Props) {
  const sortedSymbols = useMemo(() => symbols.sort(), [symbols]);

  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Symbol</th>
          <th scope="col">Price ($)</th>
        </tr>
      </thead>
      <tbody>
        {
          sortedSymbols.map((symbol) => (
            <tr key={symbol}>
              <td>{symbol}</td>
              <td>{`${prices[symbol]?.toFixed(2) ?? '...'}`}</td>
              <td>
                <AsyncButton
                  type="button"
                  onClick={() => onRemove(symbol)}
                >
                  Remove
                </AsyncButton>
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}
