/* eslint-disable max-classes-per-file -- seems silly to create a new file for
   the error classes */

export class DuplicateError extends Error {}
export class NotFoundError extends Error {}

function normalizeSymbol(symbol: string): string {
  return symbol.toUpperCase();
}

class DB {
  private watchedSymbols: string[] = [];

  async getWatchedSymbols(): Promise<string[]> {
    return this.watchedSymbols;
  }

  async addWatchedSymbol(symbol: string): Promise<void> {
    // TODO: validate that symbol is non-empty and doesn't contain spaces
    const normalized = normalizeSymbol(symbol);
    if (this.watchedSymbols.includes(normalized)) {
      throw new DuplicateError(`already watching ${normalized}`);
    }

    this.watchedSymbols.push(normalized);
  }

  async deleteWatchedSymbol(symbol: string): Promise<void> {
    // TODO: validate that symbol is non-empty and doesn't contain spaces
    const normalized = normalizeSymbol(symbol);
    if (!this.watchedSymbols.includes(normalized)) {
      throw new NotFoundError(`not watching to ${normalized}`);
    }

    this.watchedSymbols = this.watchedSymbols.filter((s) => s !== normalized);
  }
}

export default new DB();
