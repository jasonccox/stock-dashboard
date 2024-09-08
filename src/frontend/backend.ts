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
      throw Error(`backend request to ${url} failed with status ${response.status}`);
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
