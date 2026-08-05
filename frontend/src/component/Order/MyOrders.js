import React, { Fragment, useEffect } from "react";
import "./myOrders.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, myOrders } from "../../actions/orderAction";
import Loader from "../layout/Loader/Loader";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import {
  FiPackage, FiShoppingBag, FiArrowRight,
  FiChevronRight, FiCalendar, FiHash,
} from "react-icons/fi";

/* ── helpers ─────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

const statusClass = (s = "") => {
  const m = s.toLowerCase();
  if (m.includes("deliver"))  return "ord-badge ord-badge-delivered";
  if (m.includes("ship"))     return "ord-badge ord-badge-shipped";
  if (m.includes("cancel"))   return "ord-badge ord-badge-cancelled";
  return "ord-badge ord-badge-processing";
};

const statusDot = (s = "") => {
  const m = s.toLowerCase();
  if (m.includes("deliver")) return "#16a34a";
  if (m.includes("ship"))    return "#2563eb";
  if (m.includes("cancel"))  return "#dc2626";
  return "#d97706";
};

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */
const MyOrders = () => {
  const dispatch = useDispatch();
  const alert    = useAlert();

  const { loading, error, orders } = useSelector((s) => s.myOrders);
  const { user }                   = useSelector((s) => s.user);

  useEffect(() => {
    if (error) { alert.error(error); dispatch(clearErrors()); }
    dispatch(myOrders());
  }, [dispatch, alert, error]);

  if (loading) return <Loader />;

  return (
    <Fragment>
      <MetaData title={`My Orders — LUXE`} />

      <div className="min-h-screen py-10 px-4 sm:px-6"
           style={{ background: "#fafafa", fontFamily: "'Inter', sans-serif" }}>
        <div className="max-w-5xl mx-auto">

          {/* ── Page header ── */}
          <div className="mb-8 ord-fade-up">
            <nav className="flex items-center text-xs text-gray-400 mb-3" style={{ gap: "0.2rem" }}>
              <Link to="/" style={{ textDecoration: "none", color: "inherit" }}
                    className="hover:text-gray-700 transition-colors">Home</Link>
              <FiChevronRight size={12} />
              <span className="text-gray-600">My Orders</span>
            </nav>
            <div className="flex items-baseline gap-3">
              <h1 style={{ fontFamily: "'Playfair Display', serif",
                           fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 700, color: "#0a0a0a" }}>
                My Orders
              </h1>
              {orders && orders.length > 0 && (
                <span className="text-sm font-semibold text-gray-400">
                  ({orders.length} {orders.length === 1 ? "order" : "orders"})
                </span>
              )}
            </div>
            {user?.name && (
              <p className="text-sm text-gray-400 mt-1">
                Welcome back, <span className="font-semibold text-gray-600">{user.name}</span>
              </p>
            )}
          </div>

          {/* ── Empty state ── */}
          {(!orders || orders.length === 0) ? (
            <div className="ord-empty ord-fade-up ord-d1">
              <div className="mb-5 flex items-center justify-center"
                   style={{ width: 80, height: 80, borderRadius: "50%",
                            background: "#f3f4f6", margin: "0 auto 1.25rem" }}>
                <FiPackage size={32} style={{ color: "#d1d5db" }} />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                No orders yet
              </h2>
              <p className="text-gray-400 mb-7 max-w-xs"
                 style={{ fontSize: "0.9rem", lineHeight: 1.7 }}>
                You haven't placed any orders. Start shopping to see your orders here.
              </p>
              <Link to="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-bold uppercase tracking-widest"
                    style={{ textDecoration: "none", background: "#0a0a0a",
                             fontFamily: "'Inter', sans-serif", letterSpacing: "0.07em" }}>
                <FiShoppingBag size={14} /> Shop Now
              </Link>
            </div>
          ) : (
            /* ── Orders list ── */
            <div className="bg-white rounded-2xl overflow-hidden ord-fade-up ord-d1"
                 style={{ border: "1px solid #f0f0f0", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>

              {/* Desktop column headers */}
              <div className="hidden sm:grid px-5 py-3"
                   style={{ gridTemplateColumns: "1fr 120px 90px 100px 80px",
                            gap: "1rem", alignItems: "center",
                            borderBottom: "1px solid #f3f4f6",
                            background: "#fafafa",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.68rem", fontWeight: 700,
                            letterSpacing: "0.1em", textTransform: "uppercase",
                            color: "#9ca3af" }}>
                <span>Order</span>
                <span>Status</span>
                <span className="text-center">Items</span>
                <span className="text-right">Amount</span>
                <span />
              </div>

              {/* Order rows */}
              {orders.map((order, idx) => (
                <div
                  key={order._id}
                  style={{ animationDelay: `${idx * 0.04}s`,
                           animation: "ordFadeUp 0.45s ease both" }}
                >
                  {/* Desktop row */}
                  <div className="hidden sm:grid px-5 py-4"
                       style={{ gridTemplateColumns: "1fr 120px 90px 100px 80px",
                                gap: "1rem", alignItems: "center",
                                borderBottom: idx < orders.length - 1 ? "1px solid #f3f4f6" : "none",
                                transition: "background 0.15s" }}
                       onMouseEnter={(e) => e.currentTarget.style.background = "#fafafa"}
                       onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    {/* ID + date */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <FiHash size={11} style={{ color: "#9ca3af" }} />
                        <span className="font-mono text-xs font-semibold text-gray-700">
                          {order._id.slice(-10).toUpperCase()}
                        </span>
                      </div>
                      {order.createdAt && (
                        <div className="flex items-center gap-1"
                             style={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                          <FiCalendar size={10} />
                          {fmtDate(order.createdAt)}
                        </div>
                      )}
                    </div>

                    {/* Status */}
                    <span className={statusClass(order.orderStatus)}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%",
                                     background: statusDot(order.orderStatus),
                                     display: "inline-block", flexShrink: 0 }} />
                      {order.orderStatus || "Processing"}
                    </span>

                    {/* Items qty */}
                    <span className="text-center text-sm font-semibold text-gray-600"
                          style={{ fontFamily: "'Inter', sans-serif" }}>
                      {order.orderItems?.length || 0}
                    </span>

                    {/* Amount */}
                    <span className="text-right font-bold text-gray-900 text-sm"
                          style={{ fontFamily: "'Inter', sans-serif" }}>
                      {fmt(order.totalPrice)}
                    </span>

                    {/* View button */}
                    <div className="flex justify-end">
                      <Link to={`/order/${order._id}`} className="ord-view-btn">
                        Details <FiArrowRight size={11} />
                      </Link>
                    </div>
                  </div>

                  {/* Mobile row */}
                  <div className="sm:hidden p-4"
                       style={{ borderBottom: idx < orders.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <FiHash size={11} style={{ color: "#9ca3af" }} />
                          <span className="font-mono text-xs font-semibold text-gray-700">
                            {order._id.slice(-10).toUpperCase()}
                          </span>
                        </div>
                        {order.createdAt && (
                          <div className="flex items-center gap-1"
                               style={{ fontSize: "0.7rem", color: "#9ca3af" }}>
                            <FiCalendar size={10} />
                            {fmtDate(order.createdAt)}
                          </div>
                        )}
                      </div>
                      <span className={statusClass(order.orderStatus)}>
                        {order.orderStatus || "Processing"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div style={{ fontFamily: "'Inter', sans-serif" }}>
                        <span className="text-xs text-gray-400">
                          {order.orderItems?.length || 0} item{order.orderItems?.length !== 1 ? "s" : ""}
                          {" · "}
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {fmt(order.totalPrice)}
                        </span>
                      </div>
                      <Link to={`/order/${order._id}`} className="ord-view-btn">
                        Details <FiArrowRight size={11} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default MyOrders;
