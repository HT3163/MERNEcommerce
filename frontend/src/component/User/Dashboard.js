import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { logout } from "../../actions/userAction";
import { myOrders, clearErrors } from "../../actions/orderAction";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import "./Dashboard.css";

import {
  FiGrid, FiPackage, FiHeart, FiMapPin, FiUser,
  FiSettings, FiLogOut, FiMenu, FiX, FiChevronRight,
  FiShoppingBag, FiTrendingUp, FiClock, FiCheckCircle,
  FiTruck, FiAlertCircle, FiArrowRight, FiHash, FiCalendar,
  FiEdit2, FiLock, FiMail, FiPhone, FiCamera,
  FiPlus, FiTrash2, FiHome, FiStar,
} from "react-icons/fi";

// ── helpers ───────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) : "—";

const statusMeta = (s = "") => {
  const m = s.toLowerCase();
  if (m.includes("deliver"))  return { label: "Delivered",  color: "#16a34a", bg: "#f0fdf4", dot: "#16a34a" };
  if (m.includes("ship"))     return { label: "Shipped",    color: "#2563eb", bg: "#eff6ff", dot: "#2563eb" };
  if (m.includes("cancel"))   return { label: "Cancelled",  color: "#dc2626", bg: "#fef2f2", dot: "#dc2626" };
  return                             { label: "Processing", color: "#d97706", bg: "#fffbeb", dot: "#d97706" };
};

// ── Sidebar nav items ─────────────────────────────────
const NAV = [
  { id: "overview",  label: "Overview",   icon: FiGrid     },
  { id: "orders",    label: "My Orders",  icon: FiPackage  },
  { id: "wishlist",  label: "Wishlist",   icon: FiHeart    },
  { id: "addresses", label: "Addresses",  icon: FiMapPin   },
  { id: "profile",   label: "Profile",    icon: FiUser     },
  { id: "settings",  label: "Settings",   icon: FiSettings },
];

export { fmt, fmtDate, statusMeta };

// ══════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════
const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert    = useAlert();

  const { user, loading: userLoading, isAuthenticated } = useSelector((s) => s.user);
  const { orders = [], loading: ordersLoading, error } = useSelector((s) => s.myOrders);
  const { cartItems = [] } = useSelector((s) => s.cart) || {};

  const [activeTab,   setActiveTab]   = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // redirect if not logged in
  useEffect(() => {
    if (isAuthenticated === false) navigate("/login");
  }, [isAuthenticated, navigate]);

  // fetch orders once
  useEffect(() => {
    if (error) { alert.error(error); dispatch(clearErrors()); }
    dispatch(myOrders());
  }, [dispatch, alert, error]);

  // close sidebar on tab change (mobile)
  const switchTab = (id) => { setActiveTab(id); setSidebarOpen(false); };

  const handleLogout = () => { dispatch(logout()); alert.success("Logged out"); };

  if (userLoading) return <Loader />;

  // ── stats derived from orders ──────────────────────
  const delivered  = orders.filter((o) => o.orderStatus?.toLowerCase().includes("deliver")).length;
  const processing = orders.filter((o) => o.orderStatus?.toLowerCase().includes("process")).length;
  const totalSpent = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
  const recentOrders = [...orders].reverse().slice(0, 5);

  const STATS = [
    { label: "Total Orders",  value: orders.length, icon: FiPackage,  color: "#6366f1", bg: "#eef2ff" },
    { label: "Delivered",     value: delivered,      icon: FiCheckCircle, color: "#16a34a", bg: "#f0fdf4" },
    { label: "Processing",    value: processing,     icon: FiClock,    color: "#d97706", bg: "#fffbeb" },
    { label: "Total Spent",   value: fmt(totalSpent),icon: FiTrendingUp,color: "#0ea5e9", bg: "#f0f9ff", wide: true },
  ];

  return (
    <>
      <MetaData title={`My Account — ${user?.name || "Dashboard"}`} />

      {/* ── Mobile sidebar backdrop ── */}
      {sidebarOpen && (
        <div className="db-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="db-root">

        {/* ════════════════════════════════════
            SIDEBAR
        ════════════════════════════════════ */}
        <aside className={`db-sidebar${sidebarOpen ? " open" : ""}`}>

          {/* Avatar block */}
          <div className="db-sidebar-user">
            <div className="db-avatar-wrap">
              {user?.avatar?.url
                ? <img src={user.avatar.url} alt={user.name} className="db-avatar-img" />
                : <div className="db-avatar-init">{user?.name?.charAt(0).toUpperCase()}</div>
              }
              <span className="db-avatar-ring" />
            </div>
            <div className="db-sidebar-user-info">
              <p className="db-sidebar-name">{user?.name}</p>
              <p className="db-sidebar-email">{user?.email}</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="db-nav">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`db-nav-item${activeTab === id ? " active" : ""}`}
                onClick={() => switchTab(id)}
              >
                <Icon size={16} className="db-nav-icon" />
                <span>{label}</span>
                {activeTab === id && <FiChevronRight size={13} className="db-nav-arrow" />}
              </button>
            ))}
          </nav>

          {/* Bottom links */}
          <div className="db-sidebar-bottom">
            <Link to="/products" className="db-sidebar-link">
              <FiShoppingBag size={15} /> Continue Shopping
            </Link>
            <button className="db-sidebar-logout" onClick={handleLogout}>
              <FiLogOut size={15} /> Logout
            </button>
          </div>
        </aside>

        {/* ════════════════════════════════════
            MAIN CONTENT
        ════════════════════════════════════ */}
        <main className="db-main">

          {/* Top bar */}
          <div className="db-topbar">
            <button className="db-burger" onClick={() => setSidebarOpen((s) => !s)} aria-label="Menu">
              {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            <div className="db-topbar-title">
              {NAV.find((n) => n.id === activeTab)?.label}
            </div>
            <Link to="/cart" className="db-topbar-cart">
              <FiShoppingBag size={18} />
              {cartItems.length > 0 && (
                <span className="db-topbar-badge">{cartItems.length}</span>
              )}
            </Link>
          </div>

          {/* Tab panels */}
          <div className="db-content">
            {activeTab === "overview"  && <OverviewTab  stats={STATS} recentOrders={recentOrders} ordersLoading={ordersLoading} switchTab={switchTab} />}
            {activeTab === "orders"    && <OrdersTab    orders={orders} loading={ordersLoading} />}
            {activeTab === "wishlist"  && <WishlistTab  />}
            {activeTab === "addresses" && <AddressesTab />}
            {activeTab === "profile"   && <ProfileTab   user={user} />}
            {activeTab === "settings"  && <SettingsTab  user={user} />}
          </div>
        </main>
      </div>
    </>
  );
};

// ══════════════════════════════════════════════════════
//  OVERVIEW TAB
// ══════════════════════════════════════════════════════
const OverviewTab = ({ stats, recentOrders, ordersLoading, switchTab }) => (
  <div className="db-fade-in">
    {/* Greeting */}
    <div className="db-section-header">
      <h2 className="db-page-title">Good day! 👋</h2>
      <p className="db-page-sub">Here's what's happening with your account.</p>
    </div>

    {/* Stats grid */}
    <div className="db-stats-grid">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className={`db-stat-card${s.wide ? " wide" : ""}`}>
            <div className="db-stat-icon-wrap" style={{ background: s.bg }}>
              <Icon size={18} style={{ color: s.color }} />
            </div>
            <div>
              <p className="db-stat-value" style={{ color: s.color }}>{s.value}</p>
              <p className="db-stat-label">{s.label}</p>
            </div>
          </div>
        );
      })}
    </div>

    {/* Recent orders */}
    <div className="db-card">
      <div className="db-card-header">
        <span className="db-card-title">Recent Orders</span>
        <button className="db-card-link" onClick={() => switchTab("orders")}>
          View all <FiArrowRight size={13} />
        </button>
      </div>

      {ordersLoading ? (
        <div className="db-loading-row"><div className="db-spinner" /></div>
      ) : recentOrders.length === 0 ? (
        <EmptyState icon={FiPackage} message="No orders yet" sub="Your orders will appear here." />
      ) : (
        <div className="db-order-list">
          {recentOrders.map((order) => {
            const sm = statusMeta(order.orderStatus);
            return (
              <div key={order._id} className="db-order-row">
                <div className="db-order-icon-wrap">
                  <FiPackage size={15} style={{ color: "#6366f1" }} />
                </div>
                <div className="db-order-info">
                  <p className="db-order-id">
                    <FiHash size={10} />
                    {order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="db-order-date">
                    <FiCalendar size={10} /> {fmtDate(order.createdAt)}
                  </p>
                </div>
                <span className="db-status-badge" style={{ color: sm.color, background: sm.bg }}>
                  <span className="db-status-dot" style={{ background: sm.dot }} />
                  {sm.label}
                </span>
                <p className="db-order-amount">{fmt(order.totalPrice)}</p>
                <Link to={`/order/${order._id}`} className="db-order-view-btn">
                  View
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>

    {/* Quick links */}
    <div className="db-quick-grid">
      {[
        { label: "Update Profile", icon: FiEdit2,  to: "/me/update",       color: "#6366f1", bg: "#eef2ff" },
        { label: "Change Password",icon: FiLock,   to: "/password/update", color: "#0ea5e9", bg: "#f0f9ff" },
        { label: "Shop Products",  icon: FiShoppingBag, to: "/products",   color: "#16a34a", bg: "#f0fdf4" },
      ].map((q) => (
        <Link key={q.label} to={q.to} className="db-quick-card">
          <div className="db-quick-icon" style={{ background: q.bg }}>
            <q.icon size={18} style={{ color: q.color }} />
          </div>
          <span className="db-quick-label">{q.label}</span>
          <FiChevronRight size={14} className="db-quick-arrow" />
        </Link>
      ))}
    </div>
  </div>
);

// ══════════════════════════════════════════════════════
//  ORDERS TAB
// ══════════════════════════════════════════════════════
const OrdersTab = ({ orders, loading }) => (
  <div className="db-fade-in">
    <div className="db-section-header">
      <h2 className="db-page-title">My Orders</h2>
      <p className="db-page-sub">{orders.length} order{orders.length !== 1 ? "s" : ""} total</p>
    </div>

    {loading ? (
      <div className="db-loading-row"><div className="db-spinner" /></div>
    ) : orders.length === 0 ? (
      <EmptyState icon={FiPackage} message="No orders yet" sub="Start shopping to see your orders here.">
        <Link to="/products" className="db-empty-btn">Shop Now</Link>
      </EmptyState>
    ) : (
      <div className="db-card db-card-flush">
        {/* Table head — desktop */}
        <div className="db-table-head">
          <span>Order ID</span>
          <span>Date</span>
          <span>Items</span>
          <span>Status</span>
          <span className="right">Amount</span>
          <span />
        </div>
        {[...orders].reverse().map((order, idx) => {
          const sm = statusMeta(order.orderStatus);
          return (
            <div key={order._id} className="db-table-row" style={{ animationDelay: `${idx * 0.03}s` }}>
              {/* mobile layout */}
              <div className="db-table-mobile">
                <div className="db-order-info">
                  <p className="db-order-id"><FiHash size={10} />{order._id.slice(-8).toUpperCase()}</p>
                  <p className="db-order-date"><FiCalendar size={10} />{fmtDate(order.createdAt)}</p>
                </div>
                <span className="db-status-badge" style={{ color: sm.color, background: sm.bg }}>
                  <span className="db-status-dot" style={{ background: sm.dot }} />{sm.label}
                </span>
              </div>
              <div className="db-table-mobile db-table-mobile-row2">
                <span className="db-table-items">{order.orderItems?.length || 0} item{order.orderItems?.length !== 1 ? "s" : ""}</span>
                <span className="db-order-amount">{fmt(order.totalPrice)}</span>
                <Link to={`/order/${order._id}`} className="db-order-view-btn">Details <FiArrowRight size={11} /></Link>
              </div>

              {/* desktop layout */}
              <span className="db-table-cell db-order-id desktop-only"><FiHash size={10} />{order._id.slice(-8).toUpperCase()}</span>
              <span className="db-table-cell db-order-date desktop-only"><FiCalendar size={10} />{fmtDate(order.createdAt)}</span>
              <span className="db-table-cell db-table-items desktop-only">{order.orderItems?.length || 0}</span>
              <span className="db-table-cell desktop-only">
                <span className="db-status-badge" style={{ color: sm.color, background: sm.bg }}>
                  <span className="db-status-dot" style={{ background: sm.dot }} />{sm.label}
                </span>
              </span>
              <span className="db-table-cell db-order-amount right desktop-only">{fmt(order.totalPrice)}</span>
              <span className="db-table-cell desktop-only">
                <Link to={`/order/${order._id}`} className="db-order-view-btn">Details <FiArrowRight size={11} /></Link>
              </span>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

// ══════════════════════════════════════════════════════
//  WISHLIST TAB
// ══════════════════════════════════════════════════════
const WishlistTab = () => (
  <div className="db-fade-in">
    <div className="db-section-header">
      <h2 className="db-page-title">Wishlist</h2>
      <p className="db-page-sub">Items you've saved for later</p>
    </div>
    <EmptyState icon={FiHeart} message="Your wishlist is empty" sub="Save items you love and they'll appear here.">
      <Link to="/products" className="db-empty-btn">Explore Products</Link>
    </EmptyState>
  </div>
);

// ══════════════════════════════════════════════════════
//  ADDRESSES TAB
// ══════════════════════════════════════════════════════
const AddressesTab = () => {
  const MOCK_ADDRESSES = [
    { id: 1, label: "Home", name: "John Doe", line1: "123 Main Street", line2: "Apt 4B", city: "Mumbai", state: "Maharashtra", pin: "400001", phone: "+91 98765 43210", default: true },
    { id: 2, label: "Work", name: "John Doe", line1: "456 Business Park", line2: "Floor 3", city: "Pune", state: "Maharashtra", pin: "411001", phone: "+91 98765 43210", default: false },
  ];
  return (
    <div className="db-fade-in">
      <div className="db-section-header db-section-header-row">
        <div>
          <h2 className="db-page-title">Saved Addresses</h2>
          <p className="db-page-sub">Manage your delivery addresses</p>
        </div>
        <button className="db-add-btn"><FiPlus size={15} /> Add Address</button>
      </div>

      <div className="db-address-grid">
        {MOCK_ADDRESSES.map((addr) => (
          <div key={addr.id} className={`db-address-card${addr.default ? " default" : ""}`}>
            {addr.default && <span className="db-address-default-badge">Default</span>}
            <div className="db-address-label-row">
              <div className="db-address-icon">
                <FiHome size={14} style={{ color: "#6366f1" }} />
              </div>
              <span className="db-address-label">{addr.label}</span>
            </div>
            <p className="db-address-name">{addr.name}</p>
            <p className="db-address-line">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
            <p className="db-address-line">{addr.city}, {addr.state} — {addr.pin}</p>
            <p className="db-address-phone"><FiPhone size={11} /> {addr.phone}</p>
            <div className="db-address-actions">
              <button className="db-address-btn edit"><FiEdit2 size={13} /> Edit</button>
              <button className="db-address-btn delete"><FiTrash2 size={13} /> Remove</button>
            </div>
          </div>
        ))}

        {/* Add new card */}
        <button className="db-address-add-card">
          <FiPlus size={22} style={{ color: "#9ca3af" }} />
          <span>Add New Address</span>
        </button>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════
//  PROFILE TAB
// ══════════════════════════════════════════════════════
const ProfileTab = ({ user }) => (
  <div className="db-fade-in">
    <div className="db-section-header">
      <h2 className="db-page-title">My Profile</h2>
      <p className="db-page-sub">Your personal information</p>
    </div>

    <div className="db-card db-profile-card">
      {/* Avatar */}
      <div className="db-profile-avatar-block">
        <div className="db-profile-avatar-wrap">
          {user?.avatar?.url
            ? <img src={user.avatar.url} alt={user.name} className="db-profile-avatar-img" />
            : <div className="db-profile-avatar-init">{user?.name?.charAt(0).toUpperCase()}</div>
          }
          <Link to="/me/update" className="db-profile-avatar-edit" aria-label="Change photo">
            <FiCamera size={14} />
          </Link>
        </div>
        <div>
          <p className="db-profile-name">{user?.name}</p>
          <p className="db-profile-since">Member since {fmtDate(user?.createdAt)}</p>
          {user?.role === "admin" && <span className="db-profile-admin-badge">Admin</span>}
        </div>
      </div>

      <div className="db-profile-divider" />

      {/* Info fields */}
      <div className="db-profile-fields">
        {[
          { icon: FiUser,  label: "Full Name", value: user?.name },
          { icon: FiMail,  label: "Email Address", value: user?.email },
          { icon: FiCalendar, label: "Joined", value: fmtDate(user?.createdAt) },
        ].map((f) => (
          <div key={f.label} className="db-profile-field">
            <div className="db-profile-field-icon"><f.icon size={14} /></div>
            <div>
              <p className="db-profile-field-label">{f.label}</p>
              <p className="db-profile-field-value">{f.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="db-profile-actions">
        <Link to="/me/update" className="db-profile-btn primary"><FiEdit2 size={14} /> Edit Profile</Link>
        <Link to="/password/update" className="db-profile-btn secondary"><FiLock size={14} /> Change Password</Link>
      </div>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════
//  SETTINGS TAB
// ══════════════════════════════════════════════════════
const SettingsTab = ({ user }) => {
  const [notifEmail,  setNotifEmail]  = useState(true);
  const [notifSMS,    setNotifSMS]    = useState(false);
  const [notifOffers, setNotifOffers] = useState(true);

  return (
    <div className="db-fade-in">
      <div className="db-section-header">
        <h2 className="db-page-title">Settings</h2>
        <p className="db-page-sub">Manage your preferences</p>
      </div>

      {/* Account settings */}
      <div className="db-card db-settings-card">
        <h3 className="db-settings-group-title">Account</h3>
        <div className="db-settings-row">
          <div>
            <p className="db-settings-row-title">Update Profile</p>
            <p className="db-settings-row-sub">Change your name, email or photo</p>
          </div>
          <Link to="/me/update" className="db-settings-action-btn"><FiEdit2 size={14} /> Edit</Link>
        </div>
        <div className="db-settings-row">
          <div>
            <p className="db-settings-row-title">Change Password</p>
            <p className="db-settings-row-sub">Update your account password</p>
          </div>
          <Link to="/password/update" className="db-settings-action-btn"><FiLock size={14} /> Update</Link>
        </div>
      </div>

      {/* Notifications */}
      <div className="db-card db-settings-card">
        <h3 className="db-settings-group-title">Notifications</h3>
        {[
          { label: "Email Notifications",  sub: "Order updates sent to your email",   val: notifEmail,  set: setNotifEmail  },
          { label: "SMS Notifications",    sub: "Order updates sent via SMS",          val: notifSMS,    set: setNotifSMS    },
          { label: "Offers & Promotions",  sub: "Deals and sale alerts",               val: notifOffers, set: setNotifOffers },
        ].map((n) => (
          <div key={n.label} className="db-settings-row">
            <div>
              <p className="db-settings-row-title">{n.label}</p>
              <p className="db-settings-row-sub">{n.sub}</p>
            </div>
            <button
              className={`db-toggle${n.val ? " on" : ""}`}
              onClick={() => n.set((v) => !v)}
              aria-label={n.label}
              role="switch"
              aria-checked={n.val}
            >
              <span className="db-toggle-thumb" />
            </button>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="db-card db-settings-card db-danger-card">
        <h3 className="db-settings-group-title danger">Danger Zone</h3>
        <div className="db-settings-row">
          <div>
            <p className="db-settings-row-title">Delete Account</p>
            <p className="db-settings-row-sub">Permanently delete your account and all data</p>
          </div>
          <button className="db-danger-btn"><FiTrash2 size={14} /> Delete</button>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════
//  SHARED: EMPTY STATE
// ══════════════════════════════════════════════════════
const EmptyState = ({ icon: Icon, message, sub, children }) => (
  <div className="db-empty">
    <div className="db-empty-icon"><Icon size={28} /></div>
    <p className="db-empty-title">{message}</p>
    <p className="db-empty-sub">{sub}</p>
    {children}
  </div>
);

export default Dashboard;
