import 'tsconfig-paths/register';
import { env } from '@app/config/environment';

import { errorMiddleware, httpLogger, expressStatusMonitor, corsMiddleware } from '@app/middleware';
import { ping as pingPostgresDatabase } from './db/knex';
import { initRoutes } from './routes';
import { initApolloGraphqlServer } from './graphql';

import { createServer } from 'http';
import compression from 'compression';
import helmet from 'helmet';
import express from 'express';
import { User } from './db/models';

const app = express();

(async () => {
  // Test Postgres DB
  try {
    await pingPostgresDatabase();
  } catch {
    return;
  }

  const result = await User.query()
    .select()
    .orderBy('firstName')
    .orderBy('lastName')
    .limit(5)
    .nextCursorPage();

  // tslint:disable-next-line: no-console
  console.log('result', JSON.stringify(result, null, 2));

  app.use(corsMiddleware());
  app.use(express.json());
  app.use(helmet());
  app.use(compression());
  app.use(expressStatusMonitor());
  app.use(httpLogger);

  initRoutes(app);

  app.use(errorMiddleware());
  const apolloServer = initApolloGraphqlServer(app);

  // For the subscription server
  const httpServer = createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);

  httpServer.listen(env.port, () => {
    console.info(`Server is now up @ ${env.port}`);
  });
})();
