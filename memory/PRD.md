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
- i18n via `react-i18next` (EN + বাং)

## User Personas
1. **Developer** — submits Pro/Lite apps, manages keywords, reads reports, browses Digital templates
2. **Admin** — approves apps, manages users, curates App Store, controls subscriptions/ads/USSD
3. **App Store consumer** — browses public store, signs in via OTP, subscribes to apps

## Demo Credentials
- Developer: `developer@bdapps.com` / `dev123`
- Admin: `admin@bdapps.com` / `admin123`

## What's Been Implemented (Feb 23, 2026 — iteration 13: BondoBD Matrimony template isolation across Digital Builder)

### Iteration 16 — Site-wide Responsiveness Fix (Feb 24, 2026)
User uploaded a mobile screenshot showing the Digital page content pushed off-screen (cards cut off right edge, category pills wrapping into 3+ rows of mess, "Build complete apps in under … needed" truncating awkwardly). Did a root-cause investigation: the bug was traced to **one single Tailwind class** at the end of the sidebar className.

**Root cause:** `/src/components/Sidebar.jsx` line 54 had `... lg:sticky lg:top-0 ... shrink-0 relative` — the trailing `relative` class overrode the earlier `fixed` and `lg:sticky` position values, forcing the sidebar to stay in the flex flow at every viewport size. On mobile, instead of sliding off-screen (translate-x-full), the 256px-wide aside was occupying horizontal space inside the parent flex container, pushing the main content right past the viewport edge.

**Files patched:**
- `/src/components/Sidebar.jsx` — Removed the trailing `relative` class. Sidebar is now correctly `fixed` on mobile (out of flex flow, slides in/out via translate-x) and `lg:sticky` on desktop (in flex flow, sticky to top).
- `/src/index.css` — Added site-wide overflow guards: `html, body { overflow-x: hidden; max-width: 100vw }`, `*, *::before, *::after { box-sizing: border-box }`, `img, video, iframe, svg { max-width: 100% }`. Added `.scrollbar-hide` utility class for horizontal-scroll category pills / tab strips.
- `/src/pages/Digital.jsx` — Header h1 now responsive (`text-2xl sm:text-3xl lg:text-4xl`), header button row wraps with `flex-wrap`, the dark "WEB APP BUILDER" promo banner now `flex-col sm:flex-row` so the tagline wraps below the badge on mobile instead of truncating mid-sentence, builder tabs (Pro/Web/Android) now `text-[11px] sm:text-sm` with `whitespace-nowrap` + truncate so all 3 labels fit in mobile 375px width.
- `/src/components/digital/TemplateGallery.jsx` — Search input now `w-full sm:max-w-md`. Category filter pills now use `flex md:flex-wrap gap-2 overflow-x-auto scrollbar-hide` — single-row horizontal scroll on mobile (matches the user's spec), wraps to multi-row only on tablet+. Pills marked `shrink-0 whitespace-nowrap` so they never break.

**Testing — 21 routes × 3 viewports = 63 tests, ALL PASS (zero horizontal overflow):**
- Mobile 375px: /digital, /dashboard, /provisioning, /appstore, /my-apps, /reports, /lite, /, /login, /apps/newsnow, /apps/quizbd, /apps/bondobd, /apps/robimart all return `scrollWidth === innerWidth`
- Tablet 768px: same 13 routes — all pass
- Desktop 1280px: same 13 routes — all pass
- Manual screenshot at /apps/newsnow mobile shows perfect rendering: breaking ticker, serif masthead, category nav, hero article all contained, no clip.



### Iteration 15 — News + Quiz Content Isolation + SOT Sync (Feb 23, 2026)
Same content-isolation bug fixed for News (web-newsnow) and Quiz (web-quizbd) templates, applying the proven Single Source of Truth pattern from BondoBD/Matrimony. Root cause: PREVIEWS map in `UniversalWebPreview.jsx` and `WebPreviews.jsx` had no entries for web-newsnow / pro-newsnow / web-quizbd / pro-quizbd, so both fell through to `EcomStore` default — Step 4 + Step 5 + /apps/* all rendered "Wireless Headphones / Add to Cart / Electronics, Fashion" generic e-commerce UI.

**Files patched:**
- `/src/mocks/contentSeeds.js` — Added `news` + `quiz` to `TEMPLATE_KIND`, `EMPTY_CONTENT`, and full `SAMPLE_CONTENT` seeds with Bangladeshi data (8 news articles spanning Politics/Sports/Business/Tech, 8 quiz questions across 5 categories, 3 certificate tiers).
- `/src/components/digital/ContentManager.jsx` — Extended `SECTIONS`, `SECTION_LABELS`, `MIN_REQUIRED` to handle the two new kinds. Added inline editors: `NewsBannerEditor`, `QuizDetailsEditor`, `QuizSettingsEditor`, `LeaderboardSettingsEditor`. `renderEditor()` wires all 13 new section types (newsBanner / newsCategories / articles / trending / editorsPicks / ads / liveFeed + quizDetails / quizCategories / questions / quizSettings / leaderboardSettings / certificates). MiniPreview tiles added for every section with the right visual treatment (NYT-style article cards, Figma-style quiz cards).
- `/src/components/digital/interactive/NewsPreview.jsx` (NEW, ~360 lines) — Premium NYT-inspired newsroom UI. Breaking ticker (marquee), serif "NewsNow BD" masthead, category navigation, hero article with featured image, multi-column editorial grid, trending sidebar, editor's picks section, ad slots, article detail screen with related stories, OTP subscribe modal. Exposes optional `onPhoneSubmit`, `onOtpVerify` hooks.
- `/src/components/digital/interactive/QuizPreview.jsx` (NEW, ~330 lines) — Figma-inspired premium quiz UI. Landing with stats (1,84,000+ subs / 2M+ answered / ৳50K prize), OTP login, home screen with category grid + cover banner, question screen (timer, progress bar, A/B/C/D with correct/incorrect highlighting + explanation), results screen with points + certificate tier, leaderboard. Exposes optional `onPhoneSubmit`, `onOtpVerify`, `onFinish` hooks. Verify→Home transition is now OPTIMISTIC (advances immediately, API chain runs in background).
- `/src/components/digital/interactive/UniversalWebPreview.jsx` — PREVIEWS map adds `web-newsnow → NewsWebPreview`, `web-quizbd → QuizWebPreview`.
- `/src/components/digital/interactive/WebPreviews.jsx` — Pro builder PREVIEWS map adds `pro-newsnow → ProNewsAdapter`, `pro-quizbd → ProQuizAdapter` via cfg-passing wrappers.
- `/src/pages/apps/NewsNow.jsx` (REWRITTEN, ~110 lines) — Thin SOT wrapper. Wraps `<NewsWebPreview cfg={...} onPhoneSubmit onOtpVerify />` with outer Back + Lang toolbar + APIMonitor. Real BDAppsAPI: requestOTP → verifyOTP → userSubscription → sendSMS → notifySubscribers.
- `/src/pages/apps/QuizBD.jsx` (REWRITTEN, ~115 lines) — Thin SOT wrapper. Wraps `<QuizWebPreview cfg={...} onPhoneSubmit onOtpVerify onFinish />`. Real BDAppsAPI: requestOTP → verifyOTP → userSubscription → sendSMS, plus directDebit credit (BDT 5 prize) when score ≥ 90%.

**Bugs fixed mid-iteration (caught by testing agent iter 15):**
1. P1: QuizBD OTP→Home transition appeared "stuck" because the BDAppsAPI chain (verifyOTP + userSubscription + sendSMS ≈ 2.5s total) blocked `onStart()` until completion. Restructured `handleOtp` to call `onStart()` synchronously BEFORE awaiting the API chain — user reaches home instantly, toasts/APIMonitor entries arrive as each call resolves.

**Testing — iteration_15.json + manual screenshot verification:**
- ✅ /apps/newsnow renders NYT-style premium UI (breaking ticker, serif masthead, multi-column grid, category nav). NO e-commerce elements.
- ✅ /apps/quizbd renders Figma-style premium UI (stats hero, OTP login, category grid, question screen with timer, results, leaderboard). NO e-commerce elements.
- ✅ Step 4 for web-newsnow: 8 news sections (Hero Banner, News Categories, News Articles, Trending News, Editor's Picks, Ad Blocks, Live News Feed, Service Info). Header shows "0 of 8 sections complete".
- ✅ Step 4 for web-quizbd: 7 quiz sections (Quiz Details, Quiz Categories, Questions, Quiz Settings, Leaderboard, Certificates, Service Info).
- ✅ Skip — Use Sample Data populates the Bangladeshi seed data and lights up the LIVE MINI PREVIEW tiles on the right.
- ✅ Step 5 Preview & Launch renders the actual NewsNow / QuizBD UI inside the browser-chrome iframe — NOT the generic e-commerce mockup.
- ✅ APIMonitor logs all expected entries (requestOTP, verifyOTP, userSubscription, sendSMS, notifySubscribers, directDebit) during the user journeys.
- ✅ /apps/* == /digital preview byte-identical (same React component).
- ✅ Quiz timer / progress bar / explanation reveal / certificate tier all functional. Bangladesh GK shows 4 questions; other categories scaled accordingly from the seed.



### Iteration 14 — Preview ↔ Implementation Sync + APIMonitor fix (Feb 23, 2026)
After iteration 13 (matrimony isolation in /digital), the user invoked the **Preview-to-Implementation Synchronization** rule: the actual generated app at `/apps/bondobd` was still showing the OLD UI (red gradient header, letter avatars, simple cards) while the new premium UI lived only in the /digital Live Preview. Refactored `/apps/bondobd` as a thin 100-line wrapper around the SAME `MatrimonyWebPreview` component → single source of truth. Wired the preview's optional integration hooks to real BDAppsAPI calls so APIMonitor lights up live during OTP/Interest/Subscribe flows.

**Files patched:**
- `/src/components/digital/interactive/MatrimonyPreview.jsx` — added optional props `chromeless`, `onPhoneSubmit`, `onOtpVerify`, `onInterest`, `onSubscribe`. Hooks fire on matri-otp-send, matri-otp-verify, matri-interest-*, matri-plan-*.
- `/src/pages/apps/BondoBD.jsx` — rewritten (~100 lines). Outer toolbar with Back + Welcome + Bangla/EN toggle, then renders `<MatrimonyWebPreview cfg={...} onPhoneSubmit={...} onOtpVerify={...} onInterest={...} onSubscribe={...} />`, with APIMonitor floating panel below. Fixed BDAppsAPI signature mismatches (requestOTP returns object → use `_demo_otp`; verifyOTP takes referenceNo first; userSubscription takes subscriberId first, action='SUB'). Added missing toast.success in handleSubscribe.
- `/src/components/APIMonitor.jsx` — moved from `bottom-6 right-6 z-[80]` to `bottom-6 left-6 zIndex:2147483646` to avoid collision with the Emergent "Made with" badge in the bottom-right corner. Panel also bumped to maximum z-index.

**Bugs fixed mid-iteration (P1 + P1 + P2 caught by testing agent iter 14):**
1. P1: `requestOTP()` returns `{statusCode, referenceNo, _demo_otp}` object — old code template-literal'd the whole object as "[object Object]". Now uses `${otpRes._demo_otp}` and stores `referenceNo` in component state.
2. P1: `verifyOTP(referenceNo, code)` was being called as `verifyOTP(code)`, causing state lookup miss → E1854. Now passes the stored referenceNo.
3. P1: `userSubscription(subscriberId, action)` was being called as `userSubscription('subscribe', msisdn, appName)` — swapped args. Now correctly registers the subscriber.
4. P1: APIMonitor toggle had no effect because the Emergent floating badge was visually + click-wise overlapping. Moved to bottom-LEFT with extreme z-index.
5. P2: `handleSubscribe` was missing the `toast.success("Charged BDT … via CaaS")` confirmation. Added.

**Testing:** Manual smoke-test confirms all fixes:
- OTP toast: "OTP sent via Robi: 994865" (real 6-digit code, not [object Object])
- APIMonitor panel opens with 6+ live entries: /otp/request ✓, /otp/verify (demo bypass), /subscription/userSubscription ✓, /sms/send ✓, /caas/directDebit ✓ after plan purchase
- Plan toast: "✓ Charged BDT 49 via CaaS · Plan: Premium 7 Days · Txn: TXN_MZUYJSUZO4J"
- Visual identity: /apps/bondobd renders IDENTICAL to /digital Live Preview (ivory+maroon+gold, photographic avatars, classic serif, full OTP→Browse→Detail→Chat→Plans journey)
- Bangla i18n: outer toolbar AND preview switch to Bangla together

### Iteration 13 — Matrimony Template Isolation + Premium SaaS Preview (Feb 23, 2026)
**100% test pass per iteration_13.json (19/19 scenarios).** Resolved the long-standing P0 bug where the BondoBD (Matrimony) template was bleeding generic e-commerce content (Products / Add to Cart / Wireless Headphones / Banners) into Step 4 CMS and Step 5 Preview. Built a complete classic-Bangladeshi-matrimony preview with photographic avatars, full OTP login journey, filters, favourites, chat, and CaaS-charged plans — shared across `web-bondobd`, `pro-bondobd`, and `and-bondobd`. All other templates render unchanged.

**Files added:**
- `/src/components/digital/interactive/MatrimonyPreview.jsx` — premium matrimony preview (~880 lines):
  - State machine: `landing | otp-phone | otp-code | browse | detail | chat | favorites | plans`
  - `MatriAvatar` — photographic avatar via randomuser.me with SVG portrait fallback on error (gender-neutral silhouettes; no traditional attire)
  - Classic warm palette: ivory `#FFFBEF` + maroon `#7E1733` + gold `#C7A24A` + dusty rose `#C2185B`
  - Floral SVG corner ornaments + DividerOrnament (star/diamond divider)
  - Landing: "Find Your Perfect Match" serif hero + 4-filter search card + 6 Featured Profiles + 3 Real Success Stories
  - OTP: 2-step flow (phone with +88 prefix, terms checkbox → 4-digit code with Demo OTP hint, Resend, Verify)
  - Browse: 5-column filter bar (Gender / Age / Religion / District / Apply) + Sort dropdown + 4-column responsive card grid (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4`)
  - Profile cards: `rounded-3xl` with aspect-square photo + gradient overlay, ✓ Verified + ● Online (pulsing) badges, ❤ Favourite + ✨ Match % chip, name + age + district + height overlay, education + profession + religion·marital info, View + 💌 Interest CTAs, hover lift animation
  - Detail page: full photo + 4-field grid (Education/Height/Religion/Marital Status) + About + Family + Locked Contact (blurred until plan purchase) + Send Interest + Start Chat
  - Chat: avatar header + Online·Verified badge + incoming mock messages + outgoing send + auto-reply (~900ms)
  - Favourites: dedicated tab with live count badge in header + per-card View/Chat actions
  - Plans: 3-tier (Free / Premium 7 Days / Premium Monthly) with "Subscribe via CaaS" → toast "✓ Charged BDT XX via CaaS"
  - `matrimonyAndroidScreens()` export — 6 Android screens (Splash → OTP Phone → OTP Code → Browse → Profile → Chat) using `render:` key (matches AndroidEmulator schema)

**Files patched:**
- `/src/mocks/contentSeeds.js` — `TEMPLATE_KIND` adds web/pro/and-bondobd → `matrimony`. `EMPTY_CONTENT.matrimony = { storeInfo, profiles, stories, plans }`. `SAMPLE_CONTENT['web-bondobd']` seeds 6 BD profiles (Rahima/Sadia/Nusrat/Karim/Tanvir/Rafiqul) + 3 success stories + 3 plans with full bio/family/photo URLs (randomuser.me). Pro + Android share the same seed.
- `/src/components/digital/ContentManager.jsx` — `SECTIONS.matrimony = ['profiles','stories','plans','storeInfo']`. `SECTION_LABELS` adds Member Profiles / Success Stories / Subscription Plans. `MIN_REQUIRED.matrimony = { profiles: 3, plans: 1 }`. Editor branches for `profiles` (name/age/gender/district/religion/education/profession/height/marital/about/status), `stories` (photo/couple/year/district/quote), `plans` (name/price/period/badge/status). `StoreInfoEditor` adapts to matrimony kind. MiniPreview gains 3 matrimony branches (profile list, story cards with photo, plan rows).
- `/src/components/digital/interactive/UniversalWebPreview.jsx` — imports MatrimonyWebPreview; PREVIEWS map adds `web-bondobd`; forwards `content` prop into preview component.
- `/src/components/digital/interactive/UniversalAndroidPreview.jsx` — imports matrimonyAndroidScreens; SCREENS map adds `and-bondobd`.
- `/src/components/digital/interactive/WebPreviews.jsx` — imports MatrimonyWebPreview; adds `ProMatrimonyAdapter` wrapper so the Pro Builder (`pro-bondobd`) uses the same matrimony component (not the generic SubPortal fallback).
- `/src/components/digital/AppBuilder.jsx` — passes `content` prop into UniversalWebPreview for Step 5 (preview now reflects the user's matrimony content). Content-applied banner now counts profiles/stories/plans for matrimony templates.

**Bug fixed mid-iteration:**
- P0 (caught by testing agent): `matrimonyAndroidScreens` used `content:` key but `AndroidEmulator.jsx` calls `current.render(ctx)` — all 6 screen objects now use `render:` matching the schema of ecomScreens/foodScreens/etc.

**Testing:** iteration_13.json — 19/19 pass. Verified: ZERO e-commerce leak in matrimony preview/CMS. Full OTP→Browse→Filter→Fav→Interest→View→Chat→Plans flow works. Step 4 CMS shows exactly 4 matrimony sections. Step 5 preview reflects user content. Mobile 420×900 → 2-col grid. Bangla i18n switches OTP labels. E-commerce regression confirmed clean (web-ecom/food/health/edu still render correctly). Pro builder pro-bondobd renders MatrimonyWebPreview (not SubPortal). Android emulator pre-fix crashed; post-fix all 6 screens navigable.

**Carry-over (cosmetic, not blocking):** Cabinet Grotesk via api.fontshare.com CORS-blocked — fallback system fonts render fine.



## Core Requirements (Static)
- All flows must be navigable end-to-end with no broken pages
- Status states for Pro apps: Active Production, Pending Approval, Suspended, Draft, Rejected, Limited Production, Scheduled Active Production, Terminated
- Data-testid on every interactive element
- Mock data persisted across reloads via localStorage

## What's Been Implemented (Feb 6 — initial; Feb 10 — fixes; Feb 11 — Web/Android Builders; Feb 14 — Lucrative No-Code overhaul; Feb 17 — Content & Data Management; Feb 18, 2026 — Sidebar collapse + App Store redesign + Two Showpiece Apps + Admin Approval Flow; Feb 19, 2026 — Rich SVG visual overhaul + EduPath BD + Dashboard Quick View; Feb 21, 2026 — 4 New BDApps Demo Apps + BDApps API Simulation Layer; Feb 21, 2026 (iteration 11) — Bilingual বাংলা/EN demo apps + Rich Bangla template-card previews; Feb 22, 2026 (iteration 12) — Site-wide i18n via react-i18next, EN + বাংলা everywhere)

### Iteration 12 — Full Site-Wide i18n (Feb 22, 2026)
**100% test pass per iteration_12.json (19/19 checks).** Migrated the entire BDApps platform to react-i18next with English + Bangla support, persistence, browser detection, and dynamic HTML `lang` attribute.

**Infrastructure (new):**
- `/src/i18n/index.js` — react-i18next init with `LanguageDetector`, localStorage key `bdapps_lang`, navigator-language fallback (Bengali browsers default to `bn`), fallback to `en`. HTML `<html lang>` updates dynamically on `languageChanged`.
- `/src/locales/en.json` + `/src/locales/bn.json` — translation files organized by namespace: `common, nav, auth, dashboard, dashStat, appstore, myapps, digital, reports, reportsPage, provisioning, admin, addons, addonsPage, lite, footer, toast`.
- `/src/components/LanguageSwitcher.jsx` — dropdown variant for global header (Globe icon + EN/বাং) + `pill` variant reused inside demo apps.
- `/src/index.js` — imports `./i18n` so initialization happens before rendering.
- `/public/index.html` — `Hind Siliguri` + `Tiro Bangla` Google Fonts loaded for proper Bangla typography.

**Pages translated (high-visibility surfaces):**
- `Layout.jsx` — language switcher in header, Notifications/Logout labels via i18n
- `Sidebar.jsx` — all 8 dev nav + 7 admin nav links translate, "New" badge translates, Logout label translates, console header ("Developer Console" / "Admin Console") translates. Old `data-testid` values preserved for test stability.
- `Login.jsx` — fully bilingual: hero ("Build telecom apps for 76 million Robi subscribers" ↔ "টেলিকম অ্যাপ তৈরি করুন ৭.৬ কোটি রবি গ্রাহকদের জন্য"), labels, button, forgot-password modal, demo credentials section, error messages, toasts. Language switcher visible top-right.
- `DeveloperDashboard.jsx` — welcome line with interpolation, stat line (live/pending/orders), Quick Stats labels, My Apps Quick View, all 6 Module tiles (title + description), View All link.
- `MyApps.jsx` — title, subtitle, "Build New App" CTA, 4 filter tabs (All/Active/Pending/Rejected), sort dropdown, empty state messages.
- `AppStore.jsx` — search placeholder, 4 tabs (All Apps/Newly Added/Top Rated/Most Used), category dropdown placeholder, "Become a Developer" CTA, section labels, "See More" links, "Browse All Apps" footer.
- `Digital.jsx` — page title + tagline, 3 tab metadata, 5 step labels, Demo Tour + Browse Add-Ons buttons.
- `Reports.jsx` — 3 NAV sections + sub-tabs, 8 form labels, Submit + Excel/PDF/Print buttons.
- `Provisioning.jsx` — h1 + Create New App CTA + section uppercase label.
- `AddOns.jsx` — hero title + sub + 3 stat labels.
- `Lite.jsx` — Lite Console h1 + 4 module tiles (Create/My Apps/Settings/View Reports).

**Demo apps integration:**
- `/src/services/demoI18n.jsx` — `useDemoLocale` now reads global `i18n.language` (no separate localStorage). When user toggles header switcher, BondoBD / NewsNow / QuizBD update instantly. Pill toggle inside each demo also routes through `i18n.changeLanguage`.

**Out of scope (intentional):**
- Mock seed data (article bodies, profile data, telecom keywords, app descriptions) stays in English — translating mock placeholder content adds no real value to a demo.
- Some deep secondary modals/forms in Admin pages, Provisioning sub-tabs, and Lite create-flow not yet pulled through `t()` — backlog item.

**Testing:** iteration_12.json — 19/19 checks pass:
- Initial default EN ✓, switcher visible ✓, hero translates ✓
- HTML lang updates dynamically ✓
- localStorage `bdapps_lang` persists ✓, reload preserves ✓, logout-to-login preserves ✓
- Dashboard, Sidebar, My Apps, App Store, Digital, Reports, Provisioning, Add-Ons, Lite all render correctly in BN ✓
- EN switch back works ✓
- Demo apps (BondoBD, NewsNow) sync with global language ✓



## What's Been Implemented (Feb 6 — initial; Feb 10 — fixes; Feb 11 — Web/Android Builders; Feb 14 — Lucrative No-Code overhaul; Feb 17 — Content & Data Management; Feb 18, 2026 — Sidebar collapse + App Store redesign + Two Showpiece Apps + Admin Approval Flow; Feb 19, 2026 — Rich SVG visual overhaul + EduPath BD + Dashboard Quick View; Feb 21, 2026 — 4 New BDApps Demo Apps + BDApps API Simulation Layer; Feb 21, 2026 (iteration 11) — Bilingual বাংলা/EN demo apps + Rich Bangla template-card previews)

### Iteration 11 — Bilingual demo apps + Rich Web template previews (Feb 21, 2026)
**100% test pass per iteration_11.json (14/14 checks).** Made the 3 BDApps demo apps (BondoBD / NewsNow / QuizBD) authentic-Bangladeshi-looking with a Bangla + English language toggle, reordered the Web App Builder so the BDApps demo templates appear first, and replaced their plain mini-mockups with rich Bangla CSS previews matching real Bangladeshi product references (Biye.bd / Alokbarta).

**Files added:**
- `/src/services/demoI18n.jsx` — tiny i18n hook `useDemoLocale(app)` returning `{ locale, setLocale, t }` + reusable `<LangToggle>` component. STRINGS object holds full Bangla + English translations for bondo / news / quiz scopes. Locale persists per app via `localStorage` keys `bdapps_locale_*`. Default locale is `bn`.

**Files patched:**
- `/src/pages/apps/BondoBD.jsx` — completely redesigned landing matching the Biye.bd reference: dark rose+navy gradient header with avatar logo, left-side hero ("বাংলাদেশের সবচেয়ে বড় ম্যাট্রিমনি") + stat-avatar row + 3 stat tiles, right-side OTP card with +88 prefix, scrolling Success Stories section with 3 couple-silhouette video tiles. Full bilingual support.
- `/src/pages/apps/NewsNow.jsx` — added a welcome Hero section matching the Alokbarta reference: navy-blue header with amber "আ" rounded-square logo + Bangla "আলোকবার্তা" + uppercase "BANGLADESH NEWS" subtitle, red breaking-news ticker, Bangla welcome hero ("দেশ-বিদেশের সকল খবর এক জায়গায়") + checked feature list + central OTP card with amber CTA + right sidebar "লাইভ সংবাদ প্রিভিউ" panel with category-color-coded news items. Full bilingual support.
- `/src/pages/apps/QuizBD.jsx` — fully bilingual: hero, home/category cards, leaderboard labels, active quiz screen, results page (e.g. ১,৮৪,০০০+ সাবস্ক্রাইবার, বাংলাদেশ সাধারণ জ্ঞান, প্রতিদিনের কুইজ).
- `/src/mocks/builderTemplates.js` — `WEB_TEMPLATES` reordered: web-bondobd → web-newsnow → web-quizbd FIRST, then E-Commerce/Food/Health/Edu/Realestate/Travel/NGO/SaaS. Added new `web-quizbd` (previously only Pro/Android). Each new template carries the canonical rose / slate-amber / purple palette + apis array. `ALL_CATEGORIES_WEB` extended with `Subscription Service`, `Media`, `Content Service`.
- `/src/components/digital/TemplateMockup.jsx` — added 3 NEW rich mini-mockups for `web-bondobd`, `web-newsnow`, `web-quizbd`. Each renders authentic Bangla CSS art:
  - **BondoBD card**: Rose split-pane with Bangla hero text + small +88 mock OTP card with "শুরু করুন →" CTA + 4-day BDT pricing footnote.
  - **NewsNow card**: Navy navbar with the amber "আ" logo, red live-pulse strip ("● ৬৪ জেলার আপডেট"), left Bangla content + right "● লাইভ প্রিভিউ" sidebar with category-color-tagged article cards (রাজনীতি, অর্থনীতি, খেলাধুলা).
  - **QuizBD card**: Purple gradient with mini quiz card showing Bangla question "বাংলাদেশের জাতীয় ফুল?", 4 ABCD option rows, green-highlighted "শাপলা ✓ +10" correct answer + leaderboard / streak footer.
- `/public/index.html` — added `Hind Siliguri` + `Tiro Bangla` Google Fonts so Bangla copy renders correctly.

**Testing:** iteration_11.json — 14/14 checks pass:
- Web tab first-3 order correct ✓
- Rich Bangla mockups all 3 cards ✓
- QuizBD web card clickable ✓
- All 3 apps default to Bangla ✓
- Lang toggle (lang-bn / lang-en) switches text on all 3 apps ✓
- Locale persisted via localStorage ✓
- Quiz post-OTP home shows Bangla category cards ✓
- OTP flow still works with API Monitor showing 4 calls ✓
- No regression to iteration 10 flows ✓



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
