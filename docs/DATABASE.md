# Database Architecture — JobTrack

## ER Diagram (Conceptual)

```
   [ USERS ]
       │ 1
       ├─────────────────┬─────────────────┐
       │ N               │ N               │ N
[ APPLICATIONS ]   [ USER_SKILLS ]    [ RESUMES ]
       │ N
       │
       │ 1
    [ JOBS ] ── 1:N ── [ JOB_SKILLS ]
       │
       ├── 1:N ── [ INTERVIEWS ]
       └── 1:N ── [ REMINDERS ]
```

## Table Specifications

### 1. `users`
- `id`: BIGSERIAL PRIMARY KEY
- `name`: VARCHAR(100) NOT NULL
- `email`: VARCHAR(255) UNIQUE NOT NULL
- `password_hash`: VARCHAR(255) NOT NULL
- `created_at`, `updated_at`: TIMESTAMPTZ

### 2. `jobs`
- `id`: BIGSERIAL PRIMARY KEY
- `title`: VARCHAR(255) NOT NULL
- `company`: VARCHAR(255) NOT NULL
- `location`: VARCHAR(255)
- `url`: TEXT NOT NULL (Index)
- `description`: TEXT
- `salary_min`, `salary_max`: NUMERIC(12, 2)
- `currency`: VARCHAR(10) DEFAULT 'USD'
- `employment_type`: VARCHAR(50)
- `experience_level`: VARCHAR(50)
- `source`: VARCHAR(100) NOT NULL
- `source_job_id`: VARCHAR(255)
- `posted_date`: TIMESTAMPTZ
- `created_at`, `updated_at`: TIMESTAMPTZ

### 3. `applications`
- `id`: BIGSERIAL PRIMARY KEY
- `user_id`: BIGINT NOT NULL (FK -> users.id)
- `job_id`: BIGINT NOT NULL (FK -> jobs.id)
- `status`: VARCHAR(50) NOT NULL (`SAVED`, `APPLIED`, `SCREENING`, `INTERVIEW`, `OFFER`, `ACCEPTED`, `REJECTED`, `WITHDRAWN`)
- `applied_date`, `deadline`, `follow_up_date`: TIMESTAMPTZ
- `notes`: TEXT
- `created_at`, `updated_at`: TIMESTAMPTZ
- **Constraint**: `UNIQUE(user_id, job_id)`

### 4. `interviews`
- `id`: BIGSERIAL PRIMARY KEY
- `application_id`: BIGINT NOT NULL (FK -> applications.id)
- `round_name`: VARCHAR(100) NOT NULL
- `scheduled_at`: TIMESTAMPTZ NOT NULL
- `interviewer`: VARCHAR(255)
- `meeting_url`: TEXT
- `notes`: TEXT
- `created_at`, `updated_at`: TIMESTAMPTZ

### 5. `reminders`
- `id`: BIGSERIAL PRIMARY KEY
- `user_id`: BIGINT NOT NULL (FK -> users.id)
- `application_id`: BIGINT (FK -> applications.id)
- `title`: VARCHAR(255) NOT NULL
- `description`: TEXT
- `reminder_time`: TIMESTAMPTZ NOT NULL
- `completed`: BOOLEAN DEFAULT false
- `created_at`: TIMESTAMPTZ
