import { CloudWatchLogsClient, CreateLogStreamCommand, GetLogEventsCommand } from '@aws-sdk/client-cloudwatch-logs';
import { ICWCreateLogStreamResult, ICWFetchLogStreamResult } from '@interfaces/helpers/aws.interface';

export class AWSCloudWatch {
  private cloudwatch: CloudWatchLogsClient;

  constructor(cloudwatchClient: CloudWatchLogsClient) {
    this.cloudwatch = cloudwatchClient;
  }

  /**
   * @description the method responsible for creating a logstream on aws cloudwatch
   * @param logStreamName the logstream to be created on aws cloudwatch
   * @returns the cloudwatch logstream generation success/failure response object
   */
  public generateLogStream = async (
    AWS_CW_LOG_GROUP: string,
    logStreamName = `${new Date().toISOString().split('T')[0]}`,
  ): Promise<ICWCreateLogStreamResult> => {
    try {
      let responseObj: ICWCreateLogStreamResult = { isSuccess: false, logStreamName: '', error: null };
      const createLogStreamPromiseResult: PromiseSettledResult<any>[] = await Promise.allSettled([
        this.cloudwatch.send(new CreateLogStreamCommand({ logGroupName: AWS_CW_LOG_GROUP, logStreamName })),
      ]);
      const createLogStreamResult: PromiseSettledResult<any> = createLogStreamPromiseResult[0];

      if (createLogStreamResult.status === 'fulfilled' || createLogStreamResult.reason['__type'] === 'ResourceAlreadyExistsException') {
        responseObj = { ...responseObj, isSuccess: true, logStreamName };
      } else {
        responseObj.error = {
          status: createLogStreamResult.reason['$metadata']?.httpStatusCode,
          type: createLogStreamResult.reason['__type'],
          message: createLogStreamResult.reason?.message,
        };
      }

      return responseObj;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @description the method responsible for fetching logs from aws cloudwatch
   * @param logStreamName the aws cloudwatch logstream to fetch logs from
   * @returns the cloudwatch logs fetch success/failure response object
   */
  public fetchLogs = async (
    AWS_CW_LOG_GROUP: string,
    logStreamName = `${new Date().toISOString().split('T')[0]}`,
  ): Promise<ICWFetchLogStreamResult> => {
    try {
      let responseObj: ICWFetchLogStreamResult = { isSuccess: false, statusCode: null, logEvents: [], error: null };
      const getLogsCommand: GetLogEventsCommand = new GetLogEventsCommand({
        logGroupName: AWS_CW_LOG_GROUP,
        logStreamName,
        startFromHead: true,
      });

      const getLogsPromiseResult: PromiseSettledResult<any>[] = await Promise.allSettled([this.cloudwatch.send(getLogsCommand)]);
      const getLogsResult: PromiseSettledResult<any> = getLogsPromiseResult[0];

      if (getLogsResult.status === 'fulfilled') {
        const logEvents: any = getLogsResult.value?.events
          .filter((event: any) => event.message.startsWith('[HTTP]'))
          .map((event: any) => ({ timestamp: new Date(event.timestamp), message: JSON.parse(event.message.split('[HTTP] ')[1]) }));

        responseObj = { ...responseObj, isSuccess: true, statusCode: getLogsResult.value['$metadata'].httpStatusCode, logEvents };
      } else {
        responseObj.statusCode = getLogsResult.reason['$metadata'].httpStatusCode;
        responseObj.error = {
          status: getLogsResult.reason['$metadata']?.httpStatusCode,
          type: getLogsResult.reason['__type'],
          message: getLogsResult.reason?.message,
        };
      }

      return responseObj;
    } catch (error) {
      throw error;
    }
  };
}
