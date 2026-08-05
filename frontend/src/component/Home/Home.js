import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CgArrowLongRight } from 'react-icons/cg';
import { FiShoppingBag, FiArrowRight, FiZap, FiStar } from 'react-icons/fi';
import './Home.css';
import ProductCard from './ProductCard.js';
import MetaData from '../layout/MetaData.js';
import { getProduct } from '../../actions/productAction';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../layout/Loader/Loader.js';
import { useAlert } from 'react-alert';

/* ─── Category data ───────────────────────────────── */
const CATEGORIES = [
  {
    name: 'Electronics',
    sub: 'Smart Tech',
    img: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80',
    slug: 'Electronics',
  },
  {
    name: 'Fashion',
    sub: 'New Season',
    img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80',
    slug: 'Fashion',
  },
  {
    name: 'Home & Living',
    sub: 'Curated Spaces',
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
    slug: 'Home',
  },
  {
    name: 'Sports',
    sub: 'Performance',
    img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80',
    slug: 'Sports',
  },
];

/* ─── Trust badges ────────────────────────────────── */
const BADGES = [
  { icon: '🚚', label: 'Free Shipping',   sub: 'On orders over $50' },
  { icon: '↩️', label: 'Easy Returns',    sub: '30-day return policy' },
  { icon: '🔒', label: 'Secure Payment',  sub: 'SSL encrypted checkout' },
  { icon: '⭐', label: '5-Star Support',  sub: '24/7 customer service' },
];

/* ─── Ticker messages ─────────────────────────────── */
const TICKER = [
  '✦ Free shipping on orders over $50',
  '✦ New arrivals every week',
  '✦ Up to 40% off on selected items',
  '✦ Secure checkout guaranteed',
  '✦ 30-day hassle-free returns',
  '✦ Premium quality, unbeatable prices',
];

/* ═══════════════════════════════════════════════════
   HOME COMPONENT
   ═══════════════════════════════════════════════════ */
const Home = () => {
  const alert    = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) { alert.error(error); return; }
    dispatch(getProduct());
  }, [dispatch, error, alert]);

  if (loading) return <Loader />;

  return (
    <Fragment>
      <MetaData title="LUXE — Premium eCommerce" />

      {/* ════════════════════════════════════════════
          ANNOUNCEMENT TICKER
          ════════════════════════════════════════════ */}
      <div className="ticker-bar">
        <div className="marquee-track">
          {[...TICKER, ...TICKER].map((msg, i) => (
            <span key={i} className="ticker-item">{msg}</span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════
          HERO — CENTERED
          ════════════════════════════════════════════ */}
      <section className="hero-section" id="hero">
        {/* Background */}
        <div className="hero-bg animate-fade-in" />
        {/* Overlay */}
        <div className="hero-overlay" />

        {/* Floating badge top-right */}
        <div className="hero-badge animate-slide-left delay-500">
          <span className="hero-badge-top">New<br />Season</span>
          <span className="hero-badge-pct">25%</span>
          <span className="hero-badge-off">OFF</span>
        </div>

        {/* Centered content */}
        <div className="hero-content">
          {/* Pill label */}
          <div className="hero-pill animate-fade-up">
            <FiStar size={11} />
            New Collection 2025
          </div>

          <h1 className="hero-title animate-fade-up delay-100">
            Elevate Your<br />
            <em className="hero-title-em">Everyday Style</em>
          </h1>

          <p className="hero-sub animate-fade-up delay-200">
            Discover premium products crafted for those who demand the finest.
            Quality that speaks before you do.
          </p>

          <div className="hero-actions animate-fade-up delay-300">
            <Link to="/products" className="btn-primary btn-lg">
              <FiShoppingBag size={18} />
              Shop Now
            </Link>
            <a href="#categories" className="btn-outline btn-lg">
              Explore Categories
              <FiArrowRight size={18} />
            </a>
          </div>

          {/* Stats row */}
          <div className="hero-stats animate-fade-up delay-400">
            <div className="hero-stat">
              <span className="hero-stat-num">10k+</span>
              <span className="hero-stat-lbl">Products</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">50k+</span>
              <span className="hero-stat-lbl">Customers</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">4.9★</span>
              <span className="hero-stat-lbl">Rating</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator animate-fade-in delay-500">
          <span className="scroll-label">Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ════════════════════════════════════════════
          TRUST BADGES
          ════════════════════════════════════════════ */}
      <section className="badges-section">
        <div className="badges-inner">
          {BADGES.map((b, i) => (
            <div key={i} className="badge-item">
              <span className="badge-icon">{b.icon}</span>
              <div>
                <p className="badge-label">{b.label}</p>
                <p className="badge-sub">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CATEGORIES — CENTERED HEADER
          ════════════════════════════════════════════ */}
      <section id="categories" className="page-section">
        <div className="section-header centered animate-fade-up">
          <p className="section-label">Shop by Category</p>
          <h2 className="section-title">
            Find What You <em>Love</em>
          </h2>
          <p className="section-sub">
            Browse our curated collections across every lifestyle.
          </p>
        </div>

        <div className="cat-grid">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={i}
              to={`/products/${cat.slug}`}
              className={`category-card animate-fade-up delay-${(i + 1) * 100}`}
              style={{ textDecoration: 'none' }}
            >
              <img src={cat.img} alt={cat.name} loading="lazy" />
              <div className="cat-overlay" />
              <div className="cat-info">
                <p className="cat-sub">{cat.sub}</p>
                <p className="cat-name">{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="section-cta animate-fade-up">
          <Link to="/products" className="link-cta">
            View All Categories <CgArrowLongRight size={20} />
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FEATURED PRODUCTS — CENTERED HEADER
          ════════════════════════════════════════════ */}
      <div className="products-bg">
        <section id="container" className="page-section">
          <div className="section-header centered animate-fade-up">
            <p className="section-label">Handpicked for You</p>
            <h2 className="section-title">
              Featured <em>Products</em>
            </h2>
            <p className="section-sub">
              Our most loved items — quality you can feel, prices you'll appreciate.
            </p>
          </div>

          {/* Product grid */}
          <div className="product-grid">
            {products && products.length > 0 ? (
              products.slice(0, 8).map((product) => (
                <ProductCard key={product._id} Product={product} />
              ))
            ) : (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton" style={{ height: 280 }} />
                  <div className="skeleton-body">
                    <div className="skeleton" style={{ height: 12, width: '33%' }} />
                    <div className="skeleton" style={{ height: 16, width: '75%' }} />
                    <div className="skeleton" style={{ height: 12, width: '50%' }} />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="section-cta animate-fade-up">
            <Link to="/products" className="btn-primary">
              View All Products
              <FiArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>

      {/* ════════════════════════════════════════════
          SALE BANNER — CENTERED
          ════════════════════════════════════════════ */}
      <section className="sale-banner">
        <div className="sale-inner">
          {/* Left copy */}
          <div className="sale-copy">
            <div className="sale-tag">
              <FiZap size={13} style={{ color: '#a5b4fc' }} />
              <span>Limited Time Offer</span>
            </div>
            <h2 className="sale-title">
              Up to <span className="sale-accent">40% Off</span>
              <br />
              <em>This Season</em>
            </h2>
            <p className="sale-desc">
              Don't miss out on our biggest sale of the year. Premium products
              at prices you'll love.
            </p>
            <div className="sale-actions">
              <Link to="/products" className="btn-primary" style={{ background: '#fff', color: '#0a0a0a' }}>
                <FiShoppingBag size={16} />
                Shop the Sale
              </Link>
              <Link to="/products" className="btn-outline">
                See All Deals
              </Link>
            </div>
          </div>

          {/* Right — countdown */}
          <div className="sale-countdown-wrap">
            <SaleCountdown />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          NEWSLETTER — CENTERED
          ════════════════════════════════════════════ */}
      <section className="newsletter-section">
        <div className="newsletter-inner animate-fade-up">
          <p className="section-label">Stay in the Loop</p>
          <h2 className="section-title mb-3">
            Get Exclusive <em>Deals</em>
          </h2>
          <p className="newsletter-sub">
            Subscribe to our newsletter and be the first to know about new arrivals,
            exclusive offers, and style tips.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email address"
              className="newsletter-input"
            />
            <button type="submit" className="btn-primary">
              Subscribe
            </button>
          </form>
          <p className="newsletter-note">No spam. Unsubscribe at any time.</p>
        </div>
      </section>
    </Fragment>
  );
};

/* ─── Sale Countdown Widget ───────────────────────── */
const SaleCountdown = () => {
  const [time, setTime] = useState({ d: 2, h: 18, m: 45, s: 22 });

  useEffect(() => {
    const id = setInterval(() => {
      setTime((prev) => {
        let { d, h, m, s } = prev;
        s -= 1;
        if (s < 0) { s = 59; m -= 1; }
        if (m < 0) { m = 59; h -= 1; }
        if (h < 0) { h = 23; d = Math.max(0, d - 1); }
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');
  const units = [
    { label: 'Days',    value: pad(time.d) },
    { label: 'Hours',   value: pad(time.h) },
    { label: 'Minutes', value: pad(time.m) },
    { label: 'Seconds', value: pad(time.s) },
  ];

  return (
    <div className="countdown">
      {units.map(({ label, value }, i) => (
        <div key={i} className="countdown-box">
          <span className="countdown-num">{value}</span>
          <span className="countdown-lbl">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default Home;
