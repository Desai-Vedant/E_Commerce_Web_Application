import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Grid2 } from "@mui/material";
import axios from "axios";

function SellerHome() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [error, setError] = useState("");

  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/product/view",
        {},
        {
          withCredentials: true,
        }
      );
      setProducts(response.data.products || []);
    } catch (err) {
      setError("Error fetching products.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Update product
  const handleUpdateSubmit = async () => {
    try {
      const { _id, name, description, price } = selectedProduct;
      await axios.post(
        "http://localhost:3000/product/update",
        {
          productId: _id,
          name,
          description,
          price: parseFloat(price),
        },
        { withCredentials: true }
      );
      fetchProducts();
      setUpdateModalOpen(false);
    } catch (err) {
      setError("Error updating product.");
    }
  };

  // Delete product
  const handleDeleteSubmit = async () => {
    try {
      const { _id } = selectedProduct;
      await axios.post(
        "http://localhost:3000/product/delete",
        {
          productId: _id,
        },
        { withCredentials: true }
      );
      fetchProducts();
      setDeleteModalOpen(false);
    } catch (err) {
      setError("Error deleting product.");
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Seller Dashboard
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
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
                  onClick={() => {
                    setSelectedProduct(product);
                    setUpdateModalOpen(true);
                  }}
                >
                  Update
                </Button>
                <Button
                  color="secondary"
                  onClick={() => {
                    setSelectedProduct(product);
                    setDeleteModalOpen(true);
                  }}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      {/* Update Modal */}
      {selectedProduct && (
        <Dialog
          open={updateModalOpen}
          onClose={() => setUpdateModalOpen(false)}
        >
          <DialogTitle>Update Product</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              fullWidth
              margin="dense"
              value={selectedProduct.name}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, name: e.target.value })
              }
            />
            <TextField
              label="Description"
              fullWidth
              margin="dense"
              multiline
              rows={3}
              value={selectedProduct.description}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  description: e.target.value,
                })
              }
            />
            <TextField
              label="Price"
              fullWidth
              margin="dense"
              type="number"
              value={selectedProduct.price}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  price: e.target.value,
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUpdateModalOpen(false)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleUpdateSubmit}
              color="primary"
              variant="contained"
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      {selectedProduct && (
        <Dialog
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the product "
              {selectedProduct.name}"?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteModalOpen(false)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleDeleteSubmit}
              color="secondary"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

export default SellerHome;
