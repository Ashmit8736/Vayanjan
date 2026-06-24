import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Stack,
  Checkbox,
  Grid,
  Switch,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import WarningIcon from "@mui/icons-material/Warning";
import { getMyBranchesAPI } from "../../../services/api/branchAPI";

/* ================= AXIOS ================= */
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ================= JWT DECODE (NO LIB) ================= */
const decodeJWT = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

const ProductionExecution = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination State
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const [checked, setChecked] = useState({});
  const [qty, setQty] = useState({});
  const [readyItems, setReadyItems] = useState([]); // List of items sent to right panel
  const [recipeMap, setRecipeMap] = useState({}); // Stores raw materials per item: { itemId: [materials] }
  const [availableStock, setAvailableStock] = useState([]);
  const [branches, setBranches] = useState([]);
  const [targetBranchId, setTargetBranchId] = useState("");

  // Dialog/Popup States
  const [loading, setLoading] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);
  const [insufficientItems, setInsufficientItems] = useState([]);

  const navigate = useNavigate();

  /* branch_id & user_id FROM TOKEN */
  const token = localStorage.getItem("authToken");
  const decoded = token ? decodeJWT(token) : null;
  const branch_id = decoded?.branch_id ?? null;
  const created_by = decoded?.id ?? null;

  /* ================= LOAD DATA ================= */
  const fetchAvailableStock = async () => {
    try {
      const res = await api.get("/stock/stockAvailable");
      if (res.data.success && Array.isArray(res.data.data)) {
        setAvailableStock(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching stock:", err);
    }
  };

  const fetchItems = async () => {
    if (!branch_id) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const res = await api.get("/item/list", { params: { branch_id } });
      if (res.data.success && Array.isArray(res.data.data)) {
        const filtered = res.data.data.filter(item => item.recipe_id !== null);
        setItems(filtered);
        setFilteredItems(filtered);
      }
    } catch (err) {
      console.error(err);
      setItems([]);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await getMyBranchesAPI();
      if (res.data?.success && Array.isArray(res.data.data)) {
        setBranches(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching branches:", err);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchAvailableStock();
    fetchBranches();
  }, [branch_id]);

  /* ================= FETCH RECIPE MATERIALS ON DEMAND ================= */
  const fetchRecipeForReadyItem = async (itemId) => {
    if (recipeMap[itemId]) return; // Already loaded

    try {
      const res = await api.get(`/recipe/item/${itemId}`);
      if (res.data.success && Array.isArray(res.data.data)) {
        setRecipeMap(prev => ({
          ...prev,
          [itemId]: res.data.data,
        }));
      }
    } catch (err) {
      console.error("Error fetching recipe materials:", err);
    }
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setPage(1); // Reset page on search
    if (val.trim() === "") {
      setFilteredItems(items);
    } else {
      setFilteredItems(
        items.filter(item => item.name.toLowerCase().includes(val.toLowerCase()))
      );
    }
  };

  const safeFilteredItems = Array.isArray(filteredItems) ? filteredItems : [];
  const totalPages = Math.ceil(safeFilteredItems.length / itemsPerPage);
  const paginatedItems = safeFilteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  /* ================= REAL-TIME HANDLERS & TRANSFER ================= */
  const handleCheckboxChange = (itemId, isChecked) => {
    setChecked(prev => ({
      ...prev,
      [itemId]: isChecked,
    }));

    if (isChecked) {
      const item = items.find(i => i.id === itemId);
      if (item) {
        const initialQty = qty[itemId] || item.item_quantity || 50;

        if (!qty[itemId]) {
          setQty(prev => ({ ...prev, [itemId]: initialQty }));
        }

        setReadyItems(prev => {
          if (prev.some(r => r.id === itemId)) return prev;
          return [...prev, { ...item, entered_qty: initialQty }];
        });

        fetchRecipeForReadyItem(itemId);
      }
    } else {
      setReadyItems(prev => prev.filter(r => r.id !== itemId));
    }
  };

  const handleSendToProduction = () => {
    const selected = items.filter(item => checked[item.id]);

    if (selected.length === 0) {
      alert("Please select at least one item using the checkbox.");
      return;
    }

    const updatedReady = [...readyItems];
    selected.forEach(item => {
      if (!updatedReady.some(r => r.id === item.id)) {
        const initialQty = qty[item.id] || item.item_quantity || 50;
        
        updatedReady.push({
          ...item,
          entered_qty: initialQty,
        });

        if (!qty[item.id]) {
          setQty(prev => ({ ...prev, [item.id]: initialQty }));
        }

        fetchRecipeForReadyItem(item.id);
      }
    });

    setReadyItems(updatedReady);
  };

  const handleRemoveReadyItem = (itemId) => {
    setReadyItems(prev => prev.filter(item => item.id !== itemId));
    setChecked(prev => ({ ...prev, [itemId]: false }));
  };

  const handleQtyChange = (itemId, val) => {
    setQty(prev => ({ ...prev, [itemId]: val }));
    setReadyItems(prev =>
  prev.map(item => (item.id === itemId ? { ...item, entered_qty: val } : item))
    );
  };

  /* ================= CONVERT TO PRODUCTION ================= */
  const handleConvertToProduction = async () => {
    if (readyItems.length === 0) {
      alert("Please send items to 'Ready For Production' first");
      return;
    }

    // Validate quantities
    const invalidQtyItem = readyItems.find(item => !item.entered_qty || Number(item.entered_qty) <= 0);
    if (invalidQtyItem) {
      alert(`Please enter a valid quantity for ${invalidQtyItem.name}`);
      return;
    }

    // Aggregated Required Stock Check
    const aggregatedRequired = {}; // { raw_material_id: { qty, name, unit } }

    for (const item of readyItems) {
      const materials = recipeMap[item.id] || [];
      const baseQty = Number(item.item_quantity || 1);
      const factor = Number(item.entered_qty) / baseQty;

      materials.forEach(mat => {
        const matId = mat.raw_material_id;
        const requiredAmt = Number(mat.quantity) * factor;

        if (!aggregatedRequired[matId]) {
          aggregatedRequired[matId] = {
            qty: 0,
            name: mat.raw_material_name,
            unit: mat.consume_unit_symbol,
          };
        }
        aggregatedRequired[matId].qty += requiredAmt;
      });
    }

    // Perform validation check against available stock
    const insufficientList = [];

    Object.entries(aggregatedRequired).forEach(([matId, req]) => {
      const stock = availableStock.find(s => s.raw_material_id === Number(matId));
      const availableQty = stock ? Number(stock.available_quantity_consume) : 0;

      if (availableQty < req.qty) {
        insufficientList.push({
          raw_material_id: Number(matId),
          name: req.name,
          required: req.qty,
          available: availableQty,
          unit: req.unit,
        });
      }
    });

    if (insufficientList.length > 0) {
      setInsufficientItems(insufficientList);
      setOpenWarning(true);
      return;
    }

    // Execute Production via API calls
    setLoading(true);

    try {
      for (const item of readyItems) {
        const payload = {
          branch_id,
          target_branch_id: targetBranchId || branch_id,
          item_id: item.id,
          recipe_id: item.recipe_id,
          produce_quantity: Number(item.entered_qty),
          produce_unit_id: item.recipe_unit_id || item.item_unit_id,
          created_by,
        };

        await api.post("/production/create", payload);
      }

      alert("Production completed successfully! Stock updated. ✅");
      navigate("/inventory/production");
    } catch (error) {
      console.error("Production conversion failed:", error);
      alert(
        error?.response?.data?.error ||
        error.message ||
        "Production failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* Helper to format numbers cleanly */
  const formatNumber = (num) => {
    return Number(num).toFixed(3).replace(/\.?0+$/, "");
  };

  return (
    <Box p={3} bgcolor="#F8FAFC" minHeight="100vh">
      {/* HEADER SECTION */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="body2" color="text.secondary">Production Type</Typography>
          <Select size="small" value="Direct" sx={{ minWidth: 160, bgcolor: "white" }}>
            <MenuItem value="Direct">Direct Production</MenuItem>
          </Select>
          <Button variant="outlined" size="small" sx={{ color: "#64748B", borderColor: "#CBD5E1", textTransform: "none" }}>
            More Filters
          </Button>
          <Button variant="contained" size="small" sx={{ bgcolor: "#2563EB" }}>
            Search
          </Button>
        </Stack>

        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" size="small" sx={{ color: "#64748B", borderColor: "#CBD5E1", textTransform: "none" }}>
            Production Via Excel ∨
          </Button>
          <Button variant="outlined" size="small" sx={{ color: "#64748B", borderColor: "#CBD5E1", textTransform: "none" }}>
            Generate Production Plan ∨
          </Button>
        </Stack>
      </Box>

      {/* SPLIT SCREEN PANEL */}
      <Grid container spacing={3} sx={{ height: "calc(100vh - 200px)" }}>
        {/* LEFT PANEL: SELECT PRODUCTION PROCESS */}
        <Grid item xs={12} md={6} sx={{ height: "100%" }}>
          <Paper sx={{ p: 2.5, height: "100%", display: "flex", flexDirection: "column", borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography fontWeight={700} fontSize={16} color="#1E293B">
                Select Production Processes
              </Typography>
              <TextField
                size="small"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                sx={{ width: 180 }}
              />
            </Box>

            <Divider />

            {/* List of items with checkboxes and quantities */}
            <Box sx={{ flexGrow: 1, overflowY: "auto", my: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
              {safeFilteredItems.length === 0 ? (
                <Typography color="text.secondary" align="center" mt={4}>
                  No items found with configured recipes
                </Typography>
              ) : (
                paginatedItems.map(item => (
                  <Box
                    key={item.id}
                    display="flex"
                    alignItems="center"
                    p={1.5}
                    sx={{
                      border: "1px solid #E2E8F0",
                      borderRadius: 2,
                      bgcolor: checked[item.id] ? "#EFF6FF" : "white",
                      borderColor: checked[item.id] ? "#93C5FD" : "#E2E8F0",
                    }}
                  >
                    <Checkbox
                      checked={!!checked[item.id]}
                      onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
                      size="small"
                    />

                    <Typography fontWeight={600} flex={1} sx={{ ml: 1, color: "#1E293B" }}>
                      {item.name}
                    </Typography>

                    <TextField
                      size="small"
                      type="number"
                      placeholder="Qty"
                      value={qty[item.id] ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setQty(prev => ({ ...prev, [item.id]: val }));
                        if (checked[item.id]) {
                          setReadyItems(prev =>
                            prev.map(r => (r.id === item.id ? { ...r, entered_qty: val } : r))
                          );
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontSize: 11, minWidth: 40 }}>
                            / {item.recipe_unit_symbol || item.item_unit_symbol || "-"}
                          </Typography>
                        ),
                      }}
                      sx={{ width: 150, mr: 2, bgcolor: "white" }}
                    />

                    <ArrowForwardIosIcon sx={{ color: "#94A3B8", fontSize: 14 }} />
                  </Box>
                ))
              )}
            </Box>

            {/* PAGINATION UI */}
            {totalPages > 0 && (
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={1} px={1}>
                <Typography variant="caption" color="text.secondary">
                  {(page - 1) * itemsPerPage + 1} - {Math.min(page * itemsPerPage, safeFilteredItems.length)} of {safeFilteredItems.length}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    sx={{ textTransform: "none", minWidth: "50px", color: "#64748B", borderColor: "#CBD5E1", py: 0 }}
                  >
                    Prev
                  </Button>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      bgcolor: "#1976d2",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                  >
                    {page}
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    sx={{ textTransform: "none", minWidth: "50px", color: "#64748B", borderColor: "#CBD5E1", py: 0 }}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            )}

            <Divider />

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="outlined"
                onClick={handleSendToProduction}
                sx={{ color: "#2563EB", borderColor: "#2563EB", textTransform: "none", borderRadius: 2 }}
              >
                Send Selected To Production
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* RIGHT PANEL: READY FOR PRODUCTION */}
        <Grid item xs={12} md={6} sx={{ height: "100%" }}>
          <Paper sx={{ p: 2.5, height: "100%", display: "flex", flexDirection: "column", borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography fontWeight={700} fontSize={16} color="#1E293B">
                Ready For Production
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography variant="body2" color="text.secondary">With Price</Typography>
                <Switch size="small" />
              </Stack>
            </Box>

            <Divider />

            {/* List of active production items */}
            <Box sx={{ flexGrow: 1, overflowY: "auto", my: 2, display: "flex", flexDirection: "column", gap: 2 }}>
              {readyItems.length === 0 ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%" flexDirection="column" gap={1}>
                  <Typography color="text.secondary">
                    No items ready for production
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Select processes from left panel and click 'Send Selected To Production'
                  </Typography>
                </Box>
              ) : (
                readyItems.map(item => {
                  const baseQty = Number(item.item_quantity || 1);
                  const materials = recipeMap[item.id] || [];
                  const factor = Number(item.entered_qty || 0) / baseQty;

                  return (
                    <Box
                      key={item.id}
                      sx={{
                        border: "1px solid #E2E8F0",
                        borderRadius: 3,
                        p: 2,
                        bgcolor: "#FAFAFA",
                      }}
                    >
                      {/* Item header row */}
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                        <Typography fontWeight={700} color="#1E293B">
                          {item.name}
                        </Typography>

                        <Stack direction="row" spacing={1} alignItems="center">
                          <TextField
                            size="small"
                            type="number"
                            value={item.entered_qty}
                            onChange={(e) => handleQtyChange(item.id, e.target.value)}
                            sx={{ width: 100, bgcolor: "white" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            / {item.recipe_unit_symbol || item.item_unit_symbol || "-"}
                          </Typography>
                          <IconButton color="error" size="small" onClick={() => handleRemoveReadyItem(item.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Box>

                      {/* Raw material calculation box */}
                      <Box display="flex" flexDirection="column" gap={1}>
                        {materials.map((mat, idx) => {
                          const calculatedAmt = Number(mat.quantity) * factor;

                          return (
                            <Box
                              key={idx}
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              px={2}
                              py={1}
                              sx={{
                                bgcolor: "white",
                                border: "1px solid #F1F5F9",
                                borderRadius: 1.5,
                              }}
                            >
                              <Typography variant="body2" color="#475569" fontWeight={500}>
                                {mat.raw_material_name}
                              </Typography>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="body2" fontWeight={700} color="#1E293B">
                                  {formatNumber(calculatedAmt)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  / {mat.consume_unit_symbol}
                                </Typography>
                              </Stack>
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  );
                })
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* FOOTER ACTIONS */}
      <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} mt={3}>
        <Select
          size="small"
          value={targetBranchId}
          onChange={(e) => setTargetBranchId(e.target.value)}
          displayEmpty
          sx={{ minWidth: 200, bgcolor: "white", borderRadius: 2 }}
        >
          <MenuItem value="">
            <em>Assign to (Default Self)</em>
          </MenuItem>
          {branches.map(b => (
            <MenuItem key={b.branch_id} value={b.branch_id}>
              {b.branch_name}
            </MenuItem>
          ))}
        </Select>

        <Button
          variant="outlined"
          onClick={() => navigate("/inventory/production")}
          sx={{ textTransform: "none", color: "#64748B", borderColor: "#CBD5E1", px: 3, borderRadius: 2 }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={loading || readyItems.length === 0}
          onClick={handleConvertToProduction}
          sx={{ bgcolor: "#2563EB", px: 4, borderRadius: 2, fontWeight: 600, "&:hover": { bgcolor: "#1D4ED8" } }}
        >
          {loading ? "Processing..." : "Convert To Production"}
        </Button>
      </Stack>

      {/* ================= INSUFFICIENT STOCK POPUP WARNING ================= */}
      <Dialog
        open={openWarning}
        onClose={() => setOpenWarning(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4 }
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "#EF4444", fontWeight: 800 }}>
          <WarningIcon /> Stock Not Available
        </DialogTitle>
        <Divider />

        <DialogContent>
          <Typography variant="body1" mb={2} color="#475569" fontWeight={500}>
            This item stock is not available. Please purchase it and add to stock first before converting to production:
          </Typography>

          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#FEF2F2" }}>
                  <TableCell sx={{ fontWeight: 700, color: "#991B1B" }}>Raw Material</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#991B1B" }}>Required Qty</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#991B1B" }}>Available Qty</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#991B1B" }}>Unit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {insufficientItems.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ fontWeight: 600, color: "#1E293B" }}>{item.name}</TableCell>
                    <TableCell sx={{ color: "#EF4444", fontWeight: 700 }}>
                      {formatNumber(item.required)}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#475569" }}>
                      {formatNumber(item.available)}
                    </TableCell>
                    <TableCell color="text.secondary">{item.unit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <Divider />

        <DialogActions sx={{ p: 2, bgcolor: "#F8FAFC" }}>
          <Button
            onClick={() => setOpenWarning(false)}
            variant="outlined"
            sx={{ textTransform: "none", color: "#64748B", borderColor: "#CBD5E1", borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpenWarning(false);
              navigate("/inventory/purchase/stockpurchase");
            }}
            variant="contained"
            color="error"
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Go to Purchase
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductionExecution;