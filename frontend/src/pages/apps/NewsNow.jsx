import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ChevronLeft, Bell, Search, Bookmark, Share2 } from "lucide-react";
import APIMonitor from "../../components/APIMonitor";
import { requestOTP, verifyOTP, userSubscription, sendSMS, notifySubscribers } from "../../services/BDAppsAPI";

const CATEGORIES = ["Bangladesh", "Technology", "Business", "Sports", "International"];
const CAT_COLORS = {
  Bangladesh: "from-emerald-600 to-green-800",
  Technology: "from-sky-600 to-blue-800",
  Business: "from-amber-600 to-orange-700",
  Sports: "from-rose-600 to-red-800",
  International: "from-indigo-600 to-purple-800",
};

const ARTICLES = [
  // Bangladesh
  { id: 1, cat: "Bangladesh", title: "Bangladesh Economy Grows 6.5% in Q4 — GDP Report 2026", author: "Staff Reporter", date: "Today", readTime: 4, body: "Bangladesh's economy expanded by 6.5% in the fourth quarter, exceeding analyst expectations. The growth was driven by strong garment exports, remittance inflows from the Middle East, and increased domestic consumption.\n\nFinance Minister highlighted the Robi-backed digital service economy as a 'major contributor' to the growth, citing the 2 billion BDT generated through telecom-native apps in 2025.\n\nThe BB governor also confirmed inflation has eased to 6.1%, well within the target band. Analysts now expect another rate cut at the next monetary policy committee.", shares: 1248 },
  { id: 2, cat: "Bangladesh", title: "New Metro Rail Extension to Gazipur Inaugurated by PM", author: "BSS", date: "Today", readTime: 3, body: "The Prime Minister has officially inaugurated the metro rail extension from Uttara to Gazipur, cutting commute times by half for the 4 million daily commuters.\n\nThe new 22km stretch features 8 stations and will run every 4 minutes during peak hours.", shares: 842 },
  { id: 3, cat: "Bangladesh", title: "Bangladesh Wins Asia Cup Cricket Series Against Pakistan", author: "T Sports", date: "Yesterday", readTime: 2, body: "Bangladesh clinched a thrilling 2-1 series victory against Pakistan in the Asia Cup ODI series. Shakib Al Hasan was named player of the series.", shares: 4218 },
  // Technology
  { id: 4, cat: "Technology", title: "BDApps Reaches 10 Million Developer Downloads Milestone", author: "Tech Desk", date: "Today", readTime: 3, body: "Robi's BDApps platform crossed 10 million downloads across its developer-built apps. The platform now hosts over 5,000 active apps from 1,200+ Bangladeshi developers.", shares: 1820 },
  { id: 5, cat: "Technology", title: "Bangladesh Launches First AI-Powered Government Portal", author: "Tech Desk", date: "Yesterday", readTime: 5, body: "The Bangladesh ICT Division has rolled out an AI-powered citizen services portal answering 200+ government queries in Bangla and English.", shares: 612 },
  { id: 6, cat: "Technology", title: "Robi 5G Pilot Begins in Dhaka's Gulshan Area", author: "Robi Newsroom", date: "2 days ago", readTime: 4, body: "Robi has begun 5G trials in select areas of Dhaka, with speeds exceeding 1Gbps in initial tests.", shares: 924 },
  // Business
  { id: 7, cat: "Business", title: "DSE Index Rises 2.4% on Strong Banking Sector Performance", author: "Business Desk", date: "Today", readTime: 3, body: "The DSE main index closed at 6,310, up 2.4% led by banking and pharma stocks.", shares: 412 },
  { id: 8, cat: "Business", title: "New E-Commerce Policy to Support Local Startups", author: "Business Desk", date: "Yesterday", readTime: 4, body: "Cabinet approved a new e-commerce policy giving tax breaks to local startups for 5 years.", shares: 318 },
  { id: 9, cat: "Business", title: "Garment Exports Hit All-Time High of USD 42 Billion", author: "Business Desk", date: "3 days ago", readTime: 5, body: "Bangladesh garment exports reached a record USD 42 billion in FY 2025-26.", shares: 1102 },
  // Sports
  { id: 10, cat: "Sports", title: "Shakib Al Hasan Retires from T20 Internationals", author: "Sports Desk", date: "Today", readTime: 2, body: "Shakib Al Hasan announced his retirement from T20I cricket after 17 years.", shares: 7820 },
  { id: 11, cat: "Sports", title: "Bangladesh Football Team Qualifies for SAFF Final", author: "Sports Desk", date: "Yesterday", readTime: 3, body: "Bangladesh defeated Nepal 2-1 to qualify for the SAFF Championship final.", shares: 920 },
  { id: 12, cat: "Sports", title: "Abahani vs Mohammedan: Derby Preview", author: "Sports Desk", date: "2 days ago", readTime: 4, body: "The biggest derby of the season previewed with team analysis and player form.", shares: 422 },
  // International
  { id: 13, cat: "International", title: "UN Climate Summit: Bangladesh Receives $500M Climate Fund", author: "International Desk", date: "Today", readTime: 4, body: "Bangladesh secured USD 500 million in climate adaptation funding at the UN COP summit.", shares: 612 },
  { id: 14, cat: "International", title: "Middle East Ceasefire Agreement: Bangladesh's Diplomatic Role", author: "International Desk", date: "Yesterday", readTime: 3, body: "Bangladesh played a key mediating role in the recent Middle East ceasefire talks.", shares: 312 },
  { id: 15, cat: "International", title: "Global Inflation Eases: Impact on Bangladesh Import Costs", author: "International Desk", date: "2 days ago", readTime: 5, body: "Global inflation has eased to 3.2%, bringing relief for Bangladesh import costs.", shares: 218 },
];

const NewsNow = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState("home"); // home, article, category, account
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedCat, setSelectedCat] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [subscribed, setSubscribed] = useState(false);
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [otpRef, setOtpRef] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [subscriberId, setSubscriberId] = useState("");

  const breaking = ARTICLES.slice(0, 4).map((a) => a.title).join(" · ");

  const openArticle = (a) => { setSelectedArticle(a); setPage("article"); };

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) return toast.error("Enter valid mobile");
    setBusy(true);
    const r = await requestOTP(phone);
    setBusy(false);
    if (r.statusCode === "S1000") { setOtpRef(r.referenceNo); setDemoOtp(r._demo_otp); setOtpSent(true); toast.success("OTP sent"); }
  };
  const handleVerifyAndSub = async () => {
    if (otpInput.length !== 6) return toast.error("6-digit OTP");
    setBusy(true);
    const v = await verifyOTP(otpRef, otpInput);
    if (v.statusCode !== "S1000") { setBusy(false); return toast.error(v.statusDetail); }
    setSubscriberId(v.subscriberId);
    await userSubscription(v.subscriberId, "SUB");
    await sendSMS([`tel:88${phone}`], "You have subscribed to NewsNow BD breaking news alerts. Shortcode: 16222 | Unsub: Reply STOP", "16222");
    setBusy(false);
    setSubscribed(true);
    setSubModalOpen(false);
    setOtpSent(false);
    setOtpInput("");
    toast.success("Subscribed to SMS alerts!");
  };

  const broadcast = async () => {
    setBusy(true);
    const r = await notifySubscribers("BREAKING: Bangladesh Economy Grows 6.5% — Read at newsnow.bdapps.app", "APP_000375");
    setBusy(false);
    toast.success(`Broadcast sent to ${r.sentCount.toLocaleString()} subscribers`);
  };

  const toggleBookmark = (id) => {
    setBookmarks((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
    toast.success(bookmarks.includes(id) ? "Removed from bookmarks" : "Saved to bookmarks");
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="newsnow-app">
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-xs opacity-70 flex items-center gap-1"><ChevronLeft size={14} /> Back</button>
          <div className="font-bold text-xl">📰 NewsNow BD</div>
          <div className="flex items-center gap-3">
            <Search size={16} className="opacity-70" />
            <Bell size={16} className="opacity-70" />
          </div>
        </div>
        {/* breaking ticker */}
        <div className="bg-red-600 text-white text-xs py-1.5 overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-marquee" style={{ animation: "marquee 60s linear infinite" }}>
            🔴 BREAKING: {breaking} · {breaking}
          </div>
        </div>
        <style>{`@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }`}</style>
      </header>

      {page === "home" && (
        <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          {/* Hero featured */}
          <div onClick={() => openArticle(ARTICLES[0])} className={`relative rounded-2xl overflow-hidden h-72 bg-gradient-to-br ${CAT_COLORS[ARTICLES[0].cat]} cursor-pointer hover:shadow-xl transition-shadow`} data-testid="newsnow-hero-article">
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
              <span className="inline-block w-fit text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur px-2 py-0.5 rounded">{ARTICLES[0].cat}</span>
              <h1 className="text-3xl font-bold mt-3 leading-tight">{ARTICLES[0].title}</h1>
              <div className="text-xs opacity-80 mt-2">{ARTICLES[0].author} · {ARTICLES[0].date} · {ARTICLES[0].readTime} min read</div>
            </div>
          </div>

          {/* Subscribe banner */}
          {!subscribed && (
            <div className="bg-gradient-to-r from-rose-600 to-red-700 rounded-2xl text-white p-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-bold">📱 Get Breaking News via SMS</div>
                <div className="text-xs opacity-80 mt-1">Text NEWS to 16222 or subscribe here</div>
              </div>
              <button onClick={() => setSubModalOpen(true)} data-testid="newsnow-subscribe-btn" className="bg-white text-rose-700 font-bold rounded-full px-5 py-2 text-sm">Subscribe</button>
            </div>
          )}

          {/* Category sections */}
          {CATEGORIES.map((cat) => {
            const list = ARTICLES.filter((a) => a.cat === cat);
            return (
              <section key={cat}>
                <div className="flex justify-between items-end mb-3">
                  <h2 className="font-bold text-xl">{cat === "Bangladesh" ? "🇧🇩" : cat === "Technology" ? "💻" : cat === "Business" ? "📈" : cat === "Sports" ? "⚽" : "🌍"} {cat}</h2>
                  <button onClick={() => { setSelectedCat(cat); setPage("category"); }} className="text-xs font-bold text-rose-600 hover:underline" data-testid={`newsnow-see-more-${cat.toLowerCase()}`}>See More →</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {list.slice(0, 3).map((a) => (
                    <div key={a.id} data-testid={`newsnow-article-${a.id}`} onClick={() => openArticle(a)} className="bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                      <div className={`h-24 bg-gradient-to-br ${CAT_COLORS[cat]}`}></div>
                      <div className="p-3">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600">{cat}</div>
                        <h3 className="font-bold text-sm mt-1 line-clamp-2">{a.title}</h3>
                        <div className="text-[11px] text-slate-500 mt-2">{a.author} · {a.date} · {a.readTime} min</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          {/* Broadcast tool */}
          {subscribed && (
            <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200">
              <h3 className="font-bold text-sm">📤 Broadcast News Alert (Demo)</h3>
              <p className="text-xs text-slate-600 mt-1">Send breaking news to all subscribers via SMS</p>
              <button onClick={broadcast} disabled={busy} data-testid="newsnow-broadcast" className="mt-2 bg-slate-900 text-white rounded-lg px-4 py-2 text-xs font-bold">{busy ? "Sending..." : "Send Breaking Alert"}</button>
            </div>
          )}
        </main>
      )}

      {page === "category" && selectedCat && (
        <main className="max-w-6xl mx-auto px-4 py-6">
          <button onClick={() => setPage("home")} className="text-xs text-rose-600 mb-3 flex items-center gap-1"><ChevronLeft size={12} /> Back</button>
          <h1 className="font-bold text-2xl mb-4">{selectedCat}</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {ARTICLES.filter((a) => a.cat === selectedCat).map((a) => (
              <div key={a.id} onClick={() => openArticle(a)} className="bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-md">
                <div className={`h-28 bg-gradient-to-br ${CAT_COLORS[selectedCat]}`}></div>
                <div className="p-3">
                  <h3 className="font-bold text-sm line-clamp-2">{a.title}</h3>
                  <div className="text-[11px] text-slate-500 mt-2">{a.author} · {a.date}</div>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {page === "article" && selectedArticle && (
        <main className="max-w-3xl mx-auto px-4 py-6" data-testid="newsnow-article-detail">
          <button onClick={() => setPage("home")} className="text-xs text-rose-600 mb-3 flex items-center gap-1"><ChevronLeft size={12} /> Home</button>
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 px-2 py-0.5 rounded">{selectedArticle.cat}</span>
          <h1 className="text-3xl md:text-4xl font-bold mt-3 leading-tight">{selectedArticle.title}</h1>
          <div className="flex items-center gap-3 mt-4 text-sm text-slate-500">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">{selectedArticle.author[0]}</div>
            <span>by <b>{selectedArticle.author}</b> · {selectedArticle.date} · {selectedArticle.readTime} min · {selectedArticle.shares} shares</span>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="text-xs bg-slate-100 rounded-full px-3 py-1.5 flex items-center gap-1"><Share2 size={11} /> Share</button>
            <button onClick={() => toggleBookmark(selectedArticle.id)} data-testid="newsnow-bookmark-btn" className={`text-xs rounded-full px-3 py-1.5 flex items-center gap-1 ${bookmarks.includes(selectedArticle.id) ? "bg-amber-100 text-amber-700" : "bg-slate-100"}`}><Bookmark size={11} /> {bookmarks.includes(selectedArticle.id) ? "Saved" : "Save"}</button>
          </div>
          <article className="mt-6 prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line text-base">{selectedArticle.body}</article>
          {!subscribed && (
            <div className="mt-6 bg-gradient-to-r from-rose-600 to-red-700 text-white rounded-xl p-4 flex justify-between items-center">
              <div className="text-sm">📱 Get SMS alerts for {selectedArticle.cat} news</div>
              <button onClick={() => setSubModalOpen(true)} className="bg-white text-rose-700 font-bold rounded-full px-4 py-1.5 text-xs">Subscribe</button>
            </div>
          )}
        </main>
      )}

      {/* Subscribe modal */}
      {subModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6" data-testid="newsnow-sub-modal">
            <h3 className="font-bold text-lg">Subscribe for SMS Alerts</h3>
            <p className="text-xs text-slate-500 mt-1">Free OTP-based subscription</p>
            {!otpSent ? (
              <>
                <input data-testid="newsnow-phone" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} placeholder="Mobile (e.g. 1711234567)" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 mt-3 text-sm" maxLength={11} />
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setSubModalOpen(false)} className="flex-1 border border-slate-200 rounded-lg py-2 text-sm">Cancel</button>
                  <button onClick={handleSendOtp} disabled={busy} data-testid="newsnow-send-otp" className="flex-1 bg-slate-900 text-white rounded-lg py-2 text-sm font-bold disabled:opacity-50">{busy ? "..." : "Send OTP"}</button>
                </div>
              </>
            ) : (
              <>
                <input data-testid="newsnow-otp" value={otpInput} onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))} placeholder="6-digit OTP" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 mt-3 text-center font-mono tracking-widest" maxLength={6} />
                <p className="text-[10px] mt-1">Demo: <button className="text-rose-600 font-mono underline" onClick={() => setOtpInput(demoOtp)}>{demoOtp}</button></p>
                <button onClick={handleVerifyAndSub} disabled={busy} data-testid="newsnow-verify-sub" className="w-full mt-2 bg-slate-900 text-white rounded-lg py-2.5 font-bold text-sm disabled:opacity-50">{busy ? "..." : "Verify & Subscribe"}</button>
              </>
            )}
          </div>
        </div>
      )}

      <APIMonitor />
    </div>
  );
};

export default NewsNow;
