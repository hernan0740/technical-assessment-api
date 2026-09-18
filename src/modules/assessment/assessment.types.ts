export interface Assessment {
  id: string;
  name: string;
  description: string;
  timeLimitMinutes: number;
  questionCount: number;
  createdAt: Date;
}

export interface CreateAssessmentInput {
  name: string;
  description: string;
  timeLimitMinutes: number;
  questionCount: number;
}

export interface UpdateAssessmentInput {
  name?: string;
  description?: string;
  timeLimitMinutes?: number;
  questionCount?: number;
}