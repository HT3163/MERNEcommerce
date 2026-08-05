import React, { Fragment, useEffect, useRef, useState } from "react";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors as clearProductErrors,
  getProductDetails,
  newReview,
} from "../../actions/productAction";
import { clearErrors as clearOrderErrors, myOrders } from "../../actions/orderAction";
import ReviewCard from "./ReviewCard.js";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import { addItemsToCart } from "../../actions/cartAction";
import { Rating } from "@material-ui/lab";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";
import { Link, useParams } from "react-router-dom";
import {
  FiShoppingBag, FiHeart, FiShare2, FiStar,
  FiTruck, FiRotateCcw, FiShield, FiPackage,
  FiChevronRight, FiX, FiCheck, FiMinus, FiPlus,
  FiInstagram, FiTwitter, FiFacebook,
} from "react-icons/fi";

/* ─── helpers ─────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 0,
  }).format(n);

const SHIPPING_FEATURES = [
  { icon: FiTruck,     title: "Free Shipping",   sub: "On all orders over $50" },
  { icon: FiRotateCcw, title: "Easy Returns",    sub: "30-day return policy"   },
  { icon: FiShield,    title: "Secure Checkout", sub: "SSL encrypted payment"  },
  { icon: FiPackage,   title: "Fast Delivery",   sub: "2–5 business days"      },
];

const buildRatingDist = (reviews = []) => {
  const dist = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    const i = Math.round(r.rating) - 1;
    if (i >= 0 && i <= 4) dist[i]++;
  });
  return dist;
};

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
const ProductDetails = () => {
  const params   = useParams();
  const dispatch = useDispatch();
  const alert    = useAlert();

  const { product, loading, error }     = useSelector((s) => s.productDetails);
  const { isAuthenticated }             = useSelector((s) => s.user);
  const { success, error: reviewError } = useSelector((s) => s.newReview);
  const {
    orders = [], loading: ordersLoading, hasFetched, error: ordersError,
  } = useSelector((s) => s.myOrders);

  const [activeImg,  setActiveImg]  = useState(0);
  const [zoomed,     setZoomed]     = useState(false);
  const [zoomPos,    setZoomPos]    = useState({ x: 50, y: 50 });
  const [quantity,   setQuantity]   = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab,  setActiveTab]  = useState("description");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rating,     setRating]     = useState(0);
  const [comment,    setComment]    = useState("");
  const imgRef = useRef(null);

  const hasPurchased = orders.some((o) =>
    o.orderItems?.some((item) => {
      const pid = typeof item.product === "string" ? item.product : item.product?._id;
      return pid === params.id;
    })
  );
  const reviewDisabled = ordersLoading || (isAuthenticated && !hasFetched && !ordersLoading) || !hasPurchased;

  useEffect(() => {
    if (error)       { alert.error(error);       dispatch(clearProductErrors()); }
    if (reviewError) { alert.error(reviewError); dispatch(clearProductErrors()); }
    if (ordersError) { alert.error(ordersError); dispatch(clearOrderErrors());   }
    if (success)     { alert.success("Review submitted!"); dispatch({ type: NEW_REVIEW_RESET }); }
    if (isAuthenticated) dispatch(myOrders());
    dispatch(getProductDetails(params.id));
  }, [dispatch, params.id, error, reviewError, ordersError, success, isAuthenticated, alert]);

  useEffect(() => { setActiveImg(0); }, [product._id]);

  const handleZoomMove = (e) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    setZoomPos({ x: ((e.clientX - left) / width) * 100, y: ((e.clientY - top) / height) * 100 });
  };

  const inc = () => { if (quantity < (product.Stock || 1)) setQuantity((q) => q + 1); };
  const dec = () => { if (quantity > 1) setQuantity((q) => q - 1); };

  const addToCart = () => { dispatch(addItemsToCart(params.id, quantity)); alert.success("Added to cart!"); };

  const submitReview = () => {
    const form = new FormData();
    form.set("rating", rating); form.set("comment", comment); form.set("productId", params.id);
    dispatch(newReview(form));
    setDialogOpen(false); setRating(0); setComment("");
  };

  if (loading) return <Loader />;

  const images     = product.images  || [];
  const reviews    = product.reviews || [];
  const ratingDist = buildRatingDist(reviews);
  const totalRev   = reviews.length || 1;
  const inStock    = product.Stock > 0;

  return (
    <Fragment>
      <MetaData title={`${product.name || "Product"} — LUXE`} />

      <div className="min-h-screen" style={{ background: "#fafafa", fontFamily: "'Inter', sans-serif" }}>

        {/* ── Breadcrumb ── */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-6 pb-2">
          <nav className="flex items-center flex-wrap text-xs text-gray-400" style={{ gap: "0.2rem" }}>
            <Link to="/"        style={{ textDecoration: "none", color: "inherit" }} className="hover:text-gray-700 transition-colors">Home</Link>
            <FiChevronRight size={12} />
            <Link to="/products" style={{ textDecoration: "none", color: "inherit" }} className="hover:text-gray-700 transition-colors">Products</Link>
            <FiChevronRight size={12} />
            {product.category && (
              <>
                <Link to={`/products/${product.category}`} style={{ textDecoration: "none", color: "inherit" }}
                      className="hover:text-gray-700 transition-colors capitalize">{product.category}</Link>
                <FiChevronRight size={12} />
              </>
            )}
            <span className="text-gray-600 truncate max-w-xs">{product.name}</span>
          </nav>
        </div>

        {/* ── Two-column layout ── */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* LEFT — gallery */}
          <div className="flex flex-col gap-4 pd-fade-up">
            {/* Main image */}
            <div
              ref={imgRef}
              className={`pd-gallery-main${zoomed ? " zoomed" : ""}`}
              style={{ "--zoom-x": `${zoomPos.x}%`, "--zoom-y": `${zoomPos.y}%` }}
              onClick={() => setZoomed((z) => !z)}
              onMouseMove={handleZoomMove}
              onMouseLeave={() => setZoomed(false)}
            >
              {images.length > 0 ? (
                <img src={images[activeImg]?.url} alt={product.name} draggable="false" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300"
                     style={{ fontSize: "0.85rem" }}>No image</div>
              )}
              {!zoomed && images.length > 0 && (
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ background: "rgba(0,0,0,0.5)", color: "#fff", backdropFilter: "blur(4px)" }}>
                  🔍 Click to zoom
                </span>
              )}
              {images.length > 1 && (
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ background: "rgba(255,255,255,0.88)", color: "#374151" }}>
                  {activeImg + 1} / {images.length}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="pd-thumb-scroll">
                {images.map((img, i) => (
                  <img key={i} src={img.url} alt={`View ${i + 1}`}
                       className={`pd-thumb${activeImg === i ? " active" : ""}`}
                       onClick={() => setActiveImg(i)} />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — sticky info panel */}
          <div className="pd-sticky pd-fade-up pd-delay-1 flex flex-col gap-6">

            {/* Category + stock */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              {product.category && (
                <span className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: "#6366f1" }}>{product.category}</span>
              )}
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${inStock ? "pd-in-stock" : "pd-out-stock"}`}>
                {inStock ? `✓ In Stock (${product.Stock})` : "✗ Out of Stock"}
              </span>
            </div>

            {/* Name + SKU */}
            <div>
              <h1 className="text-gray-900 leading-tight mb-1"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif",
                           fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700 }}>
                {product.name}
              </h1>
              <p className="text-xs text-gray-400" style={{ letterSpacing: "0.04em" }}>
                SKU: {product._id?.slice(-8).toUpperCase()}
              </p>
            </div>

            {/* Rating row */}
            <div className="flex items-center gap-3">
              <Rating value={product.ratings || 0} readOnly precision={0.5} size="small" />
              <span className="text-sm font-semibold text-gray-800">{(product.ratings || 0).toFixed(1)}</span>
              <span className="text-sm text-gray-400">({product.numOfReviews || 0} reviews)</span>
              <button onClick={() => document.getElementById("pd-reviews-section")?.scrollIntoView({ behavior: "smooth" })}
                      className="text-xs font-semibold underline text-indigo-500 hover:text-indigo-700 transition-colors ml-auto"
                      style={{ background: "none", border: "none", cursor: "pointer" }}>
                Read all
              </button>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-black text-gray-900"
                    style={{ fontFamily: "'Inter', sans-serif",
                             fontSize: "clamp(1.8rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>
                {fmt(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-gray-400 line-through">{fmt(product.originalPrice)}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: "#fef2f2", color: "#ef4444" }}>
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            <hr style={{ borderColor: "#f3f4f6" }} />

            {/* Qty + Add to cart + Wishlist */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border"
                   style={{ borderColor: "#e5e7eb", background: "#fff" }}>
                <button className="pd-qty-btn" onClick={dec} disabled={quantity <= 1}>
                  <FiMinus size={14} />
                </button>
                <span className="w-8 text-center font-semibold text-gray-900 text-sm">{quantity}</span>
                <button className="pd-qty-btn" onClick={inc} disabled={quantity >= product.Stock}>
                  <FiPlus size={14} />
                </button>
              </div>

              <button className="pd-cart-btn" onClick={addToCart} disabled={!inStock}>
                <FiShoppingBag size={16} />
                {inStock ? "Add to Cart" : "Out of Stock"}
              </button>

              <button className={`pd-wish-btn${wishlisted ? " wishlisted" : ""}`}
                      onClick={() => setWishlisted((w) => !w)} aria-label="Wishlist">
                <FiHeart size={18} fill={wishlisted ? "#ef4444" : "none"} />
              </button>
            </div>

            {/* Trust micro-badges */}
            <div className="grid grid-cols-2 gap-2">
              {SHIPPING_FEATURES.map(({ icon: Icon, title, sub }) => (
                <div key={title} className="pd-ship-badge">
                  <Icon size={15} style={{ color: "#6366f1", flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{title}</p>
                    <p className="text-xs text-gray-400">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Share */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Share</span>
              {[FiInstagram, FiTwitter, FiFacebook, FiShare2].map((Icon, i) => (
                <button key={i} className="pd-share-btn"><Icon size={14} /></button>
              ))}
            </div>

            {/* Review CTA */}
            <div className="rounded-xl p-4 flex flex-col gap-2"
                 style={{ background: "#f8f9ff", border: "1px solid #e8eaff" }}>
              <p className="text-sm font-semibold text-gray-800">Bought this product?</p>
              <p className="text-xs text-gray-500">
                {!isAuthenticated
                  ? "Login to leave a review."
                  : hasFetched && !ordersLoading && !hasPurchased
                  ? "Only verified buyers can submit a review."
                  : "Share your experience with others."}
              </p>
              {!isAuthenticated ? (
                <Link to={`/login?redirect=/product/${params.id}`}
                      className="inline-flex items-center gap-1 mt-1 text-xs font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors"
                      style={{ textDecoration: "none" }}>
                  Login to Review <FiChevronRight size={12} />
                </Link>
              ) : (
                <button onClick={() => setDialogOpen(true)} disabled={reviewDisabled}
                        className="mt-1 self-start px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-white"
                        style={{ background: reviewDisabled ? "#c4c4c4" : "#6366f1", border: "none",
                                 cursor: reviewDisabled ? "not-allowed" : "pointer" }}>
                  Write a Review
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <TabsSection
          product={product} reviews={reviews} ratingDist={ratingDist} totalRev={totalRev}
          activeTab={activeTab} setActiveTab={setActiveTab}
        />

        {/* ── Related products ── */}
        <RelatedSection category={product.category} currentId={product._id} />
      </div>

      {/* ── Review dialog ── */}
      {dialogOpen && (
        <ReviewDialog
          rating={rating} setRating={setRating}
          comment={comment} setComment={setComment}
          onClose={() => setDialogOpen(false)}
          onSubmit={submitReview}
        />
      )}
    </Fragment>
  );
};

/* ═══════════════════════════════════════════════════════
   TABS SECTION
   ═══════════════════════════════════════════════════════ */
const TabsSection = ({ product, reviews, ratingDist, totalRev, activeTab, setActiveTab }) => {
  const TABS = [
    { id: "description", label: "Description"          },
    { id: "shipping",    label: "Shipping & Returns"   },
    { id: "reviews",     label: `Reviews (${reviews.length})` },
  ];

  return (
    <section id="pd-reviews-section" className="max-w-7xl mx-auto px-5 sm:px-8 py-12"
             style={{ borderTop: "1px solid #f0f0f0" }}>

      {/* Tab buttons */}
      <div className="flex gap-8 border-b mb-10 overflow-x-auto" style={{ borderColor: "#e5e7eb" }}>
        {TABS.map((t) => (
          <button key={t.id}
                  className={`pd-tab-btn${activeTab === t.id ? " active" : ""}`}
                  onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Description ── */}
      {activeTab === "description" && (
        <div className="max-w-3xl pd-fade-up">
          <p className="text-gray-600" style={{ fontSize: "0.95rem", lineHeight: 1.85 }}>
            {product.description || "No description available for this product."}
          </p>
        </div>
      )}

      {/* ── Shipping ── */}
      {activeTab === "shipping" && (
        <div className="max-w-3xl grid sm:grid-cols-2 gap-4 pd-fade-up">
          {SHIPPING_FEATURES.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex gap-4 p-5 rounded-xl"
                 style={{ background: "#fff", border: "1px solid #f0f0f0" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                   style={{ background: "#f0f0ff" }}>
                <Icon size={18} style={{ color: "#6366f1" }} />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm mb-0.5">{title}</p>
                <p className="text-xs text-gray-500" style={{ lineHeight: 1.6 }}>{sub}</p>
              </div>
            </div>
          ))}
          <div className="sm:col-span-2 p-5 rounded-xl text-sm text-gray-500"
               style={{ background: "#fffbeb", border: "1px solid #fde68a", lineHeight: 1.7 }}>
            <strong className="text-gray-700">Returns Policy: </strong>
            We offer a 30-day hassle-free return policy. Items must be unused and in original packaging.
          </div>
        </div>
      )}

      {/* ── Reviews ── */}
      {activeTab === "reviews" && (
        <div className="pd-fade-up">
          {reviews.length === 0 ? (
            <div className="text-center py-16">
              <FiStar size={36} style={{ color: "#d1d5db", margin: "0 auto 1rem" }} />
              <p className="text-gray-400 font-medium">No reviews yet. Be the first to review this product.</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Aggregate */}
              <div className="flex flex-col gap-4">
                <div className="text-center p-6 rounded-2xl"
                     style={{ background: "#fff", border: "1px solid #f0f0f0" }}>
                  <span className="block font-black text-gray-900"
                        style={{ fontSize: "3.5rem", lineHeight: 1 }}>
                    {(product.ratings || 0).toFixed(1)}
                  </span>
                  <Rating value={product.ratings || 0} readOnly precision={0.5} size="small" />
                  <p className="text-xs text-gray-400 mt-1">
                    Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Distribution bars */}
                <div className="flex flex-col gap-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = ratingDist[star - 1];
                    const pct   = Math.round((count / totalRev) * 100);
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-500 w-3">{star}</span>
                        <FiStar size={11} style={{ color: "#fbbf24", flexShrink: 0 }} />
                        <div className="pd-bar-track">
                          <div className="pd-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-400 w-7 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review cards */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

/* ═══════════════════════════════════════════════════════
   REVIEW DIALOG
   ═══════════════════════════════════════════════════════ */
const ReviewDialog = ({ rating, setRating, comment, setComment, onClose, onSubmit }) => (
  <div className="pd-dialog-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="pd-dialog">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-gray-900"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem" }}>
          Write a Review
        </h3>
        <button onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
                style={{ border: "none", background: "none", cursor: "pointer" }}>
          <FiX size={18} />
        </button>
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Your Rating</p>
        <Rating value={Number(rating)} onChange={(_, v) => setRating(v)} size="large" />
      </div>

      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Your Review</p>
        <textarea className="pd-textarea" rows={4}
                  placeholder="Tell others what you think about this product…"
                  value={comment} onChange={(e) => setComment(e.target.value)} />
      </div>

      <div className="flex gap-3 justify-end">
        <button onClick={onClose}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                style={{ border: "1.5px solid #e5e7eb", background: "none", cursor: "pointer" }}>
          Cancel
        </button>
        <button onClick={onSubmit} disabled={!rating || !comment.trim()}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-white"
                style={{ background: !rating || !comment.trim() ? "#c4c4c4" : "#0a0a0a",
                         border: "none", cursor: !rating || !comment.trim() ? "not-allowed" : "pointer" }}>
          Submit Review
        </button>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════
   RELATED PRODUCTS
   ═══════════════════════════════════════════════════════ */
const RelatedSection = ({ category, currentId }) => {
  const { products = [] } = useSelector((s) => s.products);
  const related = products.filter((p) => p.category === category && p._id !== currentId).slice(0, 4);
  if (!related.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-8 py-12" style={{ borderTop: "1px solid #f0f0f0" }}>
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#6366f1" }}>
            You May Also Like
          </p>
          <h2 style={{ fontFamily: "'Playfair Display', serif",
                       fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 700, color: "#0a0a0a" }}>
            Related Products
          </h2>
        </div>
        {category && (
          <Link to={`/products/${category}`}
                className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1"
                style={{ textDecoration: "none" }}>
            View all <FiChevronRight size={13} />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {related.map((p) => (
          <Link key={p._id} to={`/product/${p._id}`} className="pd-related-card">
            <div className="pd-related-img-wrap">
              <img src={p.images?.[0]?.url || "https://via.placeholder.com/400"} alt={p.name} loading="lazy" />
            </div>
            <div className="p-3">
              {p.category && (
                <p className="text-xs font-semibold uppercase tracking-widest mb-0.5"
                   style={{ color: "#6366f1" }}>{p.category}</p>
              )}
              <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 mb-1.5">{p.name}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">${p.price?.toLocaleString()}</span>
                <Rating value={p.ratings || 0} readOnly precision={0.5} size="small" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductDetails;
