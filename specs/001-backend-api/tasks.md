# Tasks: Backend API - Task Management REST API

**Input**: Design documents from `/specs/001-backend-api/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in spec - test tasks are omitted. Tests can be added in Polish phase if desired.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app (backend)**: `backend/app/` for source, `backend/tests/` for tests
- Based on plan.md project structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency management

- [x] T001 Create backend project directory structure per plan.md: `backend/app/{models,schemas,routers,services,middleware,utils}/`
- [x] T002 Initialize UV project with pyproject.toml in `backend/` directory
- [x] T003 Add production dependencies: fastapi, uvicorn, sqlmodel, asyncpg, pyjwt, python-dotenv
- [x] T004 [P] Add dev dependencies: pytest, pytest-asyncio, httpx, mypy, ruff
- [x] T005 [P] Create `.env.example` with DATABASE_URL, BETTER_AUTH_SECRET, FRONTEND_URL placeholders in `backend/.env.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Implement Settings class with Pydantic BaseSettings in `backend/app/config.py`
- [x] T007 Create async database engine with connection pooling in `backend/app/database.py`
- [x] T008 [P] Implement TaskStatus and Priority enums in `backend/app/models/task.py`
- [x] T009 Implement Task SQLModel with UUID pk, user_id, title, description, status, priority, is_completed, timestamps in `backend/app/models/task.py`
- [x] T010 [P] Create `__init__.py` with exports in `backend/app/models/__init__.py`
- [x] T011 [P] Implement JWT decode/verify helper function in `backend/app/utils/jwt.py`
- [x] T012 Implement verify_user FastAPI dependency (extract token, verify signature, check user_id match) in `backend/app/middleware/auth.py`
- [x] T013 [P] Create `__init__.py` files for all subpackages in `backend/app/`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Create Task (Priority: P1) 🎯 MVP

**Goal**: Authenticated user can create a new task with title, description, priority, and status

**Independent Test**: POST `/api/{user_id}/tasks` with valid JWT returns 201 with task including UUID and timestamps

### Implementation for User Story 1

- [x] T014 [P] [US1] Create TaskCreate schema (title required, description optional, status/priority with defaults) in `backend/app/schemas/task.py`
- [x] T015 [P] [US1] Create TaskResponse schema (all fields including id, timestamps) in `backend/app/schemas/task.py`
- [x] T016 [US1] Implement create_task service function with user_id injection in `backend/app/services/task_service.py`
- [x] T017 [US1] Implement POST `/api/{user_id}/tasks` endpoint with auth dependency in `backend/app/routers/tasks.py`
- [x] T018 [US1] Wire router to main app in `backend/app/main.py` (create app, add CORS, include router)
- [x] T019 [US1] Add database table creation in app lifespan in `backend/app/main.py`

**Checkpoint**: POST create task endpoint is functional. Can manually test: `curl -X POST /api/user123/tasks -H "Authorization: Bearer <token>" -d '{"title":"Test"}'`

---

## Phase 4: User Story 2 - List Tasks (Priority: P1)

**Goal**: Authenticated user can retrieve all their tasks (only their own, not other users')

**Independent Test**: GET `/api/{user_id}/tasks` with valid JWT returns 200 with array of user's tasks

### Implementation for User Story 2

- [x] T020 [US2] Implement get_tasks_by_user service function with user_id filter in `backend/app/services/task_service.py`
- [x] T021 [US2] Implement GET `/api/{user_id}/tasks` endpoint in `backend/app/routers/tasks.py`

**Checkpoint**: List tasks endpoint functional. User isolation verified - users only see their own tasks.

---

## Phase 5: User Story 3 - Update Task (Priority: P2)

**Goal**: Authenticated user can modify an existing task's fields (partial update)

**Independent Test**: PUT `/api/{user_id}/tasks/{id}` with updated fields returns 200 with updated task, unchanged fields preserved

### Implementation for User Story 3

- [x] T022 [P] [US3] Create TaskUpdate schema (all fields optional) in `backend/app/schemas/task.py`
- [x] T023 [US3] Implement update_task service function with ownership check in `backend/app/services/task_service.py`
- [x] T024 [US3] Implement PUT `/api/{user_id}/tasks/{task_id}` endpoint in `backend/app/routers/tasks.py`

**Checkpoint**: Update task endpoint functional. Returns 404 for non-existent tasks, 401 for wrong user's tasks.

---

## Phase 6: User Story 4 - Toggle Completion (Priority: P2)

**Goal**: Authenticated user can toggle is_completed status (true↔false) with a single PATCH request

**Independent Test**: PATCH `/api/{user_id}/tasks/{id}/complete` toggles is_completed from false→true, then true→false on second call

### Implementation for User Story 4

- [x] T025 [US4] Implement toggle_task_completion service function in `backend/app/services/task_service.py`
- [x] T026 [US4] Implement PATCH `/api/{user_id}/tasks/{task_id}/complete` endpoint in `backend/app/routers/tasks.py`

**Checkpoint**: Toggle completion endpoint functional. Calling twice returns task to original state.

---

## Phase 7: User Story 5 - Get Single Task (Priority: P2)

**Goal**: Authenticated user can retrieve a specific task by ID

**Independent Test**: GET `/api/{user_id}/tasks/{id}` returns 200 with complete task details, 404 if not found

### Implementation for User Story 5

- [x] T027 [US5] Implement get_task_by_id service function with ownership check in `backend/app/services/task_service.py`
- [x] T028 [US5] Implement GET `/api/{user_id}/tasks/{task_id}` endpoint in `backend/app/routers/tasks.py`

**Checkpoint**: Get single task endpoint functional. Returns 404 for non-existent or other user's tasks.

---

## Phase 8: User Story 6 - Delete Task (Priority: P3)

**Goal**: Authenticated user can permanently delete a task

**Independent Test**: DELETE `/api/{user_id}/tasks/{id}` returns 204, subsequent GET returns 404

### Implementation for User Story 6

- [x] T029 [US6] Implement delete_task service function with ownership check in `backend/app/services/task_service.py`
- [x] T030 [US6] Implement DELETE `/api/{user_id}/tasks/{task_id}` endpoint in `backend/app/routers/tasks.py`

**Checkpoint**: Delete endpoint functional. Task removed from database permanently.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, validation, and cleanup

- [x] T031 [P] Create README.md with setup instructions, API examples, environment config in `backend/README.md`
- [x] T032 [P] Add __init__.py exports to schemas package in `backend/app/schemas/__init__.py`
- [x] T033 [P] Add __init__.py exports to services package in `backend/app/services/__init__.py`
- [x] T034 [P] Add __init__.py exports to routers package in `backend/app/routers/__init__.py`
- [x] T035 [P] Add __init__.py exports to middleware package in `backend/app/middleware/__init__.py`
- [x] T036 [P] Add __init__.py exports to utils package in `backend/app/utils/__init__.py`
- [x] T037 Verify OpenAPI docs render correctly at `/docs` endpoint
- [x] T038 Run quickstart.md validation - test all documented curl commands

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - US1 (Create) and US2 (List) are P1 - implement first
  - US3-5 (Update, Toggle, Get) are P2 - implement second
  - US6 (Delete) is P3 - implement last
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (Create Task)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (List Tasks)**: Can start after Foundational - Independent of US1 (but tests may want data from US1)
- **User Story 3 (Update Task)**: Can start after Foundational - Independent (uses same Task model)
- **User Story 4 (Toggle)**: Can start after Foundational - Independent
- **User Story 5 (Get Single)**: Can start after Foundational - Independent
- **User Story 6 (Delete)**: Can start after Foundational - Independent

### Within Each User Story

- Schemas before services
- Services before endpoints
- Endpoints wired to router before testing
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1 Setup:**
- T004 and T005 can run in parallel

**Phase 2 Foundational:**
- T008, T010, T011, T013 can run in parallel after T006-T007 complete

**User Story Phases:**
- Once Foundational completes, US1 and US2 can start in parallel (different service functions)
- US3, US4, US5 can run in parallel after US1/US2 (different endpoints)
- US6 can run in parallel with US3-5

**Phase 9 Polish:**
- T031-T036 can all run in parallel (different files)

---

## Parallel Example: Foundational Phase

```bash
# After T006 (config) and T007 (database) complete:
# Launch these in parallel:
Task: "T008 [P] Implement TaskStatus and Priority enums in backend/app/models/task.py"
Task: "T010 [P] Create __init__.py with exports in backend/app/models/__init__.py"
Task: "T011 [P] Implement JWT decode/verify helper in backend/app/utils/jwt.py"
Task: "T013 [P] Create __init__.py files for all subpackages"
```

## Parallel Example: User Stories After Foundation

```bash
# After Phase 2 completes, launch US1 and US2 in parallel:
# US1 Stream:
Task: "T014 [P] [US1] Create TaskCreate schema"
Task: "T015 [P] [US1] Create TaskResponse schema"
# Then T016, T017, T018, T019 sequentially

# US2 Stream (in parallel with US1):
Task: "T020 [US2] Implement get_tasks_by_user service"
Task: "T021 [US2] Implement GET /api/{user_id}/tasks endpoint"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Create Task)
4. Complete Phase 4: User Story 2 (List Tasks)
5. **STOP and VALIDATE**: Test both endpoints with curl/Postman
6. Deploy/demo if ready - users can create and view tasks!

### Incremental Delivery

1. **Setup + Foundational** → Foundation ready
2. **Add US1 (Create)** → Can create tasks (demo-able!)
3. **Add US2 (List)** → Full create-read MVP
4. **Add US3 (Update)** → Tasks can be modified
5. **Add US4 (Toggle)** → Quick completion toggling
6. **Add US5 (Get Single)** → Detail views work
7. **Add US6 (Delete)** → Full CRUD complete
8. **Polish** → Documentation, cleanup

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (Create) + US2 (List)
   - Developer B: US3 (Update) + US4 (Toggle)
   - Developer C: US5 (Get Single) + US6 (Delete)
3. All stories complete and integrate via shared Task model

---

## Task Summary

| Phase | Tasks | Parallel Tasks |
|-------|-------|----------------|
| Phase 1: Setup | 5 | 2 |
| Phase 2: Foundational | 8 | 5 |
| Phase 3: US1 Create | 6 | 2 |
| Phase 4: US2 List | 2 | 0 |
| Phase 5: US3 Update | 3 | 1 |
| Phase 6: US4 Toggle | 2 | 0 |
| Phase 7: US5 Get Single | 2 | 0 |
| Phase 8: US6 Delete | 2 | 0 |
| Phase 9: Polish | 8 | 6 |
| **Total** | **38** | **16** |

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Tests not included (not requested in spec) - can add via Phase 9 or separate effort

---

## Bug Fixes

### BF001: Timezone Mismatch in Task Model (2026-01-24)

**Issue**: Task creation failing with 500 error
```
asyncpg.exceptions.DataError: can't subtract offset-naive and offset-aware datetimes
```

**Root Cause**: Python code generated timezone-aware datetimes (`datetime.now(timezone.utc)`) but PostgreSQL columns were `TIMESTAMP WITHOUT TIME ZONE`.

**Files Changed**:
1. `backend/app/models/task.py`
   - Removed `utc_now()` helper function
   - Changed `created_at` and `updated_at` fields from `datetime.now(timezone.utc)` to `datetime.utcnow()`

2. `backend/app/services/task_service.py`
   - Removed import of `utc_now` from models
   - Added `from datetime import datetime`
   - Changed `task.updated_at = utc_now()` to `task.updated_at = datetime.utcnow()` in:
     - `update_task()` function
     - `toggle_task_completion()` function

**Solution Applied**: Use timezone-naive UTC datetimes consistently (Option A from spec)

**Verification**:
- [ ] Create task with minimal data (title only)
- [ ] Create task with all fields
- [ ] Update task and verify updated_at changes
- [ ] Toggle completion and verify updated_at changes
