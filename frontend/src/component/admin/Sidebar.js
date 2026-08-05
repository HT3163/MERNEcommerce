import React from "react";
import "./sidebar.css";
import logo from "../../images/logo.png";
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

const Sidebar = () => {
  const { pathname } = useLocation();
  const { user }     = useSelector((s) => s.user);

  const isActive = (path) => (pathname === path ? "sidebar-active" : "");

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "AD";

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
        <div className="sidebar-footer-avatar">{initials}</div>
        <div className="sidebar-footer-info">
          <span className="sidebar-footer-name">{user?.name || "Admin"}</span>
          <span className="sidebar-footer-role">Administrator</span>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;
