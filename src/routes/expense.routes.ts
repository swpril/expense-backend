import express, { Request, Response } from 'express';
import httpStatus from 'http-status';
import { Types } from 'mongoose';

import { IUser, IUserModel } from 'interface';
import { auth } from '../middleware/auth';
import { Expense, User } from '../models';

const router = express.Router();

const tabMap = {
  category: {
    category: '$category'
  },
  year: {
    year: '$year'
  },
  month: {
    month: '$month',
    year: '$year'
  },
  week: {
    week: {
      $week: { $toDate: '$isoDate' }
    }
  },
  type: {
    type: '$type'
  }
};

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
    userId: Types.ObjectId(user.id),
    dd: expenseDate.getDate(),
    mm: expenseDate.getMonth() + 1,
    yy: expenseDate.getFullYear(),
    isoDate: expenseDate.toISOString()
  });

  dbUser.expenses = dbUser?.expenses.concat(expense._id);
  await dbUser.save();
  await expense.save();
  res.status(httpStatus.CREATED).json(expense);
});

router.get('/', auth, async (req: Request, res: Response) => {
  const user = req.user as unknown as IUser & { id: string };
  const tab = (req.query.tab ?? 'category') as unknown as string;

  const expenses = await Expense.aggregate([
    { $match: { userId: Types.ObjectId(user.id) } },
    {
      $project: {
        amount: 1,
        month: '$mm',
        year: '$yy',
        category: 1,
        day: '$dd',
        type: 1,
        isoDate: 1
      }
    },
    {
      $group: {
        _id: {
          ...tabMap[tab]
        },
        id: { $addToSet: '$_id' },
        month: { $addToSet: '$month' },
        amount: { $sum: '$amount' },
        day: { $addToSet: '$day' },
        category: { $addToSet: '$category' },
        type: { $addToSet: '$type' },
        date: { $addToSet: '$isoDate' }
      }
    }
  ]);

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
  const user = req.user as unknown as IUser & { id: string };
  const dbUser = (await User.findById(user.id)) as IUserModel;

  const expense = await Expense.findByIdAndDelete(Types.ObjectId(req.params.id));
  dbUser.expenses = dbUser?.expenses.filter(exp => exp.toString() !== expense?._id.toString());
  await dbUser.save();
  if (!expense) {
    res.status(404).send('Expense not found');
    return;
  }
  res.status(200).json(expense);
});

export default router;
