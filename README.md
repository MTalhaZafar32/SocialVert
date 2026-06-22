# SocialVert Client Content Dashboard

A white-label client portal that gives law firm clients a real-time view of their video content pipeline, scripts, captions, and posting schedule — all powered by live data from GoHighLevel (GHL) Custom Objects.

## What It Does

Clients receive a private URL (`/client/<uuid>`) and can see:

- **Dashboard** — quota tracker donut ring, stat cards (Completed / In Progress / Remaining), pipeline overview, and recent videos
- **Pipeline** — Kanban board across 6 stages: Ideation → Scripting → Video Production → Captions → Scheduling → Posted
- **Scripts** — Read scripts with status badges, revision feedback alerts, and ETA dates
- **Videos** — Filterable video library grouped by month with platform pills and View Video links for posted content
- **Captions** — Platform-specific captions (Instagram, TikTok, YouTube Shorts, Google My Business) with Hook / Caption / CTA / Hashtags
- **Schedule** — Calendar and list view of upcoming and past posts with status dots

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, SSR) |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Animation | Framer Motion |
| Data | GoHighLevel Custom Objects API |
| Deployment | Vercel |

## Environment Variables

Create a `.env.local` file in the project root (never commit this file):

```
GHL_API_BASE_URL=https://services.leadconnectorhq.com
GHL_PRIVATE_TOKEN=pit-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
GHL_LOCATION_ID=your_location_id_here
GHL_TOKEN_FIELD_ID=your_custom_field_id_here
```

`NEXT_PUBLIC_APP_URL` is set automatically by Vercel — do not add it manually in Vercel's environment settings.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo client URL: `http://localhost:3000/client/a1b2c3d4-e5f6-7890-abcd-ef1234567890`

## GHL Integration

All data is fetched server-side on each request (no caching). The dashboard uses:

- **Contacts API** — `GET /contacts/search` to look up a client by their token field
- **Custom Objects API** — `/objects/custom_objects.video/records/search` etc. with `pageLimit: 200` and client-side filtering by `contactId` (GHL's contact_id filter returns 422 on custom object searches)
- **Property keys** — GHL returns short snake_case keys (`title`, `pipeline_stage`, `script_title`, `platform_variant`, etc.)
- **Value normalization** — GHL returns lowercase+underscore values (`video_production`, `revision_requested`) which are mapped to display labels

A UUID-format middleware at `proxy.ts` blocks non-UUID tokens before any GHL lookup occurs.

## Deploying to Vercel

1. Push this repo to GitHub
2. Import the repo in [Vercel](https://vercel.com/new)
3. Add these four environment variables in Project Settings → Environment Variables:
   - `GHL_API_BASE_URL`
   - `GHL_PRIVATE_TOKEN`
   - `GHL_LOCATION_ID`
   - `GHL_TOKEN_FIELD_ID`
4. Deploy — Vercel sets `NEXT_PUBLIC_APP_URL` automatically

## Automation

This dashboard eliminates the manual reporting overhead that comes with managing multiple client content pipelines. Rather than sending weekly update emails or maintaining spreadsheets, SocialVert's team simply updates records in GoHighLevel and clients see their pipeline, scripts, and schedule in real time. The UUID-based access system means each client gets a shareable, bookmarkable link with zero login friction — no accounts, no passwords — while the per-token data isolation ensures every client sees only their own content.
