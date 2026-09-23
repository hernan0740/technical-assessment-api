import { CodeExecutor } from './code-executor';
import { CodeExecutionProviderError } from './execution.errors';
import {
  ExecutionResult,
  ExecutionStatus,
  ProgrammingLanguage,
  RunCodeInput,
} from './execution.types';

const LANGUAGE_IDS: Record<ProgrammingLanguage, number> = {
  java: 62,
  javascript: 63,
  python: 71,
};

interface Judge0Status {
  id: number;
  description: string;
}

interface Judge0Response {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  time: string | null;
  memory: number | null;
  status: Judge0Status;
}

export class Judge0Executor implements CodeExecutor {
  async execute(input: RunCodeInput): Promise<ExecutionResult> {
    const apiUrl = process.env.JUDGE0_API_URL;

    if (!apiUrl) {
      throw new CodeExecutionProviderError(
        'JUDGE0_API_URL is not configured',
      );
    }

    const apiKey = process.env.JUDGE0_API_KEY;

    const timeout = Number(
      process.env.JUDGE0_REQUEST_TIMEOUT_MS || 15000,
    );

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (apiKey) {
      headers['X-RapidAPI-Key'] = apiKey;

      const host = new URL(apiUrl).host;

      headers['X-RapidAPI-Host'] = host;
    }

    console.info(
      JSON.stringify({
        event: 'judge0.execution.started',
        language: input.language,
        timestamp: new Date().toISOString(),
      }),
    )
    
    try {
      const response = await fetch(
        `${apiUrl}/submissions?base64_encoded=false&wait=true`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            language_id: LANGUAGE_IDS[input.language],
            source_code: input.sourceCode,
            stdin: input.stdin ?? '',
          }),
          signal: AbortSignal.timeout(timeout),
        },
      );

      if (!response.ok) {
        throw new CodeExecutionProviderError(
          `Judge0 responded with status ${response.status}`,
        );
      }

      const result =
        (await response.json()) as Judge0Response;

      return this.normalizeResult(result);
    } catch (error) {
      if (error instanceof CodeExecutionProviderError) {
        throw error;
      }

      if (
        error instanceof Error &&
        error.name === 'TimeoutError'
      ) {
        throw new CodeExecutionProviderError(
          'Judge0 request timed out',
        );
      }

      throw new CodeExecutionProviderError(
        'Unable to communicate with Judge0',
      );
    }
  }

  private normalizeResult(
    result: Judge0Response,
  ): ExecutionResult {
    return {
      status: this.mapStatus(result.status.id),
      stdout: result.stdout,
      stderr: result.stderr,
      compileOutput: result.compile_output,
      time: result.time ? Number(result.time) : null,
      memory: result.memory,
    };
  }

  private mapStatus(statusId: number): ExecutionStatus {
    if (statusId === 3) {
      return 'SUCCESS';
    }

    if (statusId === 5) {
      return 'TIMEOUT';
    }

    if (statusId === 6) {
      return 'COMPILATION_ERROR';
    }

    if (
      (statusId >= 7 && statusId <= 12) ||
      statusId === 14
    ) {
      return 'RUNTIME_ERROR';
    }

    return 'ERROR';
  }
}