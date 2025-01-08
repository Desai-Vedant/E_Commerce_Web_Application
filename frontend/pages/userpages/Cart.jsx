import React, { useEffect, useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const navigate = useNavigate();

  // Fetch cart and product data
  const fetchData = async () => {
    try {
      const [orderResponse, productResponse] = await Promise.all([
        axios.post(
          "http://localhost:3000/order/view",
          {},
          { withCredentials: true }
        ),
        axios.post(
          "http://localhost:3000/product/view",
          {},
          { withCredentials: true }
        ),
      ]);

      const orders = orderResponse.data.orders.filter(
        (order) => !order.isCompleted
      );
      const productsData = productResponse.data.products;

      // Match product details with cart items
      const cartDetails = orders.map((order) => {
        const product = productsData.find(
          (product) => product._id === order.productId
        );
        return {
          ...order,
          productName: product?.name || "Unknown Product",
          description: product?.description || "No description available",
          price: product?.price || 0,
          totalPrice: (product?.price || 0) * order.quantity,
        };
      });

      setCartItems(cartDetails);
      setProducts(productsData);

      // Calculate total cost
      const total = cartDetails.reduce((sum, item) => sum + item.totalPrice, 0);
      setTotalCost(total);
    } catch (err) {
      setError("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Place order (update isCompleted for all items in cart)
  const placeOrder = async () => {
    try {
      for (const item of cartItems) {
        await axios.post(
          "http://localhost:3000/order/update",
          { orderId: item._id, isCompleted: true },
          { withCredentials: true }
        );
      }
      alert("Order placed successfully!");
      navigate("/userhome");
    } catch (err) {
      setError("Error placing the order. Please try again.");
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  // Handle delete action
  const handleDelete = async () => {
    try {
      await axios.post(
        "http://localhost:3000/order/delete",
        { orderId: itemToDelete._id },
        { withCredentials: true }
      );
      alert("Item deleted successfully!");
      setCartItems(cartItems.filter((item) => item._id !== itemToDelete._id));
      setTotalCost(
        cartItems
          .filter((item) => item._id !== itemToDelete._id)
          .reduce((sum, item) => sum + item.totalPrice, 0)
      );
    } catch (err) {
      alert("Error deleting item. Please try again.");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      <List>
        {cartItems.map((item) => (
          <div key={item._id}>
            <ListItem>
              <ListItemText
                primary={item.productName}
                secondary={`${item.description} - Price: Rs.${item.price} x Quantity: ${item.quantity}`}
              />
              <Typography>Total: Rs.{item.totalPrice.toFixed(2)}</Typography>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => openDeleteDialog(item)}
                style={{ marginLeft: "10px" }}
              >
                Delete
              </Button>
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
      <Typography variant="h6" style={{ marginTop: "20px" }}>
        Total Cost: Rs.{totalCost.toFixed(2)}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={placeOrder}
        style={{ marginTop: "20px" }}
      >
        Place Order
      </Button>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            {itemToDelete?.productName || "this item"} from your cart?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="secondary" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Cart;
