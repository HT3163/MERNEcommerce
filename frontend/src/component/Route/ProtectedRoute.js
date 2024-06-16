import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route } from "react-router-dom";

const ProtectedRoute = ({ isAdmin, children }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  let hame = children
  if(isAuthenticated === false){
    hame = <Navigate to={"/login"} />
  }
  if(isAdmin === true && (user && user.role !== 'admin')){
    hame = <Navigate to={"/login"} />
  }

  return <Fragment>{hame}</Fragment>

};

export default ProtectedRoute;
