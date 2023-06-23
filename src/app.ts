import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import invalidRouteHandler from './app/middlewares/invalidRouteHandler';

import routers from './app/routes';

const app: Application = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// application route
app.use('/api/v1', routers);

//test route
app.get('/', (req: Request, res: Response) => {
  const message = '<h1>Digital cow hut server is up and running! 🚀🚀🚀</h1>';
  res.send(message);
});

//invalid route handler
app.use(invalidRouteHandler);

//global error handler
app.use(globalErrorHandler);

export default app;
