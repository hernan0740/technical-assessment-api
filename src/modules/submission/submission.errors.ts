export class SubmissionValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SubmissionValidationError';
  }
}

export class SubmissionNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SubmissionNotFoundError';
  }
}