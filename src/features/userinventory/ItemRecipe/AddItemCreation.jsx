import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  MenuItem,
  CircularProgress,
  Button,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { createItem, updateItem } from "@services/api/itemAPI";

const AddItemCreation = ({ item, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "Sweet",
    selling_price: "",
    item_unit_id: "",
    original_qty: "",
  });

  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add unit state
  const [unitOpen, setUnitOpen] = useState(false);
  const [newUnit, setNewUnit] = useState({ name: "", symbol: "" });
  const [unitSaving, setUnitSaving] = useState(false);

  // Fetch all units from backend
  const fetchUnits = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://localhost:5000/api/units/getUnit", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success) {
        setUnits(json.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch units", err);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SAVE DYNAMIC UNIT ================= */
  const handleAddUnit = async () => {
    if (!newUnit.name || !newUnit.symbol) {
      alert("Please fill all unit fields");
      return;
    }

    try {
      setUnitSaving(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Token missing. Please login again.");
        return;
      }

      const res = await fetch("http://localhost:5000/api/units/addUnit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          unit_name: newUnit.name,
          unit_symbol: newUnit.symbol,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create unit");
        return;
      }

      alert("Unit created successfully ✅");
      const addedUnit = {
        id: data.unit_id,
        unit_name: newUnit.name,
        unit_symbol: newUnit.symbol,
      };

      setUnits((prev) => [...prev, addedUnit]);
      setFormData((prev) => ({ ...prev, item_unit_id: data.unit_id }));
      setNewUnit({ name: "", symbol: "" });
      setUnitOpen(false);
    } catch (err) {
      console.error("Add unit error:", err);
      alert("Error adding unit");
    } finally {
      setUnitSaving(false);
    }
  };

  /* ================= SAVE ITEM ================= */
  const handleSave = async () => {
    if (!formData.name || !formData.category || !formData.selling_price) {
      alert("Please fill name, category and price");
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
          item_unit_id: formData.item_unit_id ? Number(formData.item_unit_id) : null,
          original_qty: Number(formData.original_qty || 0),
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Failed to create item");
        return;
      }

      alert("Item created successfully ✅");

      // 🔄 FORM RESET
      setFormData({
        name: "",
        category: "Sweet",
        selling_price: "",
        item_unit_id: "",
        original_qty: "",
      });

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
        placeholder="Enter item name (e.g. Balushahi)"
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

      {/* UNIT SELECTION */}
      <Box display="flex" gap={1} alignItems="flex-start">
        <Box flex={1}>
          <Autocomplete
            options={Array.isArray(units) ? units : []}
            getOptionLabel={(option) => option ? `${option.unit_name} (${option.unit_symbol})` : ""}
            value={(Array.isArray(units) ? units.find((u) => Number(u.id) === Number(formData.item_unit_id)) : null) || null}
            onChange={(event, newValue) => {
              setFormData((prev) => ({ ...prev, item_unit_id: newValue ? newValue.id : "" }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Unit"
                placeholder="Select Unit (e.g. kg, pcs)"
                fullWidth
              />
            )}
          />
        </Box>
        <Button
          variant="outlined"
          onClick={() => setUnitOpen(true)}
          sx={{
            height: 56,
            textTransform: "none",
            borderColor: "#CBD5E1",
            color: "#475569",
            fontWeight: 600,
            "&:hover": { borderColor: "#9CA3AF" },
          }}
        >
          + Add Unit
        </Button>
      </Box>

      {/* SELLING PRICE */}
      <TextField
        label="Selling Price"
        name="selling_price"
        type="number"
        value={formData.selling_price}
        onChange={handleChange}
        placeholder="Enter price (e.g. 200)"
        fullWidth
      />

      {/* QUANTITY */}
      <TextField
        label="Quantity"
        name="original_qty"
        type="number"
        value={formData.original_qty}
        onChange={handleChange}
        placeholder="Enter quantity (e.g. 50)"
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

      {/* ===== ADD NEW UNIT MODAL ===== */}
      <Dialog open={unitOpen} onClose={() => setUnitOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Unit</DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Unit Name"
            placeholder="e.g. Kilogram, Piece"
            value={newUnit.name}
            onChange={(e) => setNewUnit((prev) => ({ ...prev, name: e.target.value }))}
            fullWidth
            size="small"
          />
          <TextField
            label="Unit Symbol"
            placeholder="e.g. kg, pcs"
            value={newUnit.symbol}
            onChange={(e) => setNewUnit((prev) => ({ ...prev, symbol: e.target.value }))}
            fullWidth
            size="small"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setUnitOpen(false)} sx={{ color: "#475569", fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddUnit}
            disabled={unitSaving}
            sx={{ fontWeight: 600 }}
          >
            {unitSaving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddItemCreation;