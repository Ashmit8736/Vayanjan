import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Paper, Typography, CircularProgress, Divider, Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";

const PublicInvoiceView = () => {
  const { invoiceNumber } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dynamically load the Outfit Google Font for premium styling
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5000/api/invoices/public/details/${invoiceNumber}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch invoice details");
        }
        return res.json();
      })
      .then((res) => {
        if (res.success) {
          setInvoice(res.data);
        } else {
          setError(res.message || "Invoice details not found");
        }
      })
      .catch((err) => {
        console.error("Fetch invoice error:", err);
        setError("Invoice not found or server is offline");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [invoiceNumber]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#F8FAFC">
        <CircularProgress color="primary" />
        <Typography ml={2} sx={{ fontFamily: "'Outfit', sans-serif" }}>Loading invoice details...</Typography>
      </Box>
    );
  }

  if (error || !invoice) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#F8FAFC" p={3}>
        <Typography variant="h5" color="error" fontWeight={800} mb={2} sx={{ fontFamily: "'Outfit', sans-serif" }}>
          Error
        </Typography>
        <Typography color="text.secondary" mb={3} sx={{ fontFamily: "'Outfit', sans-serif" }}>
          {error || "Unable to display invoice details."}
        </Typography>
      </Box>
    );
  }

  // Calculate totals
  const totalQty = (invoice.items || []).reduce((sum, item) => sum + Number(item.quantity || item.qty || 0), 0);
  const formattedDate = invoice.created_at
    ? new Date(invoice.created_at).toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "-";

  // Branch Details
  const branchName = invoice.branch_name || "Kamla Sweets";
  const branchAddress = invoice.branch_address || "C-8 Amrapali Golf Homes , Greater Noida West 201301";
  const branchPhone = invoice.branch_phone || "8700063220";

  return (
    <Box 
      minHeight="100vh" 
      bgcolor="#F1F5F9" 
      py={4} 
      px={2} 
      display="flex" 
      flexDirection="column" 
      alignItems="center"
      className="non-printable-container"
      sx={{
        fontFamily: "'Outfit', sans-serif",
        "@media print": {
          bgcolor: "transparent",
          py: 0,
          px: 0,
        }
      }}
    >
      {/* Print Button (Hidden during print) */}
      <Box 
        mb={3} 
        width="100%" 
        maxWidth={480} 
        display="flex" 
        justifyContent="flex-end"
        sx={{
          "@media print": {
            display: "none"
          }
        }}
      >
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<PrintIcon />} 
          onClick={handlePrint}
          sx={{ borderRadius: 3, fontWeight: 700, fontFamily: "'Outfit', sans-serif", textTransform: "none" }}
        >
          Print / Save PDF
        </Button>
      </Box>

      {/* Bill Container */}
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 480,
          p: "32px 24px",
          borderRadius: "16px",
          color: "#0f172a",
          backgroundColor: "#fff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
          fontFamily: "'Outfit', sans-serif",
          "@media print": {
            boxShadow: "none",
            p: 0,
            borderRadius: 0,
            maxWidth: "100%",
          }
        }}
      >
        {/* Header Block */}
        <Box textAlign="center" mb={3}>
          <Typography variant="subtitle2" fontWeight={800} sx={{ letterSpacing: 1, fontSize: "14px", color: "#1e293b", fontFamily: "'Outfit', sans-serif" }}>
            !!! WELCOME !!!
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.4, color: "#475569", fontSize: "12.5px", fontFamily: "'Outfit', sans-serif" }}>
            {branchAddress}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, color: "#475569", fontWeight: 500, fontSize: "12.5px", fontFamily: "'Outfit', sans-serif" }}>
            Mob-: {branchPhone}
          </Typography>
          {invoice.branch_gst && (
            <Typography variant="body2" sx={{ mt: 0.2, color: "#475569", fontSize: "12px", fontFamily: "'Outfit', sans-serif" }}>
              GSTIN: {invoice.branch_gst}
            </Typography>
          )}
        </Box>

        {/* Order Details Metadata Grid with left borders */}
        <Box 
          sx={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "16px 20px", 
            my: 3 
          }}
        >
          <Box sx={{ borderLeft: "3.5px solid #cbd5e1", pl: 1.5 }}>
            <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.5px", display: "block", mb: 0.2, fontFamily: "'Outfit', sans-serif" }}>
              Order Number
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a", fontSize: "13px", fontFamily: "'Outfit', sans-serif" }}>
              {invoice.invoice_number}
            </Typography>
          </Box>
          <Box sx={{ borderLeft: "3.5px solid #cbd5e1", pl: 1.5 }}>
            <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.5px", display: "block", mb: 0.2, fontFamily: "'Outfit', sans-serif" }}>
              {invoice.table_number ? "Table No" : "Order Type"}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a", fontSize: "13px", fontFamily: "'Outfit', sans-serif" }}>
              {invoice.table_number ? `Table ${invoice.table_number}` : (invoice.token_number ? `Tkn: ${invoice.token_number.replace(/\D/g, "")}` : "Take Away/Delivery")}
            </Typography>
          </Box>
          <Box sx={{ borderLeft: "3.5px solid #cbd5e1", pl: 1.5 }}>
            <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.5px", display: "block", mb: 0.2, fontFamily: "'Outfit', sans-serif" }}>
              Order Amount
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a", fontSize: "13px", fontFamily: "'Outfit', sans-serif" }}>
              ₹ {Number(invoice.total_amount || 0).toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ borderLeft: "3.5px solid #cbd5e1", pl: 1.5 }}>
            <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.5px", display: "block", mb: 0.2, fontFamily: "'Outfit', sans-serif" }}>
              Date
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a", fontSize: "13px", fontFamily: "'Outfit', sans-serif" }}>
              {formattedDate}
            </Typography>
          </Box>
        </Box>

        {/* Customer Details Block */}
        <Box mb={3} sx={{ fontSize: "13px" }}>
          <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, display: "block", mb: 0.5, fontSize: "11px", letterSpacing: "0.2px", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif" }}>
            Customer Details
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a", fontSize: "13.5px", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif" }}>
            {invoice.customer_name || invoice.client_name || "Walk-In Customer"}
          </Typography>
          {(invoice.mobile_number || invoice.customer_mobile) && (
            <Typography variant="body2" sx={{ color: "#334155", fontWeight: 500, mt: 0.2, fontFamily: "'Outfit', sans-serif" }}>
              {invoice.mobile_number || invoice.customer_mobile}
            </Typography>
          )}
          {(invoice.customer_location || invoice.address) && (
            <Typography variant="body2" sx={{ color: "#64748b", mt: 0.2, fontFamily: "'Outfit', sans-serif" }}>
              {invoice.customer_location || invoice.address}
            </Typography>
          )}
        </Box>

        {/* E-BILL Premium Boxed Card Section */}
        <Box 
          sx={{ 
            border: "1.5px solid #e2e8f0", 
            borderRadius: "12px", 
            p: "20px 18px", 
            bgcolor: "#fff",
            mb: 3
          }}
        >
          {/* E-Bill Header Section */}
          <Box textAlign="center" mb={1.5}>
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: "2px", fontSize: "22px", color: "#0f172a", fontFamily: "'Outfit', sans-serif" }}>
              E-BILL
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b", mt: 0.5, fontSize: "13.5px", fontFamily: "'Outfit', sans-serif" }}>
              {branchName}
            </Typography>
            <Typography variant="caption" sx={{ fontStyle: "italic", color: "#64748b", display: "block", mt: 0.2, fontSize: "11px", fontFamily: "'Outfit', sans-serif" }}>
              Biller Name: biller
            </Typography>
          </Box>

          <Divider sx={{ my: 1.5, borderStyle: "dotted", borderColor: "#cbd5e1" }} />

          {/* Items Table */}
          <Box mb={2}>
            <Box display="grid" gridTemplateColumns="2.5fr 1fr 1fr 1fr" mb={1} sx={{ fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              <Typography variant="caption" sx={{ fontWeight: 800, fontSize: "10.5px", fontFamily: "'Outfit', sans-serif" }}>Name</Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, fontSize: "10.5px", fontFamily: "'Outfit', sans-serif" }} align="right">Qty.</Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, fontSize: "10.5px", fontFamily: "'Outfit', sans-serif" }} align="right">Rate (₹)</Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, fontSize: "10.5px", fontFamily: "'Outfit', sans-serif" }} align="right">Price (₹)</Typography>
            </Box>
            
            <Divider sx={{ my: 0.5, borderStyle: "dotted", borderColor: "#cbd5e1" }} />
            
            {(invoice.items || []).map((item, idx) => (
              <Box key={idx} display="grid" gridTemplateColumns="2.5fr 1fr 1fr 1fr" py={0.8} sx={{ fontSize: "12.5px", borderBottom: idx === (invoice.items || []).length - 1 ? "none" : "1px dotted #f1f5f9" }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#0f172a", wordBreak: "break-word", lineHeight: "1.3", fontSize: "12px", fontFamily: "'Outfit', sans-serif" }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155", fontSize: "12px", fontFamily: "'Outfit', sans-serif" }} align="right">
                  {item.quantity || item.qty}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b", fontSize: "12px", fontFamily: "'Outfit', sans-serif" }} align="right">
                  {Number(item.price || 0).toFixed(2)}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#0f172a", fontSize: "12px", fontFamily: "'Outfit', sans-serif" }} align="right">
                  {Number(item.subtotal || ((item.quantity || item.qty) * item.price) || 0).toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 1.5, borderStyle: "dotted", borderColor: "#cbd5e1" }} />

          {/* Totals & Tax Breakdowns */}
          <Box sx={{ fontSize: "13px" }}>
            <Box display="flex" justifyContent="space-between" py={0.4}>
              <Typography variant="body2" sx={{ color: "#64748b", fontSize: "12.5px", fontFamily: "'Outfit', sans-serif" }}>Total Quantity:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a", fontSize: "12.5px", fontFamily: "'Outfit', sans-serif" }}>{totalQty}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" py={0.4}>
              <Typography variant="body2" sx={{ color: "#64748b", fontSize: "12.5px", fontFamily: "'Outfit', sans-serif" }}>Sub Total:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a", fontSize: "12.5px", fontFamily: "'Outfit', sans-serif" }}>₹ {Number(invoice.subtotal || invoice.total_amount || 0).toFixed(2)}</Typography>
            </Box>
            {Number(invoice.gst || 0) > 0 && (
              <>
                <Box display="flex" justifyContent="space-between" py={0.4}>
                  <Typography variant="body2" sx={{ color: "#64748b", fontSize: "12.5px", fontFamily: "'Outfit', sans-serif" }}>CGST (9%):</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a", fontSize: "12.5px", fontFamily: "'Outfit', sans-serif" }}>₹ {Number(invoice.cgst || (invoice.gst / 2) || 0).toFixed(2)}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" py={0.4}>
                  <Typography variant="body2" sx={{ color: "#64748b", fontSize: "12.5px", fontFamily: "'Outfit', sans-serif" }}>SGST (9%):</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a", fontSize: "12.5px", fontFamily: "'Outfit', sans-serif" }}>₹ {Number(invoice.sgst || (invoice.gst / 2) || 0).toFixed(2)}</Typography>
                </Box>
              </>
            )}
            
            <Divider sx={{ my: 1.5, borderStyle: "solid", borderColor: "#f1f5f9" }} />

            <Box display="flex" justifyContent="space-between" py={0.5}>
              <Typography variant="body1" sx={{ fontWeight: 800, color: "#0f172a", fontSize: "14.5px", fontFamily: "'Outfit', sans-serif" }}>Total Payable Amount:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 800, color: "#0f172a", fontSize: "14.5px", fontFamily: "'Outfit', sans-serif" }}>₹ {Number(invoice.total_amount || 0).toFixed(2)}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Footer Block */}
        <Box textAlign="center" mt={3} mb={1}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: "#64748b", fontSize: "12px", fontFamily: "'Outfit', sans-serif" }}>
            Thank you for Choosing Us, Please Visit again
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default PublicInvoiceView;
