---
id: "0001"
title: "Create Phase II Todo Full-Stack Constitution"
stage: constitution
date: 2026-01-09
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: master
user: app
command: /sp.constitution
labels: ["constitution", "governance", "phase-ii", "todo-app"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - null
---

## Prompt

```text
# /sp.constitution
# Project: Phase II - Todo Full-Stack Web Application

## Core Principles
- **Spec-Driven Development**: All code generated from specs via Claude Code (no manual coding)
- **Clean Architecture**: Strict separation between frontend, backend, and data layers
- **Type Safety**: TypeScript strict mode (frontend), Python type hints (backend)
- **Security First**: JWT-based auth, user isolation, zero trust between services
- **API Contract**: RESTful design with OpenAPI documentation

---

## Project Structure
```
phase-ii/
├── backend/
│   └── src/
│       ├── __init__.py
│       ├── main.py
│       ├── config.py
│       ├── auth/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── repositories/
├── frontend/
│   └── src/
│       ├── app/
│       ├── components/
│       ├── lib/
│       └── types/
└── specs/
    ├── sp.constitution.md
    ├── sp.specify.md
    └── sp.plan.md
```

- **src-layout required**: All application source code must reside in `src/` directories
- Backend: `backend/src/` with Python modules
- Frontend: `frontend/src/` with Next.js App Router structure

---

## Technology Standards

### Backend (Python)
| Component | Technology | Version |
|-----------|------------|---------|
| Framework | FastAPI | Latest |
| ORM | SQLModel | Latest |
| Database | Neon Serverless PostgreSQL | - |
| Python | 3.13+ | Required |
| Package Manager | UV | Required |

### Frontend (TypeScript)
| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Next.js (App Router) | 16+ |
| Auth Library | Better Auth | Latest |
| Language | TypeScript | Strict mode |

---

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
- User ID in URL must match authenticated user's ID
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

---

## Constraints
- No manual coding allowed (Agentic Dev Stack workflow only)
- Backend and frontend are separate deployable services
- **src-layout mandatory** for both backend and frontend
- Single shared secret for JWT verification
- All task operations filtered by authenticated user
- No shared database sessions between frontend/backend

---

## Success Criteria
- All 6 API endpoints functional and secured
- User signup/signin works via Better Auth
- JWT tokens correctly issued and verified
- Each user sees only their own tasks
- Unauthorized requests receive 401 response
- API documentation accessible at `/docs`
- Frontend responsive on mobile and desktop
```

## Response snapshot

Created constitution v1.0.0 for Todo Full-Stack Web Application with 5 core principles:
1. Spec-Driven Development - All code via Claude Code agents
2. Clean Architecture - Strict layer separation
3. Type Safety - TypeScript strict + Python type hints
4. Security First - JWT auth, user isolation
5. API Contract - RESTful with OpenAPI

Additional sections: Technology Standards, Key Standards, Constraints, Success Criteria, Governance.

Sync Impact Report confirms all templates compatible. No follow-up TODOs required.

## Outcome

- ✅ Impact: Constitution v1.0.0 ratified - establishes governance for Phase II todo-full-stack project
- 🧪 Tests: N/A (governance document)
- 📁 Files: .specify/memory/constitution.md created/updated
- 🔁 Next prompts: `/sp.specify` to create feature specifications following this constitution
- 🧠 Reflection: User provided comprehensive principles covering all aspects of the full-stack application architecture

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
