import { customAlphabet } from 'nanoid';
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const generateShortCode = (length = Number(process.env.SHORT_CODE_LENGTH || 6)) => {
  const nanoid = customAlphabet(alphabet, length);
  return nanoid();
};
