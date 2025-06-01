import { createAppLogger } from '@bts-ubiquitous/events';
import { AWS_CW_ACCESS_KEY, AWS_CW_LOG_GROUP, AWS_CW_REGION, AWS_CW_SECRET_KEY, NODE_ENV } from '@configs/env.config';
import winston from 'winston';

export const logger: winston.Logger = createAppLogger({
  env: NODE_ENV as 'development' | 'production',
  logStreamName: new Date().toISOString().split('T')[0],
  aws: {
    region: AWS_CW_REGION,
    accessKeyId: AWS_CW_ACCESS_KEY,
    secretAccessKey: AWS_CW_SECRET_KEY,
    logGroupName: AWS_CW_LOG_GROUP,
  },
});
