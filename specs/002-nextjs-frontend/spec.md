# Feature Specification: Next.js Frontend with Better Auth

**Feature Branch**: `002-nextjs-frontend`
**Created**: 2026-01-15
**Status**: Draft
**Input**: User description: "Spec 2: Frontend - Next.js 16+ App Router + Better Auth for task management"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Registration (Priority: P1)

A new user visits the application and wants to create an account to manage their personal tasks. They navigate to the signup page, enter their email and password, and receive confirmation of successful registration before being redirected to their task dashboard.

**Why this priority**: User registration is foundational - without accounts, no personalized task management is possible. This enables all subsequent features.

**Independent Test**: Can be fully tested by completing the signup flow and verifying the user can log in with created credentials. Delivers value as the entry point to the application.

**Acceptance Scenarios**:

1. **Given** a visitor on the landing page, **When** they click "Sign Up", **Then** they are directed to the registration form
2. **Given** a user on the signup form, **When** they enter a valid email and password (min 8 characters), **Then** an account is created and they are redirected to the dashboard
3. **Given** a user on the signup form, **When** they enter an already registered email, **Then** they see an error message "Email already in use"
4. **Given** a user on the signup form, **When** they enter a password shorter than 8 characters, **Then** they see a validation error before submission

---

### User Story 2 - User Login (Priority: P1)

A returning user wants to access their tasks. They enter their credentials on the login page and are authenticated, receiving a JWT token that enables API access. They are then redirected to their task dashboard.

**Why this priority**: Authentication is required before users can view or manage their tasks. This is equally critical as registration.

**Independent Test**: Can be tested by logging in with valid credentials and verifying dashboard access and JWT token issuance.

**Acceptance Scenarios**:

1. **Given** a registered user on the login page, **When** they enter valid credentials, **Then** they are authenticated, issued a JWT token, and redirected to dashboard
2. **Given** a user on the login page, **When** they enter invalid credentials, **Then** they see an error message "Invalid email or password"
3. **Given** an authenticated user, **When** they close the browser and return, **Then** their session persists (via stored token) and they remain logged in
4. **Given** an unauthenticated user, **When** they attempt to access /dashboard directly, **Then** they are redirected to /login

---

### User Story 3 - View Task List (Priority: P2)

An authenticated user wants to see all their tasks. They access the dashboard and see a list of their tasks with status indicators (pending/completed), priority levels, and creation dates. They can filter and sort the list.

**Why this priority**: Viewing tasks is the primary read operation and enables users to understand their workload before taking action.

**Independent Test**: Can be tested by logging in and viewing the task list. Delivers value by showing users their current tasks and their status.

**Acceptance Scenarios**:

1. **Given** an authenticated user with tasks, **When** they access the dashboard, **Then** they see all their tasks with title, status indicator, and priority
2. **Given** a user viewing tasks, **When** they select "Completed" filter, **Then** only completed tasks are displayed
3. **Given** a user viewing tasks, **When** they select "Pending" filter, **Then** only incomplete tasks are displayed
4. **Given** a user viewing tasks, **When** they sort by priority, **Then** tasks are ordered high-to-low priority
5. **Given** a user viewing tasks, **When** they sort by date, **Then** tasks are ordered by creation date (newest first by default)
6. **Given** an authenticated user with no tasks, **When** they access the dashboard, **Then** they see an empty state with prompt to create first task

---

### User Story 4 - Create New Task (Priority: P2)

An authenticated user wants to add a new task. They navigate to the "New Task" page, fill in the task details (title, description, priority), and submit. The task is created via the API and appears in their task list.

**Why this priority**: Creating tasks is the primary write operation that populates the user's task list.

**Independent Test**: Can be tested by creating a task and verifying it appears in the task list.

**Acceptance Scenarios**:

1. **Given** an authenticated user on the dashboard, **When** they click "New Task", **Then** they are directed to the task creation form
2. **Given** a user on the task form, **When** they enter a title (required), optional description, select priority, and submit, **Then** the task is created and they are redirected to dashboard
3. **Given** a user on the task form, **When** they submit without a title, **Then** they see a validation error "Title is required"
4. **Given** a user on the task form, **When** they click "Cancel", **Then** they return to the dashboard without creating a task

---

### User Story 5 - Edit Existing Task (Priority: P3)

An authenticated user wants to modify an existing task's details. They select a task, navigate to the edit form (pre-filled with current values), make changes, and save.

**Why this priority**: Editing enables users to update task information as circumstances change.

**Independent Test**: Can be tested by editing a task and verifying the changes persist.

**Acceptance Scenarios**:

1. **Given** a user viewing tasks, **When** they click "Edit" on a task, **Then** they are directed to /tasks/[id] with a pre-filled form
2. **Given** a user on the edit form, **When** they modify fields and save, **Then** the task is updated and they return to dashboard
3. **Given** a user on the edit form, **When** they clear the title and try to save, **Then** they see a validation error
4. **Given** a user on the edit form, **When** they click "Cancel", **Then** changes are discarded and they return to dashboard

---

### User Story 6 - Toggle Task Completion (Priority: P3)

An authenticated user wants to mark a task as complete or reopen a completed task. They click a completion toggle on the task card, and the status updates immediately.

**Why this priority**: Quick completion toggle is essential for task workflow efficiency.

**Independent Test**: Can be tested by toggling a task's completion status and verifying the visual change.

**Acceptance Scenarios**:

1. **Given** a user viewing a pending task, **When** they click the completion toggle, **Then** the task is marked complete with visual indicator
2. **Given** a user viewing a completed task, **When** they click the completion toggle, **Then** the task is marked pending again
3. **Given** a user toggling completion, **When** the API call is in progress, **Then** a loading indicator is shown on the task

---

### User Story 7 - Delete Task (Priority: P3)

An authenticated user wants to remove a task permanently. They click delete on a task, confirm the action in a dialog, and the task is removed.

**Why this priority**: Deletion enables users to remove obsolete or erroneous tasks.

**Independent Test**: Can be tested by deleting a task and verifying it no longer appears in the list.

**Acceptance Scenarios**:

1. **Given** a user viewing a task, **When** they click "Delete", **Then** a confirmation dialog appears
2. **Given** a user viewing the confirmation dialog, **When** they confirm deletion, **Then** the task is removed and the list updates
3. **Given** a user viewing the confirmation dialog, **When** they cancel, **Then** the dialog closes and the task remains

---

### User Story 8 - User Logout (Priority: P4)

An authenticated user wants to end their session. They click logout, their token is cleared, and they are redirected to the login page.

**Why this priority**: Logout is important for security but used less frequently than other features.

**Independent Test**: Can be tested by logging out and verifying inability to access protected routes.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they click "Logout", **Then** their session token is cleared and they are redirected to /login
2. **Given** a logged-out user, **When** they attempt to access /dashboard, **Then** they are redirected to /login

---

### Edge Cases

- What happens when a user's JWT token expires? System should detect 401 responses and redirect to login with message "Session expired, please log in again"
- How does the system handle network errors during API calls? Display user-friendly error message and allow retry
- What happens if a task is deleted by another session while viewing? Display "Task not found" and redirect to dashboard
- How does the system handle rapid repeated clicks on completion toggle? Debounce clicks and prevent duplicate API calls

## Requirements *(mandatory)*

### Functional Requirements

#### Authentication
- **FR-001**: System MUST provide email/password signup with minimum 8-character password requirement
- **FR-002**: System MUST provide email/password login with JWT token issuance via Better Auth
- **FR-003**: System MUST persist authentication state across browser sessions using stored tokens
- **FR-004**: System MUST automatically redirect unauthenticated users from protected routes to /login
- **FR-005**: System MUST provide logout functionality that clears stored tokens and session
- **FR-006**: System MUST handle 401 API responses by redirecting to login

#### Task Management
- **FR-007**: System MUST display all tasks belonging to the authenticated user
- **FR-008**: System MUST allow filtering tasks by status (all, pending, completed)
- **FR-009**: System MUST allow sorting tasks by creation date and priority
- **FR-010**: Users MUST be able to create tasks with title (required), description (optional), and priority (low/medium/high)
- **FR-011**: Users MUST be able to edit existing task details
- **FR-012**: Users MUST be able to toggle task completion status with single click
- **FR-013**: Users MUST be able to delete tasks with confirmation dialog
- **FR-014**: System MUST display loading states during API operations
- **FR-015**: System MUST display error messages for failed operations with retry option

#### API Integration
- **FR-016**: System MUST attach JWT token as Bearer token in Authorization header for all API requests
- **FR-017**: System MUST use configurable API base URL from environment variable

### Key Entities

- **User**: Represents an authenticated user with email and password credentials. Users own tasks.
- **Task**: Represents a to-do item with title, description, priority (low/medium/high), completion status, and timestamps. Belongs to one user.
- **Session**: Represents an authenticated session with JWT token, user identity, and expiration.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete registration in under 60 seconds
- **SC-002**: Users can complete login in under 30 seconds
- **SC-003**: Task list loads and displays within 2 seconds of dashboard access
- **SC-004**: Users can create a new task in under 45 seconds
- **SC-005**: Task completion toggle reflects visually within 500ms of click
- **SC-006**: 100% of protected routes redirect unauthenticated users to login
- **SC-007**: Application displays appropriately on screens from 320px to 1920px width
- **SC-008**: All form submissions show loading state during API calls
- **SC-009**: All API errors display user-friendly messages (no technical jargon)
- **SC-010**: Users can successfully log out and have session cleared in single click

## Assumptions

- Backend API (from 001-backend-api) is available and implements the expected endpoints
- Better Auth library supports JWT plugin configuration as specified
- Users have modern browsers with JavaScript enabled
- Network connectivity is generally reliable (offline support is explicitly out of scope)
- Priority values are limited to: low, medium, high
- Task titles have a reasonable maximum length (255 characters)
- Descriptions are optional and support longer text (2000 characters)

## Constraints

- Must use Next.js 16+ with App Router (no Pages Router)
- Must use TypeScript in strict mode
- Must use Better Auth for authentication with JWT plugin
- Must use Tailwind CSS for styling
- Client-side state management only (no Redux or external state libraries)
- Environment variables for configuration (API URL, auth secret)

### Dark Mode Handling

**Decision**: Light mode only (no dark mode support in Phase 2)

**Rationale**:
- Simplified implementation
- Consistent user experience
- Dark mode adds complexity (2x styling maintenance)
- Can be added as Phase 2.5 enhancement if needed

**Implementation**:
- Remove `prefers-color-scheme` media queries from globals.css
- Use explicit Tailwind color classes (not CSS variables for text/backgrounds)
- All text inputs: `text-gray-900` (dark text on light background)
- All backgrounds: `bg-white` or `bg-gray-50`
- Labels: `text-gray-700`
- Placeholders: `placeholder-gray-400`

**Form Input Styling Requirements**:
```tsx
// Input fields MUST include explicit text color
<input className="text-gray-900 bg-white border-gray-300 placeholder-gray-400 ..." />

// Textarea fields MUST include explicit text color
<textarea className="text-gray-900 bg-white border-gray-300 placeholder-gray-400 ..." />

// Select fields MUST include explicit text color
<select className="text-gray-900 bg-white border-gray-300 ..." />
```

**globals.css Requirements**:
```css
/* DO NOT use prefers-color-scheme media queries */
/* Use fixed light mode colors only */
:root {
  --background: #ffffff;
  --foreground: #171717;
}

body {
  background: var(--background);
  color: var(--foreground);
}
```

**Known Issue (Fixed)**: Prior implementation used `prefers-color-scheme: dark` media query which set `--foreground: #ededed` (light gray). When user's system was in dark mode, input text became nearly invisible against white backgrounds.

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000` |
| `BETTER_AUTH_SECRET` | Shared secret for JWT signing (must match backend) | `mySecureSecretKey123` |
| `DATABASE_URL` | PostgreSQL connection for Better Auth session storage | `postgresql://user:pass@host/db?ssl=require` |
| `BETTER_AUTH_URL` | Base URL for Better Auth (optional) | `http://localhost:3000` |

### Secret Format Requirements

**CRITICAL**: The `BETTER_AUTH_SECRET` must use only alphanumeric characters. Special characters cause JWT signature mismatches between frontend and backend due to different environment variable parsing:

| Environment | Behavior with `$` character |
|-------------|----------------------------|
| Next.js env loading | May interpret `$VAR` as variable substitution |
| Python dotenv | Reads `$VAR` literally |

This mismatch causes `InvalidSignatureError` when the backend verifies tokens signed by the frontend.

**Recommended Format**:
- Use only: `A-Z`, `a-z`, `0-9`
- Minimum length: 32 characters
- Generate with: `openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32`

**Example `.env`**:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=xK7P9mQeA2ZxL4HrD8SYtFnJ3WqB6VcM
DATABASE_URL=postgresql://user:pass@host/db?ssl=require
BETTER_AUTH_URL=http://localhost:3000
```

### Known Issue: JWT Signature Mismatch

If users see "Session expired" immediately after login, verify:
1. Both frontend and backend `.env` files contain identical `BETTER_AUTH_SECRET` values
2. The secret contains NO special characters (`$`, `!`, `@`, etc.)
3. No trailing whitespace or newlines in the secret value

## Out of Scope

- Dark mode / theme switching (light mode only - see Dark Mode Handling section)
- Server-side database access (API handles all persistence)
- Admin panel or user management features
- Email verification or password reset flows
- Social OAuth providers (Google, GitHub, etc.)
- Offline support or PWA features
- Real-time updates or WebSocket connections
- Task sharing between users
- Task categories or tags
- Due dates or reminders
- File attachments on tasks
