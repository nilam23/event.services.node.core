import { MONGO_URI } from '@configs/env.config';
import { IDBConfigs } from '@bts-ubiquitous/events';

export const dbConfigs: IDBConfigs = {
  url: MONGO_URI,
  options: {
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000,
  },
  connection: null,
};
