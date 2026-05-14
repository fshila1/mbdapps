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

## What's Been Implemented (Feb 6, 2026 — initial; Feb 10, 2026 — fixes; Feb 11, 2026 — Web/Android Builders)

### Iteration 3 — Web & Android App Builders (Feb 11, 2026)
- Added Web App Builder + Android App Builder tabs to `/digital`
- Persistent "My Generated Apps" shelf at top (localStorage; last 3 recent; View All modal)
- 12 new templates (6 web + 6 android) with category pills, search, ratings
- 3-design chooser modal (Modern Card / Minimal List / Full Screen) — CSS-only phone mockups
- Full builder view: live phone preview, color picker, emoji icon picker, app name/desc/dev/version
- Mock actions: Share Preview (copy URL toast), Download Code (3-step progress), Push to GitHub (3-step + connect step + repo URL), Deploy to Web (Netlify/Vercel cards + 3-step + URL), Submit to Play Store (Pro upgrade modal)
- Rate Template stars 1–5 — persists in localStorage and shows on gallery cards
- New files: `/components/digital/{PhonePreview,TemplateGallery,DesignChooserModal,AppBuilder,MyGeneratedAppsShelf}.jsx`, `/hooks/useBuilderStorage.js`, `/mocks/builderTemplates.js`

### Iteration 2 Fixes (Feb 10, 2026)
- **Persistent left sidebar** for all authenticated routes (Dev: 6 links, Admin: 7 links). Mobile slides in as drawer with overlay. Active route highlighted red.
- **Responsive across all screens**: hamburger toggle, scrollable tables, modals fit viewport, 44px tap targets.
- **Mandatory/Optional indicators**: red `*` on required and grey `(Optional)` on optional across Register/Provisioning/Lite/TapAdmin/UserManagement.
- **Register fix**: cursor bug resolved (was caused by `F` helper recreated each render); added Gender dropdown.
- **Tap Admin**: 8 pre-loaded subscribers spread across Registered/Reg_pending/Temporary_blocked/Unregistered/Initial. Search validates 018/016/019 prefixes. View popup shows full Charging + Other Charges (SMS MO 0.50 / SMS MT 0.30) + Instructions. 4 pre-loaded ads + 5 mock app assignments. Global USSD validates APP001/002/003.
- **App Store**: "Create Your Own App" → opens `/api-docs` (full docs portal with hero + 7 sections, syntax-highlighted code). Sign-In Modal intercepts unauthenticated Subscribe/Rate/Review.
- **Play Store-style App Detail**: large icon, dev name, rating+subscriber count, Subscribe/Share/Wishlist actions, Stats strip (Rating/Reviews/Subscribers/Version/Updated), 5 gradient screenshot carousel, About with Read more, Ratings & Reviews with breakdown bars + 4 review cards, "More from Developer" section.
- **Lite Create**: comprehensive Step 2 with sections — Keyword Details (shortcode 16222/16333/16444 + Auto Generate), App Validity Duration (toggle + date), Response Config, Charging (per-message vs subscription with daily/weekly/monthly checkboxes), Services-only Message Scheduling (Schedule Type incl. Custom Interval, Time, Message with 300-char counter, Day of Week/Month).
- **Lite My Apps**: added Type column (Alert/Services badge).
- **Provisioning Create Pro App**:
  - Removed Advanced tab; added "Enable Automatic Application Expiration" toggle in Basic.
  - Review step shows fixed Yes for Content Governance / Ads / Masking / Charging SDK.
  - **Each API service** now has Common/Robi sub-tabs:
    - SMS: MO/MT/Delivery Reports toggles with conditional URL fields; Robi accordions for SMS Configuration (shortcode/keyword/MPS/MPD locked) and Charging (party/amount, only when toggle enabled).
    - USSD: Connection URL + sub-required toggle; Robi: service code/keyword/MPS/MPD locked + charging accordion conditional.
    - CaaS: notification URL (optional) + sub-required dropdown; Robi: locked TPS/TPD + Debit Requests toggle reveals min/max + Mobile Account toggle reveals service charge %.
    - Subscription: response messages, locked confirmation, notification URL conditional, HTTP toggle; Robi: locked broadcast MPD + charging toggle reveals frequency checkboxes + amount.
- **Charging fields are conditionally rendered (unmounted when disabled)** across all forms — SMS MO/MT, USSD, CaaS debit, Subscription, Lite charging.
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
- **★ Digital** (`/digital`): gradient hero "Build Faster with Digital Templates", **persistent "My Generated Apps" shelf** at top (last 3 generated, with View All modal), 4 tabs:
  - Lite Templates (6 cards with phone-screen SMS preview modal)
  - **Pro App Builder · Web App Builder · Android App Builder (Feb 14, 2026 — 3-Tab Restructure + No-Code Experience)**:
    - **Tab 1 — Pro App Builder**: 8 BDapps telecom-native templates (Subscription Portal, USSD Companion, Content Dashboard, Analytics, OTP Service, Subscription Store, Premium Content, Admin Panel) with "⚡ Robi Powered" badge + API chips.
    - **Tab 2 — Web App Builder**: 8 universal templates (E-Commerce, Restaurant/Food, Health Clinic, Education, Real Estate, Travel, NGO, SaaS).
    - **Tab 3 — Android App Builder**: 8 universal templates (Shopping, Food Delivery, Doctor, eLearning, Fitness, Travel, News, Ride Sharing).
    - **Lucrative template cards**: 180px CSS-rendered mini-mockup (browser frame for web, phone frame for android), star rating, "X apps built", "Ready in ~X min" time-to-build badge, 3 feature bullets, Live Preview + Use Template buttons, hover shine sweep + lift animation.
    - **Live Preview modal (90vw × 85vh)**: Interactive React mini-apps — E-Commerce has 6-page flow (register → home → product → cart → checkout → payment overlay → confirmation), Food has 3-page order-tracking, Health has OTP-based booking, Education has lesson player. Android variants show 3 phone screens with auto-advancing splash and inter-screen interactions.
    - **4-step creation flow** with sticky progress bar: Template → Design Style → Customize → Preview & Launch.
    - **Step 3 (Customize)** — no color pickers here; only Identity / Pages-to-include / Features toggles / Auth methods.
    - **Step 4 (Preview & Launch)** — split 65/35: real interactive preview on LEFT, **ConfigureSidebar** on RIGHT with accordion sections: Brand (3 color pickers + font), Layout (radius slider + dark mode + navbar), Payments (SSL Commerz with Proxy/Direct radio cards + Platform Fee + flow diagram, Robi Operator Billing with CaaS amount, Cash on Delivery), BDApps App Store (Android only) with category/short/long desc/age/auto-submit, Domain & Hosting (Web only) with subdomain + custom domain. ALL changes reflect in preview in real-time.
    - **Submit to BDApps Store** (Android): confirmation modal → adds Pending Approval entry to Admin Provisioning → Build Files via new `addBuildFile` AppContext action. Admin can then Approve/Reject.
    - **Post-generation celebration**: confetti animation, 5 action cards (Download ZIP / GitHub / Submit to BDApps Store [android] or Go Live Now [web] / Share / Analytics).
    - **What's Next** panel ties Digital into the full BDapps developer journey (Lite / Provisioning / App Store).
    - **First-visit welcome modal** — 3-step intro, dismissed and persisted in localStorage.
  - **Add-Ons page (`/add-ons`)**:
    - Hero with 3 animated counter stats (500% growth · BDT 2.8M revenue · 98% retention).
    - **Section A — Promote Your App**: Multi-channel Campaign Builder modal (5 steps: goal → channels → audience → budget → estimated results). 6 channel cards (Push Notifications, WhatsApp Business, Imo, Facebook/Instagram Ads, Google UAC, Google Search Ads) each with price, pitch, stats, features, Add to Plan. 3 bonus channels (SMS Marketing, Influencer Connect, Email Marketing).
    - **Section B — BDapps Analytics**: 4 count-up stat cards on scroll-into-view, live Recharts (line / pie / bar), 6 analytics feature cards (Revenue Intelligence · Subscriber Analytics · Message Delivery Intel · User Behavior · Campaign ROI · BI Reports), Free Trial modal.
  - **Web App Builder (Feb 12, 2026 — BDapps Ecosystem Overhaul)**: 8 BDapps-native templates (SMS Alert Subscription Portal, USSD Service Companion, Content Subscription Dashboard, Developer Analytics Portal with real recharts, OTP Verification Landing, Mobile Subscription Store, Charged Content Platform, Service Provider Admin Panel). Each card now renders a CSS browser-frame mini-mockup, category badge + per-API badges (SMS / Subscription / USSD / OTP / CaaS / Reporting / All APIs), 3 feature bullets, "Live Preview" (eye) + "Use Template" buttons.
  - **Android App Builder (Feb 12, 2026 — BDapps Ecosystem Overhaul)**: 8 BDapps-native templates (SMS Alert App, Daily Content, USSD Wallet Companion, OTP Auth, Subscription Store, Premium Content, Sports & Scores, Islamic Companion). Each card renders a CSS phone-frame mini-mockup.
  - **Live Preview Modal (NEW)**: 90vw × 85vh modal showing a fully interactive React preview of the chosen template — not a static mockup. Web previews simulate the actual app (OTP subscribe flow, USSD menu tree, content feed with category filter + expandable cards, recharts charts, app store browse+subscribe+detail sections, premium unlock w/ CaaS confirmation, admin broadcast composer + keyword manager). Android previews render 3 phone screens side-by-side: splash auto-advances after 2s, second screen has multiple clickable interactions, third shows detail/action result. User's App Name, tagline, primary color and language (English/Bengali) flow through every screen.
  - **BDapps Connection fields (NEW)** in customization step:
    - Web: BDapps Shortcode (16222/16333/16444), Connected BDapps App dropdown (auto-fills name from existing Lite/Pro apps), OTP Login toggle, Subscriber-only Content toggle.
    - Android: SMS Shortcode, Subscribe Keyword (auto-derived from slug; updates when Connected App picked), Push Notification via SMS toggle, Connected BDapps App dropdown.
  - **What's Next checklist (NEW)** rendered on every generated app: 5 steps — Web/Android app generated ✓ + clickable links to /lite, /provisioning, /app-store completing the full BDapps developer journey.
  - Action buttons (Share Preview / Download Code / Push to GitHub / Deploy to Web for web, Submit to Play Store gated by Pro upgrade modal for android) — all mocked with progress modals/toasts.
  - Star rating per template (1–5) persists in localStorage, aggregates with mock base rating.
  - "Use This Template" pre-fills the respective creation flow (Lite/Pro).

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
