# One Day One Juz (OD1J)

A modern Gen Z Quran habit tracker built with Next.js, Supabase, and a Stealth Neon aesthetic.

**Developed by [Derryl Youri](https://github.com/derryl-youri)**

## Features
- **Guest-First Experience**: Start tracking immediately without login.
- **Unified Sync**: Seamlessly migrate guest progress to Supabase after login.
- **Liquid Glass UI**: Modern iOS 26 aesthetic with dark mode and glassmorphism.
- **Quran Reader**: Minimal reader with auto-bookmarking and font control.
- **Progress Tracking**: 90-day activity heatmap and streak metrics.
- **Instagram Share**: Generate custom PNGs optimized for IG Stories.
- **PWA**: Installable on mobile with offline juz support.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript + Tailwind CSS
- Supabase (Auth + Postgres + RLS)
- IDB-Keyval (Guest storage)
- Lucide React (Icons)

## Getting Started

### 1. Project Initialization
```bash
npm install
npm run dev
```

### 2. Supabase Setup
- Create a new project at [supabase.com](https://supabase.com).
- Copy `.env.example` to `.env.local` and fill in:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
- Enable **Google Provider** in Authentication -> Providers.
- Add `http://localhost:3000/profile` to Redirect URLs.
- Copy and run the SQL in `/supabase/migrations/initial_schema.sql` in the SQL Editor.

## Folder Structure
- `/app`: Next.js pages and layouts.
- `/components`: Reusable UI and feature components.
- `/lib`: Core logic (Supabase, Storage, Streak, Prayer).
- `/hooks`: Custom React hooks for state and lifecycle.
- `/types`: Domain models.
- `/public`: Static assets and PWA manifest.

## Deploying to Vercel
Connect your repo to Vercel and add your environment variables. Ensure the Supabase redirect URLs include your production domain.
