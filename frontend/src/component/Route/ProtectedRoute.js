import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAdmin, children }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  // Still fetching user — don't redirect yet
  if (loading) return null;

  // Not logged in → send to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin when admin is required → send to account
  if (isAdmin && user?.role !== "admin") {
    return <Navigate to="/account" replace />;
  }

  return <Fragment>{children}</Fragment>;
};

export default ProtectedRoute;
