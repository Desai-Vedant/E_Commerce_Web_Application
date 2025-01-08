import * as React from "react";
import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function MenuAppBar() {
  const [auth, setAuth] = useState(false); // Authentication state
  const [isSeller, setIsSeller] = useState(false); // Seller state
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  // Check if the user is logged in on component mount
  useEffect(() => {
    const token = Cookies.get("token");
    const user = localStorage.getItem("user");

    if (user) setAuth(true); // Set auth state if token exists
    if (user) {
      const parsedUser = JSON.parse(user); // Parse the user object from localStorage
      setIsSeller(parsedUser.isSeller); // Set Seller state
    }
  });

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear authentication data
    Cookies.remove("token");
    localStorage.removeItem("user");
    setAuth(false);
    handleClose();
    navigate("/login"); // Redirect to login
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* Left Title Area */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Shop Zone
          </Typography>

          {/* Right Links Area */}
          {!auth ? (
            <>
              {/* Public Routes */}
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          ) : (
            <>
              {/* Private Routes */}
              {isSeller ? (
                <>
                  {/* Seller Routes */}
                  <Button color="inherit" component={Link} to="/sellerhome">
                    Home
                  </Button>
                  <Button color="inherit" component={Link} to="/add">
                    Add Product
                  </Button>
                  <Button color="inherit" component={Link} to="/receivedorders">
                    Orders
                  </Button>
                </>
              ) : (
                <>
                  {/* User Routes */}
                  <Button color="inherit" component={Link} to="/userhome">
                    Home
                  </Button>
                  <Button color="inherit" component={Link} to="/cart">
                    Cart
                  </Button>
                  <Button color="inherit" component={Link} to="/orders">
                    Orders
                  </Button>
                </>
              )}
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
