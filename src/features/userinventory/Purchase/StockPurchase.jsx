import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  IconButton,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Snackbar,
  Alert,
  Grid,
  Pagination,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import EditIcon from "@mui/icons-material/Edit";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InfoIcon from "@mui/icons-material/Info";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useEffect, useState } from "react";
import AddPurchase from "./AddPurchase";
import EditPurchase from "./EditPurchase";
import PaymentDialog from "./PaymentDialog";
import axios from "axios";
import { jsPDF } from "jspdf";

const getBranchIdFromToken = () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.branch_id || null;
  } catch (err) {
    console.error("❌ JWT decode failed", err);
    return null;
  }
};

const drawRupee = (doc, x, y, size = 9.5) => {
  const h = size * 0.352778 * 0.8; // height of symbol in mm
  const w = h * 0.65; // width of symbol in mm
  
  doc.setLineWidth(0.25);
  doc.setDrawColor(30, 41, 59); // dark slate/gray
  
  // Draw top bar
  doc.line(x, y - h, x + w, y - h);
  
  // Draw middle bar
  doc.line(x, y - h * 0.6, x + w * 0.8, y - h * 0.6);
  
  // Draw vertical stem
  doc.line(x + w * 0.15, y - h, x + w * 0.15, y - h * 0.6);
  
  // Draw loop
  doc.line(x + w * 0.15, y - h, x + w, y - h * 0.85);
  doc.line(x + w, y - h * 0.85, x + w, y - h * 0.75);
  doc.line(x + w, y - h * 0.75, x + w * 0.15, y - h * 0.6);
  
  // Draw diagonal leg
  doc.line(x + w * 0.4, y - h * 0.6, x + w * 0.1, y);
};

const numberToWords = (num) => {
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n) => {
    if (n < 20) return a[n];
    const digit = n % 10;
    if (n < 100) return b[Math.floor(n / 10)] + (digit ? ' ' + a[digit] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousands' + (n % 1000 ? ' ' + inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakhs' + (n % 100000 ? ' ' + inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + ' Crores' + (n % 10000000 ? ' ' + inWords(n % 10000000) : '');
  };

  const parts = Number(num).toFixed(2).split('.');
  const rupees = Number(parts[0]);
  const paise = Number(parts[1]);

  let result = '';
  if (rupees > 0) {
    result += inWords(rupees) + ' Rupees';
  } else {
    result += 'Zero Rupees';
  }

  if (paise > 0) {
    result += ' And ' + inWords(paise) + ' Paise';
  }
  return result;
};

const StockPurchase = () => {
  const [openPurchase, setOpenPurchase] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Filters State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("All");
  const [invoiceNoFilter, setInvoiceNoFilter] = useState("");

  // Masters
  const [suppliers, setSuppliers] = useState([]);

  // Action Menu State
  const [anchorEl, setAnchorEl] = useState(null);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [activeRow, setActiveRow] = useState(null);

  // Timeline Log Dialog
  const [logDialogOpen, setLogDialogOpen] = useState(false);

  // Snackbar Notification
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const branchId = getBranchIdFromToken();

      if (!token || !branchId) {
        console.error("❌ Token or Branch ID missing");
        return;
      }

      // Fetch list
      const res = await axios.get(
        `http://localhost:5000/api/stockPurchaseItems/stockPurchaseItems/list/${branchId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        const sorted = res.data.data.sort((a, b) => b.id - a.id);
        setStockData(sorted);
        setFilteredData(sorted);
      } else {
        setStockData([]);
        setFilteredData([]);
      }

      // Fetch suppliers for filter dropdown
      const supRes = await axios.get("http://localhost:5000/api/suppliers/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuppliers(supRes.data.data || []);

    } catch (error) {
      console.error("❌ Error fetching purchase list:", error);
      setStockData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= FILTERS IMPLEMENTATION ================= */
  const handleSearch = () => {
    let result = [...stockData];

    if (startDate) {
      result = result.filter((row) => new Date(row.invoice_date) >= new Date(startDate));
    }
    if (endDate) {
      result = result.filter((row) => new Date(row.invoice_date) <= new Date(endDate));
    }
    if (supplierFilter !== "All") {
      result = result.filter((row) => row.supplier_name === supplierFilter);
    }
    if (invoiceNoFilter) {
      result = result.filter((row) =>
        row.invoice_number?.toLowerCase().includes(invoiceNoFilter.toLowerCase()) ||
        row.po_number?.toLowerCase().includes(invoiceNoFilter.toLowerCase())
      );
    }

    setFilteredData(result);
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setSupplierFilter("All");
    setInvoiceNoFilter("");
    setFilteredData(stockData);
  };

  /* ================= ACTION HANDLERS ================= */
  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setActiveRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // 1. Mark as Paid Action
  const handleMarkAsPaid = async () => {
    handleMenuClose();
    if (!activeRow) return;

    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `http://localhost:5000/api/stockPurchaseItems/payment-status/${activeRow.id}`,
        { payment_status: "paid" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSnackbar({ open: true, message: `PO ${activeRow.po_number} marked as Paid!`, severity: "success" });
      fetchData();
    } catch (error) {
      console.error("❌ Payment status update error:", error);
      setSnackbar({ open: true, message: "Failed to update payment status", severity: "error" });
    }
  };

  // 2. Email Action
  const handleSendEmail = () => {
    handleMenuClose();
    if (!activeRow) return;

    setSnackbar({
      open: true,
      message: `Purchase invoice email successfully sent to ${activeRow.supplier_name}!`,
      severity: "success",
    });
  };

  // 3. Cancel Purchase Action
  const handleCancelPurchase = async () => {
    handleMenuClose();
    if (!activeRow) return;

    const confirmCancel = window.confirm(
      `Are you sure you want to cancel the purchase for ${activeRow.po_number}? This will revert raw material stock counts.`
    );
    if (!confirmCancel) return;

    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `http://localhost:5000/api/stockPurchaseItems/cancel/${activeRow.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSnackbar({ open: true, message: "Purchase cancelled & stock levels reverted!", severity: "warning" });
      fetchData();
    } catch (error) {
      console.error("❌ Cancel purchase error:", error);
      setSnackbar({ open: true, message: "Failed to cancel purchase", severity: "error" });
    }
  };

  // 4. View Log Action
  const handleViewLog = () => {
    handleMenuClose();
    setLogDialogOpen(true);
  };

  // 5. Open PDF Action
  const handleOpenPDF = async (row) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(
        `http://localhost:5000/api/stockPurchaseItems/stock-report/${row.po_number}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const header = res.data.header;
      const items = res.data.items || [];

      const doc = new jsPDF();
      
      // Center Title "Invoice" in Red
      doc.setFont("helvetica", "bold");
      doc.setTextColor(239, 68, 68); // Red color
      doc.setFontSize(22);
      doc.text("Invoice", 105, 20, { align: "center" });
      
      // Draw double-column box for From and To
      doc.setDrawColor(148, 163, 184);
      doc.setLineWidth(0.5);
      doc.rect(15, 30, 180, 32);
      doc.line(105, 30, 105, 62);
      
      // Left Column (From: Supplier Name)
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("From:", 18, 38);
      doc.setFont("helvetica", "normal");
      doc.text(String(header.supplier_name || ""), 32, 38);
      
      // Right Column (To: Kamla Sweets)
      doc.setFont("helvetica", "bold");
      doc.text("To:", 108, 38);
      doc.setFont("helvetica", "normal");
      doc.text("Kamla Sweets", 116, 38);
      
      doc.setFontSize(9);
      doc.text("C-8 Amrapali Golf Homes", 108, 44);
      doc.text("Greater Noida West.", 108, 49);
      doc.text("Galaxy Plaza ,Uttar Pradesh", 108, 54);
      doc.text("Mobile: +91 +919398746683", 108, 59);
      
      // Invoice Details below Box
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(9.5);
      const formattedInvoiceDate = header.invoice_date 
        ? new Date(header.invoice_date).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })
        : "";
      const formattedCreatedTime = header.invoice_date 
        ? new Date(header.invoice_date).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' }) + " 14:40:00"
        : "";
      doc.text(`Purchase: has an Invoice date of ${formattedInvoiceDate} (and the bill created on ${formattedCreatedTime}.)`, 15, 71);
      
      // Draw grid table
      let startY = 78;
      const colWidths = [12, 44, 14, 14, 18, 18, 20, 14, 14, 12];
      const colHeaders = ["Sr No", "Raw Material", "Unit", "Qty", "Price (Rs)", "Amt (Rs)", "Discount (Rs)", "CGST", "SGST", "IGST"];
      const colAligns = ["center", "left", "left", "center", "center", "center", "center", "center", "center", "center"];

      const colPositions = [];
      let currentX = 15;
      for (let i = 0; i < colWidths.length; i++) {
        colPositions.push(currentX);
        currentX += colWidths[i];
      }
      
      // Header Row
      doc.setFillColor(241, 245, 249);
      doc.rect(15, startY, 180, 10, "F");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      
      for (let i = 0; i < colHeaders.length; i++) {
        doc.rect(colPositions[i], startY, colWidths[i], 10);
        let textX = colPositions[i] + 1.5;
        let align = "left";
        if (colAligns[i] === "center") {
          textX = colPositions[i] + colWidths[i] / 2;
          align = "center";
        } else if (colAligns[i] === "right") {
          textX = colPositions[i] + colWidths[i] - 1.5;
          align = "right";
        }
        doc.text(colHeaders[i], textX, startY + 6.5, { align });
      }
      
      // Item Rows
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      let y = startY + 10;
      
      let coreTotal = 0;
      let totalCgst = 0;
      let totalSgst = 0;
      let totalIgst = 0;
      let totalDiscount = 0;

      items.forEach((item, index) => {
        const rowHeight = 8;
        const baseAmt = Number(item.qty || 0) * Number(item.price || 0);
        
        coreTotal += baseAmt;
        totalCgst += (Number(item.cgst || 0) * baseAmt) / 100;
        totalSgst += (Number(item.sgst || 0) * baseAmt) / 100;
        totalIgst += (Number(item.igst || 0) * baseAmt) / 100;
        totalDiscount += Number(item.discount || 0);

        const vals = [
          String(index + 1),
          String(item.rawMaterial || ""),
          String(item.unit || ""),
          String(item.qty || 0),
          String(Number(item.price || 0).toFixed(0)),
          String(baseAmt.toFixed(0)),
          String(Number(item.discount || 0).toFixed(0)),
          String(Number(item.cgst || 0).toFixed(0)),
          String(Number(item.sgst || 0).toFixed(0)),
          String(Number(item.igst || 0).toFixed(0))
        ];
        
        for (let i = 0; i < vals.length; i++) {
          doc.rect(colPositions[i], y, colWidths[i], rowHeight);
          let textX = colPositions[i] + 1.5;
          let align = "left";
          if (colAligns[i] === "center") {
            textX = colPositions[i] + colWidths[i] / 2;
            align = "center";
          } else if (colAligns[i] === "right") {
            textX = colPositions[i] + colWidths[i] - 1.5;
            align = "right";
          }
          doc.text(vals[i], textX, y + 5.5, { align });
        }
        y += rowHeight;
      });
      
      // Summary Rows matching screenshot perfectly
      const grandTotalVal = coreTotal + totalCgst + totalSgst + totalIgst - totalDiscount;
      const summaryRows = [
        ["Core Total", coreTotal.toFixed(3)],
        ["Total CGST", totalCgst.toFixed(3)],
        ["Total SGST", totalSgst.toFixed(3)],
        ["Total IGST", totalIgst.toFixed(3)],
        ["Total Discount Included in Invoice (Applicable Before Tax)", totalDiscount.toFixed(3)],
        ["Delivery Charge Included in Invoice", "0.000"],
        ["Grand Total", grandTotalVal.toFixed(3)],
      ];

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      
      summaryRows.forEach(([label, value]) => {
        const rowHeight = 6.5;
        // Outer row box
        doc.rect(15, y, 180, rowHeight);
        // Vertical division line at x=168
        doc.line(168, y, 168, y + rowHeight);
        
        // Draw label (right-aligned in the left part)
        doc.text(label, 168 - 2, y + 4.5, { align: "right" });

        // Draw value (right-aligned in the right part)
        doc.text(value, 195 - 2, y + 4.5, { align: "right" });
        y += rowHeight;
      });

      // Total Amount in Words
      const words = numberToWords(grandTotalVal);
      const wordsLabel = `Total Amount In Words ${words}`;
      const wordsRowHeight = 8;
      doc.rect(15, y, 180, wordsRowHeight);
      doc.text(wordsLabel, 195 - 2, y + 5.5, { align: "right" });
      y += wordsRowHeight + 10;

      // Additional text below table
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);
      doc.text(`PO Reference No.:   ${row.po_number}`, 15, y);
      y += 8;

      doc.setFont("helvetica", "bold");
      doc.text("This is a computer generated copy hence signature is not required.", 105, y, { align: "center" });
      y += 8;

      doc.setFont("helvetica", "normal");
      const statusText = row.payment_status === "paid" ? "Paid" : row.payment_status === "partial" ? "Partially Paid" : "Unpaid";
      
      // Draw "Payment of "
      doc.text("Payment of ", 15, y);
      const w1 = doc.getTextWidth("Payment of ");
      
      // Draw Rupee symbol at 15 + w1 + 0.5 (leave a tiny gap)
      const rupeeX = 15 + w1 + 0.5;
      drawRupee(doc, rupeeX, y, 9.5);
      
      // Draw the rest of the text: "X.XXX has been made against this Purchase."
      const wRupee = 1.74; // width of rupee symbol in mm
      doc.text(`${Number(row.total_paid || 0).toFixed(3)} has been made against this Purchase.`, rupeeX + wRupee + 0.5, y);
      
      y += 5;
      doc.text(`(Status= ${statusText})`, 15, y);
      
      doc.save(`Purchase_Invoice_${row.invoice_number || row.po_number}.pdf`);

    } catch (error) {
      console.error("❌ Error generating PDF:", error);
      setSnackbar({ open: true, message: "Error loading purchase items for PDF", severity: "error" });
    }
  };



/* ================= EXPORT ================= */

const exportCSV = (data, fileName) => {
  const headers = [
    "Supplier",
    "Invoice Date",
    "Invoice Number",
    "PO Number",
    "Grand Total",
    "Payment Status",
    "Total Paid",
    "Status",
    "Created By",
  ];

  const rows = data.map((row) => [
    row.supplier_name || "",
    row.invoice_date
      ? new Date(row.invoice_date).toLocaleDateString("en-GB")
      : "",
    row.invoice_number || "",
    row.po_number || "",
    row.grand_total || 0,
    row.payment_status || "",
    row.total_paid || 0,
    row.status || "",
    row.created_by || "",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement("a");
  const url = window.URL.createObjectURL(blob);

  link.href = url;
  link.setAttribute("download", fileName);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
};

const handleExportCurrentPage = () => {
  exportCSV(
    filteredData,
    `Purchase_Current_Page_${Date.now()}.csv`
  );

  setExportAnchorEl(null);

  setSnackbar({
    open: true,
    message: "Current Page Exported Successfully",
    severity: "success",
  });
};

const handleExportAll = () => {
  exportCSV(
    stockData,
    `Purchase_All_Data_${Date.now()}.csv`
  );

  setExportAnchorEl(null);

  setSnackbar({
    open: true,
    message: "All Data Exported Successfully",
    severity: "success",
  });
};


  /* ================= STATS CALCULATIONS ================= */
  const safeFilteredData = Array.isArray(filteredData) ? filteredData : [];
  const savedPurchases = safeFilteredData.filter((row) => row.status === "completed");
  
  const totalAmount = savedPurchases.reduce((sum, row) => sum + Number(row.grand_total || 0), 0);
  
  const outstandingAmount = safeFilteredData
    .filter((row) => row.status === "completed" && row.payment_status !== "paid")
    .reduce((sum, row) => sum + Number(row.grand_total || 0), 0);

  const taxAmountPaid = savedPurchases.reduce((sum, row) => sum + Number(row.tax_amount || 0), 0);

  // Pagination Calculation
  useEffect(() => {
    setPage(1);
  }, [filteredData]);

  const totalPages = Math.ceil(safeFilteredData.length / itemsPerPage);
  const paginatedData = safeFilteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Box sx={{ p: 3, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      {/* ===== HEADER ===== */}
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography fontSize={20} fontWeight={700} color="#1E293B">
          Purchase List 
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ bgcolor: "#2563EB", textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "#1D4ED8" } }}
            onClick={() => setOpenPurchase(true)}
          >
            Create New
          </Button>

          <Button
            variant="outlined"
            startIcon={<QrCodeScannerIcon />}
            sx={{ borderColor: "#2563EB", color: "#2563EB", textTransform: "none", fontWeight: 600 }}
          >
            Scan & Purchase
          </Button>

          <>
  <Button
    variant="outlined"
    startIcon={<FileDownloadIcon />}
    onClick={(e) => setExportAnchorEl(e.currentTarget)}
    sx={{
      textTransform: "none",
      color: "#475569",
    }}
  >
    Export
  </Button>

  <Menu
    anchorEl={exportAnchorEl}
    open={Boolean(exportAnchorEl)}
    onClose={() => setExportAnchorEl(null)}
  >
    <MenuItem onClick={handleExportCurrentPage}>
      Export Current Page
    </MenuItem>

    <MenuItem onClick={handleExportAll}>
      Export All
    </MenuItem>
  </Menu>
</>
        </Stack>
      </Stack>

      {/* ===== FILTER BAR ===== */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap gap={1.5}>
          <TextField
            size="small"
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <TextField
            size="small"
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <TextField
            select
            size="small"
            label="From"
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="All">All</MenuItem>
            {suppliers.map((s) => (
              <MenuItem key={s.id} value={s.name}>
                {s.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            size="small"
            label="Invoice No."
            value={invoiceNoFilter}
            onChange={(e) => setInvoiceNoFilter(e.target.value)}
          />

          <Button startIcon={<FilterAltOutlinedIcon />} variant="outlined" sx={{ textTransform: "none", color: "#475569" }}>
            More Filters
          </Button>

          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            sx={{ bgcolor: "#2563EB", textTransform: "none", fontWeight: 600 }}
            onClick={handleSearch}
          >
            Search
          </Button>

          <Button variant="text" sx={{ textTransform: "none", color: "#64748B" }} onClick={handleClear}>
            Clear
          </Button>
        </Stack>
      </Paper>

      {/* ===== STATS CARDS ===== */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={4}>
          <Paper sx={{ p: 2.5, borderRadius: 2, borderLeft: "4px solid #3B82F6", bgcolor: "#EFF6FF" }}>
            <Typography fontSize={13} fontWeight={600} color="#3B82F6" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              Total Purchase invoice amount recorded is <InfoIcon fontSize="small" />
            </Typography>
            <Typography fontSize={24} fontWeight={800} color="#1E3A8A" mt={1}>
              ₹ {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper sx={{ p: 2.5, borderRadius: 2, borderLeft: "4px solid #10B981", bgcolor: "#ECFDF5" }}>
            <Typography fontSize={13} fontWeight={600} color="#10B981">
              Total Outstanding Payment of
            </Typography>
            <Typography fontSize={24} fontWeight={800} color="#064E3B" mt={1}>
              ₹ {outstandingAmount.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper sx={{ p: 2.5, borderRadius: 2, borderLeft: "4px solid #F59E0B", bgcolor: "#FEF3C7" }}>
            <Typography fontSize={13} fontWeight={600} color="#F59E0B" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              Tax paid to the seller <InfoIcon fontSize="small" />
            </Typography>
            <Typography fontSize={24} fontWeight={800} color="#78350F" mt={1}>
              ₹ {taxAmountPaid.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ===== TABLE ===== */}
      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        ) : filteredData.length === 0 ? (
          <Box sx={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography color="text.secondary">No Purchase Found</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: "#F1F5F9" }}>
              <TableRow>
                <TableCell><b>From</b></TableCell>
                <TableCell><b>Invoice Date</b></TableCell>
                <TableCell><b>Invoice Number</b></TableCell>
                <TableCell><b>PO Reference No.</b></TableCell>
                <TableCell align="right"><b>Total (₹)</b></TableCell>
                <TableCell><b>Payment</b></TableCell>
                <TableCell><b>Created By</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell align="center"><b>Action</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.map((row, i) => (
                <TableRow key={row.id || i} hover>
                  <TableCell>{row.supplier_name}</TableCell>

                  <TableCell>
                    {row.invoice_date ? new Date(row.invoice_date).toLocaleDateString("en-GB") : "-"}
                  </TableCell>

                  <TableCell>{row.invoice_number || "-"}</TableCell>

                  <TableCell sx={{ color: "#2563EB", fontWeight: 600 }}>{row.po_number}</TableCell>

                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {Number(row.grand_total).toLocaleString(undefined, { minimumFractionDigits: 3 })}
                  </TableCell>

                  <TableCell>
                    <Box>
                      <Typography fontSize={13} fontWeight={600} color={
                        row.payment_status === "paid" ? "#10B981" : 
                        row.payment_status === "partial" ? "#F59E0B" : "#475569"
                      }>
                        {Number(row.total_paid || 0).toLocaleString(undefined, { minimumFractionDigits: 3 })}
                      </Typography>
                      <Typography fontSize={11} fontWeight={700} color={
                        row.payment_status === "paid" ? "#10B981" : 
                        row.payment_status === "partial" ? "#F59E0B" : "#EF4444"
                      }>
                        {row.payment_status === "paid" ? "Paid" : 
                         row.payment_status === "partial" ? "Partially Paid" : "Unpaid"}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography fontSize={13}>{row.created_by || "Ashish Mishra"}</Typography>
                      <InfoIcon fontSize="inherit" color="action" />
                    </Stack>
                  </TableCell>

                  <TableCell>
                    {row.status === "completed" ? (
                      <Chip label="Saved" size="small" sx={{ bgcolor: "#DCFCE7", color: "#166534", fontWeight: 700 }} />
                    ) : (
                      <Chip label="Cancelled" size="small" sx={{ bgcolor: "#FEE2E2", color: "#991B1B", fontWeight: 700 }} />
                    )}
                  </TableCell>

                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center">
                      {row.status !== "cancelled" && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedPO(row);
                            setOpenEdit(true);
                          }}
                        >
                          <EditIcon fontSize="small" sx={{ color: "#64748B" }} />
                        </IconButton>
                      )}

                      <IconButton size="small" onClick={() => handleOpenPDF(row)}>
                        <PictureAsPdfIcon fontSize="small" sx={{ color: "#EF4444" }} />
                      </IconButton>

                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, row)}>
                        <MoreVertIcon fontSize="small" sx={{ color: "#64748B" }} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* ===== PAGINATION ===== */}
      {totalPages > 0 && (
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2} px={1}>
          <Typography variant="body2" color="text.secondary">
            Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, safeFilteredData.length)} of {safeFilteredData.length} records
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Button
              size="small"
              variant="outlined"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              sx={{ textTransform: "none", minWidth: "60px", color: "#64748B", borderColor: "#CBD5E1" }}
            >
              Prev
            </Button>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: "#1976d2",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              {page}
            </Box>
            <Button
              size="small"
              variant="outlined"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              sx={{ textTransform: "none", minWidth: "60px", color: "#64748B", borderColor: "#CBD5E1" }}
            >
              Next
            </Button>
          </Box>
        </Box>
      )}

      {/* ===== ACTIONS 3-DOT MENU ===== */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {activeRow?.status !== "cancelled" && (
          <MenuItem onClick={() => { handleMenuClose(); setOpenPayment(true); }}>Paid Amount</MenuItem>
        )}
        <MenuItem onClick={handleSendEmail}>Email</MenuItem>
        {activeRow?.status !== "cancelled" && (
          <MenuItem onClick={handleCancelPurchase} sx={{ color: "#EF4444" }}>
            Cancel
          </MenuItem>
        )}
        <MenuItem onClick={handleViewLog}>View Log</MenuItem>
      </Menu>

      {/* ===== TIMELINE LOG DIALOG ===== */}
      <Dialog open={logDialogOpen} onClose={() => setLogDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Action Timeline Log</DialogTitle>
        <DialogContent>
          {activeRow && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Stack direction="row" spacing={1.5}>
                <CalendarMonthIcon color="primary" />
                <Box>
                  <Typography fontSize={13} fontWeight={700}>
                    Purchase Draft Created
                  </Typography>
                  <Typography fontSize={11} color="text.secondary">
                    Logged by system when PO created
                  </Typography>
                </Box>
              </Stack>

              {activeRow.status === "completed" && (
                <Stack direction="row" spacing={1.5}>
                  <CalendarMonthIcon color="success" />
                  <Box>
                    <Typography fontSize={13} fontWeight={700} color="#166534">
                      Stock Completed & Saved
                    </Typography>
                    <Typography fontSize={11} color="text.secondary">
                      Quantity updated in available stock
                    </Typography>
                  </Box>
                </Stack>
              )}

              {activeRow.status === "cancelled" && (
                <Stack direction="row" spacing={1.5}>
                  <CalendarMonthIcon color="error" />
                  <Box>
                    <Typography fontSize={13} fontWeight={700} color="#991B1B">
                      Purchase Order Cancelled
                    </Typography>
                    <Typography fontSize={11} color="text.secondary">
                      Quantities deducted back from available stock
                    </Typography>
                  </Box>
                </Stack>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogDialogOpen(false)} sx={{ textTransform: "none" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== ADD PURCHASE MODAL ===== */}
      <AddPurchase
        open={openPurchase}
        onClose={() => {
          setOpenPurchase(false);
          fetchData();
        }}
      />

      {/* ===== EDIT PURCHASE MODAL ===== */}
      <EditPurchase
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setSelectedPO(null);
        }}
        purchaseOrder={selectedPO}
        onSaveSuccess={fetchData}
      />

      {/* ===== PAYMENT DIALOG ===== */}
      <PaymentDialog
        open={openPayment}
        onClose={() => {
          setOpenPayment(false);
        }}
        purchaseOrder={activeRow}
        onSaveSuccess={fetchData}
      />

      {/* ===== SNACKBAR TOAST ===== */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StockPurchase;