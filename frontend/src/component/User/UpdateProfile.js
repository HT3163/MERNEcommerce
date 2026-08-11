import React, { Fragment, useState, useEffect } from "react";
import "./UpdateProfile.css";
import { FiUser, FiMail, FiUpload, FiCheckCircle, FiAlertCircle, FiCamera } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, updateProfile, loadUser } from "../../actions/userAction";
import { UPDATE_PROFILE_RESET } from "../../constants/userConstants";
import MetaData from "../layout/MetaData";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../../images/Profile.png";

/* ── helper: pick a gradient based on first letter ── */
const GRADIENTS = [
  ["#f43f5e", "#fb923c"],  // A, K, U
  ["#8b5cf6", "#6366f1"],  // B, L, V
  ["#06b6d4", "#3b82f6"],  // C, M, W
  ["#10b981", "#059669"],  // D, N, X
  ["#f59e0b", "#ef4444"],  // E, O, Y
  ["#ec4899", "#8b5cf6"],  // F, P, Z
  ["#14b8a6", "#06b6d4"],  // G, Q
  ["#6366f1", "#8b5cf6"],  // H, R
  ["#f97316", "#f59e0b"],  // I, S
  ["#84cc16", "#10b981"],  // J, T
];

const getGradient = (name = "") => {
  const idx = (name.charCodeAt(0) || 0) % GRADIENTS.length;
  return GRADIENTS[idx];
};

/* ── SmartAvatar: image → onError → beautiful initial ── */
const SmartAvatar = ({ src, name, size = 88, className = "" }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const initial  = (name || "?").charAt(0).toUpperCase();
  const [from, to] = getGradient(name);

  // reset error state when src changes (user picks new file)
  useEffect(() => { setImgFailed(false); }, [src]);

  const isDefault = src === defaultAvatar;

  if (!imgFailed && !isDefault) {
    return (
      <img
        src={src}
        alt={name || "Avatar"}
        className={`up-avatar-img ${className}`}
        style={{ width: size, height: size }}
        onError={() => setImgFailed(true)}
      />
    );
  }

  // show initials
  return (
    <div
      className={`up-avatar-initial ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(135deg, ${from}, ${to})`,
      }}
    >
      {initial}
    </div>
  );
};

/* ════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════ */
const UpdateProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user }                      = useSelector((s) => s.user);
  const { error, isUpdated, loading } = useSelector((s) => s.profile);

  const [name,          setName]          = useState("");
  const [email,         setEmail]         = useState("");
  const [avatar,        setAvatar]        = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(defaultAvatar);

  const [statusMsg, setStatusMsg] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMsg(null);
    const userData = { name, email };
    if (avatar) userData.avatar = avatar;
    dispatch(updateProfile(userData));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar?.url || defaultAvatar);
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      setStatusMsg({ type: "error", text: error });
      dispatch(clearErrors());
    }
    if (isUpdated) {
      setStatusMsg({ type: "success", text: "Profile updated successfully!" });
      dispatch(loadUser());
      dispatch({ type: UPDATE_PROFILE_RESET });
      const t = setTimeout(() => navigate("/account"), 1800);
      return () => clearTimeout(t);
    }
  }, [error, isUpdated, dispatch, navigate]);

  return (
    <Fragment>
      <MetaData title="Update Profile" />

      <div className="up-page">
        <div className="up-card">

          <h2 className="up-heading">Update Profile</h2>
          <p className="up-subtext">Change your name, email or profile photo</p>

          {/* ── Status Banner ── */}
          {statusMsg && (
            <div className={`up-banner up-banner--${statusMsg.type}`} role="alert">
              <span className="up-banner-icon">
                {statusMsg.type === "success"
                  ? <FiCheckCircle size={18} />
                  : <FiAlertCircle size={18} />}
              </span>
              <span className="up-banner-text">{statusMsg.text}</span>
              <button
                className="up-banner-close"
                aria-label="Dismiss"
                onClick={() => setStatusMsg(null)}
              >×</button>
            </div>
          )}

          <form className="up-form" onSubmit={handleSubmit}>

            {/* ── Avatar picker ── */}
            <div className="up-avatar-section">
              <div className="up-avatar-wrap">
                <SmartAvatar
                  src={avatarPreview}
                  name={name}
                  size={88}
                />
                <label htmlFor="up-avatar-input" className="up-avatar-edit-btn" title="Change photo">
                  <FiCamera size={14} />
                </label>
              </div>
              <p className="up-avatar-hint">Click the camera icon to change photo</p>
              <input
                id="up-avatar-input"
                type="file"
                name="avatar"
                accept="image/*"
                className="up-file-input"
                onChange={handleAvatarChange}
              />
            </div>

            {/* ── Name ── */}
            <div className="up-input-group">
              <span className="up-icon"><FiUser size={16} /></span>
              <input
                type="text"
                placeholder="Full Name"
                required
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* ── Email ── */}
            <div className="up-input-group">
              <span className="up-icon"><FiMail size={16} /></span>
              <input
                type="email"
                placeholder="Email Address"
                required
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* ── Submit ── */}
            <button type="submit" className="up-submit-btn" disabled={loading}>
              {loading ? (
                <span className="up-btn-loading">
                  <span className="up-spinner" />
                  Saving…
                </span>
              ) : (
                "Save Changes"
              )}
            </button>

          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateProfile;
