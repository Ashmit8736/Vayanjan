import React from "react";
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
  Button,
} from "@mui/material";

const expenses = [
  { name: "Office Rent", amount: "₹15,000", date: "10 Feb 2026" },
  { name: "Internet Bill", amount: "₹2,000", date: "12 Feb 2026" },
  { name: "Electricity", amount: "₹4,500", date: "15 Feb 2026" },
];

const Expenses = () => {
  return (
    <Box p={3} bgcolor="#F1F5F9" minHeight="100vh">
      <Typography variant="h4" fontWeight={900} mb={2}>
        📉 Expenses Tracker
      </Typography>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={card("#F97316")}>
            <Typography>Total Expenses</Typography>
            <Typography variant="h5" fontWeight={900}>₹ 45,000</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={card("#8B5CF6")}>
            <Typography>This Month</Typography>
            <Typography variant="h5" fontWeight={900}>₹ 12,500</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={paper}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography fontWeight={800}>Expense History</Typography>
          <Button variant="contained">+ Add Expense</Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#FEF3C7" }}>
              <TableCell>Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((e, i) => (
              <TableRow key={i} hover>
                <TableCell sx={{ fontWeight: 700 }}>{e.name}</TableCell>
                <TableCell>{e.amount}</TableCell>
                <TableCell>{e.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

const card = (color) => ({
  p: 3,
  borderRadius: 3,
  color: "#fff",
  background: `linear-gradient(135deg, ${color}, ${color}cc)`,
});

const paper = {
  p: 3,
  borderRadius: 4,
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

export default Expenses;