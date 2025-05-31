import { GetObjectCommand, PutObjectCommand, S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
export class AWSS3 {
  private s3: S3Client;

  constructor(s3Client: S3Client) {
    this.s3 = s3Client;
  }

  /**
   * @description generates a public URL for an S3 object based on bucket, key, and region
   * @param {string} bucket S3 bucket name
   * @param {string} key the key of the object within the bucket
   * @param {string} region the AWS region
   * @returns the public URL of the S3 object
   */
  public getS3PublicUrl = (bucket: string, key: string, region: string): string => `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

  /**
   * @description generates a presigned URL for an S3 object
   * @param {string} bucket S3 bucket name
   * @param {string} key the key of the object within the bucket
   * @param {number} expiresInSeconds expiry of the URL to be generated
   * @returns a promise that resolves to the presigned URL
   */
  public getPresignedS3Url = async (bucket: string, key: string, expiresInSeconds: number = 3600): Promise<string> => {
    try {
      const command: GetObjectCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
      return await getSignedUrl(this.s3, command, { expiresIn: expiresInSeconds });
    } catch (error) {
      throw error;
    }
  };

  /**
   * @description uploads a file stream to a specified S3 bucket with given permissions and content type
   * @param {string} bucket S3 bucket name
   * @param {string} key the key of the object within the bucket
   * @param {fs.ReadStream} body he file content as a readable stream
   * @param {'private' | 'public-read'} aclPermission the access control list permission
   * @param {string} contentType the MIME type of the file
   * @param {string} contentDisposition optional content disposition header for the file
   */
  public uploadFile = async (
    bucket: string,
    key: string,
    body: fs.ReadStream,
    aclPermission: 'private' | 'public-read' = 'public-read',
    contentType: string = 'application/octet-stream',
    contentDisposition: string = '',
  ): Promise<void> => {
    try {
      const command: PutObjectCommand = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ACL: aclPermission,
        ContentType: contentType,
        ...(contentDisposition && { ContentDisposition: contentDisposition }),
      });

      await this.s3.send(command);
    } catch (error) {
      throw error;
    }
  };

  /**
   * @description deletes an object from a specified S3 bucket
   * @param {string} bucket S3 bucket name
   * @param {string} key the key of the object within the bucket
   */
  public deleteS3Object = async (bucket: string, key: string): Promise<void> => {
    try {
      const command: DeleteObjectCommand = new DeleteObjectCommand({ Bucket: bucket, Key: key });

      await this.s3.send(command);
    } catch (error) {
      throw error;
    }
  };
}
