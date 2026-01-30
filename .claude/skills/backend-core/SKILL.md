---
name: backend-core
description: Design backend APIs by generating routes, handling requests/responses, and connecting to databases securely and efficiently.
---

# Backend Core Skill

## Instructions

1. **API & Routing**

   - Design RESTful routes (CRUD)
   - Use clear, consistent URL naming
   - Separate concerns (routers, controllers, services)

2. **Request & Response Handling**

   - Validate request data (query, params, body)
   - Return proper HTTP status codes
   - Use structured JSON responses
   - Handle errors gracefully with centralized middleware

3. **Database Integration**

   - Connect to relational or NoSQL databases
   - Use ORM/ODM or raw queries where appropriate
   - Implement migrations and schema models
   - Ensure secure credential handling (env variables)

4. **Security & Reliability**
   - Input validation & sanitization
   - Authentication & authorization (JWT, sessions)
   - Rate limiting and basic logging
   - Error handling and fallback responses

## Best Practices

- Follow REST or API contract standards
- Keep controllers thin, business logic in services
- Use async/await with proper error handling
- Never expose sensitive data in responses
- Write scalable and testable code

## Example Structure

```ts
// routes/user.routes.ts
import { Router } from "express";
import { getUsers, createUser } from "../controllers/user.controller";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);

export default router;
```
