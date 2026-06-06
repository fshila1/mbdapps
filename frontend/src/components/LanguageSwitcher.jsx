import React from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "./ui/dropdown-menu";

const LANGS = [
  { code: "en", label: "English", short: "EN" },
  { code: "bn", label: "বাংলা", short: "বাং" },
];

const LanguageSwitcher = ({ variant = "default" }) => {
  const { i18n, t } = useTranslation();
  const current = LANGS.find((l) => l.code === i18n.language) || LANGS[0];

  if (variant === "pill") {
    return (
      <div data-testid="lang-switch-pill" className="inline-flex bg-white/10 backdrop-blur rounded-full border border-white/30 p-0.5 text-[10px] font-bold">
        {LANGS.map((l) => (
          <button
            key={l.code}
            data-testid={`lang-${l.code}`}
            onClick={() => i18n.changeLanguage(l.code)}
            className={`px-2.5 py-1 rounded-full transition-all ${i18n.language === l.code ? "bg-white text-slate-900" : "text-white opacity-70 hover:opacity-100"}`}
          >
            {l.code === "bn" ? "বাংলা" : "EN"}
          </button>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          data-testid="language-switcher"
          className="flex items-center gap-1.5 px-2.5 py-2 hover:bg-slate-100 rounded-md transition-colors min-h-[40px] text-sm font-medium text-slate-700"
          aria-label={t("common.language")}
          title={t("common.language")}
        >
          <Globe size={16} />
          <span className="text-xs font-bold">{current.short}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l.code}
            data-testid={`language-option-${l.code}`}
            onClick={() => i18n.changeLanguage(l.code)}
            className={`cursor-pointer ${i18n.language === l.code ? "bg-slate-100 font-bold" : ""}`}
          >
            <span className="text-base mr-2">{l.code === "bn" ? "🇧🇩" : "🇬🇧"}</span>
            {l.label}
            {i18n.language === l.code && <span className="ml-auto text-emerald-600">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
