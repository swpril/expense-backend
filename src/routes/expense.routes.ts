import express, { Request, Response } from 'express';
import httpStatus from 'http-status';
import { Types } from 'mongoose';

import { IUser, IUserModel } from 'interface';
import { auth } from '../middleware/auth';
import { Expense, User } from '../models';

const router = express.Router();

router.post('/', auth, async (req: Request, res: Response) => {
  const { amount, category, type, description, date } = req.body;
  const user = req.user as unknown as IUser & { id: string };

  const dbUser = (await User.findById(user.id)) as IUserModel;

  const expenseDate = new Date(parseInt(date));

  const expense = new Expense({
    amount,
    category,
    type,
    description,
    date,
    userId: Types.ObjectId(user.id),
    dd: expenseDate.getDate(),
    mm: expenseDate.getMonth() + 1,
    yy: expenseDate.getFullYear()
  });

  dbUser.expenses = dbUser?.expenses.concat(expense._id);
  await dbUser.save();
  await expense.save();
  res.status(httpStatus.CREATED).json(expense);
});

router.get('/', auth, async (req: Request, res: Response) => {
  const user = req.user as unknown as IUser & { id: string };
  const expenses = await Expense.find({ userId: Types.ObjectId(user.id) });
  if (!expenses) {
    res.status(404).send('Expenses not found');
    return;
  }
  res.status(200).json(expenses);
});

router.get('/:id', auth, async (req: Request, res: Response) => {
  const expense = await Expense.findById({ _id: Types.ObjectId(req.params.id) });

  if (!expense) {
    res.status(404).send('Expense not found');
    return;
  }
  res.status(200).json(expense);
});

router.put('/:id', auth, async (req: Request, res: Response) => {
  const { id } = req.params;

  const expenseDate = !!req.body.date ? new Date(parseInt(req.body.date)) : new Date();

  const expense = await Expense.findByIdAndUpdate(Types.ObjectId(id), {
    ...req.body,
    ...(!!req.body.date
      ? {
          dd: expenseDate.getDate(),
          mm: expenseDate.getMonth() + 1,
          yy: expenseDate.getFullYear()
        }
      : {})
  });

  res.status(200).json(expense);
});

router.delete('/:id', auth, async (req: Request, res: Response) => {
  const expense = await Expense.findByIdAndDelete(Types.ObjectId(req.params.id));

  if (!expense) {
    res.status(404).send('Expense not found');
    return;
  }
  res.status(200).json(expense);
});

export default router;
