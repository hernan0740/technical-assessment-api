import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mocked,
} from 'vitest'

import { SubmissionService } from '../submission.service'
import { SubmissionValidationError } from '../submission.errors'

import type { SubmissionStore } from '../submission.store'
import type { SubmitAnswerInput } from '../submission.types'
import { QuestionStore } from '../../question/question.store'
import { CodeExecutor } from '../../execution/code-executor'
import { Question } from '../../question/question.types'

describe('SubmissionService', () => {
  let submissionStore: Mocked<SubmissionStore>
  let questionStore: Mocked<QuestionStore>
  let codeExecutor: Mocked<CodeExecutor>
  let service: SubmissionService

  const question: Question = {
    id: 'question-1',
    assessmentId: 'assessment-1',
    title: 'Sum two numbers',
    description: 'Read two numbers and print the sum',
    allowedLanguages: ['javascript'],
    score: 20,
    testCases: [
      {
        input: '2 3',
        expectedOutput: '5',
        isPrivate: false,
      },
      {
        input: '10 25',
        expectedOutput: '35',
        isPrivate: true,
      },
    ],
    createdAt: new Date(),
  }

  const input: SubmitAnswerInput = {
    assessmentId: 'assessment-1',
    questionId: 'question-1',
    candidate: 'Pedro',
    language: 'javascript',
    sourceCode: 'console.log("test")',
    timeSpentSeconds: 30,
  }

  beforeEach(() => {
    submissionStore = {
      create: vi.fn(),
      findById: vi.fn(),
    }

    questionStore = {
      create: vi.fn(),
      findByAssessmentId: vi.fn(),
      findById: vi.fn(),
    }

    codeExecutor = {
      execute: vi.fn(),
    }

    service = new SubmissionService(
      submissionStore,
      questionStore,
      codeExecutor,
    )

    questionStore.findById.mockResolvedValue(question)

    submissionStore.create.mockImplementation(
      async (submission) => ({
        id: 'submission-1',
        ...submission,
        createdAt: new Date(),
      }),
    )
  })

  it('should return PASSED and full score when all tests pass', async () => {
    codeExecutor.execute
      .mockResolvedValueOnce({
        status: 'SUCCESS',
        stdout: '5\n',
        stderr: null,
        compileOutput: null,
        time: 0.1,
        memory: 1000,
      })
      .mockResolvedValueOnce({
        status: 'SUCCESS',
        stdout: '35\n',
        stderr: null,
        compileOutput: null,
        time: 0.1,
        memory: 1000,
      })

    const result = await service.submit(input)

    expect(result.status).toBe('PASSED')
    expect(result.passedTests).toBe(2)
    expect(result.totalTests).toBe(2)
    expect(result.score).toBe(20)
    expect(result.timeSpentSeconds).toBe(30)
  })

  it('should return PARTIAL and partial score when one test passes', async () => {
    codeExecutor.execute
      .mockResolvedValueOnce({
        status: 'SUCCESS',
        stdout: '5',
        stderr: null,
        compileOutput: null,
        time: 0.1,
        memory: 1000,
      })
      .mockResolvedValueOnce({
        status: 'SUCCESS',
        stdout: '99',
        stderr: null,
        compileOutput: null,
        time: 0.1,
        memory: 1000,
      })

    const result = await service.submit(input)

    expect(result.status).toBe('PARTIAL')
    expect(result.passedTests).toBe(1)
    expect(result.totalTests).toBe(2)
    expect(result.score).toBe(10)
  })

  it('should return FAILED and zero score when all tests fail', async () => {
    codeExecutor.execute.mockResolvedValue({
      status: 'SUCCESS',
      stdout: 'wrong output',
      stderr: null,
      compileOutput: null,
      time: 0.1,
      memory: 1000,
    })

    const result = await service.submit(input)

    expect(result.status).toBe('FAILED')
    expect(result.passedTests).toBe(0)
    expect(result.totalTests).toBe(2)
    expect(result.score).toBe(0)
  })

  it('should reject a language that is not allowed', async () => {
    await expect(
      service.submit({
        ...input,
        language: 'python',
      }),
    ).rejects.toBeInstanceOf(
      SubmissionValidationError,
    )

    expect(codeExecutor.execute).not.toHaveBeenCalled()
    expect(submissionStore.create).not.toHaveBeenCalled()
  })
})