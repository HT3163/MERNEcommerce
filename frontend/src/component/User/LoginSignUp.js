import React, { Fragment, useState, useEffect } from "react";
import "./LoginSignUp.css";
import Loader from "../layout/Loader/Loader";
import { Link } from "react-router-dom";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, login, register } from "../../actions/userAction";
import { useAlert } from "react-alert";
import { useNavigate, useLocation } from "react-router-dom";
import defaultAvatar from "../../images/Profile.png";

const LoginSignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const alert    = useAlert();

  const { error, loading, isAuthenticated } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("login");

  /* ── Login state ── */
  const [loginEmail,    setLoginEmail]    = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors,   setLoginErrors]   = useState({});

  /* ── Register state ── */
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const { name, email, password } = user;
  const [regErrors,     setRegErrors]     = useState({});

  /* ── Avatar ── */
  const [avatar,        setAvatar]        = useState(defaultAvatar);
  const [avatarPreview, setAvatarPreview] = useState(defaultAvatar);

  /* ── API error banner ── */
  const [apiError, setApiError] = useState("");

  /* ── Validation helpers ── */
  const validateLogin = () => {
    const errs = {};
    if (!loginEmail)                          errs.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(loginEmail)) errs.email    = "Enter a valid email address.";
    if (!loginPassword)                        errs.password = "Password is required.";
    else if (loginPassword.length < 8)         errs.password = "Password must be at least 8 characters.";
    return errs;
  };

  const validateRegister = () => {
    const errs = {};
    if (!name.trim())                        errs.name     = "Full name is required.";
    else if (name.trim().length < 4)         errs.name     = "Name must be at least 4 characters.";
    if (!email)                              errs.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email))   errs.email    = "Enter a valid email address.";
    if (!password)                           errs.password = "Password is required.";
    else if (password.length < 8)           errs.password = "Password must be at least 8 characters.";
    return errs;
  };

  /* ── Submit handlers ── */
  const loginSubmit = (e) => {
    e.preventDefault();
    const errs = validateLogin();
    if (Object.keys(errs).length) { setLoginErrors(errs); return; }
    setLoginErrors({});
    setApiError("");
    dispatch(login(loginEmail, loginPassword));
  };

  const registerSubmit = (e) => {
    e.preventDefault();
    const errs = validateRegister();
    if (Object.keys(errs).length) { setRegErrors(errs); return; }
    setRegErrors({});
    setApiError("");
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("avatar", avatar);
    dispatch(register(myForm));
  };

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
      // Clear field error on change
      if (regErrors[e.target.name]) {
        setRegErrors((prev) => { const n = { ...prev }; delete n[e.target.name]; return n; });
      }
    }
  };

  const redirect = location.search ? location.search.split("=")[1] : "/account";

  useEffect(() => {
    if (error) {
      setApiError(error);
      dispatch(clearErrors());
    }
    if (isAuthenticated) navigate(redirect);
  }, [dispatch, error, navigate, isAuthenticated, redirect]);

  /* ── Switch tab → clear all errors ── */
  const switchTab = (tab) => {
    setActiveTab(tab);
    setLoginErrors({});
    setRegErrors({});
    setApiError("");
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="LoginSignUpContainer">
          <div className="LoginSignUpBox">

            {/* ── Brand header ── */}
            <div className="loginBrand">
              <h1>ShopEase</h1>
              <p>Your premium shopping destination</p>
            </div>

            {/* ── Tab switcher ── */}
            <div className="login_signUp_toggle">
              <div className={`tabSlider ${activeTab === "register" ? "slideRight" : ""}`}></div>
              <p className={activeTab === "login"    ? "activeTab" : ""} onClick={() => switchTab("login")}>LOGIN</p>
              <p className={activeTab === "register" ? "activeTab" : ""} onClick={() => switchTab("register")}>REGISTER</p>
            </div>

            {/* ── API error banner ── */}
            {apiError && (
              <div className="auth-error-banner">
                <span className="auth-error-banner-icon">⚠</span>
                <span className="auth-error-banner-msg">{apiError}</span>
                <button className="auth-error-banner-close" onClick={() => setApiError("")} aria-label="Dismiss">✕</button>
              </div>
            )}

            {/* ── Login form ── */}
            {activeTab === "login" && (
              <form className="authForm" onSubmit={loginSubmit} noValidate>

                <div className={`inputGroup${loginErrors.email ? " inputGroup--error" : ""}`}>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (loginErrors.email) setLoginErrors((p) => { const n={...p}; delete n.email; return n; });
                    }}
                  />
                  <MailOutlineIcon />
                  {loginErrors.email && <span className="field-error">{loginErrors.email}</span>}
                </div>

                <div className={`inputGroup${loginErrors.password ? " inputGroup--error" : ""}`}>
                  <input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (loginErrors.password) setLoginErrors((p) => { const n={...p}; delete n.password; return n; });
                    }}
                  />
                  <LockOpenIcon />
                  {loginErrors.password && <span className="field-error">{loginErrors.password}</span>}
                </div>

                <Link to="/password/forgot" className="forgotLink">Forgot password?</Link>

                <input type="submit" value="LOGIN" className="loginBtn" />
              </form>
            )}

            {/* ── Register form ── */}
            {activeTab === "register" && (
              <form className="authForm" encType="multipart/form-data" onSubmit={registerSubmit} noValidate>

                <div className={`inputGroup${regErrors.name ? " inputGroup--error" : ""}`}>
                  <input
                    type="text"
                    placeholder="Full name"
                    name="name"
                    value={name}
                    onChange={registerDataChange}
                  />
                  <FaceIcon />
                  {regErrors.name && <span className="field-error">{regErrors.name}</span>}
                </div>

                <div className={`inputGroup${regErrors.email ? " inputGroup--error" : ""}`}>
                  <input
                    type="email"
                    placeholder="Email address"
                    name="email"
                    value={email}
                    onChange={registerDataChange}
                  />
                  <MailOutlineIcon />
                  {regErrors.email && <span className="field-error">{regErrors.email}</span>}
                </div>

                <div className={`inputGroup${regErrors.password ? " inputGroup--error" : ""}`}>
                  <input
                    type="password"
                    placeholder="Password (min 6 characters)"
                    name="password"
                    value={password}
                    onChange={registerDataChange}
                  />
                  <LockOpenIcon />
                  {regErrors.password && <span className="field-error">{regErrors.password}</span>}
                </div>

                <div id="registerImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={registerDataChange}
                  />
                </div>

                <input type="submit" value="CREATE ACCOUNT" className="signUpBtn" />
              </form>
            )}

          </div>
        </div>
      )}
    </Fragment>
  );
};

export default LoginSignUp;
