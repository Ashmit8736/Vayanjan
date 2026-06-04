import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  IconButton,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import { useEffect, useState, React } from "react";
import AddRecipeCreation from "./AddRecipeCreation";

const RecipeCreation = () => {
  const [items, setItems] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [materials, setMaterials] = useState([]);

  // Edit Dialog States
  const [openEdit, setOpenEdit] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({
    item_id: "",
    item_quantity: "1",
    item_unit_id: "",
    materials: [],
  });

  const [rawMaterials, setRawMaterials] = useState([]);
  const [units, setUnits] = useState([]);

  const token = localStorage.getItem("authToken");

  /* ================= GET ITEMS (SOURCE OF RECIPES) ================= */
  const fetchItems = async () => {
    if (!token) {
      alert("Token missing. Please login again.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/item/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Failed to load items");
        return;
      }

      setItems(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Fetch items error:", error);
      alert("Server error");
    }
  };

  const fetchUnits = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/units/getUnit");
      const result = await res.json();
      setUnits(Array.isArray(result.data) ? result.data : result || []);
    } catch (err) {
      console.error("Fetch units error:", err);
    }
  };

  const fetchRawMaterials = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/raw/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      setRawMaterials(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error("Fetch raw materials error:", err);
    }
  };

  /* ================= GET RECIPE BY ITEM ================= */
  const fetchRecipeItems = async (itemId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/recipe/item/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();
      console.log("RECIPE ITEM RESPONSE:", result);

      setMaterials(Array.isArray(result.data) ? result.data : []);
      setOpenView(true);
    } catch (error) {
      console.error("Fetch recipe items error:", error);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchUnits();
    fetchRawMaterials();
  }, []);

  /* ================= EDIT RECIPE HANDLERS ================= */
  const handleEditClick = async (item) => {
    setEditItem(item);
    const itemId = item.item_id || item.id;

    try {
      const res = await fetch(
        `http://localhost:5000/api/recipe/item/${itemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await res.json();
      const existingMaterials = Array.isArray(result.data) ? result.data : [];

      if (existingMaterials.length > 0) {
        const first = existingMaterials[0];
        const foundItemUnit = units.find(u => u.unit_symbol === first.item_unit_symbol);
        const itemUnitId = foundItemUnit ? foundItemUnit.id : (units[0]?.id || "");

        const mappedMaterials = existingMaterials.map(m => {
          const foundRaw = rawMaterials.find(rm => rm.name === m.raw_material_name);
          const foundConsumeUnit = units.find(u => u.unit_symbol === m.consume_unit_symbol);

          return {
            raw_material_id: foundRaw ? foundRaw.id : m.raw_material_id || "",
            quantity: m.quantity || "",
            consume_unit_id: foundConsumeUnit ? foundConsumeUnit.id : "",
          };
        });

        setEditForm({
          item_id: itemId,
          item_quantity: first.item_quantity || "1",
          item_unit_id: itemUnitId,
          materials: mappedMaterials,
        });
      } else {
        // Create an empty recipe row if it doesn't exist
        setEditForm({
          item_id: itemId,
          item_quantity: "1",
          item_unit_id: units[0]?.id || "",
          materials: [{ raw_material_id: "", quantity: "", consume_unit_id: "" }],
        });
      }
      setOpenEdit(true);
    } catch (err) {
      console.error("Load edit recipe error:", err);
      alert("Failed to load recipe details for editing");
    }
  };

  const handleEditMaterialChange = (index, field, value) => {
    const updated = [...editForm.materials];
    updated[index][field] = value;
    setEditForm({ ...editForm, materials: updated });
  };

  const addEditMaterial = () => {
    setEditForm({
      ...editForm,
      materials: [
        ...editForm.materials,
        { raw_material_id: "", quantity: "", consume_unit_id: "" },
      ],
    });
  };

  const removeEditMaterial = (index) => {
    setEditForm({
      ...editForm,
      materials: editForm.materials.filter((_, i) => i !== index),
    });
  };

  const handleSaveEdit = async () => {
    if (!editForm.item_quantity || !editForm.item_unit_id) {
      alert("Please fill item details");
      return;
    }

    const validMaterials = editForm.materials.filter(
      m => m.raw_material_id && m.quantity && Number(m.quantity) > 0 && m.consume_unit_id
    );

    if (validMaterials.length === 0) {
      alert("Please add at least one valid raw material");
      return;
    }

    const payload = {
      item_id: Number(editForm.item_id),
      item_quantity: Number(editForm.item_quantity),
      item_unit_id: Number(editForm.item_unit_id),
      materials: validMaterials.map(m => ({
        raw_material_id: Number(m.raw_material_id),
        quantity: Number(m.quantity),
        consume_unit_id: Number(m.consume_unit_id),
      })),
    };

    try {
      const res = await fetch("http://localhost:5000/api/recipe/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        alert("Recipe updated successfully! ✅");
        setOpenEdit(false);
        fetchItems();
      } else {
        alert(result.message || "Failed to update recipe");
      }
    } catch (err) {
      console.error("Save edit recipe error:", err);
      alert("Error saving recipe edits");
    }
  };

  return (
    <Box p={3}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight={700}>
          Recipe Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenForm(true)}
        >
          Create New Recipe
        </Button>
      </Box>

      {/* ITEM TABLE */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Item Name</TableCell>
              <TableCell>Selling Price</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No items found
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, i) => (
                <TableRow key={item.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.selling_price}</TableCell>
                  <TableCell align="center">
                    <Box display="flex" gap={1} justifyContent="center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => fetchRecipeItems(item.item_id || item.id)}
                      >
                        View Recipe
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => handleEditClick(item)}
                      >
                        Edit Recipe
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* ===== CREATE RECIPE ===== */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Create Recipe</DialogTitle>
        <DialogContent dividers>
          <AddRecipeCreation
            onSuccess={() => {
              setOpenForm(false);
              fetchItems(); // refresh
            }}
          />
        </DialogContent>
      </Dialog>

      {/* ===== VIEW RECIPE MATERIALS ===== */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Recipe Raw Materials</DialogTitle>
        <DialogContent dividers>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Raw Material</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No recipe found for this item
                  </TableCell>
                </TableRow>
              ) : (
                materials.map((m, i) => (
                  <TableRow key={i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{m.raw_material_name}</TableCell>
                    <TableCell>
                      {m.quantity} {m.consume_unit_symbol}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      {/* ===== EDIT RECIPE DIALOG ===== */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Edit Recipe - {editItem?.name}
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={3}>
            {/* ITEM DETAILS IN EDIT */}
            <Paper sx={{ p: 2, bgcolor: "#F8FAFC" }}>
              <Typography fontWeight={700} mb={1.5}>
                Item Yield Information
              </Typography>
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <TextField
                  label="Yield Quantity"
                  type="number"
                  size="small"
                  value={editForm.item_quantity}
                  onChange={(e) =>
                    setEditForm({ ...editForm, item_quantity: e.target.value })
                  }
                />
                <FormControl fullWidth size="small">
                  <InputLabel>Yield Unit</InputLabel>
                  <Select
                    label="Yield Unit"
                    value={editForm.item_unit_id}
                    onChange={(e) =>
                      setEditForm({ ...editForm, item_unit_id: e.target.value })
                    }
                  >
                    {units.map((u) => (
                      <MenuItem key={u.id} value={u.id}>
                        {u.unit_name} ({u.unit_symbol})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Paper>

            {/* RAW MATERIALS SECTION */}
            <Paper sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography fontWeight={700}>Raw Materials Mapping</Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={addEditMaterial}
                >
                  Add Material
                </Button>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* TABLE COLUMN HEADER NAMES */}
              <Box display="grid" gridTemplateColumns="3fr 1.5fr 1.5fr auto" gap={2} mb={1.5} px={1}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
                  rawmaterial
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
                  quantity
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
                  unit
                </Typography>
                <Box width={40} />
              </Box>

              {editForm.materials.map((m, i) => (
                <Box
                  key={i}
                  display="grid"
                  gridTemplateColumns="3fr 1.5fr 1.5fr auto"
                  gap={2}
                  alignItems="center"
                  mb={2}
                >
                  <FormControl fullWidth size="small">
                    <Select
                      value={m.raw_material_id}
                      onChange={(e) =>
                        handleEditMaterialChange(i, "raw_material_id", e.target.value)
                      }
                      displayEmpty
                    >
                      <MenuItem value="" disabled>Select Raw Material</MenuItem>
                      {rawMaterials.map((rm) => (
                        <MenuItem key={rm.id} value={rm.id}>
                          {rm.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    placeholder="Qty"
                    type="number"
                    size="small"
                    value={m.quantity}
                    onChange={(e) =>
                      handleEditMaterialChange(i, "quantity", e.target.value)
                    }
                  />

                  <FormControl fullWidth size="small">
                    <Select
                      value={m.consume_unit_id}
                      onChange={(e) =>
                        handleEditMaterialChange(i, "consume_unit_id", e.target.value)
                      }
                      displayEmpty
                    >
                      <MenuItem value="" disabled>Select Unit</MenuItem>
                      {units.map((u) => (
                        <MenuItem key={u.id} value={u.id}>
                          {u.unit_symbol}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <IconButton
                    color="error"
                    disabled={editForm.materials.length === 1}
                    onClick={() => removeEditMaterial(i)}
                  >
                    <Close />
                  </IconButton>
                </Box>
              ))}
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenEdit(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="primary" variant="contained">
            Save Recipe
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecipeCreation;