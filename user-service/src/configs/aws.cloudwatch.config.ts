import { CloudWatchLogsClient } from '@aws-sdk/client-cloudwatch-logs';
import { AWS_CW_ACCESS_KEY, AWS_CW_REGION, AWS_CW_SECRET_KEY } from '@configs/env.config';
import { AWSCloudWatch } from '@bts-ubiquitous/events';

const cloudwatch: CloudWatchLogsClient = new CloudWatchLogsClient({
  region: AWS_CW_REGION,
  credentials: { accessKeyId: AWS_CW_ACCESS_KEY, secretAccessKey: AWS_CW_SECRET_KEY },
});

export const AWSCloudWatchService: AWSCloudWatch = new AWSCloudWatch(cloudwatch);
