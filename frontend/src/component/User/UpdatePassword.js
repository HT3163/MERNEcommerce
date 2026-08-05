import React, { Fragment, useState, useEffect } from "react";
import "./UpdatePassword.css";
import Loader from "../layout/Loader/Loader";
import { FiLock, FiUnlock, FiKey } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, updatePassword } from "../../actions/userAction";
import { useAlert } from "react-alert";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstants";
import MetaData from "../layout/MetaData";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert    = useAlert();

  const { error, isUpdated, loading } = useSelector((s) => s.profile);

  const [oldPassword,     setOldPassword]     = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    form.set("oldPassword",     oldPassword);
    form.set("newPassword",     newPassword);
    form.set("confirmPassword", confirmPassword);
    dispatch(updatePassword(form));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("Password changed successfully");
      navigate("/account");
      dispatch({ type: UPDATE_PASSWORD_RESET });
    }
  }, [dispatch, error, alert, navigate, isUpdated]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Change Password — LUXE" />

          <div className="upw-page">
            <div className="upw-card">

              <h2 className="upw-heading">Change Password</h2>
              <p className="upw-subtext">Keep your account secure with a strong password</p>

              <form className="upw-form" onSubmit={handleSubmit}>

                {/* Current password */}
                <div className="upw-input-group">
                  <span className="upw-icon"><FiKey size={16} /></span>
                  <input
                    type="password"
                    placeholder="Current Password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>

                {/* New password */}
                <div className="upw-input-group">
                  <span className="upw-icon"><FiUnlock size={16} /></span>
                  <input
                    type="password"
                    placeholder="New Password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <p className="upw-hint">Minimum 8 characters recommended</p>

                {/* Confirm password */}
                <div className="upw-input-group">
                  <span className="upw-icon"><FiLock size={16} /></span>
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="upw-submit-btn">
                  Update Password
                </button>
              </form>

            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UpdatePassword;
