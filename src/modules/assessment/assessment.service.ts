import type { QuestionStore } from '../question/question.store';
import type { SubmissionStore } from '../submission/submission.store';

import type { AssessmentStore } from './assessment.store';

import {
  Assessment,
  CreateAssessmentInput,
  UpdateAssessmentInput,
} from './assessment.types';

export class AssessmentService {
  constructor(
    private readonly assessmentStore:
      AssessmentStore,

    private readonly questionStore:
      QuestionStore,

    private readonly submissionStore:
      SubmissionStore,
  ) {}

  async create(
    input: CreateAssessmentInput,
  ): Promise<Assessment> {
    this.validateCreateInput(
      input,
    );

    return this.assessmentStore
      .create({
        ...input,

        name:
          input.name.trim(),

        description:
          input.description.trim(),
      });
  }

  async findAll(): Promise<
    Assessment[]
  > {
    return this.assessmentStore
      .findAll();
  }

  async findById(
    id: string,
  ): Promise<Assessment | null> {
    return this.assessmentStore
      .findById(id);
  }

  async update(
    id: string,
    input: UpdateAssessmentInput,
  ): Promise<Assessment | null> {
    this.validateUpdateInput(
      input,
    );

    return this.assessmentStore
      .update(id, {
        ...input,

        ...(input.name !==
          undefined && {
          name:
            input.name.trim(),
        }),

        ...(input.description !==
          undefined && {
          description:
            input.description.trim(),
        }),
      });
  }

  async delete(
    id: string,
  ): Promise<boolean> {
    const assessment =
      await this.assessmentStore
        .findById(id);

    if (!assessment) {
      return false;
    }

    await this.submissionStore
      .deleteByAssessmentId(id);

    await this.questionStore
      .deleteByAssessmentId(id);

    return this.assessmentStore
      .delete(id);
  }

  private validateCreateInput(
    input: CreateAssessmentInput,
  ): void {
    if (!input.name?.trim()) {
      throw new Error(
        'Assessment name is required',
      );
    }

    if (
      !input.description?.trim()
    ) {
      throw new Error(
        'Assessment description is required',
      );
    }

    if (
      input.timeLimitMinutes <= 0
    ) {
      throw new Error(
        'Time limit must be greater than zero',
      );
    }
  }

  private validateUpdateInput(
    input: UpdateAssessmentInput,
  ): void {
    if (
      Object.keys(input).length ===
      0
    ) {
      throw new Error(
        'At least one field must be provided',
      );
    }

    if (
      input.name !== undefined &&
      !input.name.trim()
    ) {
      throw new Error(
        'Assessment name cannot be empty',
      );
    }

    if (
      input.description !==
        undefined &&
      !input.description.trim()
    ) {
      throw new Error(
        'Assessment description cannot be empty',
      );
    }

    if (
      input.timeLimitMinutes !==
        undefined &&
      input.timeLimitMinutes <= 0
    ) {
      throw new Error(
        'Time limit must be greater than zero',
      );
    }
  }
}