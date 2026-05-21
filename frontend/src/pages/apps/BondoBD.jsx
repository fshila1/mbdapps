import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Heart, Search, Lock, ChevronLeft, MapPin, GraduationCap, Briefcase } from "lucide-react";
import APIMonitor from "../../components/APIMonitor";
import { requestOTP, verifyOTP, userSubscription, sendSMS, queryBalance, directDebit, getBaseSize } from "../../services/BDAppsAPI";
import { useDemoLocale, LangToggle } from "../../services/demoI18n";

const PROFILES = [
  { id: 1, name: "Rahima", age: 26, religion: "Islam", district: "Dhaka", education: "Masters", profession: "Software Engineer", height: "5'4\"", about: "Family-oriented, loves reading and traveling.", phone: "01711234567", initial: "R", grad: "from-pink-400 to-rose-500" },
  { id: 2, name: "Sadia", age: 24, religion: "Islam", district: "Chittagong", education: "Honors", profession: "Doctor (MBBS)", height: "5'3\"", about: "Caring, ambitious, looking for a kind partner.", phone: "01812345678", initial: "S", grad: "from-rose-400 to-pink-600" },
  { id: 3, name: "Nusrat", age: 27, religion: "Islam", district: "Sylhet", education: "Masters", profession: "Banker", height: "5'5\"", about: "Modern values with traditional roots.", phone: "01913456789", initial: "N", grad: "from-fuchsia-400 to-pink-500" },
  { id: 4, name: "Karim", age: 30, religion: "Islam", district: "Dhaka", education: "Engineering", profession: "Civil Engineer", height: "5'9\"", about: "Honest, hardworking, dream of a happy family.", phone: "01711987654", initial: "K", grad: "from-pink-500 to-rose-700" },
  { id: 5, name: "Tanvir", age: 29, religion: "Islam", district: "Khulna", education: "MBBS", profession: "Doctor", height: "5'10\"", about: "Looking for an educated life partner.", phone: "01812876543", initial: "T", grad: "from-rose-500 to-pink-700" },
  { id: 6, name: "Rafiq", age: 31, religion: "Islam", district: "Rajshahi", education: "PhD", profession: "University Professor", height: "5'8\"", about: "Academic, peaceful nature, family-loving.", phone: "01913765432", initial: "R", grad: "from-pink-600 to-rose-800" },
];

const BondoBD = () => {
  const navigate = useNavigate();
  const { locale, setLocale, t } = useDemoLocale("bondo");
  const bn = locale === "bn";
  const [page, setPage] = useState("landing"); // landing, browse, detail, account
  const [registered, setRegistered] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subscriberId, setSubscriberId] = useState("");
  const [phone, setPhone] = useState("");
  const [otpRef, setOtpRef] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showSubModal, setShowSubModal] = useState(false);
  const [balance, setBalance] = useState(null);
  const [memberCount, setMemberCount] = useState(240000);
  const [busy, setBusy] = useState(false);
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    getBaseSize().then((r) => setMemberCount(r.count + 56000));
  }, []);

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) return toast.error("Enter a valid mobile number");
    setBusy(true);
    const r = await requestOTP(phone);
    setBusy(false);
    if (r.statusCode === "S1000") {
      setOtpRef(r.referenceNo);
      setDemoOtp(r._demo_otp);
      setOtpSent(true);
      toast.success(`OTP sent to 01${phone.slice(-9)} via Robi`);
    } else {
      toast.error(r.statusDetail);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpInput.length !== 6) return toast.error("Enter 6-digit OTP");
    setBusy(true);
    const v = await verifyOTP(otpRef, otpInput);
    if (v.statusCode !== "S1000") {
      setBusy(false);
      return toast.error(v.statusDetail);
    }
    setSubscriberId(v.subscriberId);
    await userSubscription(v.subscriberId, "SUB");
    await sendSMS([`tel:88${phone}`], "Welcome to BondoBD! You are now subscribed. Browse profiles at bondobd.bdapps.app", "16222");
    setBusy(false);
    setRegistered(true);
    toast.success("Welcome to BondoBD! 🎉");
    setPage("browse");
  };

  const handleExpressInterest = async (profile) => {
    if (!subscribed) {
      setSelectedProfile(profile);
      setShowSubModal(true);
      return;
    }
    setBusy(true);
    await sendSMS([`tel:88${profile.phone}`], `${"Md. Rafiul"} expressed interest in your profile. Log in to respond.`, "16222");
    setBusy(false);
    setInterests((p) => [...p, profile.id]);
    toast.success("Interest sent! They'll receive an SMS notification.");
  };

  const handleSubscribe = async () => {
    setBusy(true);
    const bal = await queryBalance(subscriberId);
    setBalance(bal.accountInfo.availableBalance);
    const dd = await directDebit(subscriberId, 49, "BondoBD 1 Month Premium");
    if (dd.statusCode !== "S1000") {
      setBusy(false);
      return toast.error(dd.statusDetail);
    }
    await sendSMS([`tel:88${phone}`], `BondoBD Premium activated! BDT 49 deducted. Txn: ${dd.transactionId}`, "16222");
    setBusy(false);
    setSubscribed(true);
    setShowSubModal(false);
    toast.success(`✅ Subscribed! BDT 49 deducted. Txn: ${dd.transactionId}`);
  };

  const handleUnsubscribe = async () => {
    setBusy(true);
    await userSubscription(subscriberId, "UNSUB");
    await sendSMS([`tel:88${phone}`], "You have unsubscribed from BondoBD.", "16222");
    setBusy(false);
    setSubscribed(false);
    toast.success("Unsubscribed from BondoBD");
  };

  return (
    <div className="min-h-screen bg-pink-50" data-testid="bondobd-app">
      {/* Top nav */}
      <header className="bg-gradient-to-r from-rose-700 via-rose-800 to-slate-900 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-xs opacity-80 hover:opacity-100 flex items-center gap-1"><ChevronLeft size={14} /> {t.back}</button>
          <div className="font-bold text-xl tracking-tight flex items-center gap-2" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "serif" }}>
            <div className="w-7 h-7 rounded bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-white text-sm">💍</div>
            BondoBD
          </div>
          <div className="flex items-center gap-3">
            <LangToggle locale={locale} setLocale={setLocale} />
            <div className="text-xs opacity-90 hidden sm:block">{registered ? `Welcome, Md. Rafiul` : ""}</div>
          </div>
        </div>
        {registered && (
          <nav className="max-w-6xl mx-auto px-4 flex gap-2 -mb-px overflow-x-auto">
            {["browse", "account"].map((p) => (
              <button key={p} data-testid={`bondo-nav-${p}`} onClick={() => setPage(p)} className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border-b-2 ${page === p ? "border-white" : "border-transparent opacity-70 hover:opacity-100"}`}>{p === "browse" ? t.browseProfiles : t.myAccount}</button>
            ))}
          </nav>
        )}
      </header>

      {page === "landing" && !registered && (
        <>
          <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #fff1f2 0%, #fffbeb 100%)" }}>
            <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block bg-rose-100 text-rose-700 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.tagline}</span>
                <h1 className="text-4xl md:text-5xl font-black leading-[1.05] mt-3" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "serif" }}>
                  <span className="text-slate-900">{t.heroLine1}</span><br />
                  <span className="text-rose-600">{t.heroLine2}</span>
                </h1>
                <p className="mt-3 text-slate-600 text-lg" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.subtitle}</p>

                {/* Stats avatars row */}
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[["#fbbf24", "R"], ["#f97316", "S"], ["#ec4899", "N"], ["#8b5cf6", "T"]].map(([c, l], i) => (
                      <div key={i} className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow" style={{ background: c }}>{l}</div>
                    ))}
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-rose-600 text-base">{bn ? "৫৪৩+" : "543+"}</div>
                    <div className="text-slate-500">{t.joinedToday}</div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                  <div className="bg-white border border-rose-100 rounded-xl p-3">
                    <div className="font-bold text-rose-600 text-lg">{bn ? "২,৪০,০০০+" : "2,40,000+"}</div>
                    <div className="text-[11px] text-slate-500" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.stats.profiles}</div>
                  </div>
                  <div className="bg-white border border-rose-100 rounded-xl p-3">
                    <div className="font-bold text-rose-600 text-lg">{bn ? "৮৪,০০০+" : "84,000+"}</div>
                    <div className="text-[11px] text-slate-500" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.stats.marriages}</div>
                  </div>
                  <div className="bg-white border border-rose-100 rounded-xl p-3">
                    <div className="font-bold text-rose-600 text-lg">{bn ? "১৫+" : "15+"}</div>
                    <div className="text-[11px] text-slate-500" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.stats.trusted}</div>
                  </div>
                </div>
              </div>

              {/* Right side: OTP card */}
              <div id="register-form">
                <div className="bg-white rounded-2xl shadow-2xl border border-rose-100 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full bg-rose-100 opacity-60"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 -ml-8 -mb-8 rounded-full bg-amber-100 opacity-60"></div>
                  <div className="relative">
                    <h3 className="font-bold text-xl text-slate-900" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "serif" }}>{t.loginTitle}</h3>
                    <p className="text-xs text-slate-500 mt-1" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.loginSubtitle}</p>
                    {!otpSent ? (
                      <div className="space-y-3 mt-4">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-500 font-mono text-sm">+88</span>
                          <input data-testid="bondo-phone" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} placeholder="01XXXXXXXXX" className="w-full border-2 border-rose-200 rounded-lg pl-12 pr-3 py-3 text-sm font-mono focus:border-rose-500 outline-none" maxLength={11} />
                        </div>
                        <button data-testid="bondo-send-otp" onClick={handleSendOtp} disabled={busy} className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white rounded-lg py-3 font-bold disabled:opacity-50 text-sm">
                          {busy ? t.sending : t.sendOtp}
                        </button>
                        <p className="text-[10px] text-slate-400 text-center" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.chargedFromRobi} · 4৳/day +VAT</p>
                      </div>
                    ) : (
                      <div className="space-y-3 mt-4">
                        <p className="text-xs text-slate-500">OTP sent to 01{phone.slice(-9)}</p>
                        <input data-testid="bondo-otp" value={otpInput} onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))} placeholder={t.otpHint} className="w-full border-2 border-rose-200 rounded-lg px-3 py-3 text-center font-mono text-lg tracking-widest focus:border-rose-500 outline-none" maxLength={6} />
                        <p className="text-[10px] text-slate-400">{t.demoOtp}: <button onClick={() => setOtpInput(demoOtp)} className="font-mono text-rose-600 underline">{demoOtp}</button></p>
                        <button data-testid="bondo-verify-otp" onClick={handleVerifyOtp} disabled={busy} className="w-full bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-lg py-3 font-bold disabled:opacity-50">{busy ? t.verifying : t.verifyOtp}</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Success stories section */}
          <section className="bg-slate-50 border-t border-rose-100 py-12">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "serif" }}>{t.successStories}</h2>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.successSub}</p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { c1: "#fda4af", c2: "#fcd34d", names: bn ? "রাহিমা ও করিম" : "Rahima & Karim", loc: bn ? "ঢাকা" : "Dhaka" },
                  { c1: "#fcd34d", c2: "#fda4af", names: bn ? "সাদিয়া ও তানভীর" : "Sadia & Tanvir", loc: bn ? "চট্টগ্রাম" : "Chittagong" },
                  { c1: "#a5b4fc", c2: "#fda4af", names: bn ? "নুসরাত ও রফিক" : "Nusrat & Rafiq", loc: bn ? "সিলেট" : "Sylhet" },
                ].map((s, i) => (
                  <div key={i} className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group cursor-pointer">
                    <div className="aspect-video relative" style={{ background: `linear-gradient(135deg, ${s.c1}, ${s.c2})` }}>
                      <svg viewBox="0 0 200 110" className="absolute inset-0 w-full h-full">
                        <circle cx="70" cy="55" r="22" fill="rgba(255,255,255,0.4)" />
                        <circle cx="130" cy="55" r="22" fill="rgba(255,255,255,0.4)" />
                        <circle cx="70" cy="48" r="12" fill="#fef3c7" />
                        <circle cx="130" cy="48" r="12" fill="#fde68a" />
                        <path d="M48 90 Q70 65 92 90 Z" fill="rgba(255,255,255,0.5)" />
                        <path d="M108 90 Q130 65 152 90 Z" fill="rgba(255,255,255,0.5)" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <div className="w-0 h-0 border-l-[14px] border-l-rose-600 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1"></div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-white">
                      <div className="font-bold text-slate-900" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{s.names}</div>
                      <div className="text-xs text-slate-500" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>📍 {s.loc} · 2025</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {page === "browse" && (
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl p-3 mb-4 flex items-center gap-2 border border-pink-100">
            <Search size={16} className="text-slate-400" />
            <input placeholder="Search by name, profession, district..." className="flex-1 text-sm outline-none" data-testid="bondo-search" />
            <button className="text-xs font-bold text-rose-600">Filters</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROFILES.map((p) => (
              <div key={p.id} data-testid={`bondo-profile-${p.id}`} className="bg-white rounded-2xl border border-pink-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="p-4 flex items-start gap-3">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${p.grad} flex items-center justify-center text-white text-2xl font-bold shrink-0`}>{p.initial}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold">{p.name.startsWith("Rafiq") || p.name.startsWith("Karim") || p.name.startsWith("Tanvir") ? "Md." : "Ms."} {p.name}</div>
                    <div className="text-xs text-slate-500">{p.age} yrs · {p.religion}</div>
                    <div className="mt-1 space-y-0.5 text-[11px] text-slate-600">
                      <div className="flex items-center gap-1"><MapPin size={10} /> {p.district}</div>
                      <div className="flex items-center gap-1"><GraduationCap size={10} /> {p.education}</div>
                      <div className="flex items-center gap-1"><Briefcase size={10} /> {p.profession}</div>
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-3 flex gap-2">
                  <button data-testid={`bondo-view-${p.id}`} onClick={() => { setSelectedProfile(p); setPage("detail"); }} className="flex-1 text-xs bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg py-2 font-bold">View Profile</button>
                  <button data-testid={`bondo-interest-${p.id}`} onClick={() => handleExpressInterest(p)} className={`text-xs border rounded-lg px-3 ${interests.includes(p.id) ? "bg-rose-50 border-rose-300 text-rose-600" : "border-pink-200 text-pink-600 hover:bg-pink-50"}`}>
                    <Heart size={13} className={interests.includes(p.id) ? "fill-rose-500" : ""} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {page === "detail" && selectedProfile && (
        <div className="max-w-3xl mx-auto px-4 py-6" data-testid="bondo-detail-page">
          <button onClick={() => setPage("browse")} className="text-xs text-rose-600 mb-3 flex items-center gap-1"><ChevronLeft size={12} /> Back to Browse</button>
          <div className="bg-white rounded-2xl shadow-md border border-pink-100 overflow-hidden">
            <div className={`h-28 bg-gradient-to-br ${selectedProfile.grad}`}></div>
            <div className="px-6 pb-6 -mt-12">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${selectedProfile.grad} border-4 border-white flex items-center justify-center text-white text-4xl font-bold`}>{selectedProfile.initial}</div>
              <h1 className="font-bold text-2xl mt-3" style={{ fontFamily: "serif" }}>Md. {selectedProfile.name}</h1>
              <p className="text-xs text-slate-500">{selectedProfile.age} yrs · {selectedProfile.religion} · {selectedProfile.height}</p>
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                <div><b>District</b><br /><span className="text-slate-600">{selectedProfile.district}</span></div>
                <div><b>Education</b><br /><span className="text-slate-600">{selectedProfile.education}</span></div>
                <div><b>Profession</b><br /><span className="text-slate-600">{selectedProfile.profession}</span></div>
                <div><b>Height</b><br /><span className="text-slate-600">{selectedProfile.height}</span></div>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-sm">About</h3>
                <p className="text-xs text-slate-600 mt-1">{selectedProfile.about}</p>
              </div>
              {/* Contact info */}
              <div className="mt-5 relative">
                <h3 className="font-bold text-sm mb-2">📞 Contact Info</h3>
                {!subscribed ? (
                  <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-xl p-4 text-center">
                    <Lock className="mx-auto mb-2" size={24} />
                    <div className="font-bold mb-1">Subscribe to View Contact</div>
                    <div className="text-[11px] opacity-80 space-y-1 mb-3">
                      <div>Phone: 01***-{selectedProfile.phone.slice(-3)}</div>
                      <div>WhatsApp: hidden</div>
                    </div>
                    <button onClick={() => setShowSubModal(true)} data-testid="bondo-subscribe-cta" className="bg-white text-rose-600 font-bold rounded-full px-5 py-2 text-sm">Subscribe — BDT 49/month</button>
                    <div className="text-[10px] opacity-70 mt-2">Charged via Robi Balance</div>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm space-y-1" data-testid="bondo-contact-unlocked">
                    <div>📞 Phone: <b>{selectedProfile.phone}</b></div>
                    <div>💬 WhatsApp: <b>{selectedProfile.phone}</b></div>
                    <div>✉️ Email: <b>{selectedProfile.name.toLowerCase()}@gmail.com</b></div>
                  </div>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => handleExpressInterest(selectedProfile)} data-testid="bondo-interest-btn" className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg py-2.5 font-bold text-sm">💝 Express Interest</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {page === "account" && (
        <div className="max-w-3xl mx-auto p-6 space-y-4" data-testid="bondo-account">
          <div className="bg-white rounded-2xl border border-pink-100 p-5">
            <h2 className="font-bold text-lg">My Account</h2>
            <div className="text-xs text-slate-500 mt-1">Md. Rafiul · 01***{phone.slice(-4)}</div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div className="bg-pink-50 p-3 rounded-lg"><b>Subscription</b><br /><span className={subscribed ? "text-emerald-600" : "text-rose-600"}>{subscribed ? "✓ Active (1 Month)" : "Not Active"}</span></div>
              <div className="bg-pink-50 p-3 rounded-lg"><b>Interests Sent</b><br />{interests.length}</div>
            </div>
            {subscribed && <button onClick={handleUnsubscribe} data-testid="bondo-unsubscribe" disabled={busy} className="mt-4 text-xs border border-rose-200 text-rose-600 rounded-lg px-3 py-2 font-bold">Unsubscribe</button>}
          </div>
        </div>
      )}

      {/* Subscribe modal */}
      {showSubModal && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6" data-testid="bondo-sub-modal">
            <h3 className="font-bold text-lg">Unlock Full Access</h3>
            <div className="mt-3 bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-xl p-4">
              <div className="font-bold">1 Month Premium</div>
              <div className="text-2xl font-bold mt-1">BDT 49</div>
              <div className="text-xs text-slate-500">Charged from your Robi balance</div>
            </div>
            {balance !== null && <div className="text-xs mt-2">Your balance: <b>BDT {balance}</b> {balance >= 49 ? "✓" : "✗ Insufficient"}</div>}
            <div className="mt-4 flex gap-2">
              <button onClick={() => setShowSubModal(false)} className="flex-1 border border-slate-200 rounded-lg py-2 text-sm">Cancel</button>
              <button onClick={handleSubscribe} disabled={busy} data-testid="bondo-confirm-subscribe" className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg py-2 text-sm font-bold disabled:opacity-50">{busy ? "Processing..." : "Subscribe — BDT 49"}</button>
            </div>
          </div>
        </div>
      )}

      <APIMonitor />
    </div>
  );
};

export default BondoBD;
