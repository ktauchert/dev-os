# System Architecture

## Overview

DevOS is an AI-assisted software development management platform built as a serverless web application.

**How we build it on AWS (order, environments, contracts):** [aws-dev-workflow.md](./aws-dev-workflow.md).

## Domain Model & Hierarchy

User -> Project -> SDLC Stage -> Epic -> Feature -> Task

**SDLC product rule:** projects start at **Discovery** and advance along a guided path; see [sdlc-ux.md](./sdlc-ux.md).

**Domain / data model (class diagram, ER, Dynamo mapping):** [data-model.md](./data-model.md).

## Core Data Flow (target production)

1. Client (React SPA) authenticates with AWS Cognito and receives JWTs.
2. Requests are dispatched through AWS API Gateway with Cognito authorization.
3. Serverless compute (AWS Lambda) executes business logic and domain validation.
4. Data is persisted in AWS DynamoDB (access-pattern driven; see workflow doc).
5. AI Companion requests route through Lambda to AWS Bedrock with aggregated project context.

## Local development (today)

The SPA uses the same HTTP client against either **MSW** (default) or a **dev API Gateway** URL when mocking is disabled. The contract in `docs/api-*.md` is shared by MSW, tests, and Lambda.
