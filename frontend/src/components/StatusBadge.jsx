import React from "react";
import { STATUS_COLORS } from "../mocks/data";

const StatusBadge = ({ status, className = "" }) => {
  const cls = STATUS_COLORS[status] || "bg-slate-100 text-slate-700 border-slate-200";
  return (
    <span className={`inline-flex items-center text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded border ${cls} ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
