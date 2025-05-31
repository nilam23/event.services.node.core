import { dbConfigs } from '@configs/mongoose.config';
import { NODE_ENV } from '@configs/env.config';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { logger } from '@configs/logger.config';

/**
 * @description the middleware function to setup mongoose connection
 * @param {Request} req the express req object
 * @param {Response} res the express res object
 * @param {NextFunction} next the express next function in the cycle
 */
export const establishMongooseConnection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!dbConfigs.connection) {
      if (NODE_ENV === 'development') mongoose.set('debug', true);
      dbConfigs.connection = await mongoose.connect(dbConfigs.url, dbConfigs.options);

      logger.info('mongoose connection setup successfully!');
    }

    next();
  } catch (error) {
    logger.error('mongoose connection failed!');
    next(error);
  }
};
