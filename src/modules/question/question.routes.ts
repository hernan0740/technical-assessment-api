import { Router } from 'express';

import { MongoAssessmentStore } from '../assessment/mongo-assessment.store';
import { MongoSubmissionStore } from '../submission/mongo-submission.store';

import { MongoQuestionStore } from './mongo-question.store';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

const questionStore =
  new MongoQuestionStore();

const submissionStore =
  new MongoSubmissionStore();

const assessmentStore =
  new MongoAssessmentStore();

const questionService =
  new QuestionService(
    questionStore,
    submissionStore,
    assessmentStore,
  );

const questionController =
  new QuestionController(
    questionService,
  );

export const questionRouter =
  Router();

questionRouter.post(
  '/assessments/:assessmentId/questions',
  questionController.create,
);

questionRouter.get(
  '/assessments/:assessmentId/questions',
  questionController.findByAssessmentId,
);

questionRouter.get(
  '/questions/:id',
  questionController.findById,
);

questionRouter.put(
  '/questions/:id',
  questionController.update,
);

questionRouter.delete(
  '/questions/:id',
  questionController.delete,
);