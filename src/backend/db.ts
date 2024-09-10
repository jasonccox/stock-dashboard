/* eslint-disable max-classes-per-file -- seems silly to create a new file for
   the error classes */

export class DuplicateError extends Error {}
export class NotFoundError extends Error {}

function normalizeSymbol(symbol: string): string {
  return symbol.toUpperCase();
}

class DB {
  private watchedSymbols: { [userId: string]: string[] } = {};

  async getWatchedSymbols(userId: string): Promise<string[]> {
    return this.watchedSymbols[userId] ?? [];
  }

  async addWatchedSymbol(userId: string, symbol: string): Promise<void> {
    // TODO: validate that symbol is non-empty and doesn't contain spaces
    const normalized = normalizeSymbol(symbol);
    if (this.watchedSymbols[userId]?.includes(normalized)) {
      throw new DuplicateError(`already watching ${normalized}`);
    }

    this.watchedSymbols[userId] ??= [];
    this.watchedSymbols[userId].push(normalized);
  }

  async deleteWatchedSymbol(userId: string, symbol: string): Promise<void> {
    // TODO: validate that symbol is non-empty and doesn't contain spaces
    const normalized = normalizeSymbol(symbol);
    if (!this.watchedSymbols[userId]?.includes(normalized)) {
      throw new NotFoundError(`not watching to ${normalized}`);
    }

    this.watchedSymbols[userId] = this.watchedSymbols[userId]
      .filter((s) => s !== normalized);
  }
}

export default new DB();
