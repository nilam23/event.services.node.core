import { PostgresService } from '@bts-ubiquitous/events';
import { PG_DB_NAME, PG_DB_PASSWORD, PG_HOST, PG_PORT, PG_USER } from '@configs/env.config';

export const pgService = new PostgresService({
  user: PG_USER,
  host: PG_HOST,
  database: PG_DB_NAME,
  password: PG_DB_PASSWORD,
  port: Number(PG_PORT),
});
