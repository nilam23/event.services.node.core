export interface ICWCreateLogStreamResult {
  isSuccess: boolean;
  logStreamName: string;
  error: any;
}

export interface ICWFetchLogStreamResult {
  isSuccess: boolean;
  statusCode: number;
  logEvents: any[];
  error: any;
}

export interface ISESParams {
  source: string;
  toAddresses: string[];
  ccAddresses?: string[];
  bccAddresses?: string[];
  subject: string;
  htmlTemplate?: string;
  bodyText?: string;
}
