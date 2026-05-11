import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Switch } from "../ui/switch";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Req } from "../FieldLabel";
import { COLOR_PRESETS, FONT_PRESETS, ANDROID_CATEGORIES_BY_TEMPLATE } from "../../mocks/builderTemplates";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";

const Section = ({ title, children }) => (
  <div>
    <div className="text-xs font-bold uppercase tracking-widest text-[#e11d48] mb-2 pb-2 border-b border-slate-100">{title}</div>
    <div className="space-y-3">{children}</div>
  </div>
);

const ColorSwatchPicker = ({ value, onChange, testid }) => (
  <div className="flex items-center gap-2 flex-wrap">
    {COLOR_PRESETS.map((c) => (
      <button
        key={c.hex}
        data-testid={`${testid}-${c.name.toLowerCase()}`}
        type="button"
        onClick={() => onChange(c.hex)}
        title={c.name}
        className={`w-7 h-7 rounded-full transition-all ${value === c.hex ? "ring-2 ring-offset-2 ring-[#0f172a] scale-110" : "ring-1 ring-slate-200"}`}
        style={{ background: c.hex }}
      />
    ))}
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="ml-1 w-24 h-8 text-xs font-mono border border-slate-200 rounded px-2"
      placeholder="#hex"
      data-testid={`${testid}-hex`}
    />
  </div>
);

// --------- WEB form ---------
export const WebCustomizationForm = ({ template, initial, onSubmit, onBack, onSkip }) => {
  const [v, setV] = useState({
    name: initial?.name || template?.name || "",
    tagline: initial?.tagline || template?.description || "",
    primaryColor: initial?.primaryColor || "#e11d48",
    secondaryColor: initial?.secondaryColor || "#0f172a",
    sections: initial?.sections || "4",
    includePricing: initial?.includePricing ?? true,
    includeContact: initial?.includeContact ?? true,
    includeBlog: initial?.includeBlog ?? false,
    language: initial?.language || "English",
    logo: initial?.logo || null,
    font: initial?.font || "Modern Sans",
  });

  const update = (k, val) => setV((p) => ({ ...p, [k]: val }));
  const valid = v.name.trim() && v.tagline.trim();

  return (
    <div data-testid="web-customization-form" className="space-y-5">
      <div className="flex items-center gap-2">
        <button onClick={onBack} data-testid="cust-back" className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1">
          <ArrowLeft size={14} /> Back
        </button>
        <div className="flex-1">
          <h2 className="font-bold text-xl tracking-tight">Tell Us About Your App</h2>
          <p className="text-xs text-slate-500">A few details so we can personalize your generated preview.</p>
        </div>
      </div>

      <Section title="Basic Identity">
        <div>
          <Label className="text-xs">App / Website Name<Req /></Label>
          <Input data-testid="cust-name" value={v.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. HealthCare BD" />
        </div>
        <div>
          <Label className="text-xs">Tagline / Headline<Req /></Label>
          <Input data-testid="cust-tagline" value={v.tagline} onChange={(e) => update("tagline", e.target.value)} placeholder="Your daily wellness companion" />
        </div>
        <div>
          <Label className="text-xs">Primary Color</Label>
          <ColorSwatchPicker value={v.primaryColor} onChange={(c) => update("primaryColor", c)} testid="cust-primary" />
        </div>
        <div>
          <Label className="text-xs">Secondary Color</Label>
          <ColorSwatchPicker value={v.secondaryColor} onChange={(c) => update("secondaryColor", c)} testid="cust-secondary" />
        </div>
      </Section>

      <Section title="Content Preferences">
        <div>
          <Label className="text-xs">Number of sections on homepage<Req /></Label>
          <Select value={v.sections} onValueChange={(val) => update("sections", val)}>
            <SelectTrigger data-testid="cust-sections"><SelectValue /></SelectTrigger>
            <SelectContent>{["3", "4", "5", "6+"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between p-3 border border-slate-200 rounded-md">
          <Label htmlFor="cust-pricing" className="text-sm cursor-pointer">Include Pricing Page?</Label>
          <Switch id="cust-pricing" data-testid="cust-pricing" checked={v.includePricing} onCheckedChange={(c) => update("includePricing", c)} />
        </div>
        <div className="flex items-center justify-between p-3 border border-slate-200 rounded-md">
          <Label htmlFor="cust-contact" className="text-sm cursor-pointer">Include Contact Form?</Label>
          <Switch id="cust-contact" data-testid="cust-contact" checked={v.includeContact} onCheckedChange={(c) => update("includeContact", c)} />
        </div>
        <div className="flex items-center justify-between p-3 border border-slate-200 rounded-md">
          <Label htmlFor="cust-blog" className="text-sm cursor-pointer">Include Blog / News section?</Label>
          <Switch id="cust-blog" data-testid="cust-blog" checked={v.includeBlog} onCheckedChange={(c) => update("includeBlog", c)} />
        </div>
        <div>
          <Label className="text-xs">Target Language</Label>
          <Select value={v.language} onValueChange={(val) => update("language", val)}>
            <SelectTrigger data-testid="cust-language"><SelectValue /></SelectTrigger>
            <SelectContent>{["English", "Bengali", "Both"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </Section>

      <Section title="Branding (Optional)">
        <div>
          <Label className="text-xs">Upload Logo</Label>
          <div className="flex items-center gap-3 mt-1">
            <label className="cursor-pointer flex items-center gap-2 px-3 py-2 border border-dashed border-slate-300 rounded-md text-xs text-slate-600 hover:border-slate-500">
              <ImageIcon size={14} /> Choose file
              <input type="file" accept="image/*" className="hidden" data-testid="cust-logo"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => update("logo", ev.target?.result);
                  reader.readAsDataURL(f);
                }} />
            </label>
            {v.logo ? (
              <img src={v.logo} alt="logo" className="w-10 h-10 rounded object-cover border border-slate-200" />
            ) : (
              <div className="w-10 h-10 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400"><ImageIcon size={14} /></div>
            )}
          </div>
        </div>
        <div>
          <Label className="text-xs">Brand Tagline Font Preference</Label>
          <Select value={v.font} onValueChange={(val) => update("font", val)}>
            <SelectTrigger data-testid="cust-font"><SelectValue /></SelectTrigger>
            <SelectContent>{FONT_PRESETS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </Section>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <button data-testid="cust-skip" onClick={() => onSkip()} className="text-sm text-slate-500 hover:text-slate-900 underline">
          Skip & Use Defaults
        </button>
        <Button data-testid="cust-generate" disabled={!valid} onClick={() => onSubmit(v)} className="bg-[#e11d48] hover:bg-[#be123c]">
          Generate Preview →
        </Button>
      </div>
    </div>
  );
};

// --------- ANDROID form ---------
export const AndroidCustomizationForm = ({ template, initial, onSubmit, onBack, onSkip }) => {
  const baseCategories = ANDROID_CATEGORIES_BY_TEMPLATE[template?.id] || ["Content", "Updates", "Settings"];
  const [v, setV] = useState({
    name: initial?.name || template?.name || "",
    slogan: initial?.slogan || template?.description || "",
    primaryColor: initial?.primaryColor || "#e11d48",
    iconStyle: initial?.iconStyle || "abstract",
    frequency: initial?.frequency || "Once daily",
    categories: initial?.categories || baseCategories.slice(0, 3),
    pushNotif: initial?.pushNotif ?? true,
    darkMode: initial?.darkMode ?? true,
    offlineMode: initial?.offlineMode ?? true,
    audience: initial?.audience || "General Public",
    language: initial?.language || "Bengali",
  });

  const update = (k, val) => setV((p) => ({ ...p, [k]: val }));
  const toggleCat = (c) => setV((p) => ({ ...p, categories: p.categories.includes(c) ? p.categories.filter((x) => x !== c) : [...p.categories, c] }));
  const valid = v.name.trim() && v.slogan.trim();

  return (
    <div data-testid="android-customization-form" className="space-y-5">
      <div className="flex items-center gap-2">
        <button onClick={onBack} data-testid="cust-back" className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1">
          <ArrowLeft size={14} /> Back
        </button>
        <div className="flex-1">
          <h2 className="font-bold text-xl tracking-tight">Tell Us About Your App</h2>
          <p className="text-xs text-slate-500">A few details so we can personalize your generated app preview.</p>
        </div>
      </div>

      <Section title="App Identity">
        <div>
          <Label className="text-xs">App Name<Req /></Label>
          <Input data-testid="cust-name" value={v.name} onChange={(e) => update("name", e.target.value)} />
        </div>
        <div>
          <Label className="text-xs">App Slogan<Req /></Label>
          <Input data-testid="cust-slogan" value={v.slogan} onChange={(e) => update("slogan", e.target.value)} />
        </div>
        <div>
          <Label className="text-xs">Primary Color</Label>
          <ColorSwatchPicker value={v.primaryColor} onChange={(c) => update("primaryColor", c)} testid="cust-primary" />
        </div>
        <div>
          <Label className="text-xs mb-2 block">App Icon Style</Label>
          <RadioGroup value={v.iconStyle} onValueChange={(val) => update("iconStyle", val)} className="grid grid-cols-3 gap-2">
            {[
              { v: "abstract", l: "Abstract Gradient", e: "🎨" },
              { v: "letter", l: "Minimal Letter", e: "A" },
              { v: "emoji", l: "Emoji / Character", e: "🐯" },
            ].map((o) => (
              <label key={o.v} className={`cursor-pointer rounded-md border-2 p-3 text-center ${v.iconStyle === o.v ? "border-[#e11d48] bg-rose-50" : "border-slate-200 hover:border-slate-400"}`}>
                <RadioGroupItem value={o.v} className="sr-only" data-testid={`icon-style-${o.v}`} />
                <div className="text-2xl mb-1">{o.e}</div>
                <div className="text-[10px] font-semibold">{o.l}</div>
              </label>
            ))}
          </RadioGroup>
        </div>
      </Section>

      <Section title="Content & Features">
        <div>
          <Label className="text-xs">Daily Content Frequency</Label>
          <Select value={v.frequency} onValueChange={(val) => update("frequency", val)}>
            <SelectTrigger data-testid="cust-frequency"><SelectValue /></SelectTrigger>
            <SelectContent>{["Once daily", "Twice daily", "Weekly", "Custom"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs mb-2 block">Content Categories</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {baseCategories.map((c) => (
              <label key={c} className="flex items-center gap-2 text-xs cursor-pointer p-2 border border-slate-200 rounded-md hover:border-slate-400">
                <Checkbox data-testid={`cat-${c.toLowerCase().replace(/[^a-z0-9]/gi, "-")}`} checked={v.categories.includes(c)} onCheckedChange={() => toggleCat(c)} />
                {c}
              </label>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between p-3 border border-slate-200 rounded-md">
          <Label className="text-sm cursor-pointer">Enable Push Notifications</Label>
          <Switch data-testid="cust-push" checked={v.pushNotif} onCheckedChange={(c) => update("pushNotif", c)} />
        </div>
        <div className="flex items-center justify-between p-3 border border-slate-200 rounded-md">
          <Label className="text-sm cursor-pointer">Enable Dark Mode Support</Label>
          <Switch data-testid="cust-dark" checked={v.darkMode} onCheckedChange={(c) => update("darkMode", c)} />
        </div>
        <div className="flex items-center justify-between p-3 border border-slate-200 rounded-md">
          <Label className="text-sm cursor-pointer">Enable Offline Mode</Label>
          <Switch data-testid="cust-offline" checked={v.offlineMode} onCheckedChange={(c) => update("offlineMode", c)} />
        </div>
      </Section>

      <Section title="Target Audience">
        <div>
          <Label className="text-xs">Primary Audience</Label>
          <Select value={v.audience} onValueChange={(val) => update("audience", val)}>
            <SelectTrigger data-testid="cust-audience"><SelectValue /></SelectTrigger>
            <SelectContent>{["General Public", "Youth (13-25)", "Adults (25-45)", "Seniors (45+)", "All Ages"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Primary Language</Label>
          <Select value={v.language} onValueChange={(val) => update("language", val)}>
            <SelectTrigger data-testid="cust-language"><SelectValue /></SelectTrigger>
            <SelectContent>{["Bengali", "English", "Both"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </Section>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <button data-testid="cust-skip" onClick={() => onSkip()} className="text-sm text-slate-500 hover:text-slate-900 underline">
          Skip & Use Defaults
        </button>
        <Button data-testid="cust-generate" disabled={!valid} onClick={() => onSubmit(v)} className="bg-[#e11d48] hover:bg-[#be123c]">
          Generate App Preview →
        </Button>
      </div>
    </div>
  );
};
