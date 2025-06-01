import { App } from '@app';
import { IndexRoutes } from '@routes/index.route';
import { AuthRoutes } from '@routes/auth.route';

const app = new App([new IndexRoutes(), new AuthRoutes()]);

app.listen();
