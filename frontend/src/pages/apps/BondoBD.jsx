import React, { useState } from "react";
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
 *   2. Real BDAppsAPI calls (requestOTP/verifyOTP/userSubscription/sendSMS/directDebit)
 *      bound to the preview's onPhoneSubmit / onOtpVerify / onInterest / onSubscribe hooks
 *   3. APIMonitor panel so visitors can see live telecom API traffic.
 */
const BondoBD = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language === "bn" ? "bn" : "en";
  const setLocale = (l) => i18n.changeLanguage(l);
  const language = locale === "bn" ? "Bengali" : "English";

  // Track per-session state so verifyOTP can correctly reference the OTP issued by requestOTP
  const [authState, setAuthState] = useState({ msisdn: "", referenceNo: "" });

  // 1) User enters phone → call requestOTP(subscriberMSISDN) → response is an object {statusCode, referenceNo, _demo_otp}
  const handlePhoneSubmit = async (phone) => {
    try {
      const clean = (phone || "").replace(/[^0-9]/g, "");
      const otpRes = await requestOTP(clean);
      if (otpRes.statusCode === "S1000") {
        setAuthState({ msisdn: clean, referenceNo: otpRes.referenceNo });
        toast.success(`OTP sent via Robi: ${otpRes._demo_otp}`, { description: "Charged via CaaS — Tk 0.50 SMS only", duration: 5000 });
      } else {
        toast.error("Failed to send OTP — please retry.");
      }
    } catch (_e) {
      toast.error("Failed to send OTP — please retry.");
    }
  };

  // 2) User enters OTP → verifyOTP(referenceNo, code). The user can also bypass with the universal "123456" backdoor (or any 4 digits since the preview is demo-only).
  const handleOtpVerify = async (code) => {
    const enteredOtp = code || "123456"; // demo bypass — accepts any code
    const subscriberMsisdn = `tel:88${authState.msisdn || "1711234567"}`;
    try {
      const verifyRes = await verifyOTP(authState.referenceNo || "DEMO_REF", enteredOtp);
      // The demo MatrimonyWebPreview only feeds 4 digits, but BDAppsAPI expects the original 6-digit OTP.
      // We register the subscriber regardless so the demo flow always succeeds (this is a stub demo, not a real auth gate).
      const subRes = await userSubscription(subscriberMsisdn, "SUB");
      await sendSMS([subscriberMsisdn], "Welcome to BondoBD! Browse profiles at bondobd.bdapps.app", "16222");
      if (subRes.statusCode === "S1000") {
        toast.success("Subscription activated", { description: verifyRes.statusCode === "S1000" ? "BondoBD basic plan is now live on your Robi number." : "Demo bypass — proceeding without OTP verification." });
      }
    } catch (_e) {
      toast.error("Verification failed — please try again.");
    }
  };

  const handleInterest = async (profile) => {
    if (!profile) return;
    try {
      await sendSMS([`tel:881711${String(Math.abs((profile.id || "x").charCodeAt(0) * 31) % 999999).padStart(6, "0")}`], `Md. Rafiul has expressed interest in your profile. Log in to respond.`, "16222");
    } catch (_e) { /* APIMonitor will show error */ }
  };

  const handleSubscribe = async (plan) => {
    if (!plan) return;
    const subscriberMsisdn = `tel:88${authState.msisdn || "1711234567"}`;
    if (plan.price === 0) {
      toast.success("✓ Free plan active", { description: "You can browse profiles with limited contact unlocks." });
      return;
    }
    try {
      const dd = await directDebit(subscriberMsisdn, String(plan.price), `BondoBD ${plan.name}`);
      await sendSMS([subscriberMsisdn], `BondoBD Premium activated! BDT ${plan.price} deducted. Txn: ${dd.transactionId || "—"}`, "16222");
      toast.success(`✓ Charged BDT ${plan.price} via CaaS`, { description: `Plan: ${plan.name} · Txn: ${dd.transactionId || "demo-txn"}` });
    } catch (_e) {
      toast.error("Payment failed — please try again.");
    }
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
