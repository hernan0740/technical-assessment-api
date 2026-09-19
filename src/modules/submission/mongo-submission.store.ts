import { ObjectId, WithId } from 'mongodb';
import { getDatabase } from '../../infrastructure/database/mongo';
import { SubmissionStore } from './submission.store';
import {
  CreateSubmissionRecordInput,
  Submission,
  SubmissionStatus,
  TestCaseResult,
} from './submission.types';
import { ProgrammingLanguage } from '../execution/execution.types';

interface MongoSubmissionDocument {
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
  createdAt: Date;
}

export class MongoSubmissionStore
  implements SubmissionStore
{
  private getCollection() {
    return getDatabase().collection<MongoSubmissionDocument>(
      'submissions',
    );
  }

  async create(
    input: CreateSubmissionRecordInput,
  ): Promise<Submission> {
    const document: MongoSubmissionDocument = {
      ...input,
      createdAt: new Date(),
    };

    const result =
      await this.getCollection().insertOne(document);

    return {
      id: result.insertedId.toHexString(),
      assessmentId: document.assessmentId,
      questionId: document.questionId,
      candidate: document.candidate,
      language: document.language,
      sourceCode: document.sourceCode,
      status: document.status,
      passedTests: document.passedTests,
      totalTests: document.totalTests,
      score: document.score,
      maxScore: document.maxScore,
      testResults: document.testResults,
      createdAt: document.createdAt,
    };
  }

  async findById(
    id: string,
  ): Promise<Submission | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const document = await this.getCollection().findOne({
      _id: new ObjectId(id),
    });

    return document
      ? this.toSubmission(document)
      : null;
  }

  private toSubmission(
    document: WithId<MongoSubmissionDocument>,
  ): Submission {
    return {
      id: document._id.toHexString(),
      assessmentId: document.assessmentId,
      questionId: document.questionId,
      candidate: document.candidate,
      language: document.language,
      sourceCode: document.sourceCode,
      status: document.status,
      passedTests: document.passedTests,
      totalTests: document.totalTests,
      score: document.score,
      maxScore: document.maxScore,
      testResults: document.testResults,
      createdAt: document.createdAt,
    };
  }
}