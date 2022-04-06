import { IExpense } from 'interface';
import { Schema, model } from 'mongoose';

const schema = new Schema<IExpense>({
  id: Schema.Types.ObjectId,
  token: {
    type: String,
    ref: 'User',
  },
  amount: {
    type: Number,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
    default: 'others',
  },
  type: {
    type: String,
    required: false,
    trim: true,
    default: 'expense',
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  date: {
    type: Date,
    required: false,
    trim: true,
    default: Date.now(),
  },
});

export const Expense = model<IExpense>('Expense', schema);
