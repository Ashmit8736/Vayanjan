import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Divider,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

const CreateInvoice = () => {
  const [customer, setCustomer] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("INV-1001");

  const [items, setItems] = useState([
    { name: "", qty: 1, price: 0 },
  ]);

  const addItem = () => {
    setItems([...items, { name: "", qty: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const subtotal = items.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return (
    <Box p={3} bgcolor="#F1F5F9" minHeight="100vh">
      {/* HEADER */}
      <Box
        mb={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h4" fontWeight={900}>
          🧾 Create Invoice
        </Typography>

        <Button
          variant="contained"
          color="success"
          startIcon={<ReceiptLongIcon />}
          sx={{ borderRadius: 3, fontWeight: 700 }}
        >
          Generate Bill
        </Button>
      </Box>

      <Grid container spacing={2}>
        {/* LEFT SIDE - FORM */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            }}
          >
            <Typography fontWeight={800} mb={2}>
              Customer Details
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Invoice Number"
                  fullWidth
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Customer Name"
                  fullWidth
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* ITEMS SECTION */}
            <Typography fontWeight={800} mb={2}>
              🛒 Invoice Items
            </Typography>

            {items.map((item, index) => (
              <Grid container spacing={2} key={index} mb={1}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Item Name"
                    fullWidth
                    value={item.name}
                    onChange={(e) =>
                      handleChange(index, "name", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={4} md={2}>
                  <TextField
                    label="Qty"
                    type="number"
                    fullWidth
                    value={item.qty}
                    onChange={(e) =>
                      handleChange(index, "qty", Number(e.target.value))
                    }
                  />
                </Grid>

                <Grid item xs={6} md={3}>
                  <TextField
                    label="Price (₹)"
                    type="number"
                    fullWidth
                    value={item.price}
                    onChange={(e) =>
                      handleChange(index, "price", Number(e.target.value))
                    }
                  />
                </Grid>

                <Grid item xs={2} md={1}>
                  <IconButton
                    color="error"
                    onClick={() => removeItem(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

            <Button
              startIcon={<AddCircleIcon />}
              onClick={addItem}
              variant="outlined"
              sx={{ mt: 2, borderRadius: 2 }}
            >
              Add Item
            </Button>
          </Paper>
        </Grid>

        {/* RIGHT SIDE - BILL SUMMARY */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              background:
                "linear-gradient(135deg,#1E293B,#0F172A)",
              color: "#fff",
              boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
            }}
          >
            <Typography variant="h6" fontWeight={900} mb={2}>
              💰 Bill Summary
            </Typography>

            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Subtotal:</Typography>
              <Typography fontWeight={700}>
                ₹ {subtotal.toFixed(2)}
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>GST (18%):</Typography>
              <Typography fontWeight={700}>
                ₹ {gst.toFixed(2)}
              </Typography>
            </Box>

            <Divider sx={{ my: 2, borderColor: "#334155" }} />

            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6" fontWeight={900}>
                Total:
              </Typography>
              <Typography variant="h6" fontWeight={900}>
                ₹ {total.toFixed(2)}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              color="success"
              sx={{
                mt: 3,
                borderRadius: 3,
                fontWeight: 800,
                py: 1.2,
              }}
            >
              Save & Print Invoice
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateInvoice;