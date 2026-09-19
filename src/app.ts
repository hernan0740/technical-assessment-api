import express from 'express';
import { assessmentRouter } from './modules/assessment/assessment.routes';
import cors from 'cors';
import { executionRouter } from './modules/execution/execution.routes';
import { questionRouter } from './modules/question/question.routes';
import { submissionRouter } from './modules/submission/submission.routes';


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
app.use('/executions', executionRouter);
app.use(questionRouter);
app.use('/submissions', submissionRouter);