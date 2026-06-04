import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Grid,
  Autocomplete,
  InputAdornment
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import BalanceIcon from "@mui/icons-material/Balance";

const QuickAddRawMaterial = ({ open, onClose, onSuccess }) => {
  /* ================= STATE ================= */
  const [form, setForm] = useState({
    name: "",
    category: "",
    purchase_unit_id: "",
    consume_unit_id: "",
    conversion_factor: "1"
  });

  const [units, setUnits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= EFFECTS ================= */
  useEffect(() => {
    if (!open) return;

    // Reset Form
    setForm({
      name: "",
      category: "",
      purchase_unit_id: "",
      consume_unit_id: "",
      conversion_factor: "1"
    });

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
  }, [open]);

  /* ================= HANDLERS ================= */
  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const getSelectedUnitSymbol = (unitId) => {
    const unit = units.find(u => u.id === Number(unitId));
    return unit ? unit.unit_symbol : "";
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!form.name || !form.purchase_unit_id || !form.consume_unit_id) {
      alert("Please fill all required fields (*)");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Token missing. Please login again.");
        return;
      }

      // Default the rest of the fields for raw material creation
      const payload = {
        name: form.name,
        category: form.category || "Grocery",
        purchase_unit_id: Number(form.purchase_unit_id),
        consume_unit_id: Number(form.consume_unit_id),
        conversion_factor: Number(form.conversion_factor || 1),
        purchase_price: 0,
        tax_type: "GST",
        tax_percentage: 0,
        minimum_stock_unit_id: Number(form.consume_unit_id),
        minimum_stock_level: 0,
        reorder_stock_unit_id: Number(form.consume_unit_id),
        reorder_stock_level: 0,
        stock_update_frequency: "DAILY",
        barcode: "",
        expiry_days: 0
      };

      const res = await fetch("http://localhost:5000/api/raw/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to add raw material");
        return;
      }

      alert("Raw Material added successfully ✅");
      if (typeof onSuccess === "function") {
        onSuccess();
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert("Server error while adding raw material");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ p: 4, bgcolor: "#ffffff" }}>
        
        {/* HEADER */}
        <Typography variant="h5" fontWeight={700} color="#111827" mb={1}>
          Add Basic Raw Material Details
        </Typography>
        
        {/* BANNER SUBTEXT */}
        <Box sx={{ bgcolor: "#F3F4F6", p: 2, borderRadius: 2, mb: 4 }}>
          <Typography variant="body2" color="#4B5563">
            Quickly add raw materials by selecting and inputting the required components. The raw materials will be added seamlessly to your inventory.
          </Typography>
        </Box>

        {/* INPUT FIELDS */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" fontWeight={700} color="#374151" mb={1}>
              Raw material name <span style={{ color: "#EF4444" }}>*</span>
            </Typography>
            <TextField
              placeholder="e.g. dal cheni"
              required
              fullWidth
              size="small"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              sx={{ bgcolor: "#ffffff" }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" fontWeight={700} color="#374151" mb={1}>
              Category
            </Typography>
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
                <TextField {...params} placeholder="e.g. Grocery" size="small" fullWidth />
              )}
            />
          </Grid>
        </Grid>

        {/* UNITS SECTION */}
        <Typography variant="subtitle1" fontWeight={700} color="#111827" mb={2}>
          Units
        </Typography>

        <Grid container spacing={3} mb={4}>
          {/* Purchase Unit */}
          <Grid item xs={12} md={6}>
            <Typography variant="body2" fontWeight={700} color="#374151" mb={1}>
              Purchase Units <span style={{ color: "#EF4444" }}>*</span>
            </Typography>
            <Autocomplete
              options={units}
              getOptionLabel={(option) => option ? `${option.unit_name} (${option.unit_symbol})` : ""}
              value={units.find(u => Number(u.id) === Number(form.purchase_unit_id)) || null}
              onChange={(event, newValue) => {
                handleChange("purchase_unit_id", newValue ? newValue.id : "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select Purchase Unit"
                  size="small"
                  fullWidth
                  required
                />
              )}
            />
            
            {/* Helper Card */}
            <Box sx={{ display: "flex", gap: 1.5, p: 2, mt: 1.5, border: "1px solid #E5E7EB", borderRadius: 2, bgcolor: "#F9FAFB" }}>
              <InventoryIcon sx={{ color: "#6B7280", fontSize: 20, mt: 0.2 }} />
              <Typography variant="caption" color="#4B5563">
                A purchase unit in inventory is the unit used to order or receive goods from a supplier. (Example kg, ltr)
              </Typography>
            </Box>
          </Grid>

          {/* Consumption Unit */}
          <Grid item xs={12} md={6}>
            <Typography variant="body2" fontWeight={700} color="#374151" mb={1}>
              Consumption Units <span style={{ color: "#EF4444" }}>*</span>
            </Typography>
            <Autocomplete
              options={units}
              getOptionLabel={(option) => option ? `${option.unit_name} (${option.unit_symbol})` : ""}
              value={units.find(u => Number(u.id) === Number(form.consume_unit_id)) || null}
              onChange={(event, newValue) => {
                handleChange("consume_unit_id", newValue ? newValue.id : "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select Consumption Unit"
                  size="small"
                  fullWidth
                  required
                />
              )}
            />
            
            {/* Helper Card */}
            <Box sx={{ display: "flex", gap: 1.5, p: 2, mt: 1.5, border: "1px solid #E5E7EB", borderRadius: 2, bgcolor: "#F9FAFB" }}>
              <BalanceIcon sx={{ color: "#6B7280", fontSize: 20, mt: 0.2 }} />
              <Typography variant="caption" color="#4B5563">
                A consumption unit in inventory is the unit in which goods are used or consumed. (Example Gram, ml)
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* RELATIONSHIP CONVERSION BOX */}
        {form.purchase_unit_id && form.consume_unit_id && (
          <Box sx={{ border: "1px solid #E5E7EB", borderRadius: 2, p: 2.5, mb: 4, bgcolor: "#ffffff" }}>
            <Typography variant="body2" fontWeight={700} color="#374151" mb={1.5}>
              Purchase unit and consumption unit of {form.name || "[Raw material name]"} are related as follows:
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography variant="body2" color="#374151">
                One {getSelectedUnitSymbol(form.purchase_unit_id)} of {form.name || "[Raw material name]"} is equivalent to
              </Typography>
              <TextField
                type="number"
                size="small"
                value={form.conversion_factor}
                onChange={(e) => handleChange("conversion_factor", e.target.value)}
                sx={{ width: 100 }}
              />
              <Typography variant="body2" color="#374151">
                {getSelectedUnitSymbol(form.consume_unit_id)} .
              </Typography>
            </Box>
          </Box>
        )}

        {/* ACTIONS */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            onClick={onClose}
            sx={{
              color: "#374151",
              border: "1px solid #D1D5DB",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              borderRadius: 2,
              "&:hover": { bgcolor: "#F3F4F6", border: "1px solid #9CA3AF" }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
            sx={{
              bgcolor: "#2563EB",
              color: "#ffffff",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              borderRadius: 2,
              "&:hover": { bgcolor: "#1D4ED8" }
            }}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </Box>

      </DialogContent>
    </Dialog>
  );
};

export default QuickAddRawMaterial;
