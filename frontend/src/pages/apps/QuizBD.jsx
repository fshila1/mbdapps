import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ChevronLeft, Trophy, Flame, Award, Check, X as XIcon } from "lucide-react";
import APIMonitor from "../../components/APIMonitor";
import { requestOTP, verifyOTP, userSubscription, sendSMS, directDebit } from "../../services/BDAppsAPI";
import { useDemoLocale, LangToggle } from "../../services/demoI18n";

const QUESTIONS = {
  "Bangladesh GK": [
    { q: "What is the national flower of Bangladesh?", o: ["Water Lily (Shapla)", "Rose", "Lotus", "Orchid"], c: 0 },
    { q: "How many districts are in Bangladesh?", o: ["48", "64", "72", "56"], c: 1 },
    { q: "In which year did Bangladesh gain independence?", o: ["1947", "1970", "1971", "1975"], c: 2 },
    { q: "What is the longest river in Bangladesh?", o: ["Buriganga", "Karnaphuli", "Meghna", "Jamuna"], c: 3 },
  ],
  "Islam & Religion": [
    { q: "How many pillars of Islam are there?", o: ["3", "4", "5", "6"], c: 2 },
    { q: "What is the holy book of Islam?", o: ["Bible", "Torah", "Quran", "Gita"], c: 2 },
    { q: "In which month is Ramadan observed?", o: ["Safar", "Rajab", "Shaban", "Ramadan"], c: 3 },
    { q: "How many Rakats are Fard in Fajr?", o: ["2", "4", "3", "5"], c: 0 },
  ],
  "Science & Tech": [
    { q: "Who invented the telephone?", o: ["Edison", "Bell", "Tesla", "Marconi"], c: 1 },
    { q: "What does CPU stand for?", o: ["Central Power Unit", "Computer Processing Unit", "Central Processing Unit", "Core Power Unit"], c: 2 },
    { q: "What is H2O?", o: ["Oxygen", "Hydrogen", "Water", "Carbon Dioxide"], c: 2 },
    { q: "Which planet is closest to the Sun?", o: ["Venus", "Earth", "Mercury", "Mars"], c: 2 },
  ],
  "Sports": [
    { q: "Bangladesh's most capped Test cricketer?", o: ["Mashrafe", "Shakib", "Tamim", "Mushfiqur"], c: 1 },
    { q: "What is the national sport of Bangladesh?", o: ["Cricket", "Football", "Kabaddi", "Hockey"], c: 2 },
    { q: "How many players in a cricket team?", o: ["10", "11", "12", "9"], c: 1 },
    { q: "Where was the 2023 ICC ODI World Cup final?", o: ["Dhaka", "Kolkata", "Ahmedabad", "Mumbai"], c: 2 },
  ],
  "Entertainment": [
    { q: "Who wrote 'Amar Sonar Bangla'?", o: ["Rabindranath Tagore", "Kazi Nazrul", "Lalon", "Shyamal Mitra"], c: 0 },
    { q: "Highest-grossing Bangladeshi film recently?", o: ["Boro Barir Meye", "Pita Matar Snan", "Debi", "Hawa"], c: 3 },
    { q: "Which channel airs Bangladesh cricket live?", o: ["Star Sports", "T Sports", "BTV", "Gazi TV"], c: 1 },
    { q: "Author of 'Nondito Noroke'?", o: ["Humayun Ahmed", "Imdadul Haq Milon", "Syed Shamsul Haq", "Anisul Hoque"], c: 0 },
  ],
};

const LEADERBOARD = [
  { rank: 1, name: "Karim Ahmed", district: "Dhaka", pts: 4280, streak: 22 },
  { rank: 2, name: "Nusrat Jahan", district: "Sylhet", pts: 3940, streak: 18 },
  { rank: 3, name: "Rafiul Karim (YOU)", district: "Dhaka", pts: 840, streak: 7, me: true },
  { rank: 4, name: "Sadia Islam", district: "Chittagong", pts: 720, streak: 12 },
  { rank: 5, name: "Md. Hossain", district: "Khulna", pts: 680, streak: 9 },
  { rank: 6, name: "Tania Begum", district: "Barisal", pts: 620, streak: 6 },
  { rank: 7, name: "Aminul Haque", district: "Rajshahi", pts: 580, streak: 5 },
];

const QuizBD = () => {
  const navigate = useNavigate();
  const { locale, setLocale, t } = useDemoLocale("quiz");
  const bn = locale === "bn";
  const [page, setPage] = useState("landing");
  const [phone, setPhone] = useState("");
  const [otpRef, setOtpRef] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [subscriberId, setSubscriberId] = useState("");
  const [registered, setRegistered] = useState(false);
  const [points, setPoints] = useState(840);
  const [streak, setStreak] = useState(7);
  const [busy, setBusy] = useState(false);

  // Active quiz state
  const [quizCat, setQuizCat] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [reveal, setReveal] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600);
  const timerRef = useRef(null);

  useEffect(() => {
    if (page === "quiz" && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timerRef.current);
    }
  }, [page, timeLeft]);

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) return toast.error("Enter valid mobile number");
    setBusy(true);
    const r = await requestOTP(phone);
    setBusy(false);
    if (r.statusCode === "S1000") {
      setOtpRef(r.referenceNo);
      setDemoOtp(r._demo_otp);
      setOtpSent(true);
      toast.success("OTP sent via Robi");
    }
  };
  const handleVerifyOtp = async () => {
    if (otpInput.length !== 6) return toast.error("Enter 6-digit OTP");
    setBusy(true);
    const v = await verifyOTP(otpRef, otpInput);
    if (v.statusCode !== "S1000") { setBusy(false); return toast.error(v.statusDetail); }
    setSubscriberId(v.subscriberId);
    await userSubscription(v.subscriberId, "SUB");
    await sendSMS([`tel:88${phone}`], "Welcome to QuizBD! Daily quiz starts at 9AM. Reply with A, B, C, or D to answer. Good luck! 🧠", "16222");
    setBusy(false);
    setRegistered(true);
    setPage("home");
    toast.success("Welcome to QuizBD! 🧠");
  };

  const startQuiz = (cat) => {
    setQuizCat(cat);
    setQIdx(0);
    setSelected(null);
    setReveal(false);
    setScore(0);
    setTimeLeft(600);
    setPage("quiz");
  };

  const selectAnswer = (idx) => {
    if (reveal) return;
    setSelected(idx);
    setReveal(true);
    const isCorrect = idx === QUESTIONS[quizCat][qIdx].c;
    if (isCorrect) setScore((s) => s + 1);
    setTimeout(() => {
      if (qIdx + 1 >= QUESTIONS[quizCat].length) finishQuiz(isCorrect ? score + 1 : score);
      else {
        setQIdx((i) => i + 1);
        setSelected(null);
        setReveal(false);
      }
    }, 1300);
  };

  const finishQuiz = async (finalScore) => {
    const total = QUESTIONS[quizCat].length;
    const earned = finalScore * 10;
    setPoints((p) => p + earned);
    setStreak((s) => s + 1);
    await sendSMS([`tel:88${phone || "1711234567"}`], `QuizBD result: You scored ${finalScore}/${total}! +${earned} points added. Total: ${points + earned} pts 🎉`, "16222");
    setPage("results");
  };

  const claimPrize = async () => {
    setBusy(true);
    const r = await directDebit(subscriberId || "tel:masked_711234", -5, "QuizBD Prize Credit");
    setBusy(false);
    if (r.statusCode === "S1000") toast.success(`BDT 5 credited to your Robi balance! Txn: ${r.transactionId}`);
  };

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-purple-50" data-testid="quizbd-app">
      <header className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-xs opacity-80 flex items-center gap-1"><ChevronLeft size={14} /> {t.back}</button>
          <div className="font-bold text-xl flex items-center gap-1.5" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>🧠 {t.title}</div>
          <div className="flex items-center gap-3">
            <LangToggle locale={locale} setLocale={setLocale} />
            {registered && <div className="text-xs hidden sm:block">{points} {t.pts} · 🔥 {streak}</div>}
          </div>
        </div>
      </header>

      {page === "landing" && (
        <section className="bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-900 text-white">
          <div className="max-w-6xl mx-auto px-4 py-12 text-center">
            <div className="text-6xl mb-3">🧠</div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.heroTitle}</h1>
            <p className="mt-3 opacity-90" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.heroSub}</p>
            <div className="mt-6 flex flex-wrap gap-6 justify-center text-sm">
              <div><b>{bn ? "১,৮৪,০০০+" : "1,84,000+"}</b><br /><span className="opacity-70" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.subscribers}</span></div>
              <div><b>{bn ? "২০ লাখ+" : "2M+"}</b><br /><span className="opacity-70" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.qAnswered}</span></div>
              <div><b>{bn ? "৫০,০০০ টাকা" : "BDT 50,000"}</b><br /><span className="opacity-70" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.monthlyPrize}</span></div>
            </div>
            <div className="mt-8 max-w-md mx-auto bg-white text-slate-900 rounded-2xl p-6 text-left">
              <h3 className="font-bold" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.subTitle}</h3>
              <p className="text-xs text-slate-500 mt-1" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.subSub}</p>
              {!otpSent ? (
                <>
                  <input data-testid="quiz-phone" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} placeholder={bn ? "মোবাইল (যেমন ১৭১১২৩৪৫৬৭)" : "Mobile (e.g. 1711234567)"} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 mt-3 text-sm" maxLength={11} />
                  <button onClick={handleSendOtp} disabled={busy} data-testid="quiz-send-otp" className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg py-2.5 font-bold disabled:opacity-50">{busy ? t.sending : t.sendOtp}</button>
                </>
              ) : (
                <>
                  <input data-testid="quiz-otp" value={otpInput} onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))} placeholder={t.otp} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 mt-3 text-center font-mono text-lg tracking-widest" maxLength={6} />
                  <p className="text-[10px] mt-1">{t.demoOtp}: <button className="text-purple-700 font-mono underline" onClick={() => setOtpInput(demoOtp)}>{demoOtp}</button></p>
                  <button onClick={handleVerifyOtp} disabled={busy} data-testid="quiz-verify-otp" className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg py-2.5 font-bold disabled:opacity-50">{busy ? "..." : t.verifyPlay}</button>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {page === "home" && (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
          <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-4 flex flex-wrap items-center justify-around gap-3">
            <div><div className="text-xs text-slate-500" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.points}</div><div className="font-bold text-2xl">{points}</div></div>
            <div><div className="text-xs text-slate-500" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.rank}</div><div className="font-bold text-2xl">#247</div></div>
            <div><div className="text-xs text-slate-500" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.streak}</div><div className="font-bold text-2xl flex items-center gap-1"><Flame size={20} className="text-orange-500" />{streak}</div></div>
            {points >= 500 && (
              <button onClick={claimPrize} disabled={busy} data-testid="quiz-claim-prize" className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-4 py-2 text-xs font-bold">{busy ? t.claiming : t.claimPrize}</button>
            )}
          </div>

          <h2 className="font-bold text-xl" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.pickCategory}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.keys(QUESTIONS).map((cat) => (
              <button key={cat} data-testid={`quiz-cat-${cat.split(" ")[0].toLowerCase()}`} onClick={() => startQuiz(cat)} className="bg-white rounded-2xl border border-purple-100 p-5 text-left hover:border-purple-400 hover:shadow-md transition-all">
                <div className="text-3xl mb-2">{cat.startsWith("Bangladesh") ? "🇧🇩" : cat.startsWith("Islam") ? "🕌" : cat.startsWith("Science") ? "🔬" : cat.startsWith("Sports") ? "⚽" : "🎬"}</div>
                <div className="font-bold" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.categories[cat]}</div>
                <div className="text-xs text-slate-500 mt-1" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{QUESTIONS[cat].length} {t.questions} · {QUESTIONS[cat].length * 10} {t.pts}</div>
              </button>
            ))}
          </div>

          <h2 className="font-bold text-xl mt-6" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.leaderboard}</h2>
          <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden">
            {LEADERBOARD.map((u) => (
              <div key={u.rank} data-testid={`quiz-leader-${u.rank}`} className={`px-4 py-3 flex items-center gap-3 border-b last:border-b-0 ${u.me ? "bg-purple-50" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${u.rank === 1 ? "bg-amber-400 text-white" : u.rank === 2 ? "bg-slate-300" : u.rank === 3 ? "bg-orange-300" : "bg-slate-100"}`}>{u.rank}</div>
                <div className="flex-1">
                  <div className={`font-bold text-sm ${u.me ? "text-purple-700" : ""}`}>{u.name}</div>
                  <div className="text-xs text-slate-500">{u.district}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{u.pts} pts</div>
                  <div className="text-[10px] text-orange-500">🔥 {u.streak}d</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {page === "quiz" && quizCat && (
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm mb-4">
            <div className="font-bold" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.categories[quizCat]}</div>
            <div className="text-rose-600 font-mono">⏱ {fmt(timeLeft)}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-purple-100 p-6">
            <div className="text-xs text-slate-500 mb-2" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.question} {qIdx + 1} {t.of} {QUESTIONS[quizCat].length}</div>
            <div className="h-1.5 bg-slate-100 rounded-full mb-5"><div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${((qIdx + 1) / QUESTIONS[quizCat].length) * 100}%` }}></div></div>
            <h2 className="font-bold text-lg" data-testid="quiz-question">{QUESTIONS[quizCat][qIdx].q}</h2>
            <div className="mt-5 space-y-2">
              {QUESTIONS[quizCat][qIdx].o.map((opt, i) => {
                const isCorrect = i === QUESTIONS[quizCat][qIdx].c;
                const isPicked = selected === i;
                let cls = "border-slate-200 hover:border-purple-300";
                if (reveal && isCorrect) cls = "border-emerald-500 bg-emerald-50 text-emerald-700";
                else if (reveal && isPicked && !isCorrect) cls = "border-rose-500 bg-rose-50 text-rose-700";
                else if (isPicked) cls = "border-purple-500 bg-purple-50";
                return (
                  <button key={i} data-testid={`quiz-opt-${i}`} disabled={reveal} onClick={() => selectAnswer(i)} className={`w-full text-left border-2 rounded-xl p-3 flex items-center gap-3 transition-all ${cls}`}>
                    <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center font-bold text-xs">{String.fromCharCode(65 + i)}</span>
                    <span className="flex-1 font-medium text-sm">{opt}</span>
                    {reveal && isCorrect && <Check size={18} className="text-emerald-600" />}
                    {reveal && isPicked && !isCorrect && <XIcon size={18} className="text-rose-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {page === "results" && (
        <div className="max-w-md mx-auto px-4 py-10 text-center" data-testid="quiz-results">
          <div className="text-6xl mb-3">🎉</div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.quizComplete}</h1>
          <div className="bg-white rounded-2xl shadow-md border border-purple-100 p-6 mt-5">
            <div className="text-5xl font-bold text-purple-700">{score} / {QUESTIONS[quizCat].length}</div>
            <div className="mt-1 text-sm text-slate-500" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.correctAnswers}</div>
            <div className="mt-4 text-lg font-bold text-emerald-600" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>+{score * 10} {t.pointsEarned}</div>
            <div className="text-xs text-slate-500 mt-1" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.total}: {points} {t.pts}</div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={() => setPage("home")} data-testid="quiz-back-home" className="flex-1 border border-slate-200 rounded-lg py-2.5 font-bold text-sm" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.backHome}</button>
            <button onClick={() => startQuiz(quizCat)} className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg py-2.5 font-bold text-sm" style={{ fontFamily: bn ? "'Tiro Bangla', serif" : "inherit" }}>{t.playAgain}</button>
          </div>
        </div>
      )}

      <APIMonitor />
    </div>
  );
};

export default QuizBD;
