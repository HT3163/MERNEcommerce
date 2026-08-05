import React, { Fragment, useEffect, useRef } from "react";
import "./payment.css";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { useAlert } from "react-alert";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { createOrder, clearErrors } from "../../actions/orderAction";
import { useNavigate } from "react-router-dom";
import {
  FiCreditCard, FiCalendar, FiLock,
  FiShield, FiArrowRight,
} from "react-icons/fi";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

/* Stripe element shared options */
const STRIPE_OPTS = {
  style: {
    base: {
      fontFamily: "'Inter', sans-serif",
      fontSize: "15px",
      color: "#111",
      "::placeholder": { color: "#9ca3af" },
    },
    invalid: { color: "#ef4444" },
  },
};

const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const alert     = useAlert();
  const stripe    = useStripe();
  const elements  = useElements();
  const payBtn    = useRef(null);

  const { shippingInfo, cartItems } = useSelector((s) => s.cart);
  const { user }                    = useSelector((s) => s.user);
  const { error }                   = useSelector((s) => s.newOrder);

  const paymentData = { amount: Math.round((orderInfo?.totalPrice || 0) * 100) };

  const order = {
    shippingInfo,
    orderItems:    cartItems,
    itemsPrice:    orderInfo?.subtotal,
    taxPrice:      orderInfo?.tax,
    shippingPrice: orderInfo?.shippingCharges,
    totalPrice:    orderInfo?.totalPrice,
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    payBtn.current.disabled = true;

    try {
      const { data } = await axios.post("/api/v1/payment/process", paymentData, {
        headers: { "Content-Type": "application/json" },
      });

      const result = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name:    user.name,
            email:   user.email,
            address: {
              line1:       shippingInfo.address,
              city:        shippingInfo.city,
              state:       shippingInfo.state,
              postal_code: shippingInfo.pinCode,
              country:     shippingInfo.country,
            },
          },
        },
      });

      if (result.error) {
        payBtn.current.disabled = false;
        alert.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        order.paymentInfo = {
          id:     result.paymentIntent.id,
          status: result.paymentIntent.status,
        };
        dispatch(createOrder(order));
        navigate("/success");
      } else {
        alert.error("There was an issue processing your payment.");
        payBtn.current.disabled = false;
      }
    } catch (err) {
      payBtn.current.disabled = false;
      alert.error(err.response?.data?.message || "Payment failed.");
    }
  };

  useEffect(() => {
    if (error) { alert.error(error); dispatch(clearErrors()); }
  }, [dispatch, error, alert]);

  return (
    <Fragment>
      <MetaData title="Payment — LUXE" />
      <CheckoutSteps activeStep={2} />

      <div
        className="min-h-screen py-10 px-4 sm:px-6"
        style={{ background: "#fafafa", fontFamily: "'Inter', sans-serif" }}
      >
        <div className="max-w-4xl mx-auto">

          {/* Page heading */}
          <div className="mb-8 pay-fade-up">
            <p className="text-xs font-bold uppercase tracking-widest mb-1"
               style={{ color: "#6366f1" }}>Step 3 of 3</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif",
                         fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 700, color: "#0a0a0a" }}>
              Payment
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── LEFT: card form ── */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-8 pay-fade-up pay-d1"
                   style={{ border: "1px solid #f0f0f0", boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>

                {/* Card header */}
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center"
                       style={{ background: "#f0f0ff" }}>
                    <FiCreditCard size={18} style={{ color: "#6366f1" }} />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900" style={{ fontSize: "1rem" }}>
                      Card Details
                    </h2>
                    <p className="text-xs text-gray-400">
                      All transactions are secure and encrypted.
                    </p>
                  </div>
                </div>

                <form onSubmit={submitHandler} className="flex flex-col gap-5">

                  {/* Card number */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5"
                           style={{ letterSpacing: "0.04em" }}>
                      Card Number
                    </label>
                    <div className="pay-stripe-field">
                      <span className="pay-stripe-icon"><FiCreditCard size={15} /></span>
                      <CardNumberElement className="paymentInput" options={STRIPE_OPTS} />
                    </div>
                  </div>

                  {/* Expiry + CVC side by side */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5"
                             style={{ letterSpacing: "0.04em" }}>
                        Expiry Date
                      </label>
                      <div className="pay-stripe-field">
                        <span className="pay-stripe-icon"><FiCalendar size={15} /></span>
                        <CardExpiryElement className="paymentInput" options={STRIPE_OPTS} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5"
                             style={{ letterSpacing: "0.04em" }}>
                        CVC / CVV
                      </label>
                      <div className="pay-stripe-field">
                        <span className="pay-stripe-icon"><FiLock size={15} /></span>
                        <CardCvcElement className="paymentInput" options={STRIPE_OPTS} />
                      </div>
                    </div>
                  </div>

                  {/* Billing name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5"
                           style={{ letterSpacing: "0.04em" }}>
                      Name on Card
                    </label>
                    <div className="pay-stripe-field">
                      <span className="pay-stripe-icon"><FiCreditCard size={15} /></span>
                      <input
                        type="text"
                        readOnly
                        value={user?.name || ""}
                        className="paymentInput"
                        style={{ paddingLeft: "2.75rem", cursor: "default" }}
                      />
                    </div>
                  </div>

                  {/* Pay button */}
                  <button ref={payBtn} type="submit" className="pay-btn">
                    <FiLock size={15} />
                    Pay {orderInfo && fmt(orderInfo.totalPrice)}
                    <FiArrowRight size={15} />
                  </button>
                </form>

                {/* Security note */}
                <div className="flex items-center justify-center gap-2 mt-5"
                     style={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                  <FiShield size={12} style={{ color: "#6366f1" }} />
                  Your payment is protected by 256-bit SSL encryption
                </div>
              </div>
            </div>

            {/* ── RIGHT: order summary ── */}
            <div>
              <div className="bg-white rounded-2xl p-6 pay-fade-up pay-d2"
                   style={{ border: "1px solid #f0f0f0", position: "sticky", top: 88 }}>

                <h2 className="font-bold text-gray-900 mb-5" style={{ fontSize: "1rem" }}>
                  Order Summary
                </h2>

                {/* Items preview */}
                {cartItems.slice(0, 3).map((item) => (
                  <div key={item.product}
                       className="flex items-center gap-3 mb-3 pb-3"
                       style={{ borderBottom: "1px solid #f9fafb" }}>
                    <img src={item.image} alt={item.name}
                         style={{ width: 44, height: 44, borderRadius: 8,
                                  objectFit: "cover", background: "#f3f4f6", flexShrink: 0 }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate leading-snug">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-gray-800 flex-shrink-0">
                      {fmt(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
                {cartItems.length > 3 && (
                  <p className="text-xs text-gray-400 mb-4 text-center">
                    +{cartItems.length - 3} more item{cartItems.length - 3 !== 1 ? "s" : ""}
                  </p>
                )}

                {/* Totals */}
                {orderInfo && (
                  <>
                    <div className="pay-sum-row">
                      <span>Subtotal</span>
                      <span className="font-semibold text-gray-800">{fmt(orderInfo.subtotal)}</span>
                    </div>
                    <div className="pay-sum-row">
                      <span>Shipping</span>
                      <span className={`font-semibold ${orderInfo.shippingCharges === 0 ? "text-green-600" : "text-gray-800"}`}>
                        {orderInfo.shippingCharges === 0 ? "Free" : fmt(orderInfo.shippingCharges)}
                      </span>
                    </div>
                    <div className="pay-sum-row">
                      <span>Tax</span>
                      <span className="font-semibold text-gray-800">{fmt(orderInfo.tax)}</span>
                    </div>
                    <div className="pay-sum-total">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="font-black text-gray-900"
                            style={{ fontSize: "1.3rem", letterSpacing: "-0.02em" }}>
                        {fmt(orderInfo.totalPrice)}
                      </span>
                    </div>
                  </>
                )}

                {/* Payment badges */}
                <div className="flex items-center justify-center gap-2 mt-5">
                  {["VISA", "MC", "AMEX", "PayPal", "Stripe"].map((m) => (
                    <span key={m}
                          style={{ background: "#f9fafb", border: "1px solid #e5e7eb",
                                   color: "#9ca3af", fontSize: "0.6rem", fontWeight: 700,
                                   padding: "2px 6px", borderRadius: 4 }}>
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

export default Payment;
