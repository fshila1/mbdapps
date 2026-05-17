import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { Plus, ExternalLink, Settings2, BarChart3, Pencil, Smartphone, Globe } from "lucide-react";
import { useApp } from "../context/AppContext";

const StatusBadge = ({ status }) => {
  const map = {
    "Live": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "In Review": "bg-amber-100 text-amber-700 border-amber-200",
    "Draft": "bg-slate-100 text-slate-600 border-slate-200",
    "Featured": "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
  };
  const dot = { "Live": "bg-emerald-500", "In Review": "bg-amber-500", "Draft": "bg-slate-400", "Featured": "bg-fuchsia-500" }[status] || "bg-slate-400";
  return (
    <span data-testid={`status-${status.replace(/\s+/g, "-").toLowerCase()}`} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${map[status] || map.Draft}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
      {status}
    </span>
  );
};

const ago = (ts) => {
  if (!ts) return "—";
  const d = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (d < 60) return "just now";
  if (d < 3600) return `${Math.floor(d / 60)} min ago`;
  if (d < 86400) return `${Math.floor(d / 3600)} hr ago`;
  return `${Math.floor(d / 86400)} day(s) ago`;
};

const MyApps = () => {
  const navigate = useNavigate();
  const { myApps } = useApp();

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">My Apps</h1>
            <p className="text-sm text-slate-600 mt-1">Manage your launched apps — add products, update content, view orders, never touch code.</p>
          </div>
          <Button data-testid="build-new-app-btn" onClick={() => navigate("/digital")} className="bg-[#e11d48] hover:bg-[#be123c] gap-1"><Plus size={14} /> Build New App →</Button>
        </div>

        {myApps.length === 0 ? (
          <div data-testid="myapps-empty" className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <div className="text-5xl mb-3">📱</div>
            <h2 className="text-xl font-bold">No apps yet</h2>
            <p className="text-sm text-slate-500 mt-1">Launch your first app in under 5 minutes — no developers needed.</p>
            <Button onClick={() => navigate("/digital")} className="mt-4 bg-[#e11d48]">Build Your First App</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myApps.map((app) => (
              <div key={app.id} data-testid={`my-app-${app.id}`} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-3" style={{ background: app.color }} />
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl text-white" style={{ background: app.color }}>{app.icon || "📱"}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate">{app.name}</div>
                      <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                        {app.templateType === "android" ? <Smartphone size={11} /> : <Globe size={11} />}
                        {app.templateType?.toUpperCase()} · {app.kind}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <StatusBadge status={app.status} />
                    <span className="text-[10px] text-slate-400">Updated {ago(app.lastUpdated)}</span>
                  </div>
                  {/* Stats */}
                  <div className="mt-3 grid grid-cols-3 gap-2 bg-slate-50 rounded-lg p-2 text-center">
                    {app.kind === "health" ? (
                      <>
                        <Stat label="Appointments" value={app.stats?.appointments || 0} />
                        <Stat label="Patients" value={app.stats?.patients || 0} />
                        <Stat label="Doctors" value={app.stats?.doctors || 0} />
                      </>
                    ) : (
                      <>
                        <Stat label="Orders" value={app.stats?.orders || 0} />
                        <Stat label="Revenue" value={`৳${((app.stats?.revenue || 0) / 1000).toFixed(0)}k`} />
                        <Stat label="Customers" value={app.stats?.customers || 0} />
                      </>
                    )}
                  </div>
                  {/* Actions */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Link to={`/my-apps/${app.id}/content`} data-testid={`manage-content-${app.id}`} className="bg-[#e11d48] hover:bg-[#be123c] text-white rounded-md px-3 py-2 text-xs font-bold inline-flex items-center justify-center gap-1">
                      <Pencil size={12} /> Manage Content
                    </Link>
                    <Link to={`/my-apps/${app.id}/content/overview`} data-testid={`dashboard-${app.id}`} className="border border-slate-200 hover:bg-slate-50 rounded-md px-3 py-2 text-xs font-bold inline-flex items-center justify-center gap-1">
                      <BarChart3 size={12} /> Dashboard
                    </Link>
                    <Link to={`/my-apps/${app.id}/content/settings`} data-testid={`settings-${app.id}`} className="border border-slate-200 hover:bg-slate-50 rounded-md px-3 py-2 text-xs font-bold inline-flex items-center justify-center gap-1">
                      <Settings2 size={12} /> Settings
                    </Link>
                    <button data-testid={`view-live-${app.id}`} onClick={() => window.open(`https://${app.slug}.bdapps.app`, "_blank") } className="border border-slate-200 hover:bg-slate-50 rounded-md px-3 py-2 text-xs font-bold inline-flex items-center justify-center gap-1">
                      <ExternalLink size={12} /> View Live
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

const Stat = ({ label, value }) => (
  <div>
    <div className="text-base font-bold tabular-nums">{value}</div>
    <div className="text-[9px] uppercase tracking-wider text-slate-500">{label}</div>
  </div>
);

export default MyApps;
