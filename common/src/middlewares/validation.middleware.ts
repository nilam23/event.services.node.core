import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@utils/httpException';
import { HttpStatusCodes } from '@utils/constants';

/**
 * @description validation check for inputs to requests received on the server
 * @param type dto
 * @param skipMissingProperties boolean to confirm whether to skip missing properties
 * @param whitelist boolean to confirm whether to allow other properties than described in dto
 * @param forbidNonWhitelisted boolean to confirm whether to have an error thrown when any non-whitelisted properties are present
 */
export const ValidationMiddleware = (
  type: any,
  value: string | 'body' | 'query' | 'params' = 'body',
  skipMissingProperties = false,
  whitelist = false,
  forbidNonWhitelisted = false,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req[value]);

    validateOrReject(dto, { skipMissingProperties, whitelist, forbidNonWhitelisted })
      .then(() => {
        req.body = dto;

        next();
      })
      .catch((errors: ValidationError[]) => {
        const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');

        next(new HttpException(HttpStatusCodes.BAD_REQUEST, message));
      });
  };
};
