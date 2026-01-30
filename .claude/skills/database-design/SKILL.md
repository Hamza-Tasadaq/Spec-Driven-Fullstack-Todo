---
name: database-design
description: Design relational database schemas, create tables, and manage migrations safely. Use for backend and data-driven applications.
---

# Database Schema Design

## Instructions

1. **Schema planning**

   - Identify core entities and relationships
   - Define primary keys and foreign keys
   - Normalize data (avoid duplication)

2. **Table creation**

   - Use appropriate data types
   - Apply NOT NULL and UNIQUE constraints
   - Add indexes for frequently queried fields

3. **Migrations**

   - Version-controlled schema changes
   - Forward (up) and backward (down) migrations
   - Non-destructive changes when possible

4. **Relationships**
   - One-to-one, one-to-many, many-to-many
   - Enforce referential integrity
   - Define cascade rules carefully

## Best Practices

- Use snake_case for table and column names
- Prefer UUIDs or auto-increment IDs consistently
- Never edit production tables manually
- Keep migrations small and reversible
- Document schema decisions

## Example Structure

### SQL Table Definition

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```
