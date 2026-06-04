import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Autocomplete
} from "@mui/material";

const AddRawMaterialDrawer = ({ open, onClose, editItem }) => {

  /* ================= STATE ================= */
  const [form, setForm] = useState({
    name: "",
    category: "",
    purchase_unit_id: "",
    consume_unit_id: "",
    conversion_factor: "",
    purchase_price: "",
    tax_type: "GST",
    tax_percentage: "",
    minimum_stock_unit_id: "",
    minimum_stock_level: "",
    reorder_stock_unit_id: "",
    reorder_stock_level: "",
    stock_update_frequency: "DAILY",
    barcode: "",
    expiry_days: ""
  });

  const [units, setUnits] = useState([]);
  const [categories, setCategories] = useState([]);

  /* ================= EFFECTS ================= */
  useEffect(() => {
    if (!open) return;

    if (editItem) {
      setForm({
        name: editItem.name || "",
        category: editItem.category || "",
        purchase_unit_id: editItem.purchase_unit_id || "",
        consume_unit_id: editItem.consume_unit_id || "",
        conversion_factor: editItem.conversion_factor || "",
        purchase_price: editItem.purchase_price || "",
        tax_type: editItem.tax_type || "GST",
        tax_percentage: editItem.tax_percentage || "",
        minimum_stock_unit_id: editItem.consume_unit_id || "",
        minimum_stock_level: editItem.minimum_stock_level || "",
        reorder_stock_unit_id: editItem.consume_unit_id || "",
        reorder_stock_level: editItem.reorder_stock_level || "",
        stock_update_frequency: editItem.stock_update_frequency || "DAILY",
        barcode: editItem.barcode || "",
        expiry_days: editItem.expiry_days || ""
      });
    } else {
      // Reset Form on Open (Create Mode)
      setForm({
        name: "",
        category: "",
        purchase_unit_id: "",
        consume_unit_id: "",
        conversion_factor: "",
        purchase_price: "",
        tax_type: "GST",
        tax_percentage: "",
        minimum_stock_unit_id: "",
        minimum_stock_level: "",
        reorder_stock_unit_id: "",
        reorder_stock_level: "",
        stock_update_frequency: "DAILY",
        barcode: "",
        expiry_days: ""
      });
    }

    const token = localStorage.getItem("authToken");

    const fetchUnits = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/units/getUnit", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const json = await res.json();
        if (json.success) {
          setUnits(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch units", err);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/raw/get", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const uniqueCats = [...new Set(json.data.map(item => item.category).filter(Boolean))];
          setCategories(uniqueCats);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchUnits();
    fetchCategories();
  }, [open, editItem]);

  /* ================= HANDLERS ================= */
  const handleChange = (key, value) => {
    setForm(prev => {
      // 🔥 MAIN LOGIC: consume unit = min & reorder unit
      if (key === "consume_unit_id") {
        return {
          ...prev,
          consume_unit_id: value,
          minimum_stock_unit_id: value,
          reorder_stock_unit_id: value
        };
      }

      return { ...prev, [key]: value };
    });
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Token missing. Please login again.");
        return;
      }

      // 🔥 FINAL GUARANTEE PAYLOAD
      const payload = {
        ...form,
        purchase_unit_id: Number(form.purchase_unit_id),
        consume_unit_id: Number(form.consume_unit_id),

        // 👇 HARD RULE (no escape)
        minimum_stock_unit_id: Number(form.consume_unit_id),
        reorder_stock_unit_id: Number(form.consume_unit_id),

        conversion_factor: Number(form.conversion_factor),
        purchase_price: Number(form.purchase_price),
        tax_percentage: Number(form.tax_percentage),
        minimum_stock_level: Number(form.minimum_stock_level),
        reorder_stock_level: Number(form.reorder_stock_level),
        expiry_days: Number(form.expiry_days)
      };

      console.log("FINAL PAYLOAD 👉", payload);

      const url = editItem 
        ? `http://localhost:5000/api/raw/update/${editItem.id}`
        : "http://localhost:5000/api/raw/create";
      const method = editItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to save raw material");
        return;
      }

      alert(editItem ? "Raw Material updated successfully ✅" : "Raw Material created successfully ✅");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ p: 4, bgcolor: "#f9fafb" }}>

        <Typography variant="h6" fontWeight={700} mb={3}>
          {editItem ? "Edit Raw Material" : "Add Raw Material"}
        </Typography>

        {/* BASIC DETAILS */}
        <Paper sx={section}>
          <Typography sx={sectionTitle}>Basic Details</Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                required
                fullWidth
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <Autocomplete
                freeSolo
                options={categories}
                value={form.category}
                onChange={(event, newValue) => {
                  handleChange("category", newValue || "");
                }}
                onInputChange={(event, newInputValue) => {
                  handleChange("category", newInputValue || "");
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Category" fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={3}>
              <Autocomplete
                options={units}
                getOptionLabel={(option) => option ? `${option.unit_name} (${option.unit_symbol})` : ""}
                value={units.find(u => Number(u.id) === Number(form.purchase_unit_id)) || null}
                onChange={(event, newValue) => {
                  handleChange("purchase_unit_id", newValue ? newValue.id : "");
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Purchase Unit" size="small" fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={3}>
              <Autocomplete
                options={units}
                getOptionLabel={(option) => option ? `${option.unit_name} (${option.unit_symbol})` : ""}
                value={units.find(u => Number(u.id) === Number(form.consume_unit_id)) || null}
                onChange={(event, newValue) => {
                  handleChange("consume_unit_id", newValue ? newValue.id : "");
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Consume Unit" size="small" fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Conversion Factor"
                type="number"
                helperText="Example: 1 Kg = 1000 gm"
                fullWidth
                value={form.conversion_factor}
                onChange={(e) => handleChange("conversion_factor", e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* PRICE & TAX */}
        <Paper sx={section}>
          <Typography sx={sectionTitle}>Price & Tax</Typography>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                label="Purchase Price"
                type="number"
                fullWidth
                value={form.purchase_price}
                onChange={(e) => handleChange("purchase_price", e.target.value)}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                label="Tax Percentage (%)"
                type="number"
                fullWidth
                value={form.tax_percentage}
                onChange={(e) => handleChange("tax_percentage", e.target.value)}
              />
            </Grid>

            <Grid item xs={4}>
              <Typography fontSize={13} mb={1}>Tax Type</Typography>
              <RadioGroup
                row
                value={form.tax_type}
                onChange={(e) => handleChange("tax_type", e.target.value)}
              >
                <FormControlLabel value="GST" control={<Radio />} label="GST" />
              </RadioGroup>
            </Grid>
          </Grid>
        </Paper>

        {/* STOCK LEVELS */}
        <Paper sx={section}>
          <Typography sx={sectionTitle}>Stock Levels</Typography>

          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField
                label="Minimum Stock Level"
                type="number"
                fullWidth
                value={form.minimum_stock_level}
                onChange={(e) => handleChange("minimum_stock_level", e.target.value)}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                label="Reorder Stock Level"
                type="number"
                fullWidth
                value={form.reorder_stock_level}
                onChange={(e) => handleChange("reorder_stock_level", e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <Select
                fullWidth
                value={form.stock_update_frequency}
                onChange={(e) => handleChange("stock_update_frequency", e.target.value)}
              >
                <MenuItem value="DAILY">Daily</MenuItem>
                <MenuItem value="WEEKLY">Weekly</MenuItem>
                <MenuItem value="MONTHLY">Monthly</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Paper>

        {/* OTHER DETAILS */}
        <Paper sx={section}>
          <Typography sx={sectionTitle}>Other Details</Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Barcode"
                fullWidth 
                value={form.barcode}
                onChange={(e) => handleChange("barcode", e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Expiry Days"
                type="number"
                fullWidth
                value={form.expiry_days}
                onChange={(e) => handleChange("expiry_days", e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* ACTION */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Box>

      </DialogContent>
    </Dialog>
  );
};

/* ================= STYLES ================= */
const section = { p: 3, mb: 3, borderRadius: 2 };
const sectionTitle = { fontWeight: 600, mb: 2 };

export default AddRawMaterialDrawer;
