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
import { Search, Star, ChevronLeft, ChevronRight, Mail, Twitter, Facebook, ExternalLink } from "lucide-react";
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
            <Button variant="outline" onClick={() => window.open("https://docs.bdapps.com", "_blank")} data-testid="api-docs"><ExternalLink size={14} className="mr-1" /> Create Your Own App</Button>
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
  const { storeApps, appStoreUser } = useApp();
  const navigate = useNavigate();
  const app = storeApps.find((a) => a.id === id);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  if (!app) return <div className="p-8">App not found. <Link to="/appstore" className="text-[#e11d48] underline">Back</Link></div>;
  const fromDev = storeApps.filter((a) => a.developer === app.developer && a.id !== app.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Logo />
          <Button variant="outline" onClick={() => navigate("/appstore")} data-testid="back-store"><ChevronLeft size={14} className="mr-1" /> Back to Store</Button>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-4 lg:px-8 py-10 space-y-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="text-7xl bg-slate-100 rounded-md p-6 w-32 h-32 flex items-center justify-center flex-shrink-0">{app.icon}</div>
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">{app.category}</p>
              <h1 className="text-4xl tracking-tighter font-bold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>{app.name}</h1>
              <p className="text-slate-500">by {app.developer}</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1"><Star size={14} className="fill-amber-400 text-amber-400" /><span className="font-bold">{app.rating}</span></span>
              <span className="text-slate-500">·</span>
              <span className="font-semibold">{app.cost}</span>
            </div>
            <p className="text-slate-700 leading-relaxed">{app.description}</p>
            <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-sm font-mono">{app.instructions}</div>
            <Button data-testid="subscribe-btn" onClick={() => toast.success(appStoreUser ? `Subscribed to ${app.name}` : "Sign in first")} className="bg-[#e11d48] hover:bg-[#be123c]">Subscribe</Button>
          </div>
        </div>

        {appStoreUser && (
          <section className="border border-slate-200 rounded-md p-6">
            <h3 className="font-semibold text-lg tracking-tight mb-3">Rate this app</h3>
            <div className="flex gap-1 mb-3">{[1, 2, 3, 4, 5].map((n) => <button key={n} onClick={() => setRating(n)} data-testid={`star-${n}`}><Star size={28} className={n <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"} /></button>)}</div>
            <textarea data-testid="review-text" placeholder="Write a review..." value={review} onChange={(e) => setReview(e.target.value)} className="w-full border border-slate-200 rounded-md p-3 text-sm" rows={3}></textarea>
            <Button onClick={() => { toast.success("Review submitted!"); setReview(""); setRating(0); }} className="mt-2 bg-[#0f172a]" data-testid="submit-review">Submit Review</Button>
          </section>
        )}

        {fromDev.length > 0 && (
          <section>
            <h3 className="text-2xl tracking-tight font-bold mb-4" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>From Developer</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{fromDev.map((a) => <AppCard key={a.id} app={a} onClick={() => navigate(`/appstore/${a.id}`)} />)}</div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AppStore;
