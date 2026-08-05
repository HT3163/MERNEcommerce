import React, { Fragment, useState } from "react";
import "./Cart.css";
import { useSelector, useDispatch } from "react-redux";
import { addItemsToCart, removeItemsFromCart } from "../../actions/cartAction";
import { Link, useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";
import {
  FiShoppingBag, FiTrash2, FiArrowRight, FiTag,
  FiTruck, FiShield, FiRotateCcw, FiCheck,
  FiMinus, FiPlus, FiChevronRight,
} from "react-icons/fi";

/* ── constants ──────────────────────────────────────── */
const FREE_SHIPPING_THRESHOLD = 50;

const VALID_COUPONS = {
  LUXE10:  { type: "percent", value: 10,  label: "10% off"  },
  SAVE20:  { type: "percent", value: 20,  label: "20% off"  },
  FLAT15:  { type: "flat",    value: 15,  label: "$15 off"  },
};

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

/* ═══════════════════════════════════════════════════════
   CART
   ═══════════════════════════════════════════════════════ */
const Cart = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { cartItems } = useSelector((s) => s.cart);

  const [couponCode,    setCouponCode]    = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError,   setCouponError]   = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  /* ── handlers ── */
  const increase = (id, qty, stock) => {
    if (qty >= stock) return;
    dispatch(addItemsToCart(id, qty + 1));
  };
  const decrease = (id, qty) => {
    if (qty <= 1) return;
    dispatch(addItemsToCart(id, qty - 1));
  };
  const remove = (id) => dispatch(removeItemsFromCart(id));

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    if (VALID_COUPONS[code]) {
      setAppliedCoupon({ ...VALID_COUPONS[code], code });
      setCouponSuccess(`✓ Coupon "${code}" applied — ${VALID_COUPONS[code].label}`);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code. Try LUXE10, SAVE20, or FLAT15.");
      setCouponSuccess("");
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponSuccess("");
    setCouponError("");
  };

  /* ── totals ── */
  const subtotal = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shipping  = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 9.99;
  const discount  = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? subtotal * (appliedCoupon.value / 100)
      : Math.min(appliedCoupon.value, subtotal)
    : 0;
  const tax       = (subtotal - discount) * 0.08;
  const total     = subtotal - discount + shipping + tax;
  const freeShipRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shipProgress      = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  /* ── empty cart ── */
  if (cartItems.length === 0) {
    return (
      <Fragment>
        <MetaData title="Your Cart — LUXE" />
        <div className="cart-empty">
          {/* Icon */}
          <div className="mb-6 flex items-center justify-center"
               style={{ width: 96, height: 96, borderRadius: "50%",
                        background: "#f3f4f6", margin: "0 auto 1.5rem" }}>
            <FiShoppingBag size={40} style={{ color: "#d1d5db" }} />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}>
            Your cart is empty
          </h2>
          <p className="text-gray-400 mb-8 max-w-xs"
             style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", lineHeight: 1.7 }}>
            Looks like you haven't added anything yet. Discover our premium collection.
          </p>

          <Link to="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white text-sm font-bold uppercase tracking-widest transition-all hover:opacity-90"
                style={{ textDecoration: "none", background: "#0a0a0a",
                         fontFamily: "'Inter', sans-serif", letterSpacing: "0.07em" }}>
            <FiShoppingBag size={15} />
            Shop Now
          </Link>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            {[
              { icon: FiTruck,     label: "Free Shipping over $50" },
              { icon: FiRotateCcw, label: "30-day Returns"         },
              { icon: FiShield,    label: "Secure Checkout"        },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2"
                   style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: "#9ca3af" }}>
                <Icon size={14} style={{ color: "#6366f1" }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </Fragment>
    );
  }

  /* ── filled cart ── */
  return (
    <Fragment>
      <MetaData title={`Cart (${cartItems.length}) — LUXE`} />

      <div className="min-h-screen" style={{ background: "#fafafa", fontFamily: "'Inter', sans-serif" }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">

          {/* ── Page header ── */}
          <div className="mb-8 cart-fade-up">
            <nav className="flex items-center text-xs text-gray-400 mb-3" style={{ gap: "0.2rem" }}>
              <Link to="/"        style={{ textDecoration: "none", color: "inherit" }} className="hover:text-gray-700 transition-colors">Home</Link>
              <FiChevronRight size={12} />
              <span className="text-gray-600">Cart</span>
            </nav>
            <div className="flex items-baseline gap-3">
              <h1 style={{ fontFamily: "'Playfair Display', serif",
                           fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 700, color: "#0a0a0a" }}>
                Shopping Cart
              </h1>
              <span className="text-sm font-semibold text-gray-400">
                ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
              </span>
            </div>
          </div>

          {/* ── Two-column grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── LEFT: items + coupon ── */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* Items card */}
              <div className="bg-white rounded-2xl p-6 cart-fade-up cart-d1"
                   style={{ border: "1px solid #f0f0f0" }}>

                {/* Column headers */}
                <div className="hidden sm:grid pb-3 mb-1"
                     style={{ gridTemplateColumns: "1fr auto auto",
                              borderBottom: "1px solid #f3f4f6",
                              fontFamily: "'Inter', sans-serif",
                              fontSize: "0.7rem", fontWeight: 700,
                              letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af" }}>
                  <span>Product</span>
                  <span className="text-center px-6">Quantity</span>
                  <span className="text-right">Total</span>
                </div>

                {/* Items */}
                {cartItems.map((item, idx) => (
                  <div
                    key={item.product}
                    className="cart-item"
                    style={{ animationDelay: `${idx * 0.05}s`, animation: "cartFadeUp 0.45s ease both" }}
                  >
                    {/* Image */}
                    <Link to={`/product/${item.product}`} style={{ textDecoration: "none", flexShrink: 0 }}>
                      <img src={item.image} alt={item.name} className="cart-item-img" />
                    </Link>

                    {/* Info */}
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <Link to={`/product/${item.product}`}
                            className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2 leading-snug"
                            style={{ textDecoration: "none", fontSize: "0.92rem" }}>
                        {item.name}
                      </Link>
                      <span className="text-sm text-indigo-500 font-semibold">{fmt(item.price)}</span>

                      {/* Mobile qty + remove */}
                      <div className="flex items-center gap-3 mt-1 sm:hidden">
                        <div className="cart-qty-wrap">
                          <button className="cart-qty-btn" onClick={() => decrease(item.product, item.quantity)}
                                  disabled={item.quantity <= 1}>
                            <FiMinus size={12} />
                          </button>
                          <span className="cart-qty-val">{item.quantity}</span>
                          <button className="cart-qty-btn" onClick={() => increase(item.product, item.quantity, item.stock)}
                                  disabled={item.quantity >= item.stock}>
                            <FiPlus size={12} />
                          </button>
                        </div>
                        <button className="cart-remove-btn" onClick={() => remove(item.product)} aria-label="Remove">
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Desktop: qty + subtotal + remove */}
                    <div className="hidden sm:flex items-center gap-6">
                      <div className="cart-qty-wrap">
                        <button className="cart-qty-btn" onClick={() => decrease(item.product, item.quantity)}
                                disabled={item.quantity <= 1}>
                          <FiMinus size={12} />
                        </button>
                        <span className="cart-qty-val">{item.quantity}</span>
                        <button className="cart-qty-btn" onClick={() => increase(item.product, item.quantity, item.stock)}
                                disabled={item.quantity >= item.stock}>
                          <FiPlus size={12} />
                        </button>
                      </div>

                      <span className="font-bold text-gray-900 text-sm w-16 text-right">
                        {fmt(item.price * item.quantity)}
                      </span>

                      <button className="cart-remove-btn" onClick={() => remove(item.product)} aria-label="Remove">
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon card */}
              <div className="bg-white rounded-2xl p-6 cart-fade-up cart-d2"
                   style={{ border: "1px solid #f0f0f0" }}>
                <div className="flex items-center gap-2 mb-4">
                  <FiTag size={16} style={{ color: "#6366f1" }} />
                  <h3 className="font-semibold text-gray-800 text-sm" style={{ letterSpacing: "0.01em" }}>
                    Coupon Code
                  </h3>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-xl"
                       style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                    <div className="flex items-center gap-2">
                      <FiCheck size={14} style={{ color: "#16a34a" }} />
                      <span className="text-sm font-semibold text-green-700">{couponSuccess}</span>
                    </div>
                    <button onClick={removeCoupon}
                            className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors"
                            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        className="cart-coupon-input"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
                        onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                      />
                      <button className="cart-coupon-btn" onClick={applyCoupon}>Apply</button>
                    </div>
                    {couponError && (
                      <p className="mt-2 text-xs text-red-500" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {couponError}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Try: <span className="font-mono font-semibold text-gray-500">LUXE10</span>,{" "}
                      <span className="font-mono font-semibold text-gray-500">SAVE20</span>,{" "}
                      <span className="font-mono font-semibold text-gray-500">FLAT15</span>
                    </p>
                  </>
                )}
              </div>

              {/* Continue shopping */}
              <Link to="/products"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                    style={{ textDecoration: "none", fontFamily: "'Inter', sans-serif" }}>
                ← Continue Shopping
              </Link>
            </div>

            {/* ── RIGHT: order summary ── */}
            <div className="cart-summary-panel cart-fade-up cart-d3">

              <h2 className="font-bold text-gray-900 mb-5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem" }}>
                Order Summary
              </h2>

              {/* Free shipping progress */}
              {freeShipRemaining > 0 ? (
                <div className="mb-5 p-3.5 rounded-xl"
                     style={{ background: "#f8f9ff", border: "1px solid #e8eaff" }}>
                  <p className="text-xs font-semibold text-indigo-700 mb-2"
                     style={{ fontFamily: "'Inter', sans-serif" }}>
                    Add {fmt(freeShipRemaining)} more for{" "}
                    <span className="font-black">FREE shipping</span>
                  </p>
                  <div className="cart-progress-track">
                    <div className="cart-progress-fill" style={{ width: `${shipProgress}%` }} />
                  </div>
                </div>
              ) : (
                <div className="mb-5 p-3.5 rounded-xl flex items-center gap-2"
                     style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                  <FiTruck size={14} style={{ color: "#16a34a", flexShrink: 0 }} />
                  <p className="text-xs font-semibold text-green-700"
                     style={{ fontFamily: "'Inter', sans-serif" }}>
                    🎉 You've unlocked free shipping!
                  </p>
                </div>
              )}

              {/* Line items */}
              <div className="mb-4">
                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">{fmt(subtotal)}</span>
                </div>

                {appliedCoupon && (
                  <div className="cart-summary-row">
                    <span className="text-green-600 flex items-center gap-1">
                      <FiTag size={12} /> {appliedCoupon.code}
                    </span>
                    <span className="font-semibold text-green-600">−{fmt(discount)}</span>
                  </div>
                )}

                <div className="cart-summary-row">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? "text-green-600" : "text-gray-800"}`}>
                    {shipping === 0 ? "Free" : fmt(shipping)}
                  </span>
                </div>

                <div className="cart-summary-row">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-semibold text-gray-800">{fmt(tax)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="cart-summary-total">
                <span className="font-bold text-gray-900" style={{ fontSize: "1rem" }}>Total</span>
                <span className="font-black text-gray-900" style={{ fontSize: "1.35rem", letterSpacing: "-0.02em" }}>
                  {fmt(total)}
                </span>
              </div>

              {/* Checkout button */}
              <button className="cart-checkout-btn mt-5" onClick={() => navigate("/login?redirect=shipping")}>
                <FiShoppingBag size={16} />
                Proceed to Checkout
                <FiArrowRight size={16} />
              </button>

              {/* Trust strip */}
              <div className="cart-trust-strip">
                <FiShield size={12} style={{ color: "#6366f1" }} />
                <span>Secure & encrypted checkout</span>
              </div>

              {/* Accepted payment methods */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {["VISA", "MC", "AMEX", "PayPal"].map((m) => (
                  <span key={m}
                        className="px-2 py-0.5 rounded text-xs font-bold"
                        style={{ background: "#f9fafb", border: "1px solid #e5e7eb",
                                 color: "#9ca3af", fontSize: "0.62rem", letterSpacing: "0.05em" }}>
                    {m}
                  </span>
                ))}
              </div>

              {/* Policies */}
              <div className="mt-5 flex flex-col gap-2">
                {[
                  { icon: FiRotateCcw, text: "Free 30-day returns" },
                  { icon: FiTruck,     text: "Free shipping on orders over $50" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2"
                       style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#9ca3af" }}>
                    <Icon size={12} style={{ color: "#6366f1", flexShrink: 0 }} />
                    {text}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Cart;
