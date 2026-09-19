import {
  CreateSubmissionRecordInput,
  Submission,
} from './submission.types';

export interface SubmissionStore {
  create(
    input: CreateSubmissionRecordInput,
  ): Promise<Submission>;

  findById(id: string): Promise<Submission | null>;
}