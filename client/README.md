# Swachh Campus 360 — Frontend

Next.js 14 (App Router) + TypeScript + Tailwind CSS frontend.

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your backend URL

npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Stack
- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Recharts (analytics charts)
- Socket.IO client (real-time updates)
- html5-qrcode (QR scanning)

## Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## Features
- Role-based dashboards (Student, Supervisor, PIC)
- Multi-modal complaint reporting (text + voice + photo)
- Real-time campus heatmap
- Analytics with Recharts
- Hash-chained audit trail viewer
- AI insights display
- QR zone scanning

## Demo Credentials
After running `npm run db:seed` in server/:

| Role | Email | Password |
|------|-------|----------|
| Student | student@scet.ac.in | Password123! |
| Supervisor | supervisor@scet.ac.in | Password123! |
| PIC | pic@scet.ac.in | Password123! |
