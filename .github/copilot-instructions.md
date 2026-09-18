# Technical Assessment API - Copilot Instructions

## Project context

This repository contains the backend API for the Technical Assessment Platform.

The application allows users to create technical assessments, create programming questions, execute candidate code, run test cases, calculate scores, and store submissions.

The project is a time-boxed technical Kata. Prioritize a complete, simple, demonstrable MVP over unnecessary architectural complexity.

## Technology stack

- Node.js
- TypeScript
- Express
- AWS Lambda
- API Gateway HTTP API
- DynamoDB
- CloudWatch
- AWS SAM
- Judge0 for code execution

## Architecture

Use a modular layered architecture.

Initial modules:

- Assessment
- Question
- Execution
- Submission

Preferred flow:

Controller
→ Service
→ Store or Port
→ External adapter

Use Ports & Adapters only where abstraction provides clear value.

Do not implement unnecessary abstractions or strict hexagonal architecture.

## Responsibilities

Controllers:
- Handle HTTP input and output.
- Validate request-level concerns.
- Delegate business logic to services.
- Must not contain business rules.

Services:
- Contain application and business logic.
- Coordinate stores and external ports.

Persistence:
- Use the term `Store`, not `Repository`.
- Example: `AssessmentStore`.
- DynamoDB implementations should remain replaceable through the Store abstraction.

Code execution:
- Candidate code must never execute directly inside the API or Lambda.
- Use a `CodeExecutor` abstraction.
- Judge0 is the initial implementation through `Judge0Executor`.
- Do not expose Judge0-specific response contracts directly to the frontend.

## Security

Never:
- Commit credentials, API keys or secrets.
- Execute candidate code directly inside Lambda.
- Expose private test cases to the frontend.
- Hardcode external service credentials.
- Grant unnecessary AWS permissions.

Use environment variables or secure AWS configuration for secrets.

Consider execution timeouts and CPU/memory limits when working with code execution.

## TypeScript conventions

- Use TypeScript for application code.
- Keep `strict` mode enabled.
- Prefer explicit domain types and interfaces where they improve clarity.
- Avoid `any` unless there is a strong reason.
- Prefer small focused functions.
- Use clear English names for code identifiers.
- Keep implementation simple and readable.

## Development principles

- Build incrementally.
- Avoid premature optimization.
- Avoid microservices for the MVP.
- Keep the backend as a single Lambda application unless a concrete requirement justifies otherwise.
- Do not introduce libraries without a clear need.
- Keep external integrations behind small abstractions.
- Add tests where they provide meaningful value.

## Scope

Mandatory execution languages for the MVP:

- Java
- JavaScript / Node.js
- Python

Possible later additions:

- TypeScript
- COBOL

Do not treat optional features as mandatory MVP requirements.

A custom Copilot Agent may be added later, but should not be created until the application has a functional base.