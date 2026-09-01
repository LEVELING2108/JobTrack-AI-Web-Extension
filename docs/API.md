# API Contract Specification — JobTrack v1

Base URL: `/api/v1`

## Standard Envelopes

### Success Envelope
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable explanation"
  }
}
```

## Endpoints

### Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/register` — Register a new user account.
- `POST /api/v1/auth/login` — Authenticate and receive JWT access + refresh tokens.
- `POST /api/v1/auth/refresh` — Refresh expired access token.
- `POST /api/v1/auth/logout` — Invalidate current session/refresh token.
- `GET /api/v1/auth/me` — Retrieve authenticated user profile.

### Applications (`/api/v1/applications`)
- `GET /api/v1/applications` — Paginated, filtered, and sorted application list for current user.
- `GET /api/v1/applications/{id}` — Get single application details (ownership verified).
- `POST /api/v1/applications` — Create or track a job application.
- `PUT /api/v1/applications/{id}` — Update application notes, deadline, dates.
- `PATCH /api/v1/applications/{id}/status` — Update application lifecycle stage.
- `DELETE /api/v1/applications/{id}` — Delete user application.

### Jobs (`/api/v1/jobs`)
- `GET /api/v1/jobs` — Query normalized job listings.
- `GET /api/v1/jobs/{id}` — Get specific job posting details.
- `POST /api/v1/jobs` — Submit extracted job details (handles normalization and deduplication).

### Interviews (`/api/v1/interviews`)
- `GET /api/v1/interviews` — List scheduled interviews for current user.
- `POST /api/v1/interviews` — Schedule a new interview round.
- `PUT /api/v1/interviews/{id}` — Update interview details.
- `DELETE /api/v1/interviews/{id}` — Cancel or delete interview record.

### Reminders (`/api/v1/reminders`)
- `GET /api/v1/reminders` — List active/upcoming reminders.
- `POST /api/v1/reminders` — Create follow-up or deadline reminder.
- `PUT /api/v1/reminders/{id}` — Update reminder status or timestamp.
- `DELETE /api/v1/reminders/{id}` — Delete reminder.

### Dashboard & Analytics (`/api/v1/dashboard`)
- `GET /api/v1/dashboard/summary` — Overview metrics (total, saved, applied, interviews, offers, rejections).
- `GET /api/v1/dashboard/statistics` — Monthly velocity, conversion rates, source breakdown.
