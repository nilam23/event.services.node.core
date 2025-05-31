import { Router } from 'express';
import { IndexController } from '@controllers/index/index.controller';
import { IExpressRoute } from '@bts-ubiquitous/events';

export class IndexRoutes implements IExpressRoute {
  public path = '';
  public router = Router();
  public indexController = new IndexController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/ping`, this.indexController.ping);
    this.router.get(`${this.path}/fetch-logs`, this.indexController.fetchCloudWatchLogs);
  }
}
