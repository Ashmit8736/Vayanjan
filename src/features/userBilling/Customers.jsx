import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";

const dummyCustomers = [
  { name: "Restaurant A", phone: "9876543210", due: "₹1200", status: "Active" },
  { name: "Cafe B", phone: "9123456780", due: "₹0", status: "Paid" },
  { name: "Hotel C", phone: "9988776655", due: "₹3200", status: "Due" },
];

const Customers = () => {
  const [search, setSearch] = useState("");

  const filtered = dummyCustomers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box p={3} bgcolor="#F1F5F9" minHeight="100vh">
      <Typography variant="h4" fontWeight={900} mb={2}>
        👥 Customers Management
      </Typography>

      {/* TOP CARD */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={card("#6366F1")}>
            <Typography>Total Customers</Typography>
            <Typography variant="h5" fontWeight={900}>245</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={card("#22C55E")}>
            <Typography>Paid Customers</Typography>
            <Typography variant="h5" fontWeight={900}>180</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={card("#F59E0B")}>
            <Typography>Due Customers</Typography>
            <Typography variant="h5" fontWeight={900}>65</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* SEARCH + ADD */}
      <Paper sx={paper}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <TextField
            label="Search Customer"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="contained">+ Add Customer</Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#EEF2FF" }}>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Due Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((c, i) => (
              <TableRow key={i} hover>
                <TableCell sx={{ fontWeight: 700 }}>{c.name}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{c.due}</TableCell>
                <TableCell>
                  <Chip
                    label={c.status}
                    color={c.status === "Due" ? "warning" : "success"}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

const card = (color) => ({
  p: 2,
  borderRadius: 3,
  color: "#fff",
  background: `linear-gradient(135deg, ${color}, ${color}cc)`,
});

const paper = {
  p: 3,
  borderRadius: 4,
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

export default Customers;