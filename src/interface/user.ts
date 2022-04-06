import { Document } from 'mongoose';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  salt: string;
}

export interface IUserToAuthJSON {
  firstName: string;
  lastName: string;
  email: string;
}

export interface IUserModel extends Document, IUser {
  setPassword(password: string): void;
  validPassword(password: string): boolean;
  toAuthJSON(): IUserToAuthJSON;
  generateJWT(): string;
}
