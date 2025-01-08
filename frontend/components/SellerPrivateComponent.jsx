import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const SellerPrivateComponent = () => {
  const data = localStorage.getItem("user");
  let auth = false;

  if (data) {
    const user = JSON.parse(data);
    auth = user.isSeller; // 'isSeller' indicates Seller role
  }

  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default SellerPrivateComponent;
