import React, { Fragment, useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./productList.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getAdminProduct,
  deleteProduct,
} from "../../actions/productAction";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import SideBar from "./Sidebar";
import { DELETE_PRODUCT_RESET } from "../../constants/productConstants";
import { useNavigate } from "react-router-dom";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiPackage,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

const ProductList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();

  const [searchQuery, setSearchQuery] = useState("");

  const { error, products } = useSelector((state) => state.products);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.product
  );

  const deleteProductHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      alert.success("Product deleted successfully");
      navigate("/admin/dashboard");
      dispatch({ type: DELETE_PRODUCT_RESET });
    }
    dispatch(getAdminProduct());
  }, [dispatch, alert, error, deleteError, navigate, isDeleted]);

  /* ── Derived stats ───────────────────────────────────────── */
  const totalProducts  = products ? products.length : 0;
  const outOfStock     = products ? products.filter((p) => p.Stock === 0).length : 0;
  const inStock        = totalProducts - outOfStock;
  const totalValue     = products
    ? products.reduce((sum, p) => sum + p.price, 0).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      })
    : "$0";

  /* ── DataGrid columns ───────────────────────────────────── */
  const columns = [
    {
      field: "id",
      headerName: "Product ID",
      minWidth: 200,
      flex: 0.5,
      renderCell: (params) => (
        <span className="pl-product-id">
          {params.value}
        </span>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 280,
      flex: 1,
      renderCell: (params) => (
        <div className="pl-product-name-cell">
          <div className="pl-product-icon">
            <FiPackage size={14} />
          </div>
          <span className="pl-product-name">{params.value}</span>
        </div>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      minWidth: 130,
      flex: 0.4,
      renderCell: (params) => (
        <span className="pl-price">
          ${Number(params.value).toLocaleString()}
        </span>
      ),
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 130,
      flex: 0.35,
      renderCell: (params) => {
        const qty = Number(params.value);
        if (qty === 0) {
          return (
            <span className="pl-badge pl-badge-out">
              <FiAlertCircle size={11} /> Out of Stock
            </span>
          );
        }
        if (qty <= 5) {
          return (
            <span className="pl-badge pl-badge-low">
              <FiAlertCircle size={11} /> Low ({qty})
            </span>
          );
        }
        return (
          <span className="pl-badge pl-badge-in">
            <FiCheckCircle size={11} /> In Stock ({qty})
          </span>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 120,
      flex: 0.3,
      sortable: false,
      renderCell: (params) => {
        const id = params.getValue(params.id, "id");
        return (
          <div className="pl-actions">
            <Link
              to={`/admin/product/${id}`}
              className="pl-action-btn pl-action-edit"
              title="Edit product"
            >
              <FiEdit2 size={15} />
            </Link>
            <button
              className="pl-action-btn pl-action-delete"
              onClick={() => deleteProductHandler(id)}
              title="Delete product"
            >
              <FiTrash2 size={15} />
            </button>
          </div>
        );
      },
    },
  ];

  /* ── Rows (with optional search filter) ─────────────────── */
  const allRows = [];
  products &&
    products.forEach((item) => {
      allRows.push({
        id:    item._id,
        name:  item.name,
        price: item.price,
        stock: item.Stock,
      });
    });

  const rows = searchQuery.trim()
    ? allRows.filter((r) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allRows;

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <Fragment>
      <MetaData title="All Products — Admin" />

      <div className="pl-layout">
        <SideBar />

        <div className="pl-main">

          {/* ── Top bar ───────────────────────────────────── */}
          <div className="pl-topbar">
            <div className="pl-topbar-left">
              <h1>Products</h1>
              <p>Manage your product catalogue</p>
            </div>
            <div className="pl-topbar-right">
              <Link to="/admin/product" className="pl-add-btn">
                <FiPlus size={16} />
                Add Product
              </Link>
            </div>
          </div>

          {/* ── Body ──────────────────────────────────────── */}
          <div className="pl-body">

            {/* Stat cards */}
            <div className="pl-stats">
              <div className="pl-stat-card">
                <div className="pl-stat-icon" style={{ background: "#eef2ff" }}>
                  <FiPackage size={20} color="#6366f1" />
                </div>
                <div className="pl-stat-info">
                  <p className="pl-stat-label">Total Products</p>
                  <h2 className="pl-stat-value">{totalProducts}</h2>
                </div>
              </div>

              <div className="pl-stat-card">
                <div className="pl-stat-icon" style={{ background: "#f0fdf4" }}>
                  <FiCheckCircle size={20} color="#16a34a" />
                </div>
                <div className="pl-stat-info">
                  <p className="pl-stat-label">In Stock</p>
                  <h2 className="pl-stat-value">{inStock}</h2>
                </div>
              </div>

              <div className="pl-stat-card">
                <div className="pl-stat-icon" style={{ background: "#fef2f2" }}>
                  <FiAlertCircle size={20} color="#dc2626" />
                </div>
                <div className="pl-stat-info">
                  <p className="pl-stat-label">Out of Stock</p>
                  <h2 className="pl-stat-value">{outOfStock}</h2>
                </div>
              </div>

              <div className="pl-stat-card">
                <div className="pl-stat-icon" style={{ background: "#fff7ed" }}>
                  <span style={{ fontSize: "1.15rem", color: "#ea580c" }}>$</span>
                </div>
                <div className="pl-stat-info">
                  <p className="pl-stat-label">Catalogue Value</p>
                  <h2 className="pl-stat-value pl-stat-value--sm">{totalValue}</h2>
                </div>
              </div>
            </div>

            {/* Table card */}
            <div className="pl-table-card">
              {/* Table header: title + search */}
              <div className="pl-table-header">
                <div>
                  <p className="pl-table-eyebrow">Catalogue</p>
                  <h3 className="pl-table-title">All Products</h3>
                </div>
                <div className="pl-search-wrap">
                  <FiSearch size={15} className="pl-search-icon" />
                  <input
                    type="text"
                    className="pl-search-input"
                    placeholder="Search by name or ID…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* DataGrid */}
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                disableSelectionOnClick
                className="pl-datagrid"
                autoHeight
              />
            </div>

          </div>{/* /pl-body */}
        </div>{/* /pl-main */}
      </div>{/* /pl-layout */}
    </Fragment>
  );
};

export default ProductList;
