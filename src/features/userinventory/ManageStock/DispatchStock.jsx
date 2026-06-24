import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material";
import { Delete, Send, Add } from "@mui/icons-material";
import { getMyBranchesAPI } from "../../../services/api/branchAPI";
import axiosInstance from "../../../services/api/axios-config";

const DispatchStock = () => {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [availableStock, setAvailableStock] = useState([]);
  const [dispatchItems, setDispatchItems] = useState([{ raw_material_id: "", quantity: "" }]);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchBranches();
    fetchStock();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await getMyBranchesAPI();
      if (response && response.success) {
        // Filter out Central Warehouse
        const shops = response.data.filter(b => b.branch_name !== 'Central Warehouse');
        setBranches(shops);
      }
    } catch (err) {
      console.error("Failed to fetch branches", err);
    }
  };

  const fetchStock = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/stock/stockAvailable", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setAvailableStock(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch stock", error);
    }
  };

  const handleAddItem = () => {
    setDispatchItems([...dispatchItems, { raw_material_id: "", quantity: "" }]);
  };

  const handleRemoveItem = (index) => {
    const updated = [...dispatchItems];
    updated.splice(index, 1);
    setDispatchItems(updated);
  };

  const handleChangeItem = (index, field, value) => {
    const updated = [...dispatchItems];
    updated[index][field] = value;
    setDispatchItems(updated);
  };

  const handleDispatch = async () => {
    setError(null);
    if (!selectedBranch) {
      setError("Please select a target branch (shop).");
      return;
    }
    const validItems = dispatchItems.filter(item => item.raw_material_id && item.quantity > 0);
    if (validItems.length === 0) {
      setError("Please add at least one valid item to dispatch.");
      return;
    }

    try {
      const response = await axiosInstance.post("/stockTransfer/dispatch", {
        target_branch_id: selectedBranch,
        items: validItems
      });

      if (response.success) {
        setSuccessMsg("Stock dispatched successfully!");
        setDispatchItems([{ raw_material_id: "", quantity: "" }]);
        setSelectedBranch("");
        fetchStock(); // refresh central stock
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to dispatch stock.");
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Dispatch Stock to Shop
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Snackbar
        open={!!successMsg}
        autoHideDuration={3000}
        onClose={() => setSuccessMsg("")}
        message={successMsg}
      />

      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
          Select Destination Shop
        </Typography>
        <Select
          fullWidth
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          displayEmpty
          sx={{ mb: 3, maxWidth: 400 }}
        >
          <MenuItem value="" disabled>Select Branch</MenuItem>
          {branches.map(b => (
            <MenuItem key={b.branch_id} value={b.branch_id}>{b.branch_name}</MenuItem>
          ))}
        </Select>

        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
          Items to Dispatch
        </Typography>
        <Table sx={{ mb: 2, border: '1px solid #E2E8F0' }}>
          <TableHead sx={{ bgcolor: "#F1F5F9" }}>
            <TableRow>
              <TableCell><strong>Raw Material</strong></TableCell>
              <TableCell><strong>Available Stock</strong></TableCell>
              <TableCell><strong>Dispatch Quantity</strong></TableCell>
              <TableCell align="center"><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dispatchItems.map((item, index) => {
              const selectedStock = availableStock.find(s => s.raw_material_id === item.raw_material_id);
              const maxAvailable = selectedStock ? parseFloat(selectedStock.total_quantity) : 0;
              const consumeUnit = selectedStock ? selectedStock.consume_unit_name : "";

              return (
                <TableRow key={index}>
                  <TableCell>
                    <Select
                      fullWidth
                      value={item.raw_material_id}
                      onChange={(e) => handleChangeItem(index, "raw_material_id", e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>Select Item</MenuItem>
                      {availableStock.map(stock => (
                        <MenuItem key={stock.raw_material_id} value={stock.raw_material_id}>
                          {stock.item_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    {item.raw_material_id ? `${maxAvailable} ${consumeUnit}` : "-"}
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      placeholder="0.00"
                      value={item.quantity}
                      onChange={(e) => handleChangeItem(index, "quantity", e.target.value)}
                      inputProps={{ min: 0, max: maxAvailable, step: "0.01" }}
                      size="small"
                      disabled={!item.raw_material_id}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="error" onClick={() => handleRemoveItem(index)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <Button startIcon={<Add />} onClick={handleAddItem} sx={{ mb: 3 }}>
          Add Another Item
        </Button>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Send />}
            onClick={handleDispatch}
            sx={{ px: 4, py: 1 }}
          >
            Dispatch Items
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default DispatchStock;
