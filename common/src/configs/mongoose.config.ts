import mongoose from 'mongoose';
import { DB_URI } from '@configs/env.config';

/**
 * @description method responsible for establishing mongoose connection
 * if not already established
 */
export const establishMongooseConnection = async (): Promise<boolean> => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(DB_URI, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });
  }

  return true;
};
