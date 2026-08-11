import React, { useState, useEffect } from "react";
import "./sidebar.css";
import logo from "../../images/logo.png";
import defaultAvatar from "../../images/Profile.png";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { TreeView, TreeItem } from "@material-ui/lab";
import {
  FiChevronDown,
  FiChevronRight,
  FiGrid,
  FiPackage,
  FiPlusSquare,
  FiShoppingBag,
  FiUsers,
  FiStar,
} from "react-icons/fi";

/* ── gradient palette for initials ── */
const GRADIENTS = [
  ["#f43f5e", "#fb923c"],
  ["#8b5cf6", "#6366f1"],
  ["#06b6d4", "#3b82f6"],
  ["#10b981", "#059669"],
  ["#f59e0b", "#ef4444"],
  ["#ec4899", "#8b5cf6"],
  ["#14b8a6", "#06b6d4"],
  ["#6366f1", "#8b5cf6"],
  ["#f97316", "#f59e0b"],
  ["#84cc16", "#10b981"],
];
const getGradient = (name = "") => GRADIENTS[(name.charCodeAt(0) || 0) % GRADIENTS.length];

/* ── SmartAvatar ── */
const SmartAvatar = ({ src, name, size = 32, className = "" }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const initial = (name || "A").charAt(0).toUpperCase();
  const [from, to] = getGradient(name);

  useEffect(() => { setImgFailed(false); }, [src]);

  if (!imgFailed && src && src !== defaultAvatar) {
    return (
      <img
        src={src}
        alt={name || "Avatar"}
        className={className}
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
        onError={() => setImgFailed(true)}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${from}, ${to})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 700,
        fontSize: size * 0.4,
        flexShrink: 0,
        userSelect: "none",
        textShadow: "0 1px 3px rgba(0,0,0,0.25)",
      }}
    >
      {initial}
    </div>
  );
};

/* ════════════════════════════════════════════════
   SIDEBAR
════════════════════════════════════════════════ */
const Sidebar = () => {
  const { pathname } = useLocation();
  const { user }     = useSelector((s) => s.user);

  const isActive = (path) => (pathname === path ? "sidebar-active" : "");

  return (
    <div className="sidebar">

      {/* ── Logo ── */}
      <Link to="/" className="sidebar-logo-area">
        <img src={logo} alt="LUXE Admin" />
      </Link>

      {/* ── Main nav group ── */}
      <span className="sidebar-group-label">Main</span>

      <Link to="/admin/dashboard" className={isActive("/admin/dashboard")}>
        <FiGrid size={16} />
        Dashboard
      </Link>

      {/* ── Catalogue group ── */}
      <span className="sidebar-group-label">Catalogue</span>

      <TreeView
        defaultCollapseIcon={<FiChevronDown size={14} />}
        defaultExpandIcon={<FiChevronRight size={14} />}
        defaultExpanded={pathname.startsWith("/admin/product") ? ["products"] : []}
      >
        <TreeItem
          nodeId="products"
          label={
            <span style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <FiPackage size={16} />
              Products
            </span>
          }
        >
          <Link
            to="/admin/products"
            className={isActive("/admin/products")}
            style={{ paddingLeft: "1.5rem" }}
          >
            <FiPackage size={14} />
            All Products
          </Link>
          <Link
            to="/admin/product"
            className={isActive("/admin/product")}
            style={{ paddingLeft: "1.5rem" }}
          >
            <FiPlusSquare size={14} />
            Create Product
          </Link>
        </TreeItem>
      </TreeView>

      {/* ── Operations group ── */}
      <span className="sidebar-group-label">Operations</span>

      <Link to="/admin/orders" className={isActive("/admin/orders")}>
        <FiShoppingBag size={16} />
        Orders
      </Link>

      <Link to="/admin/users" className={isActive("/admin/users")}>
        <FiUsers size={16} />
        Users
      </Link>

      <Link to="/admin/reviews" className={isActive("/admin/reviews")}>
        <FiStar size={16} />
        Reviews
      </Link>

      {/* ── User footer ── */}
      <div className="sidebar-footer">
        <SmartAvatar
          src={user?.avatar?.url}
          name={user?.name}
          size={32}
          className="sidebar-footer-avatar"
        />
        <div className="sidebar-footer-info">
          <span className="sidebar-footer-name">{user?.name || "Admin"}</span>
          <span className="sidebar-footer-role">Administrator</span>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;
