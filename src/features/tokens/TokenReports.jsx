import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
  Chip,
  Alert,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Divider,
} from "@mui/material";

import {
  ConfirmationNumber,
  Print,
  FileDownload,
  Refresh,
  Event,
  Category,
  Assessment,
} from "@mui/icons-material";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";

import { getTokenStats } from "../../services/api/tokenAPI";
import * as XLSX from "xlsx";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const TokenReports = () => {
  // Default date ranges (last 30 days)
  const lastMonth = new Date();
  lastMonth.setDate(lastMonth.getDate() - 30);
  const defaultStartDate = lastMonth.toISOString().split("T")[0];
  const defaultEndDate = new Date().toISOString().split("T")[0];

  // Filters State
  const [period, setPeriod] = useState("daily");
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  // Data & Loading State
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search filter for local table
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        period,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        categories: selectedCategories.length > 0 ? selectedCategories.join(",") : undefined,
      };
      const response = await getTokenStats(params);
      if (response && response.success) {
        setData(response.data);
      } else {
        setError(response.message || "Failed to load token reports data");
      }
    } catch (err) {
      console.error("Error loading token data:", err);
      setError(err.message || "Something went wrong while fetching token reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period, startDate, endDate, selectedCategories]);

  // Excel Download Handler
  const handleExportExcel = () => {
    if (!data || !data.history || data.history.length === 0) {
      alert("No data available to export");
      return;
    }

    const exportData = data.history.map((row) => ({
      "Period (Date/Time)": row.periodKey,
      "Category": row.category,
      "Tokens Cut (Qty)": row.tokenCount,
      "Sales Amount (INR)": row.totalAmount,
      "Total Orders (Invoices)": row.orderCount,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Token Reports");

    // Auto-fit columns
    const maxKeys = Object.keys(exportData[0]);
    worksheet["!cols"] = maxKeys.map((key) => ({
      wch: Math.max(key.length + 5, 15),
    }));

    XLSX.writeFile(workbook, `Vyanjan_Token_Report_${period}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  const handleCategoryChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCategories(typeof value === "string" ? value.split(",") : value);
  };

  const clearFilters = () => {
    setPeriod("daily");
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    setSelectedCategories([]);
    setSearchTerm("");
  };

  // Filter history data locally for the search bar
  const getFilteredHistory = () => {
    if (!data || !data.history) return [];
    return data.history.filter(
      (h) =>
        h.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.periodKey.includes(searchTerm)
    );
  };

  // Transform history data for Recharts (group by period key for timeline visualization)
  const getChartData = () => {
    if (!data || !data.history) return [];
    
    // Group categories under the same period key
    const grouped = data.history.reduce((acc, curr) => {
      const { periodKey, category, tokenCount, totalAmount } = curr;
      if (!acc[periodKey]) {
        acc[periodKey] = { periodKey, totalTokens: 0, totalAmount: 0 };
      }
      acc[periodKey].totalTokens += tokenCount;
      acc[periodKey].totalAmount += totalAmount;
      // Add dynamic category property if needed
      acc[periodKey][category] = (acc[periodKey][category] || 0) + tokenCount;
      return acc;
    }, {});

    // Return sorted array from oldest to newest for chronological trend
    return Object.values(grouped).sort((a, b) => a.periodKey.localeCompare(b.periodKey));
  };

  const summary = data?.summary || { totalTokens: 0, totalAmount: 0, totalOrders: 0 };
  const categoriesList = data?.availableCategories || [];
  const filteredHistory = getFilteredHistory();
  const chartData = getChartData();

  // Print Styles Setup
  const printStyles = `
    @media print {
      body {
        background: #ffffff !important;
        color: #000000 !important;
        font-family: Arial, sans-serif;
      }
      .no-print {
        display: none !important;
      }
      .print-only {
        display: block !important;
      }
      .print-table {
        width: 100% !important;
        border-collapse: collapse !important;
        margin-top: 20px !important;
      }
      .print-table th, .print-table td {
        border: 1px solid #000000 !important;
        padding: 8px !important;
        text-align: left !important;
        font-size: 12px !important;
      }
      .print-header {
        text-align: center !important;
        margin-bottom: 20px !important;
        border-bottom: 2px solid #000000 !important;
        padding-bottom: 10px !important;
      }
      .print-summary-box {
        display: flex !important;
        justify-content: space-between !important;
        border: 1px solid #000000 !important;
        padding: 10px !important;
        margin-bottom: 20px !important;
      }
      .print-summary-item {
        text-align: center !important;
      }
    }
  `;

  return (
    <Box p={3} bgcolor="#F8FAFC" minHeight="100vh">
      <style>{printStyles}</style>

      {/* ================= PRINT ONLY CONTENT ================= */}
      <Box className="print-only" sx={{ display: "none" }}>
        <Box className="print-header">
          <Typography variant="h4" fontWeight={900}>
            VYANJAN RESTAURANT
          </Typography>
          <Typography variant="subtitle1">
            Token & Sales Performance Report ({period.toUpperCase()} View)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Date Generated: {new Date().toLocaleString()} | Filter: {startDate || "All"} to {endDate || "All"}
          </Typography>
        </Box>

        <Box className="print-summary-box">
          <Box className="print-summary-item">
            <Typography variant="caption">Total Tokens Issued</Typography>
            <Typography variant="h6" fontWeight={750}>{summary.totalTokens} Plates</Typography>
          </Box>
          <Box className="print-summary-item">
            <Typography variant="caption">Total Revenue (Amount)</Typography>
            <Typography variant="h6" fontWeight={750}>₹{summary.totalAmount.toLocaleString("en-IN")}</Typography>
          </Box>
          <Box className="print-summary-item">
            <Typography variant="caption">Total Orders Placed</Typography>
            <Typography variant="h6" fontWeight={750}>{summary.totalOrders}</Typography>
          </Box>
          <Box className="print-summary-item">
            <Typography variant="caption">Avg. Ticket Value</Typography>
            <Typography variant="h6" fontWeight={750}>
              ₹{summary.totalTokens > 0 ? (summary.totalAmount / summary.totalTokens).toFixed(2) : "0.00"}
            </Typography>
          </Box>
        </Box>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3, mb: 1 }}>
          Token Transaction Details
        </Typography>
        <table className="print-table">
          <thead>
            <tr>
              <th>Period</th>
              <th>Category</th>
              <th>Tokens Qty</th>
              <th>Amount (₹)</th>
              <th>Orders Count</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((row, idx) => (
              <tr key={idx}>
                <td>{row.periodKey}</td>
                <td>{row.category}</td>
                <td>{row.tokenCount}</td>
                <td>₹{row.totalAmount.toLocaleString("en-IN")}</td>
                <td>{row.orderCount}</td>
              </tr>
            ))}
            {filteredHistory.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </Box>

      {/* ================= SCREEN ONLY CONTENT ================= */}
      <Box className="no-print">
        {/* HEADER SECTION */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              sx={{
                bgcolor: "#0f766e",
                borderRadius: 2,
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(15, 118, 110, 0.3)",
              }}
            >
              <ConfirmationNumber sx={{ color: "white", fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={900} color="#0f172a" sx={{ fontSize: { xs: "1.75rem", md: "2.25rem" } }}>
                Token Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track counter tokens, category distributions, and daily kitchen workload.
              </Typography>
            </Box>
          </Box>

          <Box display="flex" gap={1.5}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Print />}
              onClick={handlePrint}
              disabled={loading}
              sx={{ borderColor: "#cbd5e1", color: "#475569", "&:hover": { borderColor: "#94a3b8", bgcolor: "#f1f5f9" } }}
            >
              Print
            </Button>
            <Button
              variant="contained"
              startIcon={<FileDownload />}
              onClick={handleExportExcel}
              disabled={loading}
              sx={{ bgcolor: "#0f766e", "&:hover": { bgcolor: "#0d655c" } }}
            >
              Excel Export
            </Button>
          </Box>
        </Box>

        {/* ERROR MESSAGE */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* FILTERS PANEL */}
        <Paper sx={{ p: 2.5, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.02)", border: "1px solid #e2e8f0", mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            {/* Period selector */}
            <Grid item xs={12} sm={6} md={2.5}>
              <FormControl fullWidth size="small">
                <InputLabel id="period-select-label">View Period</InputLabel>
                <Select
                  labelId="period-select-label"
                  value={period}
                  label="View Period"
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <MenuItem value="daily">Daily Wise</MenuItem>
                  <MenuItem value="monthly">Monthly Wise</MenuItem>
                  <MenuItem value="yearly">Yearly Wise</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Categories multi-select */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="categories-select-label">Categories</InputLabel>
                <Select
                  labelId="categories-select-label"
                  multiple
                  value={selectedCategories}
                  onChange={handleCategoryChange}
                  input={<OutlinedInput label="Categories" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" sx={{ bgcolor: "#e2e8f0", height: 20 }} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {categoriesList.map((catName) => (
                    <MenuItem key={catName} value={catName}>
                      <Checkbox checked={selectedCategories.indexOf(catName) > -1} size="small" />
                      <ListItemText primary={catName} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Date Pickers */}
            <Grid item xs={12} sm={6} md={2.5}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                size="small"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                size="small"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Refresh/Clear Buttons */}
            <Grid item xs={12} md={1.5} display="flex" gap={1} justifyContent={{ xs: "flex-end", md: "center" }}>
              <IconButton onClick={fetchData} title="Refresh Data" color="primary">
                <Refresh />
              </IconButton>
              <Button size="small" onClick={clearFilters} color="secondary" sx={{ textTransform: "none" }}>
                Clear
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* LOADING INDICATOR */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
            <CircularProgress size={50} sx={{ color: "#0f766e" }} />
          </Box>
        ) : (
          <>
            {/* KPI STATS CARDS */}
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={statCardStyle("#0f766e")}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontSize={14} fontWeight={600} sx={{ opacity: 0.85 }}>Tokens Qty (Plates)</Typography>
                    <ConfirmationNumber sx={{ opacity: 0.8 }} />
                  </Box>
                  <Typography variant="h4" fontWeight={900} sx={{ mt: 1 }}>
                    {summary.totalTokens.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    Total items prepared & served
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={statCardStyle("#4f46e5")}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontSize={14} fontWeight={600} sx={{ opacity: 0.85 }}>Sales Value</Typography>
                    <Typography fontWeight={700} sx={{ opacity: 0.85 }}>₹</Typography>
                  </Box>
                  <Typography variant="h4" fontWeight={900} sx={{ mt: 1 }}>
                    ₹{summary.totalAmount.toLocaleString("en-IN")}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    Total revenue from tokens
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={statCardStyle("#d97706")}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontSize={14} fontWeight={600} sx={{ opacity: 0.85 }}>Orders Count</Typography>
                    <Assessment sx={{ opacity: 0.8 }} />
                  </Box>
                  <Typography variant="h4" fontWeight={900} sx={{ mt: 1 }}>
                    {summary.totalOrders}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    Number of invoices generated
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={statCardStyle("#0891b2")}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontSize={14} fontWeight={600} sx={{ opacity: 0.85 }}>Avg. Ticket Value</Typography>
                    <Typography fontWeight={700} sx={{ opacity: 0.85 }}>₹</Typography>
                  </Box>
                  <Typography variant="h4" fontWeight={900} sx={{ mt: 1 }}>
                    ₹{summary.totalTokens > 0 ? (summary.totalAmount / summary.totalTokens).toFixed(1) : "0"}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    Average sales per token plate
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* CHARTS CONTAINER */}
            <Grid container spacing={3} mb={3}>
              {/* Token Qty Trend */}
              <Grid item xs={12} md={7}>
                <Paper sx={chartCardStyle}>
                  <Typography variant="h6" fontWeight={800} mb={2} color="#1e293b">
                    📈 Token Preparation Workload (Quantity)
                  </Typography>
                  <Box sx={{ width: "100%", height: 300 }}>
                    {chartData.length > 0 ? (
                      <ResponsiveContainer>
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0f766e" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="periodKey" stroke="#94a3b8" fontSize={11} />
                          <YAxis stroke="#94a3b8" fontSize={11} />
                          <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
                          <Area type="monotone" dataKey="totalTokens" name="Tokens Issued" stroke="#0f766e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTokens)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <NoDataBox />
                    )}
                  </Box>
                </Paper>
              </Grid>

              {/* Category-wise Sales Distribution */}
              <Grid item xs={12} md={5}>
                <Paper sx={chartCardStyle}>
                  <Typography variant="h6" fontWeight={800} mb={2} color="#1e293b">
                    🍰 Token Category Sales Volume (₹)
                  </Typography>
                  <Box sx={{ width: "100%", height: 300 }}>
                    {data?.categories && data.categories.length > 0 ? (
                      <ResponsiveContainer>
                        <BarChart data={data.categories} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                          <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                          <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={11} width={80} />
                          <Tooltip cursor={{ fill: "#f8fafc" }} />
                          <Bar dataKey="totalAmount" name="Sales (₹)" fill="#4f46e5" radius={[0, 6, 6, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <NoDataBox />
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* DETAILED STATS TABLE */}
            <Paper sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.02)", border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <Box p={2.5} display="flex" justifyContent="space-between" alignItems="center" bgcolor="#ffffff" flexWrap="wrap" gap={2}>
                <Typography variant="h6" fontWeight={800} color="#1e293b">
                  📊 Token Transactions Breakdown
                </Typography>
                <TextField
                  placeholder="Search Category or Period..."
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <IconButton size="small" disabled sx={{ p: 0, mr: 1 }}><Event fontSize="small" /></IconButton>,
                  }}
                  sx={{ width: { xs: "100%", sm: 260 } }}
                />
              </Box>
              <Divider />
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={tableHeaderStyle}>Period ({period})</TableCell>
                      <TableCell sx={tableHeaderStyle}>Category</TableCell>
                      <TableCell sx={tableHeaderStyle} align="right">Tokens Count (Plates)</TableCell>
                      <TableCell sx={tableHeaderStyle} align="right">Total Amount (₹)</TableCell>
                      <TableCell sx={tableHeaderStyle} align="right">Orders (Invoice Count)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredHistory.map((row, idx) => (
                      <TableRow key={idx} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell sx={{ fontWeight: 550, color: "#334155" }}>{row.periodKey}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.category}
                            size="small"
                            sx={{
                              bgcolor: row.category.toLowerCase() === "sweets" ? "#fdf2f8" : row.category.toLowerCase() === "snacks" || row.category.toLowerCase() === "snake" ? "#eff6ff" : "#f1f5f9",
                              color: row.category.toLowerCase() === "sweets" ? "#db2777" : row.category.toLowerCase() === "snacks" || row.category.toLowerCase() === "snake" ? "#2563eb" : "#475569",
                              fontWeight: 600,
                              borderRadius: 1.5
                            }}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: "#0f766e" }}>{row.tokenCount}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>₹{row.totalAmount.toLocaleString("en-IN")}</TableCell>
                        <TableCell align="right" sx={{ color: "#64748b" }}>{row.orderCount}</TableCell>
                      </TableRow>
                    ))}
                    {filteredHistory.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 6, color: "text.secondary" }}>
                          No token statistics match the search or filter criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        )}
      </Box>
    </Box>
  );
};

/* ===== STYLES ===== */

const statCardStyle = (color) => ({
  p: 2.5,
  borderRadius: 4,
  color: "#fff",
  background: `linear-gradient(135deg, ${color}, ${color}dd)`,
  boxShadow: "0 10px 20px rgba(0,0,0,0.06)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 14px 28px rgba(0,0,0,0.12)",
  },
});

const chartCardStyle = {
  p: 3,
  borderRadius: 4,
  boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
  border: "1px solid #e2e8f0",
  bgcolor: "#ffffff",
};

const tableHeaderStyle = {
  bgcolor: "#f8fafc",
  color: "#475569",
  fontWeight: 700,
  fontSize: "0.85rem",
  borderBottom: "2px solid #cbd5e1",
};

const NoDataBox = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100%" bgcolor="#f8fafc" borderRadius={3}>
    <Typography color="text.secondary">No trend data available for filters</Typography>
  </Box>
);

export default TokenReports;
