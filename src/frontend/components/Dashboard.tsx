import React, {
  Suspense,
  useCallback, useEffect, useMemo, useState,
} from 'react';
import StockList from './StockList';
import StockAdder from './StockAdder';
import Backend from '../backend';
import { Prices, Symbols } from '../../types';
import AsyncResource from '../AsyncResource';
import LoadingIndicator from './LoadingIndicator';

type Props = {
  backend: Backend
};

type ContentsProps = Props & {
  initialSymbols: AsyncResource<Symbols>
};

// TODO: handle errors from backend calls

const refreshIntervalMillis = 5000;

/**
 * The actual contents of the dashboard, defined as a separate component to
 * allow wrapping it in a <Suspense>.
 */
function DashboardContents({
  backend,
  initialSymbols: initialSymbolsResource,
}: ContentsProps) {
  // suspend component until the intial list of watched symbols is loaded
  const initialSymbols = initialSymbolsResource.read();

  const [watchedSymbols, setWatchedSymbols] = useState<Symbols>(initialSymbols);
  const [prices, setPrices] = useState<Prices>({});

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
      <StockAdder onAdd={watch} />
      <StockList
        symbols={watchedSymbols}
        prices={prices}
        onRemove={unwatch}
      />
    </>
  );
}

/**
 * The actual dashboard, containing the stock list and controls to add/remove
 * stocks.
 */
export default function Dashboard({ backend }: Props) {
  const initialSymbols = useMemo(
    () => new AsyncResource(backend.getWatchedSymbols()),
    [backend],
  );

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <DashboardContents backend={backend} initialSymbols={initialSymbols} />
    </Suspense>
  );
}
