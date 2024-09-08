// Types shared between frontend and backend, primarily to help with type safety
// at the API boundary.

export type Symbols = string[];
export type WatchesResponse = { symbols: Symbols };

export type Prices = { [symbol: string]: number };
export type PricesResponse = { prices: Prices };

export type ErrorResponse = { error: string };
