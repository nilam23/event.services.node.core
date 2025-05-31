import { config } from 'dotenv';

config({ path: '.env' });

export const { NODE_ENV, PORT, MONGO_URI, JWT_SECRET, AWS_ACCOUNT_ID, AWS_CW_REGION, AWS_CW_LOG_GROUP, AWS_CW_ACCESS_KEY, AWS_CW_SECRET_KEY } =
  process.env;
