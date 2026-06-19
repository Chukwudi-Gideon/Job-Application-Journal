# Job Application Tracker

A polished React + TypeScript + Vite portfolio project for tracking job applications. It follows each opportunity from application submission through the hiring lifecycle.

Live demo: https://job-application-journal.vercel.app/

## Overview

This project is a personal job application journal built with Vite, React, TypeScript, Tailwind CSS, and Lucide icons.

All data is stored locally in the browser, so the tool is immediately ready to use without backend setup while preserving your application history and follow-up reminders.

## Key Features

- Add new applications with company, role, location, salary, source, method, and notes.
- Track application progress using status stages such as Applied, Interviewing, Offered, Rejected, and Unresponsive.
- Automatically archive stale entries after inactivity and encourage follow-up on aging applications.
- Inline edit application notes, CV version, and job details from the card view.
- Prevent duplicate entries by checking company and role pairs before saving.
- Store all data locally in browser `localStorage` so the app is ready to use without backend setup.

## File Structure

- `src/App.tsx` — main dashboard, app state, filters, tabs, and storage logic.
- `src/components/AddJobs.tsx` — form for creating new applications.
- `src/components/JobCard.tsx` — individual application cards with edit and status controls.
- `src/components/QuickStartGuide.tsx` — in-app usage guide and feature overview.
- `src/types.ts` — shared TypeScript interfaces and status definitions.
- `src/data.ts` / `src/MockData.ts` — initial demo data and timeline setup.

## Getting Started

### Requirements

- Node.js 18+ (or compatible version).
- npm installed.

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open the local Vite URL shown in the terminal, then use the app to add and manage your applications.

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Usage

1. Click **+ New Application** to open the add form.
2. Enter the company, role, location, and other details.
3. Save the application to add it to your dashboard.
4. Use the tabs to switch between active and archived applications.
5. Edit or update status directly from the job cards as your application progresses.

## Notes

- This app uses browser `localStorage` for persistence, so your data stays available on the same device and browser.
- There is no backend server required for the core experience.
- The UI is designed to preserve layout and keep the tracker compact and responsive.

## Dependencies

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React icons

## License

This project is available for personal and portfolio use.

