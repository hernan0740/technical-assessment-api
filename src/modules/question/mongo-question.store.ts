import { ObjectId, WithId } from 'mongodb';
import { getDatabase } from '../../infrastructure/database/mongo';
import { QuestionStore } from './question.store';
import {
  CreateQuestionInput,
  Question,
  TestCase,
} from './question.types';

interface MongoQuestionDocument {
  assessmentId: string;
  title: string;
  description: string;
  allowedLanguages: string[];
  testCases: TestCase[];
  score: number;
  createdAt: Date;
}

export class MongoQuestionStore implements QuestionStore {
  private getCollection() {
    return getDatabase().collection<MongoQuestionDocument>('questions');
  }

  async create(input: CreateQuestionInput): Promise<Question> {
    const document: MongoQuestionDocument = {
      assessmentId: input.assessmentId,
      title: input.title,
      description: input.description,
      allowedLanguages: input.allowedLanguages,
      testCases: input.testCases,
      score: input.score,
      createdAt: new Date(),
    };

    const result = await this.getCollection().insertOne(document);

    return {
      id: result.insertedId.toHexString(),
      assessmentId: document.assessmentId,
      title: document.title,
      description: document.description,
      allowedLanguages: input.allowedLanguages,
      testCases: document.testCases,
      score: document.score,
      createdAt: document.createdAt,
    };
  }

  async findByAssessmentId(
    assessmentId: string,
  ): Promise<Question[]> {
    const documents = await this.getCollection()
      .find({ assessmentId })
      .sort({ createdAt: 1 })
      .toArray();

    return documents.map((document) =>
      this.toQuestion(document),
    );
  }

  async findById(id: string): Promise<Question | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const document = await this.getCollection().findOne({
      _id: new ObjectId(id),
    });

    return document ? this.toQuestion(document) : null;
  }

  private toQuestion(
    document: WithId<MongoQuestionDocument>,
  ): Question {
    return {
      id: document._id.toHexString(),
      assessmentId: document.assessmentId,
      title: document.title,
      description: document.description,
      allowedLanguages:
        document.allowedLanguages as Question['allowedLanguages'],
      testCases: document.testCases,
      score: document.score,
      createdAt: document.createdAt,
    };
  }
}