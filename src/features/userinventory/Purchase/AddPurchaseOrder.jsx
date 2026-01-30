import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  Checkbox,
  IconButton,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import axios from "axios";

const AddPurchaseOrder = ({ onClose }) => {
  /* ================= AUTH ================= */
  const token = localStorage.getItem("authToken");

  /* ================= MASTER DATA ================= */
  const [suppliers, setSuppliers] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [units, setUnits] = useState([]);

  /* ================= FORM DATA ================= */
  const [supplierId, setSupplierId] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [taxAmount, setTaxAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("pending"); // ✅ NEW

  const [rows, setRows] = useState([
    {
      raw_material_id: "",
      quantity: "",
      unit_id: "",
      unit_price: "",
      amount: 0,
    },
  ]);

  /* ================= FETCH MASTER DATA ================= */
  useEffect(() => {
    fetchSuppliers();
    fetchRawMaterials();
    fetchUnits();
  }, []);

  const fetchSuppliers = async () => {
    const res = await axios.get("http://localhost:5000/api/suppliers/get", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.data.success) setSuppliers(res.data.data);
  };

  const fetchRawMaterials = async () => {
    const res = await axios.get("http://localhost:5000/api/raw/get", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRawMaterials(Array.isArray(res.data.data) ? res.data.data : res.data);
  };

  const fetchUnits = async () => {
    const res = await axios.get("http://localhost:5000/api/units/getUnit");
    setUnits(Array.isArray(res.data.data) ? res.data.data : res.data);
  };

  /* ================= ROW HANDLERS ================= */
  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        raw_material_id: "",
        quantity: "",
        unit_id: "",
        unit_price: "",
        amount: 0,
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;

    if (field === "quantity" || field === "unit_price") {
      const qty = Number(updated[index].quantity || 0);
      const price = Number(updated[index].unit_price || 0);
      updated[index].amount = qty * price;
    }

    setRows(updated);
  };

  /* ================= TOTALS ================= */
  const subTotal = rows.reduce((sum, r) => sum + r.amount, 0);
  const grandTotal = subTotal + Number(taxAmount) - Number(discountAmount);

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!supplierId || !purchaseDate) {
      alert("Supplier & Purchase Date required");
      return;
    }

    // const payload = {
    //   supplier_id: supplierId,
    //   purchase_date: purchaseDate,
    //   invoice_number: invoiceNumber,
    //   tax_amount: taxAmount,
    //   discount_amount: discountAmount,
    //   payment_status: paymentStatus, // ✅ ADDED
    //   items: rows.map((r) => ({
    //     raw_material_id: r.raw_material_id,
    //     quantity: r.quantity,
    //     unit_price: r.unit_price,
    //   })),
    // };

const payload = {
  supplier_id: supplierId,
  purchase_date: purchaseDate,
  invoice_number: invoiceNumber,
  tax_amount: Number(taxAmount),
  discount_amount: Number(discountAmount),
  grand_total: Number(grandTotal),   // ✅ ADD THIS LINE
  payment_status: paymentStatus,
  items: rows.map((r) => ({
    raw_material_id: r.raw_material_id,
    quantity: Number(r.quantity),
    unit_price: Number(r.unit_price),
  })),
};

    await axios.post(
      "http://localhost:5000/api/purchaseOrders/create",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    alert("Purchase Order Created Successfully");
    onClose();
  };

  /* ================= UI ================= */
  return (
    <Box sx={{ p: 3, position: "relative" }}>
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>

      <Typography fontSize={18} fontWeight={700} mb={2}>
        Add Purchase Order
      </Typography>

      {/* ===== TOP ===== */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              select
              label="Supplier *"
              fullWidth
              size="small"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
            >
              {suppliers.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name} ({s.company_name})
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              type="date"
              label="Purchase Date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              size="small"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Invoice Number"
              fullWidth
              size="small"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ===== RAW MATERIALS ===== */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography fontWeight={600}>Raw Materials</Typography>
          <Button startIcon={<AddIcon />} onClick={handleAddRow}>
            Add New
          </Button>
        </Box>

        {rows.map((row, index) => (
          <Grid container spacing={1} key={index} alignItems="center">
            <Grid item xs={3}>
              <TextField
                select
                label="Raw Material"
                fullWidth
                size="small"
                value={row.raw_material_id}
                onChange={(e) =>
                  handleRowChange(index, "raw_material_id", e.target.value)
                }
              >
                {rawMaterials.map((rm) => (
                  <MenuItem key={rm.id} value={rm.id}>
                    {rm.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={2}>
              <TextField
                label="Qty"
                size="small"
                fullWidth
                value={row.quantity}
                onChange={(e) =>
                  handleRowChange(index, "quantity", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={2}>
              <TextField
                select
                label="Unit"
                size="small"
                fullWidth
                value={row.unit_id}
                onChange={(e) =>
                  handleRowChange(index, "unit_id", e.target.value)
                }
              >
                {units.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.unit_symbol}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={2}>
              <TextField
                label="Price"
                size="small"
                fullWidth
                value={row.unit_price}
                onChange={(e) =>
                  handleRowChange(index, "unit_price", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={2}>
              <TextField size="small" value={row.amount} disabled fullWidth />
            </Grid>

            <Grid item xs={1}>
              <IconButton onClick={() => handleDeleteRow(index)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </Paper>

      {/* ===== TOTAL & PAYMENT ===== */}
      <Paper sx={{ p: 3 }}>
        <Typography>Sub Total: ₹ {subTotal}</Typography>

        <TextField
          label="Tax Amount"
          size="small"
          value={taxAmount}
          onChange={(e) => setTaxAmount(e.target.value)}
          sx={{ mt: 1 }}
        />

        <TextField
          label="Discount"
          size="small"
          value={discountAmount}
          onChange={(e) => setDiscountAmount(e.target.value)}
          sx={{ mt: 1 }}
        />

        {/* ✅ PAYMENT STATUS */}
        <TextField
          select
          label="Payment Status"
          size="small"
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          sx={{ mt: 2, minWidth: 220 }}
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="paid">Paid</MenuItem>
          <MenuItem value="partial">Partial</MenuItem>
        </TextField>

        <Typography fontWeight={700} mt={2}>
          Grand Total: ₹ {grandTotal}
        </Typography>

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save Purchase Order
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddPurchaseOrder;