import React, { useState } from "react";
import Layout from "../../components/Layout";
import { useApp } from "../../context/AppContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Search, Plus, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

const NAV = [
  { key: "subs-manage", group: "Subscriptions", label: "Manage" },
  { key: "governance", group: "Governance", label: "Overview" },
  { key: "ad-create", group: "Advertisements", label: "Create" },
  { key: "ad-manage", group: "Advertisements", label: "Manage" },
  { key: "ad-assign", group: "Advertisements", label: "Assign" },
  { key: "promo-ussd", group: "Promotions", label: "Global USSD" },
];

const TapAdmin = () => {
  const { subscriptions, ads, addAd, updateAd, removeAd } = useApp();
  const [active, setActive] = useState("subs-manage");

  const sidebar = (
    <nav className="p-4 space-y-3">
      <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3 px-2">Tap Admin</h3>
      {Array.from(new Set(NAV.map((n) => n.group))).map((g) => (
        <div key={g}>
          <div className="text-xs font-bold uppercase tracking-wide text-[#0f172a] px-2 py-1">{g}</div>
          {NAV.filter((n) => n.group === g).map((n) => (
            <button key={n.key} onClick={() => setActive(n.key)} data-testid={`tap-${n.key}`}
              className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition ${active === n.key ? "bg-[#0f172a] text-white" : "hover:bg-slate-100"}`}>
              {n.label}
            </button>
          ))}
        </div>
      ))}
    </nav>
  );

  return (
    <Layout sidebar={sidebar}>
      {active === "subs-manage" && <SubsManage subs={subscriptions} />}
      {active === "governance" && <Governance />}
      {active === "ad-create" && <AdCreate addAd={addAd} />}
      {active === "ad-manage" && <AdManage ads={ads} updateAd={updateAd} removeAd={removeAd} />}
      {active === "ad-assign" && <AdAssign ads={ads} />}
      {active === "promo-ussd" && <GlobalUSSD />}
    </Layout>
  );
};

const SubsManage = ({ subs }) => {
  const [phone, setPhone] = useState("");
  const [results, setResults] = useState([]);
  const [view, setView] = useState(null);
  const [error, setError] = useState("");

  const search = () => {
    if (!phone) return setError("Subscriber Mobile is required");
    if (!/^\+?880?1[3-9]\d{8}$/.test(phone.replace(/\s/g, ""))) return setError("Enter a valid Robi number (+8801XXXXXXXXX)");
    setError("");
    setResults(subs.filter((s) => s.mobile.includes(phone.replace(/\D/g, "").slice(-9))));
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl tracking-tight font-bold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Subscription Manager</h2>
      <div className="flex gap-2 max-w-2xl">
        <Input data-testid="sub-mobile" placeholder="+8801711234567" value={phone} onChange={(e) => setPhone(e.target.value)} className={error ? "border-rose-500" : ""} />
        <Button onClick={search} className="bg-[#e11d48] hover:bg-[#be123c]" data-testid="sub-search"><Search size={14} className="mr-1" /> Search</Button>
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <div className="border border-slate-200 rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="text-left p-3">Subscriber</th><th className="text-left p-3">App</th><th className="text-left p-3">SP</th><th className="text-left p-3">Status</th><th className="text-left p-3">Channel</th><th className="text-left p-3">Actions</th></tr></thead>
          <tbody>{results.length === 0 ? <tr><td colSpan={6} className="p-6 text-center text-slate-500">Search by mobile to view subscriptions</td></tr> : results.map((s, i) => <tr key={i} className="border-t border-slate-100"><td className="p-3 font-mono text-xs">{s.mobile}</td><td className="p-3">{s.appName}</td><td className="p-3">{s.spName}</td><td className="p-3">{s.status}</td><td className="p-3">{s.channel}</td><td className="p-3"><Button size="sm" variant="outline" onClick={() => setView(s)} data-testid={`sub-view-${i}`}><Eye size={12} className="mr-1" /> View</Button></td></tr>)}</tbody>
        </table>
      </div>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent data-testid="sub-detail">
          <DialogHeader><DialogTitle>Subscription · {view?.appName}</DialogTitle></DialogHeader>
          {view && (
            <div className="space-y-4 text-sm">
              <Section title="App Details">
                <Row k="App" v={view.appName} /><Row k="Channel" v={view.channel} /><Row k="Status" v={view.status} />
              </Section>
              <Section title="Charging">
                <Row k="Instrument" v={view.charging.instrument} /><Row k="Amount" v={`BDT ${view.charging.amount}`} /><Row k="Frequency" v={view.charging.frequency} /><Row k="Last Charged" v={view.charging.lastCharged} /><Row k="Start Date" v={view.charging.startDate} /><Row k="End Date" v={view.charging.endDate || "—"} />
              </Section>
              <Section title="Other Charges"><Row k="Setup Fee" v="BDT 0" /><Row k="Tax" v="15% included" /></Section>
              <Section title="Instructions"><Row k="Subscribe" v="SMS keyword to 21333" /><Row k="Unsubscribe" v="STOP to 21333" /><Row k="Report Abuse" v="ABUSE to 21333" /></Section>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="border border-slate-200 rounded-md p-3"><div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">{title}</div><div className="space-y-1">{children}</div></div>
);
const Row = ({ k, v }) => <div className="flex justify-between text-sm"><span className="text-slate-500">{k}</span><span className="font-medium">{v}</span></div>;

const Governance = () => (
  <div className="space-y-5">
    <h2 className="text-2xl tracking-tight font-bold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Governance</h2>
    <div className="border-2 border-dashed border-slate-200 rounded-md p-12 text-center bg-slate-50">
      <div className="text-4xl mb-3">⚙️</div>
      <h3 className="font-semibold text-lg">Coming Soon</h3>
      <p className="text-slate-500 text-sm">Advanced governance controls are in development.</p>
    </div>
  </div>
);

const AdCreate = ({ addAd }) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});

  const submit = () => {
    const e = {};
    if (!name) e.name = "Required";
    if (!content) e.content = "Required";
    if (content.length > 20) e.content = "Max 20 chars";
    setErrors(e);
    if (Object.keys(e).length) return;
    addAd({ name, content });
    toast.success("Ad created");
    setName(""); setContent("");
  };

  return (
    <div className="space-y-5 max-w-xl">
      <h2 className="text-2xl tracking-tight font-bold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Create Advertisement</h2>
      <div><Label>Ad Name *</Label><Input data-testid="ad-name" value={name} onChange={(e) => setName(e.target.value)} className={errors.name ? "border-rose-500" : ""} /></div>
      <div>
        <Label>Ad Content (max 20 chars) *</Label>
        <Input data-testid="ad-content" value={content} onChange={(e) => setContent(e.target.value)} maxLength={25} className={errors.content ? "border-rose-500" : ""} />
        <p className={`text-xs mt-1 ${content.length > 20 ? "text-rose-600 font-bold" : "text-slate-500"}`}>{content.length} / 20</p>
        {errors.content && <p className="text-xs text-rose-600">{errors.content}</p>}
      </div>
      <Button onClick={submit} className="bg-[#e11d48] hover:bg-[#be123c]" data-testid="ad-submit">Create Ad</Button>
    </div>
  );
};

const AdManage = ({ ads, updateAd, removeAd }) => {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  return (
    <div className="space-y-5">
      <h2 className="text-2xl tracking-tight font-bold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Manage Advertisements</h2>
      <div className="relative max-w-md"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><Input data-testid="ad-search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
      <div className="border border-slate-200 rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="text-left p-3">Name</th><th className="text-left p-3">Content</th><th className="text-left p-3">Actions</th></tr></thead>
          <tbody>{ads.filter((a) => !search || a.name.toLowerCase().includes(search.toLowerCase())).map((a) => <tr key={a.id} className="border-t border-slate-100"><td className="p-3 font-medium">{a.name}</td><td className="p-3 font-mono text-xs">{a.content}</td><td className="p-3 space-x-1"><Button size="sm" variant="outline" onClick={() => setEditing(a)} data-testid={`ad-edit-${a.id}`}><Pencil size={12} /></Button><Button size="sm" variant="outline" className="text-rose-600" onClick={() => { removeAd(a.id); toast.success("Removed"); }} data-testid={`ad-remove-${a.id}`}><Trash2 size={12} /></Button></td></tr>)}</tbody>
        </table>
      </div>
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent><DialogHeader><DialogTitle>Edit Ad</DialogTitle></DialogHeader>
          <div className="space-y-3"><div><Label>Name</Label><Input value={editing?.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} data-testid="ad-edit-name" /></div><div><Label>Content</Label><Input value={editing?.content || ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} maxLength={20} data-testid="ad-edit-content" /></div></div>
          <DialogFooter><Button variant="outline" onClick={() => setEditing(null)}>Not Now</Button><Button data-testid="ad-update" onClick={() => { updateAd(editing.id, { name: editing.name, content: editing.content }); toast.success("Updated"); setEditing(null); }} className="bg-[#e11d48] hover:bg-[#be123c]">Update</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const AdAssign = ({ ads }) => {
  const [search, setSearch] = useState("");
  const [assigning, setAssigning] = useState(null);
  const [adId, setAdId] = useState("");
  const apps = [{ id: "APP-1001", name: "Cricket Live Updates" }, { id: "APP-1002", name: "Daily Quiz Bangla" }, { id: "APP-1006", name: "City Prayer Times" }];

  return (
    <div className="space-y-5">
      <h2 className="text-2xl tracking-tight font-bold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Assign Advertisement</h2>
      <div className="relative max-w-md"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><Input placeholder="Search apps" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" data-testid="assign-search" /></div>
      <div className="border border-slate-200 rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="text-left p-3">App</th><th className="text-left p-3">Ad</th><th className="text-left p-3">Action</th></tr></thead>
          <tbody>{apps.filter((a) => !search || a.name.toLowerCase().includes(search.toLowerCase())).map((a) => <tr key={a.id} className="border-t border-slate-100"><td className="p-3">{a.name}</td><td className="p-3 text-slate-500">—</td><td className="p-3"><Button size="sm" onClick={() => setAssigning(a)} className="bg-[#0f172a]" data-testid={`assign-${a.id}`}>Assign</Button></td></tr>)}</tbody>
        </table>
      </div>
      <Dialog open={!!assigning} onOpenChange={(o) => !o && setAssigning(null)}>
        <DialogContent><DialogHeader><DialogTitle>Assign to {assigning?.name}</DialogTitle></DialogHeader>
          <div><Label>Choose Ad</Label><Select value={adId} onValueChange={setAdId}><SelectTrigger data-testid="assign-ad"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{ads.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent></Select></div>
          <DialogFooter><Button onClick={() => { if (!adId) return toast.error("Pick ad"); toast.success("Ad assigned"); setAssigning(null); setAdId(""); }} className="bg-[#e11d48] hover:bg-[#be123c]" data-testid="assign-confirm">Confirm</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const GlobalUSSD = () => {
  const [appId, setAppId] = useState("");
  const [error, setError] = useState("");
  const VALID = ["APP-1001", "APP-1002", "APP-1003", "APP-1006"];

  const submit = () => {
    if (!appId) return setError("App ID required");
    if (!VALID.includes(appId.toUpperCase())) return setError("Invalid App ID. Try APP-1001, APP-1002, APP-1003 or APP-1006.");
    setError("");
    toast.success(`USSD promotion enabled for ${appId}`);
  };

  return (
    <div className="space-y-5 max-w-md">
      <h2 className="text-2xl tracking-tight font-bold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Global USSD Promotion</h2>
      <div><Label>App ID</Label><Input data-testid="ussd-appid" value={appId} onChange={(e) => setAppId(e.target.value)} placeholder="APP-1001" className={error ? "border-rose-500" : ""} />{error && <p className="text-xs text-rose-600 mt-1">{error}</p>}</div>
      <Button onClick={submit} className="bg-[#e11d48] hover:bg-[#be123c]" data-testid="ussd-submit">Submit</Button>
    </div>
  );
};

export default TapAdmin;
