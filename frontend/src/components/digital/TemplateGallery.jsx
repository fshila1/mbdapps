import React, { useState, useMemo } from "react";
import { Search, Star } from "lucide-react";
import { Input } from "../ui/input";
import { ALL_CATEGORIES } from "../../mocks/builderTemplates";
import { useTemplateRatings } from "../../hooks/useBuilderStorage";

const StarRow = ({ value, count, userRating }) => {
  const rounded = Math.round(value);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} size={11} className={s <= rounded ? "text-amber-400 fill-amber-400" : "text-slate-300 fill-slate-300"} />
        ))}
      </div>
      <span className="text-[11px] text-slate-600 font-medium">{value.toFixed(1)}</span>
      <span className="text-[11px] text-slate-400">({count} ratings)</span>
      {userRating > 0 && (
        <span className="text-[10px] text-amber-600 font-semibold ml-1">· Your rating: {userRating}★</span>
      )}
    </div>
  );
};

const TemplateCard = ({ tpl, onView, userRating, aggregate }) => (
  <div
    data-testid={`template-card-${tpl.id}`}
    className="relative group border border-slate-200 rounded-2xl bg-white p-5 hover:border-[#e11d48] hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col"
  >
    {userRating > 0 && (
      <div className="absolute -top-2 -right-2 bg-amber-400 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-md">
        <Star size={12} className="fill-white" />
      </div>
    )}
    <div className="flex items-start gap-3 mb-3">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tpl.iconGradient} flex items-center justify-center text-3xl shadow-sm flex-shrink-0`}>
        {tpl.icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-base tracking-tight leading-tight">{tpl.name}</h3>
        <span className="inline-block mt-1 text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
          {tpl.category}
        </span>
      </div>
    </div>
    <p className="text-sm text-slate-600 leading-relaxed mb-3">{tpl.description}</p>
    <ul className="space-y-1 mb-4 flex-1">
      {tpl.bullets.map((b, i) => (
        <li key={i} className="text-xs text-slate-500 flex items-start gap-1.5">
          <span className="text-[#e11d48] mt-0.5">•</span>
          <span>{b}</span>
        </li>
      ))}
    </ul>
    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
      <StarRow value={aggregate} count={tpl.ratingCount + (userRating > 0 ? 1 : 0)} userRating={userRating} />
    </div>
    <button
      data-testid={`view-design-${tpl.id}`}
      onClick={() => onView(tpl)}
      className="mt-3 text-sm font-semibold text-[#7c3aed] hover:text-[#5b21b6] underline underline-offset-2 self-start"
    >
      View Design Options →
    </button>
  </div>
);

const TemplateGallery = ({ templates, banner, badges, onSelect, testidPrefix }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const { getUserRating, getAggregateRating } = useTemplateRatings();

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
            <span key={b} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-900 text-white">
              {b}
            </span>
          ))}
        </div>
      )}

      {/* Search */}
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

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {ALL_CATEGORIES.map((c) => (
          <button
            key={c}
            data-testid={`${testidPrefix}-cat-${c.toLowerCase()}`}
            onClick={() => setCategory(c)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
              category === c
                ? "bg-[#0f172a] text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
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
              onView={onSelect}
              userRating={getUserRating(t.id)}
              aggregate={getAggregateRating(t.id, t.baseRating)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;
