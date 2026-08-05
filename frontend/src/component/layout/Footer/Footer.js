import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiFacebook,
  FiArrowRight,
  FiMapPin,
  FiMail,
  FiPhone,
} from 'react-icons/fi';

const LINKS = {
  Shop: [
    { label: 'New Arrivals', href: '/products' },
    { label: 'Best Sellers', href: '/products' },
    { label: 'Sale',         href: '/products' },
    { label: 'All Products', href: '/products' },
  ],
  Company: [
    { label: 'About Us',   href: '/about' },
    { label: 'Contact',    href: '/contact' },
    { label: 'Careers',    href: '#' },
    { label: 'Press',      href: '#' },
  ],
  Support: [
    { label: 'FAQ',             href: '#' },
    { label: 'Shipping Policy', href: '#' },
    { label: 'Returns',         href: '#' },
    { label: 'Track Order',     href: '/orders' },
  ],
};

const SOCIALS = [
  { icon: FiInstagram, href: 'https://instagram.com',  label: 'Instagram' },
  { icon: FiTwitter,   href: 'https://twitter.com',    label: 'Twitter'   },
  { icon: FiYoutube,   href: 'https://youtube.com',    label: 'YouTube'   },
  { icon: FiFacebook,  href: 'https://facebook.com',   label: 'Facebook'  },
];

const PAYMENT_BADGES = ['VISA', 'MC', 'AMEX', 'PayPal', 'Stripe'];

const Footer = () => {
  const [email, setEmail]     = useState('');
  const [subbed, setSubbed]   = useState(false);

  const handleSub = (e) => {
    e.preventDefault();
    if (email.trim()) { setSubbed(true); setEmail(''); }
  };

  return (
    <footer style={{ background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Main footer body ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Brand column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
                LUXE
              </span>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#6366f1', display: 'inline-block', marginBottom: 3 }} />
            </Link>

            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', lineHeight: 1.75, maxWidth: 280, marginBottom: '1.5rem' }}>
              Premium quality products for those who demand the best. Crafted with care, delivered with love.
            </p>

            {/* Contact info */}
            <div className="space-y-2 mb-6">
              {[
                { Icon: FiMapPin, text: '123 Fashion Ave, New York, NY 10001' },
                { Icon: FiMail,   text: 'hello@luxestore.com' },
                { Icon: FiPhone,  text: '+1 (800) 555-0199' },
              ].map(({ Icon, text }, i) => (
                <div key={i} className="flex items-start gap-2.5" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem' }}>
                  <Icon size={13} style={{ marginTop: 3, flexShrink: 0 }} />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center rounded-full transition-all duration-200"
                  style={{
                    width: 36, height: 36,
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.65)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#6366f1';
                    e.currentTarget.style.borderColor = '#6366f1';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.65)';
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '1.25rem' }}>
                {title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      style={{ textDecoration: 'none', fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => (e.target.style.color = '#fff')}
                      onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.55)')}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Newsletter strip ── */}
        <div
          className="mt-14 rounded-2xl px-8 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}
        >
          <div>
            <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>
              Join our newsletter
            </p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
              Get weekly updates on new arrivals and exclusive offers.
            </p>
          </div>
          <form onSubmit={handleSub} className="flex flex-wrap gap-3 w-full md:w-auto">
            {subbed ? (
              <p style={{ color: '#a5b4fc', fontWeight: 600, fontSize: '0.9rem' }}>
                ✓ You're subscribed!
              </p>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 md:w-56 px-4 py-2.5 rounded-full text-gray-900 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                  style={{ fontFamily: "'Inter', sans-serif", minWidth: '0' }}
                />
                <button
                  type="submit"
                  className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-white text-sm font-semibold transition-all hover:scale-105 w-full sm:w-auto"
                  style={{ background: '#6366f1', fontFamily: "'Inter', sans-serif", flexShrink: 0 }}
                >
                  Subscribe <FiArrowRight size={14} />
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} LUXE Store. All rights reserved. Built by{' '}
            <a
              href="https://instagram.com/programmingwithht"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'rgba(165,180,252,0.8)', textDecoration: 'none' }}
            >
              Hamza Tahir
            </a>
            .
          </p>

          {/* Payment badges */}
          <div className="flex items-center gap-2">
            {PAYMENT_BADGES.map((badge) => (
              <span
                key={badge}
                className="px-2.5 py-1 rounded text-xs font-bold"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.45)',
                  letterSpacing: '0.04em',
                  fontSize: '0.65rem',
                }}
              >
                {badge}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {['Privacy Policy', 'Terms of Service'].map((label) => (
              <a
                key={label}
                href="#"
                style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.target.style.color = 'rgba(255,255,255,0.7)')}
                onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.3)')}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
