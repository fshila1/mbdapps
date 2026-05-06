import React from "react";
import Layout from "../components/Layout";
import Tile from "../components/Tile";
import { useApp } from "../context/AppContext";
import { ServerCog, Sparkles, Store, BarChart3, Layers } from "lucide-react";

const DeveloperDashboard = () => {
  const { user, apps, liteApps } = useApp();
  const stats = [
    { label: "Active Apps", value: apps.filter((a) => a.status === "Active Production").length },
    { label: "Pending Review", value: apps.filter((a) => a.status === "Pending Approval").length },
    { label: "Lite Apps", value: liteApps.length },
    { label: "Total Subscribers", value: "147,520" },
  ];

  return (
    <Layout>
      <div className="space-y-10">
        <section>
          <p className="text-xs uppercase tracking-widest text-[#e11d48] font-bold mb-2">Developer Console</p>
          <h1 className="text-4xl sm:text-5xl tracking-tighter font-bold text-[#0f172a]" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
            Welcome, {user?.name?.split(" ")[0]}.
          </h1>
          <p className="text-slate-500 mt-2 max-w-2xl leading-relaxed">
            Provision telecom services, manage Lite apps, and explore ready-to-deploy templates from the Digital hub.
          </p>
        </section>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="border border-slate-200 rounded-md p-5 bg-white" data-testid={`stat-${i}`}>
              <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold">{s.label}</div>
              <div className="text-3xl mt-2 font-bold tracking-tight text-[#0f172a]">{s.value}</div>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4 tracking-tight">Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Tile testid="tile-provisioning" to="/provisioning" title="Provisioning" description="Submit and manage Pro apps with full SMS, USSD, CaaS, OTP and Subscription configurations." icon={ServerCog} />
            <Tile testid="tile-lite" to="/lite" title="BDapps Lite" description="Build keyword-based SMS apps in 4 simple steps — perfect for alerts and services." icon={Sparkles} />
            <Tile testid="tile-appstore" to="/appstore" title="App Store" description="Browse the public BDapps catalog. Promote your apps to 76M Robi subscribers." icon={Store} />
            <Tile testid="tile-reports" to="/reports" title="Reports" description="Drill into yearly, monthly and daily analytics across applications and subscriptions." icon={BarChart3} />
            <Tile testid="tile-digital" to="/digital" title="Digital" description="Pre-built templates for Lite and Provisioning. Launch faster with proven blueprints." icon={Layers} accent badge="New" />
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default DeveloperDashboard;
