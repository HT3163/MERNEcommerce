import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import { Slider } from "@material-ui/core";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData.js";
import {
  FiSliders,
  FiGrid,
  FiList,
  FiX,
  FiPackage,
} from "react-icons/fi";

// ── Constants ──────────────────────────────────────────────────
const CATEGORIES = [
  "Laptop",
  "Electronic",
  "Vehicles",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
];

const RATING_OPTIONS = [4, 3, 2, 1];

// Render n filled stars as emoji/text
const StarRow = ({ count }) => (
  <span className="rating-stars" aria-label={`${count} stars and above`}>
    {"★".repeat(count)}{"☆".repeat(5 - count)}
  </span>
);

// ── Component ───────────────────────────────────────────────────
const Products = () => {
  const alert   = useAlert();
  const params  = useParams();
  const dispatch = useDispatch();
  const keyword  = params.keyword;

  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [price,       setPrice]       = useState([0, 2000]);
  const [priceCommit, setPriceCommit] = useState([0, 2000]); // debounced value sent to API
  const [category,    setCategory]    = useState("");
  const [ratings,     setRatings]     = useState(0);
  const [gridView,    setGridView]    = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redux
  const {
    products,
    loading,
    error,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  // Debounce price → only fire API 600ms after user stops dragging
  useEffect(() => {
    const timer = setTimeout(() => {
      setPriceCommit(price);
      setCurrentPage(1);
    }, 600);
    return () => clearTimeout(timer);
  }, [price]);

  // Effects
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct(keyword, currentPage, priceCommit, category, ratings));
  }, [dispatch, keyword, currentPage, priceCommit, category, ratings, alert, error]);

  // Handlers
  const handlePriceChange  = (_, newPrice) => { setPrice(newPrice); }; // just updates slider visually; debounce fires API
  const handleCategory     = (cat)         => { setCategory(cat === category ? "" : cat); setCurrentPage(1); };
  const handleRating       = (r)           => { setRatings(r === ratings ? 0 : r); setCurrentPage(1); };
  const handleClearFilters = ()            => { setCategory(""); setRatings(0); setPrice([0, 2000]); setPriceCommit([0, 2000]); setCurrentPage(1); };

  const count        = filteredProductsCount;
  const hasFilters   = category || ratings > 0 || price[0] > 0 || price[1] < 2000;
  const showPaginate = resultPerPage < count;

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${keyword ? `"${keyword}"` : "All Products"} — LUXE`} />

          <div className="products-page">

            {/* ── Page header ── */}
            <header className="products-header">
              <div className="products-title-group">
                <span className="products-overline">
                  {keyword ? "Search Results" : "Collection"}
                </span>
                <h1 className="products-title">
                  {keyword ? (
                    <>Results for <em>"{keyword}"</em></>
                  ) : (
                    <>All <em>Products</em></>
                  )}
                </h1>
              </div>
              <span className="products-count">
                {count > 0
                  ? `${count} item${count !== 1 ? "s" : ""} found`
                  : "No items found"}
              </span>
            </header>

            {/* ── Layout: sidebar + content ── */}
            <div className="products-layout">

              {/* ── Sidebar ── */}
              <aside
                className={`products-sidebar${sidebarOpen ? " sidebar-open" : ""}`}
                aria-label="Filter products"
              >
                {/* Price */}
                <div>
                  <div className="sidebar-section-header">
                    <p className="sidebar-section-title">Price Range</p>
                    {(price[0] > 0 || price[1] < 2000) && (
                      <button
                        className="sidebar-clear-btn"
                        onClick={() => { setPrice([0, 2000]); setPriceCommit([0, 2000]); }}
                        aria-label="Clear price filter"
                      >
                        <FiX size={12} /> Clear
                      </button>
                    )}
                  </div>
                  <Slider
                    value={price}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    aria-labelledby="price-range-slider"
                    min={0}
                    max={2000}
                  />
                  <div className="price-range-labels">
                    <span>${price[0]}</span>
                    <span>${price[1]}</span>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <div className="sidebar-section-header">
                    <p className="sidebar-section-title">Category</p>
                    {category && (
                      <button
                        className="sidebar-clear-btn"
                        onClick={() => setCategory("")}
                        aria-label="Clear category filter"
                      >
                        <FiX size={12} /> Clear
                      </button>
                    )}
                  </div>
                  <ul className="category-list" role="listbox" aria-label="Product categories">
                    {CATEGORIES.map((cat) => (
                      <li
                        key={cat}
                        role="option"
                        aria-selected={category === cat}
                        className={`category-item${category === cat ? " active" : ""}`}
                        onClick={() => handleCategory(cat)}
                      >
                        {cat}
                        <span className="category-item-dot" />
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ratings */}
                <div>
                  <div className="sidebar-section-header">
                    <p className="sidebar-section-title">Min. Rating</p>
                    {ratings > 0 && (
                      <button
                        className="sidebar-clear-btn"
                        onClick={() => setRatings(0)}
                        aria-label="Clear rating filter"
                      >
                        <FiX size={12} /> Clear
                      </button>
                    )}
                  </div>
                  <ul className="rating-stars-list" role="listbox" aria-label="Minimum star rating">
                    {RATING_OPTIONS.map((r) => (
                      <li
                        key={r}
                        role="option"
                        aria-selected={ratings === r}
                        className={`rating-star-item${ratings === r ? " active" : ""}`}
                        onClick={() => handleRating(r)}
                      >
                        <StarRow count={r} />
                        <span>& above</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>

              {/* ── Main content ── */}
              <main>

                {/* Toolbar */}
                <div className="products-toolbar">
                  <div className="toolbar-left">
                    {/* Mobile filter toggle */}
                    <button
                      className="filter-toggle-btn"
                      onClick={() => setSidebarOpen((o) => !o)}
                      aria-expanded={sidebarOpen}
                      aria-controls="sidebar"
                    >
                      <FiSliders size={15} />
                      {sidebarOpen ? "Hide Filters" : "Filters"}
                    </button>

                    {/* Active filter chips */}
                    {category && (
                      <span className="active-filter-chip">
                        {category}
                        <button
                          className="chip-remove"
                          onClick={() => setCategory("")}
                          aria-label={`Remove ${category} filter`}
                        >
                          <FiX size={12} />
                        </button>
                      </span>
                    )}
                    {ratings > 0 && (
                      <span className="active-filter-chip">
                        {ratings}★ & up
                        <button
                          className="chip-remove"
                          onClick={() => setRatings(0)}
                          aria-label="Remove rating filter"
                        >
                          <FiX size={12} />
                        </button>
                      </span>
                    )}
                    {hasFilters && (
                      <button className="sidebar-clear-btn" onClick={handleClearFilters}>
                        <FiX size={12} /> Clear all
                      </button>
                    )}
                  </div>

                  {/* View toggle */}
                  <div className="view-toggle" role="group" aria-label="View mode">
                    <button
                      className={`view-btn${gridView ? " active" : ""}`}
                      onClick={() => setGridView(true)}
                      aria-label="Grid view"
                      title="Grid view"
                    >
                      <FiGrid size={16} />
                    </button>
                    <button
                      className={`view-btn${!gridView ? " active" : ""}`}
                      onClick={() => setGridView(false)}
                      aria-label="List view"
                      title="List view"
                    >
                      <FiList size={16} />
                    </button>
                  </div>
                </div>

                {/* Grid / empty state */}
                <div className={`products-grid${!gridView ? " list-view" : ""}`}>
                  {products && products.length > 0 ? (
                    products.map((product) => (
                      <ProductCard key={product._id} Product={product} />
                    ))
                  ) : (
                    <div className="products-empty">
                      <div className="empty-icon">
                        <FiPackage size={32} />
                      </div>
                      <h3 className="empty-title">No products found</h3>
                      <p className="empty-sub">
                        Try adjusting your filters or search for something else.
                      </p>
                      {hasFilters && (
                        <button className="empty-reset-btn" onClick={handleClearFilters}>
                          Clear Filters
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {showPaginate && (
                  <div className="pagination-wrap">
                    <Pagination
                      activePage={currentPage}
                      itemsCountPerPage={resultPerPage}
                      totalItemsCount={productsCount}
                      onChange={(page) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      nextPageText="Next →"
                      prevPageText="← Prev"
                      firstPageText="« First"
                      lastPageText="Last »"
                      itemClass="page-item"
                      linkClass="page-link"
                      activeClass="pageItemActive"
                      activeLinkClass="pageLinkActive"
                    />
                  </div>
                )}
              </main>

            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;
