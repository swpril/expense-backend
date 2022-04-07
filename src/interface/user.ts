import { Document } from 'mongoose';
import { IExpense } from './expense';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  expenses: IExpense[];
}

export interface IUserToAuthJSON {
  firstName: string;
  lastName: string;
  email: string;
  expenses: IExpense[];
}

export interface IUserModel extends Document, IUser {
  validPassword(password: string): boolean;
  toAuthJSON(): IUserToAuthJSON;
  generateJWT(): string;
}
