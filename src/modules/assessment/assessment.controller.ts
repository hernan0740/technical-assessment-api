import { Request, Response } from 'express';
import { AssessmentService } from './assessment.service';
import {
  CreateAssessmentInput,
  UpdateAssessmentInput,
} from './assessment.types';

interface AssessmentParams {
  id: string;
}

export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const input = req.body as CreateAssessmentInput;

      const assessment = await this.assessmentService.create(input);

      res.status(201).json(assessment);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to create assessment';

      res.status(400).json({ message });
    }
  };

  findAll = async (_req: Request, res: Response): Promise<void> => {
    const assessments = await this.assessmentService.findAll();

    res.status(200).json(assessments);
  };

  update = async (
  req: Request<AssessmentParams>,
  res: Response,
): Promise<void> => {
    try {
      const { id } = req.params;
      const input = req.body as UpdateAssessmentInput;

      const assessment = await this.assessmentService.update(id, input);

      if (!assessment) {
        res.status(404).json({
          message: 'Assessment not found',
        });
        return;
      }

      res.status(200).json(assessment);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to update assessment';

      res.status(400).json({ message });
    }
  };

  delete = async (
  req: Request<AssessmentParams>,
  res: Response,
): Promise<void> => {
    const { id } = req.params;

    const deleted = await this.assessmentService.delete(id);

    if (!deleted) {
      res.status(404).json({
        message: 'Assessment not found',
      });
      return;
    }

    res.status(204).send();
  };
}