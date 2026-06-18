import { useState, useEffect, useMemo } from "react";
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
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  Stack,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import DateRangeIcon from "@mui/icons-material/DateRange";
import axios from "axios";

const todayDate = () => new Date().toISOString().slice(0, 10);

const StockSummary = () => {
  const headerCellStyle = {
    fontWeight: 700,
    color: "#475569",
    fontSize: "11px",
    padding: "6px 8px",
    borderBottom: "1px solid #CBD5E1",
    whiteSpace: "nowrap",
  };

  const bodyCellStyle = {
    fontSize: "11px",
    padding: "4px 8px",
    borderBottom: "1px solid #E2E8F0",
    whiteSpace: "nowrap",
  };

  // Filters State
  const [fromDate, setFromDate] = useState(todayDate());
  const [toDate, setToDate] = useState(todayDate());
  const [category, setCategory] = useState("All");
  const [rawMaterial, setRawMaterial] = useState("");
  const [unitType, setUnitType] = useState("Purchase");

  // Data States
  const [reportData, setReportData] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(false);

  // Editable Physical Counts (Closing Summary J)
  const [closingSummaries, setClosingSummaries] = useState({});

  // Pagination State
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  // Fetch unique categories dynamically from raw materials to populate filter
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get("http://localhost:5000/api/raw/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success && Array.isArray(res.data.data)) {
        const uniqueCats = [
          "All",
          ...new Set(res.data.data.map((rm) => rm.category).filter(Boolean)),
        ];
        setCategories(uniqueCats);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchReport = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await axios.get(
        "http://localhost:5000/api/stock/stockSummaryReport",
        {
          params: {
            fromDate,
            toDate,
            category,
            unitType,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success && Array.isArray(res.data.data)) {
        setReportData(res.data.data);
        // Clear manual closing summary entries on fresh search
        setClosingSummaries({});
      }
    } catch (err) {
      console.error("Error fetching stock summary report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchReport();
  }, []);

  const filteredReportData = useMemo(() => {
    if (!rawMaterial) return reportData;
    const searchLower = rawMaterial.toLowerCase();
    return reportData.filter((row) =>
      row.raw_material_name && row.raw_material_name.toLowerCase().includes(searchLower)
    );
  }, [reportData, rawMaterial]);

  useEffect(() => {
    setPage(1);
  }, [rawMaterial, reportData]);

  const safeFilteredReportData = Array.isArray(filteredReportData) ? filteredReportData : [];
  const totalPages = Math.ceil(safeFilteredReportData.length / itemsPerPage);
  const paginatedReportData = safeFilteredReportData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleClear = () => {
    setFromDate(todayDate());
    setToDate(todayDate());
    setCategory("All");
    setRawMaterial("");
    setUnitType("Purchase");
  };

  const formatQty = (val) => {
    const num = Number(val || 0);
    return num.toFixed(3);
  };

  return (
    <Box p={3} bgcolor="#F8FAFC" minHeight="100vh">
      {/* HEADER SECTION */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography fontSize={18} fontWeight={700} color="#1E293B">
          Stock Summary Report
        </Typography>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            size="small"
            disabled
            sx={{
              textTransform: "none",
              color: "#64748B",
              borderColor: "#CBD5E1",
              fontWeight: 600,
            }}
          >
            Schedule Report
          </Button>
          <Button
            variant="outlined"
            size="small"
            sx={{
              textTransform: "none",
              color: "#64748B",
              borderColor: "#CBD5E1",
              fontWeight: 600,
            }}
          >
            Export ∨
          </Button>
        </Stack>
      </Box>

      {/* FILTER BAR CONTAINER */}
      <Paper
        sx={{
          p: 2.5,
          mb: 3,
          border: "1px solid #E2E8F0",
          borderRadius: 3,
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        }}
      >
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="flex-end">
          {/* Raw Material Filter */}
          <Box>
            <Typography variant="caption" fontWeight={700} color="#64748B" mb={0.5} display="block">
              Raw Material
            </Typography>
            <TextField
              size="small"
              placeholder="Search material..."
              value={rawMaterial}
              onChange={(e) => setRawMaterial(e.target.value)}
              sx={{ width: 180, bgcolor: "white" }}
            />
          </Box>

          {/* Category Filter */}
          <Box>
            <Typography variant="caption" fontWeight={700} color="#64748B" mb={0.5} display="block">
              Category
            </Typography>
            <FormControl size="small" sx={{ width: 150 }}>
              <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Unit Type Filter */}
          <Box>
            <Typography variant="caption" fontWeight={700} color="#64748B" mb={0.5} display="block">
              Unit Type
            </Typography>
            <FormControl size="small" sx={{ width: 150 }}>
              <Select value={unitType} onChange={(e) => setUnitType(e.target.value)}>
                <MenuItem value="Purchase">Purchase Unit</MenuItem>
                <MenuItem value="Consume">Consume Unit</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* From Date Filter */}
          <Box>
            <Typography variant="caption" fontWeight={700} color="#64748B" mb={0.5} display="block">
              From Date
            </Typography>
            <TextField
              type="date"
              size="small"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              sx={{ width: 140, bgcolor: "white" }}
            />
          </Box>

          {/* To Date Filter */}
          <Box>
            <Typography variant="caption" fontWeight={700} color="#64748B" mb={0.5} display="block">
              To Date
            </Typography>
            <TextField
              type="date"
              size="small"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              sx={{ width: 140, bgcolor: "white" }}
            />
          </Box>

          {/* Buttons */}
          <Stack direction="row" spacing={1} sx={{ ml: "auto" }}>
            <Button
              variant="contained"
              onClick={fetchReport}
              startIcon={<SearchIcon />}
              sx={{
                bgcolor: "#2563EB",
                fontWeight: 600,
                px: 3,
                "&:hover": { bgcolor: "#1D4ED8" },
              }}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              onClick={handleClear}
              startIcon={<ClearIcon />}
              sx={{
                color: "#64748B",
                borderColor: "#CBD5E1",
                fontWeight: 600,
                px: 2,
              }}
            >
              Clear
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* DATA TABLE CONTAINER */}
      <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto", border: "1px solid #E2E8F0", borderRadius: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
        <Table size="small" sx={{ minWidth: 1400 }}>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell sx={{ ...headerCellStyle, fontSize: "12px" }}>Raw Material</TableCell>
              <TableCell sx={headerCellStyle}>Opening (A)</TableCell>
              <TableCell sx={headerCellStyle}>Purchase (B)</TableCell>
              <TableCell sx={headerCellStyle}>Excess (C)</TableCell>
              <TableCell sx={{ ...headerCellStyle, bgcolor: "#E8F4FD" }}>Total ⓘ</TableCell>
              <TableCell sx={headerCellStyle}>Consumed (D)</TableCell>
              <TableCell sx={headerCellStyle}>Wastage (E)</TableCell>
              <TableCell sx={headerCellStyle}>Normal Loss (F)</TableCell>
              <TableCell sx={headerCellStyle}>Transfer (G)</TableCell>
              <TableCell sx={headerCellStyle}>Shortage (H)</TableCell>
              <TableCell sx={headerCellStyle}>Production (I)</TableCell>
              <TableCell sx={{ ...headerCellStyle, bgcolor: "#E8F4FD" }}>Total ⓘ</TableCell>
              <TableCell sx={headerCellStyle}>Closing Stock ⓘ</TableCell>
              <TableCell sx={{ ...headerCellStyle, bgcolor: "#E8F4FD" }}>Closing Summary ⓘ</TableCell>
              <TableCell sx={{ ...headerCellStyle, bgcolor: "#EFF6FF" }}>Difference</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={15} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={30} sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary" display="inline">
                    Generating report data...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : reportData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={15} align="center" sx={{ py: 4, color: "#94A3B8" }}>
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              paginatedReportData.map((row) => {
                const physicalCount =
                  closingSummaries[row.raw_material_id] !== undefined
                    ? closingSummaries[row.raw_material_id]
                    : formatQty(row.closing);

                const difference = Number(physicalCount) - row.closing;

                return (
                  <TableRow key={row.raw_material_id} hover>
                    {/* Raw Material Name & Unit */}
                    <TableCell sx={{ ...bodyCellStyle, fontWeight: 600, color: "#1E293B" }}>
                      {row.raw_material_name} [{row.unit}]
                    </TableCell>

                    {/* Opening (A) */}
                    <TableCell sx={bodyCellStyle}>{formatQty(row.opening)}</TableCell>

                    {/* Purchase (B) */}
                    <TableCell sx={bodyCellStyle}>{formatQty(row.purchase)}</TableCell>

                    {/* Excess (C) */}
                    <TableCell sx={{ ...bodyCellStyle, color: "#10B981" }}>{formatQty(row.excess)}</TableCell>

                    {/* Total (A+B+C) */}
                    <TableCell sx={{ ...bodyCellStyle, bgcolor: "#E8F4FD", fontWeight: 700, color: "#1E3A8A" }}>
                      {formatQty(row.totalIn)}
                    </TableCell>

                    {/* Consumed (D) */}
                    <TableCell sx={bodyCellStyle}>{formatQty(row.consumed)}</TableCell>

                    {/* Wastage (E) */}
                    <TableCell sx={{ ...bodyCellStyle, color: row.wastage > 0 ? "#EF4444" : "#475569" }}>
                      {formatQty(row.wastage)}
                    </TableCell>

                    {/* Normal Loss (F) */}
                    <TableCell sx={bodyCellStyle}>{formatQty(row.normalLoss)}</TableCell>

                    {/* Transfer (G) */}
                    <TableCell sx={bodyCellStyle}>{formatQty(row.transfer)}</TableCell>

                    {/* Shortage (H) */}
                    <TableCell sx={{ ...bodyCellStyle, color: row.shortage > 0 ? "#EF4444" : "#475569" }}>
                      {formatQty(row.shortage)}
                    </TableCell>

                    {/* Production (I) */}
                    <TableCell sx={{ ...bodyCellStyle, color: row.production < -0.0001 ? "#EF4444" : "#475569", fontWeight: 600 }}>
                      {formatQty(row.production)}
                    </TableCell>

                    {/* Total Out (second total) */}
                    <TableCell sx={{ ...bodyCellStyle, bgcolor: "#E8F4FD", fontWeight: 700, color: "#1E3A8A" }}>
                      {formatQty(row.totalOut)}
                    </TableCell>

                    {/* Closing Stock */}
                    <TableCell sx={{ ...bodyCellStyle, fontWeight: 700, color: "#1E293B" }}>
                      {formatQty(row.closing)}
                    </TableCell>

                    {/* Closing Summary - Editable Input */}
                    <TableCell sx={{ ...bodyCellStyle, bgcolor: "#E8F4FD", p: "2px 4px", minWidth: 90 }}>
                      <TextField
                        size="small"
                        type="number"
                        value={closingSummaries[row.raw_material_id] ?? ""}
                        placeholder={formatQty(row.closing)}
                        onChange={(e) =>
                          setClosingSummaries({
                            ...closingSummaries,
                            [row.raw_material_id]: e.target.value,
                          })
                        }
                        inputProps={{ style: { textAlign: "right", fontWeight: 700, fontSize: "11px", padding: "2px 6px" } }}
                        sx={{
                          bgcolor: "white",
                          borderRadius: 1,
                          width: "85px",
                          "& .MuiOutlinedInput-root": { height: 24 },
                        }}
                      />
                    </TableCell>

                    {/* Difference */}
                    <TableCell
                      align="right"
                      sx={{
                        ...bodyCellStyle,
                        fontWeight: 700,
                        bgcolor:
                          difference < -0.0001
                            ? "#FEF2F2"
                            : difference > 0.0001
                            ? "#ECFDF5"
                            : "#EFF6FF",
                        color:
                          difference < -0.0001
                            ? "#EF4444"
                            : difference > 0.0001
                            ? "#10B981"
                            : "#1E3A8A",
                      }}
                    >
                      {formatQty(difference)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ================= PAGINATION ================= */}
      {totalPages > 0 && !loading && (
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} px={1}>
          <Typography variant="body2" color="text.secondary">
            Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, safeFilteredReportData.length)} of {safeFilteredReportData.length} records
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
    </Box>
  );
};

export default StockSummary;
