import * as crypto from 'crypto';

export default {
  'md5': (str) => {
    return crypto.createHash('md5').
      update(str).
      digest('hex');
  },
  'sha1': (str) => {
    return crypto.createHash('sha1').
      update(str).
      digest('hex');
  },
  'sha2': (str) => {
    return crypto.createHash('sha256').
      update(str).
      digest('hex');
  },
  'hmac_sha1': (str, key) => {
    return crypto.createHmac('sha1', key).
      update(str).
      digest('hex');
  },
  'base64': (str) => {
    return Buffer.from(str, 'utf8').
      toString('base64');
  }
};
