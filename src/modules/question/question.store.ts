import {
  CreateQuestionInput,
  Question,
} from './question.types';

export interface QuestionStore {
  create(input: CreateQuestionInput): Promise<Question>;

  findByAssessmentId(
    assessmentId: string,
  ): Promise<Question[]>;

  findById(id: string): Promise<Question | null>;
}