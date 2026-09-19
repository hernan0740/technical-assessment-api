import { Router } from 'express';
import { Judge0Executor } from '../execution/judge0-executor';
import { MongoQuestionStore } from '../question/mongo-question.store';
import { MongoSubmissionStore } from './mongo-submission.store';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';

const submissionStore =
  new MongoSubmissionStore();

const questionStore =
  new MongoQuestionStore();

const codeExecutor =
  new Judge0Executor();

const submissionService =
  new SubmissionService(
    submissionStore,
    questionStore,
    codeExecutor,
  );

const submissionController =
  new SubmissionController(
    submissionService,
  );

export const submissionRouter = Router();

submissionRouter.post(
  '/',
  submissionController.submit,
);

submissionRouter.get(
  '/:id',
  submissionController.findById,
);