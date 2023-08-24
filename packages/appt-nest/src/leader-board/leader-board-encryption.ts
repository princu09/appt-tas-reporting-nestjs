import { IsString } from 'class-validator';
import * as crypto from 'crypto';

const algorithm = 'aes-256-cbc';

export class enc {
  @IsString()
  iv: string;

  @IsString()
  content: string;
}

export const encrypt = (text: string) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    algorithm,
    process.env.LB_SECRET_KEY,
    iv,
  );
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  };
};

export const decrypt = (hash: enc) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    process.env.LB_SECRET_KEY,
    Buffer.from(hash.iv, 'hex'),
  );
  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, 'hex')),
    decipher.final(),
  ]);
  return decrpyted.toString();
};
