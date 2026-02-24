// import React from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Chip,
//   Button,
// } from "@mui/material";

// const invoiceData = [
//   { id: "INV-001", date: "10 Feb 2026", amount: "₹1200", status: "Paid" },
//   { id: "INV-002", date: "12 Feb 2026", amount: "₹850", status: "Pending" },
//   { id: "INV-003", date: "15 Feb 2026", amount: "₹2200", status: "Paid" },
// ];

// const Invoices = () => {
//   return (
//     <Box p={3} bgcolor="#F4F6F8" minHeight="100vh">
//       <Typography variant="h4" fontWeight={800} mb={3}>
//         Invoices Management
//       </Typography>

//       <Paper sx={{ p: 2, borderRadius: 3 }}>
//         <Box
//           display="flex"
//           justifyContent="space-between"
//           alignItems="center"
//           mb={2}
//         >
//           <Typography fontWeight={700}>All Invoices</Typography>
//           <Button variant="contained">+ New Invoice</Button>
//         </Box>

//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Invoice ID</TableCell>
//               <TableCell>Date</TableCell>
//               <TableCell>Amount</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell align="right">Action</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {invoiceData.map((inv) => (
//               <TableRow key={inv.id} hover>
//                 <TableCell>{inv.id}</TableCell>
//                 <TableCell>{inv.date}</TableCell>
//                 <TableCell>{inv.amount}</TableCell>
//                 <TableCell>
//                   <Chip
//                     label={inv.status}
//                     color={inv.status === "Paid" ? "success" : "warning"}
//                     size="small"
//                   />
//                 </TableCell>
//                 <TableCell align="right">
//                   <Button size="small">View</Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </Paper>
//     </Box>
//   );
// };

// export default Invoices;


import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  Grid,
  TextField,
  MenuItem,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";

/* ===== DUMMY DATA ===== */
const invoiceData = [
  {
    id: "INV-001",
    client: "Restaurant A",
    date: "10 Feb 2026",
    amount: "₹1200",
    status: "Paid",
  },
  {
    id: "INV-002",
    client: "Cafe B",
    date: "12 Feb 2026",
    amount: "₹850",
    status: "Pending",
  },
  {
    id: "INV-003",
    client: "Hotel C",
    date: "15 Feb 2026",
    amount: "₹2200",
    status: "Paid",
  },
  {
    id: "INV-004",
    client: "Cloud Kitchen",
    date: "18 Feb 2026",
    amount: "₹1750",
    status: "Overdue",
  },
];

const Invoices = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredData = invoiceData.filter((inv) => {
    const matchSearch =
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.client.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "All" ? true : inv.status === filter;

    return matchSearch && matchFilter;
  });

  const getStatusColor = (status) => {
    if (status === "Paid") return "success";
    if (status === "Pending") return "warning";
    if (status === "Overdue") return "error";
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
            🧾 Invoices Management
          </Typography>
          <Typography color="text.secondary">
            Manage all your invoices, payments & billing records
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          sx={{
            borderRadius: 3,
            fontWeight: 700,
            px: 3,
          }}
        >
          + Create Invoice
        </Button>
      </Box>

      {/* ===== TOP STATS CARDS ===== */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={3}>
          <Paper sx={statCard("#4CAF50")}>
            <Typography>Total Invoices</Typography>
            <Typography variant="h5" fontWeight={800}>
              128
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={statCard("#2196F3")}>
            <Typography>Paid</Typography>
            <Typography variant="h5" fontWeight={800}>
              98
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={statCard("#FF9800")}>
            <Typography>Pending</Typography>
            <Typography variant="h5" fontWeight={800}>
              22
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={statCard("#E53935")}>
            <Typography>Overdue</Typography>
            <Typography variant="h5" fontWeight={800}>
              8
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ===== FILTER + SEARCH BAR ===== */}
      <Paper
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 3,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <TextField
          label="Search Invoice / Client"
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
          label="Filter Status"
          size="small"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Paid">Paid</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Overdue">Overdue</MenuItem>
        </TextField>

        <Button variant="outlined">Export CSV</Button>
      </Paper>

      {/* ===== INVOICE TABLE ===== */}
      <Paper
        sx={{
          borderRadius: 4,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#EEF2FF" }}>
              <TableCell sx={{ fontWeight: 800 }}>
                Invoice ID
              </TableCell>
              <TableCell sx={{ fontWeight: 800 }}>
                Client
              </TableCell>
              <TableCell sx={{ fontWeight: 800 }}>
                Date
              </TableCell>
              <TableCell sx={{ fontWeight: 800 }}>
                Amount
              </TableCell>
              <TableCell sx={{ fontWeight: 800 }}>
                Status
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredData.map((inv) => (
              <TableRow
                key={inv.id}
                hover
                sx={{
                  "&:hover": {
                    bgcolor: "#F8FAFC",
                  },
                }}
              >
                <TableCell sx={{ fontWeight: 700 }}>
                  {inv.id}
                </TableCell>
                <TableCell>{inv.client}</TableCell>
                <TableCell>{inv.date}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  {inv.amount}
                </TableCell>

                <TableCell>
                  <Chip
                    label={inv.status}
                    color={getStatusColor(inv.status)}
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                </TableCell>

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

/* ===== STATS CARD STYLE ===== */
const statCard = (color) => ({
  p: 2,
  borderRadius: 3,
  color: "#fff",
  background: `linear-gradient(135deg, ${color}, ${color}cc)`,
  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  transition: "0.3s",
  "&:hover": {
    transform: "translateY(-4px)",
  },
});

export default Invoices;