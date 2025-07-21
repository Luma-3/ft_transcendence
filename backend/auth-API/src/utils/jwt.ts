import jwt from 'jsonwebtoken';

export const generateToken = (payload: object, secret: string) => {
  return jwt.sign(payload, secret);
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};

export const decodeToken = (token: string) => {
  return jwt.decode(token);
};


