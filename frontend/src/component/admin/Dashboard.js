import React, { useEffect } from "react";
import "./dashboard.css";
import Sidebar from "./Sidebar.js";
import MetaData from "../layout/MetaData";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAdminProduct } from "../../actions/productAction";
import { getAllOrders } from "../../actions/orderAction.js";
import { getAllUsers } from "../../actions/userAction.js";

import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

import {
  FiDollarSign, FiPackage, FiShoppingBag, FiUsers,
  FiAlertTriangle, FiArrowRight, FiCalendar,
  FiPlusSquare, FiEdit, FiStar, FiTrendingUp,
} from "react-icons/fi";

Chart.register(CategoryScale);

/* ── helpers ───────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);

const today = new Date().toLocaleDateString("en-IN", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const statusMeta = (s = "") => {
  const m = s.toLowerCase();
  if (m.includes("deliver")) return { color: "#16a34a", bg: "#f0fdf4" };
  if (m.includes("ship"))    return { color: "#2563eb", bg: "#eff6ff" };
  if (m.includes("cancel"))  return { color: "#dc2626", bg: "#fef2f2" };
  return                            { color: "#d97706", bg: "#fffbeb" };
};

/* ══════════════════════════════════════════════════════
   DASHBOARD COMPONENT
══════════════════════════════════════════════════════ */
const Dashboard = () => {
  const dispatch = useDispatch();

  const { products = [] } = useSelector((s) => s.products);
  const { orders   = [] } = useSelector((s) => s.allOrders);
  const { users    = [] } = useSelector((s) => s.allUsers);

  useEffect(() => {
    dispatch(getAdminProduct());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  /* ── derived data ─────────────────────────────────── */
  const totalAmount  = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const outOfStock   = products.filter((p) => p.Stock === 0).length;
  const inStock      = products.length - outOfStock;
  const recentOrders = [...orders].slice(0, 5);

  /* ── Line chart data ──────────────────────────────── */
  const lineData = {
    labels: ["Starting", "Revenue"],
    datasets: [
      {
        label: "Total Revenue",
        data: [0, totalAmount],
        fill: true,
        backgroundColor: "rgba(99,102,241,0.08)",
        borderColor: "#6366f1",
        borderWidth: 2.5,
        pointBackgroundColor: "#6366f1",
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${fmt(ctx.raw)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 }, color: "#9ca3af" },
      },
      y: {
        grid: { color: "#f3f4f6" },
        ticks: {
          font: { size: 11 },
          color: "#9ca3af",
          callback: (v) => fmt(v),
        },
        beginAtZero: true,
      },
    },
  };

  /* ── Doughnut chart data ──────────────────────────── */
  const doughnutData = {
    labels: ["Out of Stock", "In Stock"],
    datasets: [
      {
        data: [outOfStock, inStock],
        backgroundColor: ["#ef4444", "#6366f1"],
        hoverBackgroundColor: ["#dc2626", "#4f46e5"],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    cutout: "72%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 12 },
          color: "#6b7280",
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.raw}`,
        },
      },
    },
  };

  /* ── stat cards config ────────────────────────────── */
  const stats = [
    {
      label: "Total Revenue",
      value: fmt(totalAmount),
      sub: `${orders.length} total orders`,
      icon: <FiDollarSign size={18} />,
      iconBg: "#eef2ff",
      iconColor: "#6366f1",
      trend: { label: "All time", cls: "up" },
    },
    {
      label: "Products",
      value: products.length,
      sub: `${inStock} in stock`,
      icon: <FiPackage size={18} />,
      iconBg: "#f0fdf4",
      iconColor: "#16a34a",
      trend: { label: outOfStock > 0 ? `${outOfStock} out of stock` : "All stocked", cls: outOfStock > 0 ? "warn" : "up" },
    },
    {
      label: "Orders",
      value: orders.length,
      sub: "Across all statuses",
      icon: <FiShoppingBag size={18} />,
      iconBg: "#fffbeb",
      iconColor: "#d97706",
      trend: { label: "View all", cls: "up" },
    },
    {
      label: "Users",
      value: users.length,
      sub: "Registered accounts",
      icon: <FiUsers size={18} />,
      iconBg: "#fdf4ff",
      iconColor: "#a855f7",
      trend: { label: "Growing", cls: "up" },
    },
  ];

  /* ── quick links ──────────────────────────────────── */
  const quickLinks = [
    { label: "Add Product",     sub: "Create a new listing",      icon: <FiPlusSquare size={16} />, bg: "#eef2ff", color: "#6366f1", to: "/admin/product" },
    { label: "Manage Products", sub: "Edit or remove products",   icon: <FiPackage   size={16} />, bg: "#f0fdf4", color: "#16a34a", to: "/admin/products" },
    { label: "All Orders",      sub: "Process pending orders",    icon: <FiShoppingBag size={16}/>, bg: "#fffbeb", color: "#d97706", to: "/admin/orders" },
    { label: "All Users",       sub: "Manage user accounts",      icon: <FiUsers     size={16} />, bg: "#fdf4ff", color: "#a855f7", to: "/admin/users" },
    { label: "Edit Products",   sub: "Update product details",    icon: <FiEdit      size={16} />, bg: "#fff1f2", color: "#e11d48", to: "/admin/products" },
    { label: "Reviews",         sub: "Moderate customer reviews", icon: <FiStar      size={16} />, bg: "#f0f9ff", color: "#0284c7", to: "/admin/reviews" },
  ];

  /* ════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════ */
  return (
    <div className="admin-dashboard">
      <MetaData title="Dashboard — Admin" />
      <Sidebar />

      <div className="dash-main">

        {/* ── Top bar ── */}
        <div className="dash-topbar">
          <div className="dash-topbar-left">
            <h1>Admin Dashboard</h1>
            <p>Welcome back! Here's what's happening today.</p>
          </div>
          <div className="dash-topbar-right">
            <span className="dash-date-badge">
              <FiCalendar size={13} />
              {today}
            </span>
          </div>
        </div>

        <div className="dash-body">

          {/* ── Stat cards ── */}
          <div className="dash-stats">
            {stats.map((s, i) => (
              <div className="dash-stat-card" key={i}>
                <div
                  className="dash-stat-icon"
                  style={{ background: s.iconBg, color: s.iconColor }}
                >
                  {s.icon}
                </div>
                <div className="dash-stat-info">
                  <p className="dash-stat-label">{s.label}</p>
                  <p className="dash-stat-value">{s.value}</p>
                  <p className="dash-stat-sub">{s.sub}</p>
                  <span className={`dash-stat-trend ${s.trend.cls}`}>
                    <FiTrendingUp size={10} />
                    {s.trend.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Charts row ── */}
          <div className="dash-charts">

            {/* Line chart */}
            <div className="dash-chart-card">
              <div className="dash-chart-header">
                <div>
                  <p className="dash-chart-title">Revenue Overview</p>
                  <p className="dash-chart-subtitle">Total Earnings</p>
                </div>
                <span className="dash-chart-badge">{fmt(totalAmount)}</span>
              </div>
              <Line data={lineData} options={lineOptions} />
            </div>

            {/* Doughnut chart */}
            <div className="dash-chart-card">
              <div className="dash-chart-header">
                <div>
                  <p className="dash-chart-title">Inventory</p>
                  <p className="dash-chart-subtitle">Stock Status</p>
                </div>
                {outOfStock > 0 && (
                  <span className="dash-chart-badge" style={{ background: "#ef4444" }}>
                    <FiAlertTriangle size={11} style={{ marginRight: 4 }} />
                    {outOfStock} out of stock
                  </span>
                )}
              </div>
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>

          </div>

          {/* ── Quick links ── */}
          <div>
            <p className="dash-section-label">Quick Actions</p>
            <div className="dash-quick-links">
              {quickLinks.map((q, i) => (
                <Link to={q.to} className="dash-quick-card" key={i}>
                  <div
                    className="dash-quick-icon"
                    style={{ background: q.bg, color: q.color }}
                  >
                    {q.icon}
                  </div>
                  <div>
                    <p className="dash-quick-label">{q.label}</p>
                    <p className="dash-quick-sub">{q.sub}</p>
                  </div>
                  <FiArrowRight size={15} className="dash-quick-arrow" />
                </Link>
              ))}
            </div>
          </div>

          {/* ── Recent orders ── */}
          {recentOrders.length > 0 && (
            <div>
              <p className="dash-section-label">Recent Orders</p>
              <div className="dash-recent-card">
                <div className="dash-recent-header">
                  <h3 className="dash-recent-title">Latest Transactions</h3>
                  <Link to="/admin/orders" className="dash-view-all">
                    View all <FiArrowRight size={13} />
                  </Link>
                </div>
                <table className="dash-orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Status</th>
                      <th>Items</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => {
                      const meta = statusMeta(order.orderStatus);
                      return (
                        <tr key={order._id}>
                          <td>
                            <span className="dash-order-id">
                              #{order._id.slice(-8).toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <span
                              className="dash-status-badge"
                              style={{ background: meta.bg, color: meta.color }}
                            >
                              <span
                                className="dash-status-dot"
                                style={{ background: meta.color }}
                              />
                              {order.orderStatus}
                            </span>
                          </td>
                          <td>{order.orderItems?.length || 0}</td>
                          <td style={{ fontWeight: 600 }}>{fmt(order.totalPrice)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
