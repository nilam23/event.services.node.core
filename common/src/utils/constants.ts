import { IFiletypeWithMimetype, IPGErrorCode, IStatusCode } from '@interfaces/helpers/misc.interface';

/**
 * @description http status codes to be used in API response
 */
export const HttpStatusCodes: IStatusCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

/**
 * @description helper enum to keep track
 *  of all possible mongodb operations
 */
export enum mongooseOperations {
  FIND = 'find',
  FIND_ONE = 'findOne',
  INSERT_ONE = 'insertOne',
  INSERT_MANY = 'insertMany',
  UPDATE_ONE = 'updateOne',
  UPDATE_MANY = 'updateMany',
  DELETE_ONE = 'deleteOne',
  DELETE_MANY = 'deleteMany',
  AGGREGATE = 'aggregate',
  COUNT = 'count',
  DISTINCT = 'distinct',
  BULK_WRITE = 'bulkWrite',
  CREATE_INDEX = 'createIndex',
  DROP_INDEX = 'dropIndex',
  LIST_INDEXES = 'listIndexes',
  REPLACE_ONE = 'replaceOne',
  FIND_ONE_AND_UPDATE = 'findOneAndUpdate',
  FIND_ONE_AND_REPLACE = 'findOneAndReplace',
  FIND_ONE_AND_DELETE = 'findOneAndDelete',
}

/**
 * @description helper enum to manage different
 * error messages for jwt token
 */
export const jwtErrors = {
  EXPIRED_TOKEN: 'jwt expired',
  INVALID_TOKEN: 'invalid token',
  INVALID_SIGNATURE: 'invalid signature',
};

/**
 * @description mime types for file upload
 */
export const mimeTypes: IFiletypeWithMimetype = {
  CSV: 'text/csv',
  EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PDF: 'application/pdf',
  PYTHON_NOTEBOOK: 'application/octet-stream',
  ZIP: 'application/zip',
  PYTHON: 'text/x-python',
  IMAGE: 'image/jpeg',
  PPT: 'application/vnd.ms-powerpoint',
  PPTX: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  VIDEO_MP4: 'video/mp4',
};

export const pgErrorCodes: IPGErrorCode = {
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  NOT_NULL_VIOLATION: '23502',
  CHECK_VIOLATION: '23514',
  INVALID_TEXT_REPRESENTATION: '22P02',
  SYNTAX_ERROR: '42601',
  UNDEFINED_TABLE: '42P01',
  UNDEFINED_COLUMN: '42703',
  DUPLICATE_COLUMN: '42701',
  DUPLICATE_TABLE: '42P07',
  STRING_DATA_RIGHT_TRUNCATION: '22001',
  CONNECTION_DOES_NOT_EXIST: '08003',
  DEADLOCK_DETECTED: '40P01',
  INSUFFICIENT_PRIVILEGE: '42501',
  INVALID_AUTHORIZATION_SPEC: '28000',
  INVALID_PASSWORD: '28P01',
};
