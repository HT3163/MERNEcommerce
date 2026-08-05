import React, { Fragment, useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./orderList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import SideBar from "./Sidebar";
import {
  deleteOrder,
  getAllOrders,
  clearErrors,
} from "../../actions/orderAction";
import { DELETE_ORDER_RESET } from "../../constants/orderConstants";
import { useNavigate } from "react-router-dom";
import {
  FiShoppingBag,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiAlertCircle,
} from "react-icons/fi";

const OrderList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert    = useAlert();

  const [searchQuery, setSearchQuery] = useState("");

  const { error, orders }                  = useSelector((s) => s.allOrders);
  const { error: deleteError, isDeleted }  = useSelector((s) => s.order);

  const deleteOrderHandler = (id) => {
    if (window.confirm("Delete this order? This cannot be undone.")) {
      dispatch(deleteOrder(id));
    }
  };

  useEffect(() => {
    if (error)       { alert.error(error);       dispatch(clearErrors()); }
    if (deleteError) { alert.error(deleteError);  dispatch(clearErrors()); }
    if (isDeleted) {
      alert.success("Order deleted successfully");
      navigate("/admin/orders");
      dispatch({ type: DELETE_ORDER_RESET });
    }
    dispatch(getAllOrders());
  }, [dispatch, alert, error, deleteError, navigate, isDeleted]);

  /* ── Derived stats ───────────────────────────────────────── */
  const totalOrders     = orders ? orders.length : 0;
  const processing      = orders ? orders.filter((o) => o.orderStatus === "Processing").length  : 0;
  const shipped         = orders ? orders.filter((o) => o.orderStatus === "Shipped").length     : 0;
  const delivered       = orders ? orders.filter((o) => o.orderStatus === "Delivered").length   : 0;
  const totalRevenue    = orders
    ? orders.reduce((s, o) => s + o.totalPrice, 0).toLocaleString("en-US", {
        style: "currency", currency: "USD", maximumFractionDigits: 0,
      })
    : "$0";

  /* ── Status badge helper ─────────────────────────────────── */
  const StatusBadge = ({ status }) => {
    const map = {
      Processing: { cls: "ol-badge-processing", icon: <FiClock size={11} /> },
      Shipped:    { cls: "ol-badge-shipped",    icon: <FiTruck size={11} /> },
      Delivered:  { cls: "ol-badge-delivered",  icon: <FiCheckCircle size={11} /> },
    };
    const cfg = map[status] || { cls: "ol-badge-processing", icon: <FiAlertCircle size={11} /> };
    return (
      <span className={`ol-badge ${cfg.cls}`}>
        {cfg.icon} {status || "Unknown"}
      </span>
    );
  };

  /* ── DataGrid columns ───────────────────────────────────── */
  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 220,
      flex: 0.6,
      renderCell: (params) => (
        <span className="ol-order-id">{params.value}</span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.4,
      renderCell: (params) => <StatusBadge status={params.value} />,
    },
    {
      field: "itemsQty",
      headerName: "Items",
      type: "number",
      minWidth: 100,
      flex: 0.25,
      renderCell: (params) => (
        <span className="ol-items-qty">{params.value}</span>
      ),
    },
    {
      field: "amount",
      headerName: "Total",
      type: "number",
      minWidth: 140,
      flex: 0.35,
      renderCell: (params) => (
        <span className="ol-amount">
          ${Number(params.value).toLocaleString()}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 110,
      flex: 0.25,
      sortable: false,
      renderCell: (params) => {
        const id = params.getValue(params.id, "id");
        return (
          <div className="ol-actions">
            <Link
              to={`/admin/order/${id}`}
              className="ol-action-btn ol-action-edit"
              title="Process order"
            >
              <FiEdit2 size={15} />
            </Link>
            <button
              className="ol-action-btn ol-action-delete"
              onClick={() => deleteOrderHandler(id)}
              title="Delete order"
            >
              <FiTrash2 size={15} />
            </button>
          </div>
        );
      },
    },
  ];

  /* ── Rows ────────────────────────────────────────────────── */
  const allRows = orders
    ? orders.map((o) => ({
        id:       o._id,
        status:   o.orderStatus,
        itemsQty: o.orderItems.length,
        amount:   o.totalPrice,
      }))
    : [];

  const rows = searchQuery.trim()
    ? allRows.filter((r) =>
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.status.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allRows;

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <Fragment>
      <MetaData title="All Orders — Admin" />

      <div className="ol-layout">
        <SideBar />

        <div className="ol-main">

          {/* ── Top bar ───────────────────────────────────── */}
          <div className="ol-topbar">
            <div className="ol-topbar-left">
              <h1>Orders</h1>
              <p>Manage and process customer orders</p>
            </div>
          </div>

          {/* ── Body ──────────────────────────────────────── */}
          <div className="ol-body">

            {/* Stat cards */}
            <div className="ol-stats">
              <div className="ol-stat-card">
                <div className="ol-stat-icon" style={{ background: "#eef2ff" }}>
                  <FiShoppingBag size={20} color="#6366f1" />
                </div>
                <div className="ol-stat-info">
                  <p className="ol-stat-label">Total Orders</p>
                  <h2 className="ol-stat-value">{totalOrders}</h2>
                </div>
              </div>

              <div className="ol-stat-card">
                <div className="ol-stat-icon" style={{ background: "#fffbeb" }}>
                  <FiClock size={20} color="#d97706" />
                </div>
                <div className="ol-stat-info">
                  <p className="ol-stat-label">Processing</p>
                  <h2 className="ol-stat-value">{processing}</h2>
                </div>
              </div>

              <div className="ol-stat-card">
                <div className="ol-stat-icon" style={{ background: "#eff6ff" }}>
                  <FiTruck size={20} color="#2563eb" />
                </div>
                <div className="ol-stat-info">
                  <p className="ol-stat-label">Shipped</p>
                  <h2 className="ol-stat-value">{shipped}</h2>
                </div>
              </div>

              <div className="ol-stat-card">
                <div className="ol-stat-icon" style={{ background: "#f0fdf4" }}>
                  <FiCheckCircle size={20} color="#16a34a" />
                </div>
                <div className="ol-stat-info">
                  <p className="ol-stat-label">Delivered</p>
                  <h2 className="ol-stat-value">{delivered}</h2>
                </div>
              </div>

              <div className="ol-stat-card ol-stat-card--wide">
                <div className="ol-stat-icon" style={{ background: "#fff7ed" }}>
                  <span style={{ fontSize: "1.15rem", fontWeight: 700, color: "#ea580c" }}>$</span>
                </div>
                <div className="ol-stat-info">
                  <p className="ol-stat-label">Total Revenue</p>
                  <h2 className="ol-stat-value ol-stat-value--sm">{totalRevenue}</h2>
                </div>
              </div>
            </div>

            {/* Table card */}
            <div className="ol-table-card">
              <div className="ol-table-header">
                <div>
                  <p className="ol-table-eyebrow">Operations</p>
                  <h3 className="ol-table-title">All Orders</h3>
                </div>
                <div className="ol-search-wrap">
                  <FiSearch size={15} className="ol-search-icon" />
                  <input
                    type="text"
                    className="ol-search-input"
                    placeholder="Search by ID or status…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                disableSelectionOnClick
                className="ol-datagrid"
                autoHeight
              />
            </div>

          </div>{/* /ol-body */}
        </div>{/* /ol-main */}
      </div>{/* /ol-layout */}
    </Fragment>
  );
};

export default OrderList;
