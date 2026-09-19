import { Router } from 'express';
import { ExecutionController } from './execution.controller';
import { ExecutionService } from './execution.service';
import { Judge0Executor } from './judge0-executor';

const codeExecutor = new Judge0Executor();

const executionService =
  new ExecutionService(codeExecutor);

const executionController =
  new ExecutionController(executionService);

export const executionRouter = Router();

executionRouter.post(
  '/run',
  executionController.run,
);