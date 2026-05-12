import React, { useState, useMemo } from "react";
import { Search, Star, Eye, ArrowRight } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ALL_CATEGORIES, CATEGORY_BADGE, API_BADGE } from "../../mocks/builderTemplates";
import { useTemplateRatings } from "../../hooks/useBuilderStorage";

// ---- Tiny CSS browser frame mockup for a web template card ----
const MiniBrowserMockup = ({ tpl }) => {
  const p = tpl.palette?.primary || "#0f172a";
  const a = tpl.palette?.accent || "#e11d48";
  return (
    <div className="bg-gray-100 rounded-lg border border-gray-300 shadow-sm overflow-hidden">
      <div className="bg-gray-200 h-5 flex items-center px-2 gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
        <div className="flex-1 mx-2 bg-white rounded text-[8px] text-gray-400 px-1 h-3 flex items-center font-mono truncate">{tpl.slug}.bdapps.app</div>
      </div>
      <div className="bg-white h-32 overflow-hidden flex flex-col">
        <div className="h-5 flex items-center justify-between px-2" style={{ background: p }}>
          <div className="text-[7px] text-white font-bold">{tpl.name.slice(0, 10)}</div>
          <div className="flex gap-0.5">{[0, 1, 2].map((i) => <span key={i} className="w-1 h-1 rounded-full bg-white/40"></span>)}</div>
        </div>
        <div className="flex-1 grid grid-cols-3 gap-1 p-1.5">
          <div className="col-span-3 rounded h-5" style={{ background: `linear-gradient(135deg, ${p}, ${a})` }}></div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-slate-100 rounded h-12 flex flex-col items-center justify-center">
              <div className="text-sm">{tpl.icon}</div>
              <div className="w-6 h-0.5 mt-0.5 rounded" style={{ background: p }}></div>
            </div>
          ))}
        </div>
        <div className="h-3 flex items-center px-2 gap-1 border-t border-slate-100">
          <div className="flex-1 h-1.5 rounded bg-slate-100"></div>
          <div className="w-6 h-1.5 rounded" style={{ background: a }}></div>
        </div>
      </div>
    </div>
  );
};

// ---- Tiny CSS phone frame mockup for an android template card ----
const MiniPhoneMockup = ({ tpl }) => {
  const p = tpl.palette?.primary || "#e11d48";
  const a = tpl.palette?.accent || "#ffffff";
  return (
    <div className="flex items-center justify-center bg-slate-50 rounded-lg py-3">
      <div className="relative bg-gray-900 rounded-[1.25rem] border-2 border-gray-700 shadow-md overflow-hidden" style={{ width: 90, height: 160 }}>
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-gray-900 rounded-full z-10"></div>
        <div className="bg-white w-full h-full overflow-hidden pt-3 flex flex-col">
          <div className="h-5 flex items-center justify-between px-1.5" style={{ background: p }}>
            <div className="text-[6px] font-bold" style={{ color: a }}>{tpl.name.slice(0, 8)}</div>
            <div className="text-[6px]" style={{ color: a }}>🔔</div>
          </div>
          <div className="flex-1 p-1 flex flex-col items-center justify-center gap-1">
            <div className="rounded p-1.5 w-full text-white text-center" style={{ background: `linear-gradient(135deg, ${p}, ${p}cc)` }}>
              <div className="text-base">{tpl.icon}</div>
              <div className="text-[6px] font-bold mt-0.5">{tpl.name.slice(0, 12)}</div>
            </div>
            <div className="grid grid-cols-3 gap-0.5 w-full">
              {[0, 1, 2].map((i) => <div key={i} className="h-3 rounded" style={{ background: `${p}22` }}></div>)}
            </div>
          </div>
          <div className="h-4 flex justify-around items-center border-t border-slate-100">
            {[0, 1, 2, 3].map((i) => <div key={i} className="w-1 h-1 rounded-full" style={{ background: i === 0 ? p : "#94a3b8" }}></div>)}
          </div>
        </div>
      </div>
    </div>
  );
};

const StarRow = ({ value, count, userRating }) => {
  const rounded = Math.round(value);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={10} className={s <= rounded ? "text-amber-400 fill-amber-400" : "text-slate-300 fill-slate-300"} />)}
      </div>
      <span className="text-[10px] text-slate-600 font-medium">{value.toFixed(1)}</span>
      <span className="text-[10px] text-slate-400">({count})</span>
      {userRating > 0 && <span className="text-[9px] text-amber-600 font-semibold">· You {userRating}★</span>}
    </div>
  );
};

const TemplateCard = ({ tpl, type, onUse, onLivePreview, userRating, aggregate, compareMode, isSelected, onToggleCompare }) => (
  <div
    data-testid={`template-card-${tpl.id}`}
    className={`relative group border rounded-2xl bg-white p-4 hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col ${isSelected ? "border-[#7c3aed] ring-2 ring-purple-200" : "border-slate-200 hover:border-[#e11d48]"}`}
  >
    {userRating > 0 && (
      <div className="absolute -top-2 -right-2 bg-amber-400 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-md z-10">
        <Star size={12} className="fill-white" />
      </div>
    )}
    {compareMode && (
      <label className="absolute top-2 left-2 flex items-center gap-1.5 cursor-pointer bg-white rounded-md border border-slate-200 px-2 py-1 shadow-sm z-10">
        <input
          type="checkbox"
          data-testid={`compare-check-${tpl.id}`}
          checked={!!isSelected}
          onChange={() => onToggleCompare?.(tpl.id)}
          className="accent-[#7c3aed]"
        />
        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-600">Compare</span>
      </label>
    )}

    {/* Frame mockup */}
    <div className="mb-3">
      {type === "web" ? <MiniBrowserMockup tpl={tpl} /> : <MiniPhoneMockup tpl={tpl} />}
    </div>

    {/* Name */}
    <h3 className="font-bold text-base tracking-tight leading-tight">{tpl.name}</h3>

    {/* Badges */}
    <div className="flex flex-wrap gap-1.5 mt-2">
      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${CATEGORY_BADGE[tpl.category] || "bg-slate-100 text-slate-700"}`}>{tpl.category}</span>
      {(tpl.apis || []).map((a) => (
        <span key={a} className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${API_BADGE[a] || "bg-slate-50 text-slate-700 border-slate-200"}`}>{a}</span>
      ))}
    </div>

    {/* Bullets */}
    <ul className="space-y-1 my-3 flex-1">
      {tpl.bullets.map((b, i) => (
        <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
          <span className="text-[#e11d48] mt-0.5">•</span>
          <span>{b}</span>
        </li>
      ))}
    </ul>

    <StarRow value={aggregate} count={tpl.ratingCount + (userRating > 0 ? 1 : 0)} userRating={userRating} />

    {/* Action buttons */}
    <div className="flex gap-2 mt-3">
      <Button
        size="sm"
        variant="outline"
        data-testid={`live-preview-${tpl.id}`}
        onClick={() => onLivePreview(tpl)}
        className="flex-1 gap-1.5"
      >
        <Eye size={14} /> Live Preview
      </Button>
      <Button
        size="sm"
        data-testid={`use-template-${tpl.id}`}
        onClick={() => onUse(tpl)}
        className="flex-1 bg-[#e11d48] hover:bg-[#be123c] gap-1.5"
      >
        Use Template <ArrowRight size={12} />
      </Button>
    </div>
  </div>
);

const TemplateGallery = ({ templates, banner, badges, type = "web", onSelect, onLivePreview, testidPrefix, compareMode, compareSelected = [], onToggleCompare }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const { getUserRating, getAggregateRating } = useTemplateRatings();

  const validCategories = useMemo(() => {
    const inUse = new Set(templates.map((t) => t.category));
    return ["All", ...ALL_CATEGORIES.filter((c) => c !== "All" && inUse.has(c))];
  }, [templates]);

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const matchSearch = !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || t.category === category;
      return matchSearch && matchCat;
    });
  }, [templates, search, category]);

  return (
    <div className="space-y-5">
      {banner && (
        <div data-testid={`${testidPrefix}-banner`} className="rounded-xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-purple-100 px-4 py-3 text-sm text-slate-700">
          {banner}
        </div>
      )}
      {badges && (
        <div className="flex flex-wrap gap-2">
          {badges.map((b) => (
            <span key={b} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-900 text-white">{b}</span>
          ))}
        </div>
      )}

      <div className="relative max-w-md">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input
          data-testid={`${testidPrefix}-search`}
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {validCategories.map((c) => (
          <button
            key={c}
            data-testid={`${testidPrefix}-cat-${c.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            onClick={() => setCategory(c)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
              category === c ? "bg-[#0f172a] text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div data-testid={`${testidPrefix}-empty`} className="text-center py-16 text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl">
          No templates match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <TemplateCard
              key={t.id}
              tpl={t}
              type={type}
              onUse={onSelect}
              onLivePreview={onLivePreview}
              userRating={getUserRating(t.id)}
              aggregate={getAggregateRating(t.id, t.baseRating)}
              compareMode={compareMode}
              isSelected={compareSelected.includes(t.id)}
              onToggleCompare={onToggleCompare}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;
