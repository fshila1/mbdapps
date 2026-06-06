import React, { useState, useEffect } from "react";

const STEPS = [
  "Applying your brand colors and fonts...",
  "Loading product catalog data...",
  "Connecting mock payment gateway...",
  "Finalizing preview...",
];

const LoadingSequence = ({ appName, primary, onDone }) => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const dur = 700;
    const ids = STEPS.map((_, i) => setTimeout(() => setStep(i + 1), (i + 1) * dur));
    const final = setTimeout(onDone, STEPS.length * dur + 200);
    return () => { ids.forEach(clearTimeout); clearTimeout(final); };
  }, [onDone]);
  return (
    <div data-testid="loading-sequence" className="bg-white border border-slate-200 rounded-xl p-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(135deg, ${primary}, transparent)` }}></div>
      <div className="relative">
        <div className="text-center mb-4">
          <div className="font-bold tracking-tight">Building your <span style={{ color: primary }}>{appName}</span> preview...</div>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-5">
          <div className="h-full transition-all duration-500" style={{ width: `${(step / STEPS.length) * 100}%`, background: primary }}></div>
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          {STEPS.map((s, i) => (
            <div key={s} className={`flex items-center gap-2 text-sm transition-all ${i < step ? "opacity-100" : i === step ? "opacity-100" : "opacity-40"}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${i < step ? "bg-emerald-500" : i === step ? "animate-pulse" : "bg-slate-300"}`} style={i === step ? { background: primary } : {}}>
                {i < step ? "✓" : i + 1}
              </span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSequence;
