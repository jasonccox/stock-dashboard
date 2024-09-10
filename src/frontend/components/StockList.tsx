import React, { useMemo } from 'react';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import AsyncButton from './AsyncButton';
import { Prices, Symbols } from '../../types';
import LoadingIndicator from './LoadingIndicator';
import * as styles from './StockList.module.css';

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

  return symbols.length > 0 ? (
    <table className={styles.list}>
      <thead className={styles.header}>
        <tr>
          <th className={styles.symbolCol} scope="col">Symbol</th>
          <th className={styles.priceCol} scope="col">Price ($)</th>
          <th className={styles.removeCol} scope="col">
            <div className="a11y-only">remove buttons</div>
          </th>
        </tr>
      </thead>
      <tbody className={styles.body}>
        {
          sortedSymbols.map((symbol) => {
            const price = prices[symbol];
            return (
              <tr key={symbol} className={styles.row}>
                <td className={styles.symbolCol}>{symbol}</td>
                <td className={styles.priceCol}>
                  {price !== undefined ? price.toFixed(2) : <LoadingIndicator />}
                </td>
                <td className={styles.removeCol}>
                  <AsyncButton
                    type="button"
                    onClick={() => onRemove(symbol)}
                    icon={faMinus}
                    danger
                  >
                    Remove
                  </AsyncButton>
                </td>
              </tr>
            );
          })
        }
      </tbody>
    </table>
  ) : (
    <div className={styles.emptyMessage}>
      You aren&apos;t watching any stocks yet.
    </div>
  );
}
