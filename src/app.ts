import express from 'express';
import { assessmentRouter } from './modules/assessment/assessment.routes';

export const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
  });
});

app.use('/assessments', assessmentRouter);