import {
  CreateSubmissionRecordInput,
  Submission,
} from './submission.types';

export interface SubmissionStore {
  create(
    input: CreateSubmissionRecordInput,
  ): Promise<Submission>;

  findById(
    id: string,
  ): Promise<Submission | null>;

  deleteByQuestionId(
    questionId: string,
  ): Promise<number>;

  deleteByAssessmentId(
    assessmentId: string,
  ): Promise<number>;
}