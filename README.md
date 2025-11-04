# CommunityConnect — Web-Based Community Information System

Modern Next.js (App Router) prototype implementing the PRD with auth, RBAC, and core modules: Announcements, Complaints, Service Schedules, Events, and a lightweight Admin dashboard. MongoDB is accessed via Mongoose. Authentication is via NextAuth (credentials provider).

## 1) Prerequisites

- Node.js 18+
- A MongoDB connection string

## 2) Environment

Create a `.env.local` file in the project root:

```env
MONGODB_URI="your-mongodb-connection-string"
NEXTAUTH_SECRET="a-strong-random-string"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

Tip: Generate NEXTAUTH_SECRET with `node -e "console.log(crypto.randomBytes(32).toString('hex'))"`.

## 3) Install and run

```bash
npm install
npm run dev
```

Visit <http://localhost:3000>.

## 4) Modules overview

- Auth: /login, /register, password reset prototype under /reset-password/request
- Announcements: /announcements (list), /announcements/new (admin)
- Complaints: /complaints (list), /complaints/new (resident)
- Service Schedules: /schedules (list), /schedules/new (admin)
- Events: /events (list + register), /events/new (admin)
- Admin dashboard: /admin
- Notifications: /notifications

Admin-only routes are protected by middleware. To create an admin user, register normally then update the user’s role to `admin` directly in your database, or modify the register API to allow admin creation during initial setup.

## 5) Notes

- This is a prototype: email/SMS is out of scope; password reset returns a link directly.
- RBAC is enforced both client-side (UI) and server-side (API + middleware).
- Models live in `models/`, DB helper in `lib/db.ts`.
