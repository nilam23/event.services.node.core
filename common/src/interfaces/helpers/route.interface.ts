import { IUser } from '@interfaces/users/user.interface';
import { Router } from 'express';
import { Request } from 'express';

export interface IExpressRoute {
  path: string;
  router: Router;
}

export interface IReqWithAuth extends Request {
  user: IUser;
  files?: Express.Multer.File[];
}
