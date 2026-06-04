import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { createItem, updateItem } from "@services/api/itemAPI";

const AddItemCreation = ({ item, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "Sweet",
    selling_price: "",
    short_code: "",
    item_unit_id: "",
  });

  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        category: item.category || "Sweet",
        selling_price: item.selling_price || "",
        short_code: item.short_code || "",
        item_unit_id: item.item_unit_id || "",
      });
    } else {
      setFormData({
        name: "",
        category: "Sweet",
        selling_price: "",
        short_code: "",
        item_unit_id: "",
      });
    }
  }, [item]);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/units/getUnit");
        const data = await res.json();
        if (res.ok && Array.isArray(data.data)) {
          setUnits(data.data);
        }
      } catch (error) {
        console.error("Failed loading units", error);
      }
    };

    fetchUnits();
  }, []);

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

    const payload = {
      name: formData.name,
      category: formData.category,
      selling_price: Number(formData.selling_price),
      short_code: formData.short_code || null,
      item_unit_id: formData.item_unit_id ? Number(formData.item_unit_id) : null,
    };

    try {
      setLoading(true);

      if (item && item.id) {
        const res = await updateItem(item.id, payload);
        if (!res?.success) {
          alert(res?.message || "Failed to update item");
          return;
        }

        if (typeof onSuccess === "function") {
          onSuccess({ ...item, ...payload });
        }
        return;
      }

      const res = await createItem(payload);
      if (!res?.success) {
        alert(res?.message || "Failed to create item");
        return;
      }

      alert("Item created successfully ✅");

      const newItem = {
        id: res.item_id || Date.now(),
        ...payload,
      };

      setFormData({
        name: "",
        category: "Sweet",
        selling_price: "",
        short_code: "",
        item_unit_id: "",
      });

      if (typeof onSuccess === "function") {
        onSuccess(newItem);
      }
    } catch (error) {
      console.error("Save item error:", error);
      alert(error?.message || "Server error");
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

      {/* UNIT */}
      <TextField
        select
        label="Unit"
        name="item_unit_id"
        value={formData.item_unit_id}
        onChange={handleChange}
        fullWidth
      >
        <MenuItem value="">Select unit</MenuItem>
        {units.map((unit) => (
          <MenuItem key={unit.id} value={unit.id}>
            {unit.unit_name} {unit.unit_symbol ? `(${unit.unit_symbol})` : ""}
          </MenuItem>
        ))}
      </TextField>

      {/* SHORT CODE */}
      <TextField
        label="Short Code"
        name="short_code"
        value={formData.short_code}
        onChange={handleChange}
        placeholder="Enter short code"
        fullWidth
      />

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
      <Box display="flex" justifyContent="flex-end" gap={1} mt={1}>
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          style={{
            padding: "8px 16px",
            background: "#E0E0E0",
            color: "#000",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          type="button"
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
          {item ? "Update Item" : "Save Item"}
        </button>
      </Box>
    </Box>
  );
};

export default AddItemCreation;