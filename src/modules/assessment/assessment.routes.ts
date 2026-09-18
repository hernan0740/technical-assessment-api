import { Router } from 'express';
import { AssessmentController } from './assessment.controller';
import { AssessmentService } from './assessment.service';
import { MongoAssessmentStore } from './mongo-assessment.store';

const assessmentStore = new MongoAssessmentStore();
const assessmentService = new AssessmentService(assessmentStore);
const assessmentController = new AssessmentController(assessmentService);

export const assessmentRouter = Router();

assessmentRouter.post('/', assessmentController.create);
assessmentRouter.get('/', assessmentController.findAll);
assessmentRouter.put('/:id', assessmentController.update);
assessmentRouter.delete('/:id', assessmentController.delete);