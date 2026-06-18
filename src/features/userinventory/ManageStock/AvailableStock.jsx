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
  Autocomplete,
  Pagination
} from "@mui/material";
import { Add, StarBorder } from "@mui/icons-material";
import AddStock from "./AddStock";

const AvailableStock = () => {
  const [openAddStock, setOpenAddStock] = useState(false);
  const [stockData, setStockData] = useState([]);
  const [updates, setUpdates] = useState({});
  const [reasons, setReasons] = useState({});
  const [comments, setComments] = useState({});

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Pagination State
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  

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



  const safeFilteredStock = Array.isArray(stockData) ? stockData.filter((row) =>
    row.raw_material_name.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  useEffect(() => {
    setPage(1);
  }, [searchQuery, stockData]);

  const totalPages = Math.ceil(safeFilteredStock.length / itemsPerPage);
  const paginatedStock = safeFilteredStock.slice((page - 1) * itemsPerPage, page * itemsPerPage);

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
          <Autocomplete
            size="small"
            freeSolo
            options={[...new Set(stockData.map((item) => item.raw_material_name))]}
            value={searchQuery}
            onInputChange={(e, newValue) => setSearchQuery(newValue || "")}
            renderInput={(params) => (
              <TextField {...params} label="Search Raw Material" sx={{ minWidth: 200 }} />
            )}
          />
          <Select size="small" defaultValue="All">
            <MenuItem value="All">All</MenuItem>
          </Select>
          <TextField label="Start Date" type="date" size="small" InputLabelProps={{ shrink: true }} />
          <TextField label="End Date" type="date" size="small" InputLabelProps={{ shrink: true }} />
          <Select size="small" defaultValue="Daily">
            <MenuItem value="Daily">Daily</MenuItem>
            <MenuItem value="Monthly">Monthly</MenuItem>
          </Select>

          <Button variant="outlined" color="error">
            Load
          </Button>
          <Button variant="outlined" onClick={() => setSearchQuery("")}>
            Clear
          </Button>
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
  {paginatedStock.map((row) => (
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

      {/* ================= PAGINATION ================= */}
      {totalPages > 0 && (
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} px={1}>
          <Typography variant="body2" color="text.secondary">
            Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, safeFilteredStock.length)} of {safeFilteredStock.length} records
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

      {/* ================= ACTION BUTTONS ================= */}
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button variant="contained" color="error" onClick={handleSaveAll}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default AvailableStock;
