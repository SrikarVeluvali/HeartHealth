import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  // Check if there is a valid authentication token in local storage
  const auth = localStorage.getItem("token");

  // If authenticated, render the nested routes using Outlet
  // If not authenticated, navigate to the "/login" route
  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
