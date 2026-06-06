import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  RadioGroup,
  Radio,
  FormControlLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Divider,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import axios from "axios";

const PaymentDialog = ({ open, onClose, purchaseOrder, onSaveSuccess }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [paidAmount, setPaidAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [paymentRefNo, setPaymentRefNo] = useState("");

  const grandTotal = purchaseOrder ? Number(purchaseOrder.grand_total || 0) : 0;

  // Calculate remaining amount
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.paid_amount || 0), 0);
  const remainingAmount = grandTotal - totalPaid;

  /* ================= FETCH PAYMENTS ================= */
  const fetchPayments = async () => {
    if (!purchaseOrder) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await axios.get(
        `http://localhost:5000/api/stockPurchaseItems/payments/${purchaseOrder.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setPayments(res.data.data || []);
      }
    } catch (err) {
      console.error("❌ Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && purchaseOrder) {
      fetchPayments();
      setPaidAmount("");
      setPaymentRefNo("");
      setPaymentMode("Cash");
      setPaymentDate(new Date().toISOString().slice(0, 10));
    }
  }, [open, purchaseOrder]);

  /* ================= SAVE PAYMENT ================= */
  const handleSavePayment = async () => {
    if (!paidAmount || Number(paidAmount) <= 0) {
      alert("Please enter a valid paid amount");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        paid_amount: Number(paidAmount),
        payment_date: paymentDate,
        payment_mode: paymentMode,
        payment_ref_no: paymentRefNo || null,
      };

      await axios.post(
        `http://localhost:5000/api/stockPurchaseItems/payments/${purchaseOrder.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchPayments();
      setPaidAmount("");
      setPaymentRefNo("");
      if (onSaveSuccess) onSaveSuccess();

    } catch (err) {
      console.error("❌ Save payment error:", err);
      alert("Failed to save payment");
    }
  };

  /* ================= DELETE PAYMENT ================= */
  const handleDeletePayment = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this payment record?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(
        `http://localhost:5000/api/stockPurchaseItems/payments/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchPayments();
      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      console.error("❌ Delete payment error:", err);
      alert("Failed to delete payment");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ p: 3 }}>
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography fontSize={18} fontWeight={700} color="#1E293B">
            {purchaseOrder?.supplier_name || "Supplier Name"}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* DETAILS */}
        <Typography fontSize={13} fontWeight={700} color="#64748B" mb={2}>
          Remaining Amount : {remainingAmount.toFixed(3)}
        </Typography>

        {/* INPUT FORM */}
        <Box sx={{ bgcolor: "#F8FAFC", p: 2, borderRadius: 2, mb: 3 }}>
          <Grid container spacing={2}>
            {/* Payment Type selection */}
            <Grid item xs={12}>
              <Typography fontSize={12} fontWeight={700} color="#475569" mb={0.5}>
                Payment Type *
              </Typography>
              <RadioGroup row value="Paid">
                <FormControlLabel
                  value="Paid"
                  control={<Radio size="small" />}
                  label={<Typography fontSize={13} fontWeight={600}>Paid</Typography>}
                />
              </RadioGroup>
            </Grid>

            {/* Paid Amount */}
            <Grid item xs={6}>
              <Typography fontSize={12} fontWeight={700} color="#475569" mb={0.5}>
                Paid Amount *
              </Typography>
              <TextField
                size="small"
                fullWidth
                placeholder="Enter Amount"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                type="number"
              />
            </Grid>

            {/* Payment Date */}
            <Grid item xs={6}>
              <Typography fontSize={12} fontWeight={700} color="#475569" mb={0.5}>
                Payment Date *
              </Typography>
              <TextField
                size="small"
                fullWidth
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </Grid>

            {/* Payment Mode */}
            <Grid item xs={12}>
              <Typography fontSize={12} fontWeight={700} color="#475569" mb={0.5}>
                Payment Mode *
              </Typography>
              <RadioGroup row value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                {["Cash", "Card", "Cheque", "Online", "Other"].map((mode) => (
                  <FormControlLabel
                    key={mode}
                    value={mode}
                    control={<Radio size="small" />}
                    label={<Typography fontSize={13}>{mode}</Typography>}
                  />
                ))}
              </RadioGroup>
            </Grid>

            {/* Payment Ref No */}
            <Grid item xs={12}>
              <TextField
                size="small"
                fullWidth
                label="Payment Ref No. / Transaction ID"
                value={paymentRefNo}
                onChange={(e) => setPaymentRefNo(e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>

        {/* PAYMENTS HISTORY TABLE */}
        <Typography fontSize={14} fontWeight={700} color="#1E293B" mb={1.5}>
          Payment History
        </Typography>

        <Table size="small" sx={{ border: "1px solid #E2E8F0" }}>
          <TableHead sx={{ bgcolor: "#F1F5F9" }}>
            <TableRow>
              <TableCell sx={{ fontSize: 12, fontWeight: 700 }}>Payment Date</TableCell>
              <TableCell sx={{ fontSize: 12, fontWeight: 700 }} align="right">Paid Amount</TableCell>
              <TableCell sx={{ fontSize: 12, fontWeight: 700 }}>Payment Mode</TableCell>
              <TableCell sx={{ fontSize: 12, fontWeight: 700 }}>Payment Ref No.</TableCell>
              <TableCell sx={{ fontSize: 12, fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontSize: 12, fontWeight: 700 }}>Created By</TableCell>
              <TableCell sx={{ fontSize: 12, fontWeight: 700 }} align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3, color: "text.secondary", fontSize: 12 }}>
                  No payment recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell sx={{ fontSize: 12 }}>
                    {p.payment_date ? new Date(p.payment_date).toLocaleDateString("en-GB") : "-"}
                  </TableCell>
                  <TableCell sx={{ fontSize: 12, fontWeight: 600 }} align="right">
                    {Number(p.paid_amount).toFixed(3)}
                  </TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{p.payment_mode}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{p.payment_ref_no || "-"}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>
                    <Typography fontSize={11} fontWeight={700} color="#10B981">
                      Active
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: 11, color: "text.secondary" }}>
                    Created : {new Date(p.created_at).toLocaleString("en-GB")}<br />
                    (by {p.created_by})
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleDeletePayment(p.id)}>
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: "#F8FAFC" }}>
        <Button onClick={onClose} variant="outlined" sx={{ textTransform: "none", borderRadius: 1.5, px: 3 }}>
          Cancel
        </Button>
        <Button onClick={handleSavePayment} variant="contained" sx={{ textTransform: "none", borderRadius: 1.5, px: 3, bgcolor: "#2563EB" }}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
