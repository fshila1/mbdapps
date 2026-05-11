import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft, Download, Github, Rocket, Link2, Lock, Copy, Check, Star, Loader2, Code as CodeIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "../ui/dialog";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { toast } from "sonner";
import RealisticPhonePreview from "./RealisticPhonePreview";
import BrowserPreview from "./BrowserPreview";
import CodeDrawer from "./CodeDrawer";
import WhatsIncluded from "./WhatsIncluded";
import { DESIGN_OPTIONS, WEB_DESIGN_OPTIONS, EMOJI_PALETTE } from "../../mocks/builderTemplates";
import { useGeneratedApps, useTemplateRatings } from "../../hooks/useBuilderStorage";
import { useApp } from "../../context/AppContext";

const randomId = (n = 6) =>
  Math.random().toString(36).slice(2, 2 + n).padEnd(n, "0");

// ---------- Progress modal helper ----------
const ProgressModal = ({ open, title, steps, currentStep, done, doneTitle, doneBody, onClose, footer, testid }) => (
  <Dialog open={open} onOpenChange={(o) => !o && onClose && onClose()}>
    <DialogContent data-testid={testid} className="max-w-md">
      {done ? (
        <>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Check size={18} />
              </div>
              <div>
                <DialogTitle>{doneTitle}</DialogTitle>
                <DialogDescription>{doneBody}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          {footer}
        </>
      ) : (
        <>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>Please wait while we work...</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-3 text-sm">
                {i < currentStep ? (
                  <Check size={14} className="text-emerald-600" />
                ) : i === currentStep ? (
                  <Loader2 size={14} className="animate-spin text-[#7c3aed]" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-300"></div>
                )}
                <span className={i <= currentStep ? "text-slate-900" : "text-slate-400"}>{s}</span>
              </div>
            ))}
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className="h-full bg-[#7c3aed] transition-all duration-500"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </>
      )}
    </DialogContent>
  </Dialog>
);

// ---------- Rate Template ----------
const RateTemplate = ({ templateId }) => {
  const { getUserRating, setRating } = useTemplateRatings();
  const userRating = getUserRating(templateId);
  const [hover, setHover] = useState(0);
  const active = hover || userRating;

  return (
    <div data-testid="rate-template" className="border border-slate-200 rounded-xl bg-white p-4">
      <div className="text-sm font-semibold tracking-tight mb-1">Rate This Template</div>
      <div className="text-xs text-slate-500 mb-3">How would you rate this template?</div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            data-testid={`rate-star-${s}`}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            onClick={() => {
              setRating(templateId, s);
              toast.success("Thanks for your rating!");
            }}
            className="p-0.5"
          >
            <Star
              size={22}
              className={s <= active ? "text-amber-400 fill-amber-400" : "text-slate-300"}
            />
          </button>
        ))}
        {userRating > 0 && <span className="text-xs text-slate-500 ml-2">You rated {userRating}/5</span>}
      </div>
    </div>
  );
};

// ---------- Main App Builder ----------
const AppBuilder = ({ template, designId, type, customization, onBack }) => {
  const designSet = type === "web" ? WEB_DESIGN_OPTIONS : DESIGN_OPTIONS;
  const design = designSet.find((d) => d.id === designId) || designSet[0];
  const { user } = useApp();
  const { addApp } = useGeneratedApps();

  const [appName, setAppName] = useState(customization?.name || template.name);
  const [appDesc, setAppDesc] = useState(template.description);
  const [tagline, setTagline] = useState(customization?.tagline || customization?.slogan || template.description);
  const [color, setColor] = useState(customization?.primaryColor || "#e11d48");
  const [secondaryColor] = useState(customization?.secondaryColor || "#0f172a");
  const [icon, setIcon] = useState(template.icon);
  const [devName, setDevName] = useState(user?.name || user?.username || "Developer");
  const [version, setVersion] = useState("1.0.0");
  const [codeOpen, setCodeOpen] = useState(false);

  // Preview-share state
  const [previewUrl, setPreviewUrl] = useState("");

  // Download flow
  const [dlOpen, setDlOpen] = useState(false);
  const [dlStep, setDlStep] = useState(0);
  const [dlDone, setDlDone] = useState(false);

  // GitHub flow
  const [ghOpen, setGhOpen] = useState(false);
  const [ghConnected, setGhConnected] = useState(false);
  const [repoName, setRepoName] = useState(`bdapps-${template.slug}`);
  const [visibility, setVisibility] = useState("Public");
  const [branch, setBranch] = useState("main");
  const [ghPushing, setGhPushing] = useState(false);
  const [ghStep, setGhStep] = useState(0);
  const [ghDone, setGhDone] = useState(false);
  const [ghRepoUrl, setGhRepoUrl] = useState("");

  // Deploy flow (web)
  const [deployOpen, setDeployOpen] = useState(false);
  const [deployProvider, setDeployProvider] = useState(null); // 'netlify' | 'vercel'
  const [deployStep, setDeployStep] = useState(0);
  const [deployDone, setDeployDone] = useState(false);
  const [deployUrl, setDeployUrl] = useState("");

  // Play store upgrade modal (android)
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const zipName = useMemo(() => {
    const base = template.slug;
    return type === "web" ? `${base}-app.zip` : `${base}-flutter.zip`;
  }, [template.slug, type]);

  const username = user?.username || "developer";

  // Helper: record generated app to shelf
  const recordApp = (overrides = {}) => {
    addApp({
      id: `${template.id}-${designId}-${appName.toLowerCase().replace(/\s+/g, "-")}`,
      type,
      templateId: template.id,
      templateName: template.name,
      slug: template.slug,
      appName,
      icon,
      color,
      designId,
      zipName,
      previewUrl,
      ...overrides,
    });
  };

  // --- Share preview ---
  const onSharePreview = () => {
    const url = `preview.bdapps.com/app/${randomId()}`;
    setPreviewUrl(url);
    navigator.clipboard?.writeText(url).catch(() => {});
    toast.success(`Preview link copied! ${url}`);
  };

  // --- Download ---
  const onDownload = () => {
    setDlOpen(true);
    setDlDone(false);
    setDlStep(0);
    const steps = ["Preparing project files", "Bundling assets", "Compressing zip"];
    let i = 0;
    const tick = setInterval(() => {
      i += 1;
      setDlStep(i);
      if (i >= steps.length) {
        clearInterval(tick);
        setTimeout(() => {
          setDlDone(true);
          recordApp();
          toast.success(`Code ready! ${zipName}`);
        }, 250);
      }
    }, 600);
  };

  // --- GitHub push ---
  const onPushGithub = () => {
    if (!ghConnected) {
      toast.error("Please connect GitHub first");
      return;
    }
    setGhPushing(true);
    setGhDone(false);
    setGhStep(0);
    const steps = ["Initializing repo...", "Pushing files...", "Setting up README..."];
    let i = 0;
    const tick = setInterval(() => {
      i += 1;
      setGhStep(i);
      if (i >= steps.length) {
        clearInterval(tick);
        setTimeout(() => {
          setGhPushing(false);
          setGhDone(true);
          const url = `github.com/${username}/${repoName}`;
          setGhRepoUrl(url);
          recordApp({ repoUrl: url });
          toast.success(`Pushed to ${url}`);
        }, 250);
      }
    }, 800);
  };

  // --- Deploy ---
  const onDeploy = (provider) => {
    setDeployProvider(provider);
    setDeployStep(0);
    setDeployDone(false);
    const steps = ["Building...", "Deploying...", "Live!"];
    let i = 0;
    const tick = setInterval(() => {
      i += 1;
      setDeployStep(i);
      if (i >= steps.length) {
        clearInterval(tick);
        const host = provider === "netlify" ? "netlify.app" : "vercel.app";
        const slug = `${template.slug}-${randomId(4)}`;
        const url = `${slug}.${host}`;
        setTimeout(() => {
          setDeployDone(true);
          setDeployUrl(url);
          recordApp({ deployUrl: url });
          toast.success(`🎉 Deployed! ${url}`);
        }, 250);
      }
    }, 700);
  };

  const onCopyDeploy = () => {
    navigator.clipboard?.writeText(deployUrl).catch(() => {});
    toast.success("URL copied!");
  };

  const onConnectGh = () => {
    setGhConnected(true);
    toast.success("GitHub connected successfully");
  };

  return (
    <div data-testid="app-builder-view" className="space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          data-testid="builder-back"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} /> Back to Templates
        </button>
        <div className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-800">{template.name}</span>
          <span>›</span>
          <span className="font-semibold text-[#7c3aed]">{design.name}</span>
        </div>
      </div>

      <div data-tour="preview-pane" className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5">
        {/* LEFT — config */}
        <div data-tour="cust-form" className="space-y-4 border border-slate-200 rounded-2xl bg-white p-5 h-fit">
          <div>
            <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-1">App Configuration</div>
            <div className="text-xs text-slate-400">Customize your app details</div>
          </div>

          <div>
            <Label className="text-xs">App Name <span className="text-rose-500">*</span></Label>
            <Input data-testid="builder-app-name" value={appName} onChange={(e) => setAppName(e.target.value)} className="mt-1" />
          </div>

          <div>
            <Label className="text-xs">App Description</Label>
            <Textarea data-testid="builder-app-desc" value={appDesc} onChange={(e) => setAppDesc(e.target.value)} rows={3} className="mt-1 text-sm" />
          </div>

          <div>
            <Label className="text-xs">Primary Color</Label>
            <div className="flex items-center gap-2 mt-1">
              <input
                data-testid="builder-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-10 rounded-md border border-slate-200 cursor-pointer"
              />
              <Input value={color} onChange={(e) => setColor(e.target.value)} className="font-mono text-xs" />
            </div>
          </div>

          <div>
            <Label className="text-xs">App Icon</Label>
            <div className="grid grid-cols-6 gap-1.5 mt-1">
              {EMOJI_PALETTE.map((e) => (
                <button
                  key={e}
                  data-testid={`builder-emoji-${e}`}
                  onClick={() => setIcon(e)}
                  className={`text-xl h-9 rounded-md border transition-all ${
                    icon === e ? "border-[#7c3aed] bg-purple-50 ring-2 ring-purple-200" : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs">Developer Name</Label>
            <Input data-testid="builder-dev-name" value={devName} onChange={(e) => setDevName(e.target.value)} className="mt-1" />
          </div>

          <div>
            <Label className="text-xs">Version</Label>
            <Input data-testid="builder-version" value={version} onChange={(e) => setVersion(e.target.value)} className="mt-1" />
          </div>
        </div>

        {/* RIGHT — preview + actions */}
        <div className="space-y-4">
          <div className="border border-slate-200 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 p-6 flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-3">
              <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
                Live {type === "web" ? "Web" : "App"} Preview
              </div>
              <button
                data-testid="view-code-toggle"
                onClick={() => setCodeOpen(true)}
                className="text-xs font-semibold flex items-center gap-1.5 text-slate-600 hover:text-[#0f172a] px-2.5 py-1.5 border border-slate-200 rounded-md bg-white"
              >
                <CodeIcon size={12} /> View Code
              </button>
            </div>
            {type === "web" ? (
              <BrowserPreview
                design={designId}
                url={previewUrl || `preview.bdapps.app/${template.slug}`}
                appName={appName}
                tagline={tagline}
                primaryColor={color}
                secondaryColor={secondaryColor}
              />
            ) : (
              <RealisticPhonePreview
                design={designId}
                color={color}
                appName={appName}
                tagline={tagline}
                icon={icon}
                categories={customization?.categories || []}
              />
            )}
            {previewUrl && (
              <div data-testid="preview-share-badge" className="mt-4 flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1.5 text-xs">
                <Link2 size={12} className="text-[#7c3aed]" />
                <span className="font-mono">{previewUrl}</span>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(previewUrl).catch(() => {});
                    toast.success("URL copied!");
                  }}
                  className="hover:text-[#7c3aed]"
                >
                  <Copy size={12} />
                </button>
              </div>
            )}

            {type === "android" && (
              <div data-testid="play-store-badge" className="mt-5 flex flex-col items-center gap-2">
                <div className="bg-gradient-to-br from-slate-700 to-slate-900 text-white rounded-lg px-4 py-2 text-xs font-semibold flex items-center gap-2 shadow-md">
                  <span className="text-base">▶</span>
                  <div className="text-left">
                    <div className="text-[8px] uppercase tracking-widest opacity-70">Get it on</div>
                    <div className="text-sm leading-none">Google Play</div>
                  </div>
                </div>
                <button
                  data-testid="submit-play-store-badge"
                  onClick={() => setUpgradeOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700"
                  title="Available in Pro Plan — submit your app directly to Google Play Store"
                >
                  <Lock size={11} /> Submit to Play Store
                </button>
              </div>
            )}
          </div>

          {/* Action bar */}
          <div data-tour="action-bar" className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button data-testid="action-share" onClick={onSharePreview} variant="outline" className="gap-2">
              <Link2 size={14} /> Share Preview
            </Button>
            <Button data-testid="action-download" onClick={onDownload} variant="outline" className="gap-2">
              <Download size={14} /> Download Code
            </Button>
            <Button data-testid="action-github" onClick={() => { setGhOpen(true); setGhDone(false); setGhStep(0); }} variant="outline" className="gap-2">
              <Github size={14} /> Push to GitHub
            </Button>
            {type === "web" ? (
              <Button data-testid="action-deploy" onClick={() => { setDeployOpen(true); setDeployProvider(null); setDeployDone(false); setDeployStep(0); }} className="gap-2 bg-[#e11d48] hover:bg-[#be123c]" title="One-click deploy to production">
                <Rocket size={14} /> Deploy to Web
              </Button>
            ) : (
              <Button
                data-testid="action-playstore"
                onClick={() => setUpgradeOpen(true)}
                disabled
                title="Submit to Google Play Store — Available in Pro Plan"
                className="gap-2 bg-slate-300 text-slate-600 hover:bg-slate-300 cursor-not-allowed opacity-70"
              >
                <Lock size={14} /> Submit to Play Store
              </Button>
            )}
          </div>

          <RateTemplate templateId={template.id} />
          <WhatsIncluded type={type} sectionsCount={parseInt(customization?.sections, 10) || 4} />
        </div>
      </div>

      {/* Code drawer */}
      <CodeDrawer
        open={codeOpen}
        onClose={() => setCodeOpen(false)}
        type={type}
        appName={appName}
        primaryColor={color}
        tagline={tagline}
      />

      {/* Download progress */}
      <ProgressModal
        testid="download-progress-modal"
        open={dlOpen}
        title="Preparing your code..."
        steps={["Preparing project files", "Bundling assets", "Compressing zip"]}
        currentStep={dlStep}
        done={dlDone}
        doneTitle="Code ready!"
        doneBody={`${zipName} has been packaged.`}
        onClose={() => setDlOpen(false)}
        footer={
          <DialogFooter>
            <Button data-testid="download-close" onClick={() => setDlOpen(false)} className="bg-emerald-600 hover:bg-emerald-700">Done</Button>
          </DialogFooter>
        }
      />

      {/* GitHub modal */}
      <Dialog open={ghOpen} onOpenChange={(o) => !o && setGhOpen(false)}>
        <DialogContent data-testid="github-modal" className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Github size={18} /> Push to GitHub
            </DialogTitle>
            <DialogDescription>Create a repository and push your generated code.</DialogDescription>
          </DialogHeader>

          {ghDone ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-md">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Check size={16} />
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Repository pushed!</div>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-[#7c3aed] hover:underline font-mono text-xs">{ghRepoUrl}</a>
                </div>
              </div>
              <DialogFooter>
                <Button data-testid="github-done" onClick={() => setGhOpen(false)} className="bg-emerald-600 hover:bg-emerald-700">Done</Button>
              </DialogFooter>
            </div>
          ) : ghPushing ? (
            <div className="space-y-2">
              {["Initializing repo...", "Pushing files...", "Setting up README..."].map((s, i) => (
                <div key={s} className="flex items-center gap-3 text-sm">
                  {i < ghStep ? (
                    <Check size={14} className="text-emerald-600" />
                  ) : i === ghStep ? (
                    <Loader2 size={14} className="animate-spin text-[#7c3aed]" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-300"></div>
                  )}
                  <span className={i <= ghStep ? "text-slate-900" : "text-slate-400"}>{s}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Repository name <span className="text-rose-500">*</span></Label>
                <Input data-testid="gh-repo-name" value={repoName} onChange={(e) => setRepoName(e.target.value)} className="mt-1 font-mono text-sm" />
              </div>
              <div>
                <Label className="text-xs mb-1.5 block">Visibility</Label>
                <RadioGroup value={visibility} onValueChange={setVisibility} className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <RadioGroupItem value="Public" data-testid="gh-vis-public" /> Public
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <RadioGroupItem value="Private" data-testid="gh-vis-private" /> Private
                  </label>
                </RadioGroup>
              </div>
              <div>
                <Label className="text-xs">Branch</Label>
                <Input data-testid="gh-branch" value={branch} onChange={(e) => setBranch(e.target.value)} className="mt-1 font-mono text-sm" />
              </div>

              {!ghConnected ? (
                <button data-testid="gh-connect" onClick={onConnectGh} className="text-sm text-[#7c3aed] hover:underline font-semibold">
                  Connect GitHub Account →
                </button>
              ) : (
                <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                  <Check size={12} /> GitHub connected
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setGhOpen(false)}>Cancel</Button>
                <Button data-testid="gh-push" onClick={onPushGithub} disabled={!ghConnected || !repoName} className="bg-slate-900 hover:bg-slate-800">
                  Push Repository
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Deploy modal */}
      <Dialog open={deployOpen} onOpenChange={(o) => !o && setDeployOpen(false)}>
        <DialogContent data-testid="deploy-modal" className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Deploy to Web</DialogTitle>
            <DialogDescription>Choose a deployment provider.</DialogDescription>
          </DialogHeader>

          {deployDone ? (
            <div className="space-y-3">
              <div className="text-center py-2">
                <div className="text-4xl mb-2">🎉</div>
                <div className="font-bold text-lg">Deployed!</div>
                <div className="flex items-center justify-center gap-2 mt-2 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                  <span className="font-mono text-sm">{deployUrl}</span>
                  <button data-testid="deploy-copy" onClick={onCopyDeploy} className="text-[#7c3aed] hover:text-[#5b21b6]"><Copy size={14} /></button>
                </div>
              </div>
              <DialogFooter>
                <Button data-testid="deploy-done" onClick={() => setDeployOpen(false)} className="bg-emerald-600 hover:bg-emerald-700">Done</Button>
              </DialogFooter>
            </div>
          ) : deployProvider ? (
            <div className="space-y-2 py-2">
              {["Building...", "Deploying...", "Live!"].map((s, i) => (
                <div key={s} className="flex items-center gap-3 text-sm">
                  {i < deployStep ? (
                    <Check size={14} className="text-emerald-600" />
                  ) : i === deployStep ? (
                    <Loader2 size={14} className="animate-spin text-[#7c3aed]" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-300"></div>
                  )}
                  <span className={i <= deployStep ? "text-slate-900" : "text-slate-400"}>{s}</span>
                </div>
              ))}
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                <div className="h-full bg-[#7c3aed] transition-all duration-500" style={{ width: `${(deployStep / 3) * 100}%` }} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                data-testid="deploy-netlify"
                onClick={() => onDeploy("netlify")}
                className="text-left rounded-xl border-2 border-teal-200 bg-gradient-to-br from-teal-500 to-cyan-600 text-white p-4 hover:scale-[1.02] transition-transform"
              >
                <div className="text-3xl mb-2">◆</div>
                <div className="font-bold text-lg">Deploy to Netlify</div>
                <div className="text-xs text-white/80 mt-1">Auto deploys from GitHub</div>
              </button>
              <button
                data-testid="deploy-vercel"
                onClick={() => onDeploy("vercel")}
                className="text-left rounded-xl border-2 border-slate-700 bg-slate-900 text-white p-4 hover:scale-[1.02] transition-transform"
              >
                <div className="text-3xl mb-2">▲</div>
                <div className="font-bold text-lg">Deploy to Vercel</div>
                <div className="text-xs text-white/80 mt-1">Fastest edge network</div>
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Upgrade modal */}
      <Dialog open={upgradeOpen} onOpenChange={(o) => !o && setUpgradeOpen(false)}>
        <DialogContent data-testid="upgrade-modal" className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Rocket size={18} className="text-[#e11d48]" /> Upgrade to BDapps Pro
            </DialogTitle>
            <DialogDescription>Unlock professional features for production-ready apps.</DialogDescription>
          </DialogHeader>
          <ul className="space-y-2 text-sm">
            {[
              "Submit apps directly to Google Play Store",
              "Priority support from our team",
              "Advanced analytics & user insights",
              "Custom branding & white-label options",
              "Unlimited app generations",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600 flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <DialogFooter>
            <Button variant="outline" data-testid="upgrade-later" onClick={() => setUpgradeOpen(false)}>Maybe Later</Button>
            <Button
              data-testid="upgrade-now"
              onClick={() => {
                toast.success("Redirecting to upgrade...");
                setUpgradeOpen(false);
              }}
              className="bg-[#e11d48] hover:bg-[#be123c]"
            >
              Upgrade Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppBuilder;
