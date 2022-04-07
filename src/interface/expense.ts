import { IUser } from './user';

export interface IExpense {
  amount: string;
  category: string;
  type: string;
  description: string;
  date: Date | string;
  user: IUser;
}
