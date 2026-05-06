import React, { useState } from "react";
import Layout from "../components/Layout";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../components/ui/dialog";
import { Plus, Eye, BookOpen, Send, Bell, Wrench, Sparkles, FileText, FolderKanban, Settings, BarChart3, ArrowLeft, Download, Plug } from "lucide-react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import Tile from "../components/Tile";
import { seedMessageHistory, seedReportData } from "../mocks/data";

// ============= LITE DASHBOARD =============
const LiteDashboard = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#e11d48] font-bold mb-1">BDapps Lite</p>
          <h1 className="text-3xl sm:text-4xl tracking-tighter font-bold text-[#0f172a]" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Lite Console</h1>
          <p className="text-slate-500 mt-2">Build keyword-based SMS apps in minutes.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Tile testid="lite-tile-create" to="/lite/create" title="Create Application" description="Launch a new keyword SMS app in 4 steps." icon={Plus} accent />
          <Tile testid="lite-tile-myapps" to="/lite/applications" title="My Applications" description="Manage your existing Lite apps." icon={FolderKanban} />
          <Tile testid="lite-tile-settings" to="/lite/settings" title="Settings" description="Manage keywords and your profile." icon={Settings} />
          <Tile testid="lite-tile-reports" to="/lite/reports" title="View Reports" description="Message history and analytics." icon={BarChart3} />
        </div>
      </div>
    </Layout>
  );
};

// ============= CREATE LITE APP =============
const CreateLiteApp = () => {
  const navigate = useNavigate();
  const loc = useLocation();
  const { addLiteApp, pendingTemplate, setPendingTemplate } = useApp();
  const [step, setStep] = useState(1);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [data, setData] = useState({
    template: pendingTemplate?.category || (loc.state?.template?.category || ""),
    name: pendingTemplate?.name || (loc.state?.template?.name || ""),
    keyword: pendingTemplate?.keyword || (loc.state?.template?.keyword || ""),
    description: pendingTemplate?.description || (loc.state?.template?.description || ""),
    response: "Thanks for subscribing. You will receive daily updates.",
    charging: "Daily",
  });
  const [errors, setErrors] = useState({});

  React.useEffect(() => () => setPendingTemplate(null), [setPendingTemplate]);

  const update = (k, v) => setData({ ...data, [k]: v });
  const autoKeyword = () => update("keyword", data.name.replace(/\s+/g, "").toUpperCase().slice(0, 8) || "MYAPP");

  const next = () => {
    const e = {};
    if (step === 1 && !data.template) e.template = "Select a template";
    if (step === 2) {
      if (!data.name) e.name = "Required";
      if (!data.keyword) e.keyword = "Required";
      if (!data.description) e.description = "Required";
    }
    setErrors(e);
    if (Object.keys(e).length) return;
    setStep(step + 1);
  };

  const submit = () => {
    addLiteApp({ name: data.name, keyword: data.keyword, category: data.template });
    setStep(4);
  };

  return (
    <Layout>
      <div className="max-w-3xl space-y-6">
        <Link to="/lite" data-testid="back-lite" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-[#0f172a]"><ArrowLeft size={14} /> Back</Link>
        <h1 className="text-3xl tracking-tighter font-bold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Create Lite Application</h1>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${step >= s ? "bg-[#e11d48]" : "bg-slate-200"}`}></div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Choose a template</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: "Alert", icon: Bell, desc: "Send timely alerts to subscribers (weather, score, news)." },
                { id: "Services", icon: Wrench, desc: "Provide ongoing services (hadith, quotes, recipes)." },
              ].map((t) => (
                <button key={t.id} onClick={() => update("template", t.id)} data-testid={`template-${t.id}`}
                  className={`text-left border-2 rounded-md p-6 transition ${data.template === t.id ? "border-[#e11d48] bg-rose-50" : "border-slate-200 hover:border-[#0f172a]"}`}>
                  <t.icon size={28} className="text-[#e11d48] mb-3" />
                  <div className="font-semibold text-lg">{t.id}</div>
                  <div className="text-sm text-slate-500 mt-1">{t.desc}</div>
                </button>
              ))}
            </div>
            {errors.template && <p className="text-sm text-rose-600">{errors.template}</p>}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">App details</h2>
            <div><Label>App Name *</Label><Input data-testid="lite-name" value={data.name} onChange={(e) => update("name", e.target.value)} className={errors.name ? "border-rose-500" : ""} />{errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}</div>
            <div>
              <Label>Keyword *</Label>
              <div className="flex gap-2">
                <Input data-testid="lite-keyword" value={data.keyword} onChange={(e) => update("keyword", e.target.value.toUpperCase())} className={errors.keyword ? "border-rose-500" : ""} />
                <Button type="button" variant="outline" onClick={autoKeyword} data-testid="auto-keyword">Auto</Button>
              </div>
              {errors.keyword && <p className="text-xs text-rose-600 mt-1">{errors.keyword}</p>}
            </div>
            <div><Label>Description *</Label><Textarea data-testid="lite-desc" value={data.description} onChange={(e) => update("description", e.target.value)} className={errors.description ? "border-rose-500" : ""} /></div>
            <div>
              <Label>Response Config</Label>
              <Textarea readOnly value={data.response} className="bg-slate-50" />
              <p className="text-xs text-slate-500 mt-1">Pre-filled. Editable after launch.</p>
            </div>
            <div>
              <Label className="mb-2 block">Charging Method</Label>
              <RadioGroup value={data.charging} onValueChange={(v) => update("charging", v)} className="flex gap-6">
                <div className="flex items-center gap-2"><RadioGroupItem value="Daily" id="d" data-testid="charge-daily" /><Label htmlFor="d">Daily</Label></div>
                <div className="flex items-center gap-2"><RadioGroupItem value="Monthly" id="m" data-testid="charge-monthly" /><Label htmlFor="m">Monthly</Label></div>
              </RadioGroup>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Review</h2>
            <div className="border border-slate-200 rounded-md divide-y">
              {Object.entries(data).map(([k, v]) => (
                <div key={k} className="flex justify-between p-3 text-sm"><span className="text-slate-500 uppercase tracking-wide font-semibold text-xs">{k}</span><span className="font-medium text-right max-w-[60%] truncate">{v}</span></div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-12 space-y-6 border border-emerald-200 bg-emerald-50 rounded-md">
            <Sparkles size={48} className="text-emerald-600 mx-auto" />
            <div>
              <h2 className="text-3xl font-bold tracking-tighter" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Application Created!</h2>
              <p className="text-slate-600 mt-2">Your Lite app <span className="font-semibold">{data.name}</span> is awaiting approval.</p>
            </div>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => setTutorialOpen(true)} data-testid="view-tutorial"><BookOpen size={14} className="mr-1" /> View Tutorial</Button>
              <Button data-testid="goto-myapps" onClick={() => navigate("/lite/applications")} className="bg-[#e11d48] hover:bg-[#be123c]">My Applications</Button>
            </div>
          </div>
        )}

        {step < 4 && (
          <div className="flex justify-between pt-4">
            <Button variant="outline" disabled={step === 1} onClick={() => setStep(step - 1)} data-testid="lite-back">Back</Button>
            {step === 3 ? <Button data-testid="lite-submit" className="bg-[#e11d48] hover:bg-[#be123c]" onClick={submit}>Submit</Button>
              : <Button data-testid="lite-next" className="bg-[#e11d48] hover:bg-[#be123c]" onClick={next}>Next</Button>}
          </div>
        )}

        <Dialog open={tutorialOpen} onOpenChange={setTutorialOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>How to use your Lite app</DialogTitle></DialogHeader>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Wait for admin approval (usually under 24 hours).</li>
              <li>Once approved, share your keyword (e.g., <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{data.keyword || "MYAPP"}</span>).</li>
              <li>Subscribers SMS your keyword to <span className="font-mono">21333</span>.</li>
              <li>Use the composer in My Applications to send updates.</li>
              <li>Track performance in View Reports.</li>
            </ol>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

// ============= MY APPLICATIONS =============
const MyApplications = () => {
  const { liteApps } = useApp();
  const navigate = useNavigate();
  const [composeApp, setComposeApp] = useState(null);
  const [viewApp, setViewApp] = useState(null);
  const [helpApp, setHelpApp] = useState(null);
  const [publishApp, setPublishApp] = useState(null);
  const [message, setMessage] = useState("");
  const [subscribers, setSubscribers] = useState(["+8801711000001"]);
  const [pubForm, setPubForm] = useState({ name: "", category: "", description: "", short: "", instructions: "" });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <Link to="/lite" data-testid="back-lite-myapps" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-[#0f172a] mb-2"><ArrowLeft size={14} /> Back</Link>
            <h1 className="text-3xl tracking-tighter font-bold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>My Applications</h1>
          </div>
          <Button onClick={() => navigate("/lite/create")} className="bg-[#e11d48] hover:bg-[#be123c]"><Plus size={14} className="mr-1" /> New</Button>
        </div>

        <div className="border border-slate-200 rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="text-left p-3">Name</th><th className="text-left p-3">Keyword</th><th className="text-left p-3">Status</th><th className="text-left p-3">Actions</th></tr>
            </thead>
            <tbody>
              {liteApps.map((a) => (
                <tr key={a.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="p-3 font-medium">{a.name}</td>
                  <td className="p-3 font-mono">{a.keyword}</td>
                  <td className="p-3"><span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${a.status === "Active" ? "bg-emerald-100 text-emerald-700" : a.status === "Rejected" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>{a.status}</span></td>
                  <td className="p-3 space-x-2">
                    {a.status === "Active" && (<>
                      <Button size="sm" variant="outline" onClick={() => setComposeApp(a)} data-testid={`use-${a.id}`}>Use</Button>
                      <Button size="sm" variant="outline" onClick={() => setViewApp(a)} data-testid={`view-${a.id}`}>View</Button>
                      <Button size="sm" variant="outline" onClick={() => setHelpApp(a)} data-testid={`help-${a.id}`}>Help</Button>
                      <Button size="sm" className="bg-[#e11d48] hover:bg-[#be123c]" onClick={() => setPublishApp(a)} data-testid={`publish-${a.id}`}>Publish</Button>
                    </>)}
                    {a.status === "Rejected" && <Button size="sm" variant="outline" onClick={() => setViewApp(a)}>View</Button>}
                    {a.status === "Pending" && <span className="text-xs text-slate-400">Awaiting approval</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Composer */}
      <Dialog open={!!composeApp} onOpenChange={(o) => !o && setComposeApp(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Compose · {composeApp?.name}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Message</Label>
              <Textarea data-testid="compose-msg" maxLength={300} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your SMS (max 300 chars)" rows={4} />
              <p className="text-xs text-slate-500 mt-1 text-right">{message.length} / 300</p>
            </div>
            <div>
              <Label>Subscribers</Label>
              <div className="space-y-2">
                {subscribers.map((s, i) => <div key={i} className="flex items-center gap-2"><Input value={s} onChange={(e) => { const c = [...subscribers]; c[i] = e.target.value; setSubscribers(c); }} /></div>)}
                <Button size="sm" variant="outline" onClick={() => setSubscribers([...subscribers, ""])} data-testid="add-subscriber"><Plus size={14} className="mr-1" /> Add</Button>
              </div>
            </div>
          </div>
          <DialogFooter><Button onClick={() => { toast.success(`Sent to ${subscribers.length} subscribers`); setComposeApp(null); setMessage(""); }} data-testid="send-msg" className="bg-[#e11d48] hover:bg-[#be123c]"><Send size={14} className="mr-1" /> Send</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View */}
      <Dialog open={!!viewApp} onOpenChange={(o) => !o && setViewApp(null)}>
        <DialogContent><DialogHeader><DialogTitle>{viewApp?.name}</DialogTitle></DialogHeader>
          <div className="text-sm space-y-2"><div><span className="text-slate-500">ID: </span><span className="font-mono">{viewApp?.id}</span></div><div><span className="text-slate-500">Keyword: </span><span className="font-mono">{viewApp?.keyword}</span></div><div><span className="text-slate-500">Category: </span>{viewApp?.category}</div><div><span className="text-slate-500">Status: </span>{viewApp?.status}</div></div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!helpApp} onOpenChange={(o) => !o && setHelpApp(null)}>
        <DialogContent><DialogHeader><DialogTitle>Help · {helpApp?.name}</DialogTitle></DialogHeader>
          <div className="text-sm space-y-2"><p>Subscribers SMS <span className="font-mono bg-slate-100 px-1 rounded">{helpApp?.keyword}</span> to 21333 to subscribe.</p><p>To unsubscribe, send STOP to 21333.</p><p>Need more help? Contact support@bdapps.com</p></div>
        </DialogContent>
      </Dialog>

      {/* Publish */}
      <Dialog open={!!publishApp} onOpenChange={(o) => !o && setPublishApp(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>Publish to App Store</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input data-testid="pub-name" value={pubForm.name} onChange={(e) => setPubForm({ ...pubForm, name: e.target.value })} /></div>
            <div><Label>Category</Label>
              <Select value={pubForm.category} onValueChange={(v) => setPubForm({ ...pubForm, category: v })}>
                <SelectTrigger data-testid="pub-category"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Games">Games</SelectItem><SelectItem value="Entertainment">Entertainment</SelectItem><SelectItem value="Health">Health</SelectItem><SelectItem value="Finance">Finance</SelectItem><SelectItem value="Utilities">Utilities</SelectItem></SelectContent>
              </Select></div>
            <div><Label>Description</Label><Textarea value={pubForm.description} onChange={(e) => setPubForm({ ...pubForm, description: e.target.value })} /></div>
            <div><Label>Short Description</Label><Input value={pubForm.short} onChange={(e) => setPubForm({ ...pubForm, short: e.target.value })} /></div>
            <div><Label>Instructions</Label><Textarea value={pubForm.instructions} onChange={(e) => setPubForm({ ...pubForm, instructions: e.target.value })} /></div>
            <div><Label>Icon</Label><Input type="file" accept="image/*" /></div>
            <div><Label>Banner (optional)</Label><Input type="file" accept="image/*" /></div>
          </div>
          <DialogFooter><Button data-testid="pub-submit" onClick={() => { if (!pubForm.name || !pubForm.category) return toast.error("Name & Category required"); toast.success("Published to App Store!"); setPublishApp(null); setPubForm({ name: "", category: "", description: "", short: "", instructions: "" }); }} className="bg-[#e11d48] hover:bg-[#be123c]">Publish</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

// ============= LITE SETTINGS =============
const LiteSettings = () => {
  const { keywords } = useApp();
  const [profileEdit, setProfileEdit] = useState(false);
  const [pwdEdit, setPwdEdit] = useState(false);
  const [orgEdit, setOrgEdit] = useState(false);
  const [reconEdit, setReconEdit] = useState(false);
  const [view, setView] = useState("dashboard");

  if (view === "keywords") return (
    <Layout>
      <div className="space-y-4">
        <Button variant="outline" size="sm" onClick={() => setView("dashboard")} data-testid="back-settings"><ArrowLeft size={14} className="mr-1" /> Settings</Button>
        <h1 className="text-3xl tracking-tighter font-bold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Keywords</h1>
        <div className="border border-slate-200 rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="text-left p-3">Keyword</th><th className="text-left p-3">App</th><th className="text-left p-3">Shortcode</th><th className="text-left p-3">Status</th></tr></thead>
            <tbody>
              {keywords.map((k, i) => <tr key={i} className="border-t border-slate-100"><td className="p-3 font-mono">{k.keyword}</td><td className="p-3">{k.appName}</td><td className="p-3 font-mono">{k.shortcode}</td><td className="p-3">{k.status}</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );

  if (view === "profile") return (
    <Layout>
      <div className="space-y-4 max-w-3xl">
        <Button variant="outline" size="sm" onClick={() => setView("dashboard")} data-testid="back-settings2"><ArrowLeft size={14} className="mr-1" /> Settings</Button>
        <h1 className="text-3xl tracking-tighter font-bold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>My Profile</h1>
        <Tabs defaultValue="profile">
          <TabsList><TabsTrigger value="profile">My Profile</TabsTrigger><TabsTrigger value="security">Security</TabsTrigger></TabsList>
          <TabsContent value="profile" className="space-y-5 pt-4">
            <Card title="Basic Details" disabled>
              <Field label="Name" value="Rafiul Karim" disabled />
              <Field label="Username" value="developer" disabled />
              <Field label="Email" value="developer@bdapps.com" disabled />
            </Card>
            <Card title="Organization Details" edit={orgEdit} onEdit={() => setOrgEdit(!orgEdit)} testid="edit-org">
              <Field label="Org Name" defaultValue="BDapps Demo" disabled={!orgEdit} />
              <Field label="Address" defaultValue="Gulshan, Dhaka" disabled={!orgEdit} />
              <Field label="Tax ID" defaultValue="TIN-12345" disabled={!orgEdit} />
            </Card>
            <Card title="Contact Person" disabled>
              <Field label="Name" value="Rafiul Karim" disabled />
              <Field label="Phone" value="+8801711000001" disabled />
            </Card>
            <Card title="Reconciliation Details" edit={reconEdit} onEdit={() => setReconEdit(!reconEdit)} testid="edit-recon">
              <Field label="Bank" defaultValue="DBBL" disabled={!reconEdit} />
              <Field label="Account No" defaultValue="1011XXXX" disabled={!reconEdit} />
            </Card>
            <Card title="Terms & Conditions">
              <p className="text-sm text-slate-600">Read the developer agreement.</p>
              <Button variant="outline" size="sm" onClick={() => toast.success("T&C downloaded (mock)")} data-testid="download-tc"><Download size={14} className="mr-1" /> Download</Button>
            </Card>
          </TabsContent>
          <TabsContent value="security" className="pt-4">
            <Card title="Change Password" edit={pwdEdit} onEdit={() => setPwdEdit(!pwdEdit)} testid="edit-pwd">
              <Field label="Current Password" type="password" disabled={!pwdEdit} />
              <Field label="New Password" type="password" disabled={!pwdEdit} />
              <Field label="Confirm Password" type="password" disabled={!pwdEdit} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="space-y-6 max-w-3xl">
        <Link to="/lite" data-testid="back-lite-set" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-[#0f172a]"><ArrowLeft size={14} /> Back</Link>
        <h1 className="text-3xl tracking-tighter font-bold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Settings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={() => setView("keywords")} data-testid="open-keywords" className="text-left border border-slate-200 rounded-md p-6 hover:border-[#0f172a] transition">
            <FileText size={24} className="text-[#e11d48] mb-3" />
            <h3 className="font-semibold text-lg">Keywords</h3>
            <p className="text-sm text-slate-500 mt-1">View your registered keywords.</p>
          </button>
          <button onClick={() => setView("profile")} data-testid="open-profile" className="text-left border border-slate-200 rounded-md p-6 hover:border-[#0f172a] transition">
            <Settings size={24} className="text-[#e11d48] mb-3" />
            <h3 className="font-semibold text-lg">My Profile</h3>
            <p className="text-sm text-slate-500 mt-1">Personal, organization & security.</p>
          </button>
        </div>
      </div>
    </Layout>
  );
};

const Card = ({ title, children, edit, onEdit, disabled, testid }) => (
  <div className="border border-slate-200 rounded-md p-5 bg-white">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-semibold tracking-tight">{title}</h3>
      {!disabled && onEdit && <Button size="sm" variant="outline" onClick={onEdit} data-testid={testid}>{edit ? "Save" : "Edit"}</Button>}
    </div>
    <div className="space-y-3">{children}</div>
  </div>
);
const Field = ({ label, ...rest }) => (
  <div><Label>{label}</Label><Input {...rest} /></div>
);

// ============= LITE REPORTS =============
const LiteReports = () => {
  const [showAll, setShowAll] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [generated, setGenerated] = useState(false);

  return (
    <Layout>
      <div className="space-y-6">
        <Link to="/lite" data-testid="back-lite-rep" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-[#0f172a]"><ArrowLeft size={14} /> Back</Link>
        <h1 className="text-3xl tracking-tighter font-bold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>View Reports</h1>

        <section className="border border-slate-200 rounded-md p-6 bg-white">
          <h2 className="font-semibold text-lg tracking-tight mb-4">Message History</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div><Label>App</Label>
              <Select defaultValue="all"><SelectTrigger data-testid="msg-app"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Apps</SelectItem><SelectItem value="weather">Weather Today</SelectItem><SelectItem value="hadith">Daily Hadith</SelectItem></SelectContent>
              </Select></div>
            <label className="flex items-center gap-2 mt-7"><Checkbox checked={showAll} onCheckedChange={(v) => setShowAll(!!v)} data-testid="show-all" /><span className="text-sm">Show All</span></label>
            <div><Label>From</Label><Input type="date" disabled={showAll} value={from} onChange={(e) => setFrom(e.target.value)} data-testid="msg-from" /></div>
            <div><Label>To</Label><Input type="date" disabled={showAll} value={to} onChange={(e) => setTo(e.target.value)} data-testid="msg-to" /></div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => setGenerated(true)} className="bg-[#e11d48] hover:bg-[#be123c]" data-testid="msg-generate">Generate</Button>
            {generated && <>
              <Button variant="outline" onClick={() => toast.success("CSV downloaded")} data-testid="msg-csv"><Download size={14} className="mr-1" /> CSV</Button>
              <Button variant="outline" onClick={() => toast.success("PDF downloaded")} data-testid="msg-pdf"><Download size={14} className="mr-1" /> PDF</Button>
            </>}
          </div>
          {generated && (
            <div className="mt-4 border border-slate-200 rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="text-left p-3">Date</th><th className="text-left p-3">App</th><th className="text-left p-3">From</th><th className="text-left p-3">To</th><th className="text-left p-3">Message</th><th className="text-left p-3">Status</th></tr></thead>
                <tbody>{seedMessageHistory.map((m, i) => <tr key={i} className="border-t border-slate-100"><td className="p-3">{m.date}</td><td className="p-3">{m.app}</td><td className="p-3 font-mono text-xs">{m.from}</td><td className="p-3 font-mono text-xs">{m.to}</td><td className="p-3 max-w-[200px] truncate">{m.message}</td><td className="p-3"><span className={m.status === "Delivered" ? "text-emerald-600 font-semibold text-xs" : "text-rose-600 font-semibold text-xs"}>{m.status}</span></td></tr>)}</tbody>
              </table>
            </div>
          )}
        </section>

        <section className="border border-slate-200 rounded-md p-6 bg-white">
          <h2 className="font-semibold text-lg tracking-tight mb-2">Other Reports</h2>
          <p className="text-sm text-slate-500 mb-4">Open the full reporting console.</p>
          <Link to="/reports"><Button variant="outline" data-testid="open-other-reports"><BarChart3 size={14} className="mr-1" /> Open Reports Console</Button></Link>
        </section>
      </div>
    </Layout>
  );
};

// ============= ROUTER =============
const Lite = () => {
  const { sub } = useParams();
  if (sub === "create") return <CreateLiteApp />;
  if (sub === "applications") return <MyApplications />;
  if (sub === "settings") return <LiteSettings />;
  if (sub === "reports") return <LiteReports />;
  return <LiteDashboard />;
};

export default Lite;
