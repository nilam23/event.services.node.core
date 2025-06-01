import { APIGatewayEvent } from 'aws-lambda';

export interface IFiletypeWithMimetype {
  CSV: string;
  EXCEL: string;
  PDF: string;
  PYTHON_NOTEBOOK: string;
  ZIP: string;
  PYTHON: string;
  IMAGE: string;
  PPT: string;
  PPTX: string;
  VIDEO_MP4: string;
}

export interface IStatusCode {
  OK: number;
  CREATED: number;
  BAD_REQUEST: number;
  UNAUTHORIZED: number;
  FORBIDDEN: number;
  NOT_FOUND: number;
  CONFLICT: number;
  INTERNAL_SERVER_ERROR: number;
}

export interface IAxiosAPIInvocationResponse {
  statusCode: number;
  data: any;
}

export interface ICipherPayload {
  IV: string;
  encryptedData: string;
  authTag: string;
}

export interface IJwtPayload {
  userId: string;
  email: string;
  role: string;
  tenantId?: string;
}

export interface IAPIGatewayEventWithUser extends APIGatewayEvent {
  currentUser: IJwtPayload;
}

export interface IPGErrorCode {
  UNIQUE_VIOLATION: string;
  FOREIGN_KEY_VIOLATION: string;
  NOT_NULL_VIOLATION: string;
  CHECK_VIOLATION: string;
  INVALID_TEXT_REPRESENTATION: string;
  SYNTAX_ERROR: string;
  UNDEFINED_TABLE: string;
  UNDEFINED_COLUMN: string;
  DUPLICATE_COLUMN: string;
  DUPLICATE_TABLE: string;
  STRING_DATA_RIGHT_TRUNCATION: string;
  CONNECTION_DOES_NOT_EXIST: string;
  DEADLOCK_DETECTED: string;
  INSUFFICIENT_PRIVILEGE: string;
  INVALID_AUTHORIZATION_SPEC: string;
  INVALID_PASSWORD: string;
}
