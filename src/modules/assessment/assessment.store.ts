import {
  Assessment,
  CreateAssessmentInput,
  UpdateAssessmentInput,
} from './assessment.types';

export interface AssessmentStore {
  create(
    input: CreateAssessmentInput,
  ): Promise<Assessment>;

  findAll(): Promise<Assessment[]>;

  findById(
    id: string,
  ): Promise<Assessment | null>;

  update(
    id: string,
    input: UpdateAssessmentInput,
  ): Promise<Assessment | null>;

  delete(
    id: string,
  ): Promise<boolean>;

  adjustQuestionCount(
    id: string,
    delta: number,
  ): Promise<boolean>;
}