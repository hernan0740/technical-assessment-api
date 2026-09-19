export type ProgrammingLanguage =
  | 'java'
  | 'javascript'
  | 'python';

export interface TestCase {
  input: string;
  expectedOutput: string;
  isPrivate: boolean;
}

export interface Question {
  id: string;
  assessmentId: string;
  title: string;
  description: string;
  allowedLanguages: ProgrammingLanguage[];
  testCases: TestCase[];
  score: number;
  createdAt: Date;
}

export interface CreateQuestionInput {
  assessmentId: string;
  title: string;
  description: string;
  allowedLanguages: ProgrammingLanguage[];
  testCases: TestCase[];
  score: number;
}

export interface PublicTestCase {
  input: string;
  expectedOutput: string;
}

export interface PublicQuestion {
  id: string;
  assessmentId: string;
  title: string;
  description: string;
  allowedLanguages: ProgrammingLanguage[];
  testCases: PublicTestCase[];
  score: number;
  createdAt: Date;
}