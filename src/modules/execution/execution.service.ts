import { CodeExecutor } from './code-executor';
import { ExecutionValidationError } from './execution.errors';
import {
  ExecutionResult,
  ProgrammingLanguage,
  RunCodeInput,
} from './execution.types';

const SUPPORTED_LANGUAGES: ProgrammingLanguage[] = [
  'java',
  'javascript',
  'python',
];

export class ExecutionService {
  constructor(private readonly codeExecutor: CodeExecutor) {}

  async run(input: RunCodeInput): Promise<ExecutionResult> {
    this.validateInput(input);

    return this.codeExecutor.execute(input);
  }

  private validateInput(input: RunCodeInput): void {
    if (!SUPPORTED_LANGUAGES.includes(input.language)) {
      throw new ExecutionValidationError(
        `Unsupported language: ${input.language}`,
      );
    }

    if (
      typeof input.sourceCode !== 'string' ||
      !input.sourceCode.trim()
    ) {
      throw new ExecutionValidationError(
        'Source code is required',
      );
    }

    if (
      input.stdin !== undefined &&
      typeof input.stdin !== 'string'
    ) {
      throw new ExecutionValidationError(
        'stdin must be a string',
      );
    }
  }
}