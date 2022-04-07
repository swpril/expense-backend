import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config/config';

export const auth = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json('No auth headers');
    return;
  }

  const token = authHeader.split(' ')[1];

  return jwt.verify(
    token,
    JWT_SECRET,
    (error, user: { id: string; firstName: string; lastName: string; email: string; iat: number; exp: number }) => {
      if (!!error) {
        res.status(403).json();
        return;
      } else {
        req.user = { ...user };
        next();
      }
    }
  );
};
