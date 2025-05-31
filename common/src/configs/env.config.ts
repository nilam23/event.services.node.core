import { config } from 'dotenv';

config({ path: '.env' });

export const { JWT_SECRET, DB_URI, CRYPTO_SECRET } = process.env;
