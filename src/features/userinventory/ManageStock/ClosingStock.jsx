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
  Autocomplete,
  Pagination,
} from "@mui/material";
import { StarBorder, Save } from "@mui/icons-material";

const ClosingStock = () => {
  const [stockData, setStockData] = useState([]);
  const [updates, setUpdates] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const safeFilteredStock = Array.isArray(stockData) ? stockData.filter((row) =>
    row.raw_material_name.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  // Pagination State
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setPage(1);
  }, [searchQuery, stockData]);

  const totalPages = Math.ceil(safeFilteredStock.length / itemsPerPage);
  const paginatedStock = safeFilteredStock.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // 🔹 API CALL (GET AVAILABLE STOCK FOR CLOSING ENTRY)
  const fetchStock = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("❌ Token missing");
      return;
    }

    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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
          }),
        });
      });

    if (promises.length === 0) {
      alert("Please enter closing stock values to save");
      return;
    }

    try {
      await Promise.all(promises);
      alert("✅ EOD Closing Stock saved successfully!");
      setUpdates({});
      fetchStock(); // Refresh stock list
    } catch (e) {
      console.error(e);
      alert("❌ Error saving closing stock");
    }
  };

  const formatQty = (value) => {
    if (value === null || value === undefined) return 0;
    const num = Number(value);
    return Number.isInteger(num) ? num : num.toFixed(2);
  };

  return (
    <Box p={3}>
      {/* ================= HEADER ================= */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight={700}>
          End of Day (EOD) Closing Stock
        </Typography>
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
            <MenuItem value="All">All Categories</MenuItem>
          </Select>
          <TextField label="Start Date" type="date" size="small" InputLabelProps={{ shrink: true }} defaultValue={new Date().toISOString().substring(0, 10)} />
          <TextField label="End Date" type="date" size="small" InputLabelProps={{ shrink: true }} defaultValue={new Date().toISOString().substring(0, 10)} />
          <Button variant="outlined" color="error">
            Load List
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
            <TableRow sx={{ background: "#F8FAFC" }}>
              <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Raw Material</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Book Stock (System qty)</TableCell>
              <TableCell sx={{ background: "#FFF8E1", fontWeight: 700 }}>
                Closing Stock (Physical count)
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Variance</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Comments</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading stock data...
                </TableCell>
              </TableRow>
            ) : safeFilteredStock.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No stock data found
                </TableCell>
              </TableRow>
            ) : (
              paginatedStock.map((row) => {
                const bookStock = Number(row.available_quantity_consume);
                const closingInput = updates[row.raw_material_id];
                const closingStock = closingInput !== undefined && closingInput !== "" ? Number(closingInput) : null;
                const variance = closingStock !== null ? closingStock - bookStock : 0;

                return (
                  <TableRow key={row.raw_material_id} hover>
                    {/* CATEGORY */}
                    <TableCell>
                      <IconButton size="small">
                        <StarBorder />
                      </IconButton>
                      {row.category}
                    </TableCell>

                    {/* NAME */}
                    <TableCell sx={{ fontWeight: 500 }}>{row.raw_material_name}</TableCell>

                    {/* AVAILABLE STOCK (SYSTEM qty) */}
                    <TableCell>
                      {formatQty(row.available_quantity_consume)} {row.consume_unit_symbol}
                    </TableCell>

                    {/* CLOSING STOCK INPUT */}
                    <TableCell sx={{ background: "#FFF8E1" }}>
                      <TextField
                        size="small"
                        placeholder="Enter Physical Count"
                        type="number"
                        value={closingInput || ""}
                        onChange={(e) => {
                          setUpdates({
                            ...updates,
                            [row.raw_material_id]: e.target.value,
                          });
                        }}
                        InputProps={{
                          endAdornment: `/${row.consume_unit_symbol}`,
                        }}
                        sx={{ bgcolor: "white", borderRadius: 1 }}
                      />
                    </TableCell>

                    {/* VARIANCE */}
                    <TableCell sx={{ 
                      fontWeight: 700, 
                      color: variance === 0 ? "text.primary" : variance > 0 ? "#2E7D32" : "#D32F2F"
                    }}>
                      {closingStock !== null ? `${variance > 0 ? "+" : ""}${formatQty(variance)} ${row.consume_unit_symbol}` : "0"}
                    </TableCell>

                    {/* COMMENTS */}
                    <TableCell>
                      <TextField size="small" placeholder="Enter reason if variance exists" fullWidth />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
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

      {/* ================= SAVE BUTTON ================= */}
      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button 
          variant="contained" 
          color="warning" 
          startIcon={<Save />}
          onClick={handleSaveAll}
          sx={{
            fontWeight: 700,
            textTransform: "none",
            boxShadow: "0 4px 12px rgba(255, 145, 0, 0.2)",
            px: 4,
            py: 1
          }}
        >
          Save EOD Closing Stock
        </Button>
      </Box>
    </Box>
  );
};

export default ClosingStock;
