import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { Sparkles, Download, Github, Share2, ExternalLink, BarChart3, ChevronLeft } from "lucide-react";
import ConfigureSidebar from "./ConfigureSidebar";
import UniversalWebPreview from "./interactive/UniversalWebPreview";
import UniversalAndroidPreview from "./interactive/UniversalAndroidPreview";
import BDappsWebPreview from "./interactive/WebPreviews";
import GenerationProgress from "./GenerationProgress";
import { useGeneratedApps } from "../../hooks/useBuilderStorage";
import { useApp } from "../../context/AppContext";
import WhatsNext from "./WhatsNext";
import Confetti from "./Confetti";

const AppBuilder = ({ template, type, designId, customization, onBack }) => {
  const navigate = useNavigate();
  const { addBuildFile } = useApp();
  const { saveApp } = useGeneratedApps();
  const [generating, setGenerating] = useState(true);
  const [celebration, setCelebration] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [cfg, setCfg] = useState({
    appName: customization?.name || template.name,
    tagline: customization?.tagline || template.description,
    primary: template.palette?.primary || "#e11d48",
    secondary: template.palette?.accent || "#0f172a",
    accent: "#f59e0b",
    font: "Modern Sans",
    radius: 10,
    dark: false,
    language: customization?.language || "English",
    fontFamily: "Inter, system-ui, sans-serif",
    payment: {
      ssl: ["web-ecom", "web-food", "web-travel", "web-edu", "and-ecom", "and-food", "and-travel", "and-edu"].includes(template.id),
      robi: type === "pro",
      cod: ["web-ecom", "web-food", "and-ecom", "and-food"].includes(template.id),
      model: "proxy",
      platformFee: 2.5,
      caasAmount: 2,
    },
    store: { publish: type === "android", category: "Utilities", shortDesc: template.description.slice(0, 80), longDesc: template.description, autoSubmit: true, age: "Everyone" },
    domain: { subdomain: (customization?.name || template.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 20), custom: "" },
  });

  useEffect(() => {
    const fontMap = { "Modern Sans": "Inter, system-ui, sans-serif", "Classic Serif": "'Playfair Display', Georgia, serif", "Rounded Friendly": "'Nunito', system-ui, sans-serif", "Monospace Tech": "'JetBrains Mono', monospace" };
    setCfg((p) => ({ ...p, fontFamily: fontMap[p.font] || fontMap["Modern Sans"] }));
  }, [cfg.font]);

  useEffect(() => {
    const t = setTimeout(() => setGenerating(false), 2200);
    return () => clearTimeout(t);
  }, []);

  // Pick the right preview based on type + template id
  const Preview = useMemo(() => {
    if (type === "android") {
      return <UniversalAndroidPreview templateId={template.id} cfg={cfg} />;
    }
    if (type === "pro") {
      return <BDappsWebPreview templateId={template.id} appName={cfg.appName} tagline={cfg.tagline} primaryColor={cfg.primary} secondaryColor={cfg.accent} language={cfg.language} height="h-[600px]" />;
    }
    return <UniversalWebPreview templateId={template.id} cfg={cfg} height="h-[600px]" />;
  }, [type, template.id, cfg]);

  const onGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setCelebration(true);
      try {
        saveApp({ id: `${template.id}-${Date.now()}`, templateId: template.id, type, name: cfg.appName, tagline: cfg.tagline, color: cfg.primary, icon: template.icon, designId, customization: { ...customization, ...cfg }, createdAt: new Date().toISOString() });
      } catch { /* noop */ }
      toast.success("🎉 Your app is ready to launch!");
    }, 1800);
  };

  const submitToStore = () => {
    addBuildFile({
      name: `${cfg.appName}.apk`,
      app: cfg.appName,
      type: "APK",
      size: `${(Math.random() * 20 + 8).toFixed(1)} MB`,
      uploadedBy: "developer@bdapps.com",
      category: cfg.store.category,
      shortDesc: cfg.store.shortDesc,
      longDesc: cfg.store.longDesc,
      icon: template.icon,
      status: "Pending Approval",
    });
    setSubmitted(true);
    setSubmitOpen(false);
    toast.success("✓ Submitted! Your APK is now in Admin Review (Provisioning → Build Files → Pending Approval)");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
        <button onClick={onBack} className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1" data-testid="appbuilder-back"><ChevronLeft size={14} /> Back</button>
        <div className="text-xs uppercase tracking-widest font-bold text-slate-700">{template.name}</div>
        <div className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">{type === "pro" ? "Pro" : type === "web" ? "Web App" : "Android"}</div>
      </div>

      {celebration && <Confetti onDone={() => {}} />}

      {celebration && (
        <div data-testid="celebration-screen" className="bg-gradient-to-br from-emerald-50 to-amber-50 border border-emerald-200 rounded-2xl p-6 text-center relative overflow-hidden">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-4xl text-emerald-600 animate-pulse">✓</div>
          <h1 className="text-3xl font-bold tracking-tight mt-3">🎉 Your App is Ready to Launch!</h1>
          <p className="text-sm text-slate-600 mt-1"><b>{cfg.appName}</b> · {template.name}</p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2 max-w-3xl mx-auto">
            <Button data-testid="action-download" onClick={() => toast.success("⬇️ ZIP download started")} className="bg-slate-900 hover:bg-slate-800 gap-1"><Download size={13} /> ZIP</Button>
            <Button data-testid="action-github" onClick={() => toast.success("🐙 Pushed to GitHub")} className="bg-slate-700 hover:bg-slate-800 gap-1"><Github size={13} /> GitHub</Button>
            {type === "android" && cfg.store.publish && (
              <Button data-testid="action-submit-store" onClick={() => setSubmitOpen(true)} className="bg-[#e11d48] hover:bg-[#be123c] gap-1"><Sparkles size={13} /> Submit to BDApps Store</Button>
            )}
            {type !== "android" && (
              <Button data-testid="action-deploy" onClick={() => { navigator.clipboard?.writeText(`https://${cfg.domain.subdomain}.bdapps.app`); toast.success("🌐 Deployed! Link copied"); }} className="bg-emerald-600 hover:bg-emerald-700 gap-1"><ExternalLink size={13} /> Go Live Now</Button>
            )}
            <Button data-testid="action-share" variant="outline" onClick={() => { navigator.clipboard?.writeText(`https://${cfg.domain.subdomain}.bdapps.app`); toast.success("🔗 Preview link copied"); }} className="gap-1"><Share2 size={13} /> Share</Button>
            <Button data-testid="action-analytics" variant="outline" onClick={() => navigate("/reports")} className="gap-1 text-purple-700 border-purple-200"><BarChart3 size={13} /> Analytics</Button>
          </div>
        </div>
      )}

      <GenerationProgress show={generating} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-8" data-testid="preview-pane">
          {generating ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl h-[600px] flex items-center justify-center text-sm text-slate-500">Generating your app...</div>
          ) : Preview}

          {celebration && submitted && (
            <div data-testid="store-submitted-card" className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="font-bold flex items-center gap-2">📱 Submitted to BDApps App Store</div>
              <div className="text-xs text-slate-600 mt-1">Your APK is now in <b>Admin Provisioning → Build Files</b> awaiting approval (24-48 hrs).</div>
            </div>
          )}

          {celebration && <WhatsNext type={type} />}
        </div>
        <div className="lg:col-span-4">
          <ConfigureSidebar cfg={cfg} onChange={setCfg} type={type} onGenerate={onGenerate} onSaveDraft={() => toast.success("💾 Draft saved")} onBack={onBack} />
        </div>
      </div>

      <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
        <DialogContent data-testid="submit-store-modal" className="max-w-md">
          <DialogTitle>Submit {cfg.appName}?</DialogTitle>
          <DialogDescription>Confirm submission to BDApps App Store</DialogDescription>
          <div className="bg-slate-50 rounded-md p-3 mt-2 flex items-center gap-3">
            <div className="w-12 h-12 rounded-md flex items-center justify-center text-2xl text-white" style={{ background: cfg.primary }}>{template.icon}</div>
            <div className="flex-1"><div className="font-bold">{cfg.appName}</div><div className="text-xs text-slate-500">{cfg.store.category} · ⭐ NEW</div><div className="text-[11px] text-slate-600 mt-1">{cfg.store.shortDesc}</div></div>
          </div>
          <Button data-testid="confirm-submit-store" onClick={submitToStore} className="mt-3 w-full bg-[#e11d48]">Confirm Submission</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppBuilder;
