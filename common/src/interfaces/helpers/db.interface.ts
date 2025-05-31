import mongoose from 'mongoose';

export interface IDBConfigs {
  url: string;
  options: mongoose.ConnectOptions;
  connection: mongoose.Mongoose;
}
