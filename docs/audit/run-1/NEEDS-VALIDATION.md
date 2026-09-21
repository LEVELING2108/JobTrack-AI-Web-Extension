# Needs Validation Leads & Operational Checklist

During this formal security audit, all candidate issues were resolved from source inspection and bounded verification. No unresolved `needs_validation` items remain blocked.

The following operational checklist outlines verification tasks that require runtime or production infrastructure observation:

### 1. Production Google OAuth Client ID Verification
- **Area**: Google Cloud Console & Environment Configuration
- **Check**: Verify that `GOOGLE_CLIENT_ID` environment variable is strictly configured in the production Antideploy deployment environment.
- **Owner Observation**: In Antideploy dashboard, confirm that `GOOGLE_CLIENT_ID` matches the OAuth 2.0 Web Client ID registered in Google Cloud Console.

### 2. Production JWT Secret Key Entropy
- **Area**: Environment Configuration
- **Check**: Confirm that the production `JWT_SECRET` environment variable is populated with a cryptographically secure 256-bit random hex key, distinct from any repository defaults.
- **Owner Observation**: Check environment secret configuration in Antideploy; verify no default fallback key is in use.

### 3. Production CORS Whitelist
- **Area**: Network & Domain Routing
- **Check**: Verify that `CORS_ALLOWED_ORIGINS` environment variable explicitly enumerates production frontend domains (e.g. `https://jobtrack.antideploy.com`) and Chrome extension IDs, with no localhost origins enabled in production.
