import React, { useState, useEffect } from "react";
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

const RANDOM_CLIENTS = [
  "Restaurant A", "Cafe B", "Hotel C", "Cloud Kitchen",
  "Shivam Sharma", "Ansh Agarwal", "Uncle ji", "Vikas Sharma",
  "Paras Agarwal", "Mukesh Trivedi", "Pranav Agarwal", "Arpit Sahu",
  "Jagriti Singh", "Harsh Agarwal", "Rohit Verma", "Shiv Kumar"
];

const CreateInvoice = () => {
    const [customer, setCustomer] = useState("");
  const [invoiceNo, setInvoiceNo] = useState(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
  const [tokenNumber, setTokenNumber] = useState(`TKN-${Math.floor(1000 + Math.random() * 9000)}`);
  const [availableItems, setAvailableItems] = useState([]);

  const [items, setItems] = useState([
    { name: "", qty: 1, price: 0 },
  ]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    fetch("http://localhost:5000/api/item/list", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(res => {
        if (res.success && Array.isArray(res.data)) {
          setAvailableItems(res.data);
        }
      })
      .catch(err => console.error("Error fetching items in CreateInvoice:", err));
  }, []);

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

  const handleItemSelect = (index, itemName) => {
    const updated = [...items];
    updated[index].name = itemName;
    const selectedItem = availableItems.find(i => i.name === itemName);
    if (selectedItem) {
      updated[index].price = Number(selectedItem.selling_price || 0);
    }
    setItems(updated);
  };

  const handleGenerateRandom = () => {
    const randomClient = RANDOM_CLIENTS[Math.floor(Math.random() * RANDOM_CLIENTS.length)];
    setCustomer(randomClient);

    const generatedInv = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
    const generatedToken = `TKN-${Math.floor(1000 + Math.random() * 9000)}`;
    setInvoiceNo(generatedInv);
    setTokenNumber(generatedToken);

    // Pick 1-3 random items from availableItems or fallback list
    const itemsSource = availableItems.length > 0 ? availableItems : [
      { name: "Samosa", selling_price: 20 },
      { name: "Pakodi", selling_price: 20 },
      { name: "Gunjiya", selling_price: 400 },
      { name: "oil", selling_price: 100 }
    ];

    const count = Math.floor(Math.random() * 3) + 1;
    const generatedItems = [];
    for (let i = 0; i < count; i++) {
      const selected = itemsSource[Math.floor(Math.random() * itemsSource.length)];
      const qty = Math.floor(Math.random() * 5) + 1;
      generatedItems.push({
        name: selected.name,
        qty,
        price: Number(selected.selling_price || selected.price || 0)
      });
    }
    setItems(generatedItems);
    alert(`⚡ Form populated with random invoice details! Invoice: ${generatedInv}, Token: ${generatedToken}. Click 'Generate Bill' to save.`);
  };

  const subtotal = items.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const handleSaveInvoice = () => {
    if (!customer) {
      alert("Customer Name is required");
      return;
    }

    const validItems = items.filter(i => i.name !== "" && i.qty > 0);
    if (validItems.length === 0) {
      alert("Please add at least one item");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Authentication token missing. Please log in again.");
      return;
    }

    const payload = {
      invoice_number: invoiceNo,
      token_number: tokenNumber,
      kot_number: tokenNumber,
      client_name: customer,
      subtotal: Number(subtotal.toFixed(2)),
      gst: Number(gst.toFixed(2)),
      total_amount: Number(total.toFixed(2)),
      items: validItems.map(item => ({
        name: item.name,
        qty: Number(item.qty),
        price: Number(item.price)
      }))
    };

    fetch("http://localhost:5000/api/invoices/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.message || "Failed to save invoice"); });
        }
        return res.json();
      })
      .then(() => {
        alert(`Invoice ${invoiceNo} Generated, Stock Consumed & Saved successfully! ✅`);
        // Reset Form
        setCustomer("");
        setInvoiceNo(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
        setTokenNumber(`TKN-${Math.floor(1000 + Math.random() * 9000)}`);
        setItems([{ name: "", qty: 1, price: 0 }]);
      })
      .catch(err => {
        console.error("❌ Save invoice error:", err);
        alert(`Failed to save invoice: ${err.message}`);
      });
  };

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

        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            color="warning"
            onClick={handleGenerateRandom}
            sx={{ borderRadius: 3, fontWeight: 800, borderWidth: 2, "&:hover": { borderWidth: 2 } }}
          >
            ⚡ Generate Random
          </Button>

          <Button
            variant="contained"
            color="success"
            startIcon={<ReceiptLongIcon />}
            onClick={handleSaveInvoice}
            sx={{ borderRadius: 3, fontWeight: 700 }}
          >
            Generate Bill
          </Button>
        </Box>
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
                  label="Token Number"
                  fullWidth
                  value={tokenNumber}
                  onChange={(e) => setTokenNumber(e.target.value)}
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
                    select
                    label="Item Name"
                    fullWidth
                    value={item.name}
                    onChange={(e) =>
                      handleItemSelect(index, e.target.value)
                    }
                  >
                    <MenuItem value="">Select Item</MenuItem>
                    {availableItems.map((ai) => (
                      <MenuItem key={ai.id} value={ai.name}>
                        {ai.name} (₹{ai.selling_price})
                      </MenuItem>
                    ))}
                  </TextField>
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
              onClick={handleSaveInvoice}
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