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
import { Add, Edit, ContentPaste, Close } from "@mui/icons-material";
import { useEffect, useState } from "react";
import AddItemCreation from "./AddItemCreation";
import { updateItem } from "@services/api/itemAPI";

const ItemCreation = () => {
  const [items, setItems] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
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
    item_unit_id: "",
    original_qty: "",
    remaining_qty: "",
    stock_status: "In Stock"
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

  const sortItems = (list) =>
    [...list].sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0) || (b.id || 0) - (a.id || 0));

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
      item_unit_id: item.item_unit_id || "",
      original_qty: item.original_qty || 0,
      remaining_qty: item.remaining_qty || 0,
      stock_status: item.stock_status || "In Stock"
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
          item_unit_id: editForm.item_unit_id ? Number(editForm.item_unit_id) : null,
          original_qty: Number(editForm.original_qty || 0),
          remaining_qty: Number(editForm.remaining_qty || 0),
          stock_status: editForm.stock_status
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
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Item Management
          </Typography>
          <Typography color="text.secondary" variant="body2">
            This page shows the item list for your branch. Use Add Item to create or edit existing items.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          sx={createBtn}
          onClick={() => {
            setSelectedItem(null);
            setOpenForm(true);
          }}
        >
          Add Item
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
              <TableCell>Original Qty</TableCell>
              <TableCell>Remaining Qty</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => (
                <TableRow key={item.id || item.item_id || index} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>₹ {item.selling_price}</TableCell>
                  <TableCell>{item.item_unit_symbol || "-"}</TableCell>
                  <TableCell>{item.original_qty ?? 0}</TableCell>
                  <TableCell>{item.remaining_qty ?? 0}</TableCell>
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
        onClose={() => {
          setOpenForm(false);
          setSelectedItem(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedItem ? "Edit Item" : "Add Item"}</DialogTitle>

        <DialogContent dividers>
          <AddItemCreation
            item={selectedItem}
            onSuccess={() => {
              setOpenForm(false);
              fetchItems();
            }}
            onClose={() => {
              setOpenForm(false);
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
            options={Array.isArray(units) ? units : []}
            getOptionLabel={(option) => option ? `${option.unit_name} (${option.unit_symbol})` : ""}
            value={(Array.isArray(units) ? units.find((u) => Number(u.id) === Number(editForm.item_unit_id)) : null) || null}
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

          <TextField
            select
            label="Stock Status"
            value={editForm.stock_status}
            onChange={(e) => setEditForm(prev => ({ ...prev, stock_status: e.target.value }))}
            fullWidth
          >
            <MenuItem value="In Stock">Track Stock (In Stock)</MenuItem>
            <MenuItem value="Out of Stock">Track Stock (Out of Stock)</MenuItem>
            <MenuItem value="Do Not Track">Do Not Track (Always Available)</MenuItem>
          </TextField>

          <TextField
            label="Original Quantity"
            type="number"
            value={editForm.original_qty}
            onChange={(e) => {
              const val = e.target.value;
              setEditForm(prev => {
                const diff = Number(val) - Number(prev.original_qty || 0);
                const newRemaining = Number(prev.remaining_qty || 0) === 0 || prev.remaining_qty === ""
                  ? val
                  : String(Math.max(0, Number(prev.remaining_qty || 0) + (diff > 0 ? diff : 0)));
                return {
                  ...prev,
                  original_qty: val,
                  remaining_qty: newRemaining
                };
              });
            }}
            fullWidth
          />

          <TextField
            label="Remaining Quantity"
            type="number"
            value={editForm.remaining_qty}
            onChange={(e) => setEditForm(prev => ({ ...prev, remaining_qty: e.target.value }))}
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