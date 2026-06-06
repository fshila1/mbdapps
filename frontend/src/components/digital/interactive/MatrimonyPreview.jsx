import React, { useEffect, useMemo, useState } from "react";

/* ============================================================================
 * BondoBD Matrimony — Classic / Lucrative Preview
 * Shared by:
 *   - UniversalWebPreview (web-bondobd)
 *   - WebPreviews / Pro builder (pro-bondobd)
 *   - UniversalAndroidPreview (and-bondobd, via matrimonyAndroidScreens)
 * Visual language: warm ivory + maroon + gold, classic serif headings, floral
 * ornaments, SVG avatar portraits (female saree + bindi, male panjabi + topi).
 * Full UX journey: Landing → OTP Login → OTP Verify → Browse → Profile Detail
 *                  → Favorites + Send Interest + In-app Chat
 * ========================================================================= */

const PALETTE = {
  ivory: "#FFFBEF",
  paper: "#FAF1DF",
  deep: "#7E1733",         // deep maroon (logo + cta + accents)
  rose: "#C2185B",         // dusty rose
  gold: "#C7A24A",         // antique gold (ornaments)
  goldDark: "#8E6F1F",
  ink: "#3B1E27",          // dark text
  mute: "#7A5C5F",         // muted text
};

const SERIF = '"Playfair Display","DM Serif Display","Tiro Bangla","Hind Siliguri",Georgia,serif';
const SANS = '"Hind Siliguri","Inter",system-ui,sans-serif';

const T = (lang, en, bn) => (lang === "Bengali" ? bn : en);

/* ---------- Default seed data (used when user has not populated content) -- */
// Photographic avatars via randomuser.me (free, stable CDN). Each profile gets
// a deterministic gender-matched portrait. SVG fallback (MatriAvatar) renders
// instantly while the image loads + on error.
const FALLBACK_PROFILES = [
  { id: "p1", name: "Rahima Akter",   age: 24, gender: "Female", district: "Dhaka",      religion: "Islam",   education: "BSc, BUET",      profession: "Software Engineer", height: "5'4\"", maritalStatus: "Never Married", about: "Family-oriented engineer who loves reading and travel.", family: "Father — Govt. Service · Mother — Homemaker · 1 sister", photo: "https://randomuser.me/api/portraits/women/65.jpg" },
  { id: "p2", name: "Sadia Rahman",   age: 26, gender: "Female", district: "Chittagong", religion: "Islam",   education: "MBBS, DMC",      profession: "Pediatrician",      height: "5'3\"", maritalStatus: "Never Married", about: "Pediatrician passionate about child welfare.",          family: "Father — Doctor · Mother — Teacher · 2 brothers",         photo: "https://randomuser.me/api/portraits/women/72.jpg" },
  { id: "p3", name: "Nusrat Jahan",   age: 23, gender: "Female", district: "Sylhet",     religion: "Islam",   education: "MBA, IBA",       profession: "Banker",            height: "5'5\"", maritalStatus: "Never Married", about: "Loves classical music and cooking.",                    family: "Father — Banker · Mother — Homemaker · 1 brother",        photo: "https://randomuser.me/api/portraits/women/79.jpg" },
  { id: "p4", name: "Karim Ahmed",    age: 29, gender: "Male",   district: "Dhaka",      religion: "Islam",   education: "BSc, NSU",       profession: "Architect",         height: "5'10\"", maritalStatus: "Never Married", about: "Designs sustainable homes for Bangladesh.",            family: "Father — Engineer · Mother — Homemaker · 1 sister",       photo: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: "p5", name: "Tanvir Hossain", age: 31, gender: "Male",   district: "Khulna",     religion: "Islam",   education: "MSc, RUET",      profession: "Civil Engineer",    height: "5'11\"", maritalStatus: "Never Married", about: "Family man who enjoys cricket and travelling.",        family: "Father — Govt. Officer · Mother — Homemaker",             photo: "https://randomuser.me/api/portraits/men/45.jpg" },
  { id: "p6", name: "Rafiqul Karim",  age: 33, gender: "Male",   district: "Rajshahi",   religion: "Islam",   education: "MBBS, RMC",      profession: "Cardiologist",      height: "5'9\"",  maritalStatus: "Never Married", about: "Practising cardiologist in Rajshahi Medical.",         family: "Father — Doctor · Mother — Teacher",                      photo: "https://randomuser.me/api/portraits/men/52.jpg" },
];

const FALLBACK_PLANS = [
  { id: "pl1", name: "Free",             price: 0,   period: "lifetime", features: ["Browse profiles", "Blurred contact", "5 daily matches"] },
  { id: "pl2", name: "Premium 7 Days",   price: 49,  period: "7 days",   badge: "Popular",   features: ["Unlock 10 contacts", "SMS interest alerts", "Direct WhatsApp"] },
  { id: "pl3", name: "Premium Monthly",  price: 199, period: "month",    badge: "Best Value", features: ["Unlimited unlock", "Verified badge", "Family invitation"] },
];

const FALLBACK_STORIES = [
  { id: "s1", couple: "Imran & Tahmina",  year: "2025", quote: "Met on BondoBD in October, married in December.",            district: "Dhaka" },
  { id: "s2", couple: "Sabbir & Mehjabin", year: "2024", quote: "Our families connected through SMS interest alerts.",        district: "Chittagong" },
  { id: "s3", couple: "Rafi & Anika",      year: "2024", quote: "Premium contact unlock saved us months of intermediaries.", district: "Sylhet" },
];

/* ---------- Ornaments + Avatars (SVG, no external assets) ---------------- */

const FloralCorner = ({ flip, color = PALETTE.gold, size = 80 }) => (
  <svg viewBox="0 0 80 80" width={size} height={size} style={{ transform: flip ? "scaleX(-1)" : "none" }} aria-hidden>
    <g fill="none" stroke={color} strokeWidth="1.2" opacity="0.7">
      <path d="M2 78 C 18 64, 34 64, 40 50" />
      <path d="M2 78 C 22 70, 38 60, 44 42" />
      <circle cx="44" cy="42" r="3" fill={color} opacity="0.6" />
      <circle cx="40" cy="50" r="2.4" fill={color} opacity="0.55" />
      <path d="M20 70 q -4 -8 4 -10 q 8 -2 6 8 q -2 8 -10 2 Z" fill={color} opacity="0.35" stroke="none" />
      <path d="M30 60 q -4 -8 4 -10 q 8 -2 6 8 q -2 8 -10 2 Z" fill={color} opacity="0.3" stroke="none" />
    </g>
  </svg>
);

const DividerOrnament = ({ color = PALETTE.gold }) => (
  <div className="flex items-center justify-center gap-2 my-2" aria-hidden>
    <span className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${color}66, ${color})` }} />
    <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 2 L13.6 9 L21 10 L15 14.5 L17 22 L12 17.5 L7 22 L9 14.5 L3 10 L10.4 9 Z" fill={color} opacity="0.85" /></svg>
    <span className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${color}66, ${color})` }} />
  </div>
);

/* Photographic avatar with SVG fallback. Renders <img> when profile.photo is
   set; on load-error or no-url, falls back to the gender-neutral SVG portrait.
   shape: "circle" | "fill". "fill" makes the avatar fill its parent container. */
const MatriAvatar = ({ profile, size = 80, shape = "circle" }) => {
  const [errored, setErrored] = useState(false);
  if (shape === "fill") {
    return profile.photo && !errored ? (
      <img src={profile.photo} alt={profile.name} loading="lazy" onError={() => setErrored(true)} className="absolute inset-0 w-full h-full object-cover" />
    ) : (
      <div className="absolute inset-0 grid place-items-center" style={{ background: `linear-gradient(160deg, ${PALETTE.paper} 0%, #FCE7E1 100%)` }}>
        <MatriAvatarSvg profile={profile} size={Math.min(size, 160)} />
      </div>
    );
  }
  const ringStyle = { width: size, height: size, borderRadius: "50%", boxShadow: `0 0 0 2px ${PALETTE.gold}66, 0 0 0 4px #FFFFFF` };
  if (profile.photo && !errored) {
    return <img src={profile.photo} alt={profile.name} loading="lazy" onError={() => setErrored(true)} style={{ ...ringStyle, objectFit: "cover", display: "block" }} />;
  }
  return <div style={ringStyle}><MatriAvatarSvg profile={profile} size={size} /></div>;
};

const MatriAvatarSvg = ({ profile, size = 80 }) => {
  const isFemale = profile.gender === "Female";
  const seed = (profile.id || profile.name || "x").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const hueA = isFemale ? ["#FCE4EC","#FFE0E6","#FDE8E8","#F8E0F2"][seed % 4] : ["#E3F2FD","#E0F2F1","#ECEFF1","#E8EAF6"][seed % 4];
  const hueB = isFemale ? ["#F48FB1","#F06292","#EC407A","#D81B60"][seed % 4] : ["#90A4AE","#78909C","#607D8B","#546E7A"][seed % 4];
  const skin = ["#F4D2B3","#E8B894","#D4A373","#C68B59"][seed % 4];
  const hair = ["#2B1E14","#3E2723","#1B1B1B","#4A2C20"][seed % 4];
  const shirt = isFemale ? ["#D81B60","#7E1733","#AD1457","#C2185B"][seed % 4] : ["#1565C0","#37474F","#2E4B6E","#283593"][seed % 4];
  const id = `av-${profile.id || seed}`;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden style={{ display: "block", borderRadius: "50%" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={hueA} /><stop offset="100%" stopColor={hueB} />
        </linearGradient>
        <clipPath id={`${id}-c`}><circle cx="50" cy="50" r="49" /></clipPath>
      </defs>
      <circle cx="50" cy="50" r="49" fill={`url(#${id})`} />
      <g clipPath={`url(#${id}-c)`}>
        <rect x="0" y="0" width="100" height="100" fill={`url(#${id})`} />
        <circle cx="50" cy="22" r="24" fill="#FFFFFF" opacity="0.18" />
        <path d="M14 100 C 22 70, 34 62, 50 62 C 66 62, 78 70, 86 100 Z" fill={shirt} />
        <rect x="45" y="52" width="10" height="11" fill={skin} />
        <circle cx="50" cy="42" r="14" fill={skin} />
        {isFemale ? (
          <path d="M34 42 C 34 26, 66 26, 66 42 L 66 36 C 66 24, 34 24, 34 36 Z M34 42 C 32 56, 30 64, 30 78 L 28 92 L 22 92 C 22 72, 28 56, 32 46 Z M66 42 C 68 56, 70 64, 70 78 L 72 92 L 78 92 C 78 72, 72 56, 68 46 Z" fill={hair} />
        ) : (
          <path d="M36 38 C 36 28, 64 28, 64 38 C 64 32, 60 30, 50 30 C 40 30, 36 32, 36 38 Z" fill={hair} />
        )}
        <ellipse cx="45" cy="43" rx="1.3" ry="1.6" fill={PALETTE.ink} />
        <ellipse cx="55" cy="43" rx="1.3" ry="1.6" fill={PALETTE.ink} />
        <path d="M46 50 Q 50 52.5 54 50" stroke="#7a3a2a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
};

/* ---------- Small UI primitives ----------------------------------------- */

const Pill = ({ children, color = PALETTE.deep, bg = "#FFF" }) => (
  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border" style={{ color, borderColor: `${color}55`, background: bg }}>{children}</span>
);

const PrimaryBtn = ({ children, onClick, full, tid, type = "button" }) => (
  <button data-testid={tid} type={type} onClick={onClick} className={`${full ? "w-full" : ""} inline-flex items-center justify-center gap-1.5 text-xs font-bold tracking-wide px-4 py-2 rounded-full text-white transition shadow-sm hover:opacity-95`} style={{ background: `linear-gradient(135deg, ${PALETTE.deep}, ${PALETTE.rose})` }}>
    {children}
  </button>
);

const GhostBtn = ({ children, onClick, full, tid }) => (
  <button data-testid={tid} onClick={onClick} className={`${full ? "w-full" : ""} inline-flex items-center justify-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition`} style={{ color: PALETTE.deep, borderColor: `${PALETTE.deep}44`, background: "#FFF" }}>
    {children}
  </button>
);

const Heart = ({ filled, size = 14, color = PALETTE.rose }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
    <path d="M12 21s-7-4.5-9.5-9.2C.9 8.3 2.6 4.7 6.2 4.7c2 0 3.4 1 4 2.2.6-1.2 2-2.2 4-2.2 3.6 0 5.3 3.6 3.7 7.1C19 16.5 12 21 12 21Z" fill={filled ? color : "none"} stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

/* ============== MAIN WEB PREVIEW ======================================== */

export const MatrimonyWebPreview = ({ cfg = {}, content, chromeless = false, onPhoneSubmit, onOtpVerify, onInterest, onSubscribe }) => {
  const lang = cfg.language || "English";
  const tt = (en, bn) => T(lang, en, bn);
  const profiles = (content?.profiles?.length ? content.profiles : FALLBACK_PROFILES);
  const plans    = (content?.plans?.length    ? content.plans    : FALLBACK_PLANS);
  const stories  = (content?.stories?.length  ? content.stories  : FALLBACK_STORIES);
  const serviceName = content?.storeInfo?.name || cfg.appName || "BondoBD Matrimony";

  // State machine: landing | otp-phone | otp-code | browse | detail | chat | favorites | plans
  const [stage, setStage] = useState("landing");
  const [phone, setPhone] = useState("1711-234567");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [openId, setOpenId] = useState(null);
  const [favs, setFavs] = useState({});
  const [interests, setInterests] = useState({});
  const [toast, setToast] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [ageRange, setAgeRange] = useState("All");
  const [religionFilter, setReligionFilter] = useState("All");
  const [districtFilter, setDistrictFilter] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");

  const openProfile = profiles.find((p) => p.id === openId) || profiles[0];

  // Distinct values for filter dropdowns
  const religions = useMemo(() => Array.from(new Set(profiles.map((p) => p.religion).filter(Boolean))), [profiles]);
  const districts = useMemo(() => Array.from(new Set(profiles.map((p) => p.district).filter(Boolean))), [profiles]);

  const filteredProfiles = useMemo(() => {
    const inAge = (age) => {
      if (ageRange === "All") return true;
      const [lo, hi] = ageRange.split("-").map((n) => parseInt(n, 10));
      if (ageRange.endsWith("+")) return age >= parseInt(ageRange, 10);
      return age >= lo && age <= hi;
    };
    let arr = profiles.filter((p) => {
      if (genderFilter !== "All" && p.gender !== genderFilter) return false;
      if (!inAge(p.age)) return false;
      if (religionFilter !== "All" && p.religion !== religionFilter) return false;
      if (districtFilter !== "All" && p.district !== districtFilter) return false;
      return true;
    });
    if (sortBy === "age-asc") arr = [...arr].sort((a, b) => a.age - b.age);
    if (sortBy === "age-desc") arr = [...arr].sort((a, b) => b.age - a.age);
    if (sortBy === "name") arr = [...arr].sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [profiles, genderFilter, ageRange, religionFilter, districtFilter, sortBy]);

  const activeFilterCount = [genderFilter !== "All", ageRange !== "All", religionFilter !== "All", districtFilter !== "All"].filter(Boolean).length;
  const resetFilters = () => { setGenderFilter("All"); setAgeRange("All"); setReligionFilter("All"); setDistrictFilter("All"); setSortBy("recommended"); };

  // Compatibility hash so each card shows a stable percent
  const compatPct = (p) => 70 + ((p.name || "").length * 7 + p.age) % 28;

  const fireToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2200); };
  const toggleFav = (id) => {
    setFavs((f) => {
      const next = { ...f, [id]: !f[id] };
      fireToast(next[id] ? tt("💛 Saved to favorites", "💛 ফেভারিটে যোগ হয়েছে") : tt("Removed from favorites", "ফেভারিট থেকে সরানো হয়েছে"));
      return next;
    });
  };
  const sendInterest = (id) => {
    setInterests((m) => ({ ...m, [id]: true }));
    if (onInterest) onInterest(profiles.find((p) => p.id === id));
    fireToast(tt("💌 Interest sent — they'll receive an SMS", "💌 আগ্রহ পাঠানো হয়েছে"));
  };
  const startChat = (id) => {
    setOpenId(id);
    setChatMessages([
      { from: "them", text: tt("Assalamu Alaikum, thanks for your interest 🌸", "আসসালামু আলাইকুম, ধন্যবাদ 🌸"), time: "10:14 AM" },
      { from: "them", text: tt("Could you tell me a little about your family?", "আপনার পরিবার সম্পর্কে কিছু বলবেন?"), time: "10:14 AM" },
    ]);
    setStage("chat");
  };
  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages((m) => [...m, { from: "me", text: chatInput.trim(), time: "now" }]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((m) => [...m, { from: "them", text: tt("Thank you 🌸 — let's continue inshaAllah.", "ধন্যবাদ 🌸 ইনশাআল্লাহ চালিয়ে যাই।"), time: "now" }]);
    }, 900);
  };

  const setOtpAt = (idx, v) => {
    setOtp((o) => { const n = [...o]; n[idx] = v.replace(/\D/g, "").slice(-1); return n; });
  };

  /* --------- Header (shared across stages) ---------- */
  const TopBar = (
    <div className="relative px-5 py-3 flex items-center justify-between" style={{ background: `linear-gradient(90deg, ${PALETTE.deep} 0%, ${PALETTE.rose} 60%, ${PALETTE.deep} 100%)`, color: "#FFF8E1" }}>
      <div className="absolute inset-x-0 -bottom-px h-px" style={{ background: `linear-gradient(to right, transparent, ${PALETTE.gold}, transparent)` }} />
      <button onClick={() => setStage(stage === "landing" ? "landing" : "browse")} className="flex items-center gap-2">
        <span className="w-9 h-9 rounded-full grid place-items-center" style={{ background: "rgba(255,251,225,0.18)", border: `1px solid ${PALETTE.gold}66` }}>
          <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 21s-7-4.5-9.5-9.2C.9 8.3 2.6 4.7 6.2 4.7c2 0 3.4 1 4 2.2.6-1.2 2-2.2 4-2.2 3.6 0 5.3 3.6 3.7 7.1C19 16.5 12 21 12 21Z" fill={PALETTE.gold} /></svg>
        </span>
        <div className="text-left">
          <div className="font-bold text-sm leading-tight" style={{ fontFamily: SERIF, letterSpacing: "0.02em" }}>{serviceName}</div>
          <div className="text-[10px] opacity-90 tracking-widest uppercase">{tt("Verified Matrimony · Bangladesh", "যাচাইকৃত ম্যাট্রিমনি")}</div>
        </div>
      </button>
      <div className="flex items-center gap-1.5">
        {stage !== "landing" && stage !== "otp-phone" && stage !== "otp-code" && (
          <>
            <button onClick={() => setStage("browse")}    data-testid="matri-nav-browse"    className={`text-[11px] px-2.5 py-1 rounded-full ${stage === "browse" ? "bg-white/25" : "hover:bg-white/10"}`}>{tt("Browse", "প্রোফাইল")}</button>
            <button onClick={() => setStage("favorites")} data-testid="matri-nav-favorites" className={`text-[11px] px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${stage === "favorites" ? "bg-white/25" : "hover:bg-white/10"}`}>
              <Heart filled={true} size={11} color="#FFFBEF" /> {tt("Favourites", "ফেভারিট")} {Object.values(favs).filter(Boolean).length > 0 && <span className="text-[9px] bg-amber-300 text-rose-900 rounded-full px-1.5">{Object.values(favs).filter(Boolean).length}</span>}
            </button>
            <button onClick={() => setStage("plans")}     data-testid="matri-nav-plans"     className={`text-[11px] px-2.5 py-1 rounded-full ${stage === "plans" ? "bg-white/25" : "hover:bg-white/10"}`}>{tt("Premium", "প্রিমিয়াম")}</button>
          </>
        )}
        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(255,251,225,0.18)", border: `1px solid ${PALETTE.gold}55` }}>● {tt("Live Demo", "লাইভ ডেমো")}</span>
      </div>
    </div>
  );

  /* --------- Stage renderers ---------- */
  const LandingView = (
    <div className="relative" style={{ background: PALETTE.ivory }}>
      <div className="absolute top-0 left-0"><FloralCorner /></div>
      <div className="absolute top-0 right-0"><FloralCorner flip /></div>
      <div className="px-8 py-7 text-center max-w-3xl mx-auto">
        <Pill bg="#FFF8E1" color={PALETTE.goldDark}>★ {tt("Bangladesh's most trusted", "বাংলাদেশের সবচেয়ে বিশ্বস্ত")}</Pill>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold leading-[1.1]" style={{ fontFamily: SERIF, color: PALETTE.ink }}>
          {tt("Find Your", "খুঁজুন আপনার")} <span style={{ color: PALETTE.deep }}>{tt("Perfect Match", "মনের মানুষ")}</span>
        </h1>
        <p className="mt-2 text-sm" style={{ color: PALETTE.mute }}>
          {tt("Verified profiles. SMS interest alerts. Secure CaaS contact unlock — built for Bangladeshi families.", "যাচাইকৃত প্রোফাইল · SMS অ্যালার্ট · নিরাপদ যোগাযোগ — বাংলাদেশি পরিবারের জন্য")}
        </p>
        <DividerOrnament />
        <div className="mt-1 flex items-center justify-center gap-5 text-xs" style={{ color: PALETTE.mute }}>
          <span><b style={{ color: PALETTE.deep }}>1,84,000+</b> {tt("members", "সদস্য")}</span>
          <span><b style={{ color: PALETTE.deep }}>12,400</b> {tt("happy couples", "সফল দম্পতি")}</span>
          <span><b style={{ color: PALETTE.deep }}>4.9 ★</b> {tt("rating", "রেটিং")}</span>
        </div>

        {/* Quick search card */}
        <div className="mt-5 mx-auto max-w-xl rounded-2xl p-4 text-left shadow-sm" style={{ background: "#FFF", border: `1px solid ${PALETTE.gold}55` }}>
          <div className="text-[11px] uppercase tracking-[0.25em] font-bold mb-2" style={{ color: PALETTE.goldDark }}>{tt("Begin your search", "অনুসন্ধান শুরু")}</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <Select label={tt("I am a", "আমি")} options={["Female", "Male"]} />
            <Select label={tt("Looking for", "খুঁজছি")} options={["Male", "Female"]} />
            <Select label={tt("Age", "বয়স")} options={["20-25", "25-30", "30-35", "35+"]} />
            <Select label={tt("Religion", "ধর্ম")} options={["Islam", "Hindu", "Christian", "Buddhist"]} />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="text-[10px]" style={{ color: PALETTE.mute }}>{tt("Free OTP-based registration", "ফ্রি OTP রেজিস্ট্রেশন")}</div>
            <PrimaryBtn tid="matri-cta-start" onClick={() => setStage("otp-phone")}>
              {tt("Start with OTP →", "OTP দিয়ে শুরু →")}
            </PrimaryBtn>
          </div>
        </div>

        {/* Featured profile teaser strip */}
        <div className="mt-6 text-left">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-bold uppercase tracking-widest" style={{ color: PALETTE.goldDark }}>{tt("Featured Profiles", "ফিচার্ড প্রোফাইল")}</div>
            <button onClick={() => setStage("otp-phone")} className="text-[11px] underline" style={{ color: PALETTE.deep }}>{tt("See all", "সব দেখুন")}</button>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {profiles.slice(0, 6).map((p) => (
              <div key={p.id} className="rounded-xl p-2 text-center border" style={{ background: "#FFF", borderColor: `${PALETTE.gold}55` }}>
                <div className="aspect-square overflow-hidden rounded-full mx-auto" style={{ width: 64 }}>
                  <MatriAvatar profile={p} size={64} />
                </div>
                <div className="text-[10px] font-bold mt-1 truncate" style={{ color: PALETTE.ink, fontFamily: SERIF }}>{p.name.split(" ")[0]}, {p.age}</div>
                <div className="text-[9px] truncate" style={{ color: PALETTE.mute }}>{p.district}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stories */}
        <div className="mt-7">
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: PALETTE.goldDark }}>{tt("Real Success Stories", "সত্যিকার সফল গল্প")}</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {stories.slice(0, 3).map((s) => (
              <div key={s.id} className="rounded-xl p-3 text-left" style={{ background: "#FFF8E1", border: `1px solid ${PALETTE.gold}55` }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">💍</span>
                  <div className="text-[12px] font-bold" style={{ fontFamily: SERIF, color: PALETTE.ink }}>{s.couple}</div>
                </div>
                <div className="text-[10px] mb-1" style={{ color: PALETTE.mute }}>{s.district} · {s.year}</div>
                <div className="text-[11px] italic leading-snug" style={{ color: PALETTE.ink }}>"{s.quote}"</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0"><FloralCorner /></div>
      <div className="absolute bottom-0 right-0"><FloralCorner flip /></div>
    </div>
  );

  const OtpPhoneView = (
    <div className="px-6 py-8 max-w-md mx-auto" style={{ background: PALETTE.ivory, fontFamily: SANS }}>
      <h2 className="text-2xl font-bold text-center" style={{ fontFamily: SERIF, color: PALETTE.ink }}>{tt("Welcome to your journey", "আপনার যাত্রায় স্বাগতম")}</h2>
      <DividerOrnament />
      <div className="text-center text-xs mb-4" style={{ color: PALETTE.mute }}>{tt("Enter your Robi mobile number — we will send a one-time password.", "আপনার রবি নম্বর দিন — আমরা OTP পাঠাবো")}</div>
      <div className="rounded-2xl p-5 shadow-sm" style={{ background: "#FFF", border: `1px solid ${PALETTE.gold}66` }}>
        <label className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: PALETTE.goldDark }}>{tt("Mobile number", "মোবাইল নম্বর")}</label>
        <div className="mt-2 flex items-stretch rounded-lg overflow-hidden border" style={{ borderColor: `${PALETTE.deep}33` }}>
          <span className="px-3 inline-flex items-center text-xs font-bold" style={{ background: PALETTE.paper, color: PALETTE.deep }}>+88</span>
          <input data-testid="matri-otp-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-1 px-3 py-2.5 text-sm outline-none" />
        </div>
        <div className="mt-3 flex items-center gap-2 text-[11px]" style={{ color: PALETTE.mute }}>
          <input type="checkbox" defaultChecked /> {tt("I agree to BondoBD's Terms & Family Code of Conduct", "BondoBD-এর শর্তাবলী মেনে নিচ্ছি")}
        </div>
        <div className="mt-4 flex gap-2">
          <GhostBtn full tid="matri-otp-back" onClick={() => setStage("landing")}>← {tt("Back", "ফিরে")}</GhostBtn>
          <PrimaryBtn full tid="matri-otp-send" onClick={() => { if (onPhoneSubmit) onPhoneSubmit(phone); setStage("otp-code"); }}>{tt("Send OTP", "OTP পাঠান")}</PrimaryBtn>
        </div>
      </div>
      <div className="text-center text-[11px] mt-3" style={{ color: PALETTE.mute }}>{tt("🔒 Charged via Robi CaaS — Tk 0.50 SMS only", "🔒 রবি CaaS দিয়ে — মাত্র ০.৫০ টাকা SMS")}</div>
    </div>
  );

  const OtpCodeView = (
    <div className="px-6 py-8 max-w-md mx-auto" style={{ background: PALETTE.ivory, fontFamily: SANS }}>
      <h2 className="text-2xl font-bold text-center" style={{ fontFamily: SERIF, color: PALETTE.ink }}>{tt("Enter the 4-digit code", "৪-অঙ্কের কোড দিন")}</h2>
      <DividerOrnament />
      <div className="text-center text-xs mb-4" style={{ color: PALETTE.mute }}>{tt(`Sent to +88 ${phone}`, `পাঠানো হয়েছে +88 ${phone}`)} · <button onClick={() => setStage("otp-phone")} className="underline" style={{ color: PALETTE.deep }}>{tt("change", "পরিবর্তন")}</button></div>
      <div className="rounded-2xl p-5 shadow-sm" style={{ background: "#FFF", border: `1px solid ${PALETTE.gold}66` }}>
        <div className="grid grid-cols-4 gap-2">
          {otp.map((d, i) => (
            <input key={i} data-testid={`matri-otp-d${i}`} value={d} onChange={(e) => setOtpAt(i, e.target.value)} maxLength={1} className="aspect-square text-center text-xl font-bold rounded-lg border outline-none" style={{ borderColor: `${PALETTE.deep}55`, color: PALETTE.ink, background: "#FFFEF7" }} />
          ))}
        </div>
        <div className="mt-2 text-[10px] text-center" style={{ color: PALETTE.goldDark }}>{tt("Demo OTP — type any 4 digits or click Verify", "ডেমো — যেকোনো ৪ অঙ্ক বা Verify চাপুন")}</div>
        <div className="mt-4 flex gap-2">
          <GhostBtn full tid="matri-otp-resend" onClick={() => fireToast(tt("📨 OTP resent via Robi SMS", "📨 OTP আবার পাঠানো হয়েছে"))}>{tt("Resend OTP", "আবার পাঠান")}</GhostBtn>
          <PrimaryBtn full tid="matri-otp-verify" onClick={() => { if (onOtpVerify) onOtpVerify(otp.join("") || "1234"); fireToast(tt("✓ Verified — welcome to BondoBD", "✓ যাচাই সম্পন্ন")); setStage("browse"); }}>{tt("Verify & Continue", "যাচাই করুন")}</PrimaryBtn>
        </div>
      </div>
    </div>
  );

  const BrowseView = (
    <div className="px-5 py-4" style={{ background: PALETTE.ivory, fontFamily: SANS }}>
      <div className="flex items-end justify-between flex-wrap gap-2 mb-3">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: SERIF, color: PALETTE.ink }}>{tt("Recommended for You", "আপনার জন্য প্রস্তাবিত")}</h2>
          <div className="text-[11px]" style={{ color: PALETTE.mute }}>{filteredProfiles.length} {tt("of", "এর মধ্যে")} {profiles.length} {tt("verified profiles", "যাচাইকৃত প্রোফাইল")} {activeFilterCount > 0 && <button onClick={resetFilters} data-testid="matri-filter-reset" className="ml-2 underline" style={{ color: PALETTE.deep }}>{tt(`Reset (${activeFilterCount})`, `রিসেট (${activeFilterCount})`)}</button>}</div>
        </div>
        <div className="flex items-center gap-1.5">
          <label className="text-[10px] uppercase tracking-widest font-bold" style={{ color: PALETTE.goldDark }}>{tt("Sort", "সাজান")}</label>
          <select data-testid="matri-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-[11px] px-2 py-1 rounded-lg outline-none" style={{ background: "#FFF", border: `1px solid ${PALETTE.deep}33`, color: PALETTE.ink }}>
            <option value="recommended">{tt("Recommended", "প্রস্তাবিত")}</option>
            <option value="age-asc">{tt("Age: Low → High", "বয়স: কম → বেশি")}</option>
            <option value="age-desc">{tt("Age: High → Low", "বয়স: বেশি → কম")}</option>
            <option value="name">{tt("Name (A-Z)", "নাম (A-Z)")}</option>
          </select>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl p-3 mb-4 grid grid-cols-2 md:grid-cols-5 gap-2" style={{ background: "#FFF", border: `1px solid ${PALETTE.gold}55` }}>
        <FilterSelect testid="matri-filter-gender" label={tt("Gender", "লিঙ্গ")} value={genderFilter} onChange={setGenderFilter} options={[
          { v: "All", l: tt("All", "সকল") },
          { v: "Female", l: tt("Female", "মেয়ে") },
          { v: "Male", l: tt("Male", "ছেলে") },
        ]} />
        <FilterSelect testid="matri-filter-age" label={tt("Age", "বয়স")} value={ageRange} onChange={setAgeRange} options={[
          { v: "All", l: tt("All", "সকল") },
          { v: "20-25", l: "20-25" },
          { v: "25-30", l: "25-30" },
          { v: "30-35", l: "30-35" },
          { v: "35+", l: "35+" },
        ]} />
        <FilterSelect testid="matri-filter-religion" label={tt("Religion", "ধর্ম")} value={religionFilter} onChange={setReligionFilter} options={[{ v: "All", l: tt("All", "সকল") }, ...religions.map((r) => ({ v: r, l: r }))]} />
        <FilterSelect testid="matri-filter-district" label={tt("District", "জেলা")} value={districtFilter} onChange={setDistrictFilter} options={[{ v: "All", l: tt("All", "সকল") }, ...districts.map((d) => ({ v: d, l: d }))]} />
        <div className="flex items-end">
          <PrimaryBtn full tid="matri-filter-apply" onClick={() => fireToast(tt(`Showing ${filteredProfiles.length} matches`, `${filteredProfiles.length}টি ম্যাচ`))}>
            🔍 {tt("Apply Filters", "ফিল্টার প্রয়োগ")}
          </PrimaryBtn>
        </div>
      </div>

      {filteredProfiles.length === 0 ? (
        <div className="rounded-3xl text-center py-10 px-4" style={{ background: "#FFF", border: `1px dashed ${PALETTE.gold}66` }}>
          <div className="text-3xl">🔎</div>
          <div className="text-sm font-bold mt-1" style={{ fontFamily: SERIF, color: PALETTE.ink }}>{tt("No profiles match your filters", "কোনো প্রোফাইল মেলেনি")}</div>
          <div className="text-[11px] mt-1" style={{ color: PALETTE.mute }}>{tt("Try relaxing the age range or district.", "বয়সের পরিসর বা জেলা পরিবর্তন করুন।")}</div>
          <div className="mt-3"><GhostBtn tid="matri-filter-reset-empty" onClick={resetFilters}>{tt("Reset filters", "ফিল্টার রিসেট")}</GhostBtn></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProfiles.map((p) => {
            const pct = compatPct(p);
            const online = (p.id || p.name || "").length % 2 === 0;
            const fav = !!favs[p.id];
            return (
              <div
                key={p.id}
                data-testid={`matri-card-${p.id}`}
                className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ border: `1px solid ${PALETTE.gold}33`, boxShadow: "0 1px 2px rgba(126,23,51,0.04), 0 4px 12px rgba(126,23,51,0.04)" }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 8px 28px ${PALETTE.deep}22, 0 2px 6px ${PALETTE.deep}14`}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 1px 2px rgba(126,23,51,0.04), 0 4px 12px rgba(126,23,51,0.04)"}
              >
                {/* Photo */}
                <div className="relative aspect-square overflow-hidden">
                  <MatriAvatar profile={p} shape="fill" size={180} />
                  {/* Gradient overlay for legibility */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: `linear-gradient(to top, ${PALETTE.deep}ee 0%, ${PALETTE.deep}66 40%, transparent 100%)` }} />
                  {/* Top-left badge stack */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                    <span className="inline-flex items-center gap-1 text-[8.5px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full backdrop-blur" style={{ background: "rgba(255,255,255,0.92)", color: PALETTE.deep }}>✓ {tt("Verified", "যাচাই")}</span>
                    {online && (
                      <span className="inline-flex items-center gap-1 text-[8.5px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full backdrop-blur" style={{ background: "rgba(16,185,129,0.95)", color: "#FFF" }}>
                        <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                        {tt("Online", "অনলাইন")}
                      </span>
                    )}
                  </div>
                  {/* Favourite */}
                  <button onClick={() => toggleFav(p.id)} data-testid={`matri-fav-${p.id}`} aria-label="favourite" className="absolute top-2 right-2 w-7 h-7 rounded-full grid place-items-center transition-all backdrop-blur" style={{ background: fav ? "rgba(194,24,91,0.95)" : "rgba(255,255,255,0.92)", border: `1px solid ${fav ? "#FFF" : PALETTE.deep + "22"}` }}>
                    <Heart filled={fav} size={13} color={fav ? "#FFF" : PALETTE.deep} />
                  </button>
                  {/* Compatibility chip top-right (under fav) */}
                  <div className="absolute top-10 right-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9.5px] font-bold text-white shadow-sm" style={{ background: `linear-gradient(135deg, ${PALETTE.deep}, ${PALETTE.rose})` }}>
                    ✨ {pct}%
                  </div>
                  {/* Name overlay on photo bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 text-white">
                    <div className="flex items-end justify-between gap-1">
                      <h3 className="font-bold text-[14px] leading-tight truncate drop-shadow" style={{ fontFamily: SERIF }}>{p.name}, {p.age}</h3>
                    </div>
                    <div className="text-[10px] truncate opacity-95 mt-0.5">📍 {p.district} · {p.height || "—"}</div>
                  </div>
                </div>

                {/* Info */}
                <div className="px-3 pt-2 pb-2.5">
                  <div className="space-y-0.5 text-[10.5px]" style={{ color: PALETTE.ink }}>
                    <div className="flex items-center gap-1.5 min-w-0"><span className="opacity-70">🎓</span><span className="truncate">{p.education || "—"}</span></div>
                    <div className="flex items-center gap-1.5 min-w-0"><span className="opacity-70">💼</span><span className="truncate">{p.profession || "—"}</span></div>
                    <div className="flex items-center gap-1.5 min-w-0"><span className="opacity-70">💍</span><span className="truncate" style={{ color: PALETTE.mute }}>{p.religion} · {p.maritalStatus?.replace("Never Married", tt("Single", "অবিবাহিত")) || "—"}</span></div>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <button data-testid={`matri-view-${p.id}`} onClick={() => { setOpenId(p.id); setStage("detail"); }} className="flex-1 text-[10.5px] font-bold py-1.5 rounded-full transition" style={{ color: PALETTE.deep, border: `1px solid ${PALETTE.deep}33`, background: "#FFF" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = PALETTE.paper}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#FFF"}>
                      {tt("View", "দেখুন")}
                    </button>
                    <button data-testid={`matri-interest-${p.id}`} onClick={() => sendInterest(p.id)} className="flex-1 text-[10.5px] font-bold py-1.5 rounded-full text-white transition shadow-sm" style={{ background: interests[p.id] ? PALETTE.goldDark : `linear-gradient(135deg, ${PALETTE.deep}, ${PALETTE.rose})` }}>
                      {interests[p.id] ? `✓ ${tt("Sent", "পাঠানো")}` : `💌 ${tt("Interest", "আগ্রহ")}`}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const DetailView = openProfile && (
    <div className="px-5 py-4" style={{ background: PALETTE.ivory, fontFamily: SANS }}>
      <button onClick={() => setStage("browse")} className="text-[11px] underline mb-2" style={{ color: PALETTE.deep }}>← {tt("Back to results", "ফলাফলে ফিরুন")}</button>
      <div className="rounded-2xl overflow-hidden bg-white" style={{ border: `1px solid ${PALETTE.gold}55` }}>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-[4/5] md:aspect-auto grid place-items-center min-h-[260px]" style={{ background: `linear-gradient(160deg, #FFF8E1 0%, #FAF1DF 100%)` }}>
            <MatriAvatar profile={openProfile} size={220} />
            <div className="absolute top-3 left-3"><Pill bg="rgba(255,255,255,0.95)" color={PALETTE.deep}>✓ {tt("Family Verified", "পরিবার যাচাইকৃত")}</Pill></div>
            <button onClick={() => toggleFav(openProfile.id)} data-testid={`matri-fav-detail`} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white grid place-items-center shadow border" style={{ borderColor: `${PALETTE.deep}33` }}>
              <Heart filled={!!favs[openProfile.id]} size={18} />
            </button>
          </div>
          <div className="p-5">
            <div className="text-2xl font-bold leading-tight" style={{ fontFamily: SERIF, color: PALETTE.ink }}>{openProfile.name}, {openProfile.age}</div>
            <div className="text-xs mt-0.5" style={{ color: PALETTE.mute }}>{openProfile.profession} · {openProfile.district}</div>
            <DividerOrnament />
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <Field label={tt("Education", "শিক্ষা")} value={openProfile.education} />
              <Field label={tt("Height", "উচ্চতা")} value={openProfile.height} />
              <Field label={tt("Religion", "ধর্ম")} value={openProfile.religion} />
              <Field label={tt("Marital Status", "বৈবাহিক")} value={openProfile.maritalStatus} />
            </div>
            <div className="mt-3">
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: PALETTE.goldDark }}>{tt("About", "পরিচয়")}</div>
              <p className="text-[12px] mt-0.5" style={{ color: PALETTE.ink }}>{openProfile.about}</p>
            </div>
            <div className="mt-2">
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: PALETTE.goldDark }}>{tt("Family", "পরিবার")}</div>
              <p className="text-[12px] mt-0.5" style={{ color: PALETTE.ink }}>{openProfile.family || "—"}</p>
            </div>

            {/* Locked contact */}
            <div className="mt-3 rounded-xl p-3" style={{ background: PALETTE.paper, border: `1px dashed ${PALETTE.deep}66` }}>
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: PALETTE.deep }}>{tt("Contact Locked", "যোগাযোগ লকড")}</div>
              <div className="text-[11px] blur-sm select-none">📞 +880 17XX-XXXXXX · 💬 WhatsApp</div>
              <button onClick={() => setStage("plans")} data-testid="matri-unlock-cta" className="mt-2 text-[11px] font-bold underline" style={{ color: PALETTE.deep }}>🔒 {tt("Subscribe BDT 49 to unlock", "৪৯ টাকায় আনলক")}</button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <GhostBtn  tid="matri-detail-fav"      onClick={() => toggleFav(openProfile.id)}>{favs[openProfile.id] ? `💛 ${tt("Saved", "সংরক্ষিত")}` : `🤍 ${tt("Add to favourites", "ফেভারিট করুন")}`}</GhostBtn>
              <GhostBtn  tid="matri-detail-interest" onClick={() => sendInterest(openProfile.id)}>💌 {interests[openProfile.id] ? tt("Interest sent ✓", "আগ্রহ পাঠানো ✓") : tt("Send interest", "আগ্রহ পাঠান")}</GhostBtn>
              <PrimaryBtn tid="matri-detail-chat"     onClick={() => startChat(openProfile.id)}>💬 {tt("Start chat", "চ্যাট শুরু")}</PrimaryBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ChatView = openProfile && (
    <div className="flex flex-col h-full" style={{ background: PALETTE.ivory, fontFamily: SANS }}>
      <div className="flex items-center gap-3 px-4 py-2.5" style={{ background: "#FFF", borderBottom: `1px solid ${PALETTE.gold}55` }}>
        <button onClick={() => setStage("detail")} className="text-sm" style={{ color: PALETTE.deep }}>←</button>
        <div className="w-9 h-9"><MatriAvatar profile={openProfile} size={36} /></div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold truncate" style={{ fontFamily: SERIF, color: PALETTE.ink }}>{openProfile.name}</div>
          <div className="text-[10px]" style={{ color: PALETTE.goldDark }}>● {tt("Online · Verified", "অনলাইন · যাচাই")}</div>
        </div>
        <button onClick={() => fireToast(tt("📞 Voice call requires Premium Plan", "📞 ভয়েস কল প্রিমিয়াম প্রয়োজন"))} className="text-xs" style={{ color: PALETTE.deep }}>📞</button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        <div className="text-center text-[10px] py-1" style={{ color: PALETTE.mute }}>{tt("Today", "আজ")}</div>
        {chatMessages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[78%] px-3 py-1.5 rounded-2xl text-[12px] ${m.from === "me" ? "text-white" : ""}`} style={m.from === "me" ? { background: `linear-gradient(135deg, ${PALETTE.deep}, ${PALETTE.rose})`, borderBottomRightRadius: 4 } : { background: "#FFF", color: PALETTE.ink, border: `1px solid ${PALETTE.gold}55`, borderBottomLeftRadius: 4 }}>
              {m.text}
              <div className={`text-[9px] mt-0.5 ${m.from === "me" ? "text-white/80" : ""}`} style={m.from === "me" ? {} : { color: PALETTE.mute }}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-3 py-2 flex items-center gap-2" style={{ background: "#FFF", borderTop: `1px solid ${PALETTE.gold}55` }}>
        <input data-testid="matri-chat-input" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder={tt("Type a message…", "মেসেজ লিখুন…")} className="flex-1 px-3 py-1.5 text-xs rounded-full outline-none border" style={{ borderColor: `${PALETTE.deep}33`, background: PALETTE.paper }} />
        <PrimaryBtn tid="matri-chat-send" onClick={sendMessage}>{tt("Send", "পাঠান")}</PrimaryBtn>
      </div>
    </div>
  );

  const FavView = (
    <div className="px-5 py-4" style={{ background: PALETTE.ivory, fontFamily: SANS }}>
      <h2 className="text-xl font-bold" style={{ fontFamily: SERIF, color: PALETTE.ink }}>💛 {tt("Your Favourites", "আপনার ফেভারিট")}</h2>
      <div className="text-[11px] mb-3" style={{ color: PALETTE.mute }}>{Object.values(favs).filter(Boolean).length} {tt("saved profiles", "সংরক্ষিত প্রোফাইল")}</div>
      {profiles.filter((p) => favs[p.id]).length === 0 ? (
        <div className="rounded-xl text-center py-10 px-4" style={{ background: "#FFF", border: `1px dashed ${PALETTE.gold}66` }}>
          <div className="text-3xl">🤍</div>
          <div className="text-sm font-bold mt-1" style={{ fontFamily: SERIF, color: PALETTE.ink }}>{tt("No favourites yet", "এখনো ফেভারিট নেই")}</div>
          <div className="text-[11px] mt-1" style={{ color: PALETTE.mute }}>{tt("Tap the heart on any profile to save it here.", "যেকোনো প্রোফাইলের ❤ আইকন চাপুন")}</div>
          <div className="mt-3"><PrimaryBtn tid="matri-fav-browse" onClick={() => setStage("browse")}>{tt("Browse profiles", "প্রোফাইল দেখুন")}</PrimaryBtn></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {profiles.filter((p) => favs[p.id]).map((p) => (
            <div key={p.id} className="rounded-xl bg-white p-3 flex items-center gap-3" style={{ border: `1px solid ${PALETTE.gold}55` }}>
              <div className="flex-shrink-0"><MatriAvatar profile={p} size={56} /></div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold truncate" style={{ fontFamily: SERIF, color: PALETTE.ink }}>{p.name}, {p.age}</div>
                <div className="text-[11px] truncate" style={{ color: PALETTE.mute }}>{p.profession} · {p.district}</div>
                <div className="mt-1 flex gap-1.5">
                  <GhostBtn tid={`matri-fav-view-${p.id}`} onClick={() => { setOpenId(p.id); setStage("detail"); }}>{tt("View", "দেখুন")}</GhostBtn>
                  <PrimaryBtn tid={`matri-fav-chat-${p.id}`} onClick={() => startChat(p.id)}>{tt("Chat", "চ্যাট")}</PrimaryBtn>
                </div>
              </div>
              <button onClick={() => toggleFav(p.id)} className="text-rose-600"><Heart filled size={18} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const PlansView = (
    <div className="px-5 py-5" style={{ background: PALETTE.ivory, fontFamily: SANS }}>
      <h2 className="text-2xl font-bold text-center" style={{ fontFamily: SERIF, color: PALETTE.ink }}>{tt("Choose Your Premium Plan", "প্রিমিয়াম প্ল্যান")}</h2>
      <DividerOrnament />
      <div className="text-center text-[11px] mb-4" style={{ color: PALETTE.mute }}>{tt("Secured by Robi CaaS · Cancel anytime via SMS", "Robi CaaS দিয়ে · যেকোনো সময় বাতিল")}</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
        {plans.map((p) => (
          <div key={p.id} className="relative rounded-2xl p-4 bg-white" style={{ border: `${p.badge ? 2 : 1}px solid ${p.badge ? PALETTE.deep : PALETTE.gold + "55"}`, boxShadow: p.badge ? `0 8px 24px ${PALETTE.deep}22` : "none" }}>
            {p.badge && <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full text-white" style={{ background: PALETTE.deep }}>{p.badge}</div>}
            <div className="text-sm font-bold" style={{ fontFamily: SERIF, color: PALETTE.ink }}>{p.name}</div>
            <div className="mt-1"><span className="text-3xl font-bold" style={{ color: PALETTE.deep, fontFamily: SERIF }}>৳{p.price}</span><span className="text-[11px] ml-1" style={{ color: PALETTE.mute }}>/ {p.period}</span></div>
            <ul className="mt-2 space-y-1 text-[11px]" style={{ color: PALETTE.ink }}>
              {(p.features || []).map((f, i) => <li key={i} className="flex gap-1.5"><span style={{ color: PALETTE.goldDark }}>✓</span> {f}</li>)}
            </ul>
            <div className="mt-3">
              <PrimaryBtn full tid={`matri-plan-${p.id}`} onClick={() => { if (onSubscribe) onSubscribe(p); fireToast(p.price === 0 ? tt("✓ Free plan active", "✓ ফ্রি প্ল্যান চালু") : tt(`✓ Charged BDT ${p.price} via CaaS`, `✓ CaaS দিয়ে ${p.price} টাকা কাটা হয়েছে`)); setStage("browse"); }}>
                {p.price === 0 ? tt("Continue Free", "ফ্রি চালিয়ে যান") : tt("Subscribe via CaaS", "CaaS দিয়ে সাবস্ক্রাইব")}
              </PrimaryBtn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ background: PALETTE.ivory, fontFamily: SANS, color: PALETTE.ink }}>
      {!chromeless && TopBar}
      <div className="flex-1 overflow-y-auto">
        {stage === "landing"   && LandingView}
        {stage === "otp-phone" && OtpPhoneView}
        {stage === "otp-code"  && OtpCodeView}
        {stage === "browse"    && BrowseView}
        {stage === "detail"    && DetailView}
        {stage === "chat"      && ChatView}
        {stage === "favorites" && FavView}
        {stage === "plans"     && PlansView}
      </div>

      {/* Toast */}
      {toast && (
        <div data-testid="matri-toast" className="absolute left-1/2 -translate-x-1/2 bottom-3 px-3 py-1.5 rounded-full text-[11px] shadow-lg" style={{ background: PALETTE.ink, color: "#FFF8E1", border: `1px solid ${PALETTE.gold}` }}>{toast}</div>
      )}
    </div>
  );
};

const Field = ({ label, value }) => (
  <div className="rounded p-1.5" style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.gold}33` }}>
    <div className="text-[9px] uppercase tracking-widest" style={{ color: PALETTE.goldDark }}>{label}</div>
    <div className="font-semibold truncate" style={{ color: PALETTE.ink }}>{value || "—"}</div>
  </div>
);

const InfoRow = ({ icon, value, mute, ink }) => (
  <div className="flex items-center gap-1 min-w-0">
    <span className="text-[11px]" aria-hidden>{icon}</span>
    <span className="truncate" style={{ color: ink }} title={value || ""}>{value || "—"}</span>
  </div>
);

const FilterSelect = ({ label, value, onChange, options, testid }) => (
  <div>
    <label className="text-[10px] uppercase tracking-widest font-bold block mb-0.5" style={{ color: PALETTE.goldDark }}>{label}</label>
    <div className="relative">
      <select data-testid={testid} value={value} onChange={(e) => onChange(e.target.value)} className="w-full appearance-none text-xs px-2.5 py-1.5 rounded-lg outline-none" style={{ background: PALETTE.paper, color: PALETTE.ink, border: `1px solid ${PALETTE.deep}33` }}>
        {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] pointer-events-none" style={{ color: PALETTE.goldDark }}>▼</span>
    </div>
  </div>
);

const Select = ({ label, options }) => (
  <div>
    <label className="text-[10px] uppercase tracking-widest font-bold" style={{ color: PALETTE.goldDark }}>{label}</label>
    <div className="mt-0.5 relative">
      <select className="w-full appearance-none text-xs px-2.5 py-1.5 rounded-lg outline-none" style={{ background: PALETTE.paper, color: PALETTE.ink, border: `1px solid ${PALETTE.deep}33` }}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px]" style={{ color: PALETTE.goldDark }}>▼</span>
    </div>
  </div>
);

/* ============== ANDROID SCREENS ========================================= */
/* Returns an array of 6 screens for AndroidEmulator: Splash → OTP Phone →
   OTP Code → Browse → Profile + Send Interest → Chat                       */

const Btn = ({ children, onClick, tid, ghost, full = true, color = PALETTE.deep }) => (
  <button data-testid={tid} onClick={onClick} className={`${full ? "w-full" : ""} text-xs font-bold py-2.5 rounded-full`} style={ghost ? { color, border: `1px solid ${color}55`, background: "#FFF" } : { color: "#FFF", background: `linear-gradient(135deg, ${PALETTE.deep}, ${PALETTE.rose})` }}>
    {children}
  </button>
);

const useAutoNext = (ctx, ms) => {
  useEffect(() => { const t = setTimeout(() => ctx.next(), ms); return () => clearTimeout(t); }, [ctx, ms]);
};

const SplashScreen = ({ ctx, lang }) => {
  useAutoNext(ctx, 1800);
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-5 relative overflow-hidden" style={{ background: `linear-gradient(160deg, ${PALETTE.deep} 0%, ${PALETTE.rose} 100%)`, color: "#FFF8E1" }}>
      <div className="absolute top-0 left-0"><FloralCorner color={PALETTE.gold} /></div>
      <div className="absolute top-0 right-0"><FloralCorner flip color={PALETTE.gold} /></div>
      <div className="w-20 h-20 rounded-full grid place-items-center" style={{ background: "rgba(255,251,225,0.15)", border: `1px solid ${PALETTE.gold}88` }}>
        <svg viewBox="0 0 24 24" width="36" height="36"><path d="M12 21s-7-4.5-9.5-9.2C.9 8.3 2.6 4.7 6.2 4.7c2 0 3.4 1 4 2.2.6-1.2 2-2.2 4-2.2 3.6 0 5.3 3.6 3.7 7.1C19 16.5 12 21 12 21Z" fill={PALETTE.gold} /></svg>
      </div>
      <div className="text-xl font-bold mt-3" style={{ fontFamily: SERIF }}>{ctx.appName}</div>
      <div className="text-[10px] opacity-90 tracking-widest uppercase mt-1">{T(lang, "Verified Matrimony · Bangladesh", "যাচাইকৃত ম্যাট্রিমনি")}</div>
      <div className="absolute bottom-4 left-0 right-0 text-center text-[10px] opacity-80">{T(lang, "Loading…", "লোড হচ্ছে…")}</div>
      <div className="absolute bottom-0 left-0"><FloralCorner color={PALETTE.gold} /></div>
      <div className="absolute bottom-0 right-0"><FloralCorner flip color={PALETTE.gold} /></div>
    </div>
  );
};

const OtpPhoneScreen = ({ ctx, lang }) => (
  <div className="h-full px-5 py-5 flex flex-col" style={{ background: PALETTE.ivory, fontFamily: SANS }}>
    <div className="text-xs uppercase tracking-[0.2em] font-bold" style={{ color: PALETTE.goldDark }}>{T(lang, "Verify Phone", "ফোন যাচাই")}</div>
    <div className="text-lg font-bold mt-1" style={{ fontFamily: SERIF, color: PALETTE.ink }}>{T(lang, "Welcome to BondoBD", "BondoBD-তে স্বাগতম")}</div>
    <div className="text-[11px] mt-1" style={{ color: PALETTE.mute }}>{T(lang, "Enter your Robi number — we'll send an OTP", "আপনার রবি নম্বর দিন")}</div>
    <div className="mt-3 flex items-stretch border rounded-lg overflow-hidden" style={{ borderColor: `${PALETTE.deep}44` }}>
      <span className="px-2.5 inline-flex items-center text-[11px] font-bold" style={{ background: PALETTE.paper, color: PALETTE.deep }}>+88</span>
      <input defaultValue="01711-234567" className="flex-1 p-2.5 text-xs outline-none" />
    </div>
    <div className="mt-3 flex items-center gap-2 text-[10px]" style={{ color: PALETTE.mute }}>
      <input type="checkbox" defaultChecked /> {T(lang, "I agree to Terms & Family Code", "শর্তাবলী মেনে নিচ্ছি")}
    </div>
    <div className="mt-auto"><Btn tid="emu-matri-send-otp" onClick={ctx.next}>{T(lang, "Send OTP", "OTP পাঠান")}</Btn></div>
  </div>
);

const OtpCodeScreen = ({ ctx, lang }) => (
  <div className="h-full px-5 py-5 flex flex-col" style={{ background: PALETTE.ivory, fontFamily: SANS }}>
    <div className="text-xs uppercase tracking-[0.2em] font-bold" style={{ color: PALETTE.goldDark }}>{T(lang, "OTP Verification", "OTP যাচাই")}</div>
    <div className="text-lg font-bold mt-1" style={{ fontFamily: SERIF, color: PALETTE.ink }}>{T(lang, "Enter the 4-digit code", "৪ অঙ্কের কোড")}</div>
    <div className="text-[11px] mt-1" style={{ color: PALETTE.mute }}>{T(lang, "Sent to +88 01711-234567", "+88 01711-234567 এ পাঠানো হয়েছে")}</div>
    <div className="mt-4 grid grid-cols-4 gap-2">
      {[1, 2, 3, 4].map((d) => <div key={d} className="aspect-square rounded-lg border text-center grid place-items-center text-base font-bold" style={{ borderColor: `${PALETTE.deep}55`, background: "#FFFEF7", color: PALETTE.ink }}>{d}</div>)}
    </div>
    <div className="text-[10px] text-center mt-1" style={{ color: PALETTE.goldDark }}>{T(lang, "Demo OTP: 1234", "ডেমো OTP: 1234")}</div>
    <div className="mt-auto"><Btn tid="emu-matri-verify" onClick={ctx.next}>{T(lang, "Verify & Continue", "যাচাই করুন")}</Btn></div>
  </div>
);

const BrowseScreen = ({ ctx, lang }) => (
  <div className="h-full flex flex-col" style={{ background: PALETTE.ivory }}>
    <div className="px-3 py-2 flex items-center justify-between" style={{ background: `linear-gradient(90deg, ${PALETTE.deep}, ${PALETTE.rose})`, color: "#FFF8E1" }}>
      <div className="text-xs font-bold" style={{ fontFamily: SERIF }}>{ctx.appName}</div>
      <div className="text-[10px]">★ 4.9</div>
    </div>
    <div className="p-2 grid grid-cols-2 gap-2 overflow-y-auto flex-1">
      {FALLBACK_PROFILES.slice(0, 4).map((p) => (
        <button key={p.id} onClick={ctx.next} data-testid={`emu-matri-card-${p.id}`} className="text-left bg-white rounded-xl overflow-hidden" style={{ border: `1px solid ${PALETTE.gold}55` }}>
          <div className="aspect-[4/5] grid place-items-center" style={{ background: "linear-gradient(160deg, #FFF8E1, #FAF1DF)" }}>
            <MatriAvatar profile={p} size={84} />
          </div>
          <div className="p-1.5">
            <div className="text-[10px] font-bold truncate" style={{ fontFamily: SERIF, color: PALETTE.ink }}>{p.name.split(" ")[0]}, {p.age}</div>
            <div className="text-[9px] truncate" style={{ color: PALETTE.mute }}>{p.profession}</div>
            <div className="text-[9px] truncate" style={{ color: PALETTE.goldDark }}>{p.district}</div>
          </div>
        </button>
      ))}
    </div>
  </div>
);

const ProfileScreen = ({ ctx, lang }) => {
  const p = FALLBACK_PROFILES[0];
  const [fav, setFav] = useState(false);
  const [interest, setInterest] = useState(false);
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="relative h-40 grid place-items-center" style={{ background: "linear-gradient(160deg, #FFF8E1, #FAF1DF)" }}>
        <MatriAvatar profile={p} size={120} />
        <button onClick={() => setFav((f) => !f)} data-testid="emu-matri-fav" className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white grid place-items-center shadow" style={{ border: `1px solid ${PALETTE.deep}33` }}>
          <Heart filled={fav} size={15} />
        </button>
      </div>
      <div className="p-3 flex-1 overflow-y-auto">
        <div className="text-sm font-bold" style={{ fontFamily: SERIF, color: PALETTE.ink }}>{p.name}, {p.age}</div>
        <div className="text-[10px]" style={{ color: PALETTE.mute }}>{p.profession} · {p.district}</div>
        <DividerOrnament />
        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
          <Field label={T(lang, "Education", "শিক্ষা")} value={p.education} />
          <Field label={T(lang, "Height", "উচ্চতা")} value={p.height} />
        </div>
        <div className="text-[10px] mt-2" style={{ color: PALETTE.ink }}>{p.about}</div>
        <div className="mt-2 rounded-lg p-2 text-[10px]" style={{ background: PALETTE.paper, border: `1px dashed ${PALETTE.deep}66` }}>
          <div className="font-bold" style={{ color: PALETTE.deep }}>🔒 {T(lang, "Contact Locked", "যোগাযোগ লকড")}</div>
          <div className="blur-sm select-none">+880 17XX-XXXXXX</div>
        </div>
      </div>
      <div className="p-3 flex gap-2" style={{ borderTop: `1px solid ${PALETTE.gold}55`, background: "#FFF" }}>
        <Btn tid="emu-matri-interest" ghost onClick={() => setInterest(true)}>{interest ? "💌 Sent ✓" : `💌 ${T(lang, "Interest", "আগ্রহ")}`}</Btn>
        <Btn tid="emu-matri-chat" onClick={ctx.next}>💬 {T(lang, "Chat", "চ্যাট")}</Btn>
      </div>
    </div>
  );
};

const ChatScreen = ({ ctx, lang }) => {
  const p = FALLBACK_PROFILES[0];
  const [msgs, setMsgs] = useState([
    { from: "them", text: T(lang, "Assalamu Alaikum 🌸", "আসসালামু আলাইকুম 🌸") },
    { from: "them", text: T(lang, "Tell me about your family?", "পরিবার সম্পর্কে বলবেন?") },
  ]);
  const [val, setVal] = useState("");
  const send = () => {
    if (!val.trim()) return;
    setMsgs((m) => [...m, { from: "me", text: val.trim() }]);
    setVal("");
    setTimeout(() => setMsgs((m) => [...m, { from: "them", text: T(lang, "Thank you 🌸", "ধন্যবাদ 🌸") }]), 700);
  };
  return (
    <div className="h-full flex flex-col" style={{ background: PALETTE.ivory }}>
      <div className="flex items-center gap-2 px-3 py-2" style={{ background: "#FFF", borderBottom: `1px solid ${PALETTE.gold}55` }}>
        <button onClick={() => ctx.goto(0)} className="text-sm" style={{ color: PALETTE.deep }}>←</button>
        <div className="w-8 h-8"><MatriAvatar profile={p} size={32} /></div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold truncate" style={{ fontFamily: SERIF, color: PALETTE.ink }}>{p.name}</div>
          <div className="text-[9px]" style={{ color: PALETTE.goldDark }}>● {T(lang, "Online · Verified", "অনলাইন")}</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[78%] px-2.5 py-1 rounded-2xl text-[10px]" style={m.from === "me" ? { background: `linear-gradient(135deg, ${PALETTE.deep}, ${PALETTE.rose})`, color: "#FFF", borderBottomRightRadius: 4 } : { background: "#FFF", color: PALETTE.ink, border: `1px solid ${PALETTE.gold}55`, borderBottomLeftRadius: 4 }}>{m.text}</div>
          </div>
        ))}
      </div>
      <div className="p-2 flex items-center gap-1.5" style={{ background: "#FFF", borderTop: `1px solid ${PALETTE.gold}55` }}>
        <input data-testid="emu-matri-chat-input" value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder={T(lang, "Message…", "মেসেজ…")} className="flex-1 px-2.5 py-1.5 text-[10px] rounded-full outline-none border" style={{ borderColor: `${PALETTE.deep}33`, background: PALETTE.paper }} />
        <button data-testid="emu-matri-chat-send" onClick={send} className="text-[10px] font-bold px-3 py-1.5 rounded-full text-white" style={{ background: PALETTE.deep }}>{T(lang, "Send", "পাঠান")}</button>
      </div>
    </div>
  );
};

export const matrimonyAndroidScreens = (lang) => ([
  { id: "splash",   label: T(lang, "Splash",  "স্প্ল্যাশ"),  render: (ctx) => <SplashScreen   ctx={ctx} lang={lang} /> },
  { id: "otp",      label: T(lang, "OTP",     "OTP"),       render: (ctx) => <OtpPhoneScreen ctx={ctx} lang={lang} /> },
  { id: "otp-code", label: T(lang, "Verify",  "যাচাই"),     render: (ctx) => <OtpCodeScreen  ctx={ctx} lang={lang} /> },
  { id: "browse",   label: T(lang, "Browse",  "ব্রাউজ"),     render: (ctx) => <BrowseScreen   ctx={ctx} lang={lang} /> },
  { id: "detail",   label: T(lang, "Profile", "প্রোফাইল"),   render: (ctx) => <ProfileScreen  ctx={ctx} lang={lang} /> },
  { id: "chat",     label: T(lang, "Chat",    "চ্যাট"),       render: (ctx) => <ChatScreen     ctx={ctx} lang={lang} /> },
]);

export default MatrimonyWebPreview;
