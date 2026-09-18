import express from 'express';
import { assessmentRouter } from './modules/assessment/assessment.routes';
import cors from 'cors';

export const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  }),
);

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
  });
});

app.use('/assessments', assessmentRouter);