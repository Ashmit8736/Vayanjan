import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Stack,
  Divider,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SyncIcon from "@mui/icons-material/Sync";
import GetAppIcon from "@mui/icons-material/GetApp";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SearchIcon from "@mui/icons-material/Search";
import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import ListAltIcon from "@mui/icons-material/ListAlt";
import useOnlineStatus from "../../../hooks/useOnlineStatus";
import axiosInstance from "../../../services/api/axios-config";
import { getMyBranchesAPI } from "../../../services/api/branchAPI";

// Print helper for thermal voucher receipt slip (80mm width)
const printVoucherSlip = (voucher) => {
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Receiving Stock Receipt #${voucher.id || 'N/A'}</title>
  <style>
    body {
      font-family: 'Courier New', Courier, monospace;
      margin: 10px;
      padding: 0;
      width: 280px; /* Approx 80mm thermal paper width */
      color: #000;
      font-size: 12px;
    }
    .header {
      text-align: center;
      margin-bottom: 15px;
      border-bottom: 1px dashed #000;
      padding-bottom: 8px;
    }
    .header h1 {
      font-size: 16px;
      margin: 0 0 5px 0;
      text-transform: uppercase;
      font-weight: bold;
    }
    .meta-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
    .content-box {
      border-bottom: 1px dashed #000;
      margin-bottom: 12px;
      padding-bottom: 8px;
    }
    .item-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .item-qty {
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      margin: 10px 0;
      border: 1px solid #000;
      padding: 5px;
      background: #f9f9f9;
    }
    .footer {
      text-align: center;
      margin-top: 15px;
      font-size: 10px;
    }
    .signature-area {
      margin-top: 30px;
      border-top: 1px solid #000;
      text-align: center;
      padding-top: 5px;
      font-size: 11px;
    }
    @media print {
      @page {
        margin: 0;
      }
      body {
        margin: 8mm 6mm;
      }
    }
  </style>
</head>
<body>
  <div style="font-size: 10.5px; margin-bottom: 8px; border-bottom: 1px dashed #000; padding-bottom: 5px; font-family: monospace; text-align: left;">
    <span>${new Date().toLocaleDateString("en-US", {year: '2-digit', month: 'numeric', day: 'numeric'})}, ${new Date().toLocaleTimeString("en-US", {hour: 'numeric', minute: '2-digit'})} &nbsp;&nbsp; Receiving Stock Receipt #${voucher.id || 'TEMP'}</span>
  </div>

  <div class="header">
    <h1>Kamla Sweets</h1>
    <div>Branch ID: ${voucher.branch_id || 'Main'}</div>
    <div>Receipt Slip</div>
  </div>
  
  <div class="content-box">
    <div class="meta-row">
      <strong>Receiving ID:</strong>
      <span>REC-${voucher.id || 'TEMP'}</span>
    </div>
    <div class="meta-row">
      <strong>Status:</strong>
      <span>${voucher.status || 'Received'}</span>
    </div>
    <div class="meta-row">
      <strong>Date:</strong>
      <span>${voucher.received_at || new Date().toLocaleString("en-IN")}</span>
    </div>
  </div>

  <div class="content-box">
    <div class="item-title">Item Description:</div>
    <div style="font-size: 15px; text-transform: uppercase; text-align: center; margin-top: 5px;">
      ${voucher.item_name}
    </div>
    <div class="item-qty">
      QTY: ${voucher.quantity} Units
    </div>
  </div>

  <div class="signature-area">
    Received By (Signature)
  </div>

  <div class="footer">
    *** Thank You / Vyanjan Team ***
  </div>

  <script>
    window.onload = function() {
      window.focus();
      window.print();
      setTimeout(function() { window.close(); }, 500);
    };
  </script>
</body>
</html>`;

  const w = window.open("", "_blank");
  if (w) {
    w.document.write(html);
    w.document.close();
  }
};

const ProductionVouchers = () => {
  const isOnline = useOnlineStatus();
  const [vouchers, setVouchers] = useState([]);
  const [offlineVouchers, setOfflineVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [syncing, setSyncing] = useState(false);

  const [itemsList, setItemsList] = useState([]);
  const [branches, setBranches] = useState([]);
  const [billingUsers, setBillingUsers] = useState([]);
  const [manualDialogOpen, setManualDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [sentVouchersDetails, setSentVouchersDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [manualForm, setManualForm] = useState({
    item_name: "",
    quantity: "",
    status: "Pending",
    target_branch_id: "",
    target_billing_user_id: "",
  });

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assignForm, setAssignForm] = useState({
    source_voucher_id: "",
    item_name: "",
    target_branch_id: "",
    target_billing_user_id: "",
    forward_quantity: "",
    max_quantity: 0
  });

  const token = localStorage.getItem("authToken");
  let userRole = "";
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userRole = payload.role;
    } catch (e) {}
  }

  // Load vouchers on mount / online status change
  useEffect(() => {
    fetchVouchers();
    loadOfflineVouchers();
    fetchItems();
    fetchBranches();
    fetchBillingUsers();
  }, [isOnline]);

  const fetchBillingUsers = async () => {
    try {
      const response = await axiosInstance.get("/users/owner/users");
      if (response && response.success) {
        const bUsers = response.data.filter(u => u.role === 'billing' || u.role === 'both');
        setBillingUsers(bUsers);
      }
    } catch (err) {
      console.error("Error fetching billing users:", err);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await getMyBranchesAPI();
      if (response && response.success) {
        setBranches(response.data);
      }
    } catch (err) {
      console.error("Error fetching branches:", err);
    }
  };

  const fetchSentVoucherDetails = async () => {
    setLoadingDetails(true);
    try {
      const response = await axiosInstance.get("/vouchers/sent-details");
      if (response && response.success) {
        setSentVouchersDetails(response.data);
      }
    } catch (err) {
      console.error("Error fetching sent voucher details:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleOpenDetails = () => {
    fetchSentVoucherDetails();
    setDetailsDialogOpen(true);
  };

  const fetchItems = async () => {
    try {
      const response = await axiosInstance.get("/item/list");
      if (response && response.success) {
        setItemsList(response.data);
      }
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  const handleSaveManualVoucher = async () => {
    if (!manualForm.item_name || !manualForm.quantity) {
      alert("Please select an item and enter quantity");
      return;
    }

    const qty = Number(manualForm.quantity);
    if (isNaN(qty) || qty <= 0) {
      alert("Quantity must be a positive number");
      return;
    }

    if (!isOnline) {
      // Offline mode: save locally
      const randomId = Math.floor(100000 + Math.random() * 900000);
      const targetBranchName = branches.find(b => b.branch_id === manualForm.target_branch_id)?.branch_name || "";
      const targetUserName = billingUsers.find(u => u.id === manualForm.target_billing_user_id)?.name || "";

      const newVoucher = {
        id: `OFF-${randomId}`,
        item_name: manualForm.item_name,
        quantity: qty,
        remaining_quantity: qty,
        status: manualForm.status,
        created_at: new Date().toLocaleString("en-IN"),
        received_at: manualForm.status === "Received" ? new Date().toLocaleString("en-IN") : null,
        isOffline: true,
        target_branch_id: manualForm.target_branch_id,
        target_billing_user_id: manualForm.target_billing_user_id,
        target_branch_name: targetBranchName,
        target_user_name: targetUserName
      };

      const updated = [newVoucher, ...offlineVouchers];
      saveOfflineVouchers(updated);
      setManualDialogOpen(false);
      setManualForm({ item_name: "", quantity: "", status: "Pending", target_branch_id: "", target_billing_user_id: "" });
      alert("Offline Mode: Receiving stock added locally! ✅");
      return;
    }

    // Online mode: save to database
    try {
      const response = await axiosInstance.post("/vouchers/create", {
        item_name: manualForm.item_name,
        quantity: qty,
        status: manualForm.status,
        target_branch_id: manualForm.target_branch_id || undefined,
        target_billing_user_id: manualForm.target_billing_user_id || undefined
      });
      if (response && response.success) {
        alert("Receiving stock created successfully! ✅");
        setManualDialogOpen(false);
        setManualForm({ item_name: "", quantity: "", status: "Pending", target_branch_id: "", target_billing_user_id: "" });
        fetchVouchers();
      } else {
        alert("Failed to create receiving stock: " + (response.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error creating receiving stock. Saving offline instead.");
      // Fallback
      const randomId = Math.floor(100000 + Math.random() * 900000);
      const newVoucher = {
        id: `OFF-${randomId}`,
        item_name: manualForm.item_name,
        quantity: qty,
        remaining_quantity: qty,
        status: manualForm.status,
        created_at: new Date().toLocaleString("en-IN"),
        received_at: manualForm.status === "Received" ? new Date().toLocaleString("en-IN") : null,
        isOffline: true,
      };
      saveOfflineVouchers([newVoucher, ...offlineVouchers]);
      setManualDialogOpen(false);
      setManualForm({ item_name: "", quantity: "", status: "Pending", target_branch_id: "", target_billing_user_id: "" });
    }
  };

  const handleOpenAssignModal = (voucher) => {
    setAssignForm({
      source_voucher_id: voucher.id,
      target_branch_id: "",
      target_billing_user_id: "",
      forward_quantity: "",
      max_quantity: Number(voucher.remaining_quantity),
      item_name: voucher.item_name
    });
    setAssignDialogOpen(true);
  };

  const handleAssignStock = async () => {
    if (!assignForm.target_branch_id || !assignForm.forward_quantity) {
      alert("Please select a branch and enter quantity to assign.");
      return;
    }

    const qty = Number(assignForm.forward_quantity);
    if (isNaN(qty) || qty <= 0 || qty > assignForm.max_quantity) {
      alert(`Quantity must be between 1 and ${assignForm.max_quantity}`);
      return;
    }

    try {
      const response = await axiosInstance.post("/vouchers/forward", {
        source_voucher_id: assignForm.source_voucher_id,
        target_branch_id: assignForm.target_branch_id,
        target_billing_user_id: assignForm.target_billing_user_id,
        forward_quantity: qty
      });

      if (response && response.success) {
        alert("Stock assigned successfully!");
        setAssignDialogOpen(false);
        fetchVouchers(); // Refresh list to get updated remaining quantities
      } else {
        alert("Failed to assign stock: " + (response.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error assigning stock. Please try again.");
    }
  };

  const fetchVouchers = async () => {
    if (!isOnline) return;
    setLoading(true);
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/vouchers/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setVouchers(data.data);
      }
    } catch (err) {
      console.error("Error fetching vouchers:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadOfflineVouchers = () => {
    const saved = localStorage.getItem("offline_vouchers");
    if (saved) {
      try {
        setOfflineVouchers(JSON.parse(saved));
      } catch (e) {
        setOfflineVouchers([]);
      }
    } else {
      setOfflineVouchers([]);
    }
  };

  // Save offline vouchers back to localStorage
  const saveOfflineVouchers = (updatedList) => {
    localStorage.setItem("offline_vouchers", JSON.stringify(updatedList));
    setOfflineVouchers(updatedList);
  };

  // Download CSV Template
  const handleDownloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,item_name,quantity\nSamosa,200\nPakodi,150\nGunjiya,50\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "voucher_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Upload and Parse CSV
  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split(/\r?\n/);
      if (lines.length < 2) {
        alert("File has no data or headers.");
        return;
      }

      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const nameIdx = headers.indexOf("item_name");
      const qtyIdx = headers.indexOf("quantity");

      if (nameIdx === -1 || qtyIdx === -1) {
        alert("Incorrect CSV headers. Headers must include 'item_name' and 'quantity'.");
        return;
      }

      const imported = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const cols = line.split(",").map((c) => c.trim().replace(/^["']|["']$/g, ""));
        if (cols.length <= Math.max(nameIdx, qtyIdx)) continue;

        const name = cols[nameIdx];
        const qty = parseFloat(cols[qtyIdx]);

        if (name && !isNaN(qty) && qty > 0) {
          imported.push({
            item_name: name,
            quantity: qty,
            remaining_quantity: qty,
            status: "Received", // Default imported vouchers to Received
            created_at: new Date().toLocaleString("en-IN"),
            received_at: new Date().toLocaleString("en-IN"),
          });
        }
      }

      if (imported.length === 0) {
        alert("No valid rows found in the file.");
        return;
      }

      if (!isOnline) {
        // Offline Mode: Add to local storage
        const currentOffline = [...offlineVouchers];
        // Add fake temporary IDs for UI tracking
        const startId = Date.now();
        const mapped = imported.map((v, index) => ({
          ...v,
          id: `OFF-${startId + index}`,
          isOffline: true,
        }));
        const updatedOffline = [...mapped, ...currentOffline];
        saveOfflineVouchers(updatedOffline);
        alert(`Offline Mode: ${mapped.length} receiving stocks imported and stored locally! ✅`);
      } else {
        // Online Mode: Bulk post to backend
        const token = localStorage.getItem("authToken");
        try {
          const res = await fetch("http://localhost:5000/api/vouchers/import", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ vouchers: imported }),
          });
          const data = await res.json();
          if (data.success) {
            alert(`Online Mode: ${imported.length} receiving stocks imported successfully! ✅`);
            fetchVouchers();
          } else {
            alert(`Failed to import receiving stocks: ${data.message}`);
          }
        } catch (err) {
          console.error("Upload error:", err);
          alert("Network error. Saving to local storage instead.");
          // Fallback to offline storage
          const startId = Date.now();
          const mapped = imported.map((v, index) => ({
            ...v,
            id: `OFF-${startId + index}`,
            isOffline: true,
          }));
          saveOfflineVouchers([...mapped, ...offlineVouchers]);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = null; // Reset input file
  };

  // Sync offline vouchers when back online
  const handleSyncOffline = async () => {
    if (!isOnline || offlineVouchers.length === 0) return;
    setSyncing(true);
    const token = localStorage.getItem("authToken");

    try {
      let successCount = 0;
      let errorMsgs = [];
      
      for (const v of offlineVouchers) {
        try {
          const res = await axiosInstance.post("/vouchers/create", {
            item_name: v.item_name,
            quantity: v.quantity,
            status: v.status || "Pending",
            target_branch_id: v.target_branch_id || undefined,
            target_billing_user_id: v.target_billing_user_id || undefined
          });
          if (res && res.success) {
            successCount++;
          } else {
            errorMsgs.push(res.message || "Unknown Error");
          }
        } catch(e) {
          errorMsgs.push(e.message);
        }
      }

      if (successCount === offlineVouchers.length) {
        alert("Offline receiving stocks synced successfully with server! 🚀");
        localStorage.removeItem("offline_vouchers");
        setOfflineVouchers([]);
        fetchVouchers();
      } else if (successCount > 0) {
        alert(`Partially synced. ${successCount} succeeded. Errors: ${errorMsgs[0]}`);
        // Remove synced ones ideally, but for now just clear all if some succeeded, or don't.
        localStorage.removeItem("offline_vouchers");
        setOfflineVouchers([]);
        fetchVouchers();
      } else {
        alert(`Failed to sync: ${errorMsgs[0]}`);
      }
    } catch (err) {
      console.error("Sync error:", err);
      alert("Failed to sync offline receiving stocks. Please try again later.");
    } finally {
      setSyncing(false);
    }
  };

  // Toggle Voucher status to Received
  const handleReceiveVoucher = async (voucher, targetStatus = "Received") => {
    if (voucher.isOffline) {
      // For offline vouchers, update locally in state
      const updated = offlineVouchers.map((v) => {
        if (v.id === voucher.id) {
          const now = new Date().toLocaleString("en-IN");
          const updatedVoucher = { ...v, status: "Received", received_at: now };
          // Print voucher slip immediately
          printVoucherSlip(updatedVoucher);
          return updatedVoucher;
        }
        return v;
      });
      saveOfflineVouchers(updated);
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/vouchers/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: voucher.id,
          status: targetStatus
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Print voucher slip immediately
        const nowStr = new Date().toLocaleString("en-IN");
        printVoucherSlip({
          ...voucher,
          status: "Received",
          received_at: nowStr,
        });

        // Refresh online vouchers list
        fetchVouchers();
      } else {
        alert(`Failed to update status: ${data.message}`);
      }
    } catch (err) {
      console.error("Update status error:", err);
      alert("Error updating status. Please check connection.");
    }
  };

  // Filter vouchers based on search term
  const allVouchers = [...offlineVouchers, ...vouchers];
  const filteredVouchers = allVouchers.filter((v) =>
    v.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(v.id).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box p={3} bgcolor="#F1F5F9" minHeight="100vh">
      {/* HEADER BAR */}
      <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Box>
            <Typography variant="h4" fontWeight={900} color="#1E293B">
              🏷️ Production Vouchers
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Generate vouchers to assign produced items to specific branches
            </Typography>
          </Box>

          {/* ONLINE/OFFLINE STATUS CHIP */}
          <Chip
            icon={isOnline ? <WifiIcon /> : <WifiOffIcon />}
            label={isOnline ? "Online Mode" : "Offline Mode"}
            color={isOnline ? "success" : "warning"}
            sx={{ fontWeight: 700, px: 1 }}
          />
        </Stack>
      </Paper>

      {/* OFFLINE ACTIONS ALERT */}
      {offlineVouchers.length > 0 && isOnline && (
        <Alert
          severity="info"
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={syncing ? <CircularProgress size={16} color="inherit" /> : <SyncIcon />}
              onClick={handleSyncOffline}
              disabled={syncing}
              sx={{ fontWeight: 700 }}
            >
              Sync Now
            </Button>
          }
          sx={{ mb: 3, borderRadius: 3, fontWeight: 600 }}
        >
          You have {offlineVouchers.length} offline receiving stock(s) stored on this device. Click Sync to upload them to the server.
        </Alert>
      )}

      {/* CONTROLS AREA */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={5}>
          {/* SEARCH BAR */}
          <TextField
            fullWidth
            placeholder="Search by Receiving ID or Item Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
            sx={{
              bgcolor: "white",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": { borderRadius: 3 },
            }}
          />
        </Grid>

        <Grid item xs={12} md={7}>
          {/* ACTION BUTTONS */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="flex-end">
            {/* Voucher Details Button */}
            <Button
              variant="outlined"
              startIcon={<ListAltIcon />}
              onClick={handleOpenDetails}
              sx={{
                borderRadius: 3,
                fontWeight: 600,
                textTransform: "none",
                color: "#2563EB",
                borderColor: "#BFDBFE",
                bgcolor: "#EFF6FF",
                "&:hover": { bgcolor: "#DBEAFE", borderColor: "#93C5FD" },
              }}
            >
              Voucher Details
            </Button>

            <Button
              variant="outlined"
              color="primary"
              startIcon={<GetAppIcon />}
              onClick={handleDownloadTemplate}
              sx={{
                borderRadius: 3,
                fontWeight: 700,
                textTransform: "none",
                borderColor: "#3B82F6",
                "&:hover": { borderWidth: 2 },
              }}
            >
              Excel Template
            </Button>

            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{
                borderRadius: 3,
                fontWeight: 700,
                textTransform: "none",
                bgcolor: "#2563EB",
                "&:hover": { bgcolor: "#1D4ED8" },
              }}
            >
              Import Excel/CSV
              <input type="file" accept=".csv" hidden onChange={handleImportCSV} />
            </Button>

            <Button
              variant="contained"
              onClick={() => {
                fetchItems();
                setManualDialogOpen(true);
              }}
              sx={{
                borderRadius: 3,
                fontWeight: 700,
                textTransform: "none",
                bgcolor: "#8B5CF6",
                color: "white",
                "&:hover": { bgcolor: "#7C3AED" },
              }}
            >
              Generate Voucher
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* VOUCHERS TABLE */}
      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={8}>
            <CircularProgress color="primary" />
            <Typography variant="body1" sx={{ ml: 2, color: "text.secondary", fontWeight: 600 }}>
              Loading records...
            </Typography>
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: "#F8FAFC" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: "#475569" }}>Receiving ID</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#475569" }}>Item Name</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#475569" }} align="center">Unit</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#475569" }}>Branch / Inventory</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#475569" }}>Billing Account</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#475569" }} align="center">Original Qty</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#475569" }} align="center">Remaining Qty</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#475569" }} align="center">Status</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#475569" }}>Date/Time</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#475569" }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredVouchers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    No records found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredVouchers.map((voucher) => {
                  const canReceive = voucher.can_receive !== 0; // default true if undefined
                  const isFullySold = Number(voucher.remaining_quantity) === 0;
                  const roleLower = (userRole || "").toLowerCase();
                  const isInventoryRole = roleLower.includes("inventory");
                  const isBillingRole = roleLower.includes("billing");
                  const hasBillingAccount = !!voucher.target_user_name;

                  let showInventoryReceive = false;
                  let showBillingReceive = false;
                  let showPrint = false;
                  let pendingBillingChip = false;

                  if (canReceive) {
                    if (voucher.status === "Pending") {
                      if (isInventoryRole) showInventoryReceive = true;
                      else if (isBillingRole) pendingBillingChip = true;
                    } else if (voucher.status === "Inventory Received") {
                      if (isInventoryRole) showPrint = true;
                      else if (isBillingRole) showBillingReceive = true;
                    } else if (voucher.status === "Received") {
                      showPrint = true;
                    }
                  }

                  return (
                    <TableRow
                      key={voucher.id}
                      hover
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        bgcolor: voucher.isOffline ? "#FEF9C3" : "inherit", // Highlight offline rows
                      }}
                    >
                      {/* Receiving ID */}
                      <TableCell sx={{ fontWeight: 700, color: "#1E293B" }}>
                        REC-{voucher.id}
                        {voucher.isOffline && (
                          <Chip label="Local" size="small" color="warning" sx={{ ml: 1, height: 18, fontSize: 10, fontWeight: 700 }} />
                        )}
                      </TableCell>

                      {/* Item Name */}
                      <TableCell sx={{ fontWeight: 600, color: "#334155" }}>
                        {voucher.item_name}
                      </TableCell>

                      {/* Unit */}
                      <TableCell align="center" sx={{ fontWeight: 600, color: "#64748B" }}>
                        {voucher.unit || '-'}
                      </TableCell>

                      {/* Branch / Inventory */}
                      <TableCell sx={{ fontWeight: 600, color: "#334155" }}>
                        {!canReceive ? (
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <span>{voucher.target_branch_name}</span>
                            <Chip label="Stock Transfer" size="small" color="primary" variant="outlined" sx={{ height: 18, fontSize: 10, fontWeight: 700 }} />
                          </Stack>
                        ) : (
                          voucher.target_branch_name || "Self"
                        )}
                      </TableCell>

                      {/* Billing Account */}
                      <TableCell sx={{ fontWeight: 600, color: "#475569" }}>
                        {voucher.target_user_name || "-"}
                      </TableCell>

                      {/* Original Qty */}
                      <TableCell align="center" sx={{ fontWeight: 600 }}>
                        {voucher.quantity}
                      </TableCell>

                      {/* Remaining Qty */}
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: 700,
                          color: isFullySold ? "#EF4444" : "#10B981",
                          textDecoration: isFullySold ? "line-through" : "none",
                        }}
                      >
                        {voucher.remaining_quantity}
                        {isFullySold && (
                          <Chip label="Sold Out" size="small" color="error" variant="outlined" sx={{ ml: 1, height: 18, fontSize: 9, fontWeight: 800 }} />
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell align="center">
                        <Chip
                          label={voucher.status}
                          color={voucher.status === "Received" ? "success" : voucher.status === "Inventory Received" ? "info" : "warning"}
                          variant="outlined"
                          sx={{ fontWeight: 800, textTransform: "uppercase" }}
                        />
                      </TableCell>

                      {/* Date/Time */}
                      <TableCell sx={{ color: "#64748B", fontSize: 13 }}>
                        {voucher.status === "Received" || voucher.status === "Inventory Received" ? voucher.received_at || voucher.created_at : voucher.created_at}
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          {userRole === "Inventory (Central)" && Number(voucher.remaining_quantity) > 0 && voucher.status !== "Stock Forwarded" && (
                            <Button
                              variant="contained"
                              color="info"
                              size="small"
                              onClick={() => handleOpenAssignModal(voucher)}
                              sx={{ borderRadius: 2, fontWeight: 700, textTransform: "none" }}
                            >
                              Assign Stock
                            </Button>
                          )}

                          {showInventoryReceive && (
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<CheckCircleIcon />}
                              onClick={() => handleReceiveVoucher(voucher, hasBillingAccount ? "Inventory Received" : "Received")}
                              sx={{ borderRadius: 2, fontWeight: 700, textTransform: "none" }}
                            >
                              Receive & Bill
                            </Button>
                          )}

                          {showBillingReceive && (
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<CheckCircleIcon />}
                              onClick={() => handleReceiveVoucher(voucher, "Received")}
                              sx={{ borderRadius: 2, fontWeight: 700, textTransform: "none" }}
                            >
                              Receive
                            </Button>
                          )}

                          {pendingBillingChip && (
                            <Chip label="Waiting for Inventory" color="warning" size="small" sx={{ fontWeight: 600 }} />
                          )}

                          {!canReceive && voucher.status === "Pending" && (
                            <Chip label="Sent to Target" color="info" size="small" sx={{ fontWeight: 600 }} />
                          )}

                          {showPrint && (
                            <IconButton
                              color="primary"
                              onClick={() => printVoucherSlip(voucher)}
                              title="Print Receipt"
                            >
                              <PrintIcon />
                            </IconButton>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* MANUAL ADD DIALOG */}
      <Dialog
        open={manualDialogOpen}
        onClose={() => setManualDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#1E293B" }}>
          ➕ Generate Production Voucher
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Stack spacing={3} mt={1}>
            <FormControl fullWidth>
              <InputLabel>Select Item</InputLabel>
              <Select
                value={manualForm.item_name}
                label="Select Item"
                onChange={(e) => setManualForm({ ...manualForm, item_name: e.target.value })}
              >
                {itemsList.map((item) => (
                  <MenuItem key={item.id} value={item.name}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Quantity"
              type="number"
              fullWidth
              value={manualForm.quantity}
              onChange={(e) => setManualForm({ ...manualForm, quantity: e.target.value })}
            />

              <FormControl fullWidth>
                <InputLabel>Branch</InputLabel>
                <Select
                  value={manualForm.target_branch_id}
                  label="Branch"
                  onChange={(e) => {
                    const branchId = e.target.value;
                    const relatedUser = billingUsers.find(u => u.branch_id === branchId);
                    setManualForm({ 
                      ...manualForm, 
                      target_branch_id: branchId,
                      target_billing_user_id: relatedUser ? relatedUser.id : ""
                    });
                  }}
                >
                  {branches.map((b) => (
                    <MenuItem key={b.branch_id} value={b.branch_id}>
                      {b.branch_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Billing Account</InputLabel>
                <Select
                  value={manualForm.target_billing_user_id}
                  label="Billing Account"
                  onChange={(e) => {
                    const selectedUserId = e.target.value;
                    const selectedUser = billingUsers.find(u => u.id === selectedUserId);
                    setManualForm({ 
                      ...manualForm, 
                      target_billing_user_id: selectedUserId,
                      target_branch_id: selectedUser ? selectedUser.branch_id : ""
                    });
                  }}
                >
                  {billingUsers.map((u) => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.name} ({u.email}) - {u.branch_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={manualForm.status}
                  label="Status"
                  onChange={(e) => setManualForm({ ...manualForm, status: e.target.value })}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Received">Received</MenuItem>
                </Select>
              </FormControl>
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2, bgcolor: "#F8FAFC" }}>
          <Button
            onClick={() => setManualDialogOpen(false)}
            variant="outlined"
            sx={{ textTransform: "none", color: "#64748B", borderColor: "#CBD5E1", borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveManualVoucher}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Generate Voucher
          </Button>
        </DialogActions>
      </Dialog>

      {/* SENT VOUCHERS DETAILS DIALOG */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#1E293B", display: "flex", alignItems: "center", gap: 1 }}>
          <ListAltIcon color="primary" /> Voucher Details (Branch-wise)
        </DialogTitle>
        <Divider />
        <DialogContent>
          {loadingDetails ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : sentVouchersDetails.length === 0 ? (
            <Typography textAlign="center" color="text.secondary" py={4}>
              No vouchers have been generated yet.
            </Typography>
          ) : (
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#F8FAFC" }}>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Branch / Inventory</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Billing Account</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Item Name</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: "#475569" }}>Total Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sentVouchersDetails.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {!row.is_self ? (
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <span>{row.target_branch}</span>
                            <Chip label="Stock Transfer" size="small" color="primary" variant="outlined" sx={{ height: 18, fontSize: 10, fontWeight: 700 }} />
                          </Stack>
                        ) : (
                          row.target_branch
                        )}
                      </TableCell>
                      <TableCell>{row.target_user_name || "-"}</TableCell>
                      <TableCell>{row.item_name}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: "#0F172A" }}>
                        {Number(row.total_quantity).toLocaleString("en-IN")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDetailsDialogOpen(false)} variant="outlined" sx={{ borderRadius: 2, textTransform: "none" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ASSIGN STOCK DIALOG */}
      <Dialog
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#1E293B" }}>
          📤 Assign Stock ({assignForm.item_name})
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Stack spacing={3} mt={1}>
            <FormControl fullWidth>
              <InputLabel>Target Branch</InputLabel>
              <Select
                value={assignForm.target_branch_id}
                label="Target Branch"
                onChange={(e) => {
                  const branchId = e.target.value;
                  const relatedUser = billingUsers.find(u => u.branch_id === branchId);
                  setAssignForm({ 
                    ...assignForm, 
                    target_branch_id: branchId,
                    target_billing_user_id: relatedUser ? relatedUser.id : ""
                  });
                }}
              >
                {branches.map((b) => (
                  <MenuItem key={b.branch_id} value={b.branch_id}>
                    {b.branch_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Target Billing Account</InputLabel>
              <Select
                value={assignForm.target_billing_user_id}
                label="Target Billing Account"
                onChange={(e) => {
                  const selectedUserId = e.target.value;
                  const selectedUser = billingUsers.find(u => u.id === selectedUserId);
                  setAssignForm({ 
                    ...assignForm, 
                    target_billing_user_id: selectedUserId,
                    target_branch_id: selectedUser ? selectedUser.branch_id : ""
                  });
                }}
              >
                {billingUsers.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.name} ({u.email}) - {u.branch_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Quantity to Forward"
              type="number"
              fullWidth
              value={assignForm.forward_quantity}
              onChange={(e) => setAssignForm({ ...assignForm, forward_quantity: e.target.value })}
              helperText={`Available to assign: ${assignForm.max_quantity}`}
            />
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2, bgcolor: "#F8FAFC" }}>
          <Button
            onClick={() => setAssignDialogOpen(false)}
            variant="outlined"
            sx={{ textTransform: "none", color: "#64748B", borderColor: "#CBD5E1", borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssignStock}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Forward Stock
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductionVouchers;
