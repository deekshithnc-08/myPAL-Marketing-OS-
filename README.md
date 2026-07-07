# myPAL Marketing OS

Everything Marketing. One Platform.

This is a production-oriented Next.js 15 App Router implementation for myPAL's internal Marketing Operating System. It includes an executive dashboard, module command center, RBAC policy layer, server actions, NextAuth route handler, Supabase Storage helper, PWA manifest, and a normalized Prisma/PostgreSQL schema.

## Stack

- Next.js 15, React 19, TypeScript
- Tailwind CSS 4 with ShadCN-style local primitives
- Framer Motion, Lucide icons, Recharts
- Prisma ORM and PostgreSQL
- NextAuth authentication
- Supabase Storage client
- Vercel-ready configuration

## Run Locally

```bash
pnpm install
cp .env.example .env
pnpm db:generate
pnpm dev
```

Open `http://localhost:3000`.

## Database

The Prisma schema models:

- Workspaces, users, RBAC roles
- Tasks, dependencies, checklists, comments, tags, activity logs
- Sprints, projects, milestones
- Campaigns, content, leads, meetings
- Vendors, purchase orders, invoices/files, expenses, budgets
- Automations, reports, analytics snapshots
- Supabase-backed file assets with versioning

After setting `DATABASE_URL`, run:

```bash
pnpm db:migrate
```

## Production Notes

- Add real password verification or an SSO provider before opening credentials auth to users.
- Configure Supabase buckets from `src/lib/supabase.ts`.
- Use `src/lib/rbac.ts` as the single source for app permissions.
- Extend `src/app/actions/marketing.ts` for optimistic UI mutations and module-specific workflows.
