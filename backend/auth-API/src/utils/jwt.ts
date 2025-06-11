import jwt from 'jsonwebtoken';

export const generateToken = (payload: object, secret: string): string => {
  return jwt.sign(payload, secret);
};

export const verifyToken = (token: string, secret: string): object | null => {
  return jwt.verify(token, secret);
};

export const decodeToken = (token: string): object | null => {
  return jwt.decode(token);
};


