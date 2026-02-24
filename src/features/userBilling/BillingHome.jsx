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





import React from "react";
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
} from "@mui/material";

/* ===== STATS CARDS DATA ===== */
const cards = [
  {
    title: "Total Revenue",
    value: "₹ 2,45,000",
    bg: "linear-gradient(135deg,#4CAF50,#2E7D32)",
    icon: "💰",
  },
  {
    title: "Total Invoices",
    value: "128",
    bg: "linear-gradient(135deg,#2196F3,#1565C0)",
    icon: "🧾",
  },
  {
    title: "Pending Payments",
    value: "₹ 18,500",
    bg: "linear-gradient(135deg,#FF9800,#EF6C00)",
    icon: "⏳",
  },
  {
    title: "Paid This Month",
    value: "₹ 72,000",
    bg: "linear-gradient(135deg,#9C27B0,#6A1B9A)",
    icon: "📈",
  },
];

/* ===== RECENT INVOICES ===== */
const invoices = [
  { id: "INV-001", client: "Restaurant A", amount: "₹1200", status: "Paid" },
  { id: "INV-002", client: "Cafe B", amount: "₹850", status: "Pending" },
  { id: "INV-003", client: "Hotel C", amount: "₹2200", status: "Paid" },
  { id: "INV-004", client: "Cloud Kitchen", amount: "₹1750", status: "Pending" },
];

const BillingHome = () => {
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

        <Button variant="contained" size="large">
          + Create Invoice
        </Button>
      </Box>

      {/* ===== TOP GRADIENT CARDS ===== */}
      <Grid container spacing={2}>
        {cards.map((card, index) => (
          <Grid item xs={12} md={3} key={index}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                color: "#fff",
                background: card.bg,
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
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
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            }}
          >
            <Typography fontWeight={800} mb={1}>
              📊 Monthly Billing Usage
            </Typography>

            <LinearProgress
              variant="determinate"
              value={70}
              sx={{
                height: 12,
                borderRadius: 5,
                backgroundColor: "#E2E8F0",
              }}
            />

            <Typography mt={2} color="text.secondary">
              70% of billing quota used this month
            </Typography>

            <Typography mt={1} fontWeight={700} color="primary">
              ₹72,000 / ₹1,00,000
            </Typography>
          </Paper>
        </Grid>

        {/* QUICK STATS */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            }}
          >
            <Typography fontWeight={800} mb={2}>
              ⚡ Quick Stats
            </Typography>

            <Typography>✔ Paid Invoices: 98</Typography>
            <Typography mt={1}>⏳ Pending Invoices: 30</Typography>
            <Typography mt={1}>💰 Avg Invoice Value: ₹1,850</Typography>
            <Typography mt={1}>📅 This Month Growth: +18%</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ===== RECENT INVOICES TABLE ===== */}
      <Paper
        sx={{
          mt: 3,
          p: 3,
          borderRadius: 4,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <Typography fontWeight={900} mb={2}>
          🧾 Recent Invoices
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice ID</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id} hover>
                <TableCell sx={{ fontWeight: 700 }}>
                  {inv.id}
                </TableCell>
                <TableCell>{inv.client}</TableCell>
                <TableCell>{inv.amount}</TableCell>
                <TableCell>
                  <Chip
                    label={inv.status}
                    color={inv.status === "Paid" ? "success" : "warning"}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
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
          <Button variant="contained" color="success">
            + Create Invoice
          </Button>

          <Button variant="contained" color="primary">
            💳 Add Payment
          </Button>

          <Button variant="contained" color="warning">
            📊 View Reports
          </Button>

          <Button variant="contained" color="secondary">
            📥 Download Report
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default BillingHome;