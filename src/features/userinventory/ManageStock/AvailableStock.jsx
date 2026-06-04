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
  Dialog,
} from "@mui/material";
import { Add, StarBorder } from "@mui/icons-material";
import AddStock from "./AddStock";

const AvailableStock = () => {
  const [openAddStock, setOpenAddStock] = useState(false);
  const [stockData, setStockData] = useState([]);
  const [updates, setUpdates] = useState({});
  const [reasons, setReasons] = useState({});
  const [comments, setComments] = useState({});

  // 🔹 API CALL (GET AVAILABLE STOCK)
  const fetchStock = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("❌ Token missing");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/stock/stockAvailable", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const resData = await res.json();
      if (resData.success && Array.isArray(resData.data)) {
        setStockData(resData.data);
      }
    } catch (err) {
      console.error("API Error:", err.message);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const handleSaveAll = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const promises = Object.entries(updates)
      .filter(([_, val]) => val !== "" && !isNaN(val))
      .map(([rmId, val]) => {
        return fetch("http://localhost:5000/api/stock/stockUpdate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            raw_material_id: Number(rmId),
            quantity: Number(val),
            reason: reasons[rmId] || "Counting Error",
            comments: comments[rmId] || ""
          }),
        });
      });

    if (promises.length === 0) {
      alert("No changes to save");
      return;
    }

    try {
      await Promise.all(promises);
      alert("✅ Available stock updated successfully");
      setUpdates({});
      setReasons({});
      setComments({});
      fetchStock(); // Refresh stock list
    } catch (e) {
      console.error(e);
      alert("❌ Error saving stock");
    }
  };

  const formatQty = (value) => {
    if (value === null || value === undefined) return 0;

    const num = Number(value);

    // agar decimal . ke baad 0 hi hain → integer dikhao
    return Number.isInteger(num) ? num : num.toFixed(2);
  };


  return (
    <Box p={3}>
      {/* ================= HEADER ================= */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight={700}>
          Available Stock
        </Typography>

        <Button
          variant="contained"
          color="error"
          startIcon={<Add />}
          onClick={() => setOpenAddStock(true)}
        >
          Add Stock
        </Button>

        {/* CENTER MODAL (RAW MATERIAL STYLE) */}
        <Dialog
          open={openAddStock}
          onClose={() => setOpenAddStock(false)}
          maxWidth="lg"
          fullWidth
        >
          <AddStock onClose={() => setOpenAddStock(false)} />
        </Dialog>
      </Box>

      {/* ================= FILTER BAR ================= */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField label="Raw Material" size="small" />
          <Select size="small" defaultValue="All">
            <MenuItem value="All">All</MenuItem>
          </Select>
          <TextField type="date" size="small" />
          <Select size="small" defaultValue="Daily">
            <MenuItem value="Daily">Daily</MenuItem>
            <MenuItem value="Monthly">Monthly</MenuItem>
          </Select>

          <Button variant="outlined" color="error">
            Load
          </Button>
          <Button variant="outlined">Clear</Button>
        </Box>
      </Paper>

      {/* ================= TABLE ================= */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow sx={{ background: "#f5f7fa" }}>
              <TableCell>Category</TableCell>
              <TableCell>Raw Material</TableCell>
              <TableCell>Available Stock</TableCell>
              <TableCell sx={{ background: "#e8f9fd" }}>
                Update Your Available Stock
              </TableCell>
              <TableCell style={{ width: "200px" }}>Adjustment Reason</TableCell>
              <TableCell>Comments</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
  {stockData.map((row) => (
    <TableRow key={row.raw_material_id}>
      {/* CATEGORY */}
      <TableCell>
        <IconButton size="small">
          <StarBorder />
        </IconButton>
        {row.category}
      </TableCell>

      {/* NAME */}
      <TableCell>{row.raw_material_name}</TableCell>

      {/* AVAILABLE STOCK (PURCHASE UNIT) */}
      <TableCell>
        {formatQty(row.available_quantity_purchase)} {row.purchase_unit_symbol}
      </TableCell>

      {/* AVAILABLE STOCK (CONSUME UNIT) */}
      <TableCell sx={{ background: "#e8f9fd" }}>
        <Box display="flex" flexDirection="column" gap={0.5}>
          {/* show existing consume quantity */}
          <Typography variant="caption" color="text.secondary">
            Current: {formatQty(row.available_quantity_consume)} {row.consume_unit_symbol}
          </Typography>

          {/* input to update */}
          <TextField
            size="small"
            placeholder="New Stock"
            value={updates[row.raw_material_id] || ""}
            onChange={(e) => {
              setUpdates({
                ...updates,
                [row.raw_material_id]: e.target.value
              });
            }}
            InputProps={{
              endAdornment: `/${row.consume_unit_symbol}`,
            }}
          />
        </Box>
      </TableCell>

      {/* REASON */}
      <TableCell>
        <Select
          size="small"
          value={reasons[row.raw_material_id] || "Counting Error"}
          onChange={(e) => {
            setReasons({
              ...reasons,
              [row.raw_material_id]: e.target.value
            });
          }}
          fullWidth
        >
          <MenuItem value="Counting Error">Counting Error</MenuItem>
          <MenuItem value="Pilferage">Pilferage</MenuItem>
          <MenuItem value="Damage">Damage</MenuItem>
          <MenuItem value="Opening Stock">Opening Stock</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </TableCell>

      {/* COMMENTS */}
      <TableCell>
        <TextField
          size="small"
          placeholder="Comments"
          value={comments[row.raw_material_id] || ""}
          onChange={(e) => {
            setComments({
              ...comments,
              [row.raw_material_id]: e.target.value
            });
          }}
          fullWidth
        />
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </Paper>

      {/* ================= SAVE BUTTON ================= */}
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button variant="contained" color="error" onClick={handleSaveAll}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default AvailableStock;
