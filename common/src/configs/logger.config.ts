import winston from 'winston';
import fs from 'fs';
import winstonAwsCloudwatch from 'winston-aws-cloudwatch';

interface LoggerConfig {
  env: 'development' | 'production';
  logStreamName: string;
  aws: {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    logGroupName: string;
  };
}

interface LogLevel {
  [level: string]: number;
}

interface ColorMap {
  [level: string]: string;
}

const levels: LogLevel = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors: ColorMap = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

const timestampFormat = (): string => new Date().toISOString();

export const createAppLogger = (config: LoggerConfig): winston.Logger => {
  const { env, logStreamName, aws } = config;

  const logDir = env === 'development' ? 'development_logs' : 'production_logs';
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

  const transports: Array<any> = [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp({ format: timestampFormat }),
        winston.format.printf(info => {
          const { level, message, timestamp, ...args } = info;
          const color = colors[level];
          let logString = `${timestamp} [${level}] - ${message}`;
          if (Object.keys(args).length) {
            logString += `\n  ${JSON.stringify(args, null, 2)}`;
          }
          return color ? (winston as any).format.colorize(color)(logString) : logString;
        }),
      ),
    }),
    new winstonAwsCloudwatch({
      level: 'debug',
      awsConfig: {
        region: aws.region,
        accessKeyId: aws.accessKeyId,
        secretAccessKey: aws.secretAccessKey,
      },
      logGroupName: aws.logGroupName,
      logStreamName,
    }),
  ];

  if (env === 'development') {
    transports.push(
      new winston.transports.File({
        filename: `${logDir}/all-${timestampFormat()}.log`,
        level: 'debug',
        format: winston.format.combine(winston.format.timestamp({ format: timestampFormat }), winston.format.json()),
      }),
    );
  }

  const logger = winston.createLogger({
    levels,
    transports,
  });

  return logger;
};
