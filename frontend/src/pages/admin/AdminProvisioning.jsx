import React, { useState } from "react";
import Layout from "../../components/Layout";
import StatusBadge from "../../components/StatusBadge";
import { useApp } from "../../context/AppContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { ALL_STATUSES } from "../../mocks/data";
import { toast } from "sonner";
import { Download, Check, X, Trash2 } from "lucide-react";

const TRANSITIONS = {
  "Pending Approval": ["Active Production", "Limited Production", "Scheduled Active Production", "Rejected"],
  "Active Production": ["Suspended"],
  "Suspended": ["Active Production", "Limited Production", "Scheduled Active Production", "Terminated"],
  "Rejected": ["Active Production", "Pending Approval", "Deleted"],
  "Limited Production": ["Active Production", "Suspended"],
  "Terminated": [],
  "Draft": [],
  "Scheduled Active Production": ["Active Production", "Suspended"],
};

const AdminProvisioning = () => {
  const { apps, updateAppStatus, buildFiles, updateBuildFileStatus } = useApp();
  const [filter, setFilter] = useState("any");
  const [stateApp, setStateApp] = useState(null);
  const [newState, setNewState] = useState("");
  const [remark, setRemark] = useState("");

  const filtered = apps.filter((a) => filter === "any" || a.status === filter);

  const submit = () => {
    if (!newState) return toast.error("Pick a state");
    if (!remark) return toast.error("Remark required");
    if (newState === "Deleted") {
      toast.success("App deleted (mock)");
    } else {
      updateAppStatus(stateApp.id, newState, remark);
      toast.success(`App ${newState}`);
    }
    setStateApp(null);
    setNewState("");
    setRemark("");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#e11d48] font-bold mb-1">Admin · Provisioning</p>
          <h1 className="text-3xl sm:text-4xl tracking-tighter font-bold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>App Approvals</h1>
        </div>

        <Tabs defaultValue="apps">
          <TabsList><TabsTrigger value="apps">Apps</TabsTrigger><TabsTrigger value="builds">Build Files</TabsTrigger></TabsList>

          <TabsContent value="apps" className="pt-6 space-y-4">
            <Select value={filter} onValueChange={setFilter}><SelectTrigger className="w-60" data-testid="admin-filter-status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="any">Any Status</SelectItem>{ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((app) => (
                <div key={app.id} className="border border-slate-200 rounded-md p-5 bg-white" data-testid={`admin-app-${app.id}`}>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-mono text-slate-500">{app.id}</span>
                    <StatusBadge status={app.status} />
                  </div>
                  <h3 className="font-semibold text-lg tracking-tight mb-1">{app.name}</h3>
                  <p className="text-xs text-slate-500 mb-4">{app.username}</p>
                  <Button size="sm" disabled={!TRANSITIONS[app.status]?.length} onClick={() => { setStateApp(app); setNewState(""); setRemark(""); }} className="bg-[#0f172a] hover:bg-slate-800 w-full" data-testid={`change-state-${app.id}`}>
                    {TRANSITIONS[app.status]?.length ? "Change State" : "No Actions"}
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="builds" className="pt-6">
            <div className="border border-slate-200 rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="text-left p-3">Creator</th><th className="text-left p-3">App ID</th><th className="text-left p-3">App</th><th className="text-left p-3">Version</th><th className="text-left p-3">Date</th><th className="text-left p-3">Remarks</th><th className="text-left p-3">Status</th><th className="text-left p-3">Actions</th></tr></thead>
                <tbody>
                  {buildFiles.map((b, i) => (
                    <tr key={i} className="border-t border-slate-100" data-testid={`build-row-${i}`}>
                      <td className="p-3 font-mono text-xs">{b.creator}</td><td className="p-3 font-mono text-xs">{b.appId}</td><td className="p-3">{b.appName}</td><td className="p-3 font-mono">{b.version}</td><td className="p-3">{b.date}</td><td className="p-3 text-slate-500">{b.remarks}</td>
                      <td className="p-3"><span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${b.status === "Approved" ? "bg-emerald-100 text-emerald-700" : b.status === "Rejected" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>{b.status}</span></td>
                      <td className="p-3 space-x-1">
                        <Button size="sm" variant="outline" onClick={() => toast.success("Downloaded")} data-testid={`build-dl-${i}`}><Download size={12} /></Button>
                        {b.status === "Pending" && <>
                          <Button size="sm" variant="outline" className="text-emerald-600" onClick={() => { updateBuildFileStatus(i, "Approved"); toast.success("Approved"); }} data-testid={`build-approve-${i}`}><Check size={12} /></Button>
                          <Button size="sm" variant="outline" className="text-rose-600" onClick={() => { updateBuildFileStatus(i, "Rejected"); toast.success("Rejected"); }} data-testid={`build-reject-${i}`}><X size={12} /></Button>
                        </>}
                        {b.status !== "Rejected" && <Button size="sm" variant="outline" className="text-rose-600" onClick={() => toast.success("Deleted (mock)")} data-testid={`build-del-${i}`}><Trash2 size={12} /></Button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!stateApp} onOpenChange={(o) => !o && setStateApp(null)}>
        <DialogContent data-testid="change-state-dialog">
          <DialogHeader><DialogTitle>Change State · {stateApp?.name}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Current Status</Label><Input value={stateApp?.status || ""} disabled /></div>
            <div><Label>New Status *</Label>
              <Select value={newState} onValueChange={setNewState}>
                <SelectTrigger data-testid="new-state"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{TRANSITIONS[stateApp?.status]?.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Remarks *</Label><Textarea data-testid="state-remark" value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Reason for change" /></div>
          </div>
          <DialogFooter><Button data-testid="state-submit" onClick={submit} className="bg-[#e11d48] hover:bg-[#be123c]">Submit</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminProvisioning;
