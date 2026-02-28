# Swachh Campus 360 🏫✨

> **Campus Sanitation Intelligence Platform for SCET** — *Because a clean campus is everyone's responsibility.*

A full-stack web platform that bridges students, supervisors, and professors-in-charge to manage campus sanitation with AI-powered deduplication, real-time heatmaps, and hash-chained audit trails.

---

## Features

- 📸 **Multi-modal Complaint Reporting** — text, voice (EN/HI/GU), photo upload with AI analysis
- 🤖 **Smart Deduplication** — embedding-based similarity search merges duplicate reports
- 🗺️ **Campus Digital Twin Heatmap** — real-time SVG map with entropy-decay cleanliness scores
- 👷 **Supervisor Job Queue** — assign workers, track progress, verify resolutions
- 🔍 **Computer Vision Verification** — before/after image comparison for job completion
- 📊 **PIC Analytics Dashboard** — KPIs, trends, worker performance, AI insights
- 🔐 **Tamper-proof Audit Trail** — SHA-256 hash-chained ledger for all actions
- ⚡ **Real-time Updates** — Socket.IO for live heatmap and notification sync
- 📱 **QR Zone Scanning** — quick report submission via zone QR codes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, Recharts |
| Backend | Node.js, Express, TypeScript, Socket.IO |
| Database | PostgreSQL + Prisma ORM |
| Cache | Redis |
| AI | OpenAI (Embeddings, Vision, Chat) |
| Storage | Cloudinary |
| Auth | JWT + bcrypt |

---

## Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- OpenAI API key
- Cloudinary account

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/Dev750wala/scetathon.git
cd scetathon

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your values

# 3. Install server dependencies & set up database
cd server
cp .env.example .env
npm install
npx prisma migrate dev --name init
npx prisma db seed

# 4. Start the backend
npm run dev

# 5. In a new terminal, install client dependencies
cd ../client
cp .env.example .env.local
npm install
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

---

## Environment Variables

See [`.env.example`](.env.example) for all required variables.

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `OPENAI_API_KEY` | OpenAI API key for AI features |
| `CLOUDINARY_*` | Cloudinary credentials for image storage |
| `PORT` | Backend server port (default: 5000) |
| `CLIENT_URL` | Frontend URL for CORS |

---

## Project Structure

```
scetathon/
├── client/          # Next.js 14 frontend
├── server/          # Express + TypeScript backend
├── docs/            # API documentation
├── .env.example     # Root environment template
└── README.md
```

See [`client/README.md`](client/README.md) and [`server/README.md`](server/README.md) for detailed setup.

---

## Roles & Flow

```
Student → Reports Issue
    ↓ AI dedup + classification
System → Creates/Merges Report
    ↓
Supervisor → Reviews queue, assigns worker
    ↓
Worker → Completes task, uploads evidence
    ↓
System → CV verifies resolution
    ↓
PIC → Views analytics, audit trail, AI insights
```

---

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## License

MIT © SCET Hackathon Team
