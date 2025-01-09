import React, { useEffect, useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";

function ViewUserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);

  const fetchOrders = async () => {
    try {
      const orderResponse = await axios.post(
        "http://localhost:3000/order/view",
        {},
        { withCredentials: true }
      );
      const ord = orderResponse.data.orders || [];

      const productResponse = await axios.post(
        "http://localhost:3000/product/view",
        {},
        { withCredentials: true }
      );
      const prod = productResponse.data.products || [];

      const ordersData = ord
        .filter((order) => order.isCompleted) // Fixed filter
        .map((order) => {
          const product = prod.find((p) => p._id === order.productId);
          return {
            ...order,
            productName: product ? product.name : "Unknown Product",
            productDescription: product ? product.description : "",
          };
        });

      setOrders(ord);
      setOrderDetails(ordersData); // Updated state with processed data
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Your Orders
      </Typography>
      {orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        <List>
          {orderDetails.map((order) => (
            <ListItem key={order._id}>
              <ListItemText
                primary={`Order ID: ${order._id}`}
                secondary={`Product Name: ${order.productName}, Quantity: ${order.quantity}, Description: ${order.productDescription}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
}

export default ViewUserOrders;
