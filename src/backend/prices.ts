import { Prices } from '../types';

export default async function getPrices(symbols: string[]): Promise<Prices> {
  // simulate delay
  await new Promise((r) => { setTimeout(r, 300); });

  return symbols.reduce<Prices>((prices, symbol) => ({
    ...prices,
    [symbol]: Math.random() * 200,
  }), {});
}
