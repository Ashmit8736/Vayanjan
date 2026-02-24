// import React from "react";
// import {
//   Box,
//   Typography,
//   Grid,
//   Paper,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
// } from "@mui/material";

// const payments = [
//   { id: "PAY-001", method: "UPI", amount: "₹1200", date: "12 Feb 2026" },
//   { id: "PAY-002", method: "Cash", amount: "₹800", date: "14 Feb 2026" },
//   { id: "PAY-003", method: "Card", amount: "₹1500", date: "16 Feb 2026" },
// ];

// const Payments = () => {
//   return (
//     <Box p={3} bgcolor="#F4F6F8" minHeight="100vh">
//       <Typography variant="h4" fontWeight={800} mb={3}>
//         Payments
//       </Typography>

//       {/* STATS */}
//       <Grid container spacing={2} mb={3}>
//         <Grid item xs={12} md={4}>
//           <Paper sx={{ p: 2, borderRadius: 3 }}>
//             <Typography color="text.secondary">
//               Total Payments
//             </Typography>
//             <Typography variant="h5" fontWeight={800}>
//               ₹ 1,25,000
//             </Typography>
//           </Paper>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <Paper sx={{ p: 2, borderRadius: 3 }}>
//             <Typography color="text.secondary">
//               This Month
//             </Typography>
//             <Typography variant="h5" fontWeight={800}>
//               ₹ 32,500
//             </Typography>
//           </Paper>
//         </Grid>
//       </Grid>

//       {/* TABLE */}
//       <Paper sx={{ p: 2, borderRadius: 3 }}>
//         <Typography fontWeight={700} mb={2}>
//           Payment History
//         </Typography>

//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Payment ID</TableCell>
//               <TableCell>Method</TableCell>
//               <TableCell>Amount</TableCell>
//               <TableCell>Date</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {payments.map((pay) => (
//               <TableRow key={pay.id}>
//                 <TableCell>{pay.id}</TableCell>
//                 <TableCell>{pay.method}</TableCell>
//                 <TableCell>{pay.amount}</TableCell>
//                 <TableCell>{pay.date}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </Paper>
//     </Box>
//   );
// };

// export default Payments;




import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";

/* ===== DUMMY DATA ===== */
const paymentsData = [
  {
    id: "PAY-001",
    customer: "Restaurant A",
    method: "UPI",
    amount: "₹1200",
    status: "Completed",
    date: "12 Feb 2026",
  },
  {
    id: "PAY-002",
    customer: "Cafe B",
    method: "Cash",
    amount: "₹800",
    status: "Pending",
    date: "14 Feb 2026",
  },
  {
    id: "PAY-003",
    customer: "Hotel C",
    method: "Card",
    amount: "₹1500",
    status: "Completed",
    date: "16 Feb 2026",
  },
  {
    id: "PAY-004",
    customer: "Cloud Kitchen",
    method: "UPI",
    amount: "₹2100",
    status: "Failed",
    date: "18 Feb 2026",
  },
];

const Payments = () => {
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");

  const filteredPayments = paymentsData.filter((pay) => {
    const matchSearch =
      pay.id.toLowerCase().includes(search.toLowerCase()) ||
      pay.customer.toLowerCase().includes(search.toLowerCase());

    const matchMethod =
      methodFilter === "All" ? true : pay.method === methodFilter;

    return matchSearch && matchMethod;
  });

  const getStatusColor = (status) => {
    if (status === "Completed") return "success";
    if (status === "Pending") return "warning";
    if (status === "Failed") return "error";
    return "default";
  };

  return (
    <Box p={3} bgcolor="#F1F5F9" minHeight="100vh">
      {/* ===== HEADER ===== */}
      <Box
        mb={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
      >
        <Box>
          <Typography variant="h4" fontWeight={900}>
            💳 Payments Dashboard
          </Typography>
          <Typography color="text.secondary">
            Track all transactions, payment methods & history
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          sx={{ borderRadius: 3, fontWeight: 700 }}
        >
          + Add Payment
        </Button>
      </Box>

      {/* ===== TOP STATS CARDS (GRADIENT) ===== */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={3}>
          <Paper sx={gradientCard("#22C55E")}>
            <Typography>Total Payments</Typography>
            <Typography variant="h5" fontWeight={900}>
              ₹ 1,25,000
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={gradientCard("#3B82F6")}>
            <Typography>This Month</Typography>
            <Typography variant="h5" fontWeight={900}>
              ₹ 32,500
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={gradientCard("#F59E0B")}>
            <Typography>Pending Payments</Typography>
            <Typography variant="h5" fontWeight={900}>
              ₹ 8,200
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={gradientCard("#8B5CF6")}>
            <Typography>Success Rate</Typography>
            <Typography variant="h5" fontWeight={900}>
              92%
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ===== SEARCH + FILTER BAR ===== */}
      <Paper
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 3,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
          boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
        }}
      >
        <TextField
          label="Search Payment / Customer"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 260 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          label="Payment Method"
          size="small"
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="All">All Methods</MenuItem>
          <MenuItem value="UPI">UPI</MenuItem>
          <MenuItem value="Cash">Cash</MenuItem>
          <MenuItem value="Card">Card</MenuItem>
        </TextField>

        <Button variant="outlined">Export Report</Button>
      </Paper>

      {/* ===== PAYMENT TABLE ===== */}
      <Paper
        sx={{
          borderRadius: 4,
          boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#EEF2FF" }}>
              <TableCell sx={{ fontWeight: 800 }}>Payment ID</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Method</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredPayments.map((pay) => (
              <TableRow
                key={pay.id}
                hover
                sx={{
                  "&:hover": {
                    bgcolor: "#F8FAFC",
                  },
                }}
              >
                <TableCell sx={{ fontWeight: 700 }}>
                  {pay.id}
                </TableCell>
                <TableCell>{pay.customer}</TableCell>
                <TableCell>
                  <Chip
                    label={pay.method}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  {pay.amount}
                </TableCell>
                <TableCell>
                  <Chip
                    label={pay.status}
                    color={getStatusColor(pay.status)}
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell>{pay.date}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary">
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="success">
                    <DownloadIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

/* ===== GRADIENT CARD STYLE ===== */
const gradientCard = (color) => ({
  p: 2,
  borderRadius: 3,
  color: "#fff",
  background: `linear-gradient(135deg, ${color}, ${color}cc)`,
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  transition: "0.3s",
  "&:hover": {
    transform: "translateY(-5px) scale(1.02)",
  },
});

export default Payments;