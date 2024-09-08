import React, {
  useCallback, useEffect, useState,
} from 'react';
import Header from './Header';
import StockList from './StockList';
import StockAdder from './StockAdder';
import Backend from '../backend';
import { Prices, Symbols } from '../../types';

type Props = {
  backend: Backend
};

const refreshIntervalMillis = 5000;

// TODO: handle errors from backend calls

/** Top-level component that renders everything else. */
export default function App({ backend }: Props) {
  const [watchedSymbols, setWatchedSymbols] = useState<Symbols>([]);
  const [prices, setPrices] = useState<Prices>({});

  // fetch watch list on initial page load
  useEffect(() => {
    backend.getWatchedSymbols().then((s) => setWatchedSymbols(s));
  }, [backend]);

  // regularly update prices for stocks on the watch list
  useEffect(() => {
    if (watchedSymbols.length === 0) {
      return () => {};
    }

    async function updatePrices() {
      setPrices(await backend.getPrices(watchedSymbols));
    }

    updatePrices();
    const intervalId = setInterval(updatePrices, refreshIntervalMillis);

    return () => clearInterval(intervalId);
  }, [backend, watchedSymbols]);

  const watch = useCallback(async (symbol: string) => {
    await backend.watch(symbol);
    setWatchedSymbols((old) => [...old, symbol]);
  }, [backend]);

  const unwatch = useCallback(async (symbol: string) => {
    await backend.unwatch(symbol);
    setWatchedSymbols((old) => old.filter((s) => s !== symbol));
  }, [backend]);

  return (
    <>
      <Header />
      <main>
        <StockAdder onAdd={watch} />
        <StockList
          symbols={watchedSymbols}
          prices={prices}
          onRemove={unwatch}
        />
      </main>
    </>
  );
}
