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
        const orders = orderResponse.data.orders || [];

        // Fetch products only if there are orders
        if (orders.length > 0) {
          const productResponse = await axios.post(
            "http://localhost:3000/product/view",
            {},
            { withCredentials: true }
          );
          const products = productResponse.data.products || [];

          // Enrich orders with product details
          const enrichedOrders = orders
            .filter((order) => order.isCompleted)
            .map((order) => {
              const product = products.find((p) => p._id === order.productId);
              return {
                ...order,
                productName: product ? product.name : "Unknown Product",
                productDescription: product ? product.description : "",
              };
            });

          setOrders(enrichedOrders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching data."
        );
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
                primary={`Order ID: ${order._id} - ${order.productName}`}
                secondary={`Quantity: ${order.quantity} | ${order.productDescription}`}
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
