import {
  Prices, PricesResponse, WatchesResponse, Symbols,
} from '../types';

/** Provides access to the backend API. */
export default class Backend {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(url: string, options?: RequestInit): Promise<T> {
    const fullUrl = `${this.baseUrl}${url}`;
    const response = await fetch(encodeURI(fullUrl), options);
    if (!response.ok) {
      console.error(`backend request to ${url} failed with status ${response.status}`, response);

      let message = 'Unknown error';
      try {
        const body = await response.json();
        if (typeof body === 'object' && body && 'error' in body && typeof body.error === 'string') {
          message = body.error;
        }
      } catch (e) {
        // body not json -- stick with default message
      }

      throw Error(message);
    }

    // TODO: validate response body schema
    return response.json();
  }

  async getPrices(symbols: Symbols): Promise<Prices> {
    const url = `/stocks/prices?symbols=${symbols.join(',')}`;
    return (await this.fetch<PricesResponse>(url)).prices;
  }

  async getWatchedSymbols(): Promise<Symbols> {
    return (await this.fetch<WatchesResponse>('/stocks/watches')).symbols;
  }

  async watch(symbol: string): Promise<void> {
    return this.fetch(`/stocks/watches/${symbol}`, { method: 'POST' });
  }

  async unwatch(symbol: string): Promise<void> {
    return this.fetch(`/stocks/watches/${symbol}`, { method: 'DELETE' });
  }
}
