import { Pool } from 'pg';
import { PG_DB_NAME, PG_DB_PASSWORD, PG_HOST, PG_PORT, PG_USER } from './env.config';

export const pool: Pool = new Pool({
  user: PG_USER,
  host: PG_HOST,
  database: PG_DB_NAME,
  password: PG_DB_PASSWORD,
  port: Number(PG_PORT),
});
