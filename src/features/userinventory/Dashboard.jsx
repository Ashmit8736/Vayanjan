import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress
} from "@mui/material";
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const COLORS = ["#43a047", "#f79b2a", "#f4511e", "#1e88e5", "#8b5cf6", "#64748b"];

const cardStyle = {
  color: "#fff",
  borderRadius: 3,
  boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    cards: {
      profit: 0,
      stockValue: 0,
      lowStockCount: 0,
      totalWastageQty: 0
    },
    chartData: [],
    pieData: [],
    expiryItems: [],
    alerts: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const res = await axios.get("http://localhost:5000/api/stock/dashboard-stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success && res.data.data) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching dashboard statistics:", err);
        setError("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="80vh" bgcolor="#f2f4f7">
        <CircularProgress size={50} sx={{ mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          Loading dashboard metrics...
        </Typography>
      </Box>
    );
  }

  // Cards with actual values
  const dashboardCards = [
    {
      title: "Profit",
      value: `₹ ${Number(stats.cards.profit).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: "💰",
      bg: "linear-gradient(135deg,#43a047,#2e7d32)"
    },
    {
      title: "Stock Worth",
      value: `₹ ${Number(stats.cards.stockValue).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: "📦",
      bg: "linear-gradient(135deg,#1e88e5,#1565c0)"
    },
    {
      title: "Low Stock",
      value: `${stats.cards.lowStockCount} Items`,
      icon: "⚠️",
      bg: "linear-gradient(135deg,#fb8c00,#ef6c00)"
    },
    {
      title: "Wastage",
      value: `${Number(stats.cards.totalWastageQty).toFixed(2)} Unit`,
      icon: "🗑️",
      bg: "linear-gradient(135deg,#e53935,#c62828)"
    }
  ];

  return (
    <Box p={3} bgcolor="#f2f4f7" minHeight="100vh">
      {/* TOP CARDS */}
      <Grid container spacing={2}>
        {dashboardCards.map((c, i) => (
          <Grid item xs={12} md={3} key={i}>
            <Paper sx={{ ...cardStyle, p: 2, background: c.bg }}>
              <Typography fontWeight="bold" sx={{ opacity: 0.9 }}>
                {c.icon} {c.title}
              </Typography>
              <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                {c.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* ALERT BAR */}
      <Paper
        sx={{
          mt: 2,
          p: 1.5,
          background: stats.alerts && stats.alerts.length > 0 
            ? "linear-gradient(90deg,#e53935,#c62828)"
            : "linear-gradient(90deg,#2e7d32,#43a047)",
          color: "#fff",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 3
        }}
      >
        {stats.alerts && stats.alerts.length > 0 ? (
          <>
            <strong>⚠ Alerts:</strong>
            {stats.alerts.map((alt, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    background: "#fff",
                    borderRadius: "50%",
                    display: "inline-block",
                    marginRight: 6
                  }}
                />
                {alt.name} is low ({alt.current_qty} {alt.unit})
              </span>
            ))}
          </>
        ) : (
          <>
            <strong>✅ All Good:</strong>
            <span>All raw materials are currently above minimum stock levels.</span>
          </>
        )}
      </Paper>

      {/* MAIN SECTION */}
      <Grid container spacing={2} mt={1}>
        {/* CHART SECTION */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, borderRadius: 3, height: "100%" }}>
            <Typography fontWeight="bold" mb={2}>
              Purchase vs Consumption (Last 6 Months)
            </Typography>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.chartData}>
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(val) => `₹${val}`} />
                <Tooltip formatter={(value) => [`₹${value}`, ""]} />
                <Legend />
                <Bar
                  name="Purchase Cost"
                  dataKey="purchase"
                  fill="#0778a5"
                  radius={[8, 8, 0, 0]}
                />
                <Line
                  name="Sales Revenue"
                  type="monotone"
                  dataKey="consumption"
                  stroke="#fb8c00"
                  strokeWidth={3}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* RIGHT SIDE SECTION */}
        <Grid item xs={12} md={4}>
          {/* PIE CHART */}
          <Paper sx={{ p: 2, mb: 2, borderRadius: 3 }}>
            <Typography fontWeight="bold" mb={2}>Top Materials Stock Value Share</Typography>

            {stats.pieData && stats.pieData.length > 0 ? (
              <Grid container alignItems="center">
                <Grid item xs={7}>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={stats.pieData}
                        innerRadius={55}
                        outerRadius={80}
                        dataKey="value"
                        nameKey="name"
                      >
                        {stats.pieData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </Grid>

                <Grid item xs={5}>
                  {stats.pieData.map((p, i) => (
                    <Typography key={i} fontSize={12} sx={{ mt: 0.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      <span style={{ color: COLORS[i % COLORS.length] }}>●</span> {p.value}% {p.name}
                    </Typography>
                  ))}
                </Grid>
              </Grid>
            ) : (
              <Box height={200} display="flex" justifyContent="center" alignItems="center">
                <Typography color="text.secondary" fontSize={14}>
                  No active stocks to display
                </Typography>
              </Box>
            )}
          </Paper>

          {/* EXPIRY ITEMS */}
          <Paper
            sx={{
              p: 2,
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
            }}
          >
            <Typography fontWeight="bold" mb={1.5}>
              ⏳ Expiry Items (Within 30 Days)
            </Typography>

            <Table size="small">
              <TableHead>
                <TableRow sx={{ background: "#e3f2fd" }}>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "11px", py: 1 }}>Item</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "11px", py: 1 }}>Expiry</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "11px", py: 1 }}>Qty</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {stats.expiryItems && stats.expiryItems.length > 0 ? (
                  stats.expiryItems.map((e, i) => {
                    const expDate = new Date(e.raw_expiry_date || e.date);
                    const isNearExpiry = expDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                    return (
                      <TableRow
                        key={i}
                        hover
                        sx={{
                          background: isNearExpiry ? "#fff3e0" : "inherit"
                        }}
                      >
                        <TableCell sx={{ fontSize: "11px", py: 1 }}>📦 {e.item}</TableCell>
                        <TableCell sx={{ fontSize: "11px", color: isNearExpiry ? "#e65100" : "inherit", fontWeight: isNearExpiry ? "bold" : "normal", py: 1 }}>
                          {e.date}
                        </TableCell>
                        <TableCell sx={{ fontSize: "11px", py: 1 }}>{e.qty}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ color: "#94a3b8", fontSize: "11px", py: 2 }}>
                      No items expiring soon
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>

      {/* QUICK ACTIONS */}
      <Paper sx={{ mt: 2, p: 2, borderRadius: 3 }}>
        <Typography fontWeight="bold" mb={2}>
          ⚡ Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              sx={{ minWidth: 140, fontWeight: 600 }}
              variant="contained"
              color="success"
              onClick={() => navigate("/inventory/purchase/stockpurchase")}
            >
              + Purchase
            </Button>
          </Grid>

          <Grid item>
            <Button
              sx={{ minWidth: 140, fontWeight: 600 }}
              variant="contained"
              color="warning"
              onClick={() => navigate("/inventory/wastage")}
            >
              Log Wastage
            </Button>
          </Grid>

          <Grid item>
            <Button
              sx={{ minWidth: 140, fontWeight: 600 }}
              variant="contained"
              color="primary"
              onClick={() => navigate("/inventory/production/execution")}
            >
              Production Execution
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard;