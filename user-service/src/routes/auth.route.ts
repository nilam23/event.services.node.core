import { Router } from 'express';
import { IExpressRoute } from '@bts-ubiquitous/events';
import { AuthController } from '@controllers/auth/auth.controller';

export class AuthRoutes implements IExpressRoute {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, this.authController.signup);
    this.router.post(`${this.path}/signin`, this.authController.signin);
  }
}
