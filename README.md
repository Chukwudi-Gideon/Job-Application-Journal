# Job Application Journal

A polished React + TypeScript + Vite application for tracking job applications from the first submission through interviews, offers, rejections, and follow-ups.

Live demo: https://job-application-journal.vercel.app/

## Overview

This project is a personal job search tracker designed to help keep application history, notes, and status updates organized in one place. It combines a clean dashboard, searchable records, and structured statuses so users can move from "applying" to "follow-up" without losing context.

The current version is backed by Supabase for persistence and uses anonymous session-based authentication so records can be saved across sessions without a full sign-up flow.

## What changed in this version

- Added a more robust application dashboard with active/archive views.
- Introduced searchable filtering by company, role, keywords, and status.
- Added duplicate protection to reduce accidental re-entry of the same application.
- Kept the journal focused on practical job-search workflows: notes, status changes, and historical tracking.
- Switched storage to a Supabase-backed model instead of browser-only local persistence.

## Key features

- Add job applications with company, role, location, salary, source, and notes.
- Track statuses such as Applied, In Review, Interviewing, Offered, Wishlist, Accepted, Rejected, and Unresponsive.
- Review and update records inline from the application cards.
- Use search and status filters to focus on specific entries.
- Archive completed roles while keeping active opportunities separate.
- Store application data in Supabase under an anonymous user session for a lightweight, no-signup workflow.

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Supabase JS client
- Lucide icons

## Project structure

- `src/App.tsx` — dashboard, filtering, tab logic, and record lifecycle.
- `src/components/AddJobs.tsx` — add-application form and validation.
- `src/components/JobCard.tsx` — record cards with updates, status changes, and deletion.
- `src/components/QuickStartGuide.tsx` — in-app usage and project information.
- `src/lib/auth.ts` — anonymous authentication utility.
- `src/lib/supabase.ts` — Supabase client configuration.
- `src/types.ts` — domain model and status definitions.
- `src/data.ts` — starter data and timeline setup.

## Getting started

### Requirements

- Node.js 18+
- npm

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open the local Vite URL shown in the terminal, then create a few records to start tracking your job search.

### Production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Usage

1. Open the app and click New Application.
2. Enter the company, role, and job-search details.
3. Save the record to add it to the dashboard.
4. Use tabs and filters to switch between active and archived records.
5. Update the status and notes as your application moves through the process.

## Data protection and transparency

This project is built for personal tracking and portfolio demonstration. The information stored is intended to help users manage their job-search process and keep relevant details in one place.

### Browser and device recovery

This app does not create a traditional personal login account. Instead, it uses an anonymous session and stores records in the connected Supabase project. In practical terms:

- Records are generally recoverable on the same browser/device setup if the app continues to connect to the same project.
- They are not guaranteed to appear on a different browser or device unless that browser/device is using the same configured app and backing project.
- If the project is changed, reset, or the app is pointed at a different database, the old records will not automatically follow.

This is important for anyone expecting full cross-browser portability without a real account or migration process.

### What is stored

Typical records may include:

- company name
- job title
- location
- salary or compensation notes
- application source or method
- description and interview notes
- status updates and follow-up timeline

### What is not intended

- This app is not designed to store sensitive personal identity data, government IDs, or confidential credentials.
- It is not a recruitment platform or HR system.
- It is not intended to replace a formal employer record system or legal/compliance workflow.

### Privacy model

The app currently uses anonymous Supabase authentication and stores records in the configured Supabase project for the app's database. This means persistence is session-based and project-backed rather than fully browser-local. The app owner is responsible for managing the Supabase security settings, project access, and retention practices.

### Transparency statement

- Data is used only for the job-tracking workflow in this application.
- Applications are not used for external profiling or automated hiring decisions.
- The project is designed as a lightweight personal tool, not a commercial applicant-tracking platform.

## License

This project is licensed under the MIT License.

See the LICENSE file for full terms.

## Dependencies

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- Lucide React

## Notes

- The app is meant to be practical and lightweight, with an emphasis on clarity, status tracking, and follow-up discipline.
- If you deploy this project publicly, make sure your Supabase URL and anon key are configured securely and you understand the privacy implications of storing application data online.

