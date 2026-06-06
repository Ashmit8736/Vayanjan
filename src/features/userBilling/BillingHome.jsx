// import React from "react";
// import {
//   Box,
//   Grid,
//   Paper,
//   Typography,
//   Button,
//   LinearProgress,
// } from "@mui/material";

// const cards = [
//   {
//     title: "Total Revenue",
//     value: "₹ 2,45,000",
//     color: "#16a34a",
//   },
//   {
//     title: "Total Invoices",
//     value: "128",
//     color: "#2563eb",
//   },
//   {
//     title: "Pending Payments",
//     value: "₹ 18,500",
//     color: "#f59e0b",
//   },
//   {
//     title: "Paid This Month",
//     value: "₹ 72,000",
//     color: "#9333ea",
//   },
// ];

// const BillingHome = () => {
//   return (
//     <Box p={3} bgcolor="#F4F6F8" minHeight="100vh">
//       {/* HEADER */}
//       <Box mb={3}>
//         <Typography variant="h4" fontWeight={800}>
//           Billing Dashboard
//         </Typography>
//         <Typography color="text.secondary">
//           Overview of billing, invoices and payments
//         </Typography>
//       </Box>

//       {/* TOP CARDS */}
//       <Grid container spacing={2}>
//         {cards.map((card, index) => (
//           <Grid item xs={12} md={3} key={index}>
//             <Paper
//               sx={{
//                 p: 3,
//                 borderRadius: 3,
//                 boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
//               }}
//             >
//               <Typography color="text.secondary" fontSize={14}>
//                 {card.title}
//               </Typography>
//               <Typography
//                 variant="h5"
//                 fontWeight={800}
//                 mt={1}
//                 sx={{ color: card.color }}
//               >
//                 {card.value}
//               </Typography>
//             </Paper>
//           </Grid>
//         ))}
//       </Grid>

//       {/* PLAN USAGE */}
//       <Paper
//         sx={{
//           mt: 3,
//           p: 3,
//           borderRadius: 3,
//           boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
//         }}
//       >
//         <Typography fontWeight={700} mb={1}>
//           Monthly Billing Usage
//         </Typography>
//         <LinearProgress
//           variant="determinate"
//           value={70}
//           sx={{ height: 10, borderRadius: 5 }}
//         />
//         <Typography mt={1} color="text.secondary">
//           70% of billing quota used this month
//         </Typography>
//       </Paper>

//       {/* QUICK ACTIONS */}
//       <Paper
//         sx={{
//           mt: 3,
//           p: 3,
//           borderRadius: 3,
//         }}
//       >
//         <Typography fontWeight={700} mb={2}>
//           Quick Actions
//         </Typography>

//         <Box display="flex" gap={2}>
//           <Button variant="contained">+ Create Invoice</Button>
//           <Button variant="outlined">View Reports</Button>
//           <Button variant="outlined" color="success">
//             Add Payment
//           </Button>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default BillingHome;





import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const BillingHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_invoices: 0,
    pending_payments: 0,
    paid_this_month: 0,
    recent_invoices: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Session expired. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/invoices/dashboard-stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setStats(prev => ({ ...prev, ...json.data }));
      } else {
        setError(json.message || "Failed to load dashboard metrics");
      }
    } catch (err) {
      console.error("Dashboard Stats Fetch Error:", err);
      setError("Failed to fetch data from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalQuota = 100000;
  const quotaUsedPercent = Math.min(100, Math.round((stats.paid_this_month / totalQuota) * 100));

  const cardsData = [
    {
      title: "Total Revenue",
      value: `₹ ${Number(stats.total_revenue).toLocaleString("en-IN")}`,
      bg: "linear-gradient(135deg,#4CAF50,#2E7D32)",
      icon: "💰",
    },
    {
      title: "Total Invoices",
      value: String(stats.total_invoices),
      bg: "linear-gradient(135deg,#2196F3,#1565C0)",
      icon: "🧾",
    },
    {
      title: "Pending Payments",
      value: `₹ ${Number(stats.pending_payments).toLocaleString("en-IN")}`,
      bg: "linear-gradient(135deg,#FF9800,#EF6C00)",
      icon: "⏳",
    },
    {
      title: "Paid This Month",
      value: `₹ ${Number(stats.paid_this_month).toLocaleString("en-IN")}`,
      bg: "linear-gradient(135deg,#9C27B0,#6A1B9A)",
      icon: "📈",
    },
  ];

  return (
    <Box p={3} bgcolor="#F1F5F9" minHeight="100vh">
      {/* ===== HEADER ===== */}
      <Box
        mb={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Typography variant="h4" fontWeight={900}>
            💳 Billing Dashboard
          </Typography>
          <Typography color="text.secondary">
            Overview of revenue, invoices & payments analytics
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/billing/create-invoice")}
          sx={{ textTransform: "none", fontWeight: 700, borderRadius: 3 }}
        >
          + Create Invoice
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="40vh" flexDirection="column" gap={2}>
          <CircularProgress />
          <Typography color="text.secondary">Fetching live metrics...</Typography>
        </Box>
      ) : error ? (
        <Paper sx={{ p: 3, textAlign: "center", border: "1px solid #fee2e2", bgcolor: "#fef2f2" }}>
          <Typography color="error" fontWeight={600} mb={1}>
            ⚠ {error}
          </Typography>
          <Button variant="outlined" color="primary" onClick={fetchStats} sx={{ mt: 1, borderRadius: 2 }}>
            Retry
          </Button>
        </Paper>
      ) : (
        <>
          {/* ===== TOP GRADIENT CARDS ===== */}
          <Grid container spacing={2}>
            {cardsData.map((card, index) => (
              <Grid item xs={12} md={3} key={index}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    color: "#fff",
                    background: card.bg,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-6px) scale(1.02)",
                    },
                  }}
                >
                  <Typography fontSize={14} sx={{ opacity: 0.9 }}>
                    {card.icon} {card.title}
                  </Typography>

                  <Typography variant="h4" fontWeight={900} mt={1}>
                    {card.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* ===== MIDDLE SECTION ===== */}
          <Grid container spacing={2} mt={1}>
            {/* BILLING USAGE */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
                  border: "1px solid #E2E8F0"
                }}
              >
                <Typography fontWeight={800} mb={1.5}>
                  📊 Monthly Billing Usage
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={quotaUsedPercent}
                  sx={{
                    height: 12,
                    borderRadius: 5,
                    backgroundColor: "#E2E8F0",
                  }}
                />

                <Typography mt={2} color="text.secondary">
                  {quotaUsedPercent}% of billing quota used this month
                </Typography>

                <Typography mt={1} fontWeight={700} color="primary">
                  ₹{stats.paid_this_month.toLocaleString("en-IN")} / ₹{totalQuota.toLocaleString("en-IN")}
                </Typography>
              </Paper>
            </Grid>

            {/* QUICK STATS */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
                  border: "1px solid #E2E8F0"
                }}
              >
                <Typography fontWeight={800} mb={2}>
                  ⚡ Quick Stats
                </Typography>

                <Typography>✔ Total Invoices count: <b>{stats.total_invoices}</b></Typography>
                <Typography mt={1}>💰 Total Revenue generated: <b>₹{stats.total_revenue.toLocaleString("en-IN")}</b></Typography>
                <Typography mt={1}>⏳ Pending payment amount: <b>₹{stats.pending_payments.toLocaleString("en-IN")}</b></Typography>
                <Typography mt={1}>📅 Paid invoices sum this month: <b>₹{stats.paid_this_month.toLocaleString("en-IN")}</b></Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* ===== RECENT INVOICES TABLE ===== */}
          <Paper
            sx={{
              mt: 3,
              p: 3,
              borderRadius: 4,
              boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
              border: "1px solid #E2E8F0"
            }}
          >
            <Typography fontWeight={900} mb={2}>
              🧾 Recent Invoices
            </Typography>

            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#F8FAFC" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Invoice ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Client</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {stats.recent_invoices && stats.recent_invoices.length > 0 ? (
                  stats.recent_invoices.map((inv) => (
                    <TableRow key={inv.id} hover>
                      <TableCell sx={{ fontWeight: 700, color: "#1e3a8a" }}>
                        {inv.id}
                      </TableCell>
                      <TableCell>{inv.client || "Walk-in Customer"}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>₹{Number(inv.amount).toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={inv.status || "Paid"}
                          color={inv.status === "Paid" ? "success" : "warning"}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3, color: "#94A3B8" }}>
                      No recent invoices found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>

          {/* ===== QUICK ACTIONS ===== */}
          <Paper
            sx={{
              mt: 3,
              p: 3,
              borderRadius: 4,
              background: "linear-gradient(135deg,#1E293B,#0F172A)",
              color: "#fff",
            }}
          >
            <Typography fontWeight={900} mb={2}>
              🚀 Quick Actions
            </Typography>

            <Box display="flex" gap={2} flexWrap="wrap">
              <Button
                variant="contained"
                color="success"
                onClick={() => navigate("/billing/create-invoice")}
                sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
              >
                + Create Invoice
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/billing/payments")}
                sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
              >
                💳 Add Payment
              </Button>

              <Button
                variant="contained"
                color="warning"
                onClick={() => navigate("/billing/reports")}
                sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
              >
                📊 View Reports
              </Button>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default BillingHome;