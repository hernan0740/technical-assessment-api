import {
  ExecutionStatus,
  ProgrammingLanguage,
} from '../execution/execution.types';

export type SubmissionStatus =
  | 'PASSED'
  | 'PARTIAL'
  | 'FAILED';

export interface SubmitAnswerInput {
  assessmentId: string;
  questionId: string;
  candidate: string;
  language: ProgrammingLanguage;
  sourceCode: string;
}

export interface TestCaseResult {
  index: number;
  passed: boolean;
  executionStatus: ExecutionStatus;
  isPrivate: boolean;
}

export interface CreateSubmissionRecordInput {
  assessmentId: string;
  questionId: string;
  candidate: string;
  language: ProgrammingLanguage;
  sourceCode: string;
  status: SubmissionStatus;
  passedTests: number;
  totalTests: number;
  score: number;
  maxScore: number;
  testResults: TestCaseResult[];
}

export interface Submission
  extends CreateSubmissionRecordInput {
  id: string;
  createdAt: Date;
}

export interface SubmissionResult {
  id: string;
  assessmentId: string;
  questionId: string;
  candidate: string;
  language: ProgrammingLanguage;
  status: SubmissionStatus;
  passedTests: number;
  totalTests: number;
  score: number;
  maxScore: number;
  testResults: TestCaseResult[];
  createdAt: Date;
}