import { useMemo, useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  IconButton,
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ReplayIcon from "@mui/icons-material/Replay";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

/* Helpers to get default dates */
const defaultStartDate = () => {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString().slice(0, 10);
};

const defaultEndDate = () => {
  return new Date().toISOString().slice(0, 10);
};

const todayDate = () => {
  return new Date().toISOString().slice(0, 10);
};

const Wastage = () => {
  // Page view state: 'list' or 'add'
  const [viewType, setViewType] = useState("list");

  // Data states
  const [rows, setRows] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters State
  const [startDate, setStartDate] = useState(defaultStartDate());
  const [endDate, setEndDate] = useState(defaultEndDate());
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [viewMode, setViewMode] = useState("date-wise"); // 'date-wise' or 'detail-wise'

  // Add Wastage Form State
  const [addForm, setAddForm] = useState({
    wastageFor: "raw-material",
    date: todayDate(),
    items: [
      {
        raw_material_id: "",
        quantity: "",
        unit_name: "",
        unit_id: "",
        unit_price: "",
        amount: 0,
        reason: "", // stores Description
      },
    ],
  });
  const [checkedRows, setCheckedRows] = useState({});

  // Details Dialog State
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDateItems, setSelectedDateItems] = useState([]);

  /* ================= FETCH DATA ================= */
  const fetchWastage = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/wastage/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setRows(data.data);
      }
    } catch (err) {
      console.error("Error fetching wastage:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRawMaterials = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/raw/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setRawMaterials(data.data);
      }
    } catch (err) {
      console.error("Error fetching raw materials:", err);
    }
  };

  const fetchUnits = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/units/getUnit");
      const data = await res.json();
      const unitsArr = Array.isArray(data.data) ? data.data : data || [];
      setUnits(unitsArr);
    } catch (err) {
      console.error("Error fetching units:", err);
    }
  };

  useEffect(() => {
    fetchWastage();
    fetchRawMaterials();
    fetchUnits();
  }, []);

  /* ================= LIST FILTERS & GROUPING ================= */
  const categories = useMemo(() => {
    return ["All", ...new Set(rawMaterials.map((rm) => rm.category).filter(Boolean))];
  }, [rawMaterials]);

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      // Parse record date (format is DD-MM-YYYY)
      const [d, m, y] = r.date.split("-");
      const recordDate = new Date(`${y}-${m}-${d}`);
      recordDate.setHours(0, 0, 0, 0);

      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      const inDateRange = recordDate >= start && recordDate <= end;
      const matchCategory = categoryFilter === "All" || r.category === categoryFilter;

      return inDateRange && matchCategory;
    });
  }, [rows, startDate, endDate, categoryFilter]);

  const groupedData = useMemo(() => {
    const groups = {};
    filteredRows.forEach((r) => {
      const dateStr = r.date;
      if (!groups[dateStr]) {
        groups[dateStr] = {
          date: dateStr,
          total: 0,
          status: "Saved",
          items: [],
        };
      }
      groups[dateStr].total += Number(r.value || 0);
      groups[dateStr].items.push(r);
    });
    return Object.values(groups);
  }, [filteredRows]);

  const handleClearFilters = () => {
    setStartDate(defaultStartDate());
    setEndDate(defaultEndDate());
    setCategoryFilter("All");
    setStatusFilter("All");
  };

  /* ================= DELETE SINGLE RECORD ================= */
  const handleDeleteRecord = async (id, dateStr) => {
    if (!window.confirm("Are you sure you want to delete this wastage record? Stock will be reverted.")) {
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/api/wastage/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        alert("Wastage record deleted successfully! ✅");
        
        // Refresh details popup if open
        if (detailsOpen) {
          const updatedItems = selectedDateItems.filter(item => item.id !== id);
          setSelectedDateItems(updatedItems);
          if (updatedItems.length === 0) {
            setDetailsOpen(false);
          }
        }

        fetchWastage();
      } else {
        alert(`Failed: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting record");
    }
  };

  /* ================= DETAILS POPUP ACTION ================= */
  const handleOpenDetails = (group) => {
    setSelectedDate(group.date);
    setSelectedDateItems(group.items);
    setDetailsOpen(true);
  };

  /* ================= ADD FORM ROW HANDLERS ================= */
  const handleAddFormRow = () => {
    setAddForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          raw_material_id: "",
          quantity: "",
          unit_name: "",
          unit_id: "",
          unit_price: "",
          amount: 0,
          reason: "",
        },
      ],
    }));
  };

  const handleRemoveFormRow = (index) => {
    setAddForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
    // Remove checkbox tracking
    const updatedChecked = { ...checkedRows };
    delete updatedChecked[index];
    setCheckedRows(updatedChecked);
  };

  const handleRemoveCheckedRows = () => {
    const remaining = addForm.items.filter((_, i) => !checkedRows[i]);
    setAddForm((prev) => ({
      ...prev,
      items: remaining.length ? remaining : [
        {
          raw_material_id: "",
          quantity: "",
          unit_name: "",
          unit_id: "",
          unit_price: "",
          amount: 0,
          reason: "",
        },
      ],
    }));
    setCheckedRows({});
  };

  const handleRowFieldChange = (index, field, value) => {
    const updatedItems = [...addForm.items];
    const row = updatedItems[index];

    if (field === "raw_material_id") {
      row.raw_material_id = value;
      // Auto-fill unit symbol & purchase price
      const rm = rawMaterials.find((m) => m.id === value);
      if (rm) {
        row.unit_name = rm.purchase_unit || "";
        row.unit_id = rm.purchase_unit_id || "";
        row.unit_price = rm.purchase_price || 0;
      }
      row.amount = Number(row.quantity || 0) * Number(row.unit_price || 0);
    } else if (field === "quantity" || field === "unit_price") {
      row[field] = value;
      row.amount = Number(row.quantity || 0) * Number(row.unit_price || 0);
    } else {
      row[field] = value;
    }

    setAddForm((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleCheckboxToggle = (index, val) => {
    setCheckedRows((prev) => ({
      ...prev,
      [index]: val,
    }));
  };

  /* ================= SUBMIT BULK WASTAGE ================= */
  const handleSaveWastage = async () => {
    // Validate rows
    const validItems = addForm.items.filter(
      (item) => item.raw_material_id && item.quantity && Number(item.quantity) > 0
    );

    if (validItems.length === 0) {
      alert("Please configure at least one raw material and quantity");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) return;

    const payload = {
      date: addForm.date,
      items: validItems.map((item) => ({
        raw_material_id: Number(item.raw_material_id),
        quantity: Number(item.quantity),
        reason: item.reason || "Wastage Logged",
      })),
    };

    try {
      const res = await fetch("http://localhost:5000/api/wastage/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert("Wastage items logged successfully! ✅");
        setViewType("list");
        // Reset form
        setAddForm({
          wastageFor: "raw-material",
          date: todayDate(),
          items: [
            {
              raw_material_id: "",
              quantity: "",
              unit_name: "",
              unit_id: "",
              unit_price: "",
              amount: 0,
              reason: "",
            },
          ],
        });
        setCheckedRows({});
        // Refresh logs list
        fetchWastage();
      } else {
        alert(`Failed to save wastage: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving wastage logs");
    }
  };

  return (
    <Box p={3} bgcolor="#F8FAFC" minHeight="100vh">
      {viewType === "list" ? (
        <>
          {/* ================= VIEW 1: WASTAGE LIST VIEW ================= */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography fontSize={18} fontWeight={700} color="#1E293B">
              Wastage List
            </Typography>

            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                onClick={() => setViewType("add")}
                sx={{ bgcolor: "#2563EB", px: 3, fontWeight: 600, "&:hover": { bgcolor: "#1D4ED8" } }}
              >
                + Create New
              </Button>
              <Button
                variant="outlined"
                sx={{ color: "#64748B", borderColor: "#CBD5E1", textTransform: "none" }}
              >
                Export ∨
              </Button>
            </Stack>
          </Box>

          {/* FILTER BAR CONTAINER */}
          <Paper sx={{ p: 2.5, mb: 3, border: "1px solid #E2E8F0", borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={2.4}>
                <Typography variant="caption" fontWeight={700} color="#64748B">
                  Start Date
                </Typography>
                <TextField
                  type="date"
                  fullWidth
                  size="small"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  sx={{ mt: 0.5, bgcolor: "white" }}
                />
              </Grid>

              <Grid item xs={12} sm={2.4}>
                <Typography variant="caption" fontWeight={700} color="#64748B">
                  End Date
                </Typography>
                <TextField
                  type="date"
                  fullWidth
                  size="small"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  sx={{ mt: 0.5, bgcolor: "white" }}
                />
              </Grid>

              <Grid item xs={12} sm={1.8}>
                <Typography variant="caption" fontWeight={700} color="#64748B">
                  Status
                </Typography>
                <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                  <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Saved">Saved</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={1.8}>
                <Typography variant="caption" fontWeight={700} color="#64748B">
                  Category
                </Typography>
                <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                  <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={1.8}>
                <Typography variant="caption" fontWeight={700} color="#64748B">
                  View
                </Typography>
                <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                  <Select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
                    <MenuItem value="date-wise">Date wise</MenuItem>
                    <MenuItem value="detail-wise">Detail wise</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={1.8} sx={{ mt: 2.2, display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={fetchWastage}
                  sx={{ color: "#2563EB", borderColor: "#2563EB", textTransform: "none", px: 2, height: 38 }}
                >
                  Search
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleClearFilters}
                  sx={{ color: "#64748B", borderColor: "#CBD5E1", textTransform: "none", px: 2, height: 38 }}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* LIST TABLE CONTAINER */}
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" p={6} flexDirection="column" gap={1.5}>
              <CircularProgress size={40} />
              <Typography color="text.secondary">Fetching wastage logs...</Typography>
            </Box>
          ) : viewMode === "date-wise" ? (
            /* DATE-WISE GROUPED VIEW */
            <TableContainer component={Paper} sx={{ borderRadius: 3, border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
              <Table>
                <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Total (₹)</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Status</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: "#475569", width: 150 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4, color: "#94A3B8" }}>
                        No wastage entries found for selected criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    groupedData.map((group) => (
                      <TableRow key={group.date} hover>
                        <TableCell sx={{ fontWeight: 600, color: "#1E293B" }}>{group.date}</TableCell>
                        <TableCell>
                          <Button
                            variant="text"
                            onClick={() => handleOpenDetails(group)}
                            sx={{ color: "#2563EB", fontWeight: 700, textDecoration: "underline", p: 0, minWidth: 0, textTransform: "none" }}
                          >
                            ₹ {group.total.toFixed(3)}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Chip size="small" label={group.status} color="success" variant="outlined" sx={{ fontWeight: 700, borderRadius: 1.5 }} />
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={0.5} justifyContent="center">
                            <IconButton size="small" color="primary" onClick={() => handleOpenDetails(group)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="inherit">
                              <ReplayIcon fontSize="small" sx={{ color: "#94A3B8" }} />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            /* DETAIL-WISE FLAT LIST VIEW */
            <TableContainer component={Paper} sx={{ borderRadius: 3, border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
              <Table>
                <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Raw Material</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Wastage Qty</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Unit</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Description / Reason</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Value (₹)</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: "#475569", width: 100 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4, color: "#94A3B8" }}>
                        No wastage flat records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRows.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{row.date}</TableCell>
                        <TableCell>{row.category}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{row.material}</TableCell>
                        <TableCell sx={{ color: "#EF4444", fontWeight: 700 }}>{row.qty}</TableCell>
                        <TableCell>{row.unit}</TableCell>
                        <TableCell color="text.secondary">{row.reason}</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>₹ {Number(row.value).toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <IconButton size="small" color="error" onClick={() => handleDeleteRecord(row.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {!loading && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, px: 0.5 }}>
              Showing 1 to {viewMode === "date-wise" ? groupedData.length : filteredRows.length} of{" "}
              {viewMode === "date-wise" ? groupedData.length : filteredRows.length} records
            </Typography>
          )}
        </>
      ) : (
        <>
          {/* ================= VIEW 2: ADD WASTAGE DETAILS PAGE ================= */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography fontSize={18} fontWeight={700} color="#1E293B">
              Add Wastage Details
            </Typography>
          </Box>

          <Paper sx={{ p: 3, mb: 3, border: "1px solid #E2E8F0", borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <Grid container spacing={3} alignItems="center">
              {/* Wastage For Selector */}
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" fontWeight={700} color="#64748B">
                  Wastage for *
                </Typography>
                <RadioGroup
                  row
                  value={addForm.wastageFor}
                  onChange={(e) => setAddForm({ ...addForm, wastageFor: e.target.value })}
                  sx={{ mt: 0.5 }}
                >
                  <FormControlLabel value="raw-material" control={<Radio size="small" />} label="Raw Material" />
                  <FormControlLabel value="item" control={<Radio size="small" />} label="Item" disabled />
                </RadioGroup>
              </Grid>

              {/* Date */}
              <Grid item xs={12} sm={3}>
                <Typography variant="caption" fontWeight={700} color="#64748B">
                  Date *
                </Typography>
                <TextField
                  type="date"
                  fullWidth
                  size="small"
                  value={addForm.date}
                  onChange={(e) => setAddForm({ ...addForm, date: e.target.value })}
                  sx={{ mt: 0.5, bgcolor: "white" }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* ITEM DETAILS BLOCK */}
          <Paper sx={{ p: 3, border: "1px solid #E2E8F0", borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.02)", mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography fontWeight={700} color="#1E293B">
                Wastage Item Details
              </Typography>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddFormRow}
                  sx={{ color: "#2563EB", borderColor: "#2563EB", textTransform: "none", borderRadius: 2, px: 2, py: 0.5, fontSize: 13, fontWeight: 700 }}
                >
                  Add New
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleRemoveCheckedRows}
                  sx={{ color: "#64748B", borderColor: "#CBD5E1", textTransform: "none", borderRadius: 2, px: 2, py: 0.5, fontSize: 13, fontWeight: 700 }}
                >
                  Remove
                </Button>
              </Stack>
            </Box>

            {/* Flat Table Layout inside Creation */}
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                  <TableRow>
                    <TableCell style={{ width: 40 }}></TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Raw Material *</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Quantity *</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Unit *</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Average Purchase Price</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Description</TableCell>
                    <TableCell style={{ width: 50 }}></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {addForm.items.map((row, idx) => (
                    <TableRow key={idx}>
                      {/* Checkbox */}
                      <TableCell>
                        <Checkbox
                          size="small"
                          checked={!!checkedRows[idx]}
                          onChange={(e) => handleCheckboxToggle(idx, e.target.checked)}
                        />
                      </TableCell>

                      {/* Raw Material Select */}
                      <TableCell sx={{ minWidth: 200 }}>
                        <FormControl fullWidth size="small">
                          <Select
                            value={row.raw_material_id}
                            displayEmpty
                            onChange={(e) => handleRowFieldChange(idx, "raw_material_id", e.target.value)}
                          >
                            <MenuItem value="" disabled>Select Raw Material</MenuItem>
                            {rawMaterials.map((rm) => (
                              <MenuItem key={rm.id} value={rm.id}>
                                {rm.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>

                      {/* Quantity input */}
                      <TableCell>
                        <TextField
                          placeholder="Quantity"
                          type="number"
                          size="small"
                          fullWidth
                          value={row.quantity}
                          onChange={(e) => handleRowFieldChange(idx, "quantity", e.target.value)}
                        />
                      </TableCell>

                      {/* Unit label (read-only) */}
                      <TableCell>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Unit"
                          value={row.unit_name}
                          InputProps={{ readOnly: true }}
                          sx={{ bgcolor: "#F1F5F9" }}
                        />
                      </TableCell>

                      {/* Avg Purchase Price */}
                      <TableCell>
                        <TextField
                          placeholder="Avg. Purchase Price"
                          type="number"
                          size="small"
                          fullWidth
                          value={row.unit_price}
                          onChange={(e) => handleRowFieldChange(idx, "unit_price", e.target.value)}
                        />
                      </TableCell>

                      {/* Amount */}
                      <TableCell>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Amount"
                          value={row.amount ? row.amount.toFixed(2) : ""}
                          InputProps={{ readOnly: true }}
                          sx={{ bgcolor: "#F1F5F9" }}
                        />
                      </TableCell>

                      {/* Description / Reason */}
                      <TableCell sx={{ minWidth: 200 }}>
                        <TextField
                          placeholder="Description / Reason"
                          size="small"
                          fullWidth
                          value={row.reason}
                          onChange={(e) => handleRowFieldChange(idx, "reason", e.target.value)}
                        />
                      </TableCell>

                      {/* Delete Action icon */}
                      <TableCell>
                        <IconButton
                          color="error"
                          disabled={addForm.items.length === 1}
                          onClick={() => handleRemoveFormRow(idx)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Action buttons at the bottom right */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={() => setViewType("list")}
              sx={{ color: "#64748B", borderColor: "#CBD5E1", px: 4, textTransform: "none", borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveWastage}
              sx={{ bgcolor: "#2563EB", px: 4, textTransform: "none", borderRadius: 2, fontWeight: 600, "&:hover": { bgcolor: "#1D4ED8" } }}
            >
              Save Changes
            </Button>
          </Stack>
        </>
      )}

      {/* ================= DETAILS POPUP DIALOG ================= */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, py: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Wastage Details - {selectedDate}
          <IconButton size="small" onClick={() => setDetailsOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <Divider />

        <DialogContent sx={{ py: 3 }}>
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#F1F5F9" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Raw Material</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Quantity</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Unit</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Description / Reason</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Value (₹)</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: "#475569", width: 80 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedDateItems.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.category}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{item.material}</TableCell>
                    <TableCell sx={{ color: "#EF4444", fontWeight: 700 }}>{item.qty}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell color="text.secondary">{item.reason}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>₹ {Number(item.value).toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="error" onClick={() => handleDeleteRecord(item.id, selectedDate)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <Divider />

        <DialogActions sx={{ p: 2, bgcolor: "#F8FAFC" }}>
          <Button
            onClick={() => setDetailsOpen(false)}
            variant="contained"
            sx={{ bgcolor: "#2563EB", px: 3, borderRadius: 2, fontWeight: 600, "&:hover": { bgcolor: "#1D4ED8" } }}
          >
            Close Details
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Wastage;