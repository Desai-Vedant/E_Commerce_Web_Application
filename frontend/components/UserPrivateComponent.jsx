import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const UserPrivateComponent = () => {
  const data = localStorage.getItem("user");
  let auth = false;

  if (data) {
    const user = JSON.parse(data);
    auth = user.isSeller; // 'isSeller' indicates admin role
  }

  return !auth ? <Outlet /> : <Navigate to="/login" />;
};

export default UserPrivateComponent;
