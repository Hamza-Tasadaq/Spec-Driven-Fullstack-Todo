# 📋 Full-Stack Todo Application - Spec-Driven Development

A production-ready task management application built using **spec-driven development** methodology, showcasing professional software engineering practices with AI-assisted development (Claude Code).

## 🛠️ Tech Stack

**Backend:**

- FastAPI (Python 3.13+)
- SQLModel ORM
- Neon Serverless PostgreSQL
- JWT Authentication (PyJWT)
- UV Package Manager

**Frontend:**

- Next.js 16 (App Router)
- TypeScript (Strict Mode)
- Better Auth (JWT Plugin)
- Tailwind CSS
- React Hook Form

**Integration:**

- JWT-based stateless authentication
- RESTful API design
- User isolation & security
- CORS configuration

## ✨ Features

- ✅ User signup & signin (Better Auth)
- ✅ JWT token-based authentication
- ✅ Full CRUD operations for tasks
- ✅ User isolation (each user sees only their tasks)
- ✅ Responsive design (mobile + desktop)
- ✅ Task priorities & status tracking
- ✅ Real-time form validation
- ✅ Secure API with middleware

## 🎯 Spec-Driven Approach

This project follows **spec-driven development** where:

1. Specs define requirements BEFORE coding
2. AI agents (Claude Code) implement from specs
3. Documentation stays synced with code
4. All decisions are documented
5. Reproducible & maintainable

All specifications live in `.specify/` folder:

- `specs/001-backend-api/` - Backend API specification
- `specs/002-nextjs-frontend/` - Frontend specification
- `specs/003-integration/` - Integration & auth flow
- `history/` - Bug fixes and decisions log

## 🚀 Why This Matters

**vs Traditional "Vibe Coding":**

- ✅ Documentation always in sync
- ✅ Clear architecture decisions
- ✅ Easier onboarding for new developers
- ✅ AI agents work more effectively
- ✅ Fewer regressions & bugs
- ✅ Professional methodology

## 📊 Project Status

**Phase 2: COMPLETE** ✅

- Backend API with 6 REST endpoints
- Frontend with full task management UI
- JWT authentication end-to-end
- User isolation enforced
- All CRUD operations tested

**Coming Next:**

- Phase 3: AI-Powered features
- Phase 4: Kubernetes deployment
- Phase 5: Production scaling

## 🏗️ Architecture

```
┌─────────────┐         JWT Token        ┌─────────────┐
│  Next.js    │ ──────────────────────▶ │   FastAPI   │
│  Frontend   │                          │   Backend   │
│  (Port 3000)│ ◀────────────────────── │  (Port 8000)│
└─────────────┘      JSON Response       └─────────────┘
       │                                        │
       │                                        │
       ▼                                        ▼
  Better Auth                              SQLModel ORM
  (User Auth)                                   │
       │                                        │
       └────────────────┬───────────────────────┘
                        ▼
                ┌──────────────────┐
                │ Neon PostgreSQL  │
                │   (Serverless)   │
                └──────────────────┘
```

## 🎓 Learning Outcomes

This project demonstrates:

- Modern full-stack architecture
- Secure authentication patterns
- RESTful API design
- Type-safe development (TypeScript + Python type hints)
- Clean code separation (routes → services → models)
- Spec-driven development workflow
- AI-assisted development with Claude Code

```

---

## GitHub "About" Section (Max 350 chars)
```

Full-stack todo app using spec-driven development: Next.js 16 + FastAPI + Better Auth JWT + Neon PostgreSQL. Features: CRUD operations, user isolation, JWT auth, responsive UI. All code generated from specs via Claude Code. Complete documentation in .specify/ folder. Phase 2 of 5-phase project.

```

---

## GitHub Topics/Tags

Add these tags to your repository:
```

nextjs
fastapi
typescript
python
postgresql
jwt
authentication
fullstack
spec-driven-development
claude-code
better-auth
sqlmodel
tailwindcss
rest-api
todo-app
neon-database
hackathon

```

---

## Social Media/LinkedIn Post
```

🚀 Just completed Phase 2 of my full-stack todo app using spec-driven development!

📚 Tech Stack:

- Frontend: Next.js 16 + TypeScript + Better Auth
- Backend: FastAPI + SQLModel + Neon PostgreSQL
- Auth: JWT tokens with user isolation

🎯 What makes this special?
Entirely built using SPEC-DRIVEN methodology:
✅ Specs written BEFORE code
✅ AI agents (Claude Code) implement from specs
✅ Documentation always synced
✅ Every decision documented in .specify/ folder

💡 Key learnings:
Spec-driven development > "vibe coding"

- Faster debugging (root cause documented)
- Better team collaboration
- AI agents work more effectively
- Professional software engineering

🔗 Check out the repo: [link]

#FullStack #SpecDriven #NextJS #FastAPI #SoftwareEngineering #AI #ClaudeCode
