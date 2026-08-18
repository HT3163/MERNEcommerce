import React, { Fragment, useEffect, useRef, useState } from "react";
import "./LoginSignUp.css";
import Loader from "../layout/Loader/Loader";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { clearErrors, googleLogin, login, register } from "../../actions/userAction";
import defaultAvatar from "../../images/Profile.png";

const LoginSignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { error, loading, isAuthenticated } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState({});
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const { name, email, password } = user;
  const [regErrors, setRegErrors] = useState({});
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [avatarPreview, setAvatarPreview] = useState(defaultAvatar);
  const [apiError, setApiError] = useState("");
  const [googleClientId, setGoogleClientId] = useState("");
  const [googleReady, setGoogleReady] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const loginGoogleRef = useRef(null);
  const registerGoogleRef = useRef(null);

  const validateLogin = () => {
    const errs = {};

    if (!loginEmail) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(loginEmail)) errs.email = "Enter a valid email address.";

    if (!loginPassword) errs.password = "Password is required.";
    else if (loginPassword.length < 8) errs.password = "Password must be at least 8 characters.";

    return errs;
  };

  const validateRegister = () => {
    const errs = {};

    if (!name.trim()) errs.name = "Full name is required.";
    else if (name.trim().length < 4) errs.name = "Name must be at least 4 characters.";

    if (!email) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email address.";

    if (!password) errs.password = "Password is required.";
    else if (password.length < 8) errs.password = "Password must be at least 8 characters.";

    return errs;
  };

  const loginSubmit = (e) => {
    e.preventDefault();
    const errs = validateLogin();

    if (Object.keys(errs).length) {
      setLoginErrors(errs);
      return;
    }

    setLoginErrors({});
    setApiError("");
    dispatch(login(loginEmail, loginPassword));
  };

  const registerSubmit = (e) => {
    e.preventDefault();
    const errs = validateRegister();

    if (Object.keys(errs).length) {
      setRegErrors(errs);
      return;
    }

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

      if (regErrors[e.target.name]) {
        setRegErrors((prev) => {
          const nextErrors = { ...prev };
          delete nextErrors[e.target.name];
          return nextErrors;
        });
      }
    }
  };
  console.log("Location search:", location.search);
  const redirect = location.search ? location.search.split("=")[1] : "/account";

  useEffect(() => {
    let isMounted = true;

    const fetchGoogleClientId = async () => {
      try {
        const { data } = await axios.get("/api/v1/auth/google/client-id");

        if (isMounted) {
          setGoogleClientId(data.clientId);
          setGoogleError("");
        }
      } catch (err) {
        if (isMounted) {
          setGoogleError(err.response?.data?.message || "Google Sign-In is currently unavailable.");
        }
      }
    };

    fetchGoogleClientId();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!googleClientId) return;

    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    const handleLoad = () => setGoogleReady(true);
    const handleError = () => setGoogleError("Google Sign-In failed to load. Please try again.");

    if (existingScript) {
      if (window.google?.accounts?.id) {
        setGoogleReady(true);
        return undefined;
      }

      existingScript.addEventListener("load", handleLoad);
      existingScript.addEventListener("error", handleError);

      return () => {
        existingScript.removeEventListener("load", handleLoad);
        existingScript.removeEventListener("error", handleError);
      };
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = handleLoad;
    script.onerror = handleError;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, [googleClientId]);

  useEffect(() => {
    if (error) {
      setApiError(error);
      dispatch(clearErrors());
    }

    if (isAuthenticated) navigate(redirect);
  }, [dispatch, error, isAuthenticated, navigate, redirect]);

  useEffect(() => {
    if (!googleReady || !googleClientId || !window.google?.accounts?.id) return;

    const buttonRef = activeTab === "login" ? loginGoogleRef.current : registerGoogleRef.current;

    if (!buttonRef) return;

    buttonRef.innerHTML = "";

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: (response) => {
        if (!response.credential) {
          setApiError("Missing Google credential");
          return;
        }

        setApiError("");
        dispatch(googleLogin(response.credential));
      },
    });

    window.google.accounts.id.renderButton(buttonRef, {
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      logo_alignment: "left",
      width: Math.min(buttonRef.clientWidth || 360, 360),
    });
  }, [activeTab, dispatch, googleClientId, googleReady]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setLoginErrors({});
    setRegErrors({});
    setApiError("");
  };

  const renderGoogleSection = (buttonRef) => (
    <div className="googleAuthSection">
      <div className="googleAuthDivider">
        <span>OR</span>
      </div>

      <div className="googleAuthButtonWrap">
        <div
          ref={buttonRef}
          className="googleAuthMount"
          style={{ display: googleReady && !googleError ? "block" : "none" }}
        />

        {!googleReady && !googleError && (
          <button type="button" className="googleAuthFallback" disabled>
            Loading Google Sign-In...
          </button>
        )}

        {googleError && <p className="googleAuthError">{googleError}</p>}
      </div>
    </div>
  );

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="LoginSignUpContainer">
          <div className="LoginSignUpBox">
            <div className="loginBrand">
              <h1>ShopEase</h1>
              <p>Your premium shopping destination</p>
            </div>

            <div className="login_signUp_toggle">
              <div className={`tabSlider ${activeTab === "register" ? "slideRight" : ""}`}></div>
              <p className={activeTab === "login" ? "activeTab" : ""} onClick={() => switchTab("login")}>LOGIN</p>
              <p className={activeTab === "register" ? "activeTab" : ""} onClick={() => switchTab("register")}>REGISTER</p>
            </div>

            {apiError && (
              <div className="auth-error-banner">
                <span className="auth-error-banner-icon">!</span>
                <span className="auth-error-banner-msg">{apiError}</span>
                <button className="auth-error-banner-close" onClick={() => setApiError("")} aria-label="Dismiss">x</button>
              </div>
            )}

            {activeTab === "login" && (
              <form className="authForm" onSubmit={loginSubmit} noValidate>
                <div className={`inputGroup${loginErrors.email ? " inputGroup--error" : ""}`}>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (loginErrors.email) {
                        setLoginErrors((prev) => {
                          const nextErrors = { ...prev };
                          delete nextErrors.email;
                          return nextErrors;
                        });
                      }
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
                      if (loginErrors.password) {
                        setLoginErrors((prev) => {
                          const nextErrors = { ...prev };
                          delete nextErrors.password;
                          return nextErrors;
                        });
                      }
                    }}
                  />
                  <LockOpenIcon />
                  {loginErrors.password && <span className="field-error">{loginErrors.password}</span>}
                </div>

                <Link to="/password/forgot" className="forgotLink">Forgot password?</Link>

                <input type="submit" value="LOGIN" className="loginBtn" />

                {renderGoogleSection(loginGoogleRef)}
              </form>
            )}

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
                    placeholder="Password (min 8 characters)"
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

                {renderGoogleSection(registerGoogleRef)}
              </form>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default LoginSignUp;
