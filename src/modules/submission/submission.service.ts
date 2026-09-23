import { CodeExecutor } from '../execution/code-executor';
import { QuestionStore } from '../question/question.store';
import { SubmissionNotFoundError } from './submission.errors';
import { SubmissionValidationError } from './submission.errors';
import { SubmissionStore } from './submission.store';
import {
  Submission,
  SubmissionResult,
  SubmissionStatus,
  SubmitAnswerInput,
  TestCaseResult,
} from './submission.types';

export class SubmissionService {
  constructor(
    private readonly submissionStore: SubmissionStore,
    private readonly questionStore: QuestionStore,
    private readonly codeExecutor: CodeExecutor,
  ) {}

  async submit(
    input: SubmitAnswerInput,
  ): Promise<SubmissionResult> {
    this.validateInput(input);

    const question =
      await this.questionStore.findById(input.questionId);

    if (!question) {
      throw new SubmissionNotFoundError(
        'Question not found',
      );
    }

    if (question.assessmentId !== input.assessmentId) {
      throw new SubmissionNotFoundError(
        'Question does not belong to the assessment',
      );
    }

    if (
      !question.allowedLanguages.includes(input.language)
    ) {
      throw new SubmissionValidationError(
        'Language is not allowed for this question',
      );
    }

    const testResults: TestCaseResult[] = [];

    for (
      let index = 0;
      index < question.testCases.length;
      index += 1
    ) {
      const testCase = question.testCases[index];

      const execution =
        await this.codeExecutor.execute({
          language: input.language,
          sourceCode: input.sourceCode,
          stdin: testCase.input,
        });

      const passed =
        execution.status === 'SUCCESS' &&
        this.normalizeOutput(execution.stdout) ===
          this.normalizeOutput(
            testCase.expectedOutput,
          );

      testResults.push({
        index: index + 1,
        passed,
        executionStatus: execution.status,
        isPrivate: testCase.isPrivate,
      });
    }

    const totalTests = testResults.length;

    const passedTests = testResults.filter(
      (result) => result.passed,
    ).length;

    const score = Number(
      (
        (passedTests / totalTests) *
        question.score
      ).toFixed(2),
    );

    const status =
      this.calculateSubmissionStatus(
        passedTests,
        totalTests,
      );

    const submission =
      await this.submissionStore.create({
        assessmentId: input.assessmentId,
        questionId: input.questionId,
        candidate: input.candidate.trim(),
        language: input.language,
        sourceCode: input.sourceCode,
        status,
        timeSpentSeconds: input.timeSpentSeconds,
        passedTests,
        totalTests,
        score,
        maxScore: question.score,
        testResults,
      });

        console.info(
          JSON.stringify({
            event: 'submission.saved',
            assessmentId: submission.assessmentId,
            questionId: submission.questionId,
            submissionId: submission.id,
            status: submission.status,
            score: submission.score,
          }),
        )

    return this.toSubmissionResult(submission);
  }

  async findById(
    id: string,
  ): Promise<SubmissionResult | null> {
    const submission =
      await this.submissionStore.findById(id);

    return submission
      ? this.toSubmissionResult(submission)
      : null;
  }

  private validateInput(
    input: SubmitAnswerInput,
  ): void {
    if (!input.assessmentId?.trim()) {
      throw new SubmissionValidationError(
        'Assessment id is required',
      );
    }

    if (!input.questionId?.trim()) {
      throw new SubmissionValidationError(
        'Question id is required',
      );
    }

    if (!input.candidate?.trim()) {
      throw new SubmissionValidationError(
        'Candidate is required',
      );
    }

    if (!input.language) {
      throw new SubmissionValidationError(
        'Language is required',
      );
    }

    if (
      typeof input.sourceCode !== 'string' ||
      !input.sourceCode.trim()
    ) {
      throw new SubmissionValidationError(
        'Source code is required',
      );
    }
    if (
        !Number.isFinite(input.timeSpentSeconds) ||
        input.timeSpentSeconds < 0
        ) {
        throw new SubmissionValidationError(
            'Time spent must be a valid value',
        )
        }
  }

  private normalizeOutput(
    output: string | null,
  ): string {
    return (output ?? '')
      .replace(/\r\n/g, '\n')
      .trim();
  }

  private calculateSubmissionStatus(
    passedTests: number,
    totalTests: number,
  ): SubmissionStatus {
    if (passedTests === totalTests) {
      return 'PASSED';
    }

    if (passedTests === 0) {
      return 'FAILED';
    }

    return 'PARTIAL';
  }

  private toSubmissionResult(
  submission: Submission,
): SubmissionResult {
  return {
    id: submission.id,
    assessmentId: submission.assessmentId,
    questionId: submission.questionId,
    candidate: submission.candidate,
    language: submission.language,
    status: submission.status,
    timeSpentSeconds: submission.timeSpentSeconds,
    passedTests: submission.passedTests,
    totalTests: submission.totalTests,
    score: submission.score,
    maxScore: submission.maxScore,
    testResults: submission.testResults,
    createdAt: submission.createdAt,
  };
}
}