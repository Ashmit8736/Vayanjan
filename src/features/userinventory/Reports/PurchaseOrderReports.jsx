import { useParams } from "react-router-dom";

import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Chip,
} from "@mui/material";

const PurchaseOrderReports = () => {
  const order = {
    poNumber: "PO-1001",
    supplier: "ABC Traders",
    purchaseDate: "04-02-2026",
    invoiceNumber: "INV-456",
    paymentStatus: "Pending",
    items: [
      { material: "Badam", qty: 2, unit: "Kg", price: 600 },
      { material: "Besan", qty: 5, unit: "Kg", price: 60 },
    ],
    tax: 200,
    discount: 100,
  };

  const subTotal = order.items.reduce(
    (sum, i) => sum + i.qty * i.price,
    0
  );
  const grandTotal = subTotal + order.tax - order.discount;
const { id } = useParams();

  return (
    <Box p={3} bgcolor="#F8FAFC">
      {/* ===== REPORT HEADER ===== */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container alignItems="center">
          <Grid item xs={8}>
            <Typography variant="h5" fontWeight={800}>
              Purchase Order Report
            </Typography>
            
          </Grid>
          <Grid item xs={4} textAlign="right">
            <Chip
              label={order.paymentStatus}
              color={order.paymentStatus === "Paid" ? "success" : "warning"}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ===== BASIC DETAILS ===== */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography fontWeight={700} mb={2}>
          Purchase Details
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography><b>PO Number:</b> {order.poNumber}</Typography>
            <Typography><b>Supplier:</b> {order.supplier}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography><b>Purchase Date:</b> {order.purchaseDate}</Typography>
            <Typography><b>Invoice Number:</b> {order.invoiceNumber}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* ===== RAW MATERIALS ===== */}
      <Paper sx={{ mb: 3 }}>
        <Box px={3} py={2}>
          <Typography fontWeight={700}>
            Raw Materials Details
          </Typography>
        </Box>
        <Divider />

        <Table>
          <TableHead sx={{ bgcolor: "#F1F5F9" }}>
            <TableRow>
              <TableCell><b>Raw Material</b></TableCell>
              <TableCell align="right"><b>Qty</b></TableCell>
              <TableCell><b>Unit</b></TableCell>
              <TableCell align="right"><b>Price (₹)</b></TableCell>
              <TableCell align="right"><b>Total (₹)</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {order.items.map((item, i) => (
              <TableRow key={i}>
                <TableCell>{item.material}</TableCell>
                <TableCell align="right">{item.qty}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell align="right">{item.price}</TableCell>
                <TableCell align="right">
                  {item.qty * item.price}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* ===== TOTAL SUMMARY ===== */}
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>Sub Total</Typography>
            <Typography>Tax Amount</Typography>
            <Typography>Discount</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography fontWeight={800}>Grand Total</Typography>
          </Grid>

          <Grid item xs={6} textAlign="right">
            <Typography>₹ {subTotal}</Typography>
            <Typography>₹ {order.tax}</Typography>
            <Typography>₹ {order.discount}</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography fontWeight={800} fontSize={18}>
              ₹ {grandTotal}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default PurchaseOrderReports;