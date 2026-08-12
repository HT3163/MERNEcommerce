import React, { Fragment, useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./productReviews.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getAllReviews,
  deleteReviews,
} from "../../actions/productAction";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import SideBar from "./Sidebar";
import { DELETE_REVIEW_RESET } from "../../constants/productConstants";
import { useNavigate } from "react-router-dom";
import {
  FiStar,
  FiSearch,
  FiTrash2,
  FiMessageSquare,
  FiUser,
  FiHash,
  FiAlertCircle,
  FiX,
} from "react-icons/fi";

/* ── Star rating display ─────────────────────────────────── */
const StarRating = ({ rating }) => {
  const num = Number(rating);
  return (
    <div className="pr-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <FiStar
          key={s}
          size={13}
          className={s <= num ? "pr-star pr-star--filled" : "pr-star"}
        />
      ))}
      <span className="pr-rating-num">{num}.0</span>
    </div>
  );
};

const ProductReviews = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert    = useAlert();

  const { error: deleteError, isDeleted } = useSelector((s) => s.review);
  const { error, reviews, loading }       = useSelector((s) => s.productReviews);

  const [productId,     setProductId]     = useState("");
  const [searchError,   setSearchError]   = useState(""); // inline error banner
  const [hasSearched,   setHasSearched]   = useState(false);

  const deleteReviewHandler = (reviewId) => {
    if (window.confirm("Delete this review permanently?")) {
      dispatch(deleteReviews(reviewId, productId));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchError("");
    setHasSearched(true);
    dispatch(getAllReviews(productId));
  };

  // Handle API error once — show inline banner, then clear from redux
  useEffect(() => {
    if (error) {
      setSearchError(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  // Handle delete errors/success separately
  useEffect(() => {
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      alert.success("Review deleted successfully");
      navigate("/admin/reviews");
      dispatch({ type: DELETE_REVIEW_RESET });
    }
  }, [dispatch, alert, deleteError, navigate, isDeleted]);

  // Auto-fetch when productId hits 24 chars
  useEffect(() => {
    if (productId.length === 24) {
      setSearchError("");
      setHasSearched(true);
      dispatch(getAllReviews(productId));
    }
    // Reset search state when field is cleared
    if (productId.length === 0) {
      setHasSearched(false);
      setSearchError("");
    }
  }, [dispatch, productId]);

  /* ── Derived stats ─────────────────────────────────────── */
  const totalReviews = reviews ? reviews.length : 0;
  const avgRating    = reviews && reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";
  const positiveCount = reviews ? reviews.filter((r) => r.rating >= 3).length : 0;
  const negativeCount = reviews ? reviews.filter((r) => r.rating < 3).length  : 0;

  /* ── DataGrid columns ──────────────────────────────────── */
  const columns = [
    {
      field: "id",
      headerName: "Review ID",
      minWidth: 200,
      flex: 0.5,
      renderCell: (params) => (
        <span className="pr-review-id">{params.value}</span>
      ),
    },
    {
      field: "user",
      headerName: "User",
      minWidth: 160,
      flex: 0.5,
      renderCell: (params) => (
        <div className="pr-user-cell">
          <div className="pr-user-avatar">
            {params.value ? params.value[0].toUpperCase() : "U"}
          </div>
          <span className="pr-user-name">{params.value}</span>
        </div>
      ),
    },
    {
      field: "comment",
      headerName: "Comment",
      minWidth: 300,
      flex: 1,
      renderCell: (params) => (
        <span className="pr-comment">{params.value}</span>
      ),
    },
    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 160,
      flex: 0.4,
      renderCell: (params) => <StarRating rating={params.value} />,
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 90,
      flex: 0.2,
      sortable: false,
      renderCell: (params) => (
        <button
          className="pr-action-btn pr-action-delete"
          onClick={() => deleteReviewHandler(params.getValue(params.id, "id"))}
          title="Delete review"
        >
          <FiTrash2 size={15} />
        </button>
      ),
    },
  ];

  /* ── Rows ──────────────────────────────────────────────── */
  const rows = reviews
    ? reviews.map((r) => ({
        id:      r._id,
        rating:  r.rating,
        comment: r.comment,
        user:    r.name,
      }))
    : [];

  /* ── Render ────────────────────────────────────────────── */
  return (
    <Fragment>
      <MetaData title="All Reviews — Admin" />

      <div className="pr-layout">
        <SideBar />

        <div className="pr-main">

          {/* ── Sticky top bar ────────────────────────── */}
          <div className="pr-topbar">
            <div className="pr-topbar-left">
              <h1>Reviews</h1>
              <p>Search and moderate product reviews</p>
            </div>
          </div>

          {/* ── Body ──────────────────────────────────── */}
          <div className="pr-body">

            {/* Search card */}
            <div className="pr-search-card">
              <div className="pr-search-card-header">
                <p className="pr-card-eyebrow">Lookup</p>
                <h3 className="pr-card-title">Find Reviews by Product</h3>
              </div>
              <div className="pr-search-card-body">
                <form onSubmit={handleSearch} className="pr-search-form">
                  <div className="pr-search-field">
                    <span className="pr-search-field-icon">
                      <FiHash size={15} />
                    </span>
                    <input
                      type="text"
                      className="pr-search-input"
                      placeholder="Paste a 24-character Product ID…"
                      value={productId}
                      required
                      onChange={(e) => setProductId(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="pr-search-btn"
                    disabled={loading || productId === ""}
                  >
                    {loading
                      ? <span className="pr-spinner" />
                      : <FiSearch size={15} />}
                    {loading ? "Searching…" : "Search Reviews"}
                  </button>
                </form>
                {productId.length > 0 && productId.length !== 24 && (
                  <p className="pr-id-hint">
                    <FiAlertCircle size={13} />
                    Product ID must be exactly 24 characters
                    ({productId.length}/24)
                  </p>
                )}

                {/* Inline error banner */}
                {searchError && (
                  <div className="pr-error-banner">
                    <div className="pr-error-banner-icon">
                      <FiAlertCircle size={18} />
                    </div>
                    <div className="pr-error-banner-body">
                      <p className="pr-error-banner-title">No reviews found</p>
                      <p className="pr-error-banner-msg">{searchError}</p>
                    </div>
                    <button
                      className="pr-error-banner-close"
                      onClick={() => setSearchError("")}
                      aria-label="Dismiss error"
                    >
                      <FiX size={15} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Stats — only show when reviews loaded */}
            {reviews && reviews.length > 0 && (
              <div className="pr-stats">
                <div className="pr-stat-card">
                  <div className="pr-stat-icon" style={{ background: "#eef2ff" }}>
                    <FiMessageSquare size={20} color="#6366f1" />
                  </div>
                  <div className="pr-stat-info">
                    <p className="pr-stat-label">Total Reviews</p>
                    <h2 className="pr-stat-value">{totalReviews}</h2>
                  </div>
                </div>

                <div className="pr-stat-card">
                  <div className="pr-stat-icon" style={{ background: "#fffbeb" }}>
                    <FiStar size={20} color="#d97706" />
                  </div>
                  <div className="pr-stat-info">
                    <p className="pr-stat-label">Avg Rating</p>
                    <h2 className="pr-stat-value">{avgRating}</h2>
                  </div>
                </div>

                <div className="pr-stat-card">
                  <div className="pr-stat-icon" style={{ background: "#f0fdf4" }}>
                    <FiStar size={20} color="#16a34a" />
                  </div>
                  <div className="pr-stat-info">
                    <p className="pr-stat-label">Positive (≥3★)</p>
                    <h2 className="pr-stat-value">{positiveCount}</h2>
                  </div>
                </div>

                <div className="pr-stat-card">
                  <div className="pr-stat-icon" style={{ background: "#fef2f2" }}>
                    <FiAlertCircle size={20} color="#dc2626" />
                  </div>
                  <div className="pr-stat-info">
                    <p className="pr-stat-label">Negative (&lt;3★)</p>
                    <h2 className="pr-stat-value">{negativeCount}</h2>
                  </div>
                </div>
              </div>
            )}

            {/* Table card */}
            {reviews && reviews.length > 0 ? (
              <div className="pr-table-card">
                <div className="pr-table-header">
                  <div>
                    <p className="pr-card-eyebrow">Results</p>
                    <h3 className="pr-card-title">
                      All Reviews
                      <span className="pr-count-badge">{totalReviews}</span>
                    </h3>
                  </div>
                </div>

                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10, 25, 50]}
                  disableSelectionOnClick
                  className="pr-datagrid"
                  autoHeight
                />
              </div>
            ) : (
              /* Empty state — only show after a real search with no error */
              hasSearched && !loading && !searchError && (
                <div className="pr-empty">
                  <div className="pr-empty-icon">
                    <FiMessageSquare size={32} />
                  </div>
                  <p className="pr-empty-title">No reviews found</p>
                  <p className="pr-empty-sub">
                    This product has no reviews yet, or the ID is incorrect.
                  </p>
                </div>
              )
            )}

          </div>{/* /pr-body */}
        </div>{/* /pr-main */}
      </div>{/* /pr-layout */}
    </Fragment>
  );
};

export default ProductReviews;
