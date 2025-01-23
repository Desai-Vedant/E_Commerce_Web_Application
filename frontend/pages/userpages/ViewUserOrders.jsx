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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);

  const fetchOrders = async () => {
    try {
      const orderResponse = await axios.post(
        "http://localhost:3000/order/view",
        { orderStatus: true },
        { withCredentials: true }
      );
      const ordersData = orderResponse.data.orders || [];

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
      {orderDetails.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        <List>
          {orderDetails.map((order) => (
            <ListItem key={order._id}>
              <ListItemText
                primary={`Order ID: ${order.orderId} | Product Name: ${order.productName} | Price: ${order.productPrice}`}
                secondary={`Description: ${order.productDetails} | Quantity: ${order.orderQuantity} | Total price : ${order.totalPrice}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
}

export default ViewUserOrders;
