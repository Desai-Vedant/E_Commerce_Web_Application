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

  // Fetch orders from the backend
  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/order/view",
        {},
        { withCredentials: true }
      );
      setOrders(response.data.orders || []);
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
          {orders.map((order) => (
            <ListItem key={order._id}>
              <ListItemText
                primary={`Order ID: ${order._id}`}
                secondary={`Product ID: ${order.productId}, Quantity: ${
                  order.quantity
                }, Status: ${order.isCompleted ? "Completed" : "Pending"}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
}

export default ViewUserOrders;
