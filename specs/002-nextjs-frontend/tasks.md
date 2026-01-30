# Tasks: Next.js Frontend with Better Auth

**Input**: Design documents from `/specs/002-nextjs-frontend/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested - test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `frontend/src/` (Next.js App Router with src-layout)
- Source: `frontend/src/app/`, `frontend/src/components/`, `frontend/src/lib/`, `frontend/src/hooks/`, `frontend/src/types/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Next.js 16+ project with TypeScript, Tailwind, App Router, ESLint in `frontend/` directory
- [x] T002 Add dependencies to `frontend/package.json`: better-auth, react-hook-form, lucide-react
- [x] T003 [P] Enable strict mode and configure paths in `frontend/tsconfig.json`
- [x] T004 [P] Configure Tailwind theme in `frontend/tailwind.config.ts`
- [x] T005 [P] Create environment template in `frontend/.env.local.example` with NEXT_PUBLIC_API_URL, BETTER_AUTH_SECRET, DATABASE_URL
- [x] T006 [P] Create Task, User, Session, Priority, TaskStatus types in `frontend/src/types/index.ts`
- [x] T007 [P] Create API request/response types in `frontend/src/types/api.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Configure Better Auth server with JWT plugin in `frontend/src/lib/auth.ts`
- [x] T009 Create Better Auth client helpers in `frontend/src/lib/auth-client.ts`
- [x] T010 [P] Implement JWT token storage helpers (get/set/remove) in `frontend/src/lib/token.ts`
- [x] T011 Implement API client with Bearer token and 401 handling in `frontend/src/lib/api-client.ts`
- [x] T012 [P] Create utility functions in `frontend/src/lib/utils.ts`
- [x] T013 Create useAuth hook (user, login, logout, isLoading, isAuthenticated) in `frontend/src/hooks/useAuth.ts`
- [x] T014 Create useTasks hook (getTasks, createTask, updateTask, deleteTask, toggleComplete) in `frontend/src/hooks/useTasks.ts`
- [x] T015 [P] Create Button component with variants and loading state in `frontend/src/components/ui/Button.tsx`
- [x] T016 [P] Create Input component with error display in `frontend/src/components/ui/Input.tsx`
- [x] T017 [P] Create Card component in `frontend/src/components/ui/Card.tsx`
- [x] T018 [P] Create Dialog component for confirmations in `frontend/src/components/ui/Dialog.tsx`
- [x] T019 [P] Create Select component for dropdowns in `frontend/src/components/ui/Select.tsx`
- [x] T020 [P] Create LoadingSpinner component in `frontend/src/components/LoadingSpinner.tsx`
- [x] T021 [P] Create ErrorMessage component in `frontend/src/components/ErrorMessage.tsx`
- [x] T022 Create ProtectedRoute wrapper component in `frontend/src/components/ProtectedRoute.tsx`
- [x] T023 Create root layout with AuthProvider context in `frontend/src/app/layout.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Registration (Priority: P1)

**Goal**: New users can create an account with email/password and be redirected to dashboard

**Independent Test**: Complete signup flow, verify user can log in with created credentials

### Implementation for User Story 1

- [x] T024 [US1] Create AuthForm component with React Hook Form (email, password, mode prop) in `frontend/src/components/AuthForm.tsx`
- [x] T025 [US1] Create signup page using AuthForm in `frontend/src/app/signup/page.tsx`
- [x] T026 [US1] Implement signup API route handler in `frontend/src/app/api/auth/[...all]/route.ts`
- [x] T027 [US1] Add form validation (email format, password min 8 chars) to AuthForm
- [x] T028 [US1] Add error handling for "Email already in use" scenario in AuthForm
- [x] T029 [US1] Add loading state to AuthForm submit button

**Checkpoint**: Users can register with email/password

---

## Phase 4: User Story 2 - User Login (Priority: P1)

**Goal**: Returning users can sign in and receive JWT token for API access

**Independent Test**: Log in with valid credentials, verify dashboard access and JWT token issuance

### Implementation for User Story 2

- [x] T030 [US2] Create login page using AuthForm (mode="login") in `frontend/src/app/login/page.tsx`
- [x] T031 [US2] Implement login flow with JWT token storage in useAuth hook
- [x] T032 [US2] Add "Invalid email or password" error handling to login page
- [x] T033 [US2] Implement session persistence check on app load (read token from localStorage)
- [x] T034 [US2] Implement auto-redirect to /login for unauthenticated users accessing protected routes
- [x] T035 [US2] Create landing page with auth redirect logic in `frontend/src/app/page.tsx`

**Checkpoint**: Users can log in and maintain session across browser sessions

---

## Phase 5: User Story 3 - View Task List (Priority: P2)

**Goal**: Authenticated users can view their tasks with filtering and sorting

**Independent Test**: Log in, view task list with status indicators, filter by status, sort by priority/date

### Implementation for User Story 3

- [x] T036 [US3] Create TaskCard component displaying title, status, priority, actions in `frontend/src/components/TaskCard.tsx`
- [x] T037 [US3] Create TaskFilters component with status filter and sort controls in `frontend/src/components/TaskFilters.tsx`
- [x] T038 [US3] Create TaskList component rendering tasks with filters in `frontend/src/components/TaskList.tsx`
- [x] T039 [US3] Create dashboard page with TaskList and TaskFilters in `frontend/src/app/dashboard/page.tsx`
- [x] T040 [US3] Implement getTasks API call in dashboard page on mount
- [x] T041 [US3] Add empty state with "Create your first task" prompt when no tasks exist
- [x] T042 [US3] Add loading state while fetching tasks
- [x] T043 [US3] Implement client-side filtering logic (all, pending, completed)
- [x] T044 [US3] Implement client-side sorting logic (by created_at, by priority)

**Checkpoint**: Users can view, filter, and sort their task list

---

## Phase 6: User Story 4 - Create New Task (Priority: P2)

**Goal**: Authenticated users can create new tasks with title, description, and priority

**Independent Test**: Create a task, verify it appears in the task list

### Implementation for User Story 4

- [x] T045 [US4] Create TaskForm component with React Hook Form (title, description, priority) in `frontend/src/components/TaskForm.tsx`
- [x] T046 [US4] Create new task page using TaskForm in `frontend/src/app/tasks/new/page.tsx`
- [x] T047 [US4] Implement createTask API call on form submit
- [x] T048 [US4] Add "Title is required" validation error to TaskForm
- [x] T049 [US4] Add Cancel button that returns to dashboard without saving
- [x] T050 [US4] Add loading state to TaskForm submit button
- [x] T051 [US4] Redirect to dashboard on successful task creation

**Checkpoint**: Users can create new tasks with all required fields

---

## Phase 7: User Story 5 - Edit Existing Task (Priority: P3)

**Goal**: Authenticated users can modify existing task details

**Independent Test**: Edit a task, verify changes persist after returning to dashboard

### Implementation for User Story 5

- [x] T052 [US5] Create edit task page with dynamic route in `frontend/src/app/tasks/[id]/page.tsx`
- [x] T053 [US5] Implement getTask API call to fetch task data for edit form
- [x] T054 [US5] Pre-fill TaskForm with existing task values
- [x] T055 [US5] Implement updateTask API call on form submit
- [x] T056 [US5] Add Edit button to TaskCard linking to /tasks/[id]
- [x] T057 [US5] Add validation and error handling for edit form
- [x] T058 [US5] Redirect to dashboard on successful update

**Checkpoint**: Users can edit existing tasks

---

## Phase 8: User Story 6 - Toggle Task Completion (Priority: P3)

**Goal**: Users can mark tasks complete/incomplete with single click

**Independent Test**: Click completion toggle, verify visual status change

### Implementation for User Story 6

- [x] T059 [US6] Add completion toggle checkbox/button to TaskCard
- [x] T060 [US6] Implement toggleComplete API call in TaskCard on toggle click
- [x] T061 [US6] Add optimistic UI update for instant visual feedback
- [x] T062 [US6] Add loading indicator on individual task during toggle
- [x] T063 [US6] Implement click debouncing to prevent duplicate API calls
- [x] T064 [US6] Handle toggle error with rollback and error message

**Checkpoint**: Users can toggle task completion with visual feedback

---

## Phase 9: User Story 7 - Delete Task (Priority: P3)

**Goal**: Users can permanently delete tasks with confirmation

**Independent Test**: Delete a task, verify it no longer appears in the list

### Implementation for User Story 7

- [x] T065 [US7] Add Delete button to TaskCard
- [x] T066 [US7] Implement confirmation dialog on delete click using Dialog component
- [x] T067 [US7] Implement deleteTask API call on confirmation
- [x] T068 [US7] Remove task from list on successful deletion
- [x] T069 [US7] Add cancel button to dismiss dialog without deleting
- [x] T070 [US7] Handle delete error with error message display

**Checkpoint**: Users can delete tasks with confirmation

---

## Phase 10: User Story 8 - User Logout (Priority: P4)

**Goal**: Users can end their session and clear authentication

**Independent Test**: Click logout, verify redirect to login and inability to access protected routes

### Implementation for User Story 8

- [x] T071 [US8] Add Logout button to dashboard layout/header
- [x] T072 [US8] Implement logout in useAuth hook (clear token, reset state)
- [x] T073 [US8] Redirect to /login on logout
- [x] T074 [US8] Verify protected routes redirect after logout

**Checkpoint**: Users can securely end their session

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T075 [P] Add responsive styling breakpoints (mobile, tablet, desktop) across all components
- [x] T076 [P] Implement 401 response handling in api-client (redirect to login with "Session expired" message)
- [x] T077 [P] Add network error handling with user-friendly messages across all API calls
- [x] T078 [P] Add "Task not found" handling for edit page when task deleted elsewhere
- [x] T079 [P] Add loading states to all pages that fetch data
- [x] T080 Update frontend README.md with setup instructions and environment variables

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-10)**: All depend on Foundational phase completion
  - US1 (Registration) and US2 (Login) should complete before US3-8 (task features require auth)
  - US3-8 can proceed in parallel after US1/US2 complete
- **Polish (Phase 11)**: Depends on all user stories being complete

### User Story Dependencies

```
Setup (Phase 1)
    ↓
Foundational (Phase 2)
    ↓
┌───────────────────────────────────────┐
│  US1 (Registration) ←──┐              │
│         ↓              │              │
│  US2 (Login) ──────────┘              │
│         ↓                             │
│  ┌──────┴──────┬──────────┐           │
│  ↓             ↓          ↓           │
│ US3 (View)   US4 (Create) US8 (Logout)│
│  ↓             ↓                      │
│ US5 (Edit)   US6 (Toggle)             │
│               ↓                       │
│             US7 (Delete)              │
└───────────────────────────────────────┘
    ↓
Polish (Phase 11)
```

### Within Each User Story

- Core implementation before UI integration
- Form components before page components
- API calls integrated last
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**: T003-T007 can run in parallel
**Phase 2 (Foundational)**: T010, T012, T015-T021 can run in parallel
**After Phase 2**: US3-US8 can run in parallel (all depend only on US1/US2 for auth)
**Phase 11 (Polish)**: T075-T079 can run in parallel

---

## Parallel Example: Phase 2 Foundation

```bash
# Launch parallel UI components:
Task: "Create Button component in frontend/src/components/ui/Button.tsx"
Task: "Create Input component in frontend/src/components/ui/Input.tsx"
Task: "Create Card component in frontend/src/components/ui/Card.tsx"
Task: "Create Dialog component in frontend/src/components/ui/Dialog.tsx"
Task: "Create Select component in frontend/src/components/ui/Select.tsx"
Task: "Create LoadingSpinner component in frontend/src/components/LoadingSpinner.tsx"
Task: "Create ErrorMessage component in frontend/src/components/ErrorMessage.tsx"
```

## Parallel Example: Task Features

```bash
# After US1/US2 complete, launch task features in parallel:
Task: "US3 - Create TaskCard component in frontend/src/components/TaskCard.tsx"
Task: "US4 - Create TaskForm component in frontend/src/components/TaskForm.tsx"
Task: "US8 - Add Logout button to dashboard"
```

---

## Implementation Strategy

### MVP First (US1 + US2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Registration)
4. Complete Phase 4: User Story 2 (Login)
5. **STOP and VALIDATE**: Test signup → login → dashboard redirect flow
6. Deploy/demo authentication MVP

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 + US2 → Auth working → Deploy (Auth MVP!)
3. US3 → View tasks → Deploy
4. US4 → Create tasks → Deploy
5. US5-US7 → Full task CRUD → Deploy
6. US8 + Polish → Complete feature → Final Deploy

### Full Parallel Strategy

With multiple developers after Phase 2:
- Developer A: US1 → US2 (auth flow)
- Developer B: UI components refinement, responsive design
- After auth complete:
  - Developer A: US3 + US4 (view + create)
  - Developer B: US5 + US6 + US7 (edit + toggle + delete)
  - Developer C: US8 + Polish

---

## Summary

| Phase | Tasks | Parallelizable |
|-------|-------|----------------|
| Setup | T001-T007 | 5 of 7 |
| Foundational | T008-T023 | 10 of 16 |
| US1: Registration | T024-T029 | 0 of 6 |
| US2: Login | T030-T035 | 0 of 6 |
| US3: View Tasks | T036-T044 | 0 of 9 |
| US4: Create Task | T045-T051 | 0 of 7 |
| US5: Edit Task | T052-T058 | 0 of 7 |
| US6: Toggle Complete | T059-T064 | 0 of 6 |
| US7: Delete Task | T065-T070 | 0 of 6 |
| US8: Logout | T071-T074 | 0 of 4 |
| Polish | T075-T080 | 5 of 6 |
| **Total** | **80 tasks** | **20 parallel** |

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Auth stories (US1, US2) must complete before task stories (US3-US8)

---

## Bug Fixes

### BF-001: Dark Mode Text Visibility (2026-01-30)

**Issue**: User types in Title input but text is barely visible (very light gray)

**Root Cause**: System dark mode CSS variables clashed with light mode UI
- `globals.css` had `@media (prefers-color-scheme: dark)` that set `--foreground: #ededed`
- Form inputs inherited this light color but kept white backgrounds
- Result: invisible text when system is in dark mode

**Fix Applied**:
- [x] Removed `@media (prefers-color-scheme: dark)` block from `frontend/src/app/globals.css`
- [x] Added explicit `text-gray-900 bg-white` to `frontend/src/components/ui/Input.tsx`
- [x] Added explicit `text-gray-900 bg-white` to textarea in `frontend/src/components/TaskForm.tsx`
- [x] Added explicit `text-gray-900` to `frontend/src/components/ui/Select.tsx`

**Spec Reference**: See `spec.md` → "Dark Mode Handling" section for architectural decision

**Verification**:
- Switch system to dark mode
- All input text should be dark and clearly visible
- No light text on light backgrounds
