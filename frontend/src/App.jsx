import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "../components/LoginPage";
import RegisterPage from "../components/RegisterPage";
import MenuAppBar from "../components/MenuAppBar";
import UserHome from "../pages/userpages/UserHome";
import SellerHome from "../pages/sellerpages/SellerHome";
import UserPrivateComponent from "../components/UserPrivateComponent";
import SellerPrivateComponent from "../components/SellerPrivateComponent";
import Cart from "../pages/userpages/Cart";
import ViewUserOrders from "../pages/userpages/ViewUserOrders";
import AddProduct from "../pages/sellerpages/AddProduct";
import ViewSellerOrders from "../pages/sellerpages/ViewSellerOrders";

function App() {
  return (
    <div>
      <Router>
        <MenuAppBar />
        <Routes>
          <Route element={<UserPrivateComponent />}>
            {/* User Specific Private Routes */}
            <Route path="/userhome" element={<UserHome />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<ViewUserOrders />} />
          </Route>
          <Route element={<SellerPrivateComponent />}>
            {/* Seller Specific Private Routes */}
            <Route path="/sellerhome" element={<SellerHome />} />
            <Route path="/add" element={<AddProduct />} />
            <Route path="/receivedorders" element={<ViewSellerOrders />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
