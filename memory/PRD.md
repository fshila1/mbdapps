# BDapps — Product Requirements Document

## Original Problem Statement
Build a full-stack demo web app called "BDapps" — a telecom developer platform for Robi.
Mock data only (no real backend). Visually polished, fully navigable, client-demo ready.
Two roles: Developer & Admin. Color scheme: deep navy (#0f172a) + red (#e11d48) + white.

## Architecture
- **Frontend-only React app** (no backend logic needed for this demo)
- All state via React Context (`/src/context/AppContext.jsx`)
- Mock data centralized in `/src/mocks/data.js`
- Session persisted via `localStorage`
- React Router v7 for routing
- Shadcn UI + Tailwind + lucide-react icons + recharts for charts + sonner for toasts
- Fonts: Cabinet Grotesk (headings) + IBM Plex Sans (body) + JetBrains Mono (code)

## User Personas
1. **Developer** — submits Pro/Lite apps, manages keywords, reads reports, browses Digital templates
2. **Admin** — approves apps, manages users, curates App Store, controls subscriptions/ads/USSD
3. **App Store consumer** — browses public store, signs in via OTP, subscribes to apps

## Demo Credentials
- Developer: `developer@bdapps.com` / `dev123`
- Admin: `admin@bdapps.com` / `admin123`

## Core Requirements (Static)
- All flows must be navigable end-to-end with no broken pages
- Status states for Pro apps: Active Production, Pending Approval, Suspended, Draft, Rejected, Limited Production, Scheduled Active Production, Terminated
- Data-testid on every interactive element
- Mock data persisted across reloads via localStorage

## What's Been Implemented (Feb 6, 2026)
### Auth
- Login screen (left brand panel + right form), demo creds card, Forgot Password modal, password show/hide
- Register page with full validation (6 fields)
- Role-based redirect (developer → /dashboard, admin → /admin)

### Developer Module
- Dashboard with 5 tiles + 4 stat widgets
- **Provisioning** (`/provisioning`): grid/list view toggle, search, type/status/operator filters, pagination (3/page), 3-step Create wizard (Basic+Advanced details, Services with per-API config tabs, Review), App Detail dialog with 5 tabs (General, APIs, Charging, Revenue Share, Activity Log)
- **BDapps Lite** (`/lite`, `/lite/create`, `/lite/applications`, `/lite/settings`, `/lite/reports`):
  - 4-step Create flow with template selection, auto-keyword generation, charging method
  - My Applications table with Use/View/Help/Publish per status
  - Settings (Keywords + My Profile with tabs and Edit/Save sections)
  - Reports with Message History + link to Other Reports
- **App Store** (`/appstore`, public): rotating hero (3 slides), search, tab nav (All/Newly/Top/Most), category dropdown, sub-banner, 3 horizontal scroll sections, OTP login dialog, app detail page with rate/review, "From Developer" section, footer
- **Reports** (`/reports`): sidebar nav (Overall/Application/Subscription) + form with Year/Month/Operator/etc. + recharts bar chart + table + Excel/PDF/Print exports
- **★ Digital** (`/digital`): gradient hero "Build Faster with Digital Templates", search, 2 tabs:
  - Lite Templates (6 cards with phone-screen SMS preview modal)
  - Provisioning Templates (4 cards with architecture flow diagram preview)
  - "Use This Template" pre-fills the respective creation flow

### Admin Module
- Dashboard with 6 tiles + stats
- **User Management**: 3 tabs (System Users, App Creators, Appstore Users) with search/filter, Add User dialog, Edit User page with Edit/Delete/Activate-Disable/Unlock/Reset Password
- **Provisioning**: status filter, Change State dialog enforcing remarks + valid transitions per status; Build Files tab with Approve/Reject/Download/Delete
- **App Store Admin**: Application Management (search + status + type filters, Edit dialog with Basic/Upload tabs, Publish/Unpublish), Layout Management (Hero + Sub Banner editable + Save)
- **Tap Admin**: sidebar with Subscriptions/Governance (Coming Soon)/Advertisements (Create/Manage/Assign) /Promotions (Global USSD validation)

### Visual / UX
- Cabinet Grotesk + IBM Plex Sans typography
- Sharp 1px borders, hover lifts, no over-used purple gradients
- Navy left-rail on Login, red CTA buttons throughout
- Sonner toasts for all success/error feedback
- Inline form errors with red borders

## Prioritized Backlog
- **P1**: Replace mock OTP login with real SMS gateway integration
- **P1**: Add real chart data for Reports (currently static dataset)
- **P2**: Image upload preview for Icon/Banner/APK fields
- **P2**: Multi-operator support (Banglalink, GP, Teletalk)
- **P2**: Activity feed live updates via WebSockets
- **P2**: i18n (Bangla translation)
- **P3**: Dark mode toggle
- **P3**: Export Report as actual CSV/PDF (currently toast only)
