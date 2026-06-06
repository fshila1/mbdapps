// Hooks for managing generated apps and template ratings in localStorage
import { useCallback, useEffect, useState } from "react";

const GEN_KEY = "bdapps_generated_apps";
const RATE_KEY = "bdapps_template_ratings";

const safeParse = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

export const useGeneratedApps = () => {
  const [apps, setApps] = useState(() => safeParse(GEN_KEY, []));

  useEffect(() => {
    const sync = (e) => {
      if (e.key === GEN_KEY) setApps(safeParse(GEN_KEY, []));
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const addApp = useCallback((app) => {
    setApps((prev) => {
      // dedupe by id (template+design+name+type) — overwrite if same id
      const filtered = prev.filter((a) => a.id !== app.id);
      const next = [{ ...app, generatedAt: Date.now() }, ...filtered].slice(0, 30);
      localStorage.setItem(GEN_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearApps = useCallback(() => {
    localStorage.removeItem(GEN_KEY);
    setApps([]);
  }, []);

  return { apps, addApp, clearApps };
};

export const useTemplateRatings = () => {
  const [ratings, setRatings] = useState(() => safeParse(RATE_KEY, {}));

  const setRating = useCallback((templateId, stars) => {
    setRatings((prev) => {
      const next = { ...prev, [templateId]: stars };
      localStorage.setItem(RATE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getUserRating = useCallback((templateId) => ratings[templateId] || 0, [ratings]);

  // Aggregate: averages user rating with base mock rating
  const getAggregateRating = useCallback(
    (templateId, baseRating) => {
      const user = ratings[templateId];
      if (!user) return baseRating;
      return Math.round(((baseRating + user) / 2) * 10) / 10;
    },
    [ratings]
  );

  return { ratings, setRating, getUserRating, getAggregateRating };
};
