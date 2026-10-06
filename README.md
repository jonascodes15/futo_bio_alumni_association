# FUTO Biology Alumni Association

Landing page, alumni census and admin dashboard for the Department of Biology Alumni Association, Federal University of Technology, Owerri.

**Live site:** https://futo-bio-alumni-association.vercel.app
**Admin:** https://futo-bio-alumni-association.vercel.app/admin/login

> Temporary Vercel address. It will be replaced by the association's own `.org` domain.

**Stack:** Next.js (App Router, TS) · Tailwind CSS · Motion · Prisma · Neon Postgres · Resend · JWT cookie auth (jose)

## Local setup

1. `npm install`
2. `cp .env.example .env` and fill in the values (Neon URLs, Resend key, secrets, WhatsApp link).
3. `npm run db:push` to create the tables in Neon (or `npm run db:migrate`).
4. Optional: `npm run db:seed` to store the admin in the `AdminUser` table (login also works directly with `ADMIN_EMAIL` / `ADMIN_PASSWORD`).
5. `npm run dev` then open http://localhost:3000, admin at `/admin/login`.

## Deployment

The site is hosted on Vercel (Hobby plan) and redeploys automatically on every push to `main`.

- Environment variables are set in the Vercel project under **Settings → Environment Variables**, using the same keys as `.env.example`.
- Vercel does not run database migrations. After changing `prisma/schema.prisma`, run `npm run db:push` (or `npx prisma migrate deploy`) from your machine against the Neon database.
- Custom domain: add it under **Settings → Domains** in the Vercel project, then verify the same domain in Resend and update `EMAIL_FROM`.

## Customising

- Executive council roles, names, bios and photos: `components/site/council.tsx`. Put photos in `public/council/` and set `photo`; leave `name` out until it is announced.
- Industry list: `lib/utils.ts`.
- Email sender: set `EMAIL_FROM` to an address on a domain verified in Resend. The default `onboarding@resend.dev` sender only delivers to the Resend account owner.
- Logo and browser icons: the logo is `public/logo.png`. The tab and home-screen icons (`app/favicon.ico`, `app/icon.png`, `app/apple-icon.png`) are generated from it, so regenerate them if the logo changes.

## Windows note

Open the project using the folder's real casing (`C:\Users\Hp\Desktop\...`, with a capital **D**). If the path is opened as `desktop`, Next.js loads its internal modules twice and `next build` fails with `Invariant: Expected workStore to be initialized`.
