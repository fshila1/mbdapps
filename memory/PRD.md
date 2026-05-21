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

## What's Been Implemented (Feb 6 — initial; Feb 10 — fixes; Feb 11 — Web/Android Builders; Feb 14 — Lucrative No-Code overhaul; Feb 17 — Content & Data Management; Feb 18, 2026 — Sidebar collapse + App Store redesign + Two Showpiece Apps + Admin Approval Flow; Feb 19, 2026 — Rich SVG visual overhaul + EduPath BD + Dashboard Quick View; Feb 21, 2026 — 4 New BDApps Demo Apps + BDApps API Simulation Layer)

### Iteration 10 — 4 New Demo Apps + BDApps API Simulation Layer (Feb 21, 2026)
**100% test pass per iteration_10.json.** Built BondoBD (Matrimony), QuizBD (Entertainment), NewsNow BD (News), FitBD (Fitness) as fully working interactive demos with footprint continuity across Template Gallery → Customize → My Apps → App Store → Working Demo. Every OTP, SMS, Subscription and CaaS call routes through a centralized simulation layer and surfaces in a floating "API Monitor" panel.

**Part 1 — BDApps API Simulation Layer (`/src/services/BDAppsAPI.js`):**
- Centralised service mirroring real Robi BDApps swagger API
- Endpoints: `requestOTP`, `verifyOTP`, `userSubscription`, `getSubscriberStatus`, `getBaseSize`, `notifySubscribers`, `sendSMS`, `queryBalance`, `directDebit`, `getTransactionLogs`
- Realistic 500-1500ms latency simulation, in-memory state for subscribers/OTP store/SMS logs/transactions
- Status codes match real spec (S1000 success, E1850 invalid OTP, E1851 expired OTP, E1854 not found, E4012 insufficient balance)
- Pub/sub `subscribeMonitor` for the API Monitor component to listen to all API activity in real time
- `_demo_otp` field exposed in OTP response strictly for demo auto-fill (clearly marked)

**Part 2 — Floating API Monitor (`/src/components/APIMonitor.jsx`):**
- 56px circular toggle bottom-right (z-80), shows badge count + pulses green on new activity
- Click opens 360×480 dark panel (z-81) with: filter chips (All/OTP/SMS/Subscription/CaaS), demo-mode banner, real-time log list, expandable Request/Response JSON per entry showing exact swagger schemas with applicationId, statusCode, elapsedMs
- Auto-attached to all 4 new demo app pages

**Part 3 — BondoBD (`/apps/bondobd`) — Matrimony Service:**
- Rose-pink gradient landing "Find Your Life Partner" with live member count from `getBaseSize()`
- OTP flow: requestOTP → demo OTP inline link → verifyOTP + userSubscription + welcome sendSMS
- 6 realistic Bangladeshi profiles (Rahima/Sadia/Nusrat/Karim/Tanvir/Rafiq) with district/education/profession
- Profile detail with LOCKED contact section (Phone/WhatsApp/Email blurred)
- Subscribe modal → queryBalance → directDebit BDT 49 → confirmation sendSMS → contact unlocks
- Express interest → sendSMS to profile owner; My Account page with Unsubscribe → userSubscription UNSUB

**Part 4 — QuizBD (`/apps/quizbd`) — Knowledge Quiz:**
- Purple gradient landing with stats "1,84,000+ Subscribers"
- OTP subscription with welcome SMS broadcast
- 5 categories × 4 questions each (Bangladesh GK, Islam, Science, Sports, Entertainment) = 20 questions
- Active quiz with progress bar + 10:00 countdown timer, color-reveal feedback (green correct / red wrong) + auto-advance
- Results screen with score + points earned + result SMS via sendSMS
- Leaderboard with 7 players, "Rafiul Karim (YOU)" highlighted in purple at #3
- Prize Claim (when points ≥500): negative directDebit simulates BDT 5 credit

**Part 5 — NewsNow BD (`/apps/newsnow`) — Daily News:**
- Dark slate header with red breaking-news ticker (CSS marquee animation)
- 15 articles across Bangladesh / Technology / Business / Sports / International (3 each)
- Hero featured article + horizontal category sections
- Article detail with full body, bookmark toggle, share buttons
- SMS subscribe modal → OTP → userSubscription + welcome sendSMS
- "Broadcast News Alert" demo button → notifySubscribers shows sentCount > 184k in monitor

**Part 6 — FitBD (`/apps/fitbd`) — Fitness Tracker (Android Emulator):**
- Pixel-style phone frame (360×720), splash auto-advances to login (1.8s)
- Lime-emerald OTP login + welcome SMS
- Home dashboard with 4 stat circles (kcal/steps/water/active), Today's Workout card, Daily Health Tip
- 3 workout plans: Beginner (free), Intermediate HIIT (locked BDT 29), Advanced (locked BDT 49)
- Active workout: exercise icon + reps + 3-set tracker + rest timer countdown (45s/60s) + Next Set button → Workout Complete with sendSMS summary
- Nutrition log: 10 Bangladeshi foods (Khichuri/Rice/Dal/Chicken Curry/Fish Fry/Roti/Egg/Banana/Mango/Dahi) with search + add to Breakfast/Lunch/Dinner/Snacks + calorie progress bar
- Water tracker 8-glass tap-to-fill
- Premium unlock: queryBalance + directDebit + confirmation sendSMS → plan unlocks

**Part 7 — Footprint Continuity:**
- 3 new Pro Builder templates (BondoBD/QuizBD/NewsNow)
- 2 new Web Builder templates (BondoBD/NewsNow)
- 4 new Android Builder templates (BondoBD/QuizBD/NewsNow/FitBD)
- 4 new App Store entries (AS-BONDOBD/QUIZBD/NEWSNOW/FITBDPRO) with detail-page CTAs routing to working demos
- 4 new My Apps entries (3 Live + 1 Pending Review) with subscriber counts + revenue, Open App buttons routing to demos

**Files added:**
- `/src/services/BDAppsAPI.js`
- `/src/components/APIMonitor.jsx`
- `/src/pages/apps/BondoBD.jsx`
- `/src/pages/apps/QuizBD.jsx`
- `/src/pages/apps/NewsNow.jsx`
- `/src/pages/apps/FitBD.jsx`

**Files patched:**
- `/src/App.js` (8 new routes: bondobd + android, quizbd, newsnow + bd alias, fitbd + web alias)
- `/src/mocks/data.js` (4 new seedAppStore entries with proper iconGradient + slug + CTA-routing fields; CATEGORIES extended)
- `/src/mocks/builderTemplates.js` (3 Pro + 2 Web + 4 Android new templates)
- `/src/context/AppContext.jsx` (seedMyApps adds 4 new apps with subscriber counts + revenue; localStorage migrated to v4: bdapps_myapps_v4 + bdapps_store_v4)

**Testing:** iteration_10.json — 100% pass. No functional bugs. Carry-over: Cabinet Grotesk CORS font (cosmetic).



## What's Been Implemented (Feb 6 — initial; Feb 10 — fixes; Feb 11 — Web/Android Builders; Feb 14 — Lucrative No-Code overhaul; Feb 17 — Content & Data Management; Feb 18, 2026 — Sidebar collapse + App Store redesign + Two Showpiece Apps + Admin Approval Flow; Feb 19, 2026 — Rich SVG visual overhaul + EduPath BD + Dashboard Quick View)

### Iteration 9 — Rich SVG Visual Overhaul + EduPath BD demo + Dashboard Quick View (Feb 19, 2026)
11-part visual & UX refinement sprint (98% test pass per iteration_9.json):

**Part 1 — TRUE Full-Bleed App Store Cards:**
- Icon container: `aspect-square w-full overflow-hidden rounded-t-2xl` with zero internal padding
- Rich SVG `<AppArt>` component renders absolute inset-0 inside the container (no emoji + flat color block)
- WEB / ANDROID / SMS corner badges positioned absolutely

**Part 2 — Rich SVG Illustration Library (`/components/illustrations/AppArt.jsx`):**
- 16 layered scene illustrations (ecom shopping bag with sale tag + coins, food biriyani plate with steam, edu graduation cap + student head + book stack, health pulse heart + doctor + pill, fitness dumbbell + runner, weather sun+cloud+rain+thermometer, islamic mosque silhouette + crescent moon, cricket field + batsman + ball + trajectory, finance candle chart + coin stack, travel mountains + plane + map pin, music vinyl + notes, news folded newspaper, realestate house + for-sale sign + tree, ngo heart + people circle, saas dashboard with bars + line chart)
- Each art is a hand-crafted SVG scene with characters, depth, lighting, no emojis

**Part 3 — 3-Slide Hero Carousel with Rich Scenes (`/components/illustrations/HeroArt.jsx`):**
- HeroDeveloperScene: dev person with glasses + smile at laptop with rainbow code, phone with app grid, coffee mug with "B" logo, floating stat badges (+248 sales / ★4.9 / ৳1.2M)
- HeroSubscribersScene: stylised globe of Bangladesh with user pins, signal arcs, live subscriber counter card "10,482,914"
- HeroBuilderScene: rocket launching into starfield, planet with ring, floating code blocks, clouds

**Part 4 — 12 App Store Apps (3 Web / 3 Android / 6 SMS) with artId field:**
RobiMart BD, EduPath BD, Medilife Clinic (web) · DeshiFood, FitBD, BPL Live (android) · Weather Alert BD, Daily Hadith, Daily Health Tips, Prayer Time Alert, Stock Market Brief, News Bangla 24x7 (SMS)

**Part 5 — EduPath BD (NEW 3rd fully working demo app at `/apps/edupath-bd`):**
- Home: gradient hero, Continue Learning (3 enrolled courses), Recommended (top 3)
- Catalog: 6 courses (SSC Math, SSC Physics, HSC Chem, HSC Bio, English, ICT) with FREE/ENROLLED badges
- Course detail: gradient hero, instructor info, 12-lesson curriculum (first 4 marked done)
- Lesson player: video timeline auto-advances, "Take the Quiz" → 3-question quiz with correct/incorrect feedback → +50 XP completion screen
- Leaderboard: top-3 podium (gold/silver/bronze) + rest of table with "You" (Demo Student) highlighted in indigo
- 12-day streak + 8,940 points header chips

**Part 6 — App Detail Page Visual Refresh:**
- Hero icon uses AppArt SVG instead of emoji
- Screenshots (5) inside phone-frame (android), browser-chrome (web), or naked SVG (lite) with overlay caption

**Part 7 — My Apps seeded with exactly 6 apps:**
- 3 Web: RobiMart BD (Live), Medilife Clinic (Live), EduPath BD (Live - now)
- 3 Android: DeshiFood (Live), FitBD (Live), ShopLocal BD (Pending Review with amber banner)

**Part 8 — Developer Dashboard Quick View:**
- Welcome message with live counts ("You have N live apps, M pending review, X transactions")
- 4 Quick Stats cards with colored accent ring + icon (data-testid stat-live-apps / stat-pending-review / stat-subscribers / stat-revenue)
- "My Apps" Quick View section with 6 inline app cards (icon + name + type + status + stat) linking directly to /my-apps/:id/content
- Reordered Modules grid: Digital Builder + My Apps first (the build flow), then telecom modules

**Part 9 — localStorage migration (v2 → v3):**
- `bdapps_store_v3` for store apps (forces seed refresh due to new artId field)
- `bdapps_myapps_v3` with migration that auto-injects EduPath if user had old v2 data

**Part 10 — "Complete Your BDApps Setup" removal verified:**
- Globally absent from /dashboard, /digital, /add-ons, /provisioning, /lite, /reports and all /admin/* routes
- Post-generation flow uses LevelUp panel (6 Add-Ons + App Journey checklist) only

**Part 11 — Sidebar collapse persistence:**
- `useSidebarCollapsed` hook reads/writes `bdapps_sidebar_collapsed` localStorage
- Verified across full reload via testing agent

**Files added:**
- `/src/components/illustrations/AppArt.jsx` (SVG component library)
- `/src/components/illustrations/HeroArt.jsx` (3 hero scenes)
- `/src/pages/apps/EduPath.jsx` (fully interactive education demo app)

**Files patched:**
- `/src/pages/AppStore.jsx` (full-bleed AppCard with AppArt, new hero rendering, 6-col grid, AppArt in detail hero + screenshots)
- `/src/pages/DeveloperDashboard.jsx` (Quick Stats + My Apps Quick View; reordered modules)
- `/src/mocks/data.js` (12 store apps with artId; 3 hero slides with scene field)
- `/src/context/AppContext.jsx` (v3 localStorage migration; EduPath status flipped to Live)
- `/src/App.js` (new /apps/edupath-bd + /apps/shoplocal-bd routes)

**Testing:** iteration_9.json — ~98% pass. No functional bugs. Carry-over: Cabinet Grotesk CORS font fallback (cosmetic).



### Iteration 8 — Sidebar collapse + App Store redesign + Showpiece Apps + Admin Approval (Feb 18, 2026)
Massive 10-part overhaul (~92% test pass rate via iteration_8.json):

**Part 1 — Collapsible Sidebar:**
- 256px ↔ 64px collapse toggle (arrow icon, right edge), smooth transition
- Collapsed shows icons only with hover tooltips (title attribute)
- State persists in localStorage (`bdapps_sidebar_collapsed`)
- Mobile drawer behavior unchanged

**Part 2 — App Store Complete Redesign:**
- `bdapps` orange-to-red gradient wordmark logo (matching real site)
- New header: "Create Your Own App" red CTA + "Sign In" red outlined button
- 3-slide auto-rotating hero (5s interval): Slide 1 has split layout (white-text left + purple-illustration right with phone mockup + bold purple "Largest Apps DEVELOPER community in Bangladesh" banner overlay + red right edge accent); prev/next arrows + dot indicators
- All Apps / Newly Added / Top Rated / Most Used / Category nav tabs
- 8 seeded apps with unique iconGradient backgrounds + WEB/ANDROID corner badges

**Part 3 — App Detail Page Redesign:**
- Dynamic CTA based on app.type: Subscribe (red) / Download (green) / Visit Site (blue)
- Google Play-style 96px gradient app icon
- 5-screenshot carousel with type-specific frames: phone frame (notch + status bar + home indicator) for android, browser chrome (URL bar + 3 dots) for web

**Part 4 — Admin Approval Flow:**
- New "Web Apps" tab in Admin Provisioning
- Filter dropdown (All / Web / Android)
- Approve (✓) and Reject (✗) buttons; rejection requires reason in modal
- State machine: Pending Review → Approve → Live | Pending Review → Reject (with reason) → Rejected → Resubmit → Pending Review
- Developer notification bell with unread badge (`appNotifs` in context)

**Part 5 — My Apps with 4 Pre-Populated Examples:**
- RobiMart BD (Web E-Com, Live, 248 orders / ৳185k / 189 customers)
- Medilife Clinic (Web Health, Pending Review, 4 doctors)
- DeshiFood (Android Food, Live, 8,400 downloads / ⭐ 4.7 / 284 reviews)
- FitBD (Android Fitness, Pending Review)
- Filter tabs (All / Active / Pending / Rejected) with counts
- Sort dropdown (Newest / Oldest / Name)
- Status-aware action buttons (Live → Dashboard/Settings/View Live; Pending → Preview/View Submission; Rejected → red banner + Resubmit)

**Part 6 — Two Fully Working Showpiece Apps:**
- `/apps/robimart-bd` — Full e-commerce web app: 7 pages (Home with carousel/categories/Flash Deals countdown/Featured grid, Catalog with filters, Product Detail with image gallery/variants/qty/Add to Cart/Buy Now, Cart with coupon EIDSPECIAL=10% off, 3-step Checkout with 5 payment methods including bKash/Nagad/Card/Robi Balance/COD, Payment Processing overlay simulating BDApps Proxy → SSL Commerz → bKash, Confirmation with animated ✓ + order ID, My Account)
- `/apps/deshifood` — Android emulator with Pixel-style phone frame: 5 screens (Login → OTP → Home with 6 restaurants/categories/Flash Deals, Restaurant Menu with availability + cart, Cart with promo FIRSTORDER=BDT 50 off + payment selection, Order Tracking 4-stage auto-advance every 3s with animated 🛵 emoji on CSS map)

**Part 7 — Step 4 content → Generated app:**
(Content flows verified — RobiMart uses inline product data mirroring Step 4 schema)

**Part 8 — Post-Generation Success Screen:**
- Removed "Complete Your BDApps Setup"
- "Submitted for Review" amber banner (📋 + 24-48hr note + "While you wait" checklist)
- New "Level Up Your App" with 6 add-on cards (Analytics/Push/WhatsApp/FB+Google Ads/SMS/Influencer Connect)
- "Your App Journey" 6-step checklist showing where the user is in the lifecycle
- "See all Add-Ons →" link to /add-ons

**Part 9 — App Store ↔ Showpiece Apps:**
- "Visit Site" on RobiMart card → /apps/robimart-bd
- "Download" on DeshiFood card → /apps/deshifood

**Part 10 — Visual Quality:**
- 10 unique gradient app icons (sky/emerald/green/teal/slate/orange-red/red-rose/etc.)
- Phone frame (dark border + notch + home indicator) + browser chrome (3 dots + URL bar) wrappers for screenshots
- Hover lift + shadow on app cards (-translate-y-1)

**Files added:** `pages/apps/RobiMart.jsx`, `pages/apps/DeshiFood.jsx`, `components/digital/LevelUp.jsx`

**Files rewritten:** `components/Sidebar.jsx`, `pages/MyApps.jsx`, `components/digital/WhatsNext.jsx`

**Files patched:** `context/AppContext.jsx` (4 seeded apps, approval state machine, notifications), `mocks/data.js` (8-app seedAppStore + HERO_SLIDES), `components/Layout.jsx` (notif bell with unread badge), `pages/AppStore.jsx` (header + hero + AppCard + dynamic CTA + screenshot frames), `pages/admin/AdminProvisioning.jsx` (WebAppApproval component), `components/digital/AppBuilder.jsx` (Submitted for Review banner), `App.js` (4 new routes for showpiece apps)

**Testing:** iteration_8.json (~92% pass). Action items addressed: added `notification-badge` testid, renamed AppStore card testid to `appstore-card-{id}`. Carry-over: Cabinet Grotesk font CORS issue (cosmetic).



### Iteration 7 — Content & Data Management Layer (Feb 17, 2026)
Massive sprint adding TWO new content layers to the Digital Builder:

**Pre-Launch Content Manager (Step 4):**
- Updated Digital Builder flow from 4 → 5 steps (Template → Design → Customize → **Add Your Content** → Preview & Launch)
- New `ContentManager.jsx` with left sidebar (section nav + completion dots ✓/⚠/○), middle form area, right mini preview
- Per-template section editors: Banners, Categories, Products (E-Com), Menu Items (Restaurant), Doctors (Health), Courses (Education), Properties (Real Estate), Tour Packages (Travel), Campaigns (NGO), Pricing Plans (SaaS), Instructors, Agents, Destinations, Team, Testimonials, Areas, Services, Store Info
- Shared `ImageDropzone` (base64 FileReader, max 5MB, JPG/PNG/WebP) with Replace/Remove overlay
- "Skip — Use Sample Data" populates realistic Bangladeshi mock content (RobiMart BD, Deshi Spice Kitchen, Medilife Clinic, BD Learning Hub, etc.)
- Minimum-content validation modal with "Continue Anyway" / "Go Back & Add Content"
- BDApps Cloud Storage info banner with progress meter at top of Step 4
- Pro template flows correctly skip Content step (telecom templates don't need it)
- Generated apps automatically pushed to `myApps` array via `addMyApp(content)`

**Post-Launch CMS Dashboard:**
- New "My Apps" link in Developer sidebar between Digital and Add-Ons
- `/my-apps` page with 3 seeded apps (RobiMart BD · E-Commerce · Live · 248 orders / Deshi Spice Kitchen · Android Restaurant · Live · 1,284 orders / Medilife Clinic · Web Health · In Review · 94 appointments)
- Each app card: status badge (Live/In Review/Draft/Featured), 3 stats, action buttons (Manage Content / Dashboard / Settings / View Live)
- `/my-apps/:appId/content/*` nested routes with `CmsLayout`:
  - Sticky topbar: back to My Apps, app name+kind, status badge, **🟢 Changes live · X ago** sync indicator (toggles to "Saving changes..." during saves), View Live Site button
  - Per-kind sidebar nav (CMS_NAV_BY_KIND): different sections for E-Commerce / Restaurant / Health / Education / Real Estate / Travel / NGO / SaaS
  - **Storage Meter** (compact) at sidebar bottom, "Manage on the go" Play Store promo card
- Sections built:
  - **Overview**: 4 stat cards (per-kind labels), Recent Activity feed with timestamps, Quick Actions grid
  - **Products / Menu Items**: filter tabs (All/Active/Draft/Out of Stock/On Sale), search, Add/Edit slide-in panel, Stock Alerts, CSV Import/Export toasts, restaurant items have Availability toggle (Sold Out indicator)
  - **Banners**: card list with image thumbnails, ▲▼ reorder buttons, CTR/Views/Clicks analytics per banner, slide-in editor
  - **Orders**: filter tabs (All/New/Processing/Shipped/Delivered/Cancelled), analytics strip (today/week/avg/pending), order detail panel with customer info + items + 4-step status timeline + Update Status / Print Invoice / Contact Customer (SMS via BDApps compose) / Issue Refund
  - **Appointments** (Health): Calendar view + List view toggle, calendar with appointment count badges per day, list table with Confirm/Complete/Remind/Cancel actions, Doctor Schedule Manager (weekly availability grid), Add Appointment panel with doctor/date/time-slot picker
  - **Doctors**: card grid with photo/specialty/days, edit panel with day multi-checkbox + time pickers + slot duration dropdown
  - **Reviews**: avg rating + 5-star breakdown bars, filter tabs (All/5★/4★/3★/2★/1★/Pending/Flagged), Approve/Reply/Flag/Delete per review, reply composer
  - **Customers / Patients**: searchable table, profile slide-in with SMS via BDApps compose, Export CSV
  - **Pages**: page tabs (About/Contact/Privacy/Terms/FAQ + Add Custom), block-based editor (text/image/divider), Contact special config (email/phone/address/map URL/show form), Save & Publish
  - **Media Library**: drag-and-drop upload (base64), folder tabs, search, copy URL/rename/delete, storage meter that grows with uploads
  - **Settings** (5 sub-tabs): Store Info, Notifications (email/SMS/WhatsApp toggles + low-stock threshold + appointment SMS confirms), Domain & SEO (custom domain + DNS verify toast + SEO title/desc/keywords + Favicon/OG image upload), Integrations (SSL Commerz/Robi Billing/GA/FB Pixel/WhatsApp/Push status cards with Connect/Disconnect/Upgrade-to-Add-On buttons), Danger Zone (Unpublish/Export All Data/Delete App — typing exact app name to confirm)
  - **Reports**: date range picker, 4 stat cards, Recharts bar chart of weekly revenue, performance tables per app kind (Product/Doctor/Course), CSV/PDF export toasts
- Generic Section component handles Courses/Properties/Packages/Campaigns/Pricing/Instructors/Agents/Destinations/Team via SCHEMAS map
- All saves go through `triggerSave()` → 600ms loading state → toast "✓ Changes live on your site"
- All saves push to `cmsActivity` feed which updates Overview's Recent Activity in real-time

**Context API extensions:**
- `myApps`, `addMyApp`, `updateMyApp`, `removeMyApp` (localStorage `bdapps_myapps`)
- `appContent[appId]`, `updateAppContent(appId, section, items)`, `replaceAppContent` (localStorage `bdapps_appcontent`)
- `cmsCollections` (orders/appointments/reviews/customers/activity keyed by appId, localStorage `bdapps_cms`)
- `mediaLibrary`, `addMediaFile`, `removeMediaFile`, `renameMediaFile`, `computeStorageBytes` (localStorage `bdapps_media`)
- `updateOrderStatus`, `updateAppointmentStatus`, `addAppointment`, `replyReview`, `removeReview`, `approveReview`, `addCmsActivity`

**Files added:**
- `/src/mocks/contentSeeds.js` (SAMPLE_CONTENT, sampleOrders, sampleAppointments, sampleReviews, sampleCustomers, sampleActivity, TEMPLATE_KIND, getKindFor)
- `/src/components/cms/{ImageDropzone,SyncIndicator,StorageMeter,navConfig}.{jsx,js}`
- `/src/components/digital/ContentManager.jsx`
- `/src/pages/MyApps.jsx`
- `/src/pages/cms/{CmsLayout,Overview,Products,Banners,Orders,Doctors,Appointments,Reviews,Customers,Pages,MediaLibrary,Settings,Reports,GenericSection,_shared}.jsx`

**Testing:** Iteration 7 testing report at `/app/test_reports/iteration_7.json` — 85% pass rate. Added data-testid="sync-indicator", "banner-move-up-{id}/banner-move-down-{id}", "skip-sample-data" per testing-agent feedback.



### Iteration 6 — Lucrative No-Code Builder finalisation (Feb 14, 2026)
- **Fixed compile blocker** in `UniversalAndroidPreview.jsx`: extracted hook-using inline `render`/`content` arrow functions (Payment / OTP / Lesson / Workout / Fare screens) into capitalised React components (PaymentScreen, OtpScreen, LessonScreen, WorkoutScreen, FareScreen) so `react-hooks/rules-of-hooks` no longer flags them.
- **Fixed action-deploy crash**: introduced a shared `copyLink(url, label)` helper in `AppBuilder.jsx` that wraps `navigator.clipboard.writeText` in try/await/catch and falls back to a `Preview link: <url>` sonner toast — eliminates the `NotAllowedError` red overlay in CRA dev mode. Both `action-deploy` and `action-share` use it.
- **Fixed buildFiles persistence**: `AppContext.jsx` now initialises `buildFiles` via `safeParse('bdapps_buildfiles', seedBuildFiles)` and has a `useEffect` that mirrors changes back to `localStorage`. Submitted entries survive full reload and developer→admin handover.
- **Fixed Admin Build Files schema mismatch**: `addBuildFile` now writes `appId / appName / creator / version / date / remarks / status` so the admin table renders every cell correctly (previously fields were empty).
- **ConfigureSidebar default-open**: `cfg-section-pay` and `cfg-section-domain` are now expanded by default for all relevant templates so the critical inputs (`cfg-pay-ssl`, `cfg-subdomain`, `cfg-custom-domain`) are immediately visible.

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
