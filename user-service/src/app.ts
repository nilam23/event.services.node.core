import express from 'express';
import cors from 'cors';
import { AWS_CW_LOG_GROUP, NODE_ENV, PORT } from '@configs/env.config';
import { IExpressRoute, ICWCreateLogStreamResult } from '@bts-ubiquitous/events';
import { corsOptions } from '@configs/cors.config';
import { establishMongooseConnection } from '@middlewares/mongoose.middleware';
import { AWSCloudWatchService } from '@configs/aws.cloudwatch.config';
import { ErrorMiddleware } from '@bts-ubiquitous/events';
import { logger } from '@configs/logger.config';

export class App {
  public app: express.Application;
  public port: string | number;
  public env: string;
  public generateCWLogStreamResult: ICWCreateLogStreamResult;

  constructor(routes: IExpressRoute[]) {
    this.app = express();
    this.port = PORT;
    this.env = NODE_ENV;
    this.generateCWLogStreamResult = { isSuccess: false, logStreamName: '', error: null };

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, async () => {
      try {
        this.generateCWLogStreamResult = await AWSCloudWatchService.generateLogStream(AWS_CW_LOG_GROUP);

        if (this.generateCWLogStreamResult.isSuccess) {
          logger.info(`🚀 ${NODE_ENV} user service running on port ${this.port}`);
          logger.info(`⚡️ generated cloudwatch logstream: ${this.generateCWLogStreamResult.logStreamName}`);
        } else process.exit(1);
      } catch (error) {
        console.error(`error starting server: ${error}`);
        process.exit(1);
      }
    });
  }

  private initializeMiddlewares() {
    this.app.use(cors(corsOptions));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(establishMongooseConnection);
    // this.app.use(interceptResponse);
  }

  private initializeRoutes(routes: IExpressRoute[]) {
    routes.forEach(route => this.app.use('/', route.router));
  }

  public initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }
}
