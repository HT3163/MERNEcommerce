import React, { Fragment, useEffect, useState } from "react";
import "./updateUser.css";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import SideBar from "./Sidebar";
import { UPDATE_USER_RESET } from "../../constants/userConstants";
import {
  getUserDetails,
  updateUser,
  clearErrors,
} from "../../actions/userAction";
import Loader from "../layout/Loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiSave,
  FiUser,
  FiMail,
  FiShield,
} from "react-icons/fi";

const UpdateUser = () => {
  const navigate = useNavigate();
  const params   = useParams();
  const dispatch = useDispatch();
  const alert    = useAlert();

  const { loading, error, user }                                   = useSelector((s) => s.userDetails);
  const { loading: updateLoading, error: updateError, isUpdated }  = useSelector((s) => s.profile);

  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [role,  setRole]  = useState("");

  const userId = params.id;

  /* ── Seed form from Redux ────────────────────────────────── */
  useEffect(() => {
    if (user && user._id !== userId) {
      dispatch(getUserDetails(userId));
    } else if (user) {
      setName(user.name  || "");
      setEmail(user.email || "");
      setRole(user.role  || "");
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("User updated successfully");
      navigate("/admin/users");
      dispatch({ type: UPDATE_USER_RESET });
    }
  }, [dispatch, alert, error, navigate, isUpdated, updateError, user, userId]);

  /* ── Submit ──────────────────────────────────────────────── */
  const handleSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name",  name);
    myForm.set("email", email);
    myForm.set("role",  role);
    dispatch(updateUser(userId, myForm));
  };

  /* ── Avatar initials ─────────────────────────────────────── */
  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <Fragment>
      <MetaData title="Update User — Admin" />

      <div className="uu-layout">
        <SideBar />

        <div className="uu-main">

          {/* ── Sticky top bar ──────────────────────────── */}
          <div className="uu-topbar">
            <div className="uu-topbar-left">
              <button
                type="button"
                className="uu-back-btn"
                onClick={() => navigate("/admin/users")}
              >
                <FiArrowLeft size={15} />
              </button>
              <div>
                <h1>Update User</h1>
                <p>Edit account details and role</p>
              </div>
            </div>
            <div className="uu-topbar-right">
              <button
                type="submit"
                form="uu-form"
                className="uu-submit-btn"
                disabled={updateLoading || role === ""}
              >
                {updateLoading
                  ? <span className="uu-spinner" />
                  : <FiSave size={15} />}
                {updateLoading ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>

          {/* ── Body ──────────────────────────────────────── */}
          {loading ? (
            <div className="uu-loader-wrap"><Loader /></div>
          ) : (
            <div className="uu-body">
              <div className="uu-grid">

                {/* ══ LEFT — Form ══════════════════════════ */}
                <div className="uu-col-main">
                  <div className="uu-card">
                    <div className="uu-card-header">
                      <p className="uu-card-eyebrow">Account</p>
                      <h3 className="uu-card-title">User Details</h3>
                    </div>

                    <div className="uu-card-body">
                      <form id="uu-form" onSubmit={handleSubmit}>

                        {/* Name */}
                        <div className="uu-field-group">
                          <label className="uu-label" htmlFor="uu-name">
                            Full Name <span className="uu-required">*</span>
                          </label>
                          <div className="uu-input-wrap">
                            <span className="uu-input-icon"><FiUser size={15} /></span>
                            <input
                              id="uu-name"
                              type="text"
                              className="uu-input"
                              placeholder="Full name"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Email */}
                        <div className="uu-field-group">
                          <label className="uu-label" htmlFor="uu-email">
                            Email Address <span className="uu-required">*</span>
                          </label>
                          <div className="uu-input-wrap">
                            <span className="uu-input-icon"><FiMail size={15} /></span>
                            <input
                              id="uu-email"
                              type="email"
                              className="uu-input"
                              placeholder="email@example.com"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Role */}
                        <div className="uu-field-group">
                          <label className="uu-label" htmlFor="uu-role">
                            Role <span className="uu-required">*</span>
                          </label>
                          <div className="uu-input-wrap">
                            <span className="uu-input-icon"><FiShield size={15} /></span>
                            <select
                              id="uu-role"
                              className="uu-input uu-select"
                              required
                              value={role}
                              onChange={(e) => setRole(e.target.value)}
                            >
                              <option value="">Select a role…</option>
                              <option value="admin">Admin</option>
                              <option value="user">User</option>
                            </select>
                          </div>

                          {/* Role description hint */}
                          {role === "admin" && (
                            <p className="uu-hint uu-hint--warn">
                              ⚠️ Admin users have full access to the admin dashboard.
                            </p>
                          )}
                          {role === "user" && (
                            <p className="uu-hint">
                              Standard users can browse and place orders only.
                            </p>
                          )}
                        </div>

                      </form>
                    </div>
                  </div>
                </div>

                {/* ══ RIGHT — User info card ═══════════════ */}
                <div className="uu-col-side">

                  {/* Profile summary card */}
                  <div className="uu-card uu-profile-card">
                    <div className="uu-card-body uu-profile-body">
                      <div className="uu-profile-avatar">{initials}</div>
                      <div className="uu-profile-info">
                        <p className="uu-profile-name">{name || "—"}</p>
                        <p className="uu-profile-email">{email || "—"}</p>
                        {role && (
                          <span className={`uu-role-badge ${role === "admin" ? "uu-role-admin" : "uu-role-user"}`}>
                            <FiShield size={11} />
                            {role === "admin" ? "Admin" : "User"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ID card */}
                  <div className="uu-card">
                    <div className="uu-card-body uu-meta-card">
                      <p className="uu-meta-label">User ID</p>
                      <p className="uu-meta-value uu-mono">{userId}</p>
                    </div>
                  </div>

                  {/* Tips card */}
                  <div className="uu-card uu-tips-card">
                    <div className="uu-card-body">
                      <p className="uu-tips-title">💡 Tips</p>
                      <ul className="uu-tips-list">
                        <li>Role changes take effect on next login.</li>
                        <li>Only assign Admin to trusted accounts.</li>
                        <li>Email must be unique across all users.</li>
                      </ul>
                    </div>
                  </div>

                </div>{/* /uu-col-side */}

              </div>{/* /uu-grid */}
            </div>
          )}

        </div>{/* /uu-main */}
      </div>{/* /uu-layout */}
    </Fragment>
  );
};

export default UpdateUser;
