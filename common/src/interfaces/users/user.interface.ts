import { ObjectId } from 'mongodb';

export interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
  phone?: number;
  password?: string;
  role?: 'admin' | 'user';
  otpEnabled?: boolean;
  lastLoggedInAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
