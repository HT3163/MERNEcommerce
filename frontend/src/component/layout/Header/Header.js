import React, { Fragment, useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import { logout } from '../../../actions/userAction';
import './Header.css';
import defaultAvatar from '../../../images/Profile.png';

// ── Icons ──────────────────────────────────────────────────────────────────────
import {
  FiSearch, FiShoppingBag, FiUser, FiMenu, FiX, FiChevronDown,
  FiHeart, FiBell, FiHome, FiPackage, FiInfo, FiMail,
  FiLogOut, FiSettings, FiShoppingCart, FiGrid, FiBarChart2,
  FiChevronRight, FiCheckCircle, FiAlertCircle, FiTruck,
} from 'react-icons/fi';

// ── Gradient palette — consistent per first letter ────────────────────────────
const GRADIENTS = [
  ['#f43f5e', '#fb923c'],
  ['#8b5cf6', '#6366f1'],
  ['#06b6d4', '#3b82f6'],
  ['#10b981', '#059669'],
  ['#f59e0b', '#ef4444'],
  ['#ec4899', '#8b5cf6'],
  ['#14b8a6', '#06b6d4'],
  ['#6366f1', '#8b5cf6'],
  ['#f97316', '#f59e0b'],
  ['#84cc16', '#10b981'],
];
const getGradient = (name = '') => GRADIENTS[(name.charCodeAt(0) || 0) % GRADIENTS.length];

// ── NavSmartAvatar ─────────────────────────────────────────────────────────────
// Shows the real avatar image; on error (or no URL) shows a gradient initial circle
const NavSmartAvatar = ({ src, name, size = 34, className = '', style = {} }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const initial = (name || '?').charAt(0).toUpperCase();
  const [from, to] = getGradient(name);

  // Reset error flag whenever the src changes (e.g. user updates profile)
  useEffect(() => { setImgFailed(false); }, [src]);

  const hasRealUrl = src && src !== defaultAvatar;

  if (hasRealUrl && !imgFailed) {
    return (
      <img
        src={src}
        alt={name || 'Profile'}
        className={className}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, ...style }}
        onError={() => setImgFailed(true)}
      />
    );
  }

  return (
    <div
      className={`nav-avatar-initial ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${from}, ${to})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize: size * 0.38,
        flexShrink: 0,
        userSelect: 'none',
        textShadow: '0 1px 3px rgba(0,0,0,0.25)',
        letterSpacing: '-0.01em',
        ...style,
      }}
    >
      {initial}
    </div>
  );
};

// ── Category data ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: 'Electronics',  emoji: '💻', href: '/products/electronics',  color: '#dbeafe' },
  { label: 'Clothing',     emoji: '👗', href: '/products/clothing',     color: '#fce7f3' },
  { label: 'Footwear',     emoji: '👟', href: '/products/footwear',     color: '#d1fae5' },
  { label: 'Books',        emoji: '📚', href: '/products/books',        color: '#fef3c7' },
  { label: 'Home & Living',emoji: '🛋️', href: '/products/home',        color: '#f3e8ff' },
  { label: 'Sports',       emoji: '⚽', href: '/products/sports',       color: '#ffedd5' },
  { label: 'Beauty',       emoji: '💄', href: '/products/beauty',       color: '#fce7f3' },
  { label: 'Toys',         emoji: '🧸', href: '/products/toys',         color: '#dbeafe' },
];

// ── Fake notifications (replace with real Redux data) ─────────────────────────
const MOCK_NOTIFICATIONS = [
  { id: 1, icon: FiTruck,        title: 'Order Shipped',         body: 'Your order #1023 is on the way!',     time: '2m ago',  unread: true  },
  { id: 2, icon: FiCheckCircle,  title: 'Order Delivered',       body: 'Order #1019 has been delivered.',     time: '1h ago',  unread: true  },
  { id: 3, icon: FiAlertCircle,  title: 'Payment Confirmed',     body: 'Payment for ₹2,499 was successful.',  time: '3h ago',  unread: false },
  { id: 4, icon: FiHeart,        title: 'Back in Stock',         body: 'An item in your wishlist is back!',   time: '1d ago',  unread: false },
];

// ── Nav links ─────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Home',     href: '/',        icon: FiHome    },
  { label: 'Products', href: '/products',icon: FiPackage },
  { label: 'About',    href: '/about',   icon: FiInfo    },
  { label: 'Contact',  href: '/contact', icon: FiMail    },
];

// ── Announcement bar messages ──────────────────────────────────────────────────
const TICKER_MSGS = [
  '🎉 Free shipping on orders over ₹999',
  '⚡ Flash Sale — Up to 60% off Electronics',
  '🛡️ 30-day easy returns',
  '💳 EMI available on all orders',
  '✨ New arrivals every Monday',
];


const Header = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const alert     = useAlert();

  const { isAuthenticated, user } = useSelector((s) => s.user);
  const { cartItems }             = useSelector((s) => s.cart) || { cartItems: [] };

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [scrolled,       setScrolled]       = useState(false);
  const [menuOpen,       setMenuOpen]       = useState(false);
  const [searchOpen,     setSearchOpen]     = useState(false);
  const [query,          setQuery]          = useState('');
  const [notifOpen,      setNotifOpen]      = useState(false);
  const [profileOpen,    setProfileOpen]    = useState(false);
  const [notifications,  setNotifications]  = useState(MOCK_NOTIFICATIONS);
  const [wishlistPop,    setWishlistPop]    = useState(false);
  const [catOpen,        setCatOpen]        = useState(false);   // mobile categories

  // ── Refs for outside-click close ─────────────────────────────────────────────
  const notifRef   = useRef(null);
  const profileRef = useRef(null);
  const searchRef  = useRef(null);

  // ── Computed values ───────────────────────────────────────────────────────────
  const cartCount      = cartItems?.reduce((a, i) => a + i.quantity, 0) || 0;
  const unreadCount    = notifications.filter((n) => n.unread).length;
  const wishlistCount  = 0; // swap with real selector when wishlist redux exists

  // ── Scroll listener ───────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 55);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Resize → close drawer ────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 968) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Lock body scroll when mobile drawer open ──────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // ── Outside-click handler ─────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (searchRef.current  && !searchRef.current.contains(e.target))  setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────────
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products/${query.trim()}`);
      setSearchOpen(false);
      setQuery('');
    }
  };

  const handleLogout = useCallback(() => {
    dispatch(logout());
    alert.success('Logged out successfully');
    setProfileOpen(false);
    setMenuOpen(false);
  }, [dispatch, alert]);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  const handleWishlistClick = () => {
    setWishlistPop(true);
    setTimeout(() => setWishlistPop(false), 600);
    navigate('/products'); // swap to /wishlist when route exists
  };

  // ── Ticker string ──────────────────────────────────────────────────────────────
  const tickerText = TICKER_MSGS.join('   ·   ');

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <Fragment>

      {/* ════════════════════════════════════════
          ANNOUNCEMENT BAR
      ════════════════════════════════════════ */}
      <div className="nav-announce-bar">
        <div className="nav-ticker-track">
          <span>{tickerText}&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;</span>
          <span aria-hidden="true">{tickerText}</span>
        </div>
      </div>

      {/* ════════════════════════════════════════
          MAIN HEADER
      ════════════════════════════════════════ */}
      <header className={`nav-header${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">

          {/* ── Logo ─────────────────────────────── */}
          <Link to="/" className="nav-logo" aria-label="Home">
            <div className="nav-logo-icon">L</div>
            <span className="nav-logo-text">LUXE</span>
            <span className="nav-logo-dot" />
          </Link>

          {/* ── Desktop nav ──────────────────────── */}
          <nav className="nav-links" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} to={link.href} className="nav-link-item">
                {link.label}
              </Link>
            ))}

            {/* Categories mega trigger */}
            <div className="nav-mega-trigger" role="navigation" aria-label="Categories">
              <button className="nav-link-item nav-cat-btn" aria-haspopup="true">
                Categories
                <FiChevronDown className="nav-cat-chevron" size={13} />
              </button>

              {/* Mega menu */}
              <div className="nav-mega-menu" role="menu">
                <div className="nav-mega-header">
                  <span>Shop by Category</span>
                  <Link to="/products" className="nav-mega-viewall">
                    View all <FiChevronRight size={12} />
                  </Link>
                </div>
                <div className="nav-mega-grid">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.label}
                      to={cat.href}
                      className="nav-mega-cat-item"
                      role="menuitem"
                      style={{ '--cat-color': cat.color }}
                    >
                      <div className="nav-mega-cat-emoji">{cat.emoji}</div>
                      <span className="nav-mega-cat-label">{cat.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* ── Right actions ────────────────────── */}
          <div className="nav-actions">

            {/* Search */}
            <div ref={searchRef} style={{ position: 'relative' }}>
              <button
                className={`nav-icon-btn${searchOpen ? ' active-btn' : ''}`}
                onClick={() => setSearchOpen((s) => !s)}
                aria-label="Search"
                aria-expanded={searchOpen}
              >
                <FiSearch size={18} />
              </button>

              {/* Floating search box */}
              <div className={`nav-search-float${searchOpen ? ' open' : ''}`}>
                <form onSubmit={handleSearch} className="nav-search-form">
                  <FiSearch size={16} className="nav-search-icon-inner" />
                  <input
                    autoFocus={searchOpen}
                    type="text"
                    placeholder="Search products, brands…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="nav-search-input"
                    aria-label="Search query"
                  />
                  {query && (
                    <button
                      type="button"
                      className="nav-search-clear"
                      onClick={() => setQuery('')}
                      aria-label="Clear search"
                    >
                      <FiX size={14} />
                    </button>
                  )}
                  <button type="submit" className="nav-search-submit">
                    Go
                  </button>
                </form>
              </div>
            </div>

            {/* Wishlist */}
            <button
              className={`nav-icon-btn${wishlistPop ? ' heart-pop' : ''}`}
              onClick={handleWishlistClick}
              aria-label="Wishlist"
            >
              <FiHeart size={18} />
              {wishlistCount > 0 && (
                <span className="nav-badge nav-badge-red">{wishlistCount}</span>
              )}
            </button>

            {/* Notifications */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                className={`nav-icon-btn${notifOpen ? ' active-btn' : ''}`}
                onClick={() => { setNotifOpen((s) => !s); setProfileOpen(false); }}
                aria-label="Notifications"
                aria-expanded={notifOpen}
                aria-haspopup="true"
              >
                <FiBell size={18} />
                {unreadCount > 0 && (
                  <span className="nav-badge">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications panel */}
              <div className={`nav-dropdown nav-notif-panel${notifOpen ? ' open' : ''}`} role="dialog" aria-label="Notifications">
                <div className="nav-notif-head">
                  <span className="nav-notif-title">Notifications</span>
                  {unreadCount > 0 && (
                    <button className="nav-notif-mark-read" onClick={markAllRead}>
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="nav-notif-list">
                  {notifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <div
                        key={n.id}
                        className={`nav-notif-item${n.unread ? ' unread' : ''}`}
                        onClick={() => setNotifications((prev) =>
                          prev.map((x) => x.id === n.id ? { ...x, unread: false } : x)
                        )}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="nav-notif-icon-wrap">
                          <Icon size={14} />
                        </div>
                        <div className="nav-notif-content">
                          <p className="nav-notif-item-title">{n.title}</p>
                          <p className="nav-notif-item-body">{n.body}</p>
                          <p className="nav-notif-time">{n.time}</p>
                        </div>
                        {n.unread && <span className="nav-notif-dot" />}
                      </div>
                    );
                  })}
                </div>
                <div className="nav-notif-footer">
                  <Link to="/orders" onClick={() => setNotifOpen(false)} className="nav-notif-footer-link">
                    View all activity
                  </Link>
                </div>
              </div>
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="nav-icon-btn nav-cart-btn"
              aria-label={`Cart, ${cartCount} items`}
            >
              <FiShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="nav-badge">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Profile / Login */}
            {isAuthenticated ? (
              <div ref={profileRef} style={{ position: 'relative' }}>
                <button
                  className="nav-avatar-btn"
                  onClick={() => { setProfileOpen((s) => !s); setNotifOpen(false); }}
                  aria-label="User menu"
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                >
                  <NavSmartAvatar
                    src={user?.avatar?.url}
                    name={user?.name}
                    size={34}
                    className="nav-avatar"
                  />
                  <span className="nav-avatar-chevron"><FiChevronDown size={11} /></span>
                </button>

                {/* Profile dropdown */}
                <div className={`nav-dropdown nav-profile-panel${profileOpen ? ' open' : ''}`} role="menu">
                  {/* User info header */}
                  <div className="nav-profile-info">
                    <NavSmartAvatar
                      src={user?.avatar?.url}
                      name={user?.name}
                      size={38}
                      className="nav-profile-avatar"
                    />
                    <div>
                      <p className="nav-profile-name">{user?.name}</p>
                      <p className="nav-profile-email">{user?.email}</p>
                    </div>
                  </div>
                  <div className="nav-profile-divider" />

                  <Link to="/account" className="nav-profile-item" role="menuitem" onClick={() => setProfileOpen(false)}>
                    <FiUser size={15} /> My Profile
                  </Link>
                  <Link to="/orders" className="nav-profile-item" role="menuitem" onClick={() => setProfileOpen(false)}>
                    <FiPackage size={15} /> My Orders
                  </Link>
                  <Link to="/cart" className="nav-profile-item" role="menuitem" onClick={() => setProfileOpen(false)}>
                    <FiShoppingCart size={15} /> My Cart
                    {cartCount > 0 && <span className="nav-profile-cart-badge">{cartCount}</span>}
                  </Link>
                  <Link to="/me/update" className="nav-profile-item" role="menuitem" onClick={() => setProfileOpen(false)}>
                    <FiSettings size={15} /> Settings
                  </Link>

                  {user?.role === 'admin' && (
                    <Fragment>
                      <div className="nav-profile-divider" />
                      <Link to="/admin/dashboard" className="nav-profile-item nav-profile-admin" role="menuitem" onClick={() => setProfileOpen(false)}>
                        <FiBarChart2 size={15} /> Admin Dashboard
                      </Link>
                      <Link to="/admin/products" className="nav-profile-item nav-profile-admin" role="menuitem" onClick={() => setProfileOpen(false)}>
                        <FiGrid size={15} /> Manage Products
                      </Link>
                    </Fragment>
                  )}

                  <div className="nav-profile-divider" />
                  <button className="nav-profile-item danger" role="menuitem" onClick={handleLogout}>
                    <FiLogOut size={15} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="nav-login-btn" aria-label="Login or Register">
                <FiUser size={14} />
                Login
              </Link>
            )}

            {/* Mobile burger */}
            <button
              className="nav-icon-btn nav-burger"
              onClick={() => setMenuOpen((s) => !s)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <FiX size={21} /> : <FiMenu size={21} />}
            </button>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════
          MOBILE DRAWER BACKDROP
      ════════════════════════════════════════ */}
      {menuOpen && (
        <div
          className="nav-drawer-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ════════════════════════════════════════
          MOBILE DRAWER
      ════════════════════════════════════════ */}
      <aside
        className={`nav-drawer${menuOpen ? ' open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        {/* Drawer header */}
        <div className="nav-drawer-head">
          <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
            <div className="nav-logo-icon">L</div>
            <span className="nav-logo-text">LUXE</span>
            <span className="nav-logo-dot" />
          </Link>
          <button
            className="nav-icon-btn"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Mobile search */}
        <div className="nav-drawer-search">
          <form onSubmit={(e) => { handleSearch(e); setMenuOpen(false); }} className="nav-drawer-search-form">
            <FiSearch size={15} className="nav-drawer-search-icon" />
            <input
              type="text"
              placeholder="Search products…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="nav-drawer-search-input"
            />
          </form>
        </div>

        {/* Drawer links */}
        <nav className="nav-drawer-nav" aria-label="Mobile navigation links">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                to={link.href}
                className="nav-drawer-link"
                onClick={() => setMenuOpen(false)}
              >
                <span className="nav-drawer-link-left">
                  <Icon size={16} />
                  {link.label}
                </span>
                <FiChevronRight size={14} className="nav-drawer-chevron" />
              </Link>
            );
          })}

          {/* Mobile categories accordion */}
          <button
            className="nav-drawer-link nav-drawer-cat-toggle"
            onClick={() => setCatOpen((s) => !s)}
            aria-expanded={catOpen}
          >
            <span className="nav-drawer-link-left">
              <FiGrid size={16} />
              Categories
            </span>
            <FiChevronDown
              size={14}
              className="nav-drawer-chevron"
              style={{ transform: catOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
            />
          </button>

          <div className={`nav-drawer-cat-list${catOpen ? ' open' : ''}`}>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                to={cat.href}
                className="nav-drawer-cat-item"
                onClick={() => setMenuOpen(false)}
                style={{ '--cat-color': cat.color }}
              >
                <span className="nav-drawer-cat-emoji">{cat.emoji}</span>
                {cat.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Drawer action pills */}
        <div className="nav-drawer-pills">
          <Link to="/cart" className="nav-drawer-pill" onClick={() => setMenuOpen(false)} aria-label="Cart">
            <FiShoppingBag size={16} />
            Cart
            {cartCount > 0 && <span className="nav-drawer-pill-badge">{cartCount}</span>}
          </Link>
          <button className="nav-drawer-pill" onClick={() => { handleWishlistClick(); setMenuOpen(false); }} aria-label="Wishlist">
            <FiHeart size={16} />
            Wishlist
          </button>
          <button
            className="nav-drawer-pill"
            onClick={() => { setMenuOpen(false); navigate('/orders'); }}
            aria-label="Notifications"
          >
            <FiBell size={16} />
            Alerts
            {unreadCount > 0 && <span className="nav-drawer-pill-badge">{unreadCount}</span>}
          </button>
        </div>

        {/* Drawer footer: auth */}
        <div className="nav-drawer-footer">
          {isAuthenticated ? (
            <Fragment>
              <div className="nav-drawer-user-info">
                <NavSmartAvatar
                  src={user?.avatar?.url}
                  name={user?.name}
                  size={36}
                  className="nav-drawer-avatar"
                />
                <div>
                  <p className="nav-drawer-user-name">{user?.name}</p>
                  <p className="nav-drawer-user-email">{user?.email}</p>
                </div>
              </div>
              <div className="nav-drawer-footer-links">
                <Link to="/account"  className="nav-drawer-footer-link" onClick={() => setMenuOpen(false)}><FiUser size={14} /> Profile</Link>
                <Link to="/orders"   className="nav-drawer-footer-link" onClick={() => setMenuOpen(false)}><FiPackage size={14} /> Orders</Link>
                <Link to="/me/update" className="nav-drawer-footer-link" onClick={() => setMenuOpen(false)}><FiSettings size={14} /> Settings</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" className="nav-drawer-footer-link nav-drawer-admin-link" onClick={() => setMenuOpen(false)}><FiBarChart2 size={14} /> Dashboard</Link>
                )}
              </div>
              <button className="nav-drawer-logout-btn" onClick={handleLogout}>
                <FiLogOut size={15} /> Logout
              </button>
            </Fragment>
          ) : (
            <Link
              to="/login"
              className="nav-drawer-login-btn"
              onClick={() => setMenuOpen(false)}
            >
              <FiUser size={15} />
              Login / Register
            </Link>
          )}
        </div>
      </aside>

      {/* Spacer so content doesn't hide behind fixed header + announce bar */}
      <div className="nav-spacer" />

    </Fragment>
  );
};

export default Header;
