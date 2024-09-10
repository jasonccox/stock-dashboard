/* eslint-disable max-classes-per-file -- seems silly to create a new file for
   the error classes */

import { Pool, PoolConfig } from 'pg';

export class DuplicateError extends Error {}
export class NotFoundError extends Error {}

function normalizeSymbol(symbol: string): string {
  return symbol.toUpperCase();
}

class DB {
  private pool: Pool;

  constructor() {
    const config: PoolConfig = {
      user: process.env['DB_USER'],
      password: process.env['DB_PASSWORD'],
      database: process.env['DB_DB'],
      host: process.env['DB_HOST'],
      port: Number(process.env['DB_PORT']),
    };

    if (
      !config.user
        || !config.password
        || !config.database
        || !config.host
        || !config.port
        || Number.isNaN(config.port)
    ) {
      throw Error('missing required DB environment variables');
    }

    this.pool = new Pool(config);

    this.pool.on('error', (err) => {
      console.error('unexpected error on idle client', err);
      process.exit(1);
    });
  }

  async getWatchedSymbols(userId: string): Promise<string[]> {
    try {
      const result = await this.pool.query(
        'select symbol from watches where userId = $1',
        [userId],
      );

      return result.rows.map((r) => r.symbol);
    } catch (e) {
      console.error('error getting watched symbols', e);
      throw Error('error getting watched symbols');
    }
  }

  async addWatchedSymbol(userId: string, symbol: string): Promise<void> {
    const normalized = normalizeSymbol(symbol);

    try {
      await this.pool.query(
        'insert into watches (userId, symbol) values ($1, $2)',
        [userId, normalized],
      );
    } catch (e) {
      if (e instanceof Error && 'code' in e && e.code === '23505') {
        throw new DuplicateError(`already watching stock ${normalized}`);
      }

      console.error('error adding watched symbol', normalized, e);
      throw Error('error adding watched symbol');
    }
  }

  async deleteWatchedSymbol(userId: string, symbol: string): Promise<void> {
    const normalized = normalizeSymbol(symbol);

    let found: boolean;
    try {
      const result = await this.pool.query(
        'delete from watches where userId = $1 and symbol = $2',
        [userId, normalized],
      );

      found = !!result.rowCount && result.rowCount > 0;
    } catch (e) {
      console.error('error deleting watched symbol', normalized, e);
      throw Error('error deleting watched symbol');
    }

    if (!found) {
      throw new NotFoundError(`not watching stock ${normalized}`);
    }
  }
}

export default new DB();
