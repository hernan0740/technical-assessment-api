# Technical Assessment API

Backend de Technical Assessment Platform, desarrollado con Node.js, TypeScript y Express.

## Stack

- Node.js
- TypeScript
- Express
- MongoDB Atlas
- Judge0
- Vitest

## Arquitectura

El backend utiliza una estructura modular por capas:

Controller → Service → Store / Port → Adapter

Módulos principales:

- Assessment
- Question
- Execution
- Submission

La ejecución de código se abstrae mediante `CodeExecutor` y actualmente utiliza Judge0.

## Configuración

Crear un archivo `.env` tomando como referencia `.env.example`.

Variables principales:

```env
MONGODB_URI=
MONGODB_DB_NAME=technical_assessment
FRONTEND_URL=
JUDGE0_API_URL=
JUDGE0_API_KEY=