// import React from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Grid,
// } from "@mui/material";

// const Reports = () => {
//   return (
//     <Box p={3} bgcolor="#F4F6F8" minHeight="100vh">
//       <Typography variant="h4" fontWeight={800} mb={3}>
//         Billing Reports & Analytics
//       </Typography>

//       <Grid container spacing={2}>
//         <Grid item xs={12} md={6}>
//           <Paper sx={{ p: 3, borderRadius: 3 }}>
//             <Typography fontWeight={700} mb={1}>
//               Monthly Revenue
//             </Typography>
//             <Typography color="text.secondary">
//               Graph integration (Chart.js / Recharts) yaha lagega
//             </Typography>
//           </Paper>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Paper sx={{ p: 3, borderRadius: 3 }}>
//             <Typography fontWeight={700} mb={1}>
//               Invoice Growth
//             </Typography>
//             <Typography color="text.secondary">
//               Analytics data visualization section
//             </Typography>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default Reports;







import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
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
  ResponsiveContainer,
} from "recharts";

/* ===== DUMMY DATA ===== */

const revenueData = [
  { month: "Jan", revenue: 40000, invoices: 40 },
  { month: "Feb", revenue: 55000, invoices: 52 },
  { month: "Mar", revenue: 48000, invoices: 45 },
  { month: "Apr", revenue: 62000, invoices: 60 },
  { month: "May", revenue: 70000, invoices: 68 },
  { month: "Jun", revenue: 85000, invoices: 80 },
];

const paymentMethodData = [
  { name: "UPI", value: 45 },
  { name: "Card", value: 30 },
  { name: "Cash", value: 15 },
  { name: "NetBanking", value: 10 },
];

const COLORS = ["#3B82F6", "#22C55E", "#F59E0B", "#EF4444"];

/* ===== COMPONENT ===== */

const Reports = () => {
  return (
    <Box p={3} bgcolor="#F1F5F9" minHeight="100vh">
      {/* HEADER */}
      <Box mb={3}>
        <Typography variant="h4" fontWeight={900}>
          📊 Billing Reports & Analytics
        </Typography>
        <Typography color="text.secondary">
          Detailed revenue insights, payment trends & performance metrics
        </Typography>
      </Box>

      {/* TOP STATS */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={3}>
          <Paper sx={statCard("#22C55E")}>
            <Typography>Total Revenue</Typography>
            <Typography variant="h5" fontWeight={900}>
              ₹ 4,50,000
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={statCard("#3B82F6")}>
            <Typography>Total Invoices</Typography>
            <Typography variant="h5" fontWeight={900}>
              325
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={statCard("#F59E0B")}>
            <Typography>Pending Amount</Typography>
            <Typography variant="h5" fontWeight={900}>
              ₹ 35,000
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={statCard("#8B5CF6")}>
            <Typography>Growth Rate</Typography>
            <Typography variant="h5" fontWeight={900}>
              +18%
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* CHART SECTION */}
      <Grid container spacing={2}>
        {/* REVENUE CHART */}
        <Grid item xs={12} md={8}>
          <Paper sx={chartCard}>
            <Typography fontWeight={800} mb={2}>
              📈 Monthly Revenue vs Invoices
            </Typography>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="revenue"
                  fill="#3B82F6"
                  radius={[6, 6, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="invoices"
                  stroke="#22C55E"
                  strokeWidth={3}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* PAYMENT METHOD PIE */}
        <Grid item xs={12} md={4}>
          <Paper sx={chartCard}>
            <Typography fontWeight={800} mb={2}>
              💳 Payment Method Distribution
            </Typography>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  nameKey="name"
                >
                  {paymentMethodData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* LEGEND */}
            {paymentMethodData.map((p, i) => (
              <Typography key={i} fontSize={14}>
                <span style={{ color: COLORS[i] }}>●</span> {p.name} – {p.value}%
              </Typography>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* BOTTOM SUMMARY */}
      <Paper sx={{ ...chartCard, mt: 2 }}>
        <Typography fontWeight={800} mb={1}>
          🏆 Top Performing Month
        </Typography>
        <Typography color="text.secondary">
          June generated highest revenue of ₹85,000 with 80 invoices processed.
        </Typography>
      </Paper>
    </Box>
  );
};

/* ===== STYLES ===== */

const statCard = (color) => ({
  p: 2,
  borderRadius: 3,
  color: "#fff",
  background: `linear-gradient(135deg, ${color}, ${color}cc)`,
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  transition: "0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
  },
});

const chartCard = {
  p: 3,
  borderRadius: 4,
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

export default Reports;