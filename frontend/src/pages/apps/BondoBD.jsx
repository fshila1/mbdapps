import React from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import APIMonitor from "../../components/APIMonitor";
import { requestOTP, verifyOTP, userSubscription, sendSMS, directDebit } from "../../services/BDAppsAPI";
import { MatrimonyWebPreview } from "../../components/digital/interactive/MatrimonyPreview";

/**
 * Public BondoBD Matrimony app.
 *
 * SINGLE SOURCE OF TRUTH: this page reuses the exact same MatrimonyWebPreview
 * component that powers the /digital Live Preview, so the generated app is
 * byte-identical to what users see while previewing the template in the App
 * Builder. The BondoBD page only adds:
 *   1. A thin outer toolbar (Back + Lang toggle + Welcome label)
 *   2. Real BDAppsAPI calls (sendSMS / requestOTP / directDebit / userSubscription)
 *      bound to the preview's onPhoneSubmit / onOtpVerify / onInterest / onSubscribe hooks
 *   3. APIMonitor panel so visitors can see live telecom API traffic.
 */
const BondoBD = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language === "bn" ? "bn" : "en";
  const setLocale = (l) => i18n.changeLanguage(l);
  const language = locale === "bn" ? "Bengali" : "English";

  const handlePhoneSubmit = async (phone) => {
    try {
      const otp = await requestOTP(`tel:88${(phone || "").replace(/[^0-9]/g, "")}`, "BondoBD");
      toast.success(`OTP sent via Robi: ${otp}`, { description: "Charged via CaaS — Tk 0.50 SMS only", duration: 4500 });
    } catch (e) {
      toast.error("Failed to send OTP — please retry.");
    }
  };

  const handleOtpVerify = async (code) => {
    try {
      await verifyOTP(code || "1234");
      await userSubscription("subscribe", "tel:881711234567", "BondoBD");
      await sendSMS(["tel:881711234567"], "Welcome to BondoBD! Browse profiles at bondobd.bdapps.app", "16222");
      toast.success("Subscription activated", { description: "BondoBD basic plan is now live on your Robi number." });
    } catch (e) {
      toast.error("Verification failed — please try again.");
    }
  };

  const handleInterest = async (profile) => {
    if (!profile) return;
    try {
      await sendSMS([`tel:881711${String(Math.abs(profile.id.charCodeAt(0) * 31) % 999999).padStart(6, "0")}`], `Md. Rafiul has expressed interest in your profile. Log in to respond.`, "16222");
    } catch (_e) { /* APIMonitor will show error */ }
  };

  const handleSubscribe = async (plan) => {
    if (!plan || plan.price === 0) return;
    try {
      const dd = await directDebit("tel:881711234567", String(plan.price), "BondoBD-Premium");
      await sendSMS(["tel:881711234567"], `BondoBD Premium activated! BDT ${plan.price} deducted. Txn: ${dd.transactionId}`, "16222");
    } catch (_e) { /* APIMonitor will show error */ }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FFFBEF" }}>
      {/* Thin outer toolbar — provides Back + Lang + Welcome only. The hero
          + nav (Browse/Favourites/Premium) come from the MatrimonyWebPreview
          TopBar so the generated app exactly mirrors the live preview. */}
      <div className="w-full bg-white/80 backdrop-blur sticky top-0 z-30" style={{ borderBottom: "1px solid #C7A24A33" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          <Link to="/appstore" data-testid="bondobd-back" className="inline-flex items-center gap-1 text-sm font-semibold text-rose-900 hover:text-rose-700">
            <ChevronLeft size={16} /> {locale === "bn" ? "ফিরে" : "Back"}
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs" style={{ color: "#7A5C5F" }}>{locale === "bn" ? "স্বাগতম, মো. রফিউল" : "Welcome, Md. Rafiul"}</span>
            <div className="inline-flex bg-rose-900/10 rounded-full border border-rose-900/20 p-0.5 text-[10px] font-bold">
              {["bn", "en"].map((l) => (
                <button key={l} data-testid={`lang-${l}`} onClick={() => setLocale(l)} className={`px-2.5 py-1 rounded-full transition-all ${locale === l ? "bg-rose-900 text-white" : "text-rose-900 opacity-70 hover:opacity-100"}`}>
                  {l === "bn" ? "বাংলা" : "EN"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Single source of truth — identical to the /digital Live Preview */}
      <div className="flex-1 flex flex-col" style={{ minHeight: "calc(100vh - 48px)" }}>
        <MatrimonyWebPreview
          cfg={{ appName: "BondoBD — Matrimony Service", primary: "#7E1733", accent: "#C2185B", language }}
          onPhoneSubmit={handlePhoneSubmit}
          onOtpVerify={handleOtpVerify}
          onInterest={handleInterest}
          onSubscribe={handleSubscribe}
        />
      </div>

      <APIMonitor />
    </div>
  );
};

export default BondoBD;
