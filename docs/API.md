# Swachh Campus 360 — API Documentation

**Base URL:** `http://localhost:5000/api/v1`

All authenticated endpoints require `Authorization: Bearer <token>` header.

---

## Authentication

### POST /auth/register
Register a new user.

**Rate Limited:** 10 req/15min

**Request Body:**
```json
{
  "email": "student@scet.ac.in",
  "password": "Password123!",
  "name": "Arjun Patel",
  "role": "STUDENT",
  "phone": "9876543210"
}
```
`role`: `STUDENT` | `SUPERVISOR` | `PIC`

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "...", "name": "...", "role": "STUDENT" },
    "token": "jwt-token"
  }
}
```

---

### POST /auth/login
Login and receive JWT.

**Rate Limited:** 10 req/15min

**Request Body:**
```json
{ "email": "student@scet.ac.in", "password": "Password123!" }
```

**Response (200):**
```json
{
  "success": true,
  "data": { "user": { ... }, "token": "jwt-token" }
}
```

---

### GET /auth/me
Get current authenticated user.

**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "data": { "id": "uuid", "email": "...", "name": "...", "role": "STUDENT", "createdAt": "..." }
}
```

---

## Reports

### GET /reports
List reports (with filters).

**Auth Required:** Yes  
**Role:** Any (Students see only their own)

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter by status: `OPEN`, `MERGED`, `IN_PROGRESS`, `RESOLVED`, `CLOSED` |
| `category` | string | Filter by category: `WASTE`, `SPILL`, `ODOR`, `GRAFFITI`, `BROKEN_FIXTURE`, `OTHER` |
| `severity` | string | Filter by severity: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |
| `zoneId` | string | Filter by zone UUID |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20, max: 100) |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "reports": [ { "id": "...", "title": "...", "status": "OPEN", "zone": {...}, ... } ],
    "total": 42,
    "page": 1,
    "limit": 20
  }
}
```

---

### GET /reports/:id
Get a specific report.

**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "data": { "id": "...", "title": "...", "zone": {...}, "reporter": {...}, "jobCard": {...}, ... }
}
```

---

### POST /reports
Create a new report (with AI dedup + classification).

**Auth Required:** Yes  
**Content-Type:** `multipart/form-data`

**Form Fields:**
| Field | Type | Required |
|-------|------|----------|
| `title` | string | Yes (min 5 chars) |
| `description` | string | Yes (min 10 chars) |
| `category` | string | No (AI-classified if omitted) |
| `zoneId` | string (UUID) | Yes |
| `image` | file | No (JPEG/PNG/WebP, max 10MB) |

**Response (201 — new report):**
```json
{ "success": true, "data": { "id": "...", ... }, "merged": false }
```

**Response (200 — duplicate merged):**
```json
{ "success": true, "data": { "id": "...", ... }, "merged": true, "message": "Similar report found and merged" }
```

---

### PATCH /reports/:id/status
Update report status.

**Auth Required:** Yes  
**Role:** `SUPERVISOR`, `PIC`

**Request Body:**
```json
{ "status": "IN_PROGRESS" }
```

---

## Jobs

### GET /jobs
List job cards.

**Auth Required:** Yes  
**Role:** Any (Supervisors see their own jobs)

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | `PENDING`, `ASSIGNED`, `IN_PROGRESS`, `COMPLETED`, `VERIFIED` |
| `page` | number | Page number |
| `limit` | number | Items per page |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "jobs": [ { "id": "...", "status": "ASSIGNED", "zone": {...}, "report": {...}, "assignedWorker": {...} } ],
    "total": 10
  }
}
```

---

### PATCH /jobs/:id/assign
Assign a worker to a job.

**Auth Required:** Yes  
**Role:** `SUPERVISOR`

**Request Body:**
```json
{ "workerId": "uuid" }
```

---

### PATCH /jobs/:id/status
Update job status.

**Auth Required:** Yes

**Request Body:**
```json
{ "status": "IN_PROGRESS", "notes": "Starting cleanup" }
```

---

### POST /jobs/:id/evidence
Upload after-completion evidence image (triggers CV verification).

**Auth Required:** Yes  
**Content-Type:** `multipart/form-data`

**Form Fields:**
| Field | Type | Required |
|-------|------|----------|
| `image` | file | Yes |

**Response (200):**
```json
{
  "success": true,
  "data": { "id": "...", "afterImageUrl": "...", "afterImageVerified": true, "status": "VERIFIED" }
}
```

---

## Zones

### GET /zones
List all campus zones.

**Auth Required:** No

**Response (200):**
```json
{
  "success": true,
  "data": [ { "id": "...", "name": "Main Cafeteria", "building": "Block A", "type": "CANTEEN", "currentScore": 82.5, ... } ]
}
```

---

### GET /zones/scores
Get real-time cleanliness scores for all zones.

**Auth Required:** No

**Response (200):**
```json
{
  "success": true,
  "data": [ { "zoneId": "...", "name": "...", "score": 78.3, "status": "clean", "lastUpdated": "..." } ]
}
```

---

### GET /zones/:id
Get a specific zone with recent reports.

**Auth Required:** No

**Response (200):**
```json
{
  "success": true,
  "data": { "id": "...", "name": "...", "liveScore": 76.2, "status": "clean", "reports": [...] }
}
```

---

## Analytics

### GET /analytics/overview
Get campus-wide KPI stats.

**Auth Required:** Yes  
**Role:** `PIC`, `SUPERVISOR`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalReports": 156,
    "openReports": 23,
    "resolvedReports": 120,
    "activeJobs": 8,
    "avgCleanlinessScore": 73,
    "resolutionRate": 77
  }
}
```

---

### GET /analytics/trends
Get report trends over time.

**Auth Required:** Yes  
**Role:** `PIC`, `SUPERVISOR`

**Query Params:**
| Param | Default | Description |
|-------|---------|-------------|
| `days` | 30 | Number of days to look back |

---

### GET /analytics/zones
Get zone performance data.

**Auth Required:** Yes  
**Role:** `PIC`, `SUPERVISOR`

---

## Audit

### GET /audit
Get the hash-chained audit log.

**Auth Required:** Yes  
**Role:** `PIC`

**Query Params:** `page`, `limit`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "entries": [ { "id": "...", "action": "REPORT_CREATED", "actor": "user@email.com", "previousHash": "...", "currentHash": "...", "createdAt": "..." } ],
    "total": 500,
    "page": 1,
    "limit": 50
  }
}
```

---

### GET /audit/verify
Verify the integrity of the audit chain.

**Auth Required:** Yes  
**Role:** `PIC`

**Response (200):**
```json
{
  "success": true,
  "data": { "valid": true }
}
```

If chain is broken:
```json
{
  "success": true,
  "data": { "valid": false, "brokenAt": 42 }
}
```

---

## Feedback

### POST /feedback
Submit a QR-based micro-survey feedback.

**Auth Required:** Yes

**Request Body:**
```json
{
  "cleanlinessRating": 4,
  "odorRating": 3,
  "suppliesRating": 5,
  "comment": "Generally clean today",
  "zoneId": "uuid"
}
```
All ratings: integers 1–5.

---

### GET /feedback/zone/:zoneId
Get feedback for a specific zone.

**Auth Required:** No

---

## Insights

### GET /insights
List active AI insight cards.

**Auth Required:** Yes

**Query Params:**
| Param | Description |
|-------|-------------|
| `zoneId` | Optional: filter by zone |

**Response (200):**
```json
{
  "success": true,
  "data": [ { "id": "...", "title": "...", "description": "...", "confidence": 0.87, "suggestedAction": "...", "createdAt": "..." } ]
}
```

---

### POST /insights/generate
Trigger AI insight generation from current data patterns.

**Auth Required:** Yes  
**Role:** `PIC`

---

## Users

### GET /users
List all users.

**Auth Required:** Yes  
**Role:** `SUPERVISOR`, `PIC`

**Query Params:**
| Param | Description |
|-------|-------------|
| `role` | Filter by role: `STUDENT`, `SUPERVISOR`, `PIC` |

---

## QR Codes

### GET /qr/:zoneId
Generate a QR code for a campus zone.

**Auth Required:** No

**Response (200):**
```json
{
  "success": true,
  "data": {
    "qrDataUrl": "data:image/png;base64,...",
    "zoneId": "uuid"
  }
}
```
The QR code encodes the URL: `{CLIENT_URL}/scan/{zoneId}`

---

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

Common HTTP status codes:
| Code | Meaning |
|------|---------|
| 400 | Bad request / validation error |
| 401 | Not authenticated |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 409 | Conflict (e.g. duplicate email) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
