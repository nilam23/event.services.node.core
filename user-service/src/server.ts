import { App } from '@app';
import { IndexRoutes } from '@routes/index.route';

const app = new App([new IndexRoutes()]);

app.listen();
