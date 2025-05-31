import { config } from 'dotenv';

config({ path: '.env' });

export const { JWT_SECRET, MONGO_URI, CRYPTO_SECRET } = process.env;
