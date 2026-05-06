import React, { createContext, useContext, useEffect, useState } from "react";
import {
  seedApps, seedLiteApps, seedKeywords, seedSystemUsers, seedAppCreators,
  seedAppstoreUsers, seedBuildFiles, seedAds, seedSubscriptions, seedAppStore,
} from "../mocks/data";

const AppContext = createContext(null);

const USERS = {
  "developer@bdapps.com": { password: "dev123", role: "developer", name: "Rafiul Karim", username: "developer" },
  "admin@bdapps.com": { password: "admin123", role: "admin", name: "System Admin", username: "admin" },
};

const safeParse = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => safeParse("bdapps_user", null));
  const [apps, setApps] = useState(() => safeParse("bdapps_apps", seedApps));
  const [liteApps, setLiteApps] = useState(() => safeParse("bdapps_liteapps", seedLiteApps));
  const [keywords] = useState(seedKeywords);
  const [systemUsers, setSystemUsers] = useState(seedSystemUsers);
  const [appCreators] = useState(seedAppCreators);
  const [appstoreUsers] = useState(seedAppstoreUsers);
  const [buildFiles, setBuildFiles] = useState(seedBuildFiles);
  const [ads, setAds] = useState(() => safeParse("bdapps_ads", seedAds));
  const [subscriptions] = useState(seedSubscriptions);
  const [storeApps, setStoreApps] = useState(() => safeParse("bdapps_store", seedAppStore));
  const [storeLayout, setStoreLayout] = useState(() => safeParse("bdapps_layout", { hero: "Discover Apps Built for Bangladesh", sub: "Subscribe via SMS in 1 step" }));
  const [appStoreUser, setAppStoreUser] = useState(() => safeParse("bdapps_storeuser", null));
  const [pendingTemplate, setPendingTemplate] = useState(null);

  useEffect(() => {
    user ? localStorage.setItem("bdapps_user", JSON.stringify(user)) : localStorage.removeItem("bdapps_user");
  }, [user]);
  useEffect(() => localStorage.setItem("bdapps_apps", JSON.stringify(apps)), [apps]);
  useEffect(() => localStorage.setItem("bdapps_liteapps", JSON.stringify(liteApps)), [liteApps]);
  useEffect(() => localStorage.setItem("bdapps_ads", JSON.stringify(ads)), [ads]);
  useEffect(() => localStorage.setItem("bdapps_store", JSON.stringify(storeApps)), [storeApps]);
  useEffect(() => localStorage.setItem("bdapps_layout", JSON.stringify(storeLayout)), [storeLayout]);
  useEffect(() => {
    appStoreUser ? localStorage.setItem("bdapps_storeuser", JSON.stringify(appStoreUser)) : localStorage.removeItem("bdapps_storeuser");
  }, [appStoreUser]);

  const login = (email, password) => {
    const u = USERS[email?.toLowerCase()];
    if (!u || u.password !== password) return { ok: false, error: "Invalid email or password" };
    const session = { email, role: u.role, name: u.name, username: u.username };
    setUser(session);
    return { ok: true, role: u.role };
  };

  const logout = () => setUser(null);

  const addApp = (app) => {
    const id = `APP-${1000 + apps.length + 10}`;
    const newApp = {
      id,
      created: new Date().toISOString().slice(0, 10),
      status: "Pending Approval",
      username: user?.email || "developer@bdapps.com",
      revenueShare: { developer: 65, operator: 25, platform: 10 },
      activity: [{ actor: user?.email || "developer", date: new Date().toISOString().slice(0, 10), remark: "App submitted" }],
      ...app,
    };
    setApps((p) => [newApp, ...p]);
    return newApp;
  };

  const updateAppStatus = (id, newStatus, remark) => {
    setApps((p) => p.map((a) => a.id === id ? {
      ...a, status: newStatus,
      activity: [{ actor: user?.email || "admin", date: new Date().toISOString().slice(0, 10), remark: `${newStatus}${remark ? " - " + remark : ""}` }, ...(a.activity || [])],
    } : a));
  };

  const addLiteApp = (app) => {
    const id = `LITE-${String(liteApps.length + 1).padStart(3, "0")}`;
    setLiteApps((p) => [{ id, status: "Pending", ...app }, ...p]);
  };

  const updateBuildFileStatus = (idx, status) => {
    setBuildFiles((p) => p.map((b, i) => (i === idx ? { ...b, status } : b)));
  };

  const addAd = (ad) => setAds((p) => [...p, { id: `AD-${String(p.length + 1).padStart(2, "0")}`, ...ad }]);
  const updateAd = (id, patch) => setAds((p) => p.map((a) => a.id === id ? { ...a, ...patch } : a));
  const removeAd = (id) => setAds((p) => p.filter((a) => a.id !== id));

  const updateStoreApp = (id, patch) => setStoreApps((p) => p.map((a) => a.id === id ? { ...a, ...patch } : a));

  const value = {
    user, login, logout,
    apps, addApp, updateAppStatus,
    liteApps, addLiteApp,
    keywords, systemUsers, setSystemUsers, appCreators, appstoreUsers,
    buildFiles, updateBuildFileStatus,
    ads, addAd, updateAd, removeAd,
    subscriptions, storeApps, updateStoreApp,
    storeLayout, setStoreLayout,
    appStoreUser, setAppStoreUser,
    pendingTemplate, setPendingTemplate,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
};
