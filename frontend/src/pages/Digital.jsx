import React, { useState } from "react";
import Layout from "../components/Layout";
import { useApp } from "../context/AppContext";
import { LITE_TEMPLATES, PROVISIONING_TEMPLATES } from "../mocks/data";
import { WEB_TEMPLATES, ANDROID_TEMPLATES } from "../mocks/builderTemplates";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MyGeneratedAppsShelf from "../components/digital/MyGeneratedAppsShelf";
import TemplateGallery from "../components/digital/TemplateGallery";
import DesignChooserModal from "../components/digital/DesignChooserModal";
import AppBuilder from "../components/digital/AppBuilder";

const Digital = () => {
  const navigate = useNavigate();
  const { setPendingTemplate } = useApp();
  const [search, setSearch] = useState("");
  const [previewLite, setPreviewLite] = useState(null);
  const [previewPro, setPreviewPro] = useState(null);

  // Web/Android builder state
  const [activeBuilder, setActiveBuilder] = useState(null); // 'web' | 'android' | null
  const [chooserTemplate, setChooserTemplate] = useState(null);
  const [chooserType, setChooserType] = useState(null);
  const [builderState, setBuilderState] = useState(null); // { template, designId, type }

  const applyLite = (t) => {
    setPendingTemplate({ name: t.name, keyword: t.keyword, description: t.description, category: t.category });
    navigate("/lite/create", { state: { template: t } });
  };
  const applyPro = (t) => {
    setPendingTemplate({ name: t.name, description: t.description, apis: t.apis });
    navigate("/provisioning", { state: { openCreate: true } });
  };

  const filterLite = LITE_TEMPLATES.filter((t) => !search || t.name.toLowerCase().includes(search.toLowerCase()));
  const filterPro = PROVISIONING_TEMPLATES.filter((t) => !search || t.name.toLowerCase().includes(search.toLowerCase()));

  const openChooser = (tpl, type) => {
    setChooserTemplate(tpl);
    setChooserType(type);
  };
  const onGenerate = ({ template, designId }) => {
    setBuilderState({ template, designId, type: chooserType });
    setChooserTemplate(null);
  };
  const backToTemplates = () => setBuilderState(null);

  // If in builder, show builder view
  if (builderState) {
    return (
      <Layout>
        <AppBuilder
          template={builderState.template}
          designId={builderState.designId}
          type={builderState.type}
          onBack={backToTemplates}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Generated apps shelf */}
        <MyGeneratedAppsShelf />

        {/* Gradient hero */}
        <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#7f1d1d] text-white p-8 md:p-12">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#e11d48] opacity-30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-amber-500 opacity-20 rounded-full blur-3xl"></div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs uppercase tracking-widest font-bold mb-4 backdrop-blur-sm">
              <Sparkles size={12} /> Digital Hub
            </div>
            <h1 className="text-4xl md:text-6xl tracking-tighter font-bold leading-[0.95] max-w-3xl" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
              Build Faster with Digital Templates.
            </h1>
            <p className="text-slate-300 mt-3 max-w-xl leading-relaxed">
              Pre-configured blueprints for Lite, Pro, Web, and Android apps. Pick a template, customize a few fields, and ship.
            </p>
          </div>
        </div>

        <Tabs defaultValue="lite">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="lite" data-testid="tab-lite-templates">Lite Templates</TabsTrigger>
            <TabsTrigger value="pro" data-testid="tab-pro-templates">Provisioning Templates</TabsTrigger>
            <TabsTrigger value="web" data-testid="tab-web-builder">Web App Builder</TabsTrigger>
            <TabsTrigger value="android" data-testid="tab-android-builder">Android App Builder</TabsTrigger>
          </TabsList>

          {/* Lite */}
          <TabsContent value="lite" className="pt-6">
            <div className="relative max-w-md mb-5">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input data-testid="digital-search" placeholder="Search templates..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterLite.map((t) => (
                <div key={t.id} data-testid={`lite-tpl-${t.id}`} className="group border border-slate-200 rounded-md p-6 bg-white hover:border-[#e11d48] hover:-translate-y-1 transition-all hover:shadow-md">
                  <div className="flex justify-between mb-3 items-start">
                    <div className="text-4xl">{t.icon}</div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${t.category === "Alert" ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700"}`}>{t.category}</span>
                  </div>
                  <h3 className="font-semibold text-lg tracking-tight mb-1">{t.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed h-12">{t.description}</p>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" onClick={() => setPreviewLite(t)} data-testid={`preview-lite-${t.id}`}>Preview</Button>
                    <Button size="sm" onClick={() => applyLite(t)} data-testid={`use-lite-${t.id}`} className="bg-[#e11d48] hover:bg-[#be123c]">Use This Template <ArrowRight size={12} className="ml-1" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Pro */}
          <TabsContent value="pro" className="pt-6">
            <div className="relative max-w-md mb-5">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input placeholder="Search templates..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filterPro.map((t) => (
                <div key={t.id} data-testid={`pro-tpl-${t.id}`} className="group border border-slate-200 rounded-md p-6 bg-white hover:border-[#e11d48] hover:-translate-y-1 transition-all hover:shadow-md">
                  <div className="flex justify-between mb-3 items-start">
                    <div className="text-4xl">{t.icon}</div>
                    <div className="flex gap-1 flex-wrap justify-end">{t.apis.map((a) => <span key={a} className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-slate-100 text-[#0f172a] rounded">{a}</span>)}</div>
                  </div>
                  <h3 className="font-semibold text-lg tracking-tight mb-1">{t.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{t.description}</p>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" onClick={() => setPreviewPro(t)} data-testid={`preview-pro-${t.id}`}>Preview</Button>
                    <Button size="sm" onClick={() => applyPro(t)} data-testid={`use-pro-${t.id}`} className="bg-[#e11d48] hover:bg-[#be123c]">Use This Template <ArrowRight size={12} className="ml-1" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Web App Builder */}
          <TabsContent value="web" className="pt-6">
            <TemplateGallery
              templates={WEB_TEMPLATES}
              banner="All web apps are generated as React + Tailwind CSS projects — ready to run with npm install && npm start"
              onSelect={(t) => openChooser(t, "web")}
              testidPrefix="web"
            />
          </TabsContent>

          {/* Android App Builder */}
          <TabsContent value="android" className="pt-6">
            <TemplateGallery
              templates={ANDROID_TEMPLATES}
              banner="All Android apps are generated as Flutter projects — ready to build with flutter pub get && flutter run"
              badges={["Flutter 3.x", "Material 3 Design", "Supports Android 8+"]}
              onSelect={(t) => openChooser(t, "android")}
              testidPrefix="android"
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Design Chooser modal */}
      <DesignChooserModal
        template={chooserTemplate}
        open={!!chooserTemplate}
        onClose={() => setChooserTemplate(null)}
        onGenerate={onGenerate}
      />

      {/* Lite preview - phone screen */}
      <Dialog open={!!previewLite} onOpenChange={(o) => !o && setPreviewLite(null)}>
        <DialogContent data-testid="lite-preview">
          <DialogHeader><DialogTitle>{previewLite?.name}</DialogTitle><DialogDescription>{previewLite?.description}</DialogDescription></DialogHeader>
          {previewLite && (
            <div className="flex flex-col items-center pt-2">
              <div className="w-64 h-[450px] bg-[#0f172a] rounded-[2.5rem] p-3 shadow-2xl">
                <div className="bg-white h-full rounded-[2rem] overflow-hidden flex flex-col">
                  <div className="bg-slate-100 p-2 text-center text-xs font-mono">{previewLite.keyword} · 21333</div>
                  <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                    {previewLite.sample.map((m, i) => (
                      <div key={i} className="bg-emerald-50 border border-emerald-200 rounded-lg rounded-bl-sm p-2 text-xs max-w-[85%]">{m}</div>
                    ))}
                  </div>
                  <div className="border-t border-slate-200 p-2 text-xs text-slate-400">Reply STOP to unsubscribe</div>
                </div>
              </div>
              <div className="text-sm mt-4 grid grid-cols-2 gap-3 w-full">
                <div className="border border-slate-200 rounded-md p-3"><div className="text-xs text-slate-500 uppercase">Keyword</div><div className="font-mono font-bold">{previewLite.keyword}</div></div>
                <div className="border border-slate-200 rounded-md p-3"><div className="text-xs text-slate-500 uppercase">Subscribers</div><div className="font-bold">{previewLite.subscribers.toLocaleString()}+</div></div>
              </div>
              <Button onClick={() => applyLite(previewLite)} data-testid="lite-preview-use" className="mt-4 w-full bg-[#e11d48] hover:bg-[#be123c]">Use This Template</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Pro preview - architecture */}
      <Dialog open={!!previewPro} onOpenChange={(o) => !o && setPreviewPro(null)}>
        <DialogContent className="max-w-2xl" data-testid="pro-preview">
          <DialogHeader><DialogTitle>{previewPro?.name}</DialogTitle><DialogDescription>{previewPro?.description}</DialogDescription></DialogHeader>
          {previewPro && (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-md p-4 bg-slate-50">
                <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">Architecture Flow</div>
                <div className="flex items-center justify-between gap-2 overflow-x-auto">
                  {previewPro.flow.map((step, i) => (
                    <React.Fragment key={i}>
                      <div className="bg-white border-2 border-[#0f172a] rounded-md p-3 text-xs font-medium text-center min-w-[90px]">{step}</div>
                      {i < previewPro.flow.length - 1 && <ArrowRight size={20} className="text-[#e11d48] flex-shrink-0" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Pre-configured APIs</div>
                <div className="flex gap-2 flex-wrap">{previewPro.apis.map((a) => <span key={a} className="bg-[#e11d48] text-white text-xs font-bold uppercase px-2 py-1 rounded">{a}</span>)}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Sample Use Case</div>
                <p className="text-sm">{previewPro.useCase}</p>
              </div>
              <Button onClick={() => applyPro(previewPro)} data-testid="pro-preview-use" className="w-full bg-[#e11d48] hover:bg-[#be123c]">Use This Template</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Digital;
