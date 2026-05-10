import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { HERO_SLIDES, CATEGORIES } from "../mocks/data";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Logo } from "../components/Layout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../components/ui/select";
import { Search, Star, ChevronLeft, ChevronRight, Mail, Twitter, Facebook, ExternalLink, Share2, Heart } from "lucide-react";
import { toast } from "sonner";

const AppCard = ({ app, onClick }) => (
  <button onClick={onClick} data-testid={`store-app-${app.id}`}
    className="text-left bg-white border border-slate-200 rounded-md p-4 hover:border-[#0f172a] hover:-translate-y-1 transition-all w-56 flex-shrink-0">
    <div className="text-4xl mb-3">{app.icon}</div>
    <h4 className="font-semibold tracking-tight truncate">{app.name}</h4>
    <p className="text-xs text-slate-500 truncate">{app.developer}</p>
    <div className="flex items-center gap-1 mt-2 text-xs"><Star size={12} className="fill-amber-400 text-amber-400" /><span className="font-bold">{app.rating}</span><span className="text-slate-400">·</span><span className="text-slate-500">{app.cost}</span></div>
  </button>
);

export const AppStore = () => {
  const { storeApps, storeLayout, appStoreUser, setAppStoreUser } = useApp();
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [category, setCategory] = useState("");
  const [otpOpen, setOtpOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(1);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);

  const filtered = storeApps.filter((a) =>
    (!search || a.name.toLowerCase().includes(search.toLowerCase())) &&
    (!category || a.category === category)
  );

  const sectionApps = (sortFn) => [...storeApps].sort(sortFn).slice(0, 4);
  const newest = sectionApps((a, b) => b.id.localeCompare(a.id));
  const topRated = sectionApps((a, b) => b.rating - a.rating);
  const mostUsed = sectionApps((a, b) => (b.rating + parseFloat(a.cost === "Free" ? 0 : 1)) - (a.rating + 1));

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => window.open("/api-docs", "_blank")} data-testid="api-docs"><ExternalLink size={14} className="mr-1" /> Create Your Own App</Button>
            {appStoreUser ? <Button variant="outline" data-testid="store-user">{appStoreUser.phone}</Button>
              : <Button data-testid="store-signin" onClick={() => { setOtpOpen(true); setOtpStep(1); }} className="bg-[#e11d48] hover:bg-[#be123c]">Sign in via OTP</Button>}
          </div>
        </div>
      </header>

      {/* Hero rotating */}
      <section className="relative h-72 md:h-80 overflow-hidden">
        {HERO_SLIDES.map((s, i) => (
          <div key={i} className={`absolute inset-0 bg-gradient-to-br ${s.color} flex items-center transition-opacity duration-700 ${i === slide ? "opacity-100" : "opacity-0"}`}>
            <div className="max-w-[1400px] w-full mx-auto px-8 text-white">
              <p className="text-xs uppercase tracking-widest font-bold mb-3 opacity-80">Featured · {i + 1} of {HERO_SLIDES.length}</p>
              <h1 className="text-4xl md:text-5xl tracking-tighter font-bold max-w-2xl" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>{s.title}</h1>
              <p className="text-lg mt-3 opacity-90">{s.subtitle}</p>
            </div>
          </div>
        ))}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {HERO_SLIDES.map((_, i) => <button key={i} onClick={() => setSlide(i)} data-testid={`slide-${i}`} className={`h-1.5 rounded-full transition-all ${i === slide ? "w-8 bg-white" : "w-2 bg-white/50"}`}></button>)}
        </div>
      </section>

      {/* Search + Nav */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input data-testid="store-search" placeholder="Search apps..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {["all", "newly", "top", "most"].map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} data-testid={`tab-${t}`} className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap ${activeTab === t ? "bg-[#0f172a] text-white" : "hover:bg-slate-100"}`}>
              {{ all: "All Apps", newly: "Newly Added", top: "Top Rated", most: "Most Used" }[t]}
            </button>
          ))}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-40" data-testid="store-category"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Categories</SelectItem>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      {/* Sub banner */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 mb-8">
        <div className="bg-gradient-to-r from-[#0f172a] to-slate-700 text-white rounded-md p-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>
            <h3 className="font-bold tracking-tight text-xl" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>{storeLayout.hero}</h3>
            <p className="text-sm opacity-80">{storeLayout.sub}</p>
          </div>
          <Button onClick={() => navigate("/register")} className="bg-[#e11d48] hover:bg-[#be123c]">Become a Developer</Button>
        </div>
      </div>

      {/* Sections */}
      <main className="max-w-[1400px] mx-auto px-4 lg:px-8 pb-16 space-y-10">
        {(activeTab === "all" || search || category) ? (
          <section>
            <h2 className="text-2xl tracking-tight font-bold mb-4" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>{search ? "Results" : category || "All Apps"}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map((a) => <AppCard key={a.id} app={a} onClick={() => navigate(`/appstore/${a.id}`)} />)}
              {filtered.length === 0 && <p className="col-span-full text-slate-500">No apps found.</p>}
            </div>
          </section>
        ) : (
          <>
            {[
              { label: "Newly Added", apps: newest, key: "newly" },
              { label: "Top Rated", apps: topRated, key: "top" },
              { label: "Most Used", apps: mostUsed, key: "most" },
            ].filter((s) => activeTab === "all" || activeTab === s.key).map((sec) => (
              <section key={sec.key}>
                <div className="flex justify-between items-end mb-4">
                  <h2 className="text-2xl tracking-tight font-bold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>{sec.label}</h2>
                  <button onClick={() => setActiveTab("all")} data-testid={`see-more-${sec.key}`} className="text-sm text-[#e11d48] font-medium hover:underline">See More →</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2">{sec.apps.map((a) => <AppCard key={a.id} app={a} onClick={() => navigate(`/appstore/${a.id}`)} />)}</div>
              </section>
            ))}
          </>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 py-10">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 flex flex-col md:flex-row justify-between gap-4">
          <Logo />
          <div className="flex items-center gap-3 text-sm text-slate-600"><Mail size={14} /> support@bdapps.com</div>
          <div className="flex items-center gap-3 text-slate-500"><Twitter size={16} /><Facebook size={16} /></div>
        </div>
      </footer>

      {/* OTP Dialog */}
      <Dialog open={otpOpen} onOpenChange={setOtpOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Sign in via OTP</DialogTitle><DialogDescription>{otpStep === 1 ? "Enter your Robi mobile number" : "Enter the 4-digit OTP sent to your phone"}</DialogDescription></DialogHeader>
          {otpStep === 1 ? (
            <div><Label>Mobile Number</Label><Input data-testid="otp-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+8801711000000" /></div>
          ) : (
            <div><Label>OTP</Label><Input data-testid="otp-code" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={4} placeholder="1234" /><p className="text-xs text-slate-500 mt-1">Hint: any 4 digits will work in this demo.</p></div>
          )}
          <DialogFooter>
            {otpStep === 1
              ? <Button data-testid="otp-send" onClick={() => { if (!phone) return toast.error("Enter mobile"); toast.success("OTP sent (mock: 1234)"); setOtpStep(2); }} className="bg-[#e11d48] hover:bg-[#be123c]">Send OTP</Button>
              : <Button data-testid="otp-verify" onClick={() => { if (otp.length !== 4) return toast.error("4 digits"); setAppStoreUser({ phone }); toast.success("Signed in!"); setOtpOpen(false); setOtpStep(1); setOtp(""); }} className="bg-[#e11d48] hover:bg-[#be123c]">Verify</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const AppStoreDetail = () => {
  const { id } = useParams();
  const { storeApps, appStoreUser, setAppStoreUser } = useApp();
  const navigate = useNavigate();
  const app = storeApps.find((a) => a.id === id);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [readMore, setReadMore] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [otpStep, setOtpStep] = useState(1);
  const [phoneInput, setPhoneInput] = useState("");
  const [otpInput, setOtpInput] = useState("");

  if (!app) return <div className="p-8">App not found. <Link to="/appstore" className="text-[#e11d48] underline">Back</Link></div>;
  const fromDev = storeApps.filter((a) => a.developer === app.developer && a.id !== app.id).slice(0, 4);

  const stats = {
    rating: app.rating,
    reviews: 1248,
    subscribers: 34500,
    version: "2.4.1",
    lastUpdated: "Jan 28, 2026",
  };

  const reviews = [
    { name: "Sabbir A.", initial: "S", stars: 5, date: "5 days ago", text: "Reliable service, never misses an alert. Great value." },
    { name: "Fahmida R.", initial: "F", stars: 4, date: "2 weeks ago", text: "Useful but the messages sometimes arrive a bit late." },
    { name: "Mahin I.", initial: "M", stars: 5, date: "1 month ago", text: "Best in its category. Highly recommend!" },
    { name: "Rahim K.", initial: "R", stars: 3, date: "2 months ago", text: "Decent but charging amount feels a bit much for daily use." },
  ];

  const breakdown = [
    { stars: 5, pct: 68 },
    { stars: 4, pct: 21 },
    { stars: 3, pct: 7 },
    { stars: 2, pct: 2 },
    { stars: 1, pct: 2 },
  ];

  const screenshots = [
    "from-rose-500 to-rose-700",
    "from-slate-700 to-slate-900",
    "from-amber-500 to-rose-600",
    "from-emerald-600 to-teal-700",
    "from-sky-600 to-indigo-700",
  ];

  const requireSignIn = (action) => {
    if (appStoreUser) return action();
    setPendingAction(() => action);
    setOtpStep(1);
    setSignInOpen(true);
  };

  const sendOtp = () => {
    if (!phoneInput) return toast.error("Enter mobile");
    toast.success("OTP sent (demo: any 4 digits)");
    setOtpStep(2);
  };

  const verifyOtp = () => {
    if (otpInput.length !== 4) return toast.error("Enter 4-digit OTP");
    setAppStoreUser({ phone: phoneInput });
    setSignInOpen(false);
    setOtpInput("");
    toast.success("Signed in!");
    if (pendingAction) {
      const fn = pendingAction;
      setPendingAction(null);
      setTimeout(() => fn(), 100);
    }
  };

  const onSubscribe = () => requireSignIn(() => toast.success(`Subscribed to ${app.name}`));
  const onWriteReview = () => requireSignIn(() => document.getElementById("write-review")?.scrollIntoView({ behavior: "smooth" }));

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Logo />
          <Button variant="outline" onClick={() => navigate("/appstore")} data-testid="back-store" size="sm"><ChevronLeft size={14} className="mr-1" /> Store</Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 lg:px-8 py-6 lg:py-10 space-y-10">
        {/* Hero */}
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="text-7xl bg-slate-100 rounded-2xl p-5 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center flex-shrink-0">{app.icon}</div>
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <h1 className="text-3xl md:text-4xl tracking-tighter font-bold leading-tight" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>{app.name}</h1>
              <p className="text-[#e11d48] font-medium text-sm">{app.developer}</p>
              <p className="text-xs text-slate-500 mt-1">Contains ads · In-app purchases</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600">
              <span className="flex items-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400" /><span className="font-bold text-[#0f172a]">{stats.rating}</span> ({(stats.reviews / 1000).toFixed(1)}K)</span>
              <span className="text-slate-300">·</span>
              <span><span className="font-bold text-[#0f172a]">{(stats.subscribers / 1000).toFixed(0)}K+</span> subscribers</span>
              <span className="text-slate-300">·</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">{app.category}</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button data-testid="subscribe-btn" onClick={onSubscribe} className="bg-[#e11d48] hover:bg-[#be123c] h-11 px-8">Subscribe · {app.cost}</Button>
              <Button variant="outline" onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied"); }} data-testid="share-btn" className="h-11"><Share2 size={14} className="mr-1" /> Share</Button>
              <Button variant="outline" data-testid="wishlist-btn" onClick={() => toast.success("Added to wishlist")} className="h-11"><Heart size={14} /></Button>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3 border-y border-slate-200 py-4">
          <Stat label="Rating" value={`${stats.rating}★`} />
          <Stat label="Reviews" value={stats.reviews.toLocaleString()} />
          <Stat label="Subscribers" value={`${(stats.subscribers / 1000).toFixed(1)}K+`} />
          <Stat label="Version" value={stats.version} />
          <Stat label="Updated" value={stats.lastUpdated} />
        </div>

        {/* Screenshots */}
        <section>
          <h2 className="text-xl font-bold tracking-tight mb-3" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Preview</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {screenshots.map((bg, i) => (
              <div key={i} className={`shrink-0 w-44 h-80 rounded-xl bg-gradient-to-br ${bg} flex items-center justify-center text-white relative shadow-md`}>
                <div className="text-center px-4">
                  <div className="text-3xl mb-2">{app.icon}</div>
                  <div className="text-sm font-bold">{app.name}</div>
                  <div className="text-[10px] opacity-70 mt-1">Screenshot {i + 1}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About */}
        <section>
          <h2 className="text-xl font-bold tracking-tight mb-3" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>About this app</h2>
          <p className={`text-slate-700 leading-relaxed ${!readMore ? "line-clamp-3" : ""}`}>
            {app.description} {app.description} Built specifically for the Bangladeshi telecom market, this service is optimized for Robi network conditions and works on any handset — feature phones included. No data charges. Reliable delivery via the BDapps engine. Subscribe today and join thousands of happy users.
          </p>
          <button onClick={() => setReadMore(!readMore)} data-testid="read-more" className="text-[#e11d48] font-medium text-sm mt-1 hover:underline">{readMore ? "Show less" : "Read more"}</button>
          <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-sm font-mono mt-4">{app.instructions}</div>
        </section>

        {/* Ratings & Reviews */}
        <section>
          <h2 className="text-xl font-bold tracking-tight mb-4" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Ratings &amp; Reviews</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div className="text-center sm:border-r sm:border-slate-200">
              <div className="text-6xl font-bold tracking-tighter" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>{stats.rating}</div>
              <div className="flex justify-center gap-0.5 my-1">{[1, 2, 3, 4, 5].map((n) => <Star key={n} size={16} className={n <= Math.round(stats.rating) ? "fill-amber-400 text-amber-400" : "text-slate-300"} />)}</div>
              <div className="text-xs text-slate-500">{stats.reviews.toLocaleString()} reviews</div>
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              {breakdown.map((b) => (
                <div key={b.stars} className="flex items-center gap-2 text-xs">
                  <span className="w-4 font-mono text-slate-500">{b.stars}</span>
                  <Star size={10} className="fill-amber-400 text-amber-400" />
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-amber-400" style={{ width: `${b.pct}%` }}></div></div>
                  <span className="w-8 text-right text-slate-500">{b.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {reviews.map((r, i) => (
              <div key={i} className="border-b border-slate-100 pb-4 last:border-0">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#0f172a] text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">{r.initial}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{r.name}</span>
                      <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map((n) => <Star key={n} size={11} className={n <= r.stars ? "fill-amber-400 text-amber-400" : "text-slate-300"} />)}</div>
                      <span className="text-xs text-slate-400">{r.date}</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed mt-1">{r.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={onWriteReview} variant="outline" className="mt-4" data-testid="write-review-btn">Write a Review</Button>
        </section>

        {/* Write review form (only when signed in) */}
        {appStoreUser && (
          <section id="write-review" className="border border-slate-200 rounded-md p-6">
            <h3 className="font-semibold text-lg tracking-tight mb-3">Your review</h3>
            <div className="flex gap-1 mb-3">{[1, 2, 3, 4, 5].map((n) => <button key={n} onClick={() => setRating(n)} data-testid={`star-${n}`}><Star size={28} className={n <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"} /></button>)}</div>
            <textarea data-testid="review-text" placeholder="Share your experience..." value={review} onChange={(e) => setReview(e.target.value)} className="w-full border border-slate-200 rounded-md p-3 text-sm" rows={3}></textarea>
            <Button onClick={() => { if (!rating) return toast.error("Pick a rating"); toast.success("Review submitted!"); setReview(""); setRating(0); }} className="mt-2 bg-[#0f172a]" data-testid="submit-review">Submit Review</Button>
          </section>
        )}

        {fromDev.length > 0 && (
          <section>
            <h3 className="text-xl font-bold tracking-tight mb-4" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>More from {app.developer}</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">{fromDev.map((a) => <AppCard key={a.id} app={a} onClick={() => navigate(`/appstore/${a.id}`)} />)}</div>
          </section>
        )}
      </main>

      {/* Sign-in modal interception */}
      <Dialog open={signInOpen} onOpenChange={(o) => { if (!o) { setSignInOpen(false); setPendingAction(null); setOtpStep(1); setOtpInput(""); } }}>
        <DialogContent data-testid="signin-modal" className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sign In Required</DialogTitle>
            <DialogDescription>Please sign in to subscribe to this app.</DialogDescription>
          </DialogHeader>
          {otpStep === 1 ? (
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input data-testid="signin-phone" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} placeholder="01812345678" />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Enter OTP</Label>
              <Input data-testid="signin-otp" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} maxLength={4} placeholder="1234" />
              <p className="text-xs text-slate-500">Demo: any 4 digits will work</p>
            </div>
          )}
          <DialogFooter className="!justify-between">
            <button data-testid="signin-cancel" onClick={() => { setSignInOpen(false); setPendingAction(null); }} className="text-sm text-slate-500 hover:text-[#0f172a]">Cancel</button>
            {otpStep === 1
              ? <Button onClick={sendOtp} className="bg-[#e11d48] hover:bg-[#be123c]" data-testid="signin-request">Request OTP</Button>
              : <Button onClick={verifyOtp} className="bg-[#e11d48] hover:bg-[#be123c]" data-testid="signin-verify">Verify</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div className="text-center px-2">
    <div className="text-lg md:text-xl font-bold tracking-tight" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>{value}</div>
    <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{label}</div>
  </div>
);

export default AppStore;
