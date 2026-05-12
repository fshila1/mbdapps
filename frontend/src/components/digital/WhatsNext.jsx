import React, { useState } from "react";
import { Check, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WhatsNext = ({ type }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const steps = [
    { id: "generated", label: `${type === "web" ? "Web" : "Android"} app generated`, done: true, to: null },
    { id: "lite", label: "Publish your SMS service in BDapps Lite", to: "/lite", cta: "Go to BDapps Lite" },
    { id: "provisioning", label: "Configure API in Provisioning", to: "/provisioning", cta: "Go to Provisioning" },
    { id: "appstore", label: "List on BDapps App Store", to: "/app-store", cta: "Go to App Store" },
    { id: "charging", label: "Set up subscription charging", to: "/provisioning", cta: "Go to Provisioning" },
  ];

  return (
    <div data-testid="whats-next-panel" className="border border-slate-200 rounded-xl bg-white">
      <button
        onClick={() => setOpen(!open)}
        data-testid="whats-next-toggle"
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 rounded-xl"
      >
        <div className="text-left">
          <div className="text-xs uppercase tracking-widest font-bold text-[#e11d48]">Complete Your BDapps Setup</div>
          <div className="text-xs text-slate-500 mt-0.5">Tie this app to the full developer journey</div>
        </div>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <ul className="px-4 pb-4 space-y-2">
          {steps.map((s) => (
            <li key={s.id} data-testid={`whats-next-step-${s.id}`} className="flex items-center justify-between gap-2 text-sm border border-slate-100 rounded-lg px-3 py-2 hover:border-slate-300">
              <div className="flex items-center gap-2">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${s.done ? "bg-emerald-600" : "bg-slate-300"}`}>
                  {s.done && <Check size={12} />}
                </span>
                <span className={s.done ? "text-slate-700" : "text-slate-700"}>{s.label}</span>
              </div>
              {s.to && (
                <button
                  data-testid={`whats-next-go-${s.id}`}
                  onClick={() => navigate(s.to)}
                  className="text-xs font-semibold text-[#e11d48] hover:underline whitespace-nowrap flex items-center gap-1"
                >
                  {s.cta} <ArrowRight size={11} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WhatsNext;
