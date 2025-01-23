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

function ViewSellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch orders
        const orderResponse = await axios.post(
          "http://localhost:3000/order/view",
          {},
          { withCredentials: true }
        );
        const sellerOrders = orderResponse.data.orders || [];

        // Fetch products only if there are orders
        if (orders) {
          setOrders(sellerOrders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching data."
        );
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

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
        Completed Orders
      </Typography>
      {orders.length > 0 ? (
        <List>
          {orders.map((order) => (
            <ListItem key={order._id}>
              <ListItemText
                primary={`Order ID: ${order.orderId} - ${order.productName}`}
                secondary={`Quantity: ${order.orderQuantity} | Details: ${order.productDetails} | Total price: ${order.totalPrice}`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No completed orders found.</Typography>
      )}
    </div>
  );
}

export default ViewSellerOrders;
