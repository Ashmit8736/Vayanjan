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
  Chip,
} from "@mui/material";

const data = [
  { id: "TXN-001", type: "Credit", amount: "₹1200", status: "Success" },
  { id: "TXN-002", type: "Debit", amount: "₹500", status: "Pending" },
  { id: "TXN-003", type: "Credit", amount: "₹2200", status: "Success" },
];

const Transactions = () => {
  return (
    <Box p={3} bgcolor="#F1F5F9" minHeight="100vh">
      <Typography variant="h4" fontWeight={900} mb={2}>
        💳 Transactions Ledger
      </Typography>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={card("#10B981")}>
            <Typography>Total Credits</Typography>
            <Typography variant="h5" fontWeight={900}>₹85,000</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={card("#EF4444")}>
            <Typography>Total Debits</Typography>
            <Typography variant="h5" fontWeight={900}>₹25,000</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={paper}>
        <Typography fontWeight={800} mb={2}>All Transactions</Typography>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#E0F2FE" }}>
              <TableCell>ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((t) => (
              <TableRow key={t.id} hover>
                <TableCell>{t.id}</TableCell>
                <TableCell>
                  <Chip label={t.type} color={t.type === "Credit" ? "success" : "error"} />
                </TableCell>
                <TableCell>{t.amount}</TableCell>
                <TableCell>
                  <Chip label={t.status} color="primary" />
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

export default Transactions;