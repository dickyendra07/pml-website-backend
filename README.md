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

- `src/` — NestJS application source
- `prisma/` — Database schema and migrations
- `public/` — Public uploaded assets
- `test/` — Automated tests

## Frontend Repository

Frontend is maintained separately.

Repository:

pml-website-frontend

Technology:

- Next.js
- React
- TypeScript
- Tailwind CSS

## Persistent CMS uploads on Railway

CMS files are stored under `public/uploads` and served publicly from
`/uploads`. The database stores relative URLs such as
`/uploads/media/example.png`.

Railway's application filesystem is ephemeral, so the backend service must
have a persistent Railway Volume mounted at:

```text
/app/public/uploads
```

Railway exposes the mount location through `RAILWAY_VOLUME_MOUNT_PATH`. At
startup, the application verifies that this value resolves to
`public/uploads` and that the directory is readable and writable. A Railway
deployment without the volume, or with a different mount path, fails fast to
avoid accepting uploads that would disappear after a redeploy.

The volume is mounted only at runtime. Do not generate or copy uploads during
the build or pre-deploy phase.

Local development continues to use `public/uploads` in the repository
working tree. Uploaded binaries remain excluded from Git.
