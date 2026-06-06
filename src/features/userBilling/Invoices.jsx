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
import { useNavigate } from "react-router-dom";
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

/* ===== DUMMY / INITIAL DATA ===== */
const INITIAL_INVOICES = [
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

const RANDOM_CLIENTS = [
  "Restaurant A", "Cafe B", "Hotel C", "Cloud Kitchen",
  "Shivam Sharma", "Ansh Agarwal", "Uncle ji", "Vikas Sharma",
  "Paras Agarwal", "Mukesh Trivedi", "Pranav Agarwal", "Arpit Sahu",
  "Jagriti Singh", "Harsh Agarwal", "Rohit Verma", "Shiv Kumar"
];

const RANDOM_ITEMS = [
  { name: "Samosa", price: 20 },
  { name: "Pakodi", price: 20 },
  { name: "Gunjiya", price: 400 },
  { name: "oil", price: 100 },
  { name: "ras1111", price: 123 },
  { name: "panner partha", price: 123 },
  { name: "aalu ka paratha", price: 60 },
  { name: "Badam ka laddoo", price: 2000 },
  { name: "Dry Fruit Laddoo", price: 2000 }
];

const Invoices = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInvoices = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/invoices/list", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        const mapped = data.data.map(inv => ({
          ...inv,
          amount: typeof inv.amount === "string" && inv.amount.startsWith("₹") ? inv.amount : `₹${inv.amount}`,
          client_name: inv.client_name || inv.client || "-",
          status: inv.status || "Paid"
        }));
        setInvoices(mapped);
      }
    } catch (err) {
      console.error("Error fetching invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchInvoices();
  }, []);

  const generateRandomInvoice = () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const client = RANDOM_CLIENTS[Math.floor(Math.random() * RANDOM_CLIENTS.length)];
    const invoiceNumber = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
    const tokenNumber = `TKN-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Pick 1-3 random items
    const itemCount = Math.floor(Math.random() * 3) + 1;
    let subtotal = 0;
    const itemsList = [];
    for (let i = 0; i < itemCount; i++) {
      const item = RANDOM_ITEMS[Math.floor(Math.random() * RANDOM_ITEMS.length)];
      const qty = Math.floor(Math.random() * 5) + 1;
      subtotal += item.price * qty;
      itemsList.push({
        name: item.name,
        qty,
        price: item.price
      });
    }
    const gst = subtotal * 0.18;
    const total = Math.round(subtotal + gst);

    const payload = {
      invoice_number: invoiceNumber,
      token_number: tokenNumber,
      kot_number: tokenNumber,
      client_name: client,
      subtotal: Number(subtotal.toFixed(2)),
      gst: Number(gst.toFixed(2)),
      total_amount: Number(total.toFixed(2)),
      items: itemsList
    };

    fetch("http://localhost:5000/api/invoices/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          alert(`⚡ Random Invoice ${invoiceNumber} created with Token ${tokenNumber}, stock consumed & saved to DB!`);
          fetchInvoices();
        } else {
          alert(`Failed to generate random invoice: ${res.message}`);
        }
      })
      .catch(err => {
        console.error(err);
        alert("Failed to generate random invoice");
      });
  };

  const filteredData = invoices.filter((inv) => {
    const searchLower = search.toLowerCase();
    const matchSearch =
      inv.invoice_number?.toLowerCase().includes(searchLower) ||
      inv.token_number?.toLowerCase().includes(searchLower) ||
      inv.client_name?.toLowerCase().includes(searchLower) ||
      inv.client?.toLowerCase().includes(searchLower) ||
      String(inv.id).toLowerCase().includes(searchLower);

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

  // Calculate statistics in real-time
  const totalCount = invoices.length;
  const paidCount = invoices.filter(inv => inv.status === "Paid").length;
  const pendingCount = invoices.filter(inv => inv.status === "Pending").length;
  const overdueCount = invoices.filter(inv => inv.status === "Overdue").length;

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

        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            color="warning"
            onClick={generateRandomInvoice}
            sx={{
              borderRadius: 3,
              fontWeight: 800,
              px: 3,
              borderWidth: 2,
              "&:hover": { borderWidth: 2 }
            }}
          >
            ⚡ Generate Random
          </Button>

          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: 3,
              fontWeight: 700,
              px: 3,
            }}
            onClick={() => navigate("/billing/create-invoice")}
          >
            + Create Invoice
          </Button>
        </Box>
      </Box>

      {/* ===== TOP STATS CARDS ===== */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={3}>
          <Paper sx={statCard("#4CAF50")}>
            <Typography>Total Invoices</Typography>
            <Typography variant="h5" fontWeight={800}>
              {totalCount}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={statCard("#2196F3")}>
            <Typography>Paid</Typography>
            <Typography variant="h5" fontWeight={800}>
              {paidCount}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={statCard("#FF9800")}>
            <Typography>Pending</Typography>
            <Typography variant="h5" fontWeight={800}>
              {pendingCount}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={statCard("#E53935")}>
            <Typography>Overdue</Typography>
            <Typography variant="h5" fontWeight={800}>
              {overdueCount}
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
                Invoice No
              </TableCell>
              <TableCell sx={{ fontWeight: 800 }}>
                Token
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
                key={`${inv.invoice_number}-${inv.token_number}-${inv.id}`}
                hover
                sx={{
                  "&:hover": {
                    bgcolor: "#F8FAFC",
                  },
                }}
              >
                <TableCell sx={{ fontWeight: 700 }}>
                  {inv.invoice_number || inv.id}
                </TableCell>
                <TableCell>{inv.token_number || "-"}</TableCell>
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