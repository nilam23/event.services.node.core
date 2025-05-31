import { ICWFetchLogStreamResult } from '@bts-ubiquitous/events';
import { NextFunction, Request, Response } from 'express';
import { HttpStatusCodes } from '@bts-ubiquitous/events';
import { AWS_CW_LOG_GROUP } from '@configs/env.config';
import { AWSCloudWatchService } from '@configs/aws.cloudwatch.config';

export class IndexController {
  /**
   * @description the controller method responsible for api healthcheck
   * @param {Request} req the express request object
   * @param {Response} res the express response object
   * @param {NextFunction} next the express next function in the cycle
   */
  public ping = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      return res.status(HttpStatusCodes.OK).json({ message: 'pong!' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @description the controller method responsible for fetching api stats
   * @param {Request} req the express request object
   * @param {Response} res the express response object
   * @param {NextFunction} next the express next function in the cycle
   */
  public fetchCloudWatchLogs = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const fetchCloudWatchLogsResult: ICWFetchLogStreamResult = await AWSCloudWatchService.fetchLogs(AWS_CW_LOG_GROUP);

      return res.status(fetchCloudWatchLogsResult.statusCode).json(fetchCloudWatchLogsResult);
    } catch (error) {
      next(error);
    }
  };
}
