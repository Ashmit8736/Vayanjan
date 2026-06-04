import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Autocomplete,
  CircularProgress
} from "@mui/material";
import { Add, Edit, Close, ContentPaste } from "@mui/icons-material";
import { useEffect, useState } from "react";
import AddItemCreation from "./AddItemCreation";

const ItemCreation = () => {
  const [items, setItems] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Units for edit form
  const [units, setUnits] = useState([]);

  // Edit states
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    category: "Sweet",
    selling_price: "",
    item_unit_id: ""
  });
  const [editSaving, setEditSaving] = useState(false);

  // Logs states
  const [logsOpen, setLogsOpen] = useState(false);
  const [logsItem, setLogsItem] = useState(null);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsData, setLogsData] = useState({
    item_created_at: null,
    recipe_created_at: null,
    production_runs: []
  });

  const token = localStorage.getItem("authToken");

  /* ================= GET ITEM LIST ================= */
  const fetchItems = async () => {
    if (!token) {
      alert("Token missing. Please login again.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/item/list", {
        headers: { Authorization: `Bearer ${token}` },
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
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH UNITS (FOR EDIT) ================= */
  const fetchUnits = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/units/getUnit", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setUnits(json.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch units", err);
    }
  };

  /* ================= ON LOAD ================= */
  useEffect(() => {
    fetchItems();
    fetchUnits();
  }, []);

  /* ================= EDIT HANDLERS ================= */
  const handleOpenEdit = (item) => {
    setEditForm({
      id: item.id,
      name: item.name,
      category: item.category || "Sweet",
      selling_price: item.selling_price,
      item_unit_id: item.item_unit_id || ""
    });
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editForm.name || !editForm.category || !editForm.selling_price) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setEditSaving(true);
      const res = await fetch(`http://localhost:5000/api/item/update/${editForm.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editForm.name,
          category: editForm.category,
          selling_price: Number(editForm.selling_price),
          item_unit_id: editForm.item_unit_id ? Number(editForm.item_unit_id) : null
        })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to update item");
        return;
      }

      alert("Item updated successfully ✅");
      setEditOpen(false);
      fetchItems();
    } catch (error) {
      console.error("Edit item error:", error);
      alert("Error updating item");
    } finally {
      setEditSaving(false);
    }
  };

  /* ================= DELETE HANDLER ================= */
  const handleDeleteItem = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/item/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to delete item");
        return;
      }
      alert("Item deleted successfully ✅");
      fetchItems();
    } catch (error) {
      console.error("Delete item error:", error);
      alert("Error deleting item");
    }
  };

  /* ================= LOGS HANDLER ================= */
  const handleOpenLogs = async (item) => {
    setLogsItem(item);
    setLogsOpen(true);
    try {
      setLogsLoading(true);
      const res = await fetch(`http://localhost:5000/api/item/logs/${item.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setLogsData(json.data);
      }
    } catch (error) {
      console.error("Fetch logs error:", error);
    } finally {
      setLogsLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleString("en-GB", { hour12: true });
  };

  return (
    <Box sx={page}>
      {/* HEADER */}
      <Box sx={header}>
        <Typography variant="h6" fontWeight={700}>
          Recipe Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          sx={createBtn}
          onClick={() => setOpenForm(true)}
        >
          Create New
        </Button>
      </Box>

      {/* TABLE */}
      <Paper sx={tableWrap}>
        <Table>
          <TableHead>
            <TableRow sx={thead}>
              <TableCell>S.No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Selling Price</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => (
                <TableRow key={item.id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>₹ {item.selling_price}</TableCell>
                  <TableCell>{item.item_unit_symbol || "-"}</TableCell>
                  <TableCell align="center">
                    <IconButton sx={iconBtn} onClick={() => handleOpenLogs(item)}>
                      <ContentPaste fontSize="small" />
                    </IconButton>
                    <IconButton sx={iconBtn} onClick={() => handleOpenEdit(item)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton sx={deleteBtn} onClick={() => handleDeleteItem(item.id, item.name)}>
                      <Close fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* ===== ADD ITEM POPUP ===== */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Item Recipe</DialogTitle>

        <DialogContent dividers>
          <AddItemCreation
            onSuccess={() => {
              setOpenForm(false);
              fetchItems();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* ===== EDIT ITEM POPUP ===== */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Item Details</DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            label="Item Name"
            value={editForm.name}
            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
            fullWidth
          />
          
          <TextField
            select
            label="Category"
            value={editForm.category}
            onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
            fullWidth
          >
            <MenuItem value="Sweet">Sweet</MenuItem>
            <MenuItem value="Snacks">Snacks</MenuItem>
            <MenuItem value="Vegetable">Vegetable</MenuItem>
            <MenuItem value="Roti">Roti</MenuItem>
          </TextField>

          <Autocomplete
            options={units}
            getOptionLabel={(option) => option ? `${option.unit_name} (${option.unit_symbol})` : ""}
            value={units.find((u) => Number(u.id) === Number(editForm.item_unit_id)) || null}
            onChange={(event, newValue) => {
              setEditForm((prev) => ({ ...prev, item_unit_id: newValue ? newValue.id : "" }));
            }}
            renderInput={(params) => (
              <TextField {...params} label="Unit" placeholder="Select selling unit" fullWidth />
            )}
          />

          <TextField
            label="Selling Price"
            type="number"
            value={editForm.selling_price}
            onChange={(e) => setEditForm(prev => ({ ...prev, selling_price: e.target.value }))}
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditOpen(false)} sx={{ color: "#475569", fontWeight: 600 }}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveEdit}
            disabled={editSaving}
            sx={{ fontWeight: 600 }}
          >
            {editSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== VIEW LOGS POPUP ===== */}
      <Dialog open={logsOpen} onClose={() => setLogsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          📋 Audit Logs: {logsItem?.name}
        </DialogTitle>
        <DialogContent dividers>
          {logsLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" gap={3}>
              {/* TIMESTAMPS SUMMARY */}
              <Paper sx={{ p: 2, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <b>Registered At (Item Creation):</b> {formatDate(logsData.item_created_at)}
                </Typography>
                <Typography variant="body2">
                  <b>Recipe Mapped At:</b> {logsData.recipe_created_at ? formatDate(logsData.recipe_created_at) : "No active recipe mapped"}
                </Typography>
              </Paper>

              {/* PRODUCTION RUNS HISTORY */}
              <Box>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                  Production Runs History
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#F1F5F9" }}>
                      <TableCell sx={{ fontWeight: "bold" }}>Run ID</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Produced Qty</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Date & Time</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logsData.production_runs && logsData.production_runs.length > 0 ? (
                      logsData.production_runs.map((run) => (
                        <TableRow key={run.id} hover>
                          <TableCell>#{run.id}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{Number(run.produce_quantity).toFixed(2)}</TableCell>
                          <TableCell>{run.date}</TableCell>
                          <TableCell>
                            <span
                              style={{
                                color: run.status === "completed" ? "#10B981" : "#F59E0B",
                                fontWeight: "bold",
                                textTransform: "capitalize"
                              }}
                            >
                              {run.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ color: "#94A3B8", py: 2 }}>
                          No production history recorded for this item
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setLogsOpen(false)} sx={{ fontWeight: 600 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

/* ================= STYLES ================= */
const page = {
  p: 3,
  bgcolor: "#F8FAFC",
  minHeight: "100vh",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 2,
};

const createBtn = {
  bgcolor: "#C62828",
  textTransform: "none",
  fontWeight: 600,
  "&:hover": { bgcolor: "#B71C1C" },
};

const tableWrap = {
  borderRadius: 2,
  overflow: "hidden",
};

const thead = {
  bgcolor: "#EFF6FF",
  "& th": { fontWeight: 700 },
};

const iconBtn = {
  bgcolor: "#F1F5F9",
  mx: 0.5,
  "&:hover": { bgcolor: "#E2E8F0" },
};

const deleteBtn = {
  bgcolor: "#FEE2E2",
  mx: 0.5,
  "&:hover": { bgcolor: "#FCA5A5" },
};

export default ItemCreation;