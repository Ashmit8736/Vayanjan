import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  Checkbox,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  FormControl,
  InputLabel,
  Grid,
  Chip,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import InfoIcon from "@mui/icons-material/Info";
    


const ProductionMaster = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Pagination State
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const [rawMaterials, setRawMaterials] = useState([]);
  const [units, setUnits] = useState([]);

  // Edit Dialog States
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editForm, setEditForm] = useState({
    item_id: "",
    production_name: "",
    raw_material_id: "",
    quantity: "1",
    unit_id: "",
    materials: [],
  });


  
  // Logs Dialog States
  const [openLogs, setOpenLogs] = useState(false);
  const [selectedLogsItem, setSelectedLogsItem] = useState(null);
  const [itemLogs, setItemLogs] = useState({
    item_created_at: null,
    recipe_created_at: null,
    production_history: []
  });
  const [logsLoading, setLogsLoading] = useState(false);

  const token = localStorage.getItem("authToken");

  /* ================= FETCH CORE DATA ================= */
  const fetchData = async () => {
    if (!token) return;

    try {
      // 1. Fetch Items
      const itemsRes = await fetch("http://localhost:5000/api/item/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const itemsData = await itemsRes.json();
      if (itemsData.success && Array.isArray(itemsData.data)) {
        setItems(itemsData.data);
        setFilteredItems(itemsData.data);
      }

      // 2. Fetch Raw Materials
      const rawRes = await fetch("http://localhost:5000/api/raw/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const rawData = await rawRes.json();
      if (rawData.success && Array.isArray(rawData.data)) {
        setRawMaterials(rawData.data);
      }

      // 3. Fetch Units
      const unitsRes = await fetch("http://localhost:5000/api/units/getUnit");
      const unitsData = await unitsRes.json();
      const unitsArr = Array.isArray(unitsData.data) ? unitsData.data : unitsData || [];
      setUnits(unitsArr);
    } catch (err) {
      console.error("Error fetching production master data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= SEARCH & FILTER ================= */
  useEffect(() => {
    let result = [...items];

    if (searchQuery.trim() !== "") {
      result = result.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== "All") {
      result = result.filter(item => item.category === categoryFilter);
    }

    setFilteredItems(result);
    setPage(1); // Reset page on filter change
  }, [searchQuery, categoryFilter, items]);

  const safeFilteredItems = Array.isArray(filteredItems) ? filteredItems : [];
  const totalPages = Math.ceil(safeFilteredItems.length / itemsPerPage);
  const paginatedItems = safeFilteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSearch = () => {
    // Kept for the Search button if still present
  };

  const handleClear = () => {
    setSearchQuery("");
    setCategoryFilter("All");
    setFilteredItems(items);
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleInfoClick = async (item) => {
    setOpenLogs(true);
    setSelectedLogsItem(item);
    setLogsLoading(true);
    setItemLogs({
      item_created_at: item.created_at || null,
      recipe_created_at: null,
      production_history: []
    });

    try {
      const itemId = item.item_id || item.id;
      // 1. Fetch Recipe details
      const recipeRes = await fetch(`http://localhost:5000/api/recipe/item/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const recipeData = await recipeRes.json();
      let recipeCreatedAt = null;
      if (recipeData.success && Array.isArray(recipeData.data) && recipeData.data.length > 0) {
        recipeCreatedAt = recipeData.data[0].recipe_created_at;
      }

      // 2. Fetch Production history
      const prodRes = await fetch("http://localhost:5000/api/production/list", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const prodData = await prodRes.json();
      
      let history = [];
      if (Array.isArray(prodData)) {
        history = prodData.filter(p => p.item_id === itemId);
      }

      setItemLogs({
        item_created_at: item.created_at || null,
        recipe_created_at: recipeCreatedAt,
        production_history: history
      });

    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLogsLoading(false);
    }
  };

  // Get unique categories for filtering
  const categories = ["All", ...new Set(items.map(item => item.category).filter(Boolean))];

  /* ================= EDIT DIALOG OPEN ================= */
  const [isCreateMode, setIsCreateMode] = useState(false);
  const handleEditClick = async (item) => {
    setSelectedItem(item);
    const itemId = item.item_id || item.id;

    try {
      // Fetch recipe
      const res = await fetch(`http://localhost:5000/api/recipe/item/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      const existingMaterials = Array.isArray(result.data) ? result.data : [];

      if (existingMaterials.length > 0) {
        const first = existingMaterials[0];
        
        // Find corresponding unit ID
        const foundUnit = units.find(u => u.unit_symbol === first.item_unit_symbol);
        const unitId = foundUnit ? foundUnit.id : (units[0]?.id || "");

        // Find raw material id if any matching raw material has the same name
        const matchingRaw = rawMaterials.find(rm => rm.name.toLowerCase() === item.name.toLowerCase());

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
          production_name: item.name,
          raw_material_id: matchingRaw ? matchingRaw.id : "",
          quantity: first.item_quantity || "1",
          unit_id: unitId,
          materials: mappedMaterials,
        });
      } else {
        // Default form if recipe does not exist
        const matchingRaw = rawMaterials.find(rm => rm.name.toLowerCase() === item.name.toLowerCase());
        setEditForm({
          item_id: itemId,
          production_name: item.name,
          raw_material_id: matchingRaw ? matchingRaw.id : "",
          quantity: "1",
          unit_id: units[0]?.id || "",
          materials: [{ raw_material_id: "", quantity: "", consume_unit_id: "" }],
        });
      }
      setOpenEdit(true);
    } catch (err) {
      console.error("Load edit recipe error:", err);
      alert("Failed to load production process details");
    }
  };

  /* ================= EDIT FROM RAW MATERIAL LIST HANDLERS ================= */
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
    if (!editForm.quantity || !editForm.unit_id) {
      alert("Yield quantity and unit are required");
      return;
    }

    const validMaterials = editForm.materials.filter(
      m => m.raw_material_id && m.quantity && Number(m.quantity) > 0 && m.consume_unit_id
    );

    if (validMaterials.length === 0) {
      alert("Please add at least one valid raw material under 'From Raw Material'");
      return;
    }

    const payload = {
      item_id: Number(editForm.item_id),
      item_quantity: Number(editForm.quantity),
      item_unit_id: Number(editForm.unit_id),
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
        alert("Production process updated successfully! ✅");
        setOpenEdit(false);
        fetchData();
      } else {
        alert(result.message || "Failed to update process");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving production process edits");
    }
  };

  const getUnitSymbol = (unitId) => {
    const u = units.find(unit => unit.id === unitId);
    return u ? u.unit_symbol : "";
  };

  const getRawMaterialName = (rawId) => {
    const rm = rawMaterials.find(r => r.id === rawId);
    return rm ? rm.name : "";
  };



  const handleCreateNew = () => {
  setIsCreateMode(true);

  setEditForm({
    item_id: "",
    production_name: "",
    raw_material_id: "",
    quantity: "1",
    unit_id: units[0]?.id || "",
    materials: [
      {
        raw_material_id: "",
        quantity: "",
        consume_unit_id: "",
      },
    ],
  });

  setOpenEdit(true);
};



const handleCreateProduction = async () => {
  const payload = {
    production_name: editForm.production_name,
    raw_material_id: Number(editForm.raw_material_id),
    quantity: Number(editForm.quantity),
    unit_id: Number(editForm.unit_id),

    materials: editForm.materials.map((m) => ({
      raw_material_id: Number(m.raw_material_id),
      quantity: Number(m.quantity),
      consume_unit_id: Number(m.consume_unit_id),
    })),
  };

  try {
    const res = await fetch(
      "http://localhost:5000/api/recipe/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await res.json();

    if (res.ok) {
      alert("Production Created Successfully");
      setOpenEdit(false);
      fetchData();
    } else {
      alert(result.message);
    }
  } catch (err) {
    console.error(err);
  }
};

  return (
    <Box p={3} bgcolor="#F8FAFC" minHeight="100vh">
      {/* ================= HEADER (FIRST IMAGE) ================= */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={800} color="#1E293B">
          Production List 
        </Typography>

        <Stack direction="row" spacing={1.5}>
        <Button
  variant="contained"
  startIcon={<AddIcon />}
  onClick={handleCreateNew}
  sx={{
    bgcolor: "#2563EB",
    fontWeight: 600,
    "&:hover": {
      bgcolor: "#1D4ED8",
    },
    borderRadius: 2,
  }}
>
  Create New
</Button>
          <Button variant="outlined" sx={{ borderRadius: 2, textTransform: "none", color: "#64748B", borderColor: "#CBD5E1" }}>
            Action ∨
          </Button>
          <Button variant="outlined" sx={{ borderRadius: 2, textTransform: "none", color: "#64748B", borderColor: "#CBD5E1" }}>
            Files ∨
          </Button>
        </Stack>
      </Box>

      {/* ================= FILTER PANEL (FIRST IMAGE) ================= */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <TextField
            label="Search Production"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ minWidth: 220 }}
          />

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{ bgcolor: "#2563EB", px: 3, fontWeight: 600, "&:hover": { bgcolor: "#1D4ED8" } }}
          >
            Search
          </Button>

          <Button variant="outlined" onClick={handleClear} sx={{ color: "#64748B", borderColor: "#CBD5E1" }}>
            Clear
          </Button>
        </Stack>
      </Paper>

      {/* ================= PRODUCTION PROCESS LIST TABLE ================= */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#F1F5F9" }}>
              <TableCell style={{ width: 50 }}>
                <Checkbox size="small" />
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Production Name</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Final Output</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Time Slot</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Auto Production</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: "#475569", width: 120 }}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3, color: "#94A3B8" }}>
                  No production items found
                </TableCell>
              </TableRow>
            ) : (
              paginatedItems.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Checkbox size="small" />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#1E293B" }}>{item.name}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell color="text.secondary">-</TableCell>
                  <TableCell>No</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <IconButton size="small" color="primary" onClick={() => handleEditClick(item)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="inherit" onClick={() => handleInfoClick(item)}>
                        <InfoIcon fontSize="small" sx={{ color: "#94A3B8" }} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ================= PAGINATION ================= */}
      {totalPages > 0 && (
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} px={1}>
          <Typography variant="body2" color="text.secondary">
            Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, safeFilteredItems.length)} of {safeFilteredItems.length} records
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Button
              size="small"
              variant="outlined"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              sx={{ textTransform: "none", minWidth: "60px", color: "#64748B", borderColor: "#CBD5E1" }}
            >
              Prev
            </Button>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: "#1976d2",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              {page}
            </Box>
            <Button
              size="small"
              variant="outlined"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              sx={{ textTransform: "none", minWidth: "60px", color: "#64748B", borderColor: "#CBD5E1" }}
            >
              Next
            </Button>
          </Box>
        </Box>
      )}

      {/* ================= EDIT DIALOG POPUP (SECOND IMAGE) ================= */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, overflow: "hidden" }
        }}
      >
        <DialogTitle>
  {isCreateMode
    ? "Create Production Process"
    : "Edit Production Process"}
</DialogTitle>
        <Divider />

        <DialogContent sx={{ bgcolor: "#F8FAFC", py: 3, display: "flex", flexDirection: "column", gap: 3 }}>
          {/* 1. TO RAW MATERIAL CONTAINER */}
          <Paper sx={{ p: 3, border: "1px solid #E2E8F0", borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <Box p={0.8} sx={{ bgcolor: "#EFF6FF", color: "#2563EB", borderRadius: 1.5, display: "flex" }}>
                <InfoIcon fontSize="small" />
              </Box>
              <Typography fontWeight={700} color="#1E293B">
                To Raw Material
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" mb={3.5}>
              This refers to the process where the raw material is the final output of a production or conversion activity.
            </Typography>

            <Grid container spacing={2} alignItems="center" mb={3}>
              <Grid item xs={12} sm={3.5}>
                <Typography variant="caption" fontWeight={700} color="#64748B">
                  Production Name *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={editForm.production_name}
                  onChange={(e) => setEditForm({ ...editForm, production_name: e.target.value })}
                  sx={{ mt: 0.5 }}
                />
              </Grid>

              <Grid item xs={12} sm={3.5}>
                <Typography variant="caption" fontWeight={700} color="#64748B">
                  Raw Material
                </Typography>
                <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                  <Select
                    value={editForm.raw_material_id}
                    onChange={(e) => setEditForm({ ...editForm, raw_material_id: e.target.value })}
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
              </Grid>

              <Grid item xs={6} sm={2}>
                <Typography variant="caption" fontWeight={700} color="#64748B">
                  Quantity
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={editForm.quantity}
                  onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                  sx={{ mt: 0.5 }}
                />
              </Grid>

              <Grid item xs={6} sm={2}>
                <Typography variant="caption" fontWeight={700} color="#64748B">
                  Unit
                </Typography>
                <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                  <Select
                    value={editForm.unit_id}
                    onChange={(e) => setEditForm({ ...editForm, unit_id: e.target.value })}
                  >
                    {units.map((u) => (
                      <MenuItem key={u.id} value={u.id}>
                        {u.unit_symbol}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={1} sx={{ mt: 2.5 }}>
                <Button variant="outlined" sx={{ color: "#3B82F6", borderColor: "#3B82F6", py: 0.8 }} fullWidth>
                  Add
                </Button>
              </Grid>
            </Grid>

            {/* Render Output Badge */}
            {editForm.production_name && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.5,
                  bgcolor: "#F8FAFC",
                  borderLeft: "4px solid #2563EB",
                  borderRadius: 1.5,
                  border: "1px solid #E2E8F0",
                  borderLeftWidth: "4px"
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Typography fontWeight={600} color="#1E293B">
                    {editForm.production_name} [{editForm.quantity} {getUnitSymbol(editForm.unit_id)}]
                  </Typography>
                  <Box
                    px={1.2}
                    py={0.3}
                    sx={{
                      bgcolor: "#EFF6FF",
                      color: "#2563EB",
                      borderRadius: 1,
                      fontSize: "0.75rem",
                      fontWeight: 700
                    }}
                  >
                    Basic Conversion
                  </Box>
                </Stack>
                <IconButton size="small" color="error">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Paper>

          {/* 2. FROM RAW MATERIAL CONTAINER */}
          <Paper sx={{ p: 3, border: "1px solid #E2E8F0", borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box p={0.8} sx={{ bgcolor: "#EFF6FF", color: "#2563EB", borderRadius: 1.5, display: "flex" }}>
                  <InfoIcon fontSize="small" />
                </Box>
                <Typography fontWeight={700} color="#1E293B">
                  From Raw Material
                </Typography>
              </Stack>

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addEditMaterial}
                sx={{ textTransform: "none", color: "#2563EB", borderColor: "#2563EB", fontWeight: 600, borderRadius: 2 }}
              >
                Add New
              </Button>
            </Stack>
            <Typography variant="body2" color="text.secondary" mb={3.5}>
              This indicates the raw material used to produce another product. These are inputs or consumables consumed in process.
            </Typography>

            {/* List Header Labels */}
            <Box display="grid" gridTemplateColumns="3fr 1.5fr 1.5fr auto" gap={2} mb={1} px={1}>
              <Typography variant="caption" fontWeight={700} color="#64748B">
                Raw Material *
              </Typography>
              <Typography variant="caption" fontWeight={700} color="#64748B">
                Quantity *
              </Typography>
              <Typography variant="caption" fontWeight={700} color="#64748B">
                Unit *
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
                    onChange={(e) => handleEditMaterialChange(i, "raw_material_id", e.target.value)}
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
                  onChange={(e) => handleEditMaterialChange(i, "quantity", e.target.value)}
                />

                <FormControl fullWidth size="small">
                  <Select
                    value={m.consume_unit_id}
                    onChange={(e) => handleEditMaterialChange(i, "consume_unit_id", e.target.value)}
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
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Paper>
        </DialogContent>
        <Divider />

        <DialogActions sx={{ p: 2.5, bgcolor: "#F8FAFC" }}>
          <Button onClick={() => setOpenEdit(false)} variant="outlined" sx={{ textTransform: "none", color: "#64748B", borderColor: "#CBD5E1", px: 3, borderRadius: 2 }}>
            Cancel
          </Button>
         <Button
  onClick={
    isCreateMode
      ? handleCreateProduction
      : handleSaveEdit
  }
>
  {isCreateMode ? "Save" : "Save Changes"}
</Button>
        </DialogActions>
      </Dialog>

      {/* ================= AUDIT LOGS DIALOG POPUP ================= */}
      <Dialog
        open={openLogs}
        onClose={() => setOpenLogs(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: "1.25rem", py: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Production & Creation Audit Logs
          <IconButton size="small" onClick={() => setOpenLogs(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <Divider />

        <DialogContent sx={{ bgcolor: "#F8FAFC", py: 3 }}>
          {logsLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={8} flexDirection="column" gap={2}>
              <CircularProgress size={40} />
              <Typography variant="body2" color="text.secondary">Fetching audit logs...</Typography>
            </Box>
          ) : (
            <Stack spacing={3}>
              {/* Event Metadata (Item Registration and Recipe Mapping) */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, border: "1px solid #E2E8F0", borderRadius: 3 }}>
                    <Typography variant="caption" fontWeight={700} color="#64748B">
                      FINISHED ITEM CREATED
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="#1E293B" sx={{ mt: 0.5 }}>
                      {selectedLogsItem?.name || "-"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Registered At: <b>{formatDateTime(itemLogs.item_created_at)}</b>
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, border: "1px solid #E2E8F0", borderRadius: 3 }}>
                    <Typography variant="caption" fontWeight={700} color="#64748B">
                      RECIPE MAPPING CONFIGURATION
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="#1E293B" sx={{ mt: 0.5 }}>
                      {itemLogs.recipe_created_at ? "Configured" : "Not Configured"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Recipe Created At: <b>{formatDateTime(itemLogs.recipe_created_at)}</b>
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Production Run History Logs */}
              <Paper sx={{ p: 3, border: "1px solid #E2E8F0", borderRadius: 3 }}>
                <Typography fontWeight={700} color="#1E293B" mb={2}>
                  Production History Logs
                </Typography>

                {itemLogs.production_history.length === 0 ? (
                  <Box py={4} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No production runs have been logged for this item yet.
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#F1F5F9" }}>
                          <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Production Run ID</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Date & Time</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Quantity Produced</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {itemLogs.production_history.map((log) => (
                          <TableRow key={log.id} hover>
                            <TableCell sx={{ fontWeight: 600 }}>Run #{log.id}</TableCell>
                            <TableCell>{formatDateTime(log.produced_at)}</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: "#2563EB" }}>
                              {log.produce_quantity} {log.unit_symbol}
                            </TableCell>
                            <TableCell>
                              <Chip
                                size="small"
                                label={log.status}
                                color={
                                  log.status === "completed"
                                    ? "success"
                                    : log.status === "pending"
                                    ? "warning"
                                    : "error"
                                }
                                sx={{ fontWeight: 600, textTransform: "capitalize" }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            </Stack>
          )}
        </DialogContent>
        <Divider />

        <DialogActions sx={{ p: 2, bgcolor: "#F8FAFC" }}>
          <Button
            onClick={() => setOpenLogs(false)}
            variant="contained"
            sx={{ bgcolor: "#2563EB", px: 3, borderRadius: 2, fontWeight: 600, "&:hover": { bgcolor: "#1D4ED8" } }}
          >
            Close Logs
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductionMaster;