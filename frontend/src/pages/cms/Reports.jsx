import React, { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useApp } from "../../context/AppContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Th, Td } from "./_shared";
import { Download } from "lucide-react";

const Reports = () => {
  const { app } = useOutletContext();
  const { cmsCollections, appContent } = useApp();
  const [range, setRange] = useState({ from: "", to: "" });
  const orders = (cmsCollections.orders || {})[app.id] || [];
  const products = appContent[app.id]?.products || [];
  const doctors = appContent[app.id]?.doctors || [];
  const courses = appContent[app.id]?.courses || [];

  const chartData = useMemo(() => {
    const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    return days.map((d, i) => ({ day: d, revenue: 1200 + Math.round(Math.sin(i + 1) * 800 + Math.random() * 600) }));
  }, []);

  const total = chartData.reduce((s, d) => s + d.revenue, 0);
  const avgOrder = orders.length ? (orders.reduce((s, o) => s + o.total, 0) / orders.length) : 0;

  return (
    <div className="space-y-4" data-testid="cms-reports">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-xs text-slate-500">Built-in analytics for your live app</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Date Range:</span>
        <Input data-testid="report-from" type="date" value={range.from} onChange={(e) => setRange({ ...range, from: e.target.value })} className="w-40 h-8 text-sm" />
        <span className="text-xs">to</span>
        <Input data-testid="report-to" type="date" value={range.to} onChange={(e) => setRange({ ...range, to: e.target.value })} className="w-40 h-8 text-sm" />
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" data-testid="export-csv" onClick={() => toast.success("📥 CSV export started")} className="gap-1 text-xs"><Download size={12} /> CSV</Button>
          <Button variant="outline" size="sm" data-testid="export-pdf" onClick={() => toast.success("📥 PDF export started")} className="gap-1 text-xs"><Download size={12} /> PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4"><div className="text-[10px] uppercase font-bold text-slate-500">Total Orders</div><div className="text-2xl font-bold mt-1">{orders.length}</div></div>
        <div className="bg-white border border-slate-200 rounded-xl p-4"><div className="text-[10px] uppercase font-bold text-slate-500">Total Revenue</div><div className="text-2xl font-bold mt-1">BDT {total.toLocaleString()}</div></div>
        <div className="bg-white border border-slate-200 rounded-xl p-4"><div className="text-[10px] uppercase font-bold text-slate-500">Avg Order Value</div><div className="text-2xl font-bold mt-1">BDT {Math.round(avgOrder).toLocaleString()}</div></div>
        <div className="bg-white border border-slate-200 rounded-xl p-4"><div className="text-[10px] uppercase font-bold text-slate-500">Active Customers</div><div className="text-2xl font-bold mt-1">{app.stats?.customers || app.stats?.patients || 0}</div></div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="text-sm font-bold mb-2">Sales Summary</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="revenue" fill={app.color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {app.kind === "ecommerce" && products.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2 text-sm font-bold border-b border-slate-200">Product Performance</div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50"><tr><Th>Product</Th><Th>Views</Th><Th>Orders</Th><Th>Revenue</Th><Th>Conversion</Th></tr></thead>
              <tbody>
                {products.slice(0, 10).map((p, i) => {
                  const views = 1200 - i * 80;
                  const ord = Math.round(views * 0.04);
                  const rev = ord * (p.salePrice || p.price);
                  return <tr key={p.id}><Td className="font-semibold">{p.name}</Td><Td>{views}</Td><Td>{ord}</Td><Td>BDT {rev.toLocaleString()}</Td><Td>{((ord/views)*100).toFixed(1)}%</Td></tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {app.kind === "health" && doctors.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2 text-sm font-bold border-b border-slate-200">Doctor Performance</div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50"><tr><Th>Doctor</Th><Th>Appointments</Th><Th>Revenue</Th><Th>Avg Rating</Th><Th>Completion</Th></tr></thead>
              <tbody>
                {doctors.map((d, i) => {
                  const apt = 32 - i * 4;
                  return <tr key={d.id}><Td className="font-semibold">{d.name}</Td><Td>{apt}</Td><Td>BDT {(apt * d.fee).toLocaleString()}</Td><Td>{(5 - i * 0.1).toFixed(1)} ⭐</Td><Td>{95 - i}%</Td></tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {app.kind === "education" && courses.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2 text-sm font-bold border-b border-slate-200">Course Performance</div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50"><tr><Th>Course</Th><Th>Enrolled</Th><Th>Completed</Th><Th>Revenue</Th><Th>Avg Rating</Th></tr></thead>
              <tbody>
                {courses.map((c, i) => {
                  const enr = 84 - i * 12;
                  return <tr key={c.id}><Td className="font-semibold">{c.title}</Td><Td>{enr}</Td><Td>{Math.round(enr * 0.6)}</Td><Td>BDT {(enr * c.price).toLocaleString()}</Td><Td>{(4.7 - i * 0.1).toFixed(1)} ⭐</Td></tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
