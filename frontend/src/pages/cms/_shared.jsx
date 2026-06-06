// Shared CMS table + slide-in panel utilities
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "../../components/ui/sheet";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import ImageDropzone from "../../components/cms/ImageDropzone";

export const Th = ({ children, className = "" }) => (
  <th className={`text-left text-[10px] uppercase tracking-widest font-bold text-slate-500 px-3 py-2 border-b border-slate-200 ${className}`}>{children}</th>
);
export const Td = ({ children, className = "" }) => (
  <td className={`px-3 py-2 text-sm border-b border-slate-100 ${className}`}>{children}</td>
);

export const StatusPill = ({ status }) => {
  const map = {
    "Active": "bg-emerald-100 text-emerald-700",
    "Draft": "bg-slate-100 text-slate-600",
    "On Leave": "bg-amber-100 text-amber-700",
    "Out of Stock": "bg-rose-100 text-rose-700",
    "Coming Soon": "bg-blue-100 text-blue-700",
    "Sold": "bg-slate-200 text-slate-700",
    "Rented": "bg-slate-200 text-slate-700",
    "Sold Out": "bg-rose-100 text-rose-700",
    "Completed": "bg-emerald-100 text-emerald-700",
    "Paused": "bg-amber-100 text-amber-700",
  };
  return <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${map[status] || "bg-slate-100 text-slate-700"}`}>{status}</span>;
};

export const SlidePanel = ({ open, onClose, title, description, children, footer }) => (
  <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
    <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto" data-testid="cms-slide-panel">
      <SheetTitle>{title}</SheetTitle>
      <SheetDescription>{description}</SheetDescription>
      <div className="space-y-3 mt-4">{children}</div>
      {footer && <div className="mt-4 pt-3 border-t border-slate-200">{footer}</div>}
    </SheetContent>
  </Sheet>
);

export const Field = ({ label, required, optional, children }) => (
  <div>
    <Label className="text-xs">{label}{required && <span className="text-rose-500"> *</span>}{optional && <span className="text-slate-400 ml-1 text-[10px]">(Optional)</span>}</Label>
    <div className="mt-1">{children}</div>
  </div>
);

export { Input, Label, Textarea, Button, ImageDropzone };
