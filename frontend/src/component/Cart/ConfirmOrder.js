import React, { Fragment } from "react";
import "./ConfirmOrder.css";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMapPin, FiPhone, FiUser,
  FiShoppingBag, FiArrowRight, FiShield,
  FiEdit2,
} from "react-icons/fi";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const { shippingInfo, cartItems } = useSelector((s) => s.cart);
  const { user }                    = useSelector((s) => s.user);

  /* ── Totals ── */
  const subtotal        = cartItems.reduce((a, i) => a + i.quantity * i.price, 0);
  const shippingCharges = subtotal > 50 ? 0 : 9.99;
  const tax             = subtotal * 0.08;
  const totalPrice      = subtotal + shippingCharges + tax;

  const fullAddress = [
    shippingInfo.address,
    shippingInfo.city,
    shippingInfo.state,
    shippingInfo.pinCode,
    shippingInfo.country,
  ].filter(Boolean).join(", ");

  const proceedToPayment = () => {
    sessionStorage.setItem(
      "orderInfo",
      JSON.stringify({ subtotal, shippingCharges, tax, totalPrice })
    );
    navigate("/process/payment");
  };

  return (
    <Fragment>
      <MetaData title="Confirm Order — LUXE" />
      <CheckoutSteps activeStep={1} />

      <div
        className="min-h-screen py-10 px-4 sm:px-6"
        style={{ background: "#fafafa", fontFamily: "'Inter', sans-serif" }}
      >
        <div className="max-w-5xl mx-auto">

          {/* Page heading */}
          <div className="mb-8 co-fade-up">
            <p className="text-xs font-bold uppercase tracking-widest mb-1"
               style={{ color: "#6366f1" }}>Step 2 of 3</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif",
                         fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 700, color: "#0a0a0a" }}>
              Review Your Order
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── LEFT: shipping info + cart items ── */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Shipping info card */}
              <div className="bg-white rounded-2xl p-6 co-fade-up co-d1"
                   style={{ border: "1px solid #f0f0f0" }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900 text-sm uppercase tracking-widest"
                      style={{ letterSpacing: "0.1em" }}>
                    Shipping Address
                  </h2>
                  <Link to="/login/shipping"
                        className="flex items-center gap-1 text-xs font-semibold text-indigo-500 hover:text-indigo-700 transition-colors"
                        style={{ textDecoration: "none" }}>
                    <FiEdit2 size={12} /> Edit
                  </Link>
                </div>

                <div className="flex flex-col">
                  <div className="co-info-row">
                    <span className="co-info-label flex items-center gap-1.5">
                      <FiUser size={13} style={{ color: "#6366f1", flexShrink: 0 }} /> Name
                    </span>
                    <span className="co-info-value">{user.name}</span>
                  </div>
                  <div className="co-info-row">
                    <span className="co-info-label flex items-center gap-1.5">
                      <FiPhone size={13} style={{ color: "#6366f1", flexShrink: 0 }} /> Phone
                    </span>
                    <span className="co-info-value">{shippingInfo.phoneNo}</span>
                  </div>
                  <div className="co-info-row">
                    <span className="co-info-label flex items-center gap-1.5">
                      <FiMapPin size={13} style={{ color: "#6366f1", flexShrink: 0 }} /> Address
                    </span>
                    <span className="co-info-value">{fullAddress}</span>
                  </div>
                </div>
              </div>

              {/* Cart items card */}
              <div className="bg-white rounded-2xl p-6 co-fade-up co-d2"
                   style={{ border: "1px solid #f0f0f0" }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900 text-sm uppercase tracking-widest"
                      style={{ letterSpacing: "0.1em" }}>
                    Order Items
                    <span className="ml-2 text-gray-400 font-normal normal-case tracking-normal"
                          style={{ fontSize: "0.8rem" }}>
                      ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
                    </span>
                  </h2>
                  <Link to="/cart"
                        className="flex items-center gap-1 text-xs font-semibold text-indigo-500 hover:text-indigo-700 transition-colors"
                        style={{ textDecoration: "none" }}>
                    <FiEdit2 size={12} /> Edit
                  </Link>
                </div>

                <div style={{ maxHeight: 320, overflowY: "auto" }}>
                  {cartItems.map((item) => (
                    <div key={item.product} className="co-item-row">
                      <img src={item.image} alt={item.name} className="co-item-img" />
                      <Link to={`/product/${item.product}`} className="co-item-name">
                        {item.name}
                      </Link>
                      <div className="co-item-calc">
                        <span style={{ color: "#6366f1", fontWeight: 600 }}>{fmt(item.price)}</span>
                        <span className="text-gray-400 text-xs">× {item.quantity}</span>
                        <b>{fmt(item.price * item.quantity)}</b>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT: summary panel ── */}
            <div>
              <div className="bg-white rounded-2xl p-6"
                   style={{ border: "1px solid #f0f0f0", position: "sticky", top: 88 }}>

                <h2 className="font-bold text-gray-900 mb-5"
                    style={{ fontSize: "1rem" }}>
                  Order Summary
                </h2>

                <div className="mb-2">
                  <div className="co-sum-row">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-800">{fmt(subtotal)}</span>
                  </div>
                  <div className="co-sum-row">
                    <span>Shipping</span>
                    <span className={`font-semibold ${shippingCharges === 0 ? "text-green-600" : "text-gray-800"}`}>
                      {shippingCharges === 0 ? "Free" : fmt(shippingCharges)}
                    </span>
                  </div>
                  <div className="co-sum-row">
                    <span>Tax (8%)</span>
                    <span className="font-semibold text-gray-800">{fmt(tax)}</span>
                  </div>
                </div>

                <div className="co-sum-total">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-black text-gray-900"
                        style={{ fontSize: "1.35rem", letterSpacing: "-0.02em" }}>
                    {fmt(totalPrice)}
                  </span>
                </div>

                <button className="co-proceed-btn" onClick={proceedToPayment}>
                  <FiShoppingBag size={15} />
                  Proceed to Payment
                  <FiArrowRight size={15} />
                </button>

                <div className="flex items-center justify-center gap-1.5 mt-4"
                     style={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                  <FiShield size={12} style={{ color: "#6366f1" }} />
                  Secure & encrypted checkout
                </div>

                {/* Payment icons */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  {["VISA", "MC", "AMEX", "PayPal"].map((m) => (
                    <span key={m}
                          className="px-1.5 py-0.5 rounded text-xs font-bold"
                          style={{ background: "#f9fafb", border: "1px solid #e5e7eb",
                                   color: "#9ca3af", fontSize: "0.62rem" }}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
