import {
  ObjectId,
  WithId,
} from 'mongodb';

import { getDatabase } from '../../infrastructure/database/mongo';

import { AssessmentStore } from './assessment.store';

import {
  Assessment,
  CreateAssessmentInput,
  UpdateAssessmentInput,
} from './assessment.types';

interface MongoAssessmentDocument {
  name: string;
  description: string;
  timeLimitMinutes: number;
  questionCount: number;
  createdAt: Date;
}

export class MongoAssessmentStore
  implements AssessmentStore
{
  private getCollection() {
    return getDatabase()
      .collection<MongoAssessmentDocument>(
        'assessments',
      );
  }

  async create(
    input: CreateAssessmentInput,
  ): Promise<Assessment> {
    const document: MongoAssessmentDocument = {
      ...input,
      questionCount: 0,
      createdAt: new Date(),
    };

    const result =
      await this.getCollection()
        .insertOne(document);

    return {
      id: result.insertedId.toHexString(),
      name: document.name,
      description: document.description,
      timeLimitMinutes:
        document.timeLimitMinutes,
      questionCount:
        document.questionCount,
      createdAt: document.createdAt,
    };
  }

  async findAll(): Promise<Assessment[]> {
    const documents =
      await this.getCollection()
        .find()
        .sort({
          createdAt: -1,
        })
        .toArray();

    return documents.map(
      (document) =>
        this.toAssessment(document),
    );
  }

  async findById(
    id: string,
  ): Promise<Assessment | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const document =
      await this.getCollection()
        .findOne({
          _id: new ObjectId(id),
        });

    return document
      ? this.toAssessment(document)
      : null;
  }

  async update(
    id: string,
    input: UpdateAssessmentInput,
  ): Promise<Assessment | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const objectId =
      new ObjectId(id);

    const updateFields:
      UpdateAssessmentInput = {};

    if (input.name !== undefined) {
      updateFields.name =
        input.name;
    }

    if (
      input.description !== undefined
    ) {
      updateFields.description =
        input.description;
    }

    if (
      input.timeLimitMinutes !==
      undefined
    ) {
      updateFields.timeLimitMinutes =
        input.timeLimitMinutes;
    }

    const result =
      await this.getCollection()
        .updateOne(
          {
            _id: objectId,
          },
          {
            $set: updateFields,
          },
        );

    if (
      result.matchedCount === 0
    ) {
      return null;
    }

    const document =
      await this.getCollection()
        .findOne({
          _id: objectId,
        });

    return document
      ? this.toAssessment(document)
      : null;
  }

  async delete(
    id: string,
  ): Promise<boolean> {
    if (!ObjectId.isValid(id)) {
      return false;
    }

    const result =
      await this.getCollection()
        .deleteOne({
          _id: new ObjectId(id),
        });

    return (
      result.deletedCount === 1
    );
  }

  async adjustQuestionCount(
    id: string,
    delta: number,
  ): Promise<boolean> {
    if (!ObjectId.isValid(id)) {
      return false;
    }

    const result =
      await this.getCollection()
        .updateOne(
          {
            _id: new ObjectId(id),
          },
          {
            $inc: {
              questionCount: delta,
            },
          },
        );

    return (
      result.matchedCount === 1
    );
  }

  private toAssessment(
    document: WithId<MongoAssessmentDocument>,
  ): Assessment {
    return {
      id:
        document._id.toHexString(),

      name:
        document.name,

      description:
        document.description,

      timeLimitMinutes:
        document.timeLimitMinutes,

      questionCount:
        document.questionCount,

      createdAt:
        document.createdAt,
    };
  }
}