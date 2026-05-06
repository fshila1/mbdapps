import React, { useState, useMemo } from "react";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import { useApp } from "../context/AppContext";
import { ALL_STATUSES } from "../mocks/data";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { Checkbox } from "../components/ui/checkbox";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "../components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Search, Grid2X2, List, Plus, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

const PER_PAGE = 3;
const API_OPTIONS = ["SMS", "USSD", "CaaS", "Subscription", "Downloadable", "OTP"];

export const CreateAppDialog = ({ open, onOpenChange, prefill = null }) => {
  const { addApp } = useApp();
  const [step, setStep] = useState(1);
  const [detailsTab, setDetailsTab] = useState("basic");
  const [basic, setBasic] = useState({ name: "", description: "", host: "", whitelist: "", blacklist: "" });
  const [advanced, setAdvanced] = useState({ contentGov: true, ads: true, masking: true, autoExpire: false, chargingSdk: false, startTime: new Date().toISOString().slice(0, 16) });
  const [services, setServices] = useState({ operator: true, apis: [] });
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (open && prefill) {
      setBasic({ name: prefill.name || "", description: prefill.description || "", host: "https://api.bdapps.dev", whitelist: "", blacklist: "" });
      setServices({ operator: true, apis: prefill.apis || [] });
      setStep(1);
    } else if (open && !prefill) {
      setBasic({ name: "", description: "", host: "", whitelist: "", blacklist: "" });
      setServices({ operator: true, apis: [] });
      setStep(1);
    }
  }, [open, prefill]);

  const toggleApi = (api) => {
    setServices((s) => ({ ...s, apis: s.apis.includes(api) ? s.apis.filter((a) => a !== api) : [...s.apis, api] }));
  };

  const validateStep1 = () => {
    const e = {};
    if (!basic.name) e.name = "Required";
    if (!basic.description) e.description = "Required";
    if (!basic.host) e.host = "Required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = () => {
    addApp({
      name: basic.name,
      description: basic.description,
      host: basic.host,
      type: services.apis.length > 1 ? "Pro" : "Lite",
      apis: services.apis,
    });
    toast.success("App submitted! Awaiting admin approval.");
    onOpenChange(false);
    setStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="create-app-dialog">
        <DialogHeader>
          <DialogTitle className="text-2xl tracking-tight" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Create New App</DialogTitle>
          <DialogDescription>Step {step} of 3</DialogDescription>
        </DialogHeader>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-4">
          {["Details", "Services", "Settings"].map((s, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`h-1 w-full rounded-full ${step >= i + 1 ? "bg-[#e11d48]" : "bg-slate-200"}`}></div>
              <span className={`text-xs font-semibold whitespace-nowrap ${step >= i + 1 ? "text-[#0f172a]" : "text-slate-400"}`}>{s}</span>
            </div>
          ))}
        </div>

        {step === 1 && (
          <Tabs value={detailsTab} onValueChange={setDetailsTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="basic" data-testid="tab-basic">Basic</TabsTrigger>
              <TabsTrigger value="advanced" data-testid="tab-advanced">Advanced</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-4 pt-4">
              <div>
                <Label>App Name *</Label>
                <Input data-testid="app-name" value={basic.name} onChange={(e) => setBasic({ ...basic, name: e.target.value })} className={errors.name ? "border-rose-500" : ""} />
                {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label>App Description *</Label>
                <Textarea data-testid="app-desc" value={basic.description} onChange={(e) => setBasic({ ...basic, description: e.target.value })} className={errors.description ? "border-rose-500" : ""} />
                {errors.description && <p className="text-xs text-rose-600 mt-1">{errors.description}</p>}
              </div>
              <div>
                <Label>Allowed Host Address *</Label>
                <Input data-testid="app-host" placeholder="https://api.example.com" value={basic.host} onChange={(e) => setBasic({ ...basic, host: e.target.value })} className={errors.host ? "border-rose-500" : ""} />
                {errors.host && <p className="text-xs text-rose-600 mt-1">{errors.host}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Whitelisted Numbers</Label>
                  <Input placeholder="comma separated" value={basic.whitelist} onChange={(e) => setBasic({ ...basic, whitelist: e.target.value })} />
                </div>
                <div>
                  <Label>Blacklisted Numbers</Label>
                  <Input placeholder="comma separated" value={basic.blacklist} onChange={(e) => setBasic({ ...basic, blacklist: e.target.value })} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="advanced" className="space-y-4 pt-4">
              {[
                { k: "contentGov", l: "Auto Content Governance" },
                { k: "ads", l: "Enable Ads" },
                { k: "masking", l: "Mobile Number Masking" },
                { k: "autoExpire", l: "Auto Expiration" },
                { k: "chargingSdk", l: "Charging SDK" },
              ].map((it) => (
                <div key={it.k} className="flex items-center justify-between border border-slate-200 rounded-md p-4">
                  <Label>{it.l}</Label>
                  <Switch data-testid={`adv-${it.k}`} checked={advanced[it.k]} onCheckedChange={(v) => setAdvanced({ ...advanced, [it.k]: v })} />
                </div>
              ))}
              <div>
                <Label>App Start Time</Label>
                <Input type="datetime-local" value={advanced.startTime} onChange={(e) => setAdvanced({ ...advanced, startTime: e.target.value })} />
              </div>
            </TabsContent>
          </Tabs>
        )}

        {step === 2 && (
          <div className="space-y-5 pt-2">
            <div>
              <Label className="mb-2 block">Operator</Label>
              <label className="flex items-center gap-2 border border-slate-200 rounded-md p-3 cursor-pointer hover:border-[#0f172a]">
                <Checkbox checked={services.operator} onCheckedChange={(v) => setServices({ ...services, operator: !!v })} data-testid="op-robi" />
                <span className="font-medium">Robi</span>
              </label>
            </div>
            <div>
              <Label className="mb-2 block">Choose APIs</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {API_OPTIONS.map((api) => (
                  <label key={api} className={`flex items-center gap-2 border rounded-md p-3 cursor-pointer transition ${services.apis.includes(api) ? "border-[#e11d48] bg-rose-50" : "border-slate-200 hover:border-[#0f172a]"}`}>
                    <Checkbox checked={services.apis.includes(api)} onCheckedChange={() => toggleApi(api)} data-testid={`api-${api}`} />
                    <span className="font-medium">{api}</span>
                  </label>
                ))}
              </div>
            </div>
            {services.apis.length > 0 && (
              <div className="border border-slate-200 rounded-md p-4 bg-slate-50">
                <Tabs defaultValue={services.apis[0]}>
                  <TabsList className="flex-wrap h-auto">
                    {services.apis.map((api) => <TabsTrigger key={api} value={api}>{api}</TabsTrigger>)}
                  </TabsList>
                  {services.apis.map((api) => (
                    <TabsContent key={api} value={api} className="pt-4 space-y-3">
                      <ApiConfig api={api} />
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-lg font-semibold tracking-tight">Review & Submit</h3>
            <div className="border border-slate-200 rounded-md divide-y divide-slate-200">
              {[
                ["App Name", basic.name],
                ["Description", basic.description],
                ["Host", basic.host],
                ["Operator", services.operator ? "Robi" : "—"],
                ["APIs", services.apis.join(", ") || "None"],
                ["Content Governance", advanced.contentGov ? "Yes" : "No"],
                ["Ads", advanced.ads ? "Yes" : "No"],
                ["Masking", advanced.masking ? "Yes" : "No"],
              ].map(([k, v], i) => (
                <div key={i} className="flex justify-between p-3 text-sm">
                  <span className="text-slate-500 uppercase tracking-wide font-semibold text-xs">{k}</span>
                  <span className="font-medium text-right max-w-[60%]">{v || "—"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="!justify-between gap-2">
          <Button variant="outline" disabled={step === 1} onClick={() => setStep(step - 1)} data-testid="wizard-back">Back</Button>
          {step < 3 ? (
            <Button data-testid="wizard-next" className="bg-[#e11d48] hover:bg-[#be123c]" onClick={() => {
              if (step === 1 && !validateStep1()) return;
              if (step === 2 && services.apis.length === 0) return toast.error("Select at least one API");
              setStep(step + 1);
            }}>Next</Button>
          ) : (
            <Button data-testid="wizard-submit" className="bg-[#e11d48] hover:bg-[#be123c]" onClick={submit}>Submit</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ApiConfig = ({ api }) => {
  if (api === "SMS") return (
    <>
      <div className="flex items-center justify-between"><Label>MO Enabled</Label><Switch defaultChecked /></div>
      <div><Label>Message URL</Label><Input placeholder="https://api.example.com/sms" /></div>
      <div className="flex items-center justify-between"><Label>MT Enabled</Label><Switch defaultChecked /></div>
      <div><Label>Sender Address</Label><Input placeholder="21333" /></div>
      <div className="flex items-center justify-between"><Label>Delivery Reports</Label><Switch defaultChecked /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Robi Short Code</Label><Input defaultValue="21333" /></div>
        <div><Label>Keyword</Label><Input placeholder="MYAPP" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>MPS</Label><Input defaultValue="100" /></div>
        <div><Label>MPD</Label><Input defaultValue="10000" /></div>
      </div>
    </>
  );
  if (api === "USSD") return (
    <>
      <div><Label>Connection URL</Label><Input placeholder="https://api.example.com/ussd" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Service Code</Label><Input defaultValue="*123*45#" /></div>
        <div><Label>Keyword (numeric)</Label><Input defaultValue="45" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>MPS</Label><Input defaultValue="50" /></div>
        <div><Label>MPD</Label><Input defaultValue="5000" /></div>
      </div>
      <div className="flex items-center justify-between"><Label>Charging Enabled</Label><Switch /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Charged Party</Label><Select defaultValue="subscriber"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="subscriber">Subscriber</SelectItem><SelectItem value="developer">Developer</SelectItem></SelectContent></Select></div>
        <div><Label>Amount (BDT)</Label><Input defaultValue="1" /></div>
      </div>
    </>
  );
  if (api === "CaaS") return (
    <>
      <div><Label>Charging Notification URL</Label><Input placeholder="optional" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Max TPS</Label><Input defaultValue="100" /></div>
        <div><Label>Max TPD</Label><Input defaultValue="10000" /></div>
      </div>
      <div className="flex items-center justify-between"><Label>Debit Requests</Label><Switch defaultChecked /></div>
      <div className="flex items-center justify-between"><Label>Mobile Account</Label><Switch defaultChecked /></div>
    </>
  );
  if (api === "Subscription") return (
    <>
      <div><Label>Welcome Message *</Label><Textarea defaultValue="Welcome! You have subscribed." /></div>
      <div><Label>Notification URL</Label><Input placeholder="https://..." /></div>
      <div className="flex items-center justify-between"><Label>Allow HTTP</Label><Switch /></div>
      <div className="flex items-center justify-between"><Label>Confirmation Required</Label><Switch checked disabled /></div>
      <div><Label>Broadcast MPD</Label><Input defaultValue="1000" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Charging Frequency</Label><Select defaultValue="daily"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="daily">Daily</SelectItem><SelectItem value="weekly">Weekly</SelectItem><SelectItem value="monthly">Monthly</SelectItem></SelectContent></Select></div>
        <div><Label>Amount (BDT)</Label><Input defaultValue="2" /></div>
      </div>
    </>
  );
  if (api === "Downloadable") return (
    <>
      <div><Label>SDK Version</Label><Select defaultValue="v3"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="v3">v3.2</SelectItem><SelectItem value="v2">v2.8</SelectItem></SelectContent></Select></div>
      <div><Label>Build Version</Label><Input defaultValue="1.0.0" /></div>
      <div><Label>APK Upload</Label><Input type="file" accept=".apk" /></div>
    </>
  );
  if (api === "OTP") return (
    <div className="text-sm text-slate-600 p-3 bg-emerald-50 border border-emerald-200 rounded-md">
      OTP service configured. Default TTL: 5 minutes. Max retries: 3.
    </div>
  );
  return null;
};

const AppDetailDialog = ({ app, onClose }) => {
  if (!app) return null;
  return (
    <Dialog open={!!app} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="app-detail-dialog">
        <DialogHeader>
          <DialogTitle className="text-2xl tracking-tight flex items-center gap-3" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
            {app.name} <StatusBadge status={app.status} />
          </DialogTitle>
          <DialogDescription>{app.id} · {app.type} · {app.username}</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="general">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="apis">APIs</TabsTrigger>
            <TabsTrigger value="charging">Charging</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Share</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="space-y-3 pt-4">
            {[["App ID", app.id], ["Type", app.type], ["Created", app.created], ["Host", app.host || "—"], ["Description", app.description]].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-500 text-xs uppercase font-semibold tracking-wide">{k}</span><span className="font-medium">{v}</span></div>
            ))}
          </TabsContent>
          <TabsContent value="apis" className="pt-4">
            {app.apis?.length ? (
              <div className="space-y-2">
                {app.apis.map((api) => (
                  <div key={api} className="border border-slate-200 rounded-md p-3 flex justify-between"><span className="font-semibold">{api}</span><span className="text-xs text-emerald-600 font-bold">CONFIGURED</span></div>
                ))}
              </div>
            ) : <p className="text-slate-500 text-sm">No APIs configured.</p>}
          </TabsContent>
          <TabsContent value="charging" className="pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Default Frequency</span><span className="font-medium">Daily</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Default Amount</span><span className="font-medium">BDT 2.00</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Charged Party</span><span className="font-medium">Subscriber</span></div>
          </TabsContent>
          <TabsContent value="revenue" className="pt-4">
            <div className="space-y-3">
              {Object.entries(app.revenueShare || {}).map(([k, v]) => (
                <div key={k}>
                  <div className="flex justify-between text-sm mb-1"><span className="capitalize">{k}</span><span className="font-bold">{v}%</span></div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-[#e11d48]" style={{ width: `${v}%` }}></div></div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="activity" className="pt-4">
            <div className="space-y-3">
              {(app.activity || []).map((a, i) => (
                <div key={i} className="border-l-2 border-[#e11d48] pl-3 py-1">
                  <div className="text-xs text-slate-500">{a.date} · {a.actor}</div>
                  <div className="text-sm font-medium">{a.remark}</div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const Provisioning = () => {
  const { apps, pendingTemplate, setPendingTemplate } = useApp();
  const navigate = useNavigate();
  const loc = useLocation();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("any");
  const [filterStatus, setFilterStatus] = useState("any");
  const [filterOp, setFilterOp] = useState("any");
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailApp, setDetailApp] = useState(null);

  React.useEffect(() => {
    if (loc.state?.openCreate || pendingTemplate) {
      setCreateOpen(true);
    }
  }, [loc.state, pendingTemplate]);

  const filtered = useMemo(() => apps.filter((a) =>
    (!search || a.name.toLowerCase().includes(search.toLowerCase())) &&
    (filterType === "any" || a.type === filterType) &&
    (filterStatus === "any" || a.status === filterStatus)
  ), [apps, search, filterType, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#e11d48] font-bold mb-1">Provisioning</p>
            <h1 className="text-3xl sm:text-4xl tracking-tighter font-bold text-[#0f172a]" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Manage Pro Apps</h1>
          </div>
          <Button data-testid="create-app-btn" className="bg-[#e11d48] hover:bg-[#be123c] text-white" onClick={() => setCreateOpen(true)}>
            <Plus size={16} className="mr-1" /> Create New App
          </Button>
        </div>

        {/* Filters */}
        <div className="border border-slate-200 rounded-md p-4 bg-white grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div className="md:col-span-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input data-testid="search-apps" placeholder="Search by name" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
          </div>
          <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(1); }}>
            <SelectTrigger data-testid="filter-type"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent><SelectItem value="any">Any Type</SelectItem><SelectItem value="Pro">Pro</SelectItem><SelectItem value="Lite">Lite</SelectItem></SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1); }}>
            <SelectTrigger data-testid="filter-status"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent><SelectItem value="any">Any Status</SelectItem>{ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={filterOp} onValueChange={setFilterOp}>
            <SelectTrigger data-testid="filter-op"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="any">Any Operator</SelectItem><SelectItem value="robi">Robi</SelectItem></SelectContent>
          </Select>
          <div className="flex items-center gap-1 md:col-span-4">
            <Button variant={view === "grid" ? "default" : "outline"} size="sm" onClick={() => setView("grid")} data-testid="view-grid" className={view === "grid" ? "bg-[#0f172a]" : ""}><Grid2X2 size={14} className="mr-1" />Grid</Button>
            <Button variant={view === "list" ? "default" : "outline"} size="sm" onClick={() => setView("list")} data-testid="view-list" className={view === "list" ? "bg-[#0f172a]" : ""}><List size={14} className="mr-1" />List</Button>
            <span className="ml-auto text-sm text-slate-500"><Filter size={12} className="inline mr-1" />{filtered.length} results</span>
          </div>
        </div>

        {/* Cards */}
        {visible.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-md text-slate-500">No apps match your filters.</div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((app) => (
              <button key={app.id} onClick={() => setDetailApp(app)} data-testid={`app-card-${app.id}`}
                className="text-left border border-slate-200 rounded-md p-5 bg-white hover:border-[#0f172a] transition-all hover:-translate-y-0.5 hover:shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-mono text-slate-500">{app.id}</span>
                  <StatusBadge status={app.status} />
                </div>
                <h3 className="font-semibold text-lg tracking-tight mb-1">{app.name}</h3>
                <div className="text-xs text-slate-500 space-y-1 mt-3 pt-3 border-t border-slate-100">
                  <div className="flex justify-between"><span>Type</span><span className="font-medium text-[#0f172a]">{app.type}</span></div>
                  <div className="flex justify-between"><span>Username</span><span className="font-medium text-[#0f172a] truncate ml-2">{app.username}</span></div>
                  <div className="flex justify-between"><span>Created</span><span className="font-medium text-[#0f172a]">{app.created}</span></div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="border border-slate-200 rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>
                <th className="text-left p-3">App ID</th><th className="text-left p-3">Name</th><th className="text-left p-3">Type</th><th className="text-left p-3">Created</th><th className="text-left p-3">Status</th>
              </tr></thead>
              <tbody>
                {visible.map((app) => (
                  <tr key={app.id} onClick={() => setDetailApp(app)} className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer" data-testid={`app-row-${app.id}`}>
                    <td className="p-3 font-mono text-xs">{app.id}</td><td className="p-3 font-medium">{app.name}</td><td className="p-3">{app.type}</td><td className="p-3">{app.created}</td><td className="p-3"><StatusBadge status={app.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)} data-testid="page-prev"><ChevronLeft size={14} /> Prev</Button>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)} data-testid="page-next">Next <ChevronRight size={14} /></Button>
        </div>
      </div>

      <CreateAppDialog open={createOpen} onOpenChange={(v) => { setCreateOpen(v); if (!v) setPendingTemplate(null); }} prefill={pendingTemplate} />
      <AppDetailDialog app={detailApp} onClose={() => setDetailApp(null)} />
    </Layout>
  );
};

export default Provisioning;
