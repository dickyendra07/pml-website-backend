# PML Website Backend

Backend API application for Pharma Metrics Labs corporate website.

This repository contains the NestJS backend service responsible for API management, authentication, CMS operations, database integration, and backend services.

## Technology Stack

- NestJS 11
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis

## Main Features

### API Services

- REST API endpoints
- Public website data API
- Admin CMS API
- Authentication and authorization
- Content management services

### CMS Modules

- Facilities management
- Insights management
- Catalogue management
- Careers management
- Popup management
- Media management
- Website settings management

### Database

- Prisma ORM
- PostgreSQL database integration
- Database migration management
- Seed management

### Infrastructure

- Redis integration
- File upload handling
- Environment configuration
- Production-ready API structure

## Development

Install dependencies:

npm install

Run development server:

npm run start:dev

Build production:

npm run build

Run production:

npm run start:prod

## Database Commands

Generate Prisma client:

npm run prisma:generate

Format Prisma schema:

npm run prisma:format

Run migration:

npm run prisma:migrate

Deploy migration:

npm run prisma:migrate:deploy

Seed database:

npm run db:seed

## Repository Structure

src/              NestJS application source  
prisma/           Database schema and migrations  
public/           Public uploaded assets  
test/             Automated tests  

## Frontend Repository

Frontend is maintained separately.

Repository:

pml-website-frontend

Technology:

- Next.js
- React
- TypeScript
- Tailwind CSS
