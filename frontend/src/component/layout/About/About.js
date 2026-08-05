import React from "react";
import "./aboutSection.css";
import YouTubeIcon from "@material-ui/icons/YouTube";
import InstagramIcon from "@material-ui/icons/Instagram";
import { FiShoppingBag, FiStar, FiUsers, FiAward } from "react-icons/fi";
import MetaData from "../MetaData";

const STATS = [
  { icon: <FiShoppingBag size={20} />, num: "10k+",  label: "Products" },
  { icon: <FiUsers       size={20} />, num: "50k+",  label: "Customers" },
  { icon: <FiStar        size={20} />, num: "4.9★",  label: "Avg Rating" },
  { icon: <FiAward       size={20} />, num: "3+",    label: "Years Online" },
];

const VALUES = [
  {
    emoji: "🎯",
    title: "Our Mission",
    desc:  "To make premium-quality products accessible to everyone — no compromise on quality, no compromise on price.",
  },
  {
    emoji: "💎",
    title: "Our Vision",
    desc:  "A world where every shopper feels confident, valued, and delighted — from first click to doorstep delivery.",
  },
  {
    emoji: "🤝",
    title: "Our Promise",
    desc:  "Transparent pricing, hassle-free returns, and human support that actually helps. Always.",
  },
];

const About = () => {
  return (
    <>
      <MetaData title="About Us — LUXE" />

      {/* ── Hero ── */}
      <section className="ab-hero">
        <div className="ab-hero-bg" />
        <div className="ab-hero-overlay" />
        <div className="ab-hero-content">
          <span className="ab-pill">Our Story</span>
          <h1 className="ab-hero-title">
            Crafted with <em>Passion</em>,<br />Built for <em>You</em>
          </h1>
          <p className="ab-hero-sub">
            LUXE was born from a simple belief — that great products and great
            experiences should go hand in hand.
          </p>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="ab-stats-bar">
        {STATS.map((s, i) => (
          <div key={i} className="ab-stat">
            <span className="ab-stat-icon">{s.icon}</span>
            <span className="ab-stat-num">{s.num}</span>
            <span className="ab-stat-lbl">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── Founder card ── */}
      <section className="ab-section">
        <div className="ab-founder-card">
          {/* Left — avatar + socials */}
          <div className="ab-founder-left">
            <div className="ab-avatar-wrap">
              <img
                src="https://res.cloudinary.com/dvrxdremd/image/upload/v1660069287/avatars/odzpfk9vb65at429ob4s.jpg"
                alt="Hamza Tahir"
                className="ab-avatar"
              />
              <div className="ab-avatar-ring" />
            </div>
            <h2 className="ab-founder-name">Hamza Tahir</h2>
            <p className="ab-founder-role">Founder &amp; Developer</p>
            <div className="ab-socials">
              <a
                href="https://www.youtube.com/channel/UC0qwt_aYOOvCfoO8lHpNc9A"
                target="_blank"
                rel="noreferrer"
                className="ab-social-btn yt"
                aria-label="YouTube"
              >
                <YouTubeIcon style={{ fontSize: "1.3rem" }} />
                YouTube
              </a>
              <a
                href="https://instagram.com/ProgrammingWithHT"
                target="_blank"
                rel="noreferrer"
                className="ab-social-btn ig"
                aria-label="Instagram"
              >
                <InstagramIcon style={{ fontSize: "1.3rem" }} />
                Instagram
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="ab-founder-divider" />

          {/* Right — bio */}
          <div className="ab-founder-right">
            <span className="ab-section-label">Meet the Founder</span>
            <h3 className="ab-founder-heading">
              Building the Future of <em>eCommerce</em>
            </h3>
            <p className="ab-founder-bio">
              Hi, I'm <strong>Hamza Tahir</strong> — a full-stack developer and
              educator passionate about the MERN stack. LUXE is a showcase
              project built to demonstrate real-world eCommerce architecture:
              authentication, payments, product management, and more.
            </p>
            <p className="ab-founder-bio">
              Follow along on <strong>ProgrammingWithHT</strong> where I break
              down every line of code and teach you how to build projects like
              this from scratch.
            </p>
            <a
              href="https://instagram.com/ProgrammingWithHT"
              target="_blank"
              rel="noreferrer"
              className="ab-cta-btn"
            >
              <InstagramIcon style={{ fontSize: "1rem" }} />
              Follow on Instagram
            </a>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="ab-section ab-section-soft">
        <div className="ab-section-header">
          <span className="ab-section-label">What We Stand For</span>
          <h2 className="ab-section-title">
            Our Core <em>Values</em>
          </h2>
        </div>
        <div className="ab-values-grid">
          {VALUES.map((v, i) => (
            <div key={i} className="ab-value-card">
              <span className="ab-value-emoji">{v.emoji}</span>
              <h4 className="ab-value-title">{v.title}</h4>
              <p className="ab-value-desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="ab-cta-banner">
        <div className="ab-cta-inner">
          <h2 className="ab-cta-title">
            Ready to Start <em>Shopping?</em>
          </h2>
          <p className="ab-cta-sub">
            Explore thousands of premium products handpicked just for you.
          </p>
          <a href="/products" className="ab-cta-btn white">
            <FiShoppingBag size={16} />
            Shop Now
          </a>
        </div>
      </section>
    </>
  );
};

export default About;
