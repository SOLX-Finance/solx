# SolX Monorepo

## Applications

### Web App (`apps/web`)

The main web application built with React, featuring a modern UI using Tailwind CSS and Radix UI components. Includes authentication via Privy and integrates with Solana blockchain and API.

### API (`apps/api`)

NestJS-based backend service providing RESTful endpoints. Features include:

- Swagger documentation
- Rate limiting
- Health checks
- BullMQ for job processing
- Prisma for database access

### Smart Contracts (`apps/contracts`)

Solana smart contracts written using Anchor framework, including:

- Token metadata handling
- SPL token integration
- Custom program logic

### Indexer (`apps/indexer`)

Blockchain indexer service that processes and stores on-chain data, built with NestJS.

### Landing Page (`apps/landing`)

Marketing website built with React and Tailwind CSS.

## Tech Stack

### Core Technologies

- Node.js
- TypeScript
- Yarn
- Nx

### Frontend

- React 19
- Tailwind CSS
- Shadcn
- TanStack Query
- Vite

### Backend

- NestJS
- Prisma
- BullMQ
- OpenAPI

### Blockchain

- Solana Web3.js
- Anchor
- Metaplex

## Prerequisites

- Node.js (LTS version)
- Yarn v4.9.1
- PostgreSQL
- Redis (for BullMQ)
- Solana CLI tools

## Setup

1. Install dependencies:

```bash
yarn install
```

2. Generate Prisma client:

```bash
yarn db:generate
```

3. Run database migrations:

```bash
yarn db:migrate:deploy
```

## Development

### Running Applications

Web App:

```bash
yarn serve:web
```

API:

```bash
yarn serve:api
```

Indexer:

```bash
yarn serve:indexer
```

### Building Applications

```bash
# Build all applications
yarn build:web
yarn build:api
yarn build:indexer

# Or build specific application
yarn build:web
```

## Environment Variables

Create `.env` files in respective application directories or in the project root with the following variables:

### API

#### Application

- `NODE_ENV` (default: 'development')
- `PORT` (default: 3000)
- `API_PREFIX` (default: 'api')
- `API_URL` (default: '<http://localhost:3000>')
- `PINO_LOG_LEVEL` (default: 'info')

#### CORS

- `CORS_ORIGINS` (default: '<http://localhost:4200>')

#### Security

- `COOKIE_SECRET` (min 32 characters)

#### Rate Limiting

- `THROTTLE_SHORT_TTL` (default: 1000)
- `THROTTLE_SHORT_LIMIT` (default: 1)
- `THROTTLE_MEDIUM_TTL` (default: 10000)
- `THROTTLE_MEDIUM_LIMIT` (default: 4)
- `THROTTLE_LONG_TTL` (default: 60000)
- `THROTTLE_LONG_LIMIT` (default: 10)

#### Authentication

- `PRIVY_APP_ID`
- `PRIVY_SECRET`

#### Database

- `DATABASE_URL`

#### Storage (Storj/S3)

- `STORJ_ACCESS_KEY_ID`
- `STORJ_SECRET_ACCESS_KEY`
- `STORJ_BUCKET`
- `STORJ_READ_URL_EXPIRATION` (default: 3600)
- `STORJ_UPLOAD_URL_EXPIRATION` (default: 3600)

#### AI Integration

- `AI_API_KEY`
- `AI_MODEL_ID` (default: 'gpt-4o-mini')
- `ENABLE_AI_ANALYZE` (default: true)

#### Redis

- `REDIS_URL` (default: 'redis://localhost:6379')
- `REDIS_REJECT_UNAUTHORIZED` (default: false)

### Web

#### Application

- `NODE_ENV` (default: 'development')

#### Authentication

- `VITE_PRIVY_APP_ID` (required)
- `VITE_PRIVY_CLIENT_ID` (required)

#### API Configuration

- `VITE_API_URL` (default: '<http://localhost:3000/api>')

#### Blockchain

- `RPC_URL` (default: '<https://api.devnet.solana.com>')

### Indexer

#### Application

- `NODE_ENV` (default: 'development')
- `PORT` (default: 3004)
- `PINO_LOG_LEVEL` (default: 'info')

#### Database

- `DATABASE_URL` (default: 'postgresql://postgres:1234@localhost:5432/solx')

#### Blockchain

- `RPC_URL` (required)
- `INDEX_ENV` (default: 'devnet')

#### Indexer Configuration

- `INDEXER_LOOP_CYCLE_DELAY` (default: 5000)

#### Redis

- `REDIS_URL` (default: 'redis://localhost:6379')
- `REDIS_USE_CLUSTER` (default: false)
- `REDIS_REJECT_UNAUTHORIZED` (default: false)
