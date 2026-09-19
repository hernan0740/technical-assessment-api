import { QuestionStore } from './question.store';
import {
  CreateQuestionInput,
  ProgrammingLanguage,
  PublicQuestion,
  Question,
} from './question.types';

const SUPPORTED_LANGUAGES: ProgrammingLanguage[] = [
  'java',
  'javascript',
  'python',
];

export class QuestionService {
  constructor(private readonly questionStore: QuestionStore) {}

  async create(input: CreateQuestionInput): Promise<PublicQuestion> {
    this.validateCreateInput(input);

    const question = await this.questionStore.create({
      ...input,
      title: input.title.trim(),
      description: input.description.trim(),
    });

    return this.toPublicQuestion(question);
  }

  async findByAssessmentId(
    assessmentId: string,
  ): Promise<PublicQuestion[]> {
    const questions =
      await this.questionStore.findByAssessmentId(assessmentId);

    return questions.map((question) =>
      this.toPublicQuestion(question),
    );
  }

  async findById(id: string): Promise<PublicQuestion | null> {
    const question = await this.questionStore.findById(id);

    return question
      ? this.toPublicQuestion(question)
      : null;
  }

  private validateCreateInput(input: CreateQuestionInput): void {
    if (!input.assessmentId?.trim()) {
      throw new Error('Assessment id is required');
    }

    if (!input.title?.trim()) {
      throw new Error('Question title is required');
    }

    if (!input.description?.trim()) {
      throw new Error('Question description is required');
    }

    if (
      !Array.isArray(input.allowedLanguages) ||
      input.allowedLanguages.length === 0
    ) {
      throw new Error(
        'At least one programming language is required',
      );
    }

    const hasUnsupportedLanguage =
      input.allowedLanguages.some(
        (language) =>
          !SUPPORTED_LANGUAGES.includes(language),
      );

    if (hasUnsupportedLanguage) {
      throw new Error('Unsupported programming language');
    }

    if (
      !Array.isArray(input.testCases) ||
      input.testCases.length === 0
    ) {
      throw new Error('At least one test case is required');
    }

    if (input.score <= 0) {
      throw new Error('Score must be greater than zero');
    }
  }

  private toPublicQuestion(
    question: Question,
  ): PublicQuestion {
    return {
      id: question.id,
      assessmentId: question.assessmentId,
      title: question.title,
      description: question.description,
      allowedLanguages: question.allowedLanguages,
      testCases: question.testCases
        .filter((testCase) => !testCase.isPrivate)
        .map((testCase) => ({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
        })),
      score: question.score,
      createdAt: question.createdAt,
    };
  }
}