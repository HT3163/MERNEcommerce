import React, { useEffect, useRef } from "react";
import "./orderSuccess.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import {
  FiPackage, FiArrowRight, FiShoppingBag,
  FiMail, FiTruck, FiCheckCircle,
} from "react-icons/fi";

/* ── Confetti colours ─────────────────────────────── */
const CONFETTI_COLORS = [
  "#6366f1", "#a5b4fc", "#10b981", "#34d399",
  "#f59e0b", "#fbbf24", "#ef4444", "#fb923c",
];

/* ── Spawn confetti particles ─────────────────────── */
const spawnConfetti = (container) => {
  const count = 60;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "confetti-piece";
    const size  = Math.random() * 8 + 6;
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const delay = Math.random() * 1.2;
    const dur   = Math.random() * 2 + 2;
    const left  = Math.random() * 100;
    const rotate = Math.random() * 360;

    el.style.cssText = `
      left: ${left}vw;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
      transform: rotate(${rotate}deg);
      border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
    `;
    container.appendChild(el);
    setTimeout(() => el.remove(), (dur + delay) * 1000 + 200);
  }
};

/* ── What happens next steps ─────────────────────── */
const NEXT_STEPS = [
  {
    icon: FiMail,
    title: "Confirmation Email",
    desc:  "We've sent an order confirmation to your email.",
  },
  {
    icon: FiTruck,
    title: "Shipping",
    desc:  "Your order will be packed and shipped within 1–2 business days.",
  },
  {
    icon: FiPackage,
    title: "Delivery",
    desc:  "Expect delivery in 3–7 business days. You'll get a tracking link.",
  },
];

/* ═══════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════ */
const OrderSuccess = () => {
  const confettiRef = useRef(null);
  const { user }    = useSelector((s) => s.user);

  /* Fire confetti once on mount */
  useEffect(() => {
    if (confettiRef.current) spawnConfetti(confettiRef.current);
  }, []);

  return (
    <>
      <MetaData title="Order Placed — LUXE" />

      {/* Confetti container */}
      <div ref={confettiRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 999 }} />

      <div
        className="min-h-screen flex items-center justify-center px-4 py-14"
        style={{ background: "#fafafa", fontFamily: "'Inter', sans-serif" }}
      >
        <div className="w-full max-w-lg text-center">

          {/* ── Animated check circle ── */}
          <div className="success-circle success-fade-up">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none"
                 stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path className="success-check-path" d="M20 6L9 17l-5-5" />
            </svg>
          </div>

          {/* ── Headline ── */}
          <h1
            className="success-fade-up success-d1 text-gray-900 mb-3"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.8rem, 5vw, 2.6rem)",
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            Order Confirmed!
          </h1>

          <p
            className="success-fade-up success-d2 text-gray-500 mb-2"
            style={{ fontSize: "1rem", lineHeight: 1.7, maxWidth: 400, margin: "0 auto 0.5rem" }}
          >
            Thank you{user?.name ? `, ${user.name.split(" ")[0]}` : ""}! Your order has been
            successfully placed and is being processed.
          </p>

          {/* Order ID pill */}
          <div className="success-fade-up success-d2 flex justify-center mb-8">
            <span
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0",
                       fontFamily: "'Inter', sans-serif" }}
            >
              <FiCheckCircle size={12} />
              Payment Successful
            </span>
          </div>

          {/* ── What happens next ── */}
          <div
            className="success-fade-up success-d3 bg-white rounded-2xl p-6 mb-6 text-left"
            style={{ border: "1px solid #f0f0f0", boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}
          >
            <h2
              className="text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color: "#6366f1", fontFamily: "'Inter', sans-serif" }}
            >
              What Happens Next
            </h2>

            <div className="flex flex-col gap-4">
              {NEXT_STEPS.map(({ icon: Icon, title, desc }, i) => (
                <div key={i} className="flex items-start gap-4">
                  {/* Step number + icon */}
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: "#f0f0ff" }}
                    >
                      <Icon size={16} style={{ color: "#6366f1" }} />
                    </div>
                    {/* Connector */}
                    {i < NEXT_STEPS.length - 1 && (
                      <div style={{ width: 1, height: 16, background: "#e5e7eb" }} />
                    )}
                  </div>
                  <div className="pb-1">
                    <p className="font-semibold text-gray-800 text-sm mb-0.5"
                       style={{ fontFamily: "'Inter', sans-serif" }}>{title}</p>
                    <p className="text-xs text-gray-400" style={{ lineHeight: 1.6 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA buttons ── */}
          <div className="success-fade-up success-d4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/orders"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-white text-sm font-bold uppercase tracking-widest transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{
                textDecoration: "none",
                background: "#0a0a0a",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.07em",
              }}
            >
              <FiPackage size={15} />
              Track My Order
              <FiArrowRight size={14} />
            </Link>

            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-gray-700 text-sm font-bold uppercase tracking-widest transition-all hover:bg-gray-100"
              style={{
                textDecoration: "none",
                background: "#fff",
                border: "1.5px solid #e5e7eb",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.07em",
              }}
            >
              <FiShoppingBag size={15} />
              Continue Shopping
            </Link>
          </div>

          {/* ── Footer note ── */}
          <p
            className="success-fade-up success-d4 mt-8 text-xs text-gray-400"
            style={{ fontFamily: "'Inter', sans-serif", lineHeight: 1.7 }}
          >
            Questions? Contact us at{" "}
            <a href="mailto:hello@luxestore.com"
               style={{ color: "#6366f1", textDecoration: "none", fontWeight: 600 }}>
              hello@luxestore.com
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
