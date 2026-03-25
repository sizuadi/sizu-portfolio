---
title: "Type-Safe API Contracts with tRPC and Zod"
date: "2025-10-25"
readTime: "6 min"
tags: ["TypeScript", "tRPC", "Zod", "DX"]
excerpt: "How we eliminated runtime API errors by enforcing end-to-end type safety between our React frontend and Go backend using schema-first design."
---

Runtime API errors are the worst kind of bugs. They pass every type check, survive every lint rule, and only blow up when a user clicks the wrong button in production. We fixed this — here's how.

## The Problem

Our stack: React + TypeScript frontend, Go backend with REST APIs. Despite TypeScript on the client, we had no guarantee the API responses actually matched our type definitions. Every `as Response` was a lie waiting to happen.

## Schema-First Design

We adopted a **schema-first approach** using Zod:

```typescript
import { z } from 'zod';

// Define the schema once
export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['admin', 'user', 'viewer']),
  createdAt: z.string().datetime(),
});

// Derive the type from the schema
export type User = z.infer<typeof UserSchema>;
```

The schema serves three purposes:
1. **Type definition** — `z.infer` generates the TypeScript type
2. **Runtime validation** — parse API responses to catch mismatches immediately
3. **Documentation** — the schema *is* the contract

## tRPC for End-to-End Safety

For our internal services, we introduced tRPC. The router definitions on the backend automatically generate typed client hooks on the frontend:

```typescript
// Server
const appRouter = router({
  user: router({
    getById: publicProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async ({ input }) => {
        return db.users.findUnique({ where: { id: input.id } });
      }),
  }),
});

// Client — fully typed, zero codegen
const { data } = trpc.user.getById.useQuery({ id: userId });
// data is automatically typed as User | undefined
```

No OpenAPI spec generation. No codegen step. No manual type definitions. Change the backend, and TypeScript errors immediately appear in the frontend.

## Results

- **Zero runtime type errors** in production since adoption
- **40% fewer API-related bugs** in our issue tracker
- **Faster iteration** — developers trust the types and skip defensive checks

The investment in schema-first design paid for itself within the first sprint.
