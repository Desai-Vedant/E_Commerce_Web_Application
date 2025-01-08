import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";

function AddProduct() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    if (!productName || !description || !price) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/product/add",
        {
          name: productName,
          description,
          price: parseFloat(price),
        },
        { withCredentials: true }
      );
      setSuccess(response.data.message);
      setError("");
      setProductName("");
      setDescription("");
      setPrice("");
    } catch (err) {
      setError(err.response?.data?.message || "Error adding product.");
      setSuccess("");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 4,
        p: 2,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Add New Product
      </Typography>
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
      {success && (
        <Typography color="success.main" variant="body2">
          {success}
        </Typography>
      )}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
        <TextField
          label="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          variant="outlined"
          multiline
          rows={3}
        />
        <TextField
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          fullWidth
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Add Product
        </Button>
      </Box>
    </Box>
  );
}

export default AddProduct;
