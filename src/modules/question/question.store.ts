import {
  CreateQuestionInput,
  Question,
  UpdateQuestionInput,
} from './question.types'

export interface QuestionStore {
  create(
    input: CreateQuestionInput,
  ): Promise<Question>

  findByAssessmentId(
    assessmentId: string,
  ): Promise<Question[]>

  findById(
    id: string,
  ): Promise<Question | null>

  update(
    id: string,
    input: UpdateQuestionInput,
  ): Promise<Question | null>

  delete(
    id: string,
  ): Promise<boolean>

  deleteByAssessmentId(
    assessmentId: string,
  ): Promise<number>
}