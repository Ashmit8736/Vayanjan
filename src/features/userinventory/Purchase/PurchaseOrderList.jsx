// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   MenuItem,
//   Paper,
//   Stack,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   CircularProgress,
//   IconButton,
//   Menu,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Chip,
//   Snackbar,
//   Alert,
//   Grid,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import SearchIcon from "@mui/icons-material/Search";
// import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
// import EditIcon from "@mui/icons-material/Edit";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import InfoIcon from "@mui/icons-material/Info";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import { useEffect, useState } from "react";
// import AddPurchaseOrder from "./AddPurchaseOrder";
// import EditPurchase from "./EditPurchase";
// import PaymentDialog from "./PaymentDialog";
// import axios from "axios";
// import { jsPDF } from "jspdf";
// import { useNavigate } from "react-router-dom";


// import DownloadIcon from "@mui/icons-material/Download";

// const getBranchIdFromToken = () => {
//   try {
//     const token = localStorage.getItem("authToken");
//     if (!token) return null;
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     return payload?.branch_id || null;
//   } catch (err) {
//     console.error("❌ JWT decode failed", err);
//     return null;
//   }
// };

// const drawRupee = (doc, x, y, size = 9.5) => {
//   const h = size * 0.352778 * 0.8; // height of symbol in mm
//   const w = h * 0.65; // width of symbol in mm
  
//   doc.setLineWidth(0.25);
//   doc.setDrawColor(30, 41, 59); // dark slate/gray
  
//   // Draw top bar
//   doc.line(x, y - h, x + w, y - h);
  
//   // Draw middle bar
//   doc.line(x, y - h * 0.6, x + w * 0.8, y - h * 0.6);
  
//   // Draw vertical stem
//   doc.line(x + w * 0.15, y - h, x + w * 0.15, y - h * 0.6);
  
//   // Draw loop
//   doc.line(x + w * 0.15, y - h, x + w, y - h * 0.85);
//   doc.line(x + w, y - h * 0.85, x + w, y - h * 0.75);
//   doc.line(x + w, y - h * 0.75, x + w * 0.15, y - h * 0.6);
  
//   // Draw diagonal leg
//   doc.line(x + w * 0.4, y - h * 0.6, x + w * 0.1, y);
// };

// const numberToWords = (num) => {
//   const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
//   const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

//   const inWords = (n) => {
//     if (n < 20) return a[n];
//     const digit = n % 10;
//     if (n < 100) return b[Math.floor(n / 10)] + (digit ? ' ' + a[digit] : '');
//     if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + inWords(n % 100) : '');
//     if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousands' + (n % 1000 ? ' ' + inWords(n % 1000) : '');
//     if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakhs' + (n % 100000 ? ' ' + inWords(n % 100000) : '');
//     return inWords(Math.floor(n / 10000000)) + ' Crores' + (n % 10000000 ? ' ' + inWords(n % 10000000) : '');
//   };

//   const parts = Number(num).toFixed(2).split('.');
//   const rupees = Number(parts[0]);
//   const paise = Number(parts[1]);

//   let result = '';
//   if (rupees > 0) {
//     result += inWords(rupees) + ' Rupees';
//   } else {
//     result += 'Zero Rupees';
//   }

//   if (paise > 0) {
//     result += ' And ' + inWords(paise) + ' Paise';
//   }
//   return result;
// };

// const PurchaseOrderList = () => {
//   const [openPurchase, setOpenPurchase] = useState(false);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [openPayment, setOpenPayment] = useState(false);
//   const [selectedPO, setSelectedPO] = useState(null);
//   const [exportAnchorEl, setExportAnchorEl] = useState(null);
//   const [orderData, setOrderData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // Filters State
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [supplierFilter, setSupplierFilter] = useState("All");
//   const [poNoFilter, setPoNoFilter] = useState("");

//   // Masters
//   const [suppliers, setSuppliers] = useState([]);

//   // Action Menu State
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [activeRow, setActiveRow] = useState(null);

//   // Timeline Log Dialog
//   const [logDialogOpen, setLogDialogOpen] = useState(false);

//   // Snackbar Notification
//   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

//   /* ================= FETCH DATA ================= */
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("authToken");

//       if (!token) {
//         console.error("❌ Token missing");
//         return;
//       }

//       // Fetch list
//       const res = await axios.get(
//         "http://localhost:5000/api/purchaseOrders/get",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (res.data.success) {
//         const sorted = res.data.data.sort((a, b) => b.id - a.id);
//         setOrderData(sorted);
//         setFilteredData(sorted);
//       } else {
//         setOrderData([]);
//         setFilteredData([]);
//       }

//       // Fetch suppliers for filter dropdown
//       const supRes = await axios.get("http://localhost:5000/api/suppliers/get", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSuppliers(supRes.data.data || []);

//     } catch (error) {
//       console.error("❌ Error fetching purchase order list:", error);
//       setOrderData([]);
//       setFilteredData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   /* ================= FILTERS IMPLEMENTATION ================= */
//   const handleSearch = () => {
//     let result = [...orderData];

//     if (startDate) {
//       result = result.filter((row) => new Date(row.purchase_date) >= new Date(startDate));
//     }
//     if (endDate) {
//       result = result.filter((row) => new Date(row.purchase_date) <= new Date(endDate));
//     }
//     if (supplierFilter !== "All") {
//       result = result.filter((row) => row.supplier_name === supplierFilter);
//     }
//     if (poNoFilter) {
//       result = result.filter((row) =>
//         row.po_number?.toLowerCase().includes(poNoFilter.toLowerCase()) ||
//         row.invoice_number?.toLowerCase().includes(poNoFilter.toLowerCase())
//       );
//     }

//     setFilteredData(result);
//   };

//   const handleClear = () => {
//     setStartDate("");
//     setEndDate("");
//     setSupplierFilter("All");
//     setPoNoFilter("");
//     setFilteredData(orderData);
//   };

//   /* ================= ACTION HANDLERS ================= */
//   const handleMenuOpen = (event, row) => {
//     setAnchorEl(event.currentTarget);
//     setActiveRow(row);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   // 1. Email Action
//   const handleSendEmail = () => {
//     handleMenuClose();
//     if (!activeRow) return;

//     setSnackbar({
//       open: true,
//       message: `Purchase order notification email successfully sent to ${activeRow.supplier_name}!`,
//       severity: "success",
//     });
//   };

//   // 2. Cancel PO Action
//   const handleCancelPurchase = async () => {
//     handleMenuClose();
//     if (!activeRow) return;

//     const confirmCancel = window.confirm(
//       `Are you sure you want to cancel the purchase order ${activeRow.po_number}? This will revert any raw material stock counts if completed.`
//     );
//     if (!confirmCancel) return;

//     try {
//       const token = localStorage.getItem("authToken");
//       await axios.put(
//         `http://localhost:5000/api/stockPurchaseItems/cancel/${activeRow.id}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setSnackbar({ open: true, message: "Purchase order cancelled successfully!", severity: "warning" });
//       fetchData();
//     } catch (error) {
//       console.error("❌ Cancel purchase order error:", error);
//       setSnackbar({ open: true, message: "Failed to cancel purchase order", severity: "error" });
//     }
//   };

//   // 3. View Log Action
  
//   const handleViewLog = () => {
//     handleMenuClose();
//     setLogDialogOpen(true);
//   };

//   // 4. Open PDF Action
//   const handleOpenPDF = async (row) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const res = await axios.get(
//         `http://localhost:5000/api/purchaseOrders/purchase-orders/${row.id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const data = res.data.data;
//       const items = data.items || [];

//       const doc = new jsPDF();
      
//       // Center Title "Invoice" in Red
//       doc.setFont("helvetica", "bold");
//       doc.setTextColor(239, 68, 68); // Red color
//       doc.setFontSize(22);
//       doc.text("Invoice", 105, 20, { align: "center" });
      
//       // Draw double-column box for From and To
//       doc.setDrawColor(148, 163, 184);
//       doc.setLineWidth(0.5);
//       doc.rect(15, 30, 180, 32);
//       doc.line(105, 30, 105, 62);
      
//       // Left Column (From: Supplier Name)
//       doc.setTextColor(15, 23, 42);
//       doc.setFontSize(11);
//       doc.setFont("helvetica", "bold");
//       doc.text("From:", 18, 38);
//       doc.setFont("helvetica", "normal");
//       doc.text(String(data.supplier || ""), 32, 38);
      
//       // Right Column (To: Kamla Sweets)
//       doc.setFont("helvetica", "bold");
//       doc.text("To:", 108, 38);
//       doc.setFont("helvetica", "normal");
//       doc.text("Kamla Sweets", 116, 38);
      
//       doc.setFontSize(9);
//       doc.text("C-8 Amrapali Golf Homes", 108, 44);
//       doc.text("Greater Noida West.", 108, 49);
//       doc.text("Farrukhabad,Uttar Pradesh", 108, 54);
//       doc.text("Mobile: +91 +917742135", 108, 59);
      
//       // Invoice Details below Box
//       doc.setTextColor(71, 85, 105);
//       doc.setFontSize(9.5);
//       const formattedInvoiceDate = data.purchaseDate 
//         ? new Date(data.purchaseDate).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })
//         : "";
//       const formattedCreatedTime = data.purchaseDate 
//         ? new Date(data.purchaseDate).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' }) + " 14:40:00"
//         : "";
//       doc.text(`Purchase: has an Invoice date of ${formattedInvoiceDate} (and the bill created on ${formattedCreatedTime}.)`, 15, 71);
      
//       // Draw grid table
//       let startY = 78;
//       const colWidths = [12, 44, 14, 14, 18, 18, 20, 14, 14, 12];
//       const colHeaders = ["Sr No", "Raw Material", "Unit", "Qty", "Price (Rs)", "Amt (Rs)", "Discount (Rs)", "CGST", "SGST", "IGST"];
//       const colAligns = ["center", "left", "left", "center", "center", "center", "center", "center", "center", "center"];

//       const colPositions = [];
//       let currentX = 15;
//       for (let i = 0; i < colWidths.length; i++) {
//         colPositions.push(currentX);
//         currentX += colWidths[i];
//       }
      
//       // Header Row
//       doc.setFillColor(241, 245, 249);
//       doc.rect(15, startY, 180, 10, "F");
      
//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(8.5);
//       doc.setTextColor(30, 41, 59);
      
//       for (let i = 0; i < colHeaders.length; i++) {
//         doc.rect(colPositions[i], startY, colWidths[i], 10);
//         let textX = colPositions[i] + 1.5;
//         let align = "left";
//         if (colAligns[i] === "center") {
//           textX = colPositions[i] + colWidths[i] / 2;
//           align = "center";
//         } else if (colAligns[i] === "right") {
//           textX = colPositions[i] + colWidths[i] - 1.5;
//           align = "right";
//         }
//         doc.text(colHeaders[i], textX, startY + 6.5, { align });
//       }
      
//       // Item Rows
//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(8);
//       doc.setTextColor(51, 65, 85);
//       let y = startY + 10;
      
//       let coreTotal = 0;
//       let totalCgst = 0;
//       let totalSgst = 0;
//       let totalIgst = 0;
//       let totalDiscount = Number(data.discount || 0);

//       items.forEach((item, index) => {
//         const rowHeight = 8;
//         const baseAmt = Number(item.qty || 0) * Number(item.price || 0);
        
//         coreTotal += baseAmt;

//         const vals = [
//           String(index + 1),
//           String(item.material || ""),
//           String(item.unit || ""),
//           String(item.qty || 0),
//           String(Number(item.price || 0).toFixed(0)),
//           String(baseAmt.toFixed(0)),
//           "0",
//           "0",
//           "0",
//           "0"
//         ];
        
//         for (let i = 0; i < vals.length; i++) {
//           doc.rect(colPositions[i], y, colWidths[i], rowHeight);
//           let textX = colPositions[i] + 1.5;
//           let align = "left";
//           if (colAligns[i] === "center") {
//             textX = colPositions[i] + colWidths[i] / 2;
//             align = "center";
//           } else if (colAligns[i] === "right") {
//             textX = colPositions[i] + colWidths[i] - 1.5;
//             align = "right";
//           }
//           doc.text(vals[i], textX, y + 5.5, { align });
//         }
//         y += rowHeight;
//       });
      
//       // Split the tax 50/50 for CGST/SGST if tax > 0
//       const taxVal = Number(data.tax || 0);
//       totalCgst = taxVal / 2;
//       totalSgst = taxVal / 2;

//       // Summary Rows matching screenshot perfectly
//       const grandTotalVal = Number(data.grandTotal || 0);
//       const summaryRows = [
//         ["Core Total", coreTotal.toFixed(3)],
//         ["Total CGST", totalCgst.toFixed(3)],
//         ["Total SGST", totalSgst.toFixed(3)],
//         ["Total IGST", totalIgst.toFixed(3)],
//         ["Total Discount Included in Invoice (Applicable Before Tax)", totalDiscount.toFixed(3)],
//         ["Delivery Charge Included in Invoice", "0.000"],
//         ["Grand Total", grandTotalVal.toFixed(3)],
//       ];

//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(8.5);
//       doc.setTextColor(15, 23, 42);
      
//       summaryRows.forEach(([label, value]) => {
//         const rowHeight = 6.5;
//         // Outer row box
//         doc.rect(15, y, 180, rowHeight);
//         // Vertical division line at x=168
//         doc.line(168, y, 168, y + rowHeight);
        
//         // Draw label (right-aligned in the left part)
//         doc.text(label, 168 - 2, y + 4.5, { align: "right" });

//         // Draw value (right-aligned in the right part)
//         doc.text(value, 195 - 2, y + 4.5, { align: "right" });
//         y += rowHeight;
//       });

//       // Total Amount in Words
//       const words = numberToWords(grandTotalVal);
//       const wordsLabel = `Total Amount In Words ${words}`;
//       const wordsRowHeight = 8;
//       doc.rect(15, y, 180, wordsRowHeight);
//       doc.text(wordsLabel, 195 - 2, y + 5.5, { align: "right" });
//       y += wordsRowHeight + 10;

//       // Additional text below table
//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(9.5);
//       doc.setTextColor(30, 41, 59);
//       doc.text(`PO Reference No.:   ${row.po_number}`, 15, y);
//       y += 8;

//       doc.setFont("helvetica", "bold");
//       doc.text("This is a computer generated copy hence signature is not required.", 105, y, { align: "center" });
//       y += 8;

//       doc.setFont("helvetica", "normal");
//       const statusText = row.payment_status === "paid" ? "Paid" : row.payment_status === "partial" ? "Partially Paid" : "Unpaid";
      
//       // Draw "Payment of "
//       doc.text("Payment of ", 15, y);
//       const w1 = doc.getTextWidth("Payment of ");
      
//       // Draw Rupee symbol at 15 + w1 + 0.5 (leave a tiny gap)
//       const rupeeX = 15 + w1 + 0.5;
//       drawRupee(doc, rupeeX, y, 9.5);
      
//       // Draw the rest of the text: "X.XXX has been made against this Purchase."
//       const wRupee = 1.74; // width of rupee symbol in mm
//       doc.text(`${Number(row.total_paid || 0).toFixed(3)} has been made against this Purchase.`, rupeeX + wRupee + 0.5, y);
      
//       y += 5;
//       doc.text(`(Status= ${statusText})`, 15, y);
      
//       window.open(doc.output("bloburl"), "_blank");

//     } catch (error) {
//       console.error("❌ Error generating PDF:", error);
//       setSnackbar({ open: true, message: "Error loading purchase order for PDF", severity: "error" });
//     }
//   };

//   /* ================= STATS CALCULATIONS ================= */
//   const processedOrders = filteredData.filter((row) => row.status === "completed");
  
//   const totalAmount = processedOrders.reduce((sum, row) => sum + Number(row.grand_total || 0), 0);
  
//   const outstandingAmount = filteredData
//     .filter((row) => row.status === "completed" && row.payment_status !== "paid")
//     .reduce((sum, row) => sum + (Number(row.grand_total || 0) - Number(row.total_paid || 0)), 0);

//   const taxAmountPaid = processedOrders.reduce((sum, row) => sum + Number(row.tax_amount || 0), 0);

//   const getStatusChip = (status) => {
//     if (status === "completed") {
//       return (
//         <Chip 
//           label="Processed" 
//           size="small" 
//           sx={{ bgcolor: "#FEF3C7", color: "#B45309", fontWeight: 700 }} 
//         />
//       );
//     } else if (status === "cancelled") {
//       return (
//         <Chip 
//           label="Cancelled" 
//           size="small" 
//           sx={{ bgcolor: "#FEE2E2", color: "#991B1B", fontWeight: 700 }} 
//         />
//       );
//     } else {
//       return (
//         <Chip 
//           label="Pending" 
//           size="small" 
//           sx={{ bgcolor: "#EFF6FF", color: "#1D4ED8", fontWeight: 700 }} 
//         />
//       );
//     }
//   };


// const exportToCSV = (data, fileName) => {
//   const headers = [
//     "Supplier",
//     "Date",
//     "PO Number",
//     "Total Amount",
//     "Payment Status",
//     "Paid Amount",
//     "Status",
//     "Created By",
//   ];

//   const rows = data.map((row) => [
//     row.supplier_name,
//     row.purchase_date
//       ? new Date(row.purchase_date).toLocaleDateString("en-GB")
//       : "",
//     row.po_number,
//     row.grand_total,
//     row.payment_status,
//     row.total_paid,
//     row.status,
//     row.created_by,
//   ]);

//   const csvContent =
//     [headers, ...rows]
//       .map((e) => e.map((v) => `"${v ?? ""}"`).join(","))
//       .join("\n");

//   const blob = new Blob([csvContent], {
//     type: "text/csv;charset=utf-8;",
//   });

//   const link = document.createElement("a");
//   const url = URL.createObjectURL(blob);

//   link.href = url;
//   link.download = fileName;

//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

// const handleExportCurrentPage = () => {
//   exportToCSV(
//     filteredData,
//     `purchase_orders_current_page_${Date.now()}.csv`
//   );

//   setExportAnchorEl(null);

//   setSnackbar({
//     open: true,
//     message: "Current page exported successfully",
//     severity: "success",
//   });
// };

// const handleExportAll = () => {
//   exportToCSV(
//     orderData,
//     `purchase_orders_all_${Date.now()}.csv`
//   );

//   setExportAnchorEl(null);

//   setSnackbar({
//     open: true,
//     message: "All purchase orders exported successfully",
//     severity: "success",
//   });
// };




//   return (
//     <Box sx={{ p: 3, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
//       {/* ===== HEADER ===== */}
//       <Stack direction="row" justifyContent="space-between" mb={2}>
//         <Typography fontSize={20} fontWeight={700} color="#1E293B">
//           Purchase Order List 
//         </Typography>

//         <Stack direction="row" spacing={1}>
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             sx={{ bgcolor: "#2563EB", textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "#1D4ED8" } }}
//             onClick={() => setOpenPurchase(true)}
//           >
//             Create New
//           </Button>

//           <Button
//             variant="outlined"
//             startIcon={<QrCodeScannerIcon />}
//             sx={{ borderColor: "#2563EB", color: "#2563EB", textTransform: "none", fontWeight: 600 }}
//           >
//             Scan & Purchase
//           </Button>

//          <>
//   <Button
//     variant="outlined"
//     startIcon={<DownloadIcon />}
//     onClick={(e) => setExportAnchorEl(e.currentTarget)}
//     sx={{
//       textTransform: "none",
//       color: "#475569",
//     }}
//   >
//     Export
//   </Button>

//   <Menu
//     anchorEl={exportAnchorEl}
//     open={Boolean(exportAnchorEl)}
//     onClose={() => setExportAnchorEl(null)}
//   >
//     <MenuItem onClick={handleExportCurrentPage}>
//       Export Current Page
//     </MenuItem>

//     <MenuItem onClick={handleExportAll}>
//       Export All
//     </MenuItem>
//   </Menu>
// </>
//         </Stack>
//       </Stack>

//       {/* ===== FILTER BAR ===== */}
//       <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
//         <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap gap={1.5}>
//           <TextField
//             size="small"
//             label="Start Date"
//             type="date"
//             InputLabelProps={{ shrink: true }}
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//           />

//           <TextField
//             size="small"
//             label="End Date"
//             type="date"
//             InputLabelProps={{ shrink: true }}
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//           />

//           <TextField
//             select
//             size="small"
//             label="To"
//             value={supplierFilter}
//             onChange={(e) => setSupplierFilter(e.target.value)}
//             sx={{ minWidth: 120 }}
//           >
//             <MenuItem value="All">All</MenuItem>
//             {suppliers.map((s) => (
//               <MenuItem key={s.id} value={s.name}>
//                 {s.name}
//               </MenuItem>
//             ))}
//           </TextField>

//           <TextField
//             size="small"
//             label="PO Number"
//             value={poNoFilter}
//             onChange={(e) => setPoNoFilter(e.target.value)}
//           />

//           <Button startIcon={<FilterAltOutlinedIcon />} variant="outlined" sx={{ textTransform: "none", color: "#475569" }}>
//             More Filters
//           </Button>

//           <Button
//             variant="contained"
//             startIcon={<SearchIcon />}
//             sx={{ bgcolor: "#2563EB", textTransform: "none", fontWeight: 600 }}
//             onClick={handleSearch}
//           >
//             Search
//           </Button>

//           <Button variant="text" sx={{ textTransform: "none", color: "#64748B" }} onClick={handleClear}>
//             Clear
//           </Button>
//         </Stack>
//       </Paper>

//       {/* ===== STATS CARDS ===== */}
//       <Grid container spacing={3} mb={3}>
//         <Grid item xs={4}>
//           <Paper sx={{ p: 2.5, borderRadius: 2, borderLeft: "4px solid #3B82F6", bgcolor: "#EFF6FF" }}>
//             <Typography fontSize={13} fontWeight={600} color="#3B82F6" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//               Total recorded purchase order amount is <InfoIcon fontSize="small" />
//             </Typography>
//             <Typography fontSize={24} fontWeight={800} color="#1E3A8A" mt={1}>
//               ₹ {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
//             </Typography>
//           </Paper>
//         </Grid>

//         <Grid item xs={4}>
//           <Paper sx={{ p: 2.5, borderRadius: 2, borderLeft: "4px solid #10B981", bgcolor: "#ECFDF5" }}>
//             <Typography fontSize={13} fontWeight={600} color="#10B981">
//               Total outstanding Payment for PO is
//             </Typography>
//             <Typography fontSize={24} fontWeight={800} color="#064E3B" mt={1}>
//               ₹ {outstandingAmount.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
//             </Typography>
//           </Paper>
//         </Grid>

//         <Grid item xs={4}>
//           <Paper sx={{ p: 2.5, borderRadius: 2, borderLeft: "4px solid #F59E0B", bgcolor: "#FEF3C7" }}>
//             <Typography fontSize={13} fontWeight={600} color="#F59E0B" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//               Tax paid to the seller <InfoIcon fontSize="small" />
//             </Typography>
//             <Typography fontSize={24} fontWeight={800} color="#78350F" mt={1}>
//               ₹ {taxAmountPaid.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
//             </Typography>
//           </Paper>
//         </Grid>
//       </Grid>

//       {/* ===== TABLE ===== */}
//       <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
//         {loading ? (
//           <Box sx={{ p: 4, textAlign: "center" }}>
//             <CircularProgress />
//           </Box>
//         ) : filteredData.length === 0 ? (
//           <Box sx={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
//             <Typography color="text.secondary">No Purchase Order Found</Typography>
//           </Box>
//         ) : (
//           <Table>
//             <TableHead sx={{ bgcolor: "#F1F5F9" }}>
//               <TableRow>
//                 <TableCell><b>To</b></TableCell>
//                 <TableCell><b>Date</b></TableCell>
//                 <TableCell><b>PO Number</b></TableCell>
//                 <TableCell align="right"><b>Total (₹)</b></TableCell>
//                 <TableCell><b>Payment</b></TableCell>
//                 <TableCell><b>Created By</b></TableCell>
//                 <TableCell><b>Status</b></TableCell>
//                 <TableCell align="center"><b>Action</b></TableCell>
//                 <TableCell><b>Next Step</b></TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {filteredData.map((row) => (
//                 <TableRow key={row.id} hover>
//                   <TableCell>{row.supplier_name}</TableCell>

//                   <TableCell>
//                     {row.purchase_date ? new Date(row.purchase_date).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
//                   </TableCell>

//                   <TableCell sx={{ color: "#2563EB", fontWeight: 600, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
//                              onClick={() => navigate(`/inventory/reports/purchase-orders/${row.id}`)}>
//                     {row.po_number}
//                   </TableCell>

//                   <TableCell align="right" sx={{ fontWeight: 600 }}>
//                     {Number(row.grand_total).toLocaleString(undefined, { minimumFractionDigits: 3 })}
//                   </TableCell>

//                   <TableCell>
//                     <Box>
//                       <Typography fontSize={13} fontWeight={600} color={
//                         row.payment_status === "paid" ? "#10B981" : 
//                         row.payment_status === "partial" ? "#F59E0B" : "#475569"
//                       }>
//                         {Number(row.total_paid || 0).toLocaleString(undefined, { minimumFractionDigits: 3 })}
//                       </Typography>
//                       <Typography fontSize={11} fontWeight={700} color={
//                         row.payment_status === "paid" ? "#10B981" : 
//                         row.payment_status === "partial" ? "#F59E0B" : "#EF4444"
//                       }>
//                         {row.payment_status === "paid" ? "Paid" : 
//                          row.payment_status === "partial" ? "Partially Paid" : "Unpaid"}
//                       </Typography>
//                     </Box>
//                   </TableCell>

//                   <TableCell>
//                     <Stack direction="row" spacing={0.5} alignItems="center">
//                       <Typography fontSize={13}>{row.created_by || "Ashish Mishra"}</Typography>
//                       <InfoIcon fontSize="inherit" color="action" />
//                     </Stack>
//                   </TableCell>

//                   <TableCell>
//                     {getStatusChip(row.status)}
//                   </TableCell>

//                   <TableCell align="center">
//                     <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center">
//                       <IconButton size="small" onClick={() => handleOpenPDF(row)}>
//                         <PictureAsPdfIcon fontSize="small" sx={{ color: "#EF4444" }} />
//                       </IconButton>

//                       <IconButton size="small" onClick={(e) => handleMenuOpen(e, row)}>
//                         <MoreVertIcon fontSize="small" sx={{ color: "#64748B" }} />
//                       </IconButton>
//                     </Stack>
//                   </TableCell>
//                   <TableCell>-</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         )}
//       </Paper>

//       {/* ===== ACTIONS 3-DOT MENU ===== */}
//       <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
//         {activeRow?.status !== "cancelled" && (
//           <MenuItem onClick={() => { handleMenuClose(); setOpenPayment(true); }}>Paid Amount</MenuItem>
//         )}
//         <MenuItem onClick={handleSendEmail}>Email</MenuItem>
//         {activeRow?.status !== "cancelled" && (
//           <MenuItem onClick={handleCancelPurchase} sx={{ color: "#EF4444" }}>
//             Cancel
//           </MenuItem>
//         )}
//         {activeRow?.status !== "cancelled" && (
//           <MenuItem onClick={() => { handleMenuClose(); setSelectedPO(activeRow); setOpenEdit(true); }}>Edit</MenuItem>
//         )}
//         <MenuItem onClick={handleViewLog}>View Log</MenuItem>
//       </Menu>

//       {/* ===== TIMELINE LOG DIALOG ===== */}
//       <Dialog open={logDialogOpen} onClose={() => setLogDialogOpen(false)} maxWidth="xs" fullWidth>
//         <DialogTitle sx={{ fontWeight: 700 }}>Action Timeline Log</DialogTitle>
//         <DialogContent>
//           {activeRow && (
//             <Stack spacing={2} sx={{ mt: 1 }}>
//               <Stack direction="row" spacing={1.5}>
//                 <CalendarMonthIcon color="primary" />
//                 <Box>
//                   <Typography fontSize={13} fontWeight={700}>
//                     Purchase Draft Created
//                   </Typography>
//                   <Typography fontSize={11} color="text.secondary">
//                     Logged by system when PO created
//                   </Typography>
//                 </Box>
//               </Stack>

//               {activeRow.status === "completed" && (
//                 <Stack direction="row" spacing={1.5}>
//                   <CalendarMonthIcon color="success" />
//                   <Box>
//                     <Typography fontSize={13} fontWeight={700} color="#166534">
//                       Stock Completed & Saved
//                     </Typography>
//                     <Typography fontSize={11} color="text.secondary">
//                       Quantity updated in available stock
//                     </Typography>
//                   </Box>
//                 </Stack>
//               )}

//               {activeRow.status === "cancelled" && (
//                 <Stack direction="row" spacing={1.5}>
//                   <CalendarMonthIcon color="error" />
//                   <Box>
//                     <Typography fontSize={13} fontWeight={700} color="#991B1B">
//                       Purchase Order Cancelled
//                     </Typography>
//                     <Typography fontSize={11} color="text.secondary">
//                       Quantities deducted back from available stock
//                     </Typography>
//                   </Box>
//                 </Stack>
//               )}
//             </Stack>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setLogDialogOpen(false)} sx={{ textTransform: "none" }}>
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* ===== ADD PURCHASE ORDER MODAL ===== */}
//       <Dialog open={openPurchase} onClose={() => setOpenPurchase(false)} maxWidth="xl" fullWidth>
//         <DialogContent dividers>
//           <AddPurchaseOrder 
//             onClose={() => {
//               setOpenPurchase(false);
//               fetchData();
//             }}
//           />
//         </DialogContent>
//       </Dialog>

//       {/* ===== EDIT PURCHASE MODAL ===== */}
//       <EditPurchase
//         open={openEdit}
//         onClose={() => {
//           setOpenEdit(false);
//           setSelectedPO(null);
//         }}
//         purchaseOrder={selectedPO}
//         onSaveSuccess={fetchData}
//       />

//       {/* ===== PAYMENT DIALOG ===== */}
//       <PaymentDialog
//         open={openPayment}
//         onClose={() => {
//           setOpenPayment(false);
//         }}
//         purchaseOrder={activeRow}
//         onSaveSuccess={fetchData}
//       />

//       {/* ===== SNACKBAR TOAST ===== */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={4000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       >
//         <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ width: "100%" }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default PurchaseOrderList;











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
import AddPurchaseOrder from "./AddPurchaseOrder";
import EditPurchase from "./EditPurchase";
import PaymentDialog from "./PaymentDialog";
import axios from "axios";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";
import DownloadIcon from "@mui/icons-material/Download";

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

// ✅ FIX: Handles ALL date formats from DB:
// "2024-06-10" | "2024-06-10T00:00:00.000Z" | "2024-06-10T00:00:00" | Date object
const parseLocalDate = (dateStr) => {
  if (!dateStr) return null;

  // If already a JS Date object
  if (dateStr instanceof Date) {
    return new Date(dateStr.getFullYear(), dateStr.getMonth(), dateStr.getDate());
  }

  const str = String(dateStr).trim();

  // Extract only the YYYY-MM-DD part (works for both "2024-06-10" and "2024-06-10T...")
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    // Use local constructor — no UTC shift
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }

  // Fallback for DD/MM/YYYY format
  const dmyMatch = str.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (dmyMatch) {
    return new Date(Number(dmyMatch[3]), Number(dmyMatch[2]) - 1, Number(dmyMatch[1]));
  }

  return null;
};

// ✅ FIX: Format date correctly without UTC offset issue
const formatDate = (dateStr, options = { day: "numeric", month: "short", year: "numeric" }) => {
  if (!dateStr) return "-";
  const d = parseLocalDate(dateStr);
  if (!d || isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-GB", options);
};

const drawRupee = (doc, x, y, size = 9.5) => {
  const h = size * 0.352778 * 0.8;
  const w = h * 0.65;
  doc.setLineWidth(0.25);
  doc.setDrawColor(30, 41, 59);
  doc.line(x, y - h, x + w, y - h);
  doc.line(x, y - h * 0.6, x + w * 0.8, y - h * 0.6);
  doc.line(x + w * 0.15, y - h, x + w * 0.15, y - h * 0.6);
  doc.line(x + w * 0.15, y - h, x + w, y - h * 0.85);
  doc.line(x + w, y - h * 0.85, x + w, y - h * 0.75);
  doc.line(x + w, y - h * 0.75, x + w * 0.15, y - h * 0.6);
  doc.line(x + w * 0.4, y - h * 0.6, x + w * 0.1, y);
};

const numberToWords = (num) => {
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
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

  let result = rupees > 0 ? inWords(rupees) + ' Rupees' : 'Zero Rupees';
  if (paise > 0) result += ' And ' + inWords(paise) + ' Paise';
  return result;
};

const PurchaseOrderList = () => {
  const [openPurchase, setOpenPurchase] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [orderData, setOrderData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("All");
  const [poNoFilter, setPoNoFilter] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeRow, setActiveRow] = useState(null);
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) { console.error("❌ Token missing"); return; }

      const res = await axios.get("http://localhost:5000/api/purchaseOrders/get", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const sorted = res.data.data.sort((a, b) => b.id - a.id);
        setOrderData(sorted);
        setFilteredData(sorted);
      } else {
        setOrderData([]);
        setFilteredData([]);
      }

      const supRes = await axios.get("http://localhost:5000/api/suppliers/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuppliers(supRes.data.data || []);
    } catch (error) {
      console.error("❌ Error fetching purchase order list:", error);
      setOrderData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  /* ================= FILTERS ================= */
  const handleSearch = () => {
    let result = [...orderData];

    if (startDate) {
      // ✅ FIX: compare date strings directly (YYYY-MM-DD) to avoid timezone issues
      result = result.filter((row) => {
        const rowDate = String(row.purchase_date).substring(0, 10);
        return rowDate >= startDate;
      });
    }
    if (endDate) {
      result = result.filter((row) => {
        const rowDate = String(row.purchase_date).substring(0, 10);
        return rowDate <= endDate;
      });
    }
    if (supplierFilter !== "All") {
      result = result.filter((row) => row.supplier_name === supplierFilter);
    }
    if (poNoFilter) {
      result = result.filter((row) =>
        row.po_number?.toLowerCase().includes(poNoFilter.toLowerCase()) ||
        row.invoice_number?.toLowerCase().includes(poNoFilter.toLowerCase())
      );
    }
    setFilteredData(result);
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setSupplierFilter("All");
    setPoNoFilter("");
    setFilteredData(orderData);
  };

  /* ================= ACTION HANDLERS ================= */
  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setActiveRow(row);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleSendEmail = () => {
    handleMenuClose();
    if (!activeRow) return;
    setSnackbar({
      open: true,
      message: `Purchase order notification email successfully sent to ${activeRow.supplier_name}!`,
      severity: "success",
    });
  };

  const handleCancelPurchase = async () => {
    handleMenuClose();
    if (!activeRow) return;
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel the purchase order ${activeRow.po_number}? This will revert any raw material stock counts if completed.`
    );
    if (!confirmCancel) return;
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `http://localhost:5000/api/stockPurchaseItems/cancel/${activeRow.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({ open: true, message: "Purchase order cancelled successfully!", severity: "warning" });
      fetchData();
    } catch (error) {
      console.error("❌ Cancel purchase order error:", error);
      setSnackbar({ open: true, message: "Failed to cancel purchase order", severity: "error" });
    }
  };

  const handleViewLog = () => {
    handleMenuClose();
    setLogDialogOpen(true);
  };

  const handleOpenPDF = async (row) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(
        `http://localhost:5000/api/purchaseOrders/purchase-orders/${row.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data.data;
      const items = data.items || [];
      const doc = new jsPDF();

      doc.setFont("helvetica", "bold");
      doc.setTextColor(239, 68, 68);
      doc.setFontSize(22);
      doc.text("Invoice", 105, 20, { align: "center" });

      doc.setDrawColor(148, 163, 184);
      doc.setLineWidth(0.5);
      doc.rect(15, 30, 180, 32);
      doc.line(105, 30, 105, 62);

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("From:", 18, 38);
      doc.setFont("helvetica", "normal");
      doc.text(String(data.supplier || ""), 32, 38);

      doc.setFont("helvetica", "bold");
      doc.text("To:", 108, 38);
      doc.setFont("helvetica", "normal");
      doc.text("Kamla Sweets", 116, 38);

      doc.setFontSize(9);
      doc.text("C-8 Amrapali Golf Homes", 108, 44);
      doc.text("Greater Noida West.", 108, 49);
      doc.text("Farrukhabad,Uttar Pradesh", 108, 54);
      doc.text("Mobile: +91 +917742135", 108, 59);

      doc.setTextColor(71, 85, 105);
      doc.setFontSize(9.5);

      // ✅ FIX: Use parseLocalDate for PDF dates too
      const formattedInvoiceDate = data.purchaseDate
        ? formatDate(data.purchaseDate, { day: "numeric", month: "long", year: "numeric" })
        : "";
      const formattedCreatedTime = data.purchaseDate
        ? formatDate(data.purchaseDate, { day: "numeric", month: "long", year: "numeric" }) + " 14:40:00"
        : "";
      doc.text(`Purchase: has an Invoice date of ${formattedInvoiceDate} (and the bill created on ${formattedCreatedTime}.)`, 15, 71);

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

      doc.setFillColor(241, 245, 249);
      doc.rect(15, startY, 180, 10, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);

      for (let i = 0; i < colHeaders.length; i++) {
        doc.rect(colPositions[i], startY, colWidths[i], 10);
        let textX = colAligns[i] === "center" ? colPositions[i] + colWidths[i] / 2 : colPositions[i] + 1.5;
        doc.text(colHeaders[i], textX, startY + 6.5, { align: colAligns[i] });
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      let y = startY + 10;

      let coreTotal = 0;
      let totalIgst = 0;
      let totalDiscount = Number(data.discount || 0);

      items.forEach((item, index) => {
        const rowHeight = 8;
        const baseAmt = Number(item.qty || 0) * Number(item.price || 0);
        coreTotal += baseAmt;

        const vals = [
          String(index + 1),
          String(item.material || ""),
          String(item.unit || ""),
          String(item.qty || 0),
          String(Number(item.price || 0).toFixed(0)),
          String(baseAmt.toFixed(0)),
          "0", "0", "0", "0",
        ];

        for (let i = 0; i < vals.length; i++) {
          doc.rect(colPositions[i], y, colWidths[i], rowHeight);
          let textX = colAligns[i] === "center" ? colPositions[i] + colWidths[i] / 2 : colPositions[i] + 1.5;
          doc.text(vals[i], textX, y + 5.5, { align: colAligns[i] });
        }
        y += rowHeight;
      });

      const taxVal = Number(data.tax || 0);
      const totalCgst = taxVal / 2;
      const totalSgst = taxVal / 2;
      const grandTotalVal = Number(data.grandTotal || 0);

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
        doc.rect(15, y, 180, rowHeight);
        doc.line(168, y, 168, y + rowHeight);
        doc.text(label, 168 - 2, y + 4.5, { align: "right" });
        doc.text(value, 195 - 2, y + 4.5, { align: "right" });
        y += rowHeight;
      });

      const words = numberToWords(grandTotalVal);
      const wordsRowHeight = 8;
      doc.rect(15, y, 180, wordsRowHeight);
      doc.text(`Total Amount In Words ${words}`, 195 - 2, y + 5.5, { align: "right" });
      y += wordsRowHeight + 10;

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
      doc.text("Payment of ", 15, y);
      const w1 = doc.getTextWidth("Payment of ");
      const rupeeX = 15 + w1 + 0.5;
      drawRupee(doc, rupeeX, y, 9.5);
      const wRupee = 1.74;
      doc.text(`${Number(row.total_paid || 0).toFixed(3)} has been made against this Purchase.`, rupeeX + wRupee + 0.5, y);
      y += 5;
      doc.text(`(Status= ${statusText})`, 15, y);

      doc.save(`Purchase_Order_${row.po_number}.pdf`);
    } catch (error) {
      console.error("❌ Error generating PDF:", error);
      setSnackbar({ open: true, message: "Error loading purchase order for PDF", severity: "error" });
    }
  };

  /* ================= STATS ================= */
  const processedOrders = filteredData.filter((row) => row.status === "completed");
  const totalAmount = processedOrders.reduce((sum, row) => sum + Number(row.grand_total || 0), 0);
  const outstandingAmount = filteredData
    .filter((row) => row.status === "completed" && row.payment_status !== "paid")
    .reduce((sum, row) => sum + (Number(row.grand_total || 0) - Number(row.total_paid || 0)), 0);
  const taxAmountPaid = processedOrders.reduce((sum, row) => sum + Number(row.tax_amount || 0), 0);

  const getStatusChip = (status) => {
    if (status === "completed") return <Chip label="Processed" size="small" sx={{ bgcolor: "#FEF3C7", color: "#B45309", fontWeight: 700 }} />;
    if (status === "cancelled") return <Chip label="Cancelled" size="small" sx={{ bgcolor: "#FEE2E2", color: "#991B1B", fontWeight: 700 }} />;
    return <Chip label="Pending" size="small" sx={{ bgcolor: "#EFF6FF", color: "#1D4ED8", fontWeight: 700 }} />;
  };

  /* ================= CSV EXPORT ================= */
  const exportToCSV = (data, fileName) => {
    const headers = ["Supplier", "Date", "PO Number", "Total Amount", "Payment Status", "Paid Amount", "Status", "Created By"];
    const rows = data.map((row) => [
      row.supplier_name,
      // ✅ FIX: Use formatDate helper here too
      formatDate(row.purchase_date),
      row.po_number,
      row.grand_total,
      row.payment_status,
      row.total_paid,
      row.status,
      row.created_by,
    ]);
    const csvContent = [headers, ...rows].map((e) => e.map((v) => `"${v ?? ""}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCurrentPage = () => {
    exportToCSV(filteredData, `purchase_orders_current_page_${Date.now()}.csv`);
    setExportAnchorEl(null);
    setSnackbar({ open: true, message: "Current page exported successfully", severity: "success" });
  };

  const handleExportAll = () => {
    exportToCSV(orderData, `purchase_orders_all_${Date.now()}.csv`);
    setExportAnchorEl(null);
    setSnackbar({ open: true, message: "All purchase orders exported successfully", severity: "success" });
  };

  /* ================= RENDER ================= */
  return (
    <Box sx={{ p: 3, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography fontSize={20} fontWeight={700} color="#1E293B">
          Purchase Order List 
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
              startIcon={<DownloadIcon />}
              onClick={(e) => setExportAnchorEl(e.currentTarget)}
              sx={{ textTransform: "none", color: "#475569" }}
            >
              Export
            </Button>
            <Menu anchorEl={exportAnchorEl} open={Boolean(exportAnchorEl)} onClose={() => setExportAnchorEl(null)}>
              <MenuItem onClick={handleExportCurrentPage}>Export Current Page</MenuItem>
              <MenuItem onClick={handleExportAll}>Export All</MenuItem>
            </Menu>
          </>
        </Stack>
      </Stack>

      {/* FILTER BAR */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap gap={1.5}>
          <TextField size="small" label="Start Date" type="date" InputLabelProps={{ shrink: true }} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <TextField size="small" label="End Date" type="date" InputLabelProps={{ shrink: true }} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <TextField select size="small" label="To" value={supplierFilter} onChange={(e) => setSupplierFilter(e.target.value)} sx={{ minWidth: 120 }}>
            <MenuItem value="All">All</MenuItem>
            {suppliers.map((s) => <MenuItem key={s.id} value={s.name}>{s.name}</MenuItem>)}
          </TextField>
          <TextField size="small" label="PO Number" value={poNoFilter} onChange={(e) => setPoNoFilter(e.target.value)} />
          <Button startIcon={<FilterAltOutlinedIcon />} variant="outlined" sx={{ textTransform: "none", color: "#475569" }}>More Filters</Button>
          <Button variant="contained" startIcon={<SearchIcon />} sx={{ bgcolor: "#2563EB", textTransform: "none", fontWeight: 600 }} onClick={handleSearch}>Search</Button>
          <Button variant="text" sx={{ textTransform: "none", color: "#64748B" }} onClick={handleClear}>Clear</Button>
        </Stack>
      </Paper>

      {/* STATS CARDS */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={4}>
          <Paper sx={{ p: 2.5, borderRadius: 2, borderLeft: "4px solid #3B82F6", bgcolor: "#EFF6FF" }}>
            <Typography fontSize={13} fontWeight={600} color="#3B82F6" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              Total recorded purchase order amount is <InfoIcon fontSize="small" />
            </Typography>
            <Typography fontSize={24} fontWeight={800} color="#1E3A8A" mt={1}>
              ₹ {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 2.5, borderRadius: 2, borderLeft: "4px solid #10B981", bgcolor: "#ECFDF5" }}>
            <Typography fontSize={13} fontWeight={600} color="#10B981">Total outstanding Payment for PO is</Typography>
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

      {/* TABLE */}
      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ p: 4, textAlign: "center" }}><CircularProgress /></Box>
        ) : filteredData.length === 0 ? (
          <Box sx={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography color="text.secondary">No Purchase Order Found</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: "#F1F5F9" }}>
              <TableRow>
                <TableCell><b>To</b></TableCell>
                <TableCell><b>Date</b></TableCell>
                <TableCell><b>PO Number</b></TableCell>
                <TableCell align="right"><b>Total (₹)</b></TableCell>
                <TableCell><b>Payment</b></TableCell>
                <TableCell><b>Created By</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell align="center"><b>Action</b></TableCell>
                <TableCell><b>Next Step</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.supplier_name}</TableCell>

                  {/* ✅ FIX: Use formatDate helper — no more UTC timezone shift */}
                  <TableCell>{formatDate(row.purchase_date)}</TableCell>

                  <TableCell
                    sx={{ color: "#2563EB", fontWeight: 600, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                    onClick={() => navigate(`/inventory/reports/purchase-orders/${row.id}`)}
                  >
                    {row.po_number}
                  </TableCell>

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
                        {row.payment_status === "paid" ? "Paid" : row.payment_status === "partial" ? "Partially Paid" : "Unpaid"}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography fontSize={13}>{row.created_by || "Ashish Mishra"}</Typography>
                      <InfoIcon fontSize="inherit" color="action" />
                    </Stack>
                  </TableCell>

                  <TableCell>{getStatusChip(row.status)}</TableCell>

                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center">
                      <IconButton size="small" onClick={() => handleOpenPDF(row)}>
                        <PictureAsPdfIcon fontSize="small" sx={{ color: "#EF4444" }} />
                      </IconButton>
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, row)}>
                        <MoreVertIcon fontSize="small" sx={{ color: "#64748B" }} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* 3-DOT MENU */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {activeRow?.status !== "cancelled" && (
          <MenuItem onClick={() => { handleMenuClose(); setOpenPayment(true); }}>Paid Amount</MenuItem>
        )}
        <MenuItem onClick={handleSendEmail}>Email</MenuItem>
        {activeRow?.status !== "cancelled" && (
          <MenuItem onClick={handleCancelPurchase} sx={{ color: "#EF4444" }}>Cancel</MenuItem>
        )}
        {activeRow?.status !== "cancelled" && (
          <MenuItem onClick={() => { handleMenuClose(); setSelectedPO(activeRow); setOpenEdit(true); }}>Edit</MenuItem>
        )}
        <MenuItem onClick={handleViewLog}>View Log</MenuItem>
      </Menu>

      {/* TIMELINE LOG DIALOG */}
      <Dialog open={logDialogOpen} onClose={() => setLogDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Action Timeline Log</DialogTitle>
        <DialogContent>
          {activeRow && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Stack direction="row" spacing={1.5}>
                <CalendarMonthIcon color="primary" />
                <Box>
                  <Typography fontSize={13} fontWeight={700}>Purchase Draft Created</Typography>
                  <Typography fontSize={11} color="text.secondary">Logged by system when PO created</Typography>
                </Box>
              </Stack>
              {activeRow.status === "completed" && (
                <Stack direction="row" spacing={1.5}>
                  <CalendarMonthIcon color="success" />
                  <Box>
                    <Typography fontSize={13} fontWeight={700} color="#166534">Stock Completed & Saved</Typography>
                    <Typography fontSize={11} color="text.secondary">Quantity updated in available stock</Typography>
                  </Box>
                </Stack>
              )}
              {activeRow.status === "cancelled" && (
                <Stack direction="row" spacing={1.5}>
                  <CalendarMonthIcon color="error" />
                  <Box>
                    <Typography fontSize={13} fontWeight={700} color="#991B1B">Purchase Order Cancelled</Typography>
                    <Typography fontSize={11} color="text.secondary">Quantities deducted back from available stock</Typography>
                  </Box>
                </Stack>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogDialogOpen(false)} sx={{ textTransform: "none" }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ADD PURCHASE ORDER MODAL */}
      <Dialog open={openPurchase} onClose={() => setOpenPurchase(false)} maxWidth="xl" fullWidth>
        <DialogContent dividers>
          <AddPurchaseOrder onClose={() => { setOpenPurchase(false); fetchData(); }} />
        </DialogContent>
      </Dialog>

      {/* EDIT PURCHASE MODAL */}
      <EditPurchase
        open={openEdit}
        onClose={() => { setOpenEdit(false); setSelectedPO(null); }}
        purchaseOrder={selectedPO}
        onSaveSuccess={fetchData}
      />

      {/* PAYMENT DIALOG */}
      <PaymentDialog
        open={openPayment}
        onClose={() => setOpenPayment(false)}
        purchaseOrder={activeRow}
        onSaveSuccess={fetchData}
      />

      {/* SNACKBAR */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PurchaseOrderList;