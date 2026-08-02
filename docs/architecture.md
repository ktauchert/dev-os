# System Architecture

## Overview
DevOS is an AI-assisted software development management platform built as a serverless web application.

## Domain Model & Hierarchy
User -> Project -> SDLC Stage -> Epic -> Feature -> Task

## Core Data Flow
1. Client (React SPA) authenticates with AWS Cognito and receives JWTs.
2. Requests are dispatched through AWS API Gateway with Cognito Authorization.
3. Serverless compute (AWS Lambda) executes business logic and domain validation.
4. Data is persisted in AWS DynamoDB (Single-Table / Multi-Table design).
5. AI Companion requests route through Lambda to AWS Bedrock (Claude 3.5 Sonnet) with aggregated project context.