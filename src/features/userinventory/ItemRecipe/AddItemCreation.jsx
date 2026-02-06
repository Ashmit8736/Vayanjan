import React, { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";

const AddItemCreation = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "Sweet",
    selling_price: "",
  });

  const [loading, setLoading] = useState(false);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSave = async () => {
  if (!formData.name || !formData.category || !formData.selling_price) {
    alert("Please fill all fields");
    return;
  }

  const token = localStorage.getItem("authToken");

  if (!token) {
    alert("Token missing. Please login again.");
    return;
  }

  try {
    setLoading(true);

    const res = await fetch("http://localhost:5000/api/item/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: formData.name,
        category: formData.category,
        selling_price: Number(formData.selling_price),
      }),
    });

    const result = await res.json();
    console.log("CREATE ITEM RESPONSE:", result);

    if (!res.ok) {
      alert(result.message || "Failed to create item");
      return;
    }

    // ✅ SUCCESS FLOW (ONLY ADDITIONS)
    alert("Item created successfully ✅");

    // 🔄 FORM RESET
    setFormData({
      name: "",
      category: "Sweet",
      selling_price: "",
    });

    // 🔔 PARENT REFRESH + POPUP CLOSE
    if (typeof onSuccess === "function") {
      onSuccess();
    }
  } catch (error) {
    console.error("Create item error:", error);
    alert("Server error");
  } finally {
    setLoading(false);
  }
};

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {/* ITEM NAME */}
      <TextField
        label="Item Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter item name"
        fullWidth
      />

      {/* CATEGORY */}
      <TextField
        select
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        fullWidth
      >
        <MenuItem value="Sweet">Sweet</MenuItem>
        <MenuItem value="Snacks">Snacks</MenuItem>
        <MenuItem value="Vegetable">Vegetable</MenuItem>
        <MenuItem value="Roti">Roti</MenuItem>
      </TextField>

      {/* SELLING PRICE */}
      <TextField
        label="Selling Price"
        name="selling_price"
        type="number"
        value={formData.selling_price}
        onChange={handleChange}
        placeholder="Enter price"
        fullWidth
      />

      {/* LOADER */}
      {loading && (
        <Box display="flex" justifyContent="center">
          <CircularProgress size={24} />
        </Box>
      )}

      {/* SAVE BUTTON */}
      <Box display="flex" justifyContent="flex-end" mt={1}>
        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            padding: "8px 16px",
            background: "#C62828",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Save Item
        </button>
      </Box>
    </Box>
  );
};

export default AddItemCreation;