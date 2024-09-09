// API routes under /api/stocks, used to get stock price info and manage the
// stock watch list.

import express, { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ErrorResponse, PricesResponse, WatchesResponse } from '../../types';
import db, { DuplicateError, NotFoundError } from '../db';
import getPrices from '../prices';

const router = express.Router();
export default router;

/**
 * Wrapper function to preserve error handling while using async/await in
 * route handlers.
 */
function asyncify<ResBody>(
  handler: (req: Request, res: Response<ResBody | ErrorResponse>) => Promise<void>,
): (req: Request, res: Response<ResBody | ErrorResponse>, next: NextFunction) => void {
  return (req, res, next) => {
    handler(req, res).catch((e) => next(e));
  };
}

// Get prices for all stocks listed in the "symbols" query parameter (comma-
// separated).
router.get('/prices', asyncify<PricesResponse>(async (req, res) => {
  const symbolsQuery = req.query['symbols'] ?? '';
  if (typeof symbolsQuery !== 'string') {
    throw Error(`got symbols query value of type ${typeof symbolsQuery}: ${symbolsQuery}`);
  }

  if (symbolsQuery === '') {
    res.status(StatusCodes.BAD_REQUEST).json({ error: 'no symbols specified in query' });
    return;
  }

  const symbols = symbolsQuery.toUpperCase().split(',');
  const prices = await getPrices(symbols);
  res.json({ prices });
}));

// Get the list of stocks currently on the watch list.
router.get('/watches', asyncify<WatchesResponse>(async (req, res) => {
  const symbols = await db.getWatchedSymbols();

  // simulate delay
  await new Promise((r) => { setTimeout(r, 300); });

  res.json({ symbols });
}));

// Add a stock to the watch list.
router.post('/watches/:symbol', asyncify(async (req, res) => {
  const { symbol } = req.params;
  if (!symbol) {
    throw Error('missing request param symbol');
  }

  try {
    await db.addWatchedSymbol(symbol);
    res.status(StatusCodes.CREATED).json('symbol added to watch list');
  } catch (e) {
    if (e instanceof DuplicateError) {
      res.status(StatusCodes.CONFLICT).json({ error: 'symbol already in watch list' });
      return;
    }

    throw e;
  }
}));

// Remove a stock from the watch list.
router.delete('/watches/:symbol', asyncify(async (req, res) => {
  const { symbol } = req.params;
  if (!symbol) {
    throw Error('missing request param symbol');
  }

  try {
    await db.deleteWatchedSymbol(symbol);
  } catch (e) {
    if (e instanceof NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).json({ error: 'symbol not in watch list' });
      return;
    }

    throw e;
  }

  res.json('symbol removed from watch list');
}));
