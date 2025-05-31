import { CRYPTO_SECRET } from '@configs/env.config';
import { ICipherPayload } from '@interfaces/helpers/misc.interface';
import { randomBytes, createCipheriv, createDecipheriv, CipherGCMTypes, CipherGCM, DecipherGCM } from 'crypto';

export class CryptoService {
  private static SECRET_KEY: string = CRYPTO_SECRET;
  private static IV_LENGTH: number = 16;
  private static CRYPTO_ALGORITHM: CipherGCMTypes = 'aes-256-gcm';

  /**
   * @description method for encryption
   * @param {any} data the raw data
   * @returns the encrypted data
   */
  public encrypt(data: any): string {
    const IV: Buffer = randomBytes(CryptoService.IV_LENGTH);
    const cipher: CipherGCM = createCipheriv(CryptoService.CRYPTO_ALGORITHM, Buffer.from(CryptoService.SECRET_KEY), IV);

    let encrypted: string = cipher.update(JSON.stringify(data), 'utf-8', 'base64');
    encrypted += cipher.final('base64');
    const authTag: string = cipher.getAuthTag().toString('base64');

    return JSON.stringify({
      IV: IV.toString('base64'),
      encryptedData: encrypted,
      authTag: authTag,
    });
  }

  /**
   * @description method for decryption
   * @param {string} cipher the encrypted data
   * @returns the decrypted data
   */
  public decrypt(cipher: string): any {
    const { IV, encryptedData, authTag }: ICipherPayload = JSON.parse(cipher);

    if (!IV || !encryptedData || !authTag) throw Error('incorrect encryption payload');

    const decipher: DecipherGCM = createDecipheriv(CryptoService.CRYPTO_ALGORITHM, CryptoService.SECRET_KEY, Buffer.from(IV, 'base64'));
    decipher.setAuthTag(Buffer.from(authTag, 'base64'));

    let decrypted: string = decipher.update(encryptedData, 'base64', 'utf-8');
    decrypted += decipher.final('utf-8');

    return JSON.parse(decrypted);
  }
}
