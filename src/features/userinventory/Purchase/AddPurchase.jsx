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

const AddPurchase = ({ open, onClose, purchaseOrderId = 19 }) => {
  /* ================= MASTER DATA ================= */
  const [suppliers, setSuppliers] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  /* ================= FORM ================= */
  const [form, setForm] = useState({
    supplier_id: "",
    invoice_date: "",
    invoice_number: "",
     purchase_order_id: "", 
  });

  const [rows, setRows] = useState([
    {
      raw_material_id: "",
      quantity: "",
      unit_id: "",
      unit_price: "",
      cgst_percent: "",
      sgst_percent: "",
      igst_percent: "",
      item_discount: "",
    },
  ]);

  /* ================= FETCH MASTER DATA ================= */
  useEffect(() => {
    if (open) fetchAll();
  }, [open]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      // const [supRes, rawRes, unitRes] = await Promise.all([
      //   axios.get("http://localhost:5000/api/suppliers/get", { headers }),
      //   axios.get("http://localhost:5000/api/raw/get", { headers }),
      //   axios.get("http://localhost:5000/api/units/getUnit"),
      // ]);
      const [supRes, rawRes, unitRes, poRes] = await Promise.all([
  axios.get("http://localhost:5000/api/suppliers/get", { headers }),
  axios.get("http://localhost:5000/api/raw/get", { headers }),
  axios.get("http://localhost:5000/api/units/getUnit"),
  axios.get("http://localhost:5000/api/purchaseOrders/get", { headers }),
]);

setPurchaseOrders(poRes.data.data || []);

      setSuppliers(supRes.data.data || []);
      setRawMaterials(rawRes.data.data || rawRes.data || []);
      setUnits(unitRes.data.data || unitRes.data || []);
    } catch (err) {
      console.error("❌ Master fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ROW HANDLERS ================= */
  const addRow = () => {
    setRows([
      ...rows,
      {
        raw_material_id: "",
        quantity: "",
        unit_id: "",
        unit_price: "",
        cgst_percent: "",
        sgst_percent: "",
        igst_percent: "",
        item_discount: "",
      },
    ]);
  };

  const deleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  /* ================= SAVE (POST API) ================= */
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const payload = {
        purchase_order_id: purchaseOrderId,
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

      await axios.post(
        "http://localhost:5000/api/stockPurchaseItems/stock-purchase-items",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onClose();
    } catch (err) {
      console.error("❌ Save error", err);
      alert("Failed to save purchase");
    }
  };
  const handlePoChange = (poId) => {
  const selectedPO = purchaseOrders.find(
    (po) => po.id === Number(poId)
  );

  if (selectedPO) {
    setForm({
      ...form,
      purchase_order_id: poId,
      supplier_id: selectedPO.supplier_name, // agar supplier_id ho backend me
      invoice_number: selectedPO.invoice_number || "",
      invoice_date: selectedPO.purchase_date?.slice(0, 10),
    });
  }
}

  /* ================= UI ================= */
  return (
    <Dialog open={open} maxWidth="xl" fullWidth>
      <DialogContent>
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontSize={18} fontWeight={700}>
            Add Purchase Items
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        {loading ? (
          <Box textAlign="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* ================= SUPPLIER CARD ================= */}
            <Box
              sx={{
                border: "1px solid #E5E7EB",
                borderRadius: 2,
                p: 2,
                mb: 3,
                bgcolor: "#FAFAFA",
              }}
            >
              <Typography fontWeight={700} mb={1}>
                Supplier Details
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={4}>
  <TextField
    select
    fullWidth
    label="PO Number *"
    value={form.purchase_order_id}
    onChange={(e) => handlePoChange(e.target.value)}
  >
    {purchaseOrders.map((po) => (
      <MenuItem key={po.id} value={po.id}>
        {po.po_number}
      </MenuItem>
    ))}
  </TextField>
</Grid>
                <Grid item xs={4}>
                  <TextField
  fullWidth
  label="Supplier Name"
  value={form.supplier_id}
  InputProps={{ readOnly: true }}
/>
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Invoice Date *"
                    InputLabelProps={{ shrink: true }}
                    value={form.invoice_date}
                    onChange={(e) =>
                      setForm({ ...form, invoice_date: e.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Invoice Number"
                    value={form.invoice_number}
                    onChange={(e) =>
                      setForm({ ...form, invoice_number: e.target.value })
                    }
                  />
                </Grid>
              </Grid>
            </Box>

            {/* ================= ITEMS CARD ================= */}
            <Box
              sx={{
                border: "1px solid #E5E7EB",
                borderRadius: 2,
                p: 2,
                bgcolor: "#FFFFFF",
              }}
            >
              <Typography fontWeight={700} mb={2}>
                Purchase Items
              </Typography>

              {rows.map((row, i) => (
                <Box
                  key={i}
                  sx={{
                    border: "1px solid #E5E7EB",
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    bgcolor: "#F9FAFB",
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={2}>
                      <TextField
                        select
                        fullWidth
                        label="Raw Material"
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
                        fullWidth
                        label="Qty"
                        value={row.quantity}
                        onChange={(e) =>
                          handleRowChange(i, "quantity", e.target.value)
                        }
                      />
                    </Grid>

                    <Grid item xs={1}>
                      <TextField
                        select
                        fullWidth
                        label="Unit"
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
                        fullWidth
                        label="Price"
                        value={row.unit_price}
                        onChange={(e) =>
                          handleRowChange(i, "unit_price", e.target.value)
                        }
                      />
                    </Grid>

                    <Grid item xs={1}>
                      <TextField
                        fullWidth
                        label="CGST %"
                        value={row.cgst_percent}
                        onChange={(e) =>
                          handleRowChange(i, "cgst_percent", e.target.value)
                        }
                      />
                    </Grid>

                    <Grid item xs={1}>
                      <TextField
                        fullWidth
                        label="SGST %"
                        value={row.sgst_percent}
                        onChange={(e) =>
                          handleRowChange(i, "sgst_percent", e.target.value)
                        }
                      />
                    </Grid>

                    <Grid item xs={1}>
                      <TextField
                        fullWidth
                        label="IGST %"
                        value={row.igst_percent}
                        onChange={(e) =>
                          handleRowChange(i, "igst_percent", e.target.value)
                        }
                      />
                    </Grid>

                    <Grid item xs={2}>
                      <TextField
                        fullWidth
                        label="Discount"
                        value={row.item_discount}
                        onChange={(e) =>
                          handleRowChange(i, "item_discount", e.target.value)
                        }
                      />
                    </Grid>

                    <Grid item xs={1}>
                      <IconButton onClick={() => deleteRow(i)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}

              <Button startIcon={<AddIcon />} onClick={addRow}>
                Add Item
              </Button>
            </Box>

            {/* SAVE */}
            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button
                variant="contained"
                sx={{ bgcolor: "#DC2626", px: 4 }}
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
