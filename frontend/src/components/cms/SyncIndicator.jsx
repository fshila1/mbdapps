import React, { useEffect, useState } from "react";

const SyncIndicator = ({ lastSync, saving }) => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 30000);
    return () => clearInterval(t);
  }, []);

  const ago = (ts) => {
    if (!ts) return "just now";
    const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)} day(s) ago`;
  };

  if (saving) {
    return (
      <div data-testid="sync-saving" className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
        Saving changes...
      </div>
    );
  }
  return (
    <div data-testid="sync-live" className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full" key={tick}>
      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
      Changes live · {ago(lastSync)}
    </div>
  );
};

export default SyncIndicator;
