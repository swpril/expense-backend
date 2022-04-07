import { Schema, model } from 'mongoose';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { JWT_EXPIRE, JWT_SECRET } from '../config/config';
import { IUserModel } from '../interface';

const schema = new Schema<IUserModel>(
  {
    username: {
      type: String,
      required: true,
      minlength: 5,
      trim: true
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true
    },
    expenses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Expenses'
      }
    ]
  },
  {
    timestamps: true
  }
);

schema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

schema.methods.validPassword = function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

schema.methods.generateJWT = function (): string {
  return jwt.sign(
    {
      id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRE
    }
  );
};

schema.methods.toAuthJSON = function () {
  const { firstName, lastName, email } = this;
  return {
    firstName,
    lastName,
    email,
    token: this.generateJWT()
  };
};

export const User = model<IUserModel>('User', schema);
