import type { AssessmentStore } from '../assessment/assessment.store';
import type { SubmissionStore } from '../submission/submission.store';

import type { QuestionStore } from './question.store';

import {
  CreateQuestionInput,
  ProgrammingLanguage,
  PublicQuestion,
  Question,
  UpdateQuestionInput,
} from './question.types';

const SUPPORTED_LANGUAGES:
  ProgrammingLanguage[] = [
    'java',
    'javascript',
    'python',
  ];

export class QuestionService {
  constructor(
    private readonly questionStore:
      QuestionStore,

    private readonly submissionStore:
      SubmissionStore,

    private readonly assessmentStore:
      AssessmentStore,
  ) {}

  async create(
    input: CreateQuestionInput,
  ): Promise<PublicQuestion> {
    this.validateCreateInput(
      input,
    );

    const assessment =
      await this.assessmentStore
        .findById(
          input.assessmentId,
        );

    if (!assessment) {
      throw new Error(
        'Assessment not found',
      );
    }

    const question =
      await this.questionStore
        .create({
          ...input,

          title:
            input.title.trim(),

          description:
            input.description.trim(),
        });

    await this.assessmentStore
      .adjustQuestionCount(
        input.assessmentId,
        1,
      );

    return this.toPublicQuestion(
      question,
    );
  }

  async findByAssessmentId(
    assessmentId: string,
  ): Promise<PublicQuestion[]> {
    const questions =
      await this.questionStore
        .findByAssessmentId(
          assessmentId,
        );

    return questions.map(
      (question) =>
        this.toPublicQuestion(
          question,
        ),
    );
  }

  async findById(
    id: string,
  ): Promise<PublicQuestion | null> {
    const question =
      await this.questionStore
        .findById(id);

    return question
      ? this.toPublicQuestion(
          question,
        )
      : null;
  }

  async update(
    id: string,
    input: UpdateQuestionInput,
  ): Promise<PublicQuestion | null> {
    const updateInput:
      UpdateQuestionInput = {};

    if (
      input.title !== undefined
    ) {
      updateInput.title =
        input.title.trim();
    }

    if (
      input.description !== undefined
    ) {
      updateInput.description =
        input.description.trim();
    }

    if (
      input.allowedLanguages !==
      undefined
    ) {
      updateInput.allowedLanguages =
        input.allowedLanguages;
    }

    if (
      input.score !== undefined
    ) {
      updateInput.score =
        input.score;
    }

    this.validateUpdateInput(
      updateInput,
    );

    const question =
      await this.questionStore
        .update(
          id,
          updateInput,
        );

    return question
      ? this.toPublicQuestion(
          question,
        )
      : null;
  }

  async delete(
    id: string,
  ): Promise<boolean> {
    const question =
      await this.questionStore
        .findById(id);

    if (!question) {
      return false;
    }

    await this.submissionStore
      .deleteByQuestionId(id);

    const deleted =
      await this.questionStore
        .delete(id);

    if (!deleted) {
      return false;
    }

    await this.assessmentStore
      .adjustQuestionCount(
        question.assessmentId,
        -1,
      );

    return true;
  }

  private validateCreateInput(
    input: CreateQuestionInput,
  ): void {
    if (
      !input.assessmentId?.trim()
    ) {
      throw new Error(
        'Assessment id is required',
      );
    }

    if (
      !input.title?.trim()
    ) {
      throw new Error(
        'Question title is required',
      );
    }

    if (
      !input.description?.trim()
    ) {
      throw new Error(
        'Question description is required',
      );
    }

    this.validateLanguages(
      input.allowedLanguages,
    );

    if (
      !Array.isArray(
        input.testCases,
      ) ||
      input.testCases.length === 0
    ) {
      throw new Error(
        'At least one test case is required',
      );
    }

    if (
      input.score <= 0
    ) {
      throw new Error(
        'Score must be greater than zero',
      );
    }
  }

  private validateUpdateInput(
    input: UpdateQuestionInput,
  ): void {
    if (
      Object.keys(input).length ===
      0
    ) {
      throw new Error(
        'At least one editable field must be provided',
      );
    }

    if (
      input.title !== undefined &&
      !input.title.trim()
    ) {
      throw new Error(
        'Question title cannot be empty',
      );
    }

    if (
      input.description !==
        undefined &&
      !input.description.trim()
    ) {
      throw new Error(
        'Question description cannot be empty',
      );
    }

    if (
      input.allowedLanguages !==
      undefined
    ) {
      this.validateLanguages(
        input.allowedLanguages,
      );
    }

    if (
      input.score !== undefined &&
      input.score <= 0
    ) {
      throw new Error(
        'Score must be greater than zero',
      );
    }
  }

  private validateLanguages(
    languages:
      ProgrammingLanguage[],
  ): void {
    if (
      !Array.isArray(
        languages,
      ) ||
      languages.length === 0
    ) {
      throw new Error(
        'At least one programming language is required',
      );
    }

    const hasUnsupportedLanguage =
      languages.some(
        (language) =>
          !SUPPORTED_LANGUAGES
            .includes(language),
      );

    if (
      hasUnsupportedLanguage
    ) {
      throw new Error(
        'Unsupported programming language',
      );
    }
  }

  private toPublicQuestion(
    question: Question,
  ): PublicQuestion {
    return {
      id:
        question.id,

      assessmentId:
        question.assessmentId,

      title:
        question.title,

      description:
        question.description,

      allowedLanguages:
        question.allowedLanguages,

      testCases:
        question.testCases
          .filter(
            (testCase) =>
              !testCase.isPrivate,
          )
          .map(
            (testCase) => ({
              input:
                testCase.input,

              expectedOutput:
                testCase.expectedOutput,
            }),
          ),

      score:
        question.score,

      createdAt:
        question.createdAt,
    };
  }
}