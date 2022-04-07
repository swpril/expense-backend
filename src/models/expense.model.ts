import { IExpense } from 'interface';
import { Schema, model } from 'mongoose';

const schema = new Schema<IExpense>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    default: 'others'
  },
  type: {
    type: String,
    required: false,
    trim: true,
    default: 'expense'
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  date: {
    type: Date,
    required: false,
    trim: true,
    default: Date.now()
  },
  dd: {
    type: Number,
    required: true
  },
  mm: {
    type: Number,
    required: true
  },
  yy: {
    type: Number,
    required: true
  }
});

export const Expense = model<IExpense>('Expense', schema);
