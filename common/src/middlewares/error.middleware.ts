import { NextFunction, Request, Response } from 'express';
import { HttpStatusCodes } from '@utils/constants';
import { HttpException } from '@utils/httpException';

/**
 * @description this middleware is responsible for sending error response back to the client
 * @param {HttpException} error the HTTP error object
 * @param {Request} req the express req object
 * @param {Response} res the express res object
 * @param {NextFunction} next the express next function in the cycle
 */
export const ErrorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const statusCode: number = error.statusCode || HttpStatusCodes.INTERNAL_SERVER_ERROR;
    const message: string = error.message || 'Internal Server Error';

    res.status(statusCode).json({ message });
  } catch (error) {
    next(error);
  }
};
