import React, {
  Suspense,
  useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import StockList from './StockList';
import StockAdder from './StockAdder';
import Backend from '../backend';
import { Prices, Symbols } from '../../types';
import AsyncResource from '../AsyncResource';
import LoadingIndicator from './LoadingIndicator';
import ToastContext from '../contexts/ToastContext';

type Props = {
  backend: Backend
};

type ContentsProps = Props & {
  initialSymbols: AsyncResource<Symbols>
};

const refreshIntervalMillis = 5000;

/**
 * Create a user-friendly error message based on the error e. The action should
 * be written in the present progressive tense (e.g., "loading page").
 */
function makeErrorMessage(action: string, e: unknown): string {
  return `Error ${action}: ${e instanceof Error ? e.message : 'Unknown error'}`;
}

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
  const { pushToast } = useContext(ToastContext);

  // regularly update prices for stocks on the watch list
  useEffect(() => {
    if (watchedSymbols.length === 0) {
      return () => {};
    }

    async function updatePrices() {
      try {
        setPrices(await backend.getPrices(watchedSymbols));
      } catch (e) {
        console.error(e);
        pushToast({
          type: 'error',
          message: makeErrorMessage('getting latest stock prices', e),
        });
      }
    }

    updatePrices();
    const intervalId = setInterval(updatePrices, refreshIntervalMillis);

    return () => clearInterval(intervalId);
  }, [backend, watchedSymbols]);

  const watch = useCallback(async (symbol: string) => {
    try {
      await backend.watch(symbol);
      setWatchedSymbols((old) => [...old, symbol]);
    } catch (e) {
      console.error(e);
      pushToast({
        type: 'error',
        message: makeErrorMessage(`adding stock ${symbol} to watch list`, e),
      });
      return;
    }

    pushToast({
      type: 'info',
      message: `Added stock ${symbol} to watch list`,
    });
  }, [backend]);

  const unwatch = useCallback(async (symbol: string) => {
    try {
      await backend.unwatch(symbol);
      setWatchedSymbols((old) => old.filter((s) => s !== symbol));
    } catch (e) {
      console.error(e);
      pushToast({
        type: 'error',
        message: makeErrorMessage(`removing stock ${symbol} from watch list`, e),
      });
      return;
    }

    pushToast({
      type: 'info',
      message: `Removed stock ${symbol} from watch list`,
    });
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

  const renderError = useCallback(({ error }: FallbackProps) => (
    <>
      <p>{makeErrorMessage('loading dashboard', error)}</p>
      <p>Please refresh the page to try again.</p>
    </>
  ), []);

  return (
    <ErrorBoundary fallbackRender={renderError}>
      <Suspense fallback={<LoadingIndicator />}>
        <DashboardContents backend={backend} initialSymbols={initialSymbols} />
      </Suspense>
    </ErrorBoundary>
  );
}
