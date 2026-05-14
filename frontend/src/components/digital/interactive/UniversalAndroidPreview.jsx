import React, { useState, useEffect } from "react";

const T = (l, en, bn) => (l === "Bengali" ? bn : en);

export const PhoneFrame = ({ children, size = 220, label }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="relative bg-gray-900 rounded-[2rem] border-4 border-gray-700 shadow-xl overflow-hidden" style={{ width: size, height: size * 2 }}>
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-gray-900 rounded-full z-10"></div>
      <div className="absolute left-[-6px] top-20 w-1.5 h-8 bg-gray-600 rounded-l"></div>
      <div className="absolute left-[-6px] top-32 w-1.5 h-8 bg-gray-600 rounded-l"></div>
      <div className="absolute right-[-6px] top-24 w-1.5 h-12 bg-gray-600 rounded-r"></div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-gray-500 rounded-full z-10"></div>
      <div className="bg-white w-full h-full overflow-hidden pt-6 flex flex-col">{children}</div>
    </div>
    {label && <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{label}</div>}
  </div>
);

const StatusBar = ({ color, light = true }) => (
  <div className="h-6 flex items-center justify-between px-4 text-[10px]" style={{ background: color, color: light ? "white" : "#0f172a" }}>
    <span className="font-semibold">9:41</span>
    <div className="flex items-center gap-1.5"><span>📶</span><span>📡</span><span>98%</span></div>
  </div>
);

const useAutoAdvance = (active, onDone, ms = 2000) => {
  useEffect(() => { if (!active) return; const t = setTimeout(onDone, ms); return () => clearTimeout(t); }, [active, onDone, ms]);
};

// ============== 1. E-COMMERCE ==============
const EcomApp = ({ cfg }) => {
  const [splash, setSplash] = useState(true);
  useAutoAdvance(splash, () => setSplash(false), 2000);
  const [logged, setLogged] = useState(false);
  const [tappedProduct, setTappedProduct] = useState(null);
  const [stage, setStage] = useState("home"); // home, detail, cart, pay, done
  const [cart, setCart] = useState([]);
  const products = [
    { id: 1, n: "Headphones", p: 4500, c: "from-rose-500 to-orange-500" },
    { id: 2, n: "Smart Watch", p: 8900, c: "from-blue-500 to-cyan-500" },
    { id: 3, n: "Speaker", p: 3100, c: "from-purple-500 to-pink-500" },
    { id: 4, n: "Coffee Maker", p: 6200, c: "from-amber-600 to-yellow-500" },
  ];
  const cartCount = cart.reduce((s, x) => s + x.qty, 0);
  const total = cart.reduce((s, x) => s + x.p * x.qty, 0);
  return (
    <>
      <PhoneFrame label={T(cfg.language, "Splash + Login", "স্প্ল্যাশ + লগইন")}>
        {splash || !logged ? (
          splash ? (
            <div className="flex-1 flex flex-col items-center justify-center text-white" style={{ background: `linear-gradient(135deg, ${cfg.primary}, ${cfg.secondary || "#0f172a"})` }}>
              <div className="text-5xl mb-2">🛒</div>
              <div className="font-bold">{cfg.appName}</div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col p-4 justify-center">
              <div className="font-bold text-lg" style={{ color: cfg.primary }}>{T(cfg.language, "Sign In", "সাইন ইন")}</div>
              <input data-testid="and-ecom-email" placeholder="Email" className="border border-slate-200 rounded p-2 text-xs mt-2" />
              <input data-testid="and-ecom-password" type="password" placeholder="Password" className="border border-slate-200 rounded p-2 text-xs mt-2" />
              <button data-testid="and-ecom-signin" onClick={() => setLogged(true)} className="mt-3 text-white text-xs font-semibold py-2.5 rounded" style={{ background: cfg.primary }}>{T(cfg.language, "Sign In", "সাইন ইন")}</button>
            </div>
          )
        ) : (
          <div className="flex-1 flex items-center justify-center bg-emerald-50 text-emerald-700">✓ {T(cfg.language, "Continue →", "চালিয়ে যান →")}</div>
        )}
      </PhoneFrame>
      <PhoneFrame label={T(cfg.language, "Home + Browse", "হোম + ব্রাউজ")}>
        <StatusBar color={cfg.primary} />
        <div className="px-3 py-2 flex items-center gap-2" style={{ background: cfg.primary, color: "white" }}>
          <input placeholder={T(cfg.language, "Search", "অনুসন্ধান")} className="flex-1 text-[10px] text-slate-700 px-2 py-1 rounded" />
          <span>🛒{cartCount > 0 && <sup className="text-[8px] bg-white text-rose-600 rounded-full px-1 ml-0.5 font-bold">{cartCount}</sup>}</span>
        </div>
        <div className="px-2 py-1 flex gap-1 overflow-x-auto bg-white">{["All", "Tech", "Fashion", "Home"].map((c) => <span key={c} className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100">{c}</span>)}</div>
        <div className="flex-1 p-2 grid grid-cols-2 gap-1.5 bg-slate-50 overflow-y-auto">
          {products.map((p) => (
            <button key={p.id} data-testid={`and-ecom-product-${p.id}`} onClick={() => { setTappedProduct(p); setStage("detail"); }} className="bg-white rounded p-1 text-left">
              <div className={`h-12 rounded bg-gradient-to-br ${p.c}`}></div>
              <div className="text-[10px] font-semibold mt-1">{p.n}</div>
              <div className="text-[9px] font-bold" style={{ color: cfg.primary }}>৳ {p.p}</div>
            </button>
          ))}
        </div>
        <div className="bg-white border-t border-slate-100 flex justify-around py-1.5 text-[9px]">{[{ e: "🏠", l: "Home" }, { e: "🔍", l: "Search" }, { e: "🛒", l: "Cart" }, { e: "👤", l: "Profile" }].map((b, i) => <div key={b.l} className="flex flex-col items-center" style={{ color: i === 0 ? cfg.primary : "#94a3b8" }}><span>{b.e}</span><span>{b.l}</span></div>)}</div>
      </PhoneFrame>
      <PhoneFrame label={T(cfg.language, "Detail → Cart → Order", "বিবরণ → কার্ট → অর্ডার")}>
        <StatusBar color={cfg.primary} />
        <div className="px-3 py-2 text-white" style={{ background: cfg.primary }}><div className="font-bold text-xs">{stage === "detail" ? T(cfg.language, "Product", "পণ্য") : stage === "cart" ? T(cfg.language, "Cart", "কার্ট") : stage === "pay" ? T(cfg.language, "Payment", "পেমেন্ট") : T(cfg.language, "Order Placed!", "অর্ডার সম্পন্ন!")}</div></div>
        <div className="flex-1 p-3 bg-slate-50 overflow-y-auto">
          {stage === "detail" && tappedProduct && (
            <>
              <div className={`h-24 rounded bg-gradient-to-br ${tappedProduct.c}`}></div>
              <div className="font-bold mt-2 text-sm">{tappedProduct.n}</div>
              <div className="text-base font-bold" style={{ color: cfg.primary }}>৳ {tappedProduct.p}</div>
              <button data-testid="and-ecom-add-cart" onClick={() => { setCart((p) => [...p, { ...tappedProduct, qty: 1 }]); setStage("cart"); }} className="mt-3 w-full text-white text-xs font-semibold py-2 rounded" style={{ background: cfg.primary }}>{T(cfg.language, "Add to Cart", "কার্টে যোগ")}</button>
            </>
          )}
          {stage === "cart" && (
            <>
              {cart.map((c) => <div key={c.id} className="bg-white rounded p-2 text-[11px] flex justify-between mb-1"><span>{c.n} × {c.qty}</span><span style={{ color: cfg.primary }}>৳ {c.p * c.qty}</span></div>)}
              <div className="bg-white rounded p-2 text-xs font-bold flex justify-between mt-2 border-t border-slate-200">Total <span style={{ color: cfg.primary }}>৳ {total}</span></div>
              <button data-testid="and-ecom-checkout" onClick={() => setStage("pay")} className="mt-3 w-full text-white text-xs font-semibold py-2 rounded" style={{ background: cfg.primary }}>{T(cfg.language, "Checkout", "চেকআউট")}</button>
            </>
          )}
          {stage === "pay" && (
            <>
              <div className="text-[11px] text-slate-500">{T(cfg.language, "Pay with", "পেমেন্ট")}</div>
              {[{ id: "bkash", l: "📱 bKash" }, { id: "ssl", l: "💳 SSL Commerz" }, { id: "robi", l: "📡 Robi Balance" }].map((p) => <label key={p.id} className="flex items-center gap-2 bg-white rounded p-2 text-xs mt-1"><input type="radio" name="pay" defaultChecked={p.id === "bkash"} />{p.l}</label>)}
              <button data-testid="and-ecom-pay" onClick={() => setStage("done")} className="mt-3 w-full text-white text-xs font-semibold py-2 rounded" style={{ background: cfg.primary }}>{T(cfg.language, "Pay Now", "পেমেন্ট")} ৳ {total}</button>
            </>
          )}
          {stage === "done" && (
            <div className="text-center py-6">
              <div className="w-12 h-12 mx-auto bg-emerald-100 rounded-full flex items-center justify-center text-2xl text-emerald-600">✓</div>
              <div className="font-bold mt-2 text-sm">{T(cfg.language, "Order Placed!", "অর্ডার সম্পন্ন!")}</div>
              <div className="text-[10px] text-slate-500">#BD-{Math.floor(Math.random() * 900000)}</div>
            </div>
          )}
        </div>
      </PhoneFrame>
    </>
  );
};

// ============== 2. FOOD DELIVERY ==============
const FoodApp = ({ cfg }) => {
  const [splash, setSplash] = useState(true);
  useAutoAdvance(splash, () => setSplash(false), 2000);
  const [tappedRest, setTappedRest] = useState(null);
  const [items, setItems] = useState([]);
  const [stage, setStage] = useState("menu"); // menu | cart | track
  const [step, setStep] = useState(0);
  useEffect(() => { if (stage !== "track") { setStep(0); return; } const id = setInterval(() => setStep((s) => s < 3 ? s + 1 : s), 2500); return () => clearInterval(id); }, [stage]);
  const rests = [
    { id: 1, n: "Burger King BD", cuisine: "American", rating: 4.5, eta: "30-40 min", d: "1.2 km" },
    { id: 2, n: "Chillox", cuisine: "Fast Food", rating: 4.3, eta: "25-35 min", d: "0.8 km" },
    { id: 3, n: "Sultan's Dine", cuisine: "Biryani", rating: 4.7, eta: "40-50 min", d: "2.3 km" },
  ];
  const menu = [{ id: 1, n: "Whopper", c: "Burger", p: 380, e: "🍔" }, { id: 2, n: "Fries", c: "Sides", p: 120, e: "🍟" }, { id: 3, n: "Pepsi", c: "Drinks", p: 60, e: "🥤" }];
  const total = items.reduce((s, x) => s + x.p * x.qty, 0);
  return (
    <>
      <PhoneFrame label={T(cfg.language, "Splash + Home", "স্প্ল্যাশ + হোম")}>
        {splash ? (
          <div className="flex-1 flex flex-col items-center justify-center text-white" style={{ background: cfg.primary }}><div className="text-5xl mb-2">🍔</div><div className="font-bold">{cfg.appName}</div></div>
        ) : (
          <>
            <StatusBar color={cfg.primary} />
            <div className="px-3 py-2 text-white" style={{ background: cfg.primary }}><div className="font-bold text-xs">{T(cfg.language, "Nearby Restaurants", "নিকটস্থ রেস্টুরেন্ট")}</div></div>
            <div className="flex-1 p-2 space-y-1.5 bg-slate-50 overflow-y-auto">
              {rests.map((r) => (
                <button key={r.id} data-testid={`and-food-rest-${r.id}`} onClick={() => setTappedRest(r)} className="w-full bg-white rounded p-2 text-left">
                  <div className="text-xs font-bold">{r.n}</div>
                  <div className="text-[10px] text-slate-500">{r.cuisine} · ⭐ {r.rating}</div>
                  <div className="text-[9px]">{r.eta} · {r.d}</div>
                </button>
              ))}
            </div>
          </>
        )}
      </PhoneFrame>
      <PhoneFrame label={T(cfg.language, "Menu + Cart", "মেনু + কার্ট")}>
        <StatusBar color={cfg.primary} />
        <div className="px-3 py-2 text-white" style={{ background: cfg.primary }}><div className="font-bold text-xs">{tappedRest ? tappedRest.n : T(cfg.language, "Tap a restaurant", "রেস্টুরেন্ট ট্যাপ করুন")}</div></div>
        <div className="flex-1 p-2 bg-slate-50 overflow-y-auto">
          {tappedRest && menu.map((m) => (
            <div key={m.id} className="bg-white rounded p-2 text-[11px] flex items-center gap-2 mb-1">
              <span className="text-xl">{m.e}</span>
              <div className="flex-1"><div className="font-semibold">{m.n}</div><div style={{ color: cfg.primary }}>৳ {m.p}</div></div>
              <button data-testid={`and-food-add-${m.id}`} onClick={() => setItems((p) => { const ex = p.find((x) => x.id === m.id); return ex ? p.map((x) => x.id === m.id ? { ...x, qty: x.qty + 1 } : x) : [...p, { ...m, qty: 1 }]; })} className="w-6 h-6 rounded-full text-white text-sm" style={{ background: cfg.primary }}>+</button>
            </div>
          ))}
        </div>
        {items.length > 0 && <button data-testid="and-food-place" onClick={() => setStage("track")} className="w-full text-white text-xs font-bold py-2.5" style={{ background: cfg.primary }}>{T(cfg.language, "Place Order", "অর্ডার")} ৳ {total}</button>}
      </PhoneFrame>
      <PhoneFrame label={T(cfg.language, "Order Tracker", "ট্র্যাকার")}>
        <StatusBar color={cfg.primary} />
        <div className="px-3 py-2 text-white" style={{ background: cfg.primary }}><div className="font-bold text-xs">{T(cfg.language, "Tracking Order", "ট্র্যাকিং")}</div></div>
        <div className="flex-1 p-3 bg-slate-50">
          {["Placed", "Preparing", "On the way", "Delivered"].map((s, i) => (
            <div key={s} className="flex items-center gap-2 mb-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs ${i === step && stage === "track" ? "animate-pulse" : ""}`} style={{ background: stage === "track" && i <= step ? cfg.primary : "#cbd5e1" }}>{stage === "track" && i <= step ? "✓" : i + 1}</div>
              <div className="text-xs">{s}</div>
            </div>
          ))}
          {stage !== "track" && <div className="text-[10px] text-slate-500 mt-2">{T(cfg.language, "Tap Place Order on screen 2 to start tracking", "ট্র্যাকিং শুরু করতে ২ নং স্ক্রিনে Place Order ট্যাপ করুন")}</div>}
        </div>
      </PhoneFrame>
    </>
  );
};

// ============== 3. DOCTOR ==============
const DoctorApp = ({ cfg }) => {
  const [splash, setSplash] = useState(true);
  useAutoAdvance(splash, () => setSplash(false), 2000);
  const [doc, setDoc] = useState(null);
  const [slot, setSlot] = useState(null);
  const [otp, setOtp] = useState("");
  const docs = [
    { id: 1, n: "Dr. Anika Rahman", s: "Cardio", f: 1500 },
    { id: 2, n: "Dr. Tarif Hossain", s: "Pediatric", f: 1000 },
  ];
  return (
    <>
      <PhoneFrame label={T(cfg.language, "Home", "হোম")}>
        {splash ? <div className="flex-1 flex items-center justify-center text-white" style={{ background: cfg.primary }}><div className="text-center"><div className="text-5xl">🩺</div><div className="font-bold mt-2">{cfg.appName}</div></div></div> : (
          <>
            <StatusBar color={cfg.primary} />
            <div className="px-3 py-2 text-white" style={{ background: cfg.primary }}><div className="font-bold text-xs">{T(cfg.language, "Find Doctors", "ডাক্তার খুঁজুন")}</div></div>
            <div className="px-2 py-1 flex gap-1 overflow-x-auto">{["General", "Pediatric", "Cardio", "Skin"].map((c) => <span key={c} className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100">{c}</span>)}</div>
            <div className="flex-1 p-2 bg-slate-50 overflow-y-auto">
              {docs.map((d) => (
                <button key={d.id} data-testid={`and-doc-${d.id}`} onClick={() => setDoc(d)} className="w-full bg-white rounded p-2 text-left flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs" style={{ background: cfg.primary }}>{d.n.split(" ")[1].charAt(0)}</div>
                  <div className="flex-1"><div className="text-[11px] font-semibold">{d.n}</div><div className="text-[9px] text-slate-500">{d.s} · ৳ {d.f}</div></div>
                </button>
              ))}
            </div>
          </>
        )}
      </PhoneFrame>
      <PhoneFrame label={T(cfg.language, "Doctor Profile", "প্রোফাইল")}>
        <StatusBar color={cfg.primary} />
        <div className="px-3 py-2 text-white" style={{ background: cfg.primary }}><div className="font-bold text-xs">{doc?.n || T(cfg.language, "Select a doctor", "ডাক্তার নির্বাচন")}</div></div>
        <div className="flex-1 p-2 bg-slate-50">
          {doc ? (
            <>
              <div className="text-[10px] text-slate-500">{T(cfg.language, "Pick a time slot", "সময়")}</div>
              <div className="grid grid-cols-2 gap-1 mt-2">{["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM"].map((s) => <button key={s} data-testid={`and-doc-slot-${s.replace(/[^a-z0-9]+/gi, "-")}`} onClick={() => setSlot(s)} className={`text-[10px] py-1.5 rounded ${slot === s ? "text-white" : "bg-white border border-slate-200"}`} style={slot === s ? { background: cfg.primary } : {}}>{s}</button>)}</div>
            </>
          ) : <div className="text-[10px] text-slate-500">Pick a doctor on screen 1</div>}
        </div>
      </PhoneFrame>
      <PhoneFrame label={T(cfg.language, "OTP Booking", "OTP বুকিং")}>
        <StatusBar color={cfg.primary} />
        <div className="px-3 py-2 text-white" style={{ background: cfg.primary }}><div className="font-bold text-xs">{T(cfg.language, "Verify OTP", "OTP যাচাই")}</div></div>
        <div className="flex-1 p-3 bg-slate-50">
          {!slot ? <div className="text-[10px] text-slate-500">{T(cfg.language, "Select a slot first.", "প্রথমে স্লট নির্বাচন।")}</div> : otp.length >= 4 ? (
            <div className="text-center mt-6"><div className="w-12 h-12 mx-auto bg-emerald-100 rounded-full flex items-center justify-center text-2xl text-emerald-600">✓</div><div className="font-bold mt-2 text-sm">{T(cfg.language, "Confirmed!", "নিশ্চিত!")}</div><div className="text-[10px]">{doc?.n}</div><div className="text-[10px] text-slate-500">{slot}</div></div>
          ) : (
            <>
              <div className="text-[10px] text-slate-500 mb-2">{T(cfg.language, "Enter any 4 digits", "যেকোনো ৪ অঙ্ক")}</div>
              <input data-testid="and-doc-otp" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="••••" className="w-full text-center font-mono tracking-[0.4em] border border-slate-200 rounded p-2" />
              <button data-testid="and-doc-verify" onClick={() => otp.length < 4 && setOtp("1234")} className="mt-2 w-full text-white text-xs font-semibold py-2 rounded" style={{ background: cfg.primary }}>{T(cfg.language, "Verify", "যাচাই")}</button>
            </>
          )}
        </div>
      </PhoneFrame>
    </>
  );
};

// 4. eLearning App
const EduApp = ({ cfg }) => {
  const [splash, setSplash] = useState(true);
  useAutoAdvance(splash, () => setSplash(false), 2000);
  const [tapped, setTapped] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [pct, setPct] = useState(20);
  const courses = [{ id: 1, n: "Bangla Basics", p: 1200 }, { id: 2, n: "Modern JS", p: 2500 }, { id: 3, n: "UX Design", p: 3200 }];
  return (
    <>
      <PhoneFrame label={T(cfg.language, "Home", "হোম")}>
        {splash ? <div className="flex-1 flex items-center justify-center text-white" style={{ background: cfg.primary }}><div className="text-center"><div className="text-5xl">🎓</div><div className="font-bold mt-2">{cfg.appName}</div></div></div> : (
          <>
            <StatusBar color={cfg.primary} />
            <div className="px-3 py-2 text-white" style={{ background: cfg.primary }}><div className="font-bold text-xs">{T(cfg.language, "Courses", "কোর্স")}</div></div>
            <div className="flex-1 p-2 bg-slate-50 overflow-y-auto">{courses.map((c) => <button key={c.id} data-testid={`and-edu-c-${c.id}`} onClick={() => setTapped(c)} className="w-full bg-white rounded p-2 mb-1 text-left"><div className="h-10 rounded bg-gradient-to-br from-purple-500 to-pink-500"></div><div className="text-[11px] font-semibold mt-1">{c.n}</div><div className="text-[9px]" style={{ color: cfg.primary }}>৳ {c.p}</div></button>)}</div>
          </>
        )}
      </PhoneFrame>
      <PhoneFrame label={T(cfg.language, "Detail", "বিবরণ")}>
        <StatusBar color={cfg.primary} />
        <div className="px-3 py-2 text-white" style={{ background: cfg.primary }}><div className="font-bold text-xs">{tapped?.n || "Select"}</div></div>
        <div className="flex-1 p-2 bg-slate-50">
          {tapped && (
            <>
              <div className="h-16 rounded bg-gradient-to-br from-purple-500 to-pink-500"></div>
              <div className="text-[11px] mt-2">5 modules · 12h video</div>
              <button data-testid="and-edu-enroll" onClick={() => setEnrolled(true)} className="mt-3 w-full text-white text-xs font-semibold py-2 rounded" style={{ background: cfg.primary }}>{enrolled ? T(cfg.language, "Continue", "চালিয়ে যান") : T(cfg.language, `Enroll — ৳ ${tapped.p}`, `নথিভুক্ত — ৳ ${tapped.p}`)}</button>
            </>
          )}
        </div>
      </PhoneFrame>
      <PhoneFrame label={T(cfg.language, "Lesson", "পাঠ")}>
        <StatusBar color={cfg.primary} />
        <div className="bg-slate-900 h-24 flex items-center justify-center text-white text-3xl">▶</div>
        <div className="flex-1 p-3 bg-slate-50">
          <div className="text-xs font-semibold">{T(cfg.language, "Module 1 — Intro", "মডিউল ১ — পরিচিতি")}</div>
          <div className="h-1 rounded bg-slate-200 mt-2"><div className="h-full rounded" style={{ width: `${pct}%`, background: cfg.primary }}></div></div>
          <div className="text-[10px] text-slate-500 mt-1">{pct}% complete</div>
          <button data-testid="and-edu-next" onClick={() => setPct((p) => Math.min(100, p + 20))} className="mt-3 w-full text-white text-xs font-semibold py-2 rounded" style={{ background: cfg.primary }}>{T(cfg.language, "Next Lesson", "পরবর্তী")} →</button>
        </div>
      </PhoneFrame>
    </>
  );
};

const FitnessApp = ({ cfg }) => {
  const [splash, setSplash] = useState(true);
  useAutoAdvance(splash, () => setSplash(false), 2000);
  const [goal, setGoal] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => { if (!running) return; const id = setInterval(() => setSeconds((s) => s + 1), 1000); return () => clearInterval(id); }, [running]);
  return (
    <>
      <PhoneFrame label="Splash + Goals">
        {splash ? <div className="flex-1 flex items-center justify-center text-white" style={{ background: cfg.primary }}><div className="text-center"><div className="text-5xl">💪</div><div className="font-bold mt-2">{cfg.appName}</div></div></div> : (
          <>
            <StatusBar color={cfg.primary} />
            <div className="px-3 py-2 text-white" style={{ background: cfg.primary }}><div className="font-bold text-xs">{T(cfg.language, "Choose your goal", "লক্ষ্য নির্বাচন")}</div></div>
            <div className="flex-1 p-3 space-y-2">{["Lose Weight", "Build Muscle", "Stay Active"].map((g) => <button key={g} data-testid={`and-fit-goal-${g.toLowerCase().replace(/\s+/g, "-")}`} onClick={() => setGoal(g)} className={`w-full p-3 rounded text-left font-semibold ${goal === g ? "text-white" : "bg-white border border-slate-200"}`} style={goal === g ? { background: cfg.primary } : {}}>{g}</button>)}</div>
          </>
        )}
      </PhoneFrame>
      <PhoneFrame label="Dashboard">
        <StatusBar color={cfg.primary} />
        <div className="px-3 py-2 text-white" style={{ background: cfg.primary }}><div className="font-bold text-xs">{T(cfg.language, "Today", "আজ")}</div></div>
        <div className="flex-1 p-3 flex flex-col items-center bg-slate-50">
          <div className="relative w-24 h-24 my-2">
            <svg viewBox="0 0 80 80" className="w-full h-full"><circle cx="40" cy="40" r="34" stroke="#e2e8f0" strokeWidth="8" fill="none" /><circle cx="40" cy="40" r="34" stroke={cfg.primary} strokeWidth="8" fill="none" strokeDasharray="213.6" strokeDashoffset="80" strokeLinecap="round" transform="rotate(-90 40 40)" /></svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center"><div className="font-bold text-lg" style={{ color: cfg.primary }}>7,432</div><div className="text-[8px] text-slate-500">/ 10,000</div></div>
          </div>
          <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{T(cfg.language, "Goal", "লক্ষ্য")}: {goal || "—"}</div>
        </div>
      </PhoneFrame>
      <PhoneFrame label="Workout">
        <StatusBar color={cfg.primary} />
        <div className="px-3 py-2 text-white" style={{ background: cfg.primary }}><div className="font-bold text-xs">{T(cfg.language, "Push-ups", "পুশ-আপ")}</div></div>
        <div className="flex-1 p-3 text-center bg-slate-50">
          <div className="text-5xl font-bold mt-6" style={{ color: cfg.primary }}>{Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, "0")}</div>
          <div className="text-[10px] text-slate-500 mt-1">3 sets × 12 reps</div>
          <button data-testid="and-fit-start" onClick={() => setRunning(!running)} className="mt-3 px-6 py-2.5 rounded-full text-white text-xs font-bold" style={{ background: cfg.primary }}>{running ? T(cfg.language, "Pause", "পজ") : T(cfg.language, "Start", "শুরু")}</button>
          <button data-testid="and-fit-log" onClick={() => { setRunning(false); setSeconds(0); }} className="mt-2 text-[10px] underline text-slate-500">{T(cfg.language, "Log Complete", "সম্পন্ন")}</button>
        </div>
      </PhoneFrame>
    </>
  );
};

const TravelApp = ({ cfg }) => {
  const [splash, setSplash] = useState(true);
  useAutoAdvance(splash, () => setSplash(false), 2000);
  const [open, setOpen] = useState(null);
  const [booked, setBooked] = useState(false);
  const tours = [{ id: 1, n: "Cox's Bazar 3D", p: 12500, c: "from-sky-500 to-cyan-700" }, { id: 2, n: "Sajek Valley", p: 8800, c: "from-emerald-500 to-green-700" }];
  return (
    <>
      <PhoneFrame label="Home">
        {splash ? <div className="flex-1 flex items-center justify-center text-white" style={{ background: cfg.primary }}><div className="text-center"><div className="text-5xl">✈️</div><div className="font-bold mt-2">{cfg.appName}</div></div></div> : (
          <>
            <StatusBar color={cfg.primary} />
            <div className="h-16 flex items-center justify-center text-white text-xs font-bold" style={{ background: `linear-gradient(135deg, ${cfg.primary}, ${cfg.accent || cfg.primary})` }}>{T(cfg.language, "Explore BD", "BD ঘুরে দেখুন")}</div>
            <div className="flex-1 p-2 space-y-1.5 bg-slate-50 overflow-y-auto">{tours.map((t) => <button key={t.id} data-testid={`and-trv-${t.id}`} onClick={() => setOpen(t)} className="w-full bg-white rounded overflow-hidden text-left"><div className={`h-16 bg-gradient-to-br ${t.c}`}></div><div className="p-1.5"><div className="text-[11px] font-bold">{t.n}</div><div className="text-[9px]" style={{ color: cfg.primary }}>৳ {t.p}</div></div></button>)}</div>
          </>
        )}
      </PhoneFrame>
      <PhoneFrame label="Tour Detail">
        <StatusBar color={cfg.primary} />
        <div className="px-3 py-2 text-white" style={{ background: cfg.primary }}><div className="font-bold text-xs">{open?.n || "Select tour"}</div></div>
        <div className="flex-1 p-2 bg-slate-50">{open && <>
          <div className={`h-20 rounded bg-gradient-to-br ${open.c}`}></div>
          <ul className="text-[10px] mt-2 space-y-0.5">{["3 days, 2 nights", "Stay + meals", "Local guide", "All transport"].map((x) => <li key={x}>✓ {x}</li>)}</ul>
        </>}</div>
        {open && <button data-testid="and-trv-book" onClick={() => setBooked(true)} className="w-full text-white text-xs font-bold py-2.5" style={{ background: cfg.primary }}>{T(cfg.language, `Book — ৳ ${open.p}`, `বুক — ৳ ${open.p}`)}</button>}
      </PhoneFrame>
      <PhoneFrame label="Booking">
        <StatusBar color={cfg.primary} />
        <div className="px-3 py-2 text-white" style={{ background: cfg.primary }}><div className="font-bold text-xs">{T(cfg.language, "Confirmation", "নিশ্চিতকরণ")}</div></div>
        <div className="flex-1 p-3 bg-slate-50 text-center">{booked ? <><div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-2xl text-emerald-600 mt-6">✓</div><div className="font-bold mt-2 text-sm">{T(cfg.language, "Trip Booked!", "ট্রিপ বুক!")}</div><div className="text-[10px] text-slate-500">BD-{Math.floor(Math.random() * 9000 + 1000)}</div></> : <div className="text-[10px] text-slate-500 mt-4">{T(cfg.language, "Tap Book on screen 2.", "২ নং স্ক্রিনে Book ট্যাপ করুন।")}</div>}</div>
      </PhoneFrame>
    </>
  );
};

const NewsApp = ({ cfg }) => {
  const [splash, setSplash] = useState(true);
  useAutoAdvance(splash, () => setSplash(false), 2000);
  const [cat, setCat] = useState("Local");
  const [open, setOpen] = useState(null);
  const articles = { Local: [{ id: 1, t: "Dhaka traffic plan", body: "Govt announces new traffic plan for Dhaka..." }, { id: 2, t: "Padma Bridge stats", body: "Vehicles crossing increased 23%..." }], Sports: [{ id: 3, t: "BAN beats IND", body: "Bangladesh win by 7 wickets..." }], Tech: [{ id: 4, t: "5G launch", body: "Robi launches 5G in Dhaka..." }] };
  return (
    <>
      <PhoneFrame label="Home">
        {splash ? <div className="flex-1 flex items-center justify-center text-white" style={{ background: cfg.primary }}><div className="text-center"><div className="text-5xl">📰</div><div className="font-bold mt-2">{cfg.appName}</div></div></div> : (
          <>
            <StatusBar color={cfg.primary} />
            <div className="px-3 py-2 text-white" style={{ background: cfg.primary }}><div className="font-bold text-xs">{T(cfg.language, "Breaking", "ব্রেকিং")}</div></div>
            <div className="px-3 py-3 text-white text-xs font-bold" style={{ background: `linear-gradient(135deg, ${cfg.primary}, ${cfg.secondary || "#1e293b"})` }}>{articles.Local[0].t}</div>
            <div className="flex-1 p-2 space-y-1 bg-white">{articles.Local.map((a) => <button key={a.id} data-testid={`and-news-a-${a.id}`} onClick={() => setOpen(a)} className="w-full text-left flex gap-2 p-1.5 border-b border-slate-100"><div className="w-8 h-8 rounded-full" style={{ background: cfg.accent || cfg.primary }}></div><div className="flex-1"><div className="text-[10px] font-semibold">{a.t}</div><div className="text-[8px] text-slate-500">2h ago</div></div></button>)}</div>
          </>
        )}
      </PhoneFrame>
      <PhoneFrame label="Categories">
        <StatusBar color={cfg.primary} />
        <div className="px-3 py-2 text-white" style={{ background: cfg.primary }}><div className="font-bold text-xs">{T(cfg.language, "Browse", "ব্রাউজ")}</div></div>
        <div className="px-2 py-1 flex gap-1 bg-white">{Object.keys(articles).map((c) => <button key={c} data-testid={`and-news-cat-${c.toLowerCase()}`} onClick={() => setCat(c)} className={`text-[9px] px-1.5 py-0.5 rounded-full ${cat === c ? "text-white" : "bg-slate-100"}`} style={cat === c ? { background: cfg.primary } : {}}>{c}</button>)}</div>
        <div className="flex-1 p-2 bg-slate-50">{(articles[cat] || []).map((a) => <button key={a.id} onClick={() => setOpen(a)} className="w-full text-left bg-white rounded p-2 mb-1 text-[10px]">{a.t}</button>)}</div>
      </PhoneFrame>
      <PhoneFrame label="Article">
        <StatusBar color={cfg.primary} />
        <div className="px-3 py-2 text-white" style={{ background: cfg.primary }}><div className="font-bold text-xs">{open ? open.t : "Open one"}</div></div>
        <div className="flex-1 p-3 bg-white overflow-y-auto">{open ? <><div className="text-[11px] leading-relaxed">{open.body} Lorem ipsum dolor sit amet consectetur. Vivamus condimentum.</div><div className="flex gap-2 mt-3 text-[10px]"><button data-testid="and-news-like" className="px-2 py-1 rounded bg-slate-100">❤️ Like</button><button data-testid="and-news-bm" className="px-2 py-1 rounded bg-slate-100">🔖 Save</button></div></> : <div className="text-[10px] text-slate-500">{T(cfg.language, "Tap article on screen 1 or 2.", "১ বা ২ নং স্ক্রিনে আর্টিকেল ট্যাপ করুন।")}</div>}</div>
      </PhoneFrame>
    </>
  );
};

const RideApp = ({ cfg }) => {
  const [splash, setSplash] = useState(true);
  useAutoAdvance(splash, () => setSplash(false), 2000);
  const [dest, setDest] = useState("");
  const [assigned, setAssigned] = useState(false);
  const [complete, setComplete] = useState(false);
  useEffect(() => { if (!assigned) return; const id = setTimeout(() => setComplete(true), 5000); return () => clearTimeout(id); }, [assigned]);
  return (
    <>
      <PhoneFrame label="Map">
        {splash ? <div className="flex-1 flex items-center justify-center text-white" style={{ background: cfg.primary }}><div className="text-center"><div className="text-5xl">🚗</div><div className="font-bold mt-2">{cfg.appName}</div></div></div> : (
          <div className="flex-1 relative bg-slate-800">
            {[20, 40, 60, 80].map((y) => <div key={y} className="absolute h-px w-full bg-white/20" style={{ top: `${y}%` }}></div>)}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">📍</div>
            <div className="absolute top-2 left-2 right-2 bg-white rounded p-2 text-[10px] font-bold">{T(cfg.language, "Pickup: My Location", "পিকআপ: আমার অবস্থান")}</div>
          </div>
        )}
      </PhoneFrame>
      <PhoneFrame label="Fare">
        <StatusBar color={cfg.primary} />
        <div className="px-3 py-2 text-white" style={{ background: cfg.primary }}><div className="font-bold text-xs">{T(cfg.language, "Where to?", "কোথায়?")}</div></div>
        <div className="flex-1 p-3 bg-slate-50">
          <input data-testid="and-ride-dest" value={dest} onChange={(e) => setDest(e.target.value)} placeholder={T(cfg.language, "Enter destination", "গন্তব্য")} className="w-full border border-slate-200 rounded p-2 text-xs" />
          {dest && <div className="bg-white rounded p-3 mt-3 text-xs"><div className="font-bold">{T(cfg.language, "Fare Estimate", "ভাড়া")}</div><div className="text-2xl font-bold" style={{ color: cfg.primary }}>৳ 120 - 180</div><div className="text-[10px] text-slate-500">{T(cfg.language, "ETA: 12 min", "প্রতীক্ষিত: ১২ মিনিট")}</div></div>}
          {dest && <button data-testid="and-ride-book" onClick={() => setAssigned(true)} className="mt-3 w-full text-white text-xs font-bold py-2 rounded" style={{ background: cfg.primary }}>{T(cfg.language, "Book Ride", "রাইড বুক")}</button>}
        </div>
      </PhoneFrame>
      <PhoneFrame label="Driver">
        <StatusBar color={cfg.primary} />
        <div className="px-3 py-2 text-white" style={{ background: cfg.primary }}><div className="font-bold text-xs">{complete ? T(cfg.language, "Ride Complete", "রাইড সম্পন্ন") : assigned ? T(cfg.language, "Driver Assigned", "ড্রাইভার বরাদ্দ") : T(cfg.language, "Searching...", "খুঁজছে...")}</div></div>
        <div className="flex-1 p-3 bg-slate-50">
          {complete ? (
            <div className="text-center mt-6"><div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-2xl text-emerald-600">✓</div><div className="font-bold mt-2">{T(cfg.language, "৳ 145", "৳ ১৪৫")}</div><button data-testid="and-ride-pay" className="mt-3 px-4 py-2 text-white text-xs rounded" style={{ background: cfg.primary }}>{T(cfg.language, "Pay", "পেমেন্ট")}</button></div>
          ) : assigned ? (
            <div className="bg-white rounded p-3"><div className="flex items-center gap-2"><div className="w-10 h-10 rounded-full text-white font-bold flex items-center justify-center" style={{ background: cfg.primary }}>R</div><div><div className="text-xs font-bold">Rahim Khan</div><div className="text-[10px] text-slate-500">Toyota Corolla · DK-1234</div></div></div><div className="text-[10px] mt-2">ETA: 3 min</div><button onClick={() => setAssigned(false)} className="mt-2 text-[10px] underline text-rose-500">{T(cfg.language, "Cancel", "বাতিল")}</button></div>
          ) : <div className="text-[10px] text-slate-500">{T(cfg.language, "Enter destination on screen 2.", "২ নং স্ক্রিনে গন্তব্য দিন।")}</div>}
        </div>
      </PhoneFrame>
    </>
  );
};

const PREVIEWS = {
  "and-ecom": EcomApp, "and-food": FoodApp, "and-doctor": DoctorApp, "and-edu": EduApp,
  "and-fitness": FitnessApp, "and-travel": TravelApp, "and-news": NewsApp, "and-ride": RideApp,
};

const UniversalAndroidPreview = ({ templateId, cfg }) => {
  const Comp = PREVIEWS[templateId] || EcomApp;
  return (
    <div className="flex flex-wrap items-start justify-center gap-4 py-3">
      <Comp cfg={cfg} />
    </div>
  );
};

export default UniversalAndroidPreview;
