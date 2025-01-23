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
import toast, { Toaster } from "react-hot-toast";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const navigate = useNavigate();

  // Fetch cart and product data
  const fetchData = async () => {
    try {
      const orderResponse = await axios.post(
        "http://localhost:3000/order/view",
        { orderStatus: false },
        { withCredentials: true }
      );

      const orders = orderResponse.data.orders || [];
      setCartItems(orders);
    } catch (err) {
      setError("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Calculate total cost whenever cartItems changes
    const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    setTotalCost(total);
  }, [cartItems]);

  // handlePayment Function
  const handlePayment = async () => {
    let paymentVerified = false;

    try {
      const amount = totalCost; // convert to paise
      const res = await fetch(`http://localhost:3000/payment/order`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          amount,
        }),
      });

      const data = await res.json();
      console.log(data);
      paymentVerified = await handlePaymentVerify(data.data);
    } catch (error) {
      console.log(error);
    }
    return paymentVerified; // Return the payment verification status
  };

  // handlePaymentVerify Function
  const handlePaymentVerify = async (data) => {
    return new Promise((resolve) => {
      const options = {
        key: import.meta.env.RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Shop Zone",
        description: "Shop Zone Payment",
        order_id: data.id,
        handler: async (response) => {
          console.log("response", response);
          try {
            const res = await fetch(`http://localhost:3000/payment/verify`, {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await res.json();
            if (verifyData.message) {
              toast.success(verifyData.message);
              resolve(true); // Resolve promise with true on success
            } else {
              resolve(false); // Resolve promise with false on failure
            }
          } catch (error) {
            console.log(error);
            resolve(false); // Resolve promise with false on error
          }
        },
        theme: {
          color: "#5f63b8",
        },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    });
  };

  // Place order (update isCompleted for all items in cart)
  const placeOrder = async () => {
    try {
      const paymentSuccessful = await handlePayment();
      if (paymentSuccessful) {
        for (const item of cartItems) {
          await axios.post(
            "http://localhost:3000/order/update",
            { orderId: item._id, isCompleted: true },
            { withCredentials: true }
          );
        }
        alert("Order placed successfully!");
        navigate("/userhome");
      } else {
        alert("Payment failed. Please try again.");
      }
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
                secondary={`${item.productDetails} - Price: Rs.${item.productPrice} x Quantity: ${item.orderQuantity}`}
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
