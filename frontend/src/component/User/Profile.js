import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Profile is now the full Dashboard at /account.
// This file is kept so any existing <Link to="/account"> works fine.
const Profile = () => {
  const navigate = useNavigate();
  useEffect(() => { navigate("/account", { replace: true }); }, [navigate]);
  return null;
};

export default Profile;
