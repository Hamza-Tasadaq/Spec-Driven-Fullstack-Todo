<!--
================================================================================
SYNC IMPACT REPORT
================================================================================
Version Change: (none) → 1.0.0 (Initial ratification)
Bump Rationale: MAJOR - Initial constitution creation for Phase II Todo Full-Stack

Modified Principles: N/A (initial creation)

Added Sections:
  - Core Principles (5 principles)
  - Technology Standards (Backend + Frontend tables)
  - Key Standards (API Design, Authentication, Database, Code Quality)
  - Constraints
  - Success Criteria
  - Governance

Removed Sections: N/A (initial creation)

Templates Requiring Updates:
  - .specify/templates/plan-template.md: ✅ Compatible (Constitution Check section exists)
  - .specify/templates/spec-template.md: ✅ Compatible (requirements align)
  - .specify/templates/tasks-template.md: ✅ Compatible (path conventions match)
  - .specify/templates/phr-template.prompt.md: ✅ Compatible (no constitution refs)

Follow-up TODOs: None
================================================================================
-->

# Todo Full-Stack Web Application Constitution

## Core Principles

### I. Spec-Driven Development

All code MUST be generated from specifications via Claude Code agents. Manual coding is prohibited.

- Every feature starts with a specification (`/sp.specify`)
- Implementation follows the Agentic Dev Stack workflow: specify → plan → tasks → implement
- No hand-written production code; all implementation through Claude Code agents
- Specifications serve as the authoritative source for feature requirements

**Rationale**: Ensures consistency, traceability, and reproducibility of all implementation decisions.

### II. Clean Architecture

Strict separation MUST be maintained between frontend, backend, and data layers.

- Frontend (Next.js) and backend (FastAPI) are independently deployable services
- No shared database sessions between frontend and backend
- Communication exclusively via RESTful API with JWT authentication
- Each layer has its own responsibility: UI → API → Service → Repository → Database
- **src-layout mandatory**: All source code resides in `src/` directories

**Rationale**: Enables independent scaling, testing, and deployment of each layer.

### III. Type Safety

Strong typing MUST be enforced across all codebases.

- **Frontend**: TypeScript strict mode enabled; ESLint + Prettier enforced
- **Backend**: Python type hints on all function signatures; PEP 8 compliance
- Pydantic/SQLModel for runtime validation and serialization
- No use of `any` type in TypeScript; no untyped function parameters in Python

**Rationale**: Catches errors at compile/lint time, improves IDE support, and documents intent.

### IV. Security First

Zero trust architecture MUST be implemented between services.

- JWT-based authentication via Better Auth (frontend) with shared secret verification (backend)
- All task operations MUST be filtered by authenticated user ID
- User ID in URL MUST match authenticated user's token
- Secrets stored in environment variables; never hardcoded
- All endpoints except auth routes require valid JWT token
- Token expiry: 7 days default

**Rationale**: Protects user data, prevents unauthorized access, and ensures regulatory compliance.

### V. API Contract

RESTful design with OpenAPI documentation MUST be followed.

- Endpoints follow pattern: `/api/{user_id}/tasks`
- Consistent error response format: `{ "detail": "message" }`
- HTTP status codes: 200 (success), 201 (created), 401 (unauthorized), 404 (not found)
- OpenAPI/Swagger documentation auto-generated at `/docs`
- All request/response schemas defined via Pydantic models

**Rationale**: Enables contract-first development, client generation, and API discoverability.

## Technology Standards

### Backend (Python)

| Component       | Technology                 | Version/Requirement |
|-----------------|----------------------------|---------------------|
| Framework       | FastAPI                    | Latest              |
| ORM             | SQLModel                   | Latest              |
| Database        | Neon Serverless PostgreSQL | -                   |
| Python          | 3.13+                      | Required            |
| Package Manager | UV                         | Required            |

### Frontend (TypeScript)

| Component    | Technology           | Version/Requirement |
|--------------|----------------------|---------------------|
| Framework    | Next.js (App Router) | 16+                 |
| Auth Library | Better Auth          | Latest              |
| Language     | TypeScript           | Strict mode         |

## Key Standards

### API Design

- RESTful endpoints following `/api/{user_id}/tasks` pattern
- All endpoints require JWT authentication (except auth routes)
- Consistent error response format: `{ "detail": "message" }`
- OpenAPI/Swagger documentation auto-generated
- HTTP status codes: 200 (success), 201 (created), 401 (unauthorized), 404 (not found)

### Authentication & Security

- Better Auth handles signup/signin on frontend
- JWT tokens issued via Better Auth JWT plugin
- Shared secret (`BETTER_AUTH_SECRET`) between frontend and backend
- Backend validates JWT on every request via middleware
- User ID in URL MUST match authenticated user's ID
- Token expiry: 7 days default

### Database

- SQLModel for type-safe ORM
- All tables include: `id`, `created_at`, `updated_at`
- Tasks table includes `user_id` foreign key
- Soft delete not required (hard delete acceptable)
- Connection pooling via Neon serverless driver

### Code Quality

- Python: PEP 8, type hints on all functions
- TypeScript: ESLint + Prettier, strict mode enabled
- Environment variables for all secrets (never hardcoded)
- Separation of concerns: routes → services → repositories

## Constraints

- No manual coding allowed (Agentic Dev Stack workflow only)
- Backend and frontend are separate deployable services
- **src-layout mandatory** for both backend and frontend
- Single shared secret for JWT verification
- All task operations filtered by authenticated user
- No shared database sessions between frontend/backend

## Success Criteria

- All 6 API endpoints functional and secured
- User signup/signin works via Better Auth
- JWT tokens correctly issued and verified
- Each user sees only their own tasks
- Unauthorized requests receive 401 response
- API documentation accessible at `/docs`
- Frontend responsive on mobile and desktop

## Governance

This constitution serves as the authoritative source for all architectural and development decisions in the Todo Full-Stack Web Application project.

### Amendment Process

1. Proposed amendments MUST be documented with rationale
2. Amendments require explicit approval before implementation
3. All changes MUST include a migration plan for affected code
4. Version number MUST be incremented according to semantic versioning:
   - **MAJOR**: Backward-incompatible principle changes or removals
   - **MINOR**: New principles or sections added
   - **PATCH**: Clarifications, wording fixes, non-semantic updates

### Compliance

- All PRs MUST verify compliance with constitution principles
- Complexity beyond stated standards MUST be justified in writing
- Violations require remediation before merge
- Use CLAUDE.md for runtime development guidance

**Version**: 1.0.0 | **Ratified**: 2026-01-09 | **Last Amended**: 2026-01-09
