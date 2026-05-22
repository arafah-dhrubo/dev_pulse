import express, { Application, Request, Response } from 'express';
import accountRoutes from "@/modules/account/account.route";
import issuesRoutes from "@/modules/issues/issues.route";
import { responseHandler } from './middlewares/response.middleware';
const app: Application = express();

app.use(express.json());
app.use(responseHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/api/account', accountRoutes);
app.use('/api/issues', issuesRoutes);

export default app;