import React, { useState } from "react";
import Layout from "../components/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { seedReportData } from "../mocks/data";
import { Download, Printer, FileSpreadsheet, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const NAV = [
  { key: "overall", label: "Overall Reports", subs: ["Yearly", "Monthly", "Daily"] },
  { key: "app", label: "Application Reports", subs: ["App-Based Yearly", "App-Based Monthly", "App-Based Daily"] },
  { key: "sub", label: "Direct Subscription Summary", subs: [] },
];

const ReportForm = ({ section }) => {
  const [generated, setGenerated] = useState(false);
  return (
    <div className="space-y-5">
      <h2 className="text-2xl tracking-tight font-bold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>{section}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <div><Label>Year</Label><Select defaultValue="2024"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="2024">2024</SelectItem><SelectItem value="2023">2023</SelectItem></SelectContent></Select></div>
        <div><Label>Month</Label><Select defaultValue="6"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}</SelectContent></Select></div>
        <div><Label>Operator</Label><Select defaultValue="robi"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="robi">Robi</SelectItem></SelectContent></Select></div>
        <div><Label>App Type</Label><Select defaultValue="any"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="any">Any</SelectItem><SelectItem value="pro">Pro</SelectItem><SelectItem value="lite">Lite</SelectItem></SelectContent></Select></div>
        <div><Label>App</Label><Select defaultValue="all"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="cricket">Cricket Live</SelectItem></SelectContent></Select></div>
        <div><Label>Sort By</Label><Select defaultValue="rev"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="rev">Revenue</SelectItem><SelectItem value="users">Users</SelectItem></SelectContent></Select></div>
        <div><Label>Order</Label><Select defaultValue="desc"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="desc">Desc</SelectItem><SelectItem value="asc">Asc</SelectItem></SelectContent></Select></div>
        <div><Label>Date Range</Label><Input type="date" /></div>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => setGenerated(true)} className="bg-[#e11d48] hover:bg-[#be123c]" data-testid={`gen-${section}`}><BarChart3 size={14} className="mr-1" /> Submit</Button>
        {generated && <>
          <Button variant="outline" onClick={() => toast.success("Excel downloaded")} data-testid="dl-excel"><FileSpreadsheet size={14} className="mr-1" /> Excel</Button>
          <Button variant="outline" onClick={() => toast.success("PDF downloaded")} data-testid="dl-pdf"><Download size={14} className="mr-1" /> PDF</Button>
          <Button variant="outline" onClick={() => window.print()} data-testid="dl-print"><Printer size={14} className="mr-1" /> Print</Button>
        </>}
      </div>
      {generated && (
        <div className="border border-slate-200 rounded-md p-4 bg-white">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={seedReportData}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#e11d48" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <table className="w-full text-sm mt-4">
            <thead className="bg-slate-50"><tr><th className="text-left p-2">Period</th><th className="text-right p-2">Subscribers</th><th className="text-right p-2">Revenue (BDT)</th></tr></thead>
            <tbody>{seedReportData.map((d) => <tr key={d.label} className="border-t border-slate-100"><td className="p-2 font-medium">{d.label}</td><td className="p-2 text-right font-mono">{d.value.toLocaleString()}</td><td className="p-2 text-right font-mono">{(d.value * 2).toLocaleString()}</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const Reports = () => {
  const [active, setActive] = useState({ key: "overall", sub: "Yearly" });
  const subnav = (
    <nav className="flex gap-1 p-3 max-w-full" data-testid="reports-subnav">
      {NAV.map((n) => (
        <div key={n.key} className="flex gap-1">
          {n.subs.length > 0 ? n.subs.map((s) => (
            <button key={s} data-testid={`nav-${n.key}-${s}`} onClick={() => setActive({ key: n.key, sub: s })}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition ${active.key === n.key && active.sub === s ? "bg-[#0f172a] text-white" : "bg-white border border-slate-200 hover:border-[#0f172a]"}`}>
              {n.label.replace(" Reports", "")} · {s}
            </button>
          )) : (
            <button data-testid={`nav-${n.key}`} onClick={() => setActive({ key: n.key, sub: "" })}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition ${active.key === n.key ? "bg-[#0f172a] text-white" : "bg-white border border-slate-200 hover:border-[#0f172a]"}`}>{n.label}</button>
          )}
        </div>
      ))}
    </nav>
  );

  return (
    <Layout subnav={subnav}>
      <ReportForm section={`${NAV.find((n) => n.key === active.key).label}${active.sub ? " · " + active.sub : ""}`} />
    </Layout>
  );
};

export default Reports;
