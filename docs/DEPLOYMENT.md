# Deployment Guide — JobTrack

## Deployment Architecture

```
Chrome Web Store           Vercel / Netlify              Cloud Container / VM
       │                          │                              │
       ▼                          ▼                              ▼
Chrome Extension            Web Dashboard                 Spring Boot API
  (Manifest V3)           (React + TS + Vite)             (Java 21 / Docker)
       │                          │                              │
       └──────────────────────────┴──────────────────────────────┘
                                  │ HTTPS
                                  ▼
                         Managed PostgreSQL
```

## Step-by-Step Deployment Sequence

1. **Database**: Provision managed PostgreSQL instance (AWS RDS, Supabase, Neon, or Railway) and run migrations.
2. **Spring Boot API**:
   - Build production jar / Docker image.
   - Configure production environment variables (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS`).
   - Run smoke tests against `/actuator/health`.
3. **Web Dashboard**:
   - Set `VITE_API_BASE_URL=https://api.jobtrack.example.com/api/v1`.
   - Build production assets (`npm run build`) and deploy to Vercel/Netlify.
4. **Chrome Extension**:
   - Configure production API endpoint in environment config.
   - Package extension bundle (`npm run build`).
   - Submit zip package to Chrome Web Store developer dashboard.
