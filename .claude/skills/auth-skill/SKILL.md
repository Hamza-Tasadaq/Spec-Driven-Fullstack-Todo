---
name: auth-skill
description: Implement secure authentication systems including signup, signin, password hashing, JWT tokens, and Better Auth integration.
---

# Authentication Skill

## Instructions

1. **User Signup**

   - Validate input (email, password, username)
   - Enforce strong password rules
   - Prevent duplicate accounts
   - Store users securely in the database

2. **User Signin**

   - Verify credentials against stored hashes
   - Return meaningful error messages (without leaking info)
   - Support email/username-based login

3. **Password Security**

   - Hash passwords using a strong algorithm (bcrypt / argon2)
   - Use per-user salts
   - Never store or log plain-text passwords

4. **JWT Authentication**

   - Generate access tokens on successful signin
   - Include user ID and roles in payload
   - Set token expiration and refresh strategy
   - Verify JWT on protected routes

5. **Better Auth Integration**
   - Configure Better Auth providers
   - Centralize auth logic
   - Support session & token-based authentication
   - Enable extensibility for OAuth providers

## Best Practices

- Follow OWASP authentication guidelines
- Use HTTPS only
- Store secrets in environment variables
- Implement rate limiting on auth endpoints
- Rotate JWT secrets periodically
- Separate auth logic from business logic

## Example Structure

```ts
// Signup
app.post("/signup", async (req, res) => {
  const hashedPassword = await hashPassword(req.body.password);
  const user = await createUser({
    email: req.body.email,
    password: hashedPassword,
  });
  res.status(201).json({ message: "User created" });
});

// Signin
app.post("/signin", async (req, res) => {
  const user = await findUserByEmail(req.body.email);
  const isValid = await verifyPassword(req.body.password, user.password);

  if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

  const token = generateJWT({ userId: user.id });
  res.json({ token });
});

// Protected route
app.get("/profile", verifyJWT, (req, res) => {
  res.json({ userId: req.user.id });
});
```
