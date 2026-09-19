import { Request, Response } from 'express';
import { CodeExecutionProviderError } from '../execution/execution.errors';
import {
  SubmissionNotFoundError,
  SubmissionValidationError,
} from './submission.errors';
import { SubmissionService } from './submission.service';
import { SubmitAnswerInput } from './submission.types';

interface SubmissionParams {
  id: string;
}

export class SubmissionController {
  constructor(
    private readonly submissionService: SubmissionService,
  ) {}

  submit = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const input = (req.body ??
        {}) as SubmitAnswerInput;

      const result =
        await this.submissionService.submit(input);

      res.status(201).json(result);
    } catch (error) {
      if (error instanceof SubmissionValidationError) {
        res.status(400).json({
          message: error.message,
        });
        return;
      }

      if (error instanceof SubmissionNotFoundError) {
        res.status(404).json({
          message: error.message,
        });
        return;
      }

      if (
        error instanceof CodeExecutionProviderError
      ) {
        res.status(502).json({
          message: error.message,
        });
        return;
      }

      console.error(
        'Unexpected submission error',
        error,
      );

      res.status(500).json({
        message: 'Unable to submit answer',
      });
    }
  };

  findById = async (
    req: Request<SubmissionParams>,
    res: Response,
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const submission =
        await this.submissionService.findById(id);

      if (!submission) {
        res.status(404).json({
          message: 'Submission not found',
        });
        return;
      }

      res.status(200).json(submission);
    } catch (error) {
      console.error(
        'Unable to load submission',
        error,
      );

      res.status(500).json({
        message: 'Unable to load submission',
      });
    }
  };
}