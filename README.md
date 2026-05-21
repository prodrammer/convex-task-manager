# Convex Task Manager

A task management app built with [Convex](https://convex.dev), React 19, TypeScript, and Tailwind CSS. Supports self-hosted Convex for local development — no Convex Cloud account required.

## Features

- **Projects** — create and manage projects with color labels
- **Tasks** — full lifecycle: status (`todo` → `in_progress` → `in_review` → `done`), priority, due dates, assignees
- **Tags** — per-project labels you can attach to any task
- **Comments** — threaded comments on tasks
- **Activity log** — automatic history of status changes, assignments, and edits

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, TypeScript |
| Backend / DB | Convex (self-hosted or cloud) |
| Styling | Tailwind CSS v4, Radix UI |
| Icons | lucide-react |
| Routing | react-router-dom v7 |

## Quick start (self-hosted, local)

This is the recommended path if you don't want a Convex Cloud account.

**Prerequisites:** Node.js 18+

**1. Install dependencies**

```sh
npm install
```

**2. Start the local Convex backend**

`npx convex dev` runs the open-source Convex backend as a local subprocess — no Docker, no account needed.

```sh
npx convex dev
```

On first run it will ask for a project name and create a `.env.local` file automatically. It will also generate the `convex/_generated/` types.

> Keep this terminal running while developing. It hot-reloads backend functions on save.

**3. Start the frontend**

In a separate terminal:

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Quick start (Convex Cloud)

If you prefer Convex Cloud's hosted backend:

**1.** Create a free account at [convex.dev](https://convex.dev)

**2.** Run `npx convex dev` — it will prompt you to log in and provision a cloud dev deployment

**3.** Run `npm run dev` in a separate terminal

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values. `npx convex dev` manages this automatically for local deployments.

| Variable | Description |
|---|---|
| `CONVEX_SELF_HOSTED_URL` | Backend URL for self-hosted deployments (default: `http://127.0.0.1:3210`) |
| `CONVEX_SELF_HOSTED_ADMIN_KEY` | Admin key for self-hosted deployments |
| `VITE_CONVEX_URL` | Backend URL used by the frontend (same as `CONVEX_SELF_HOSTED_URL` for local) |

## Project structure

```
convex/               # Backend functions and schema
  schema.ts           # Database schema (tables + indexes)
  projects.ts         # Project CRUD
  tasks.ts            # Task CRUD + status transitions + activity logging
  tags.ts             # Tag management
  taskTags.ts         # Task ↔ tag associations
  comments.ts         # Task comments
  activityLog.ts      # Task activity history
  users.ts            # User queries
  http.ts             # HTTP action routes

src/
  screens/            # Page-level components
  components/         # Shared UI components
  lib/                # Utilities (cn, etc.)
```

## Schema overview

```
users          — name, email (no auth yet)
projects       — name, description, color, owner
tasks          — title, status, priority, project, assignee, due date
tags           — name, color, scoped to a project
taskTags       — many-to-many tasks ↔ tags
comments       — threaded comments on tasks
activityLog    — automatic audit trail for task changes
```

## License

MIT
