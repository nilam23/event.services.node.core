import { JWT_SECRET } from '@configs/env.config';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import slug from 'limax';
import { CryptoService } from '@services/crypto/crypto.service';

/**
 * @description helper method responsible for
 * sending lambda response back to client
 * @param {number} statusCode http status code
 * @param {any} body body of the lambda response
 * @param {any} headers headers to be attached to the lambda response
 * @param {boolean} includeCustomHeaders boolean to indicate whether custom headers are to be included
 * @returns the lambda response
 */
export const sendLambaResponse = (
  statusCode: number,
  body: any,
  encryptResponseBody: boolean = false,
  headers: any = {},
  includeCustomHeaders: boolean = true,
) => {
  const customHeaders: any = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,PATCH,DELETE',
  };
  const crypto: CryptoService = new CryptoService();

  return {
    statusCode,
    headers: { ...headers, ...(includeCustomHeaders ? customHeaders : {}) },
    ...(body && { body: encryptResponseBody ? crypto.encrypt(body) : JSON.stringify(body) }),
  };
};

/**
 * @description bcrypt helper methods to generate hash salt, to hash a plaintext password and to compare passwords
 */
export const bcryptHelpers = {
  getHashSalt: async (): Promise<string> => {
    return await bcrypt.genSalt();
  },
  hash: async (text: string): Promise<string> => {
    const salt: string = await bcryptHelpers.getHashSalt();
    const hashedText: string = await bcrypt.hash(text, salt);
    return hashedText;
  },
  compare: async (text: string, hashedText: string): Promise<boolean> => {
    return await bcrypt.compare(text, hashedText);
  },
};

/**
 * @description jwt helper methods to create jwt token and to verify a given jwt token
 */
export const jwtHelpers = {
  createToken: (payload: any, expiry: number = 60 * 24 * 60 * 60): string => jwt.sign(payload, JWT_SECRET, { expiresIn: expiry }),
  verifyToken: (token: string): jwt.JwtPayload | string => jwt.verify(token, JWT_SECRET),
};

/**
 * @description this method is used to stop execution for a given number of seconds
 * @param {number} secs the number of seconds to stop execution
 */
export const sleep = (secs: number) => new Promise((resolve: any) => setTimeout(resolve, secs));

/**
 * @description helper method to generate a random key
 * @param {number} length the length of the key
 * @returns the generated hex key
 */
export const generateRandomKey = (length = 16): string => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * @description helper method to generate a slug for a given plain text
 * @param {string} text the text for which a slug is to be generated
 * @returns the generated slug
 */
export const generateSlug = (text: string): string => {
  const randomString: string = crypto.randomBytes(16).toString('hex');
  const payload: string = randomString.substring(randomString.length - 5);
  const finalTitle: string = text.slice(0, 50);

  return slug(`${finalTitle} ${payload}`);
};
