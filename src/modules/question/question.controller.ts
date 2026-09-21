import { Request, Response } from 'express'

import { QuestionService } from './question.service'

import {
  CreateQuestionInput,
  UpdateQuestionInput,
} from './question.types'

interface AssessmentParams {
  assessmentId: string
}

interface QuestionParams {
  id: string
}

type CreateQuestionBody = Omit<
  CreateQuestionInput,
  'assessmentId'
>

export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
  ) {}

  create = async (
    req: Request<
      AssessmentParams,
      unknown,
      CreateQuestionBody
    >,
    res: Response,
  ): Promise<void> => {
    try {
      const { assessmentId } = req.params

      const question =
        await this.questionService.create({
          ...req.body,
          assessmentId,
        })

      res.status(201).json(question)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to create question'

      res.status(400).json({ message })
    }
  }

  findByAssessmentId = async (
    req: Request<AssessmentParams>,
    res: Response,
  ): Promise<void> => {
    const { assessmentId } = req.params

    const questions =
      await this.questionService.findByAssessmentId(
        assessmentId,
      )

    res.status(200).json(questions)
  }

  findById = async (
    req: Request<QuestionParams>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.params

    const question =
      await this.questionService.findById(id)

    if (!question) {
      res.status(404).json({
        message: 'Question not found',
      })
      return
    }

    res.status(200).json(question)
  }

  update = async (
    req: Request<
      QuestionParams,
      unknown,
      UpdateQuestionInput
    >,
    res: Response,
  ): Promise<void> => {
    try {
      const { id } = req.params

      const question =
        await this.questionService.update(
          id,
          req.body,
        )

      if (!question) {
        res.status(404).json({
          message: 'Question not found',
        })
        return
      }

      res.status(200).json(question)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to update question'

      res.status(400).json({ message })
    }
  }

  delete = async (
    req: Request<QuestionParams>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.params

    const deleted =
      await this.questionService.delete(id)

    if (!deleted) {
      res.status(404).json({
        message: 'Question not found',
      })
      return
    }

    res.status(204).send()
  }
}