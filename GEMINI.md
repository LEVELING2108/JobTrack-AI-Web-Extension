# Repository Guidelines & Operational Rules

## 1. Git & Pull Request (PR) Workflow (STRICT REQUIREMENT)
- **Always Branch**: All new features, bug fixes, or enhancements MUST be developed on dedicated topic branches (e.g., `feature/...`, `fix/...`, `chore/...`).
- **NEVER Automatically Merge**: Never auto-merge changes directly into `develop` or `main`.
- **Pull Request Protocol**:
  1. Commit and push the topic branch to `origin <branch-name>`.
  2. Provide a clear, structured summary of changes.
  3. Supply the user with the direct GitHub Pull Request link for their manual review and approval.
  4. Only the USER will perform merges to `develop` or `main`.

## 2. Verification Standards
- Always run backend tests (`mvnw test`) and frontend/extension builds (`npm run build`) before pushing branches.
- Ensure all environment configurations, port reservations, and CORS rules remain intact.
