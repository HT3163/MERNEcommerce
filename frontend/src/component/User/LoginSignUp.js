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
  const alert = useAlert();

  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const [activeTab, setActiveTab] = useState("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const { name, email, password } = user;

  const [avatar, setAvatar] = useState(defaultAvatar);
  const [avatarPreview, setAvatarPreview] = useState(defaultAvatar);

  /* ── Submit handlers ── */
  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginEmail, loginPassword));
  };

  const registerSubmit = (e) => {
    e.preventDefault();
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
    }
  };

  const redirect = location.search ? location.search.split("=")[1] : "/account";

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [dispatch, error, alert, navigate, isAuthenticated, redirect]);

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
              <p
                className={activeTab === "login" ? "activeTab" : ""}
                onClick={() => setActiveTab("login")}
              >
                LOGIN
              </p>
              <p
                className={activeTab === "register" ? "activeTab" : ""}
                onClick={() => setActiveTab("register")}
              >
                REGISTER
              </p>
            </div>

            {/* ── Login form ── */}
            {activeTab === "login" && (
              <form className="authForm" onSubmit={loginSubmit}>
                <div className="inputGroup">
                  <input
                    type="email"
                    placeholder="Email address"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                  <MailOutlineIcon />
                </div>

                <div className="inputGroup">
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <LockOpenIcon />
                </div>

                <Link to="/password/forgot" className="forgotLink">
                  Forgot password?
                </Link>

                <input type="submit" value="LOGIN" className="loginBtn" />
              </form>
            )}

            {/* ── Register form ── */}
            {activeTab === "register" && (
              <form
                className="authForm"
                encType="multipart/form-data"
                onSubmit={registerSubmit}
              >
                <div className="inputGroup">
                  <input
                    type="text"
                    placeholder="Full name"
                    required
                    name="name"
                    value={name}
                    onChange={registerDataChange}
                  />
                  <FaceIcon />
                </div>

                <div className="inputGroup">
                  <input
                    type="email"
                    placeholder="Email address"
                    required
                    name="email"
                    value={email}
                    onChange={registerDataChange}
                  />
                  <MailOutlineIcon />
                </div>

                <div className="inputGroup">
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={registerDataChange}
                  />
                  <LockOpenIcon />
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
