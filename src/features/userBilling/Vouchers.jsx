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
import useOnlineStatus from "../../hooks/useOnlineStatus";

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

const Vouchers = () => {
  const isOnline = useOnlineStatus();
  const [vouchers, setVouchers] = useState([]);
  const [offlineVouchers, setOfflineVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [syncing, setSyncing] = useState(false);

  const [itemsList, setItemsList] = useState([]);
  const [manualDialogOpen, setManualDialogOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    item_name: "",
    quantity: "",
    status: "Pending",
  });

  // Load vouchers on mount / online status change
  useEffect(() => {
    fetchVouchers();
    loadOfflineVouchers();
    fetchItems();
  }, [isOnline]);

  const fetchItems = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/item/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setItemsList(data.data);
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

      const updated = [newVoucher, ...offlineVouchers];
      saveOfflineVouchers(updated);
      setManualDialogOpen(false);
      setManualForm({ item_name: "", quantity: "", status: "Pending" });
      alert("Offline Mode: Receiving stock added locally! ✅");
      return;
    }

    // Online mode: save to database
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch("http://localhost:5000/api/vouchers/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          item_name: manualForm.item_name,
          quantity: qty,
          status: manualForm.status,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Receiving stock created successfully! ✅");
        setManualDialogOpen(false);
        setManualForm({ item_name: "", quantity: "", status: "Pending" });
        fetchVouchers();
      } else {
        alert("Failed to create receiving stock: " + data.message);
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
      setManualForm({ item_name: "", quantity: "", status: "Pending" });
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
      // Map back to format backend expects
      const payload = offlineVouchers.map((v) => ({
        item_name: v.item_name,
        quantity: v.quantity,
        status: v.status || "Received",
      }));

      const res = await fetch("http://localhost:5000/api/vouchers/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vouchers: payload }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Offline receiving stocks synced successfully with server! 🚀");
        localStorage.removeItem("offline_vouchers");
        setOfflineVouchers([]);
        fetchVouchers();
      } else {
        alert(`Failed to sync: ${data.message}`);
      }
    } catch (err) {
      console.error("Sync error:", err);
      alert("Failed to sync offline receiving stocks. Please try again later.");
    } finally {
      setSyncing(false);
    }
  };

  // Toggle Voucher status to Received
  const handleReceiveVoucher = async (voucher) => {
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
          status: "Received",
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
              🎫 Receiving Stock Management
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Verify, receive and track finished production items
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
              Add Receiving Stock Manually
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
                  <TableCell colSpan={8} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    No records found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredVouchers.map((voucher) => {
                  const isPending = voucher.status === "Pending";
                  const isReceived = voucher.status === "Received";
                  const isFullySold = Number(voucher.remaining_quantity) === 0;

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
                          color={isReceived ? "success" : "warning"}
                          variant="outlined"
                          sx={{ fontWeight: 800, textTransform: "uppercase" }}
                        />
                      </TableCell>

                      {/* Date/Time */}
                      <TableCell sx={{ color: "#64748B", fontSize: 13 }}>
                        {isReceived ? voucher.received_at || voucher.created_at : voucher.created_at}
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          {isPending && (
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<CheckCircleIcon />}
                              onClick={() => handleReceiveVoucher(voucher)}
                              sx={{
                                borderRadius: 2,
                                fontWeight: 700,
                                textTransform: "none",
                              }}
                            >
                              Receive
                            </Button>
                          )}

                          {isReceived && (
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
          ➕ Add Receiving Stock Manually
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
            Save Receiving Stock
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Vouchers;
