import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut, Menu, ChevronDown } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "../components/ui/dropdown-menu";
import { Badge } from "../components/ui/badge";

export const Logo = ({ className = "" }) => (
  <Link to="/" data-testid="bdapps-logo" className={`flex items-center gap-2 ${className}`}>
    <div className="w-8 h-8 bg-[#e11d48] rounded-md flex items-center justify-center text-white font-bold tracking-tight">B</div>
    <span className="font-bold text-xl tracking-tight text-[#0f172a]" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
      BDapps
    </span>
  </Link>
);

const NOTIFS = [
  { title: "App approved", body: "City Prayer Times moved to Limited Production.", time: "2h ago" },
  { title: "Build under review", body: "Recipe of the Day v1.0 awaiting admin.", time: "1d ago" },
  { title: "New subscriber milestone", body: "Cricket Live Updates crossed 10k.", time: "3d ago" },
];

const Layout = ({ children, sidebar = null }) => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const onLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-white text-[#0f172a]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {sidebar && (
              <button data-testid="sidebar-toggle" onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 -ml-2">
                <Menu size={20} />
              </button>
            )}
            <Logo />
            {user && (
              <nav className="hidden md:flex items-center gap-1 ml-4">
                <Link data-testid="nav-dashboard" to={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="px-3 py-2 text-sm font-medium hover:text-[#e11d48] transition-colors">
                  Dashboard
                </Link>
                <Link data-testid="nav-appstore" to="/appstore" className="px-3 py-2 text-sm font-medium hover:text-[#e11d48] transition-colors">
                  App Store
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button data-testid="notification-bell" className="relative p-2 hover:bg-slate-100 rounded-md transition-colors">
                      <Bell size={18} />
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#e11d48] rounded-full"></span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {NOTIFS.map((n, i) => (
                      <DropdownMenuItem key={i} className="flex flex-col items-start gap-0.5 py-2">
                        <div className="font-medium text-sm">{n.title}</div>
                        <div className="text-xs text-slate-500">{n.body}</div>
                        <div className="text-xs text-slate-400">{n.time}</div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button data-testid="user-menu-trigger" className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-100 rounded-md transition-colors">
                      <div className="w-8 h-8 bg-[#0f172a] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {user.name?.[0] || "U"}
                      </div>
                      <span className="hidden sm:block text-sm font-medium">{user.name}</span>
                      <ChevronDown size={14} className="text-slate-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs font-normal text-slate-500">{user.email}</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate(user.role === "admin" ? "/admin" : "/dashboard")} data-testid="dropdown-dashboard">
                      Dashboard
                    </DropdownMenuItem>
                    <Badge className="ml-2 my-1 bg-slate-100 text-[#0f172a] hover:bg-slate-100">{user.role}</Badge>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem data-testid="logout-button" onClick={onLogout} className="text-[#e11d48]">
                      <LogOut size={14} className="mr-2" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex max-w-[1400px] mx-auto">
        {sidebar && <aside className={`${mobileOpen ? "block" : "hidden"} lg:block w-60 shrink-0 border-r border-slate-200 min-h-[calc(100vh-4rem)]`}>{sidebar}</aside>}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
