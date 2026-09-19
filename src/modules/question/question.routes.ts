import { Router } from 'express';
import { MongoQuestionStore } from './mongo-question.store';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

const questionStore = new MongoQuestionStore();
const questionService = new QuestionService(questionStore);
const questionController =
  new QuestionController(questionService);

export const questionRouter = Router();

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