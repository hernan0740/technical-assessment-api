import {
  ExecutionResult,
  RunCodeInput,
} from './execution.types';

export interface CodeExecutor {
  execute(input: RunCodeInput): Promise<ExecutionResult>;
}