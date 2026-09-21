import { Router } from 'express';

import { MongoQuestionStore } from '../question/mongo-question.store';
import { MongoSubmissionStore } from '../submission/mongo-submission.store';

import { AssessmentController } from './assessment.controller';
import { AssessmentService } from './assessment.service';
import { MongoAssessmentStore } from './mongo-assessment.store';

const assessmentStore =
  new MongoAssessmentStore();

const questionStore =
  new MongoQuestionStore();

const submissionStore =
  new MongoSubmissionStore();

const assessmentService =
  new AssessmentService(
    assessmentStore,
    questionStore,
    submissionStore,
  );

const assessmentController =
  new AssessmentController(
    assessmentService,
  );

export const assessmentRouter =
  Router();

assessmentRouter.post(
  '/',
  assessmentController.create,
);

assessmentRouter.get(
  '/',
  assessmentController.findAll,
);

assessmentRouter.get(
  '/:id',
  assessmentController.findById,
);

assessmentRouter.put(
  '/:id',
  assessmentController.update,
);

assessmentRouter.delete(
  '/:id',
  assessmentController.delete,
);