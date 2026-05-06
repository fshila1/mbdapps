// Centralized mock data for BDapps demo

export const STATUS_COLORS = {
  "Active Production": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Pending Approval": "bg-amber-100 text-amber-700 border-amber-200",
  "Suspended": "bg-rose-100 text-rose-700 border-rose-200",
  "Draft": "bg-slate-100 text-slate-700 border-slate-200",
  "Rejected": "bg-red-100 text-red-700 border-red-200",
  "Limited Production": "bg-sky-100 text-sky-700 border-sky-200",
  "Terminated": "bg-zinc-200 text-zinc-700 border-zinc-300",
  "Scheduled Active Production": "bg-indigo-100 text-indigo-700 border-indigo-200",
};

export const ALL_STATUSES = [
  "Active Production",
  "Pending Approval",
  "Suspended",
  "Draft",
  "Rejected",
  "Limited Production",
  "Scheduled Active Production",
  "Terminated",
];

const today = new Date();
const daysAgo = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

export const seedApps = [
  {
    id: "APP-1001",
    name: "Cricket Live Updates",
    type: "Pro",
    username: "developer@bdapps.com",
    created: daysAgo(28),
    status: "Active Production",
    description: "Live ball-by-ball cricket score updates via SMS.",
    host: "https://cricket.bdapps.dev",
    apis: ["SMS", "Subscription"],
    revenueShare: { developer: 70, operator: 25, platform: 5 },
    activity: [
      { actor: "admin@bdapps.com", date: daysAgo(28), remark: "Approved - Active Production" },
      { actor: "developer@bdapps.com", date: daysAgo(30), remark: "App submitted" },
    ],
  },
  {
    id: "APP-1002",
    name: "Daily Quiz Bangla",
    type: "Lite",
    username: "developer@bdapps.com",
    created: daysAgo(15),
    status: "Pending Approval",
    description: "Bangla GK quiz delivered daily via SMS subscription.",
    host: "https://quiz.bdapps.dev",
    apis: ["SMS"],
    revenueShare: { developer: 60, operator: 30, platform: 10 },
    activity: [{ actor: "developer@bdapps.com", date: daysAgo(15), remark: "App submitted for review" }],
  },
  {
    id: "APP-1003",
    name: "Bus Ticket USSD",
    type: "Pro",
    username: "developer@bdapps.com",
    created: daysAgo(45),
    status: "Suspended",
    description: "USSD-based interstate bus ticket booking.",
    host: "https://bus.bdapps.dev",
    apis: ["USSD", "CaaS"],
    revenueShare: { developer: 65, operator: 25, platform: 10 },
    activity: [
      { actor: "admin@bdapps.com", date: daysAgo(5), remark: "Suspended - compliance review" },
      { actor: "admin@bdapps.com", date: daysAgo(40), remark: "Approved" },
    ],
  },
  {
    id: "APP-1004",
    name: "Recipe of the Day",
    type: "Lite",
    username: "developer@bdapps.com",
    created: daysAgo(2),
    status: "Draft",
    description: "Daily Bangla recipe SMS.",
    host: "",
    apis: [],
    revenueShare: { developer: 60, operator: 30, platform: 10 },
    activity: [{ actor: "developer@bdapps.com", date: daysAgo(2), remark: "Draft created" }],
  },
  {
    id: "APP-1005",
    name: "Stock Trade Alerts",
    type: "Pro",
    username: "developer@bdapps.com",
    created: daysAgo(60),
    status: "Rejected",
    description: "Real-time DSE stock alerts.",
    host: "https://stocks.bdapps.dev",
    apis: ["SMS", "Subscription"],
    revenueShare: { developer: 0, operator: 0, platform: 0 },
    activity: [
      { actor: "admin@bdapps.com", date: daysAgo(55), remark: "Rejected - missing SEBL license" },
      { actor: "developer@bdapps.com", date: daysAgo(60), remark: "Submitted" },
    ],
  },
  {
    id: "APP-1006",
    name: "City Prayer Times",
    type: "Lite",
    username: "developer@bdapps.com",
    created: daysAgo(20),
    status: "Limited Production",
    description: "5x daily prayer time SMS for Dhaka, Chittagong, Sylhet.",
    host: "https://salah.bdapps.dev",
    apis: ["SMS"],
    revenueShare: { developer: 65, operator: 25, platform: 10 },
    activity: [
      { actor: "admin@bdapps.com", date: daysAgo(18), remark: "Limited Production granted" },
      { actor: "developer@bdapps.com", date: daysAgo(20), remark: "Submitted" },
    ],
  },
];

export const seedLiteApps = [
  { id: "LITE-001", name: "Morning News Bangla", status: "Active", category: "Alert", keyword: "MNEWS" },
  { id: "LITE-002", name: "Weather Today", status: "Active", category: "Alert", keyword: "WTHR" },
  { id: "LITE-003", name: "Daily Hadith", status: "Pending", category: "Services", keyword: "HADITH" },
  { id: "LITE-004", name: "Stock Brief", status: "Rejected", category: "Services", keyword: "STKBR" },
];

export const seedKeywords = [
  { keyword: "WTHR", appName: "Weather Today", shortcode: "21333", status: "Active" },
  { keyword: "MNEWS", appName: "Morning News Bangla", shortcode: "21333", status: "Active" },
  { keyword: "HADITH", appName: "Daily Hadith", shortcode: "21333", status: "Pending" },
  { keyword: "QUIZ", appName: "Daily Quiz", shortcode: "21333", status: "Active" },
  { keyword: "RECIPE", appName: "Recipe of the Day", shortcode: "21333", status: "Active" },
];

export const seedSystemUsers = [
  { username: "admin", firstName: "System", lastName: "Admin", status: "Active", group: "SuperAdmin", email: "admin@bdapps.com" },
  { username: "amir.ops", firstName: "Amir", lastName: "Hossain", status: "Active", group: "Operator", email: "amir@robi.com.bd" },
  { username: "rina.qa", firstName: "Rina", lastName: "Akter", status: "Disabled", group: "Reviewer", email: "rina@bdapps.com" },
  { username: "tanvir.fin", firstName: "Tanvir", lastName: "Khan", status: "Initial", group: "Finance", email: "tanvir@bdapps.com" },
];

export const seedAppCreators = [
  { username: "developer", status: "Active", profileStatus: "Verified", email: "developer@bdapps.com", mobile: "+8801711000001" },
  { username: "shahin.dev", status: "Active", profileStatus: "Verified", email: "shahin@dev.com", mobile: "+8801712000002" },
  { username: "nadia.dev", status: "Disabled", profileStatus: "Pending", email: "nadia@dev.com", mobile: "+8801713000003" },
];

export const seedAppstoreUsers = [
  { firstName: "Sabbir", lastName: "Ahmed", mobile: "+8801711234567" },
  { firstName: "Fahmida", lastName: "Rahman", mobile: "+8801712345678" },
  { firstName: "Mahin", lastName: "Islam", mobile: "+8801713456789" },
];

export const seedBuildFiles = [
  { creator: "developer", appId: "APP-1004", appName: "Recipe of the Day", version: "1.0.0", date: daysAgo(2), remarks: "Initial build", status: "Pending" },
  { creator: "shahin.dev", appId: "APP-1007", appName: "Skill Tutor", version: "2.1.0", date: daysAgo(10), remarks: "Bug fixes", status: "Approved" },
  { creator: "nadia.dev", appId: "APP-1008", appName: "Music Box", version: "0.9.0", date: daysAgo(20), remarks: "Beta", status: "Rejected" },
];

export const seedAds = [
  { id: "AD-01", name: "Robi Internet Pack", content: "Get 5GB at Tk99" },
  { id: "AD-02", name: "Eid Bonus", content: "Free 100 SMS today!" },
];

export const seedSubscriptions = [
  { mobile: "+8801711234567", appName: "Cricket Live Updates", spName: "BDapps", status: "Active", channel: "SMS",
    charging: { instrument: "Mobile Account", amount: 2, frequency: "Daily", lastCharged: daysAgo(0), startDate: daysAgo(30), endDate: "" } },
  { mobile: "+8801712345678", appName: "Daily Hadith", spName: "BDapps", status: "Suspended", channel: "USSD",
    charging: { instrument: "Mobile Account", amount: 1, frequency: "Daily", lastCharged: daysAgo(2), startDate: daysAgo(20), endDate: "" } },
];

export const seedAppStore = [
  { id: "AS-01", name: "Cricket Live", developer: "BD Sports", rating: 4.8, category: "Entertainment", icon: "🏏", cost: "Tk 2/day", description: "Real-time cricket scores via SMS.", instructions: "Send CRIC to 21333 to subscribe." },
  { id: "AS-02", name: "Daily Hadith", developer: "Islamic Foundation BD", rating: 4.9, category: "Utilities", icon: "📖", cost: "Tk 1/day", description: "Authentic daily hadith reminders.", instructions: "Send HADITH to 21333." },
  { id: "AS-03", name: "Health Tips Pro", developer: "MedBangla", rating: 4.5, category: "Health", icon: "💚", cost: "Free", description: "Daily wellness tips curated by doctors.", instructions: "Send HEALTH to 21333." },
  { id: "AS-04", name: "Stock Brief BD", developer: "FinHub", rating: 4.3, category: "Finance", icon: "📈", cost: "Tk 5/day", description: "DSE stock summaries every evening.", instructions: "Send STK to 21333." },
  { id: "AS-05", name: "Bangla Quiz", developer: "EduPlay", rating: 4.6, category: "Games", icon: "🎮", cost: "Tk 1/day", description: "Win Tk100 every week!", instructions: "Send QUIZ to 21333." },
  { id: "AS-06", name: "Weather Today", developer: "MetBD", rating: 4.4, category: "Utilities", icon: "🌤️", cost: "Free", description: "City-wise weather alerts.", instructions: "Send WTHR to 21333." },
  { id: "AS-07", name: "Movie Buff", developer: "Cineplex", rating: 4.2, category: "Entertainment", icon: "🎬", cost: "Tk 3/day", description: "Latest movie news & showtimes.", instructions: "Send MOVIE to 21333." },
  { id: "AS-08", name: "Salah Times", developer: "Islamic Foundation BD", rating: 4.9, category: "Utilities", icon: "🕌", cost: "Free", description: "5x daily prayer times.", instructions: "Send SALAH to 21333." },
];

export const HERO_SLIDES = [
  { title: "Discover Apps Built for Bangladesh", subtitle: "Curated by Robi BDapps", color: "from-rose-600 to-rose-800" },
  { title: "Subscribe with a Single SMS", subtitle: "No app store. No data charges.", color: "from-slate-900 to-slate-700" },
  { title: "Win Big with Daily Quiz", subtitle: "Tk 100 weekly prize", color: "from-amber-600 to-rose-600" },
];

export const LITE_TEMPLATES = [
  { id: "lt1", name: "Weather Alert", category: "Alert", icon: "🌦️", description: "Daily weather SMS alerts to subscribers.", keyword: "WTHR", subscribers: 12400, sample: ["Dhaka 31°C, light rain expected.", "Chittagong 29°C, humid morning.", "Sylhet 27°C, cloudy."] },
  { id: "lt2", name: "Prayer Time Reminder", category: "Alert", icon: "🕌", description: "Five-times daily prayer alerts.", keyword: "SALAH", subscribers: 38000, sample: ["Fajr at 4:48 AM today.", "Dhuhr at 12:05 PM.", "Maghrib at 6:12 PM."] },
  { id: "lt3", name: "Sports Score Update", category: "Alert", icon: "🏏", description: "Live cricket/football scores.", keyword: "SCORE", subscribers: 22150, sample: ["BD 245/4 (40 ov) vs IND.", "Mahmudullah 67* not out.", "BAN won by 7 wickets!"] },
  { id: "lt4", name: "Daily Health Tips", category: "Services", icon: "💚", description: "Wellness tips delivered daily.", keyword: "HEALTH", subscribers: 8900, sample: ["Drink 8 glasses of water today.", "20-min walk lowers BP risk.", "Eat seasonal fruits for vitamin C."] },
  { id: "lt5", name: "Daily Hadith", category: "Services", icon: "📖", description: "Islamic daily reminder.", keyword: "HADITH", subscribers: 51000, sample: ["Hadith of the day: 'Smile at your brother...'", "Sahih Bukhari, Vol 1, #11", "Tafsir explanation tomorrow."] },
  { id: "lt6", name: "Stock Market Brief", category: "Services", icon: "📈", description: "Daily market summary.", keyword: "MARKET", subscribers: 4300, sample: ["DSEX +0.42% closing 6,210", "Top gainer: BEXIMCO +5.1%", "Top loser: GP -1.8%"] },
];

export const PROVISIONING_TEMPLATES = [
  { id: "pt1", name: "SMS Subscription Service", apis: ["SMS", "Subscription"], icon: "💬", description: "Full SMS MO+MT with subscription charging.",
    flow: ["User SMS to shortcode", "BDapps validates", "Charging engine debits", "MT confirmation"], useCase: "Daily news, quotes, recipes." },
  { id: "pt2", name: "USSD Menu App", apis: ["USSD", "CaaS"], icon: "📞", description: "Interactive USSD session handler.",
    flow: ["Dial *123#", "Menu shown", "User selects", "CaaS deducts charge", "Result returned"], useCase: "Bus ticket, account check." },
  { id: "pt3", name: "OTP Verification Service", apis: ["OTP", "SMS"], icon: "🔐", description: "OTP-based authentication system.",
    flow: ["User requests OTP", "BDapps generates", "SMS MT delivered", "Verify on callback"], useCase: "Login auth, KYC, txn approval." },
  { id: "pt4", name: "Charged Content Platform", apis: ["CaaS", "Subscription", "SMS"], icon: "💎", description: "Premium content with CaaS charging.",
    flow: ["Subscribe via keyword", "CaaS charging", "Premium content delivered", "Daily rebill"], useCase: "Music, video clips, exclusive content." },
];

export const CATEGORIES = ["Games", "Entertainment", "Health", "Finance", "Utilities"];

export const seedMessageHistory = [
  { date: daysAgo(0), app: "Cricket Live Updates", from: "21333", to: "+8801711234567", message: "BD 245/4 in 40 ov", status: "Delivered" },
  { date: daysAgo(0), app: "Daily Hadith", from: "21333", to: "+8801712345678", message: "Hadith #1234 of Sahih Bukhari", status: "Delivered" },
  { date: daysAgo(1), app: "Weather Today", from: "21333", to: "+8801713456789", message: "Dhaka 31C, light rain", status: "Failed" },
  { date: daysAgo(1), app: "Cricket Live Updates", from: "21333", to: "+8801714567890", message: "BAN won by 7 wickets", status: "Delivered" },
  { date: daysAgo(2), app: "Daily Hadith", from: "21333", to: "+8801715678901", message: "Daily reminder #1235", status: "Delivered" },
];

export const seedReportData = [
  { label: "Jan", value: 12400 },
  { label: "Feb", value: 14210 },
  { label: "Mar", value: 18900 },
  { label: "Apr", value: 21500 },
  { label: "May", value: 19800 },
  { label: "Jun", value: 24600 },
];
