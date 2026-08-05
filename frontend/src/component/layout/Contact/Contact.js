import React, { useState } from "react";
import "./Contact.css";
import MetaData from "../MetaData";
import { FiMail, FiMapPin, FiPhone, FiSend, FiInstagram, FiYoutube, FiCheckCircle } from "react-icons/fi";

const INFO_CARDS = [
  {
    icon: <FiMail size={22} />,
    title: "Email Us",
    line1: "hamzach3163@gmail.com",
    line2: "We reply within 24 hours",
    href: "mailto:hamzach3163@gmail.com",
  },
  {
    icon: <FiPhone size={22} />,
    title: "Call Us",
    line1: "+92 300 000 0000",
    line2: "Mon – Fri, 9am – 6pm PKT",
    href: "tel:+923000000000",
  },
  {
    icon: <FiMapPin size={22} />,
    title: "Our Office",
    line1: "Lahore, Pakistan",
    line2: "Open for partnerships",
    href: null,
  },
];

const Contact = () => {
  const [form, setForm]       = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Wire to your backend here
    setSubmitted(true);
  };

  return (
    <>
      <MetaData title="Contact Us — LUXE" />

      {/* ── Hero ── */}
      <section className="ct-hero">
        <div className="ct-hero-bg" />
        <div className="ct-hero-overlay" />
        <div className="ct-hero-content">
          <span className="ct-pill">Get in Touch</span>
          <h1 className="ct-hero-title">
            We'd Love to <em>Hear</em> From You
          </h1>
          <p className="ct-hero-sub">
            Have a question, feedback, or a partnership idea?
            Drop us a message — our team is always happy to help.
          </p>
        </div>
      </section>

      {/* ── Info cards ── */}
      <section className="ct-info-bar">
        {INFO_CARDS.map((card, i) =>
          card.href ? (
            <a key={i} href={card.href} className="ct-info-card">
              <span className="ct-info-icon">{card.icon}</span>
              <h4 className="ct-info-title">{card.title}</h4>
              <p className="ct-info-line1">{card.line1}</p>
              <p className="ct-info-line2">{card.line2}</p>
            </a>
          ) : (
            <div key={i} className="ct-info-card">
              <span className="ct-info-icon">{card.icon}</span>
              <h4 className="ct-info-title">{card.title}</h4>
              <p className="ct-info-line1">{card.line1}</p>
              <p className="ct-info-line2">{card.line2}</p>
            </div>
          )
        )}
      </section>

      {/* ── Main: form + sidebar ── */}
      <section className="ct-main">
        <div className="ct-main-inner">

          {/* Form card */}
          <div className="ct-form-card">
            {submitted ? (
              <div className="ct-success">
                <FiCheckCircle size={48} className="ct-success-icon" />
                <h3 className="ct-success-title">Message Sent!</h3>
                <p className="ct-success-sub">
                  Thanks for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                  className="ct-btn"
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <div className="ct-form-header">
                  <span className="ct-section-label">Contact Form</span>
                  <h2 className="ct-form-title">Send Us a Message</h2>
                </div>
                <form className="ct-form" onSubmit={handleSubmit}>
                  <div className="ct-form-row">
                    <div className="ct-field">
                      <label className="ct-label">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Hamza Tahir"
                        className="ct-input"
                        required
                      />
                    </div>
                    <div className="ct-field">
                      <label className="ct-label">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="ct-input"
                        required
                      />
                    </div>
                  </div>
                  <div className="ct-field">
                    <label className="ct-label">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      className="ct-input"
                      required
                    />
                  </div>
                  <div className="ct-field">
                    <label className="ct-label">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us everything..."
                      className="ct-textarea"
                      rows={6}
                      required
                    />
                  </div>
                  <button type="submit" className="ct-btn ct-btn-full">
                    <FiSend size={16} />
                    Send Message
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="ct-sidebar">
            <div className="ct-sidebar-card">
              <span className="ct-section-label">Follow Along</span>
              <h3 className="ct-sidebar-title">
                Stay Connected
              </h3>
              <p className="ct-sidebar-desc">
                Follow <strong>@ProgrammingWithHT</strong> for tutorials,
                behind-the-scenes, and MERN stack tips.
              </p>
              <div className="ct-sidebar-socials">
                <a
                  href="https://www.youtube.com/channel/UC0qwt_aYOOvCfoO8lHpNc9A"
                  target="_blank"
                  rel="noreferrer"
                  className="ct-social-btn yt"
                >
                  <FiYoutube size={18} />
                  YouTube
                </a>
                <a
                  href="https://instagram.com/ProgrammingWithHT"
                  target="_blank"
                  rel="noreferrer"
                  className="ct-social-btn ig"
                >
                  <FiInstagram size={18} />
                  Instagram
                </a>
              </div>
            </div>

            <div className="ct-sidebar-card ct-faq-card">
              <span className="ct-section-label">Quick Answers</span>
              <h3 className="ct-sidebar-title">FAQ</h3>
              <ul className="ct-faq-list">
                <li>
                  <strong>How long does shipping take?</strong>
                  <p>Standard delivery is 3–7 business days.</p>
                </li>
                <li>
                  <strong>What's your return policy?</strong>
                  <p>30-day hassle-free returns on all orders.</p>
                </li>
                <li>
                  <strong>Do you ship internationally?</strong>
                  <p>Yes! We ship to over 50 countries worldwide.</p>
                </li>
              </ul>
            </div>
          </aside>

        </div>
      </section>
    </>
  );
};

export default Contact;
