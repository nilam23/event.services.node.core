import { CorsOptions } from 'cors';

const allowedOrigins: string[] = ['*'];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('Origin not allowed!'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
};
