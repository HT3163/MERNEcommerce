import React, { Fragment, useState, useEffect } from "react";
import "./UpdateProfile.css";
<<<<<<< HEAD
import { FiUser, FiMail, FiUpload, FiCheckCircle, FiAlertCircle, FiLoader } from "react-icons/fi";
=======
import Loader from "../layout/Loader/Loader";
import { FiUser, FiMail, FiUpload } from "react-icons/fi";
>>>>>>> 9a45c50 (Programmingwithht (#2))
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, updateProfile, loadUser } from "../../actions/userAction";
import { UPDATE_PROFILE_RESET } from "../../constants/userConstants";
import MetaData from "../layout/MetaData";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
<<<<<<< HEAD
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user }                      = useSelector((s) => s.user);
  const { error, isUpdated, loading } = useSelector((s) => s.profile);

  const [name,          setName]          = useState("");
  const [email,         setEmail]         = useState("");
  const [avatar,        setAvatar]        = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  // local UI state for banners
  const [statusMsg,  setStatusMsg]  = useState(null);   // { type: 'error'|'success', text: string }

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
=======
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const alert     = useAlert();

  const { user }                        = useSelector((s) => s.user);
  const { error, isUpdated, loading }   = useSelector((s) => s.profile);

  const [name,          setName]          = useState("");
  const [email,         setEmail]         = useState("");
  const [avatar,        setAvatar]        = useState();
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    form.set("name", name);
    form.set("email", email);
    form.set("avatar", avatar);
    dispatch(updateProfile(form));
  };

  const handleAvatarChange = (e) => {
>>>>>>> 9a45c50 (Programmingwithht (#2))
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };
<<<<<<< HEAD
    reader.readAsDataURL(file);
=======
    reader.readAsDataURL(e.target.files[0]);
>>>>>>> 9a45c50 (Programmingwithht (#2))
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar?.url || "/Profile.png");
    }
<<<<<<< HEAD
  }, [user]);

  useEffect(() => {
=======
>>>>>>> 9a45c50 (Programmingwithht (#2))
    if (error) {
      setStatusMsg({ type: "error", text: error });
      dispatch(clearErrors());
    }
    if (isUpdated) {
<<<<<<< HEAD
      setStatusMsg({ type: "success", text: "Profile updated successfully!" });
      dispatch(loadUser());
      dispatch({ type: UPDATE_PROFILE_RESET });

      // navigate after short delay so user sees success message
      const t = setTimeout(() => navigate("/account"), 1800);
      return () => clearTimeout(t);
    }
  }, [error, isUpdated, dispatch, navigate]);

  return (
    <Fragment>
      <MetaData title="Update Profile — LUXE" />

      <div className="up-page">
        <div className="up-card">

          {/* Heading */}
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
              >
                ×
              </button>
=======
      alert.success("Profile updated successfully");
      dispatch(loadUser());
      navigate("/account");
      dispatch({ type: UPDATE_PROFILE_RESET });
    }
  }, [dispatch, error, alert, navigate, user, isUpdated]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Update Profile — LUXE" />

          <div className="up-page">
            <div className="up-card">

              {/* Heading */}
              <h2 className="up-heading">Update Profile</h2>
              <p className="up-subtext">Change your name, email or profile photo</p>

              <form className="up-form" encType="multipart/form-data" onSubmit={handleSubmit}>

                {/* Name */}
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

                {/* Email */}
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

                {/* Avatar */}
                <div className="up-avatar-section">
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="up-avatar-preview"
                  />
                  <label htmlFor="up-avatar-input" className="up-file-label">
                    <FiUpload size={14} />
                    Choose Photo
                  </label>
                  <input
                    id="up-avatar-input"
                    type="file"
                    name="avatar"
                    accept="image/*"
                    className="up-file-input"
                    onChange={handleAvatarChange}
                  />
                </div>

                <button type="submit" className="up-submit-btn">
                  Save Changes
                </button>
              </form>

>>>>>>> 9a45c50 (Programmingwithht (#2))
            </div>
          )}

          <form className="up-form" onSubmit={handleSubmit}>

            {/* Name */}
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

            {/* Email */}
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

            {/* Avatar */}
            <div className="up-avatar-section">
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="up-avatar-preview"
              />
              <label htmlFor="up-avatar-input" className="up-file-label">
                <FiUpload size={14} />
                Choose Photo
              </label>
              <input
                id="up-avatar-input"
                type="file"
                name="avatar"
                accept="image/*"
                className="up-file-input"
                onChange={handleAvatarChange}
              />
            </div>

            {/* Submit */}
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
