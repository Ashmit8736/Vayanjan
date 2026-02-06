import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

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
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  // const formattedDate = new Date(order.purchaseDate)
  //   .toLocaleDateString("en-CA"); // YYYY-MM-DD
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };


  const token = localStorage.getItem("authToken"); // 🔑 auth token

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/purchaseOrders/purchase-orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrder(res.data.data);
      } catch (error) {
        console.error("Failed to fetch Purchase Order Report", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id, token]);

  if (loading) {
    return <Typography p={3}>Loading...</Typography>;
  }

  if (!order) {
    return <Typography p={3}>No data found</Typography>;
  }

  const subTotal = order.items.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );

  const grandTotal = subTotal + order.tax - order.discount;

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
            <Typography>
              <b>PO Number:</b> {order.poNumber}
            </Typography>
            <Typography>
              <b>Supplier:</b> {order.supplier}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Purchase Date:</b> {formatDate(order.purchaseDate)}
            </Typography>

            <Typography>
              <b>Invoice Number:</b> {order.invoiceNumber || "-"}
            </Typography>
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
            {order.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.material}</TableCell>
                <TableCell align="right">{item.qty}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell align="right">₹ {item.price}</TableCell>
                <TableCell align="right">
                  ₹ {item.qty * item.price}
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
