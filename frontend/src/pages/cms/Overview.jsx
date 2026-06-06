import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Plus, Pencil, Eye, BarChart3 } from "lucide-react";
import { useApp } from "../../context/AppContext";

const StatCard = ({ label, value, delta, color = "text-slate-900" }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-4">
    <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">{label}</div>
    <div className={`text-2xl font-bold mt-1 ${color}`}>{value}</div>
    {delta && <div className="text-[11px] text-emerald-600 mt-0.5 font-semibold">▲ {delta}</div>}
  </div>
);

const Overview = () => {
  const { app } = useOutletContext();
  const { cmsCollections, appContent } = useApp();
  const navigate = useNavigate();
  const activity = (cmsCollections.activity || {})[app.id] || [];
  const content = appContent[app.id] || {};

  let stats = [];
  if (app.kind === "ecommerce") {
    stats = [
      { label: "Total Orders", value: app.stats?.orders || 0, delta: "12 today" },
      { label: "Total Revenue", value: `BDT ${((app.stats?.revenue || 0) / 1000).toFixed(1)}k`, delta: "৳8.4k today" },
      { label: "Active Products", value: (content.products || []).length, delta: `${(content.products || []).filter((p) => p.stock === 0).length} out of stock`.replace("0 out", "—") },
      { label: "Customers", value: app.stats?.customers || 0, delta: "8 new today" },
    ];
  } else if (app.kind === "restaurant") {
    stats = [
      { label: "Orders Today", value: 47, delta: "12 from yesterday" },
      { label: "Revenue Today", value: "BDT 18,420", delta: "23%" },
      { label: "Menu Items", value: (content.menuItems || []).length },
      { label: "Avg Order Value", value: "BDT 392" },
    ];
  } else if (app.kind === "health") {
    stats = [
      { label: "Appointments Today", value: 18, delta: "3 pending" },
      { label: "Total Patients", value: app.stats?.patients || 0 },
      { label: "Active Doctors", value: (content.doctors || []).length },
      { label: "Revenue This Month", value: "BDT 84,000" },
    ];
  } else {
    stats = [
      { label: "Total Items", value: Object.values(content).reduce((s, v) => s + (Array.isArray(v) ? v.length : 0), 0) },
      { label: "Status", value: app.status },
      { label: "Launched", value: new Date(app.launchedAt).toLocaleDateString() },
      { label: "Updated", value: new Date(app.lastUpdated).toLocaleDateString() },
    ];
  }

  const quickActions = app.kind === "health" ? [
    { label: "Add Appointment", icon: "📅", to: "appointments" },
    { label: "Update Doctor", icon: "👨‍⚕️", to: "doctors" },
    { label: "View Reviews", icon: "⭐", to: "reviews" },
  ] : app.kind === "restaurant" ? [
    { label: "Add Menu Item", icon: "🍽", to: "menu" },
    { label: "Update Banner", icon: "🖼", to: "banners" },
    { label: "View Orders", icon: "📋", to: "orders" },
    { label: "View Reviews", icon: "⭐", to: "reviews" },
  ] : [
    { label: "Add Product", icon: "➕", to: "products" },
    { label: "Update Banner", icon: "🖼", to: "banners" },
    { label: "View Orders", icon: "📋", to: "orders" },
    { label: "View Reviews", icon: "⭐", to: "reviews" },
  ];

  return (
    <div className="space-y-4" data-testid="cms-overview">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-slate-500">Welcome to your <b>{app.name}</b> control room</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-sm font-bold mb-2 flex items-center gap-1"><BarChart3 size={14} /> Quick Actions</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {quickActions.map((q) => (
              <button key={q.label} data-testid={`quick-${q.to}`} onClick={() => navigate(`/my-apps/${app.id}/content/${q.to}`)} className="border border-slate-200 hover:border-rose-300 rounded-lg p-3 text-center bg-slate-50 hover:bg-rose-50 transition-colors">
                <div className="text-2xl">{q.icon}</div>
                <div className="text-xs font-bold mt-1">{q.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-sm font-bold mb-2">Recent Activity</div>
          <ul className="space-y-2" data-testid="activity-feed">
            {activity.length === 0 && <li className="text-xs text-slate-400">No activity yet</li>}
            {activity.slice(0, 8).map((a, i) => (
              <li key={i} className="text-xs text-slate-700 flex items-start gap-2 pb-2 border-b border-slate-100 last:border-0">
                <span className="flex-1">{a.text}</span>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">{a.ago}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Overview;
