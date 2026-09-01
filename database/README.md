# JobTrack Database Setup

This directory contains the database initialization scripts and seed data for local development.

## Quick Start (Docker)

To start the PostgreSQL database instance:

```bash
docker compose up -d postgres
```

To stop the database:

```bash
docker compose down
```

## Schema & Tables
- **users**: Core user credentials and profile metadata.
- **jobs**: Normalized unique job postings shared across users.
- **applications**: User-specific job tracking records with status lifecycle.
- **interviews**: Scheduled interview rounds linked to applications.
- **reminders**: Follow-ups, deadlines, and notifications.
- **user_skills** & **job_skills**: Skill tracking for matching & analytics.
- **resumes**: User resume attachments and profile defaults.
