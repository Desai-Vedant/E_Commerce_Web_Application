import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Grid2 } from "@mui/material";
import axios from "axios";

function UserHome() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartDialogOpen, setCartDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/product/view",
        {},
        { withCredentials: true }
      );
      setProducts(response.data.products || []);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle Add to Cart
  const handleAddToCart = async () => {
    try {
      await axios.post(
        "http://localhost:3000/order/add",
        {
          productId: selectedProduct._id,
          quantity: parseInt(quantity, 10),
        },
        { withCredentials: true }
      );
      setCartDialogOpen(false);
      alert("Product added to cart successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error adding product to cart.");
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
        Products
      </Typography>
      <Grid2 container spacing={3}>
        {products.map((product) => (
          <Grid2 xs={12} sm={6} md={4} key={product._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2">{product.description}</Typography>
                <Typography variant="body1">
                  Price: Rs. {product.price}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    setSelectedProduct(product);
                    setQuantity(1); // Reset quantity
                    setCartDialogOpen(true);
                  }}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      {/* Add to Cart Dialog */}
      {selectedProduct && (
        <Dialog open={cartDialogOpen} onClose={() => setCartDialogOpen(false)}>
          <DialogTitle>Add to Cart</DialogTitle>
          <DialogContent>
            <Typography>Add "{selectedProduct.name}" to your cart.</Typography>
            <TextField
              label="Quantity"
              type="number"
              fullWidth
              margin="dense"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              inputProps={{ min: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCartDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleAddToCart}
              color="primary"
              variant="contained"
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

export default UserHome;
