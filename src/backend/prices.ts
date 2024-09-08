import { Prices } from '../types';

export default async function getPrices(symbols: string[]): Promise<Prices> {
  return symbols.reduce<Prices>((prices, symbol) => ({
    ...prices,
    [symbol]: Math.random() * 200,
  }), {});
}
