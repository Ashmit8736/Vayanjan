import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  MenuItem,
  Divider,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import axios from "axios";

const AddPurchase = ({ open, onClose }) => {
  /* ================= MASTER DATA ================= */
  const [suppliers, setSuppliers] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [units, setUnits] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FORM ================= */
  const [form, setForm] = useState({
    supplier_id: "",
    invoice_date: "",
    invoice_number: "",
    purchase_order_id: "",
  });

  const emptyRow = {
    raw_material_id: "",
    quantity: "",
    unit_id: "",
    unit_price: "",
    cgst_percent: "",
    sgst_percent: "",
    igst_percent: "",
    item_discount: "",
  };

  const [rows, setRows] = useState([emptyRow]);

  /* ================= FETCH MASTER DATA ================= */
  useEffect(() => {
    if (open) fetchAll();
  }, [open]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      const [supRes, rawRes, unitRes, poRes] = await Promise.all([
        axios.get("http://localhost:5000/api/suppliers/get", { headers }),
        axios.get("http://localhost:5000/api/raw/get", { headers }),
        axios.get("http://localhost:5000/api/units/getUnit"),
        axios.get("http://localhost:5000/api/purchaseOrders/get", { headers }),
      ]);

      setSuppliers(supRes.data.data || []);
      setRawMaterials(rawRes.data.data || rawRes.data || []);
      setUnits(unitRes.data.data || unitRes.data || []);
      setPurchaseOrders(poRes.data.data || []);
    } catch (err) {
      console.error("❌ Master fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH PO DETAILS ================= */
  const fetchPoDetails = async (poId) => {
    try {
      const token = localStorage.getItem("authToken");

      const res = await axios.get(
        `http://localhost:5000/api/purchaseOrders/purchase-orders/${poId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const po = res.data.data;

      const mappedRows = po.items.map((item) => {
        const material = rawMaterials.find(
          (r) => r.name === item.material
        );

        const unit = units.find(
          (u) => u.unit_symbol === item.unit
        );

        return {
          raw_material_id: material?.id || "",
          quantity: item.qty,
          unit_id: unit?.id || "",
          unit_price: item.price,
          cgst_percent: "",
          sgst_percent: "",
          igst_percent: "",
          item_discount: "",
        };
      });

      setRows(mappedRows.length ? mappedRows : [emptyRow]);

      setForm({
        purchase_order_id: poId,
        supplier_id: po.supplier,
        invoice_number: po.invoiceNumber || "",
        invoice_date: po.purchaseDate?.slice(0, 10),
      });
    } catch (err) {
      console.error("❌ PO fetch error", err);
    }
  };

  /* ================= ROW HANDLERS ================= */
  const addRow = () => setRows([...rows, emptyRow]);

  const deleteRow = (index) =>
    setRows(rows.filter((_, i) => i !== index));

  const handleRowChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!form.purchase_order_id) {
        alert("Please select Purchase Order");
        return;
      }

      const payload = {
        purchase_order_id: Number(form.purchase_order_id),
        items: rows.map((r) => ({
          raw_material_id: Number(r.raw_material_id),
          quantity: Number(r.quantity),
          unit_id: Number(r.unit_id),
          unit_price: Number(r.unit_price),
          cgst_percent: Number(r.cgst_percent || 0),
          sgst_percent: Number(r.sgst_percent || 0),
          igst_percent: Number(r.igst_percent || 0),
          item_discount: Number(r.item_discount || 0),
        })),
      };

      console.log("🚀 FINAL PAYLOAD:", payload);

      await axios.post(
        "http://localhost:5000/api/stockPurchaseItems/stock-purchase-items",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // onClose();
      resetForm();
onClose();

    } catch (err) {
      console.error("❌ Save error", err);
      alert("Failed to save purchase");
    }
  };

  const getItemTotal = (row) => {
    const qty = Number(row.quantity || 0);
    const price = Number(row.unit_price || 0);
    const cgst = Number(row.cgst_percent || 0);
    const sgst = Number(row.sgst_percent || 0);
    const igst = Number(row.igst_percent || 0);
    const discount = Number(row.item_discount || 0);

    const base = qty * price;
    const tax = (base * (cgst + sgst + igst)) / 100;

    return base + tax - discount;
  };

  const grandTotal = rows.reduce(
    (sum, row) => sum + getItemTotal(row),
    0
  );
  const resetForm = () => {
  setForm({
    supplier_id: "",
    invoice_date: "",
    invoice_number: "",
    purchase_order_id: "",
  });
  setRows([emptyRow]);
};



  return (
    <Dialog open={open} maxWidth="xl" fullWidth>
      <DialogContent sx={{ bgcolor: "#F3F4F6" }}>
        {/* HEADER */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography fontSize={20} fontWeight={700}>
            Add Purchase Items
          </Typography>
          {/* <IconButton onClick={onClose}> */}
          <IconButton
  onClick={() => {
    resetForm();
    onClose();
  }}
>

            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <Box textAlign="center" p={6}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* ================= PO DETAILS ================= */}
            <Box
              sx={{
                bgcolor: "#FFFFFF",
                p: 3,
                borderRadius: 2,
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                mb: 4,
              }}
            >
              <Typography fontWeight={700} mb={2}>
                Purchase Order Details
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <TextField
                    select
                    fullWidth
                    label="PO Number"
                    value={form.purchase_order_id}
                    onChange={(e) => fetchPoDetails(e.target.value)}
                  >
                    {purchaseOrders.map((po) => (
                      <MenuItem key={po.id} value={po.id}>
                        {po.po_number}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Supplier"
                    value={form.supplier_id}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={3}>
                  <TextField
                    type="date"
                    fullWidth
                    label="Invoice Date"
                    InputLabelProps={{ shrink: true }}
                    value={form.invoice_date}
                  />
                </Grid>

                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Invoice Number"
                    value={form.invoice_number}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* ================= ITEMS ================= */}
            <Box
              sx={{
                bgcolor: "#FFFFFF",
                p: 3,
                borderRadius: 2,
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              <Typography fontWeight={700} mb={2}>
                Purchase Items
              </Typography>

              {/* TABLE HEADER */}
              <Grid container spacing={1} mb={1}>
                {[
                  ["Material", 2],
                  ["Qty", 1],
                  ["Unit", 1],
                  ["Price", 1],
                  ["CGST %", 1],
                  ["SGST %", 1],
                  ["IGST %", 1],
                  ["Discount", 1.5],
                  ["Total", 1.5],
                  ["", 0.5],
                ].map(([label, size], i) => (
                  <Grid item xs={size} key={i}>
                    <Typography
                      fontSize={12}
                      fontWeight={600}
                      color="text.secondary"
                    >
                      {label}
                    </Typography>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ mb: 2 }} />

              {rows.map((row, i) => (
                <Grid
                  container
                  spacing={1}
                  key={i}
                  alignItems="center"
                  mb={1}
                >
                  <Grid item xs={2}>
                    <TextField
                      select
                      size="small"
                      fullWidth
                      value={row.raw_material_id}
                      onChange={(e) =>
                        handleRowChange(i, "raw_material_id", e.target.value)
                      }
                    >
                      {rawMaterials.map((r) => (
                        <MenuItem key={r.id} value={r.id}>
                          {r.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={1}>
                    <TextField
                      size="small"
                      fullWidth
                      value={row.quantity}
                      onChange={(e) =>
                        handleRowChange(i, "quantity", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={1}>
                    <TextField
                      select
                      size="small"
                      fullWidth
                      value={row.unit_id}
                      onChange={(e) =>
                        handleRowChange(i, "unit_id", e.target.value)
                      }
                    >
                      {units.map((u) => (
                        <MenuItem key={u.id} value={u.id}>
                          {u.unit_symbol}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={1}>
                    <TextField
                      size="small"
                      fullWidth
                      value={row.unit_price}
                      onChange={(e) =>
                        handleRowChange(i, "unit_price", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={1}>
                    <TextField
                      size="small"
                      fullWidth
                      value={row.cgst_percent}
                      onChange={(e) =>
                        handleRowChange(i, "cgst_percent", e.target.value)
                      }
                    />
                  </Grid>


                  <Grid item xs={1}>
                    <TextField
                      size="small"
                      fullWidth
                      value={row.sgst_percent}
                      onChange={(e) =>
                        handleRowChange(i, "sgst_percent", e.target.value)
                      }
                    />
                  </Grid>


                  <Grid item xs={1}>
                    <TextField
                      size="small"
                      fullWidth
                      value={row.igst_percent}
                      onChange={(e) =>
                        handleRowChange(i, "igst_percent", e.target.value)
                      }
                    />
                  </Grid>


                  <Grid item xs={1.5}>
                    <TextField
                      size="small"
                      fullWidth
                      value={row.item_discount}
                      onChange={(e) =>
                        handleRowChange(i, "item_discount", e.target.value)
                      }
                    />
                  </Grid>


                  <Grid item xs={1.5}>
                    <TextField
                      size="small"
                      fullWidth
                      value={getItemTotal(row).toFixed(2)}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>

                  <Grid item xs={0.5}>
                    <IconButton onClick={() => deleteRow(i)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

              <Button startIcon={<AddIcon />} sx={{ mt: 2 }} onClick={addRow}>
                Add Item
              </Button>
            </Box>

            {/* ================= GRAND TOTAL ================= */}
            <Box
              mt={3}
              p={2}
              sx={{
                bgcolor: "#F9FAFB",
                borderRadius: 2,
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography fontSize={16} fontWeight={600}>
                Grand Total:
              </Typography>
              <Typography fontSize={20} fontWeight={700} color="#2563EB">
                ₹ {grandTotal.toFixed(2)}
              </Typography>
            </Box>

            {/* SAVE */}
            <Box display="flex" justifyContent="flex-end" mt={4}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#2563EB",
                  px: 4,
                  py: 1,
                  fontWeight: 600,
                }}
                onClick={handleSave}
              >
                Save Purchase
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );


};

export default AddPurchase;