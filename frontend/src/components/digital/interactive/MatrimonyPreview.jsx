import React, { useState } from "react";

// Mock matrimony profile dataset used both by Web (Universal + Pro) and Android matrimony previews.
const FALLBACK_PROFILES = [
  { id: "p1", name: "Rahima Akter", age: 24, gender: "Female", district: "Dhaka", education: "BSc, BUET", profession: "Software Engineer", height: "5'4\"", about: "Family-oriented engineer who loves reading and travel." },
  { id: "p2", name: "Sadia Rahman", age: 26, gender: "Female", district: "Chittagong", education: "MBBS, DMC", profession: "Doctor", height: "5'3\"", about: "Pediatrician passionate about child welfare." },
  { id: "p3", name: "Nusrat Jahan", age: 23, gender: "Female", district: "Sylhet", education: "MBA, IBA", profession: "Banker", height: "5'5\"", about: "Loves classical music and cooking." },
  { id: "p4", name: "Karim Ahmed", age: 29, gender: "Male", district: "Dhaka", education: "BSc, NSU", profession: "Architect", height: "5'10\"", about: "Designs sustainable homes for Bangladesh." },
  { id: "p5", name: "Tanvir Hossain", age: 31, gender: "Male", district: "Khulna", education: "MSc, RUET", profession: "Civil Engineer", height: "5'11\"", about: "Family man who enjoys cricket and travelling." },
  { id: "p6", name: "Rafiqul Karim", age: 33, gender: "Male", district: "Rajshahi", education: "MBBS, RMC", profession: "Doctor", height: "5'9\"", about: "Practising cardiologist in Rajshahi Medical." },
];

const FALLBACK_PLANS = [
  { id: "pl1", name: "Free", price: 0, period: "lifetime", features: ["Browse profiles", "Blurred contact", "5 daily matches"] },
  { id: "pl2", name: "Premium 7 Days", price: 49, period: "7 days", badge: "Popular", features: ["Unlock 10 contacts", "SMS interest alerts", "Direct WhatsApp"] },
  { id: "pl3", name: "Premium Monthly", price: 199, period: "month", badge: "Best Value", features: ["Unlimited unlock", "Verified badge", "Family invitation"] },
];

const FALLBACK_STORIES = [
  { id: "s1", couple: "Imran & Tahmina", year: "2025", quote: "Met on BondoBD in October, married in December." },
  { id: "s2", couple: "Sabbir & Mehjabin", year: "2024", quote: "Our families connected through SMS interest alerts." },
  { id: "s3", couple: "Rafi & Anika", year: "2024", quote: "Premium contact unlock saved us months of intermediaries." },
];

const Avatar = ({ name, gradient }) => (
  <div className="w-full h-full flex items-center justify-center text-white font-bold" style={{ background: gradient }}>
    {(name || "?").split(" ").map((s) => s[0]).slice(0, 2).join("")}
  </div>
);

const gradFor = (p, primary, accent) => p.gender === "Female"
  ? `linear-gradient(135deg, ${primary}, #f43f5e)`
  : `linear-gradient(135deg, #475569, ${accent || primary})`;

// ============ WEB Matrimony Preview ============
// Used inside browser chrome (Universal Web Preview + Pro Builder Preview)
export const MatrimonyWebPreview = ({ cfg, content }) => {
  const primary = cfg.primary || "#e11d48";
  const accent = cfg.accent || "#be123c";
  const lang = cfg.language || "English";
  const T = (en, bn) => (lang === "Bengali" ? bn : en);
  const profiles = (content?.profiles?.length ? content.profiles : FALLBACK_PROFILES).slice(0, 6);
  const plans = content?.plans?.length ? content.plans : FALLBACK_PLANS;
  const stories = content?.stories?.length ? content.stories : FALLBACK_STORIES;
  const serviceName = content?.storeInfo?.name || cfg.appName || "BondoBD Matrimony";

  const [view, setView] = useState("home"); // home | detail | plans
  const [openProfile, setOpenProfile] = useState(null);
  const [unlocked, setUnlocked] = useState({});

  const openDetail = (p) => { setOpenProfile(p); setView("detail"); };
  const subscribe = () => { if (openProfile) setUnlocked((u) => ({ ...u, [openProfile.id]: true })); setView("detail"); };

  return (
    <div className="h-full bg-white flex flex-col" style={{ fontFamily: cfg.fontFamily || "Inter, sans-serif" }}>
      {/* Header */}
      <div className="px-5 py-3 text-white flex items-center justify-between" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-base">💍</div>
          <div>
            <div className="font-bold text-sm leading-tight">{serviceName}</div>
            <div className="text-[10px] opacity-80">{T("Verified Matrimony · Bangladesh", "যাচাইকৃত ম্যাট্রিমনি · বাংলাদেশ")}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView("home")} className={`text-[11px] px-2 py-1 rounded ${view === "home" ? "bg-white/20" : ""}`}>{T("Browse", "প্রোফাইল")}</button>
          <button onClick={() => setView("plans")} className={`text-[11px] px-2 py-1 rounded ${view === "plans" ? "bg-white/20" : ""}`}>{T("Plans", "প্ল্যান")}</button>
          <span className="text-[10px] bg-emerald-500/90 px-1.5 py-0.5 rounded">● {T("Live", "লাইভ")}</span>
        </div>
      </div>

      {view === "home" && (
        <div className="flex-1 overflow-y-auto">
          {/* Hero strip */}
          <div className="px-5 py-4 bg-gradient-to-br from-rose-50 to-white border-b border-slate-200 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-lg font-bold text-slate-900 leading-tight">{T("Find Your Life Partner", "জীবনসঙ্গী খুঁজুন")}</div>
              <div className="text-[11px] text-slate-600 mt-0.5">{T("Bangladesh's most trusted matrimony service. OTP-verified profiles. SMS interest alerts. Caas-secured contact unlock.", "বাংলাদেশের সবচেয়ে বিশ্বস্ত ম্যাট্রিমনি — OTP যাচাইকৃত প্রোফাইল")}</div>
              <div className="mt-2 flex items-center gap-3 text-[10px]">
                <span className="font-bold" style={{ color: primary }}>● 1,84,000+ {T("members", "সদস্য")}</span>
                <span className="text-slate-500">★ 4.9 ({T("12k reviews", "১২হাজার রিভিউ")})</span>
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-1">
              <div className="text-[10px] uppercase tracking-widest text-slate-500">{T("Already verified", "ইতিমধ্যে যাচাইকৃত")}</div>
              <div className="flex -space-x-2">
                {profiles.slice(0, 4).map((p, i) => (
                  <div key={p.id} className="w-7 h-7 rounded-full border-2 border-white overflow-hidden" style={{ zIndex: 5 - i }}>
                    {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover" /> : <Avatar name={p.name} gradient={gradFor(p, primary, accent)} />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Profile grid */}
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-600">{T("Recommended Matches", "প্রস্তাবিত ম্যাচ")}</div>
              <div className="text-[10px] text-slate-500">{profiles.length} {T("results", "ফলাফল")}</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {profiles.map((p) => (
                <button key={p.id} onClick={() => openDetail(p)} data-testid={`matri-card-${p.id}`} className="text-left bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition group">
                  <div className="aspect-[4/5] relative overflow-hidden">
                    {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition" /> : <Avatar name={p.name} gradient={gradFor(p, primary, accent)} />}
                    <div className="absolute top-1.5 left-1.5 text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-bold">✓ {T("Verified", "যাচাই")}</div>
                  </div>
                  <div className="p-2">
                    <div className="text-[11px] font-bold truncate">{p.name}, {p.age}</div>
                    <div className="text-[10px] text-slate-500 truncate">{p.profession}</div>
                    <div className="text-[10px] text-slate-400 truncate">{p.district} · {p.height}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Stories */}
          <div className="px-5 py-4 bg-rose-50/60 border-t border-rose-100">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2">{T("Real Success Stories", "সত্যিকার সফল গল্প")}</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {stories.slice(0, 3).map((s) => (
                <div key={s.id} className="bg-white border border-rose-100 rounded-lg p-2.5">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-full text-white text-[10px] flex items-center justify-center font-bold" style={{ background: `linear-gradient(135deg, ${primary}, #fb7185)` }}>💕</div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold truncate">{s.couple}</div>
                      <div className="text-[9px] text-slate-500">{s.district || "Bangladesh"} · {s.year}</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-600 leading-snug line-clamp-3">"{s.quote}"</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === "detail" && openProfile && (
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div className="aspect-square rounded-xl overflow-hidden border border-slate-200">
              {openProfile.image ? <img src={openProfile.image} alt="" className="w-full h-full object-cover" /> : <Avatar name={openProfile.name} gradient={gradFor(openProfile, primary, accent)} />}
            </div>
            <div>
              <div className="text-lg font-bold">{openProfile.name}, {openProfile.age}</div>
              <div className="text-xs text-slate-500">{openProfile.profession} · {openProfile.district}</div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-[11px]">
                <Field label={T("Education", "শিক্ষা")} value={openProfile.education} />
                <Field label={T("Height", "উচ্চতা")} value={openProfile.height} />
                <Field label={T("Religion", "ধর্ম")} value={openProfile.religion || "Islam"} />
                <Field label={T("Marital Status", "বৈবাহিক")} value={openProfile.maritalStatus || "Never Married"} />
              </div>
              <div className="mt-3 text-[11px] text-slate-700">{openProfile.about}</div>

              {/* Contact section */}
              <div className="mt-3 border border-dashed border-rose-300 rounded-lg p-3 bg-rose-50/60">
                <div className="text-[10px] uppercase tracking-widest text-rose-600 font-bold mb-1.5">{T("Contact Information", "যোগাযোগের তথ্য")}</div>
                {unlocked[openProfile.id] ? (
                  <div className="space-y-1 text-[11px]">
                    <div>📞 +880 17XX-{String(Math.abs(openProfile.id.charCodeAt(0) * 31) % 999999).padStart(6, "0")}</div>
                    <div>💬 WhatsApp · Same number</div>
                    <div>✉ {openProfile.name.split(" ")[0].toLowerCase()}@bondobd.com</div>
                    <div className="text-[10px] text-emerald-700 mt-1">✓ {T("Contact unlocked via CaaS Premium", "CaaS প্রিমিয়াম দিয়ে আনলক হয়েছে")}</div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1 text-[11px] blur-sm select-none">
                      <div>📞 +880 17XX-XXXXXX</div>
                      <div>💬 WhatsApp · Same number</div>
                      <div>✉ xxxx@bondobd.com</div>
                    </div>
                    <button onClick={() => setView("plans")} data-testid="matri-unlock-cta" className="mt-2 w-full text-[11px] py-1.5 rounded font-bold text-white" style={{ background: primary }}>
                      🔒 {T("Subscribe to unlock contact (BDT 49)", "যোগাযোগ আনলক করতে সাবস্ক্রাইব (৪৯ টাকা)")}
                    </button>
                  </>
                )}
              </div>

              <div className="mt-2 flex gap-2">
                <button onClick={() => setView("home")} className="text-[11px] text-slate-600 hover:underline">← {T("Back to results", "ফিরে যান")}</button>
                <button data-testid="matri-interest" className="ml-auto text-[11px] px-2 py-1 rounded border border-rose-300 text-rose-700 hover:bg-rose-50">💌 {T("Express Interest", "আগ্রহ প্রকাশ")}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === "plans" && (
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="text-center mb-3">
            <div className="text-base font-bold">{T("Choose Your Premium Plan", "প্রিমিয়াম প্ল্যান নির্বাচন করুন")}</div>
            <div className="text-[11px] text-slate-500">{T("Charged securely via Robi Operator Billing (CaaS)", "Robi অপারেটর বিলিং (CaaS) দিয়ে নিরাপদে চার্জ")}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {plans.map((p) => (
              <div key={p.id} className={`bg-white border-2 rounded-xl p-3 ${p.badge ? "border-rose-300" : "border-slate-200"}`}>
                {p.badge && <div className="text-[9px] uppercase tracking-widest font-bold text-white px-2 py-0.5 rounded inline-block mb-1" style={{ background: primary }}>{p.badge}</div>}
                <div className="text-sm font-bold">{p.name}</div>
                <div className="mt-1"><span className="text-2xl font-bold" style={{ color: primary }}>৳{p.price}</span><span className="text-[10px] text-slate-500"> / {p.period}</span></div>
                <ul className="mt-2 space-y-0.5 text-[10px] text-slate-700">{(p.features || []).map((f, i) => <li key={i}>✓ {f}</li>)}</ul>
                <button onClick={subscribe} data-testid={`matri-plan-${p.id}`} className="mt-2 w-full text-[11px] py-1.5 rounded font-bold text-white" style={{ background: p.price === 0 ? "#64748b" : primary }}>
                  {p.price === 0 ? T("Continue Free", "ফ্রি চালিয়ে যান") : T("Subscribe via CaaS", "CaaS দিয়ে সাবস্ক্রাইব")}
                </button>
              </div>
            ))}
          </div>
          <div className="text-[10px] text-slate-500 text-center mt-3">{T("Cancel anytime via SMS. Charged to your Robi balance.", "যেকোনো সময় SMS দিয়ে বাতিল করুন।")}</div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, value }) => (
  <div className="bg-slate-50 rounded p-1.5">
    <div className="text-[9px] uppercase tracking-widest text-slate-500">{label}</div>
    <div className="font-semibold truncate">{value || "—"}</div>
  </div>
);

// ============ ANDROID Matrimony Screens ============
// Returns an array of screens consumable by AndroidEmulator
export const matrimonyAndroidScreens = (lang) => {
  const T = (en, bn) => (lang === "Bengali" ? bn : en);
  return [
    {
      id: "splash",
      label: T("Splash", "স্প্ল্যাশ"),
      content: (ctx) => (
        <div className="h-full flex flex-col items-center justify-center text-white" style={{ background: `linear-gradient(135deg, ${ctx.primary}, #be123c)` }}>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl mb-2">💍</div>
          <div className="font-bold text-base">{ctx.appName}</div>
          <div className="text-[10px] opacity-80 mt-1">{T("Bangladesh's Trusted Matrimony", "বাংলাদেশের বিশ্বস্ত ম্যাট্রিমনি")}</div>
          <button data-testid="emu-matri-start" onClick={ctx.next} className="mt-5 bg-white text-rose-600 font-bold text-xs px-5 py-2 rounded-full">{T("Get Started", "শুরু করুন")} →</button>
        </div>
      ),
    },
    {
      id: "otp",
      label: T("OTP Login", "OTP লগইন"),
      content: (ctx) => (
        <div className="h-full bg-white px-5 py-5 flex flex-col">
          <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">{T("Verify Phone", "ফোন যাচাই")}</div>
          <div className="text-sm font-bold mt-1">{T("Enter your Robi number", "আপনার রবি নম্বর লিখুন")}</div>
          <div className="mt-3 flex items-stretch border border-slate-200 rounded-lg overflow-hidden">
            <span className="px-2 inline-flex items-center bg-slate-100 text-[11px] text-slate-600">+88</span>
            <input defaultValue="01711-234567" className="flex-1 p-2 text-xs outline-none" />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((d) => <div key={d} className="aspect-square border border-slate-300 rounded text-center text-base font-bold flex items-center justify-center">{d}</div>)}
          </div>
          <div className="text-[10px] text-emerald-600 mt-1">✓ {T("Demo OTP: 1234", "ডেমো OTP: 1234")}</div>
          <button data-testid="emu-matri-otp" onClick={ctx.next} className="mt-auto text-white font-bold text-xs py-2.5 rounded-lg" style={{ background: ctx.primary }}>{T("Verify & Continue", "যাচাই করুন")}</button>
        </div>
      ),
    },
    {
      id: "browse",
      label: T("Browse", "ব্রাউজ"),
      content: (ctx) => (
        <div className="h-full bg-slate-50 flex flex-col">
          <div className="px-3 py-2 text-white text-xs font-bold flex items-center justify-between" style={{ background: ctx.primary }}>
            <span>💍 {ctx.appName}</span><span className="text-[10px]">★ 4.9</span>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2 overflow-y-auto">
            {FALLBACK_PROFILES.slice(0, 4).map((p) => (
              <button key={p.id} onClick={ctx.next} data-testid={`emu-matri-card-${p.id}`} className="text-left bg-white rounded-lg overflow-hidden border border-slate-200">
                <div className="aspect-[4/5]"><Avatar name={p.name} gradient={gradFor(p, ctx.primary, "#be123c")} /></div>
                <div className="p-1.5">
                  <div className="text-[10px] font-bold truncate">{p.name}, {p.age}</div>
                  <div className="text-[9px] text-slate-500 truncate">{p.profession}</div>
                  <div className="text-[9px] text-slate-400">{p.district}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "detail",
      label: T("Profile", "প্রোফাইল"),
      content: (ctx) => {
        const p = FALLBACK_PROFILES[0];
        return (
          <div className="h-full bg-white flex flex-col">
            <div className="h-32"><Avatar name={p.name} gradient={gradFor(p, ctx.primary, "#be123c")} /></div>
            <div className="p-3 flex-1 overflow-y-auto">
              <div className="font-bold text-sm">{p.name}, {p.age}</div>
              <div className="text-[10px] text-slate-500">{p.profession} · {p.district}</div>
              <div className="text-[10px] text-slate-700 mt-2">{p.about}</div>
              <div className="mt-3 border border-dashed border-rose-300 rounded-lg p-2 bg-rose-50/60">
                <div className="text-[9px] uppercase tracking-widest text-rose-600 font-bold">{T("Contact Locked", "যোগাযোগ লকড")}</div>
                <div className="text-[10px] blur-sm select-none mt-1">📞 +880 17XX-XXXXXX</div>
              </div>
            </div>
            <button data-testid="emu-matri-unlock" onClick={ctx.next} className="m-3 text-white font-bold text-xs py-2 rounded-lg" style={{ background: ctx.primary }}>🔒 {T("Subscribe to unlock — BDT 49", "আনলক করতে সাবস্ক্রাইব — ৪৯ টাকা")}</button>
          </div>
        );
      },
    },
    {
      id: "unlocked",
      label: T("Unlocked", "আনলকড"),
      content: (ctx) => (
        <div className="h-full flex flex-col items-center justify-center text-center p-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-3xl">✓</div>
          <div className="font-bold mt-2 text-sm">{T("Contact Unlocked!", "যোগাযোগ আনলক!")}</div>
          <div className="text-[10px] text-slate-500 mt-1">{T("BDT 49 charged to Robi balance via CaaS", "CaaS দিয়ে রবি ব্যালেন্স থেকে ৪৯ টাকা কাটা হয়েছে")}</div>
          <div className="mt-3 bg-white border border-slate-200 rounded-lg p-2 text-left text-[10px] w-full max-w-[200px]">
            <div className="font-bold">📞 +880 1711-234567</div>
            <div>💬 WhatsApp · Same number</div>
            <div>✉ rahima@bondobd.com</div>
          </div>
          <button data-testid="emu-matri-restart" onClick={() => ctx.goto(0)} className="mt-4 text-[11px] underline text-slate-600">{T("Browse more profiles", "আরও প্রোফাইল দেখুন")}</button>
        </div>
      ),
    },
  ];
};

export default MatrimonyWebPreview;
