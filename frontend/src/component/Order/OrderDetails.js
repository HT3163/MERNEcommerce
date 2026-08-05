import React, { Fragment, useEffect } from "react";
import "./orderDetails.css";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { Link, useParams } from "react-router-dom";
import { getOrderDetails, clearErrors } from "../../actions/orderAction";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import {
  FiPackage, FiMapPin, FiPhone, FiUser,
  FiCreditCard, FiCheckCircle, FiXCircle,
  FiChevronRight, FiTruck, FiShoppingBag,
  FiCalendar, FiHash,
} from "react-icons/fi";

/* ── helpers ─────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : null;

const STATUS_TIMELINE = ["Processing", "Shipped", "Delivered"];

const statusColor = (s = "") => {
  const m = s.toLowerCase();
  if (m.includes("deliver")) return { bg: "#dcfce7", color: "#15803d" };
  if (m.includes("ship"))    return { bg: "#dbeafe", color: "#1d4ed8" };
  if (m.includes("cancel"))  return { bg: "#fee2e2", color: "#dc2626" };
  return { bg: "#fef9c3", color: "#a16207" };
};

const timelineStep = (status = "") => {
  const m = status.toLowerCase();
  if (m.includes("deliver")) return 2;
  if (m.includes("ship"))    return 1;
  return 0;
};

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */
const OrderDetails = () => {
  const { order, error, loading } = useSelector((s) => s.orderDetails);
  const params   = useParams();
  const dispatch = useDispatch();
  const alert    = useAlert();

  useEffect(() => {
    if (error) { alert.error(error); dispatch(clearErrors()); }
    dispatch(getOrderDetails(params.id));
  }, [dispatch, alert, error, params.id]);

  if (loading) return <Loader />;

  const paid    = order.paymentInfo?.status === "succeeded";
  const sc      = statusColor(order.orderStatus);
  const tlStep  = timelineStep(order.orderStatus);
  const address = order.shippingInfo
    ? [order.shippingInfo.address, order.shippingInfo.city,
       order.shippingInfo.state, order.shippingInfo.pinCode,
       order.shippingInfo.country].filter(Boolean).join(", ")
    : "—";

  return (
    <Fragment>
      <MetaData title={`Order Details — LUXE`} />

      <div className="min-h-screen py-10 px-4 sm:px-6"
           style={{ background: "#fafafa", fontFamily: "'Inter', sans-serif" }}>
        <div className="max-w-5xl mx-auto">

          {/* ── Breadcrumb + heading ── */}
          <div className="mb-8 od-fade-up">
            <nav className="flex items-center text-xs text-gray-400 mb-3" style={{ gap: "0.2rem" }}>
              <Link to="/" style={{ textDecoration: "none", color: "inherit" }}
                    className="hover:text-gray-700 transition-colors">Home</Link>
              <FiChevronRight size={12} />
              <Link to="/orders" style={{ textDecoration: "none", color: "inherit" }}
                    className="hover:text-gray-700 transition-colors">My Orders</Link>
              <FiChevronRight size={12} />
              <span className="text-gray-600">Details</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <h1 style={{ fontFamily: "'Playfair Display', serif",
                           fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 700, color: "#0a0a0a" }}>
                Order Details
              </h1>
              {/* Status badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                    style={{ background: sc.bg, color: sc.color, fontFamily: "'Inter', sans-serif" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%",
                               background: sc.color, display: "inline-block" }} />
                {order.orderStatus || "Processing"}
              </span>
            </div>

            {/* Order meta */}
            <div className="flex flex-wrap items-center gap-4 mt-2"
                 style={{ fontSize: "0.78rem", color: "#9ca3af", fontFamily: "'Inter', sans-serif" }}>
              <span className="flex items-center gap-1">
                <FiHash size={11} />
                {order._id?.slice(-12).toUpperCase()}
              </span>
              {order.createdAt && (
                <span className="flex items-center gap-1">
                  <FiCalendar size={11} />
                  {fmtDate(order.createdAt)}
                </span>
              )}
            </div>
          </div>

          {/* ── Status timeline ── */}
          <div className="bg-white rounded-2xl p-6 mb-5 od-fade-up od-d1"
               style={{ border: "1px solid #f0f0f0" }}>
            <div className="flex items-center justify-between relative">
              {/* connector bar */}
              <div className="absolute left-0 right-0 top-4 h-0.5 mx-10"
                   style={{ background: "#e5e7eb", zIndex: 0 }} />
              <div className="absolute left-0 top-4 h-0.5 mx-10"
                   style={{ background: "#6366f1", zIndex: 0,
                            width: `${(tlStep / (STATUS_TIMELINE.length - 1)) * 100}%`,
                            transition: "width 0.6s ease" }} />

              {STATUS_TIMELINE.map((step, i) => {
                const done    = tlStep > i;
                const current = tlStep === i;
                const icons   = [FiShoppingBag, FiTruck, FiPackage];
                const Icon    = icons[i];
                return (
                  <div key={step} className="flex flex-col items-center gap-2 flex-1" style={{ zIndex: 1 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: done ? "#10b981" : current ? "#6366f1" : "#f3f4f6",
                      border: current ? "2px solid #6366f1" : "2px solid transparent",
                      boxShadow: current ? "0 0 0 4px rgba(99,102,241,0.12)" : "none",
                      transition: "all 0.3s",
                    }}>
                      {done
                        ? <FiCheckCircle size={16} color="#fff" />
                        : <Icon size={15} color={current ? "#fff" : "#9ca3af"} />}
                    </div>
                    <span style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.68rem", fontWeight: 700,
                      letterSpacing: "0.07em", textTransform: "uppercase",
                      color: done ? "#10b981" : current ? "#6366f1" : "#9ca3af",
                    }}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Two-column grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* LEFT: shipping + payment */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Shipping card */}
              <div className="bg-white rounded-2xl p-6 od-fade-up od-d2"
                   style={{ border: "1px solid #f0f0f0" }}>
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4"
                    style={{ fontFamily: "'Inter', sans-serif" }}>
                  Shipping Information
                </h2>
                <div className="od-info-row">
                  <span className="od-info-label flex items-center gap-1.5">
                    <FiUser size={13} style={{ color: "#6366f1" }} /> Name
                  </span>
                  <span className="od-info-value">{order.user?.name || "—"}</span>
                </div>
                <div className="od-info-row">
                  <span className="od-info-label flex items-center gap-1.5">
                    <FiPhone size={13} style={{ color: "#6366f1" }} /> Phone
                  </span>
                  <span className="od-info-value">{order.shippingInfo?.phoneNo || "—"}</span>
                </div>
                <div className="od-info-row">
                  <span className="od-info-label flex items-center gap-1.5">
                    <FiMapPin size={13} style={{ color: "#6366f1" }} /> Address
                  </span>
                  <span className="od-info-value">{address}</span>
                </div>
              </div>

              {/* Payment card */}
              <div className="bg-white rounded-2xl p-6 od-fade-up od-d2"
                   style={{ border: "1px solid #f0f0f0" }}>
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4"
                    style={{ fontFamily: "'Inter', sans-serif" }}>
                  Payment Information
                </h2>
                <div className="od-info-row">
                  <span className="od-info-label flex items-center gap-1.5">
                    <FiCreditCard size={13} style={{ color: "#6366f1" }} /> Status
                  </span>
                  <span className={`od-info-value font-bold flex items-center gap-1.5 ${paid ? "text-green-600" : "text-red-500"}`}>
                    {paid
                      ? <><FiCheckCircle size={13} /> Paid</>
                      : <><FiXCircle    size={13} /> Not Paid</>}
                  </span>
                </div>
                <div className="od-info-row">
                  <span className="od-info-label flex items-center gap-1.5">
                    <FiHash size={13} style={{ color: "#6366f1" }} /> Payment ID
                  </span>
                  <span className="od-info-value font-mono text-xs">
                    {order.paymentInfo?.id || "—"}
                  </span>
                </div>
              </div>

              {/* Order items card */}
              <div className="bg-white rounded-2xl p-6 od-fade-up od-d3"
                   style={{ border: "1px solid #f0f0f0" }}>
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4"
                    style={{ fontFamily: "'Inter', sans-serif" }}>
                  Order Items ({order.orderItems?.length || 0})
                </h2>
                <div style={{ maxHeight: 360, overflowY: "auto" }}>
                  {order.orderItems?.map((item) => (
                    <div key={item.product} className="od-item-row">
                      <img src={item.image} alt={item.name} className="od-item-img" />
                      <Link to={`/product/${item.product}`} className="od-item-name">
                        {item.name}
                      </Link>
                      <div className="od-item-calc">
                        <span style={{ color: "#6366f1", fontWeight: 600 }}>
                          {fmt(item.price)}
                        </span>
                        <span className="text-gray-400 text-xs">× {item.quantity}</span>
                        <b>{fmt(item.price * item.quantity)}</b>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: price summary */}
            <div>
              <div className="bg-white rounded-2xl p-6"
                   style={{ border: "1px solid #f0f0f0", position: "sticky", top: 88 }}>
                <h2 className="font-bold text-gray-900 mb-5" style={{ fontSize: "1rem" }}>
                  Price Summary
                </h2>

                <div className="flex flex-col gap-0">
                  {[
                    { label: "Items Price",  val: order.itemsPrice    },
                    { label: "Shipping",     val: order.shippingPrice },
                    { label: "Tax",          val: order.taxPrice      },
                  ].map(({ label, val }) => (
                    <div key={label}
                         className="flex justify-between items-center py-2.5"
                         style={{ borderBottom: "1px solid #f9fafb",
                                  fontFamily: "'Inter', sans-serif",
                                  fontSize: "0.875rem", color: "#6b7280" }}>
                      <span>{label}</span>
                      <span className="font-semibold text-gray-800">
                        {val !== undefined ? fmt(val) : "—"}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 mt-1"
                     style={{ borderTop: "2px solid #f3f4f6",
                              fontFamily: "'Inter', sans-serif" }}>
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-black text-gray-900"
                        style={{ fontSize: "1.3rem", letterSpacing: "-0.02em" }}>
                    {order.totalPrice !== undefined ? fmt(order.totalPrice) : "—"}
                  </span>
                </div>

                <Link to="/orders"
                      className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all hover:opacity-90"
                      style={{ background: "#f3f4f6", color: "#374151",
                               textDecoration: "none", fontFamily: "'Inter', sans-serif",
                               letterSpacing: "0.07em", border: "1px solid #e5e7eb" }}>
                  ← Back to Orders
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default OrderDetails;
