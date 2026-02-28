# Swachh Campus 360 — Backend

Node.js + Express + TypeScript backend with Prisma ORM.

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your values

# Database setup
npx prisma migrate dev --name init
npx prisma db seed

# Development
npm run dev
```

## Stack
- Express.js + TypeScript
- PostgreSQL + Prisma ORM
- Redis (caching)
- Socket.IO (real-time)
- OpenAI (AI features)
- Cloudinary (image storage)

## Environment Variables
See `.env.example` for all required variables.

## API
Base URL: `http://localhost:5000/api/v1`

See [`../docs/API.md`](../docs/API.md) for full documentation.
