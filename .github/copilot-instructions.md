# Technical Assessment API - Copilot Instructions

## Project context

This repository contains the backend API for the Technical Assessment Platform.

The application allows users to create technical assessments, create programming questions, execute candidate code, run test cases, calculate scores, and store submissions.

This is a time-boxed technical Kata. Prioritize a complete, simple and demonstrable MVP over unnecessary architectural complexity.

## Technology stack

- Node.js
- TypeScript
- Express
- MongoDB Atlas
- Render
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
- MongoDB implementations must remain behind Store abstractions.
- Example: `AssessmentStore` → `MongoAssessmentStore`.
- Keep MongoDB collections and queries simple for the MVP.

Code execution:
- Candidate code must never execute directly inside the API process.
- Use a `CodeExecutor` abstraction.
- Judge0 is the initial implementation through `Judge0Executor`.
- Do not expose Judge0-specific response contracts directly to the frontend.

## Security

Never:
- Commit credentials, API keys or secrets.
- Execute candidate code directly inside the backend.
- Expose private test cases to the frontend.
- Hardcode external service credentials.

Use environment variables for secrets and external configuration.

Consider execution timeouts and resource limits when working with code execution.

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
- Do not introduce microservices for the MVP.
- Do not introduce libraries without a clear need.
- Keep external integrations behind small abstractions.
- Add tests where they provide meaningful value.

## Persistence

MongoDB Atlas is the persistence technology for the MVP.

Initial collections:

- assessments
- questions
- submissions

Do not introduce advanced MongoDB patterns, unnecessary indexes or complex data modeling without a concrete requirement.

## Deployment

Backend deployment target:

GitHub
→ Render
→ Node.js + Express

Database:

MongoDB Atlas

Code execution:

Judge0

## Scope

Mandatory execution languages:

- Java
- JavaScript / Node.js
- Python

Possible later additions:

- TypeScript
- COBOL

Do not treat optional features as mandatory MVP requirements.

A custom Copilot Agent may be added later, but should not be created until the application has a functional base.

A `ContainerExecutor` may be evaluated later as a bonus only after the MVP is complete.