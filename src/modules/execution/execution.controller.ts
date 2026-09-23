import { Request, Response } from 'express';
import {
  CodeExecutionProviderError,
  ExecutionValidationError,
} from './execution.errors';
import { ExecutionService } from './execution.service';
import { RunCodeInput } from './execution.types';

export class ExecutionController {
  constructor(
    private readonly executionService: ExecutionService,
  ) {}

  run = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const input = (req.body ?? {}) as RunCodeInput;

      const result =
        await this.executionService.run(input);


      console.info(
        JSON.stringify({
          event: 'execution.result',
          status: result.status,
          stdout: result.stdout?.slice(0, 500) ?? '',
          stderr: result.stderr?.slice(0, 500) ?? '',
          compileOutput: result.compileOutput?.slice(0, 500) ?? '',
          timestamp: new Date().toISOString(),
        }),
      )

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ExecutionValidationError) {
        res.status(400).json({
          message: error.message,
        });
        return;
      }

      if (error instanceof CodeExecutionProviderError) {
        res.status(502).json({
          message: error.message,
        });
        return;
      }

      console.error('Unexpected execution error', error);

      res.status(500).json({
        message: 'Unable to execute code',
      });
    }
  };
}