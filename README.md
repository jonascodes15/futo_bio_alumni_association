# FUTO Biology Alumni Association

Landing page, alumni census and admin dashboard for the Department of Biology Alumni Association, Federal University of Technology, Owerri.

**Stack:** Next.js (App Router, TS) · Tailwind CSS · Prisma · Neon Postgres · Resend · JWT cookie auth (jose)

## Setup

1. `npm install`
2. `cp .env.example .env` and fill in the values (Neon URLs, Resend key, secrets, WhatsApp link).
3. `npm run db:push` to create the tables in Neon (or `npm run db:migrate`).
4. Optional: `npm run db:seed` to store the admin in the `AdminUser` table (login also works directly with `ADMIN_EMAIL` / `ADMIN_PASSWORD`).
5. `npm run dev` then open http://localhost:3000, admin at `/admin/login`.

## Customising

- Executive council names, bios and photos: `components/site/council.tsx` (put photos in `public/`).
- Industry list: `lib/utils.ts`.
- Email sender: set `EMAIL_FROM` to an address on a domain verified in Resend.

## Windows note

Open the project using the folder's real casing (`C:\Users\Hp\Desktop\...`, with a capital **D**). If the path is opened as `desktop`, Next.js loads its internal modules twice and `next build` fails with `Invariant: Expected workStore to be initialized`.
