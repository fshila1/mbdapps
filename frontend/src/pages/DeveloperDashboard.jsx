import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import Tile from "../components/Tile";
import { useApp } from "../context/AppContext";
import { ServerCog, Sparkles, Store, BarChart3, Layers, FolderOpen, Smartphone, Globe, ArrowRight, TrendingUp, Users, DollarSign } from "lucide-react";

const DeveloperDashboard = () => {
  const { user, apps, liteApps, myApps } = useApp();

  // Quick Stats derived from My Apps
  const liveApps = myApps.filter((a) => a.status === "Live");
  const pendingApps = myApps.filter((a) => a.status === "Pending Review");
  const totalOrders = myApps.reduce((s, a) => s + (a.stats?.orders || 0) + (a.stats?.appointments || 0), 0);
  const totalRevenue = myApps.reduce((s, a) => s + (a.stats?.revenue || 0), 0);
  const totalDownloads = myApps.filter((a) => a.templateType === "android").reduce((s, a) => s + (a.stats?.downloads || 0), 0);
  const totalSubs = apps.filter((a) => a.status === "Active Production").length * 24000 + 12500;

  const quickStats = [
    { label: "Live Apps", value: liveApps.length, icon: Globe, accent: "emerald" },
    { label: "Pending Review", value: pendingApps.length, icon: Smartphone, accent: "amber" },
    { label: "Total Subscribers", value: totalSubs.toLocaleString(), icon: Users, accent: "indigo" },
    { label: "Lifetime Revenue", value: `৳${(totalRevenue / 1000).toFixed(0)}k`, icon: DollarSign, accent: "rose" },
  ];

  return (
    <Layout>
      <div className="space-y-10">
        <section>
          <p className="text-xs uppercase tracking-widest text-[#e11d48] font-bold mb-2">Developer Console</p>
          <h1 className="text-4xl sm:text-5xl tracking-tighter font-bold text-[#0f172a]" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
            Welcome back, {user?.name?.split(" ")[0]}.
          </h1>
          <p className="text-slate-500 mt-2 max-w-2xl leading-relaxed">
            You have <b className="text-[#0f172a]">{liveApps.length} live apps</b>, <b className="text-amber-600">{pendingApps.length} pending review</b>, and {totalOrders}+ transactions this month.
          </p>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((s, i) => (
            <div key={i} className="border border-slate-200 rounded-2xl p-4 bg-white relative overflow-hidden" data-testid={`quickstat-${i}`}>
              <div className={`absolute -right-3 -top-3 w-16 h-16 rounded-full opacity-10 ${s.accent === "emerald" ? "bg-emerald-500" : s.accent === "amber" ? "bg-amber-500" : s.accent === "indigo" ? "bg-indigo-500" : "bg-rose-500"}`}></div>
              <s.icon size={18} className={s.accent === "emerald" ? "text-emerald-500" : s.accent === "amber" ? "text-amber-500" : s.accent === "indigo" ? "text-indigo-500" : "text-rose-500"} />
              <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mt-3">{s.label}</div>
              <div className="text-3xl mt-1 font-bold tracking-tight text-[#0f172a] tabular-nums">{s.value}</div>
            </div>
          ))}
        </section>

        {/* My Apps Quick View */}
        <section data-testid="my-apps-quickview">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>My Apps</h2>
              <p className="text-sm text-slate-500 mt-0.5">Your active builds at a glance</p>
            </div>
            <Link to="/my-apps" data-testid="view-all-apps" className="text-sm text-[#e11d48] font-bold hover:underline flex items-center gap-1">View all {myApps.length} apps <ArrowRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myApps.slice(0, 6).map((app) => (
              <Link key={app.id} to={`/my-apps/${app.id}/content`} data-testid={`quick-app-${app.id}`}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white shrink-0 bg-gradient-to-br ${app.iconGradient || "from-slate-500 to-slate-700"} shadow`}>{app.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">{app.name}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    {app.templateType === "android" ? <Smartphone size={11} /> : <Globe size={11} />}
                    {app.templateType?.toUpperCase()} · {app.kind}
                  </div>
                  <div className="mt-1 flex items-center gap-2 flex-wrap">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${app.status === "Live" ? "bg-emerald-100 text-emerald-700" : app.status === "Pending Review" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>{app.status}</span>
                    {app.status === "Live" && app.stats?.orders > 0 && <span className="text-[10px] text-slate-500"><TrendingUp size={9} className="inline mr-0.5" />{app.stats.orders} orders</span>}
                    {app.status === "Live" && app.stats?.downloads > 0 && <span className="text-[10px] text-slate-500">{(app.stats.downloads).toLocaleString()} downloads</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {myApps.length === 0 && (
            <Link to="/digital" className="block bg-gradient-to-br from-indigo-50 to-rose-50 border-2 border-dashed border-rose-200 rounded-2xl p-8 text-center hover:border-rose-400 transition-colors">
              <div className="text-4xl mb-2">🚀</div>
              <div className="font-bold">Launch your first app</div>
              <div className="text-sm text-slate-500 mt-1">Build a web or Android app in minutes — no code needed.</div>
            </Link>
          )}
        </section>

        {/* Modules */}
        <section>
          <h2 className="text-lg font-semibold mb-4 tracking-tight">Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Tile testid="tile-digital" to="/digital" title="Digital Builder" description="Build web & Android apps in minutes with our no-code template gallery." icon={Layers} accent badge="Build" />
            <Tile testid="tile-myapps" to="/my-apps" title="My Apps" description="Manage your launched apps. Edit products, view orders, no code needed." icon={FolderOpen} accent badge="CMS" />
            <Tile testid="tile-provisioning" to="/provisioning" title="Provisioning" description="Submit and manage Pro apps with full SMS, USSD, CaaS, OTP and Subscription configurations." icon={ServerCog} />
            <Tile testid="tile-lite" to="/lite" title="BDapps Lite" description="Build keyword-based SMS apps in 4 simple steps — perfect for alerts and services." icon={Sparkles} />
            <Tile testid="tile-appstore" to="/appstore" title="App Store" description="Browse the public BDapps catalog. Promote your apps to 76M Robi subscribers." icon={Store} />
            <Tile testid="tile-reports" to="/reports" title="Reports" description="Drill into yearly, monthly and daily analytics across applications and subscriptions." icon={BarChart3} />
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default DeveloperDashboard;
