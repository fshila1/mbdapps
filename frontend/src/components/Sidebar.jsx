import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, ServerCog, Sparkles, Store, BarChart3, Layers, Users, ShieldCheck, Settings2, LogOut, X, FolderOpen } from "lucide-react";
import { useApp } from "../context/AppContext";

const DEV_LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/provisioning", label: "Provisioning", icon: ServerCog },
  { to: "/lite", label: "BDapps Lite", icon: Sparkles },
  { to: "/appstore", label: "App Store", icon: Store },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/digital", label: "Digital", icon: Layers, accent: true },
  { to: "/my-apps", label: "My Apps", icon: FolderOpen, accent: true },
  { to: "/add-ons", label: "Add-Ons", icon: Sparkles, accent: true },
];

const ADMIN_LINKS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/users", label: "User Management", icon: Users },
  { to: "/admin/provisioning", label: "Provisioning", icon: ServerCog },
  { to: "/appstore", label: "App Store", icon: Store },
  { to: "/reports", label: "Reporting", icon: BarChart3 },
  { to: "/admin/tap", label: "Tap Admin", icon: ShieldCheck },
  { to: "/admin/appstore", label: "App Store Admin", icon: Settings2 },
];

const Sidebar = ({ open, onClose }) => {
  const { user, logout } = useApp();
  const loc = useLocation();
  const navigate = useNavigate();
  if (!user) return null;

  const links = user.role === "admin" ? ADMIN_LINKS : DEV_LINKS;
  const isActive = (l) => l.exact ? loc.pathname === l.to : loc.pathname === l.to || loc.pathname.startsWith(l.to + "/");

  const onLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <>
      {open && <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden" data-testid="sidebar-overlay" />}
      <aside data-testid="sidebar" className={`${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:sticky lg:top-0 left-0 top-0 z-50 w-64 h-screen bg-[#0f172a] text-white flex flex-col transition-transform shrink-0`}>
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/10">
          <Link to={user.role === "admin" ? "/admin" : "/dashboard"} className="flex items-center gap-2" onClick={onClose}>
            <div className="w-8 h-8 bg-[#e11d48] rounded-md flex items-center justify-center font-bold">B</div>
            <span className="font-bold text-lg tracking-tight" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>BDapps</span>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1 hover:bg-white/10 rounded" data-testid="sidebar-close"><X size={18} /></button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-3 py-1">{user.role === "admin" ? "Admin" : "Developer"} Console</p>
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={onClose}
              data-testid={`side-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors min-h-[44px] ${isActive(l) ? "bg-[#e11d48] text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>
              <l.icon size={16} />
              <span className="flex-1">{l.label}</span>
              {l.accent && !isActive(l) && <span className="text-[9px] uppercase font-bold bg-[#e11d48] text-white px-1.5 py-0.5 rounded">New</span>}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <div className="px-3 py-2 mb-1 text-xs">
            <div className="font-semibold text-white truncate">{user.name}</div>
            <div className="text-slate-400 truncate text-[11px]">{user.email}</div>
          </div>
          <button onClick={onLogout} data-testid="sidebar-logout" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-rose-300 hover:bg-white/5 min-h-[44px]">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
