import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Switch,
  FormControlLabel,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { getAreasList, getTablesList, updateTable } from "@services/api/diningAPI";
import axiosInstance from "@services/api/axios-config";

const TABLE_STATUSES = {
  available:   { label: "Blank Table",       bg: "#F8FAFC", border: "1px dashed #CBD5E1", text: "#64748B", legend: "#E2E8F0" },
  running:     { label: "Running Table",     bg: "#DBEAFE", border: "1px solid #93C5FD",  text: "#1E40AF", legend: "#BFDBFE" },
  printed:     { label: "Printed Table",     bg: "#DCFCE7", border: "1px solid #86EFAC",  text: "#166534", legend: "#BBF7D0" },
  paid:        { label: "Paid Table",        bg: "#FEF3C7", border: "1px solid #FCD34D",  text: "#92400E", legend: "#FDE68A" },
  running_kot: { label: "Running KOT Table", bg: "#FEF9C3", border: "1px solid #FDE047",  text: "#854D0E", legend: "#FEF08A" },
};

const STATUS_FILTERS = [
  { key: null,          label: "All Tables",        legend: "#E2E8F0" },
  { key: "available",   label: "Blank Table",       legend: TABLE_STATUSES.available.legend },
  { key: "running",     label: "Running Table",     legend: TABLE_STATUSES.running.legend },
  { key: "printed",     label: "Printed Table",     legend: TABLE_STATUSES.printed.legend },
  { key: "paid",        label: "Paid Table",        legend: TABLE_STATUSES.paid.legend },
  { key: "running_kot", label: "Running KOT Table", legend: TABLE_STATUSES.running_kot.legend },
];

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const S = {
  root: {
    padding: "14px 18px",
    background: "#fff",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    boxSizing: "border-box",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    flexWrap: "wrap",
    gap: 8,
  },
  titleArea: { display: "flex", alignItems: "center", gap: 8 },
  title: { fontSize: 20, fontWeight: 700, color: "#1E293B" },
  btnGroup: { display: "flex", gap: 6, flexWrap: "wrap" },
  actionBtn: (color) => ({
    background: color,
    color: "#fff",
    textTransform: "none",
    fontWeight: 700,
    borderRadius: 6,
    padding: "5px 14px",
    fontSize: 12,
    boxShadow: "none",
    minWidth: 0,
    "&:hover": {
      background: color === "#c0392b" ? "#a0281b" : "#163070",
      boxShadow: "none",
    },
  }),
  legendRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderTop: "1px solid #E2E8F0",
    borderBottom: "1px solid #E2E8F0",
    padding: "8px 0",
    marginBottom: 12,
    flexWrap: "wrap",
    gap: 8,
  },
  legends: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" },
  legendItem: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    fontWeight: active ? 800 : 600,
    color: "#475569",
    cursor: "pointer",
    padding: "3px 8px",
    borderRadius: 6,
    border: active ? "1px solid #94A3B8" : "1px solid transparent",
    background: active ? "#F1F5F9" : "transparent",
    userSelect: "none",
    transition: "all 0.15s ease",
  }),
  legendCircle: (color) => ({
    width: 12,
    height: 12,
    borderRadius: "50%",
    background: color,
    border: "1px solid #CBD5E1",
    flexShrink: 0,
  }),
  areaTabBar: {
    display: "flex",
    gap: 6,
    marginBottom: 14,
    borderBottom: "2px solid #E2E8F0",
    paddingBottom: 6,
    overflowX: "auto",
  },
  areaTab: (active) => ({
    padding: "5px 14px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    background: active ? "#c0392b" : "#F1F5F9",
    color: active ? "#fff" : "#475569",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    userSelect: "none",
    border: "none",
  }),
  sectionHeading: {
    fontSize: 14,
    fontWeight: 800,
    color: "#334155",
    marginBottom: 10,
    marginTop: 6,
    display: "flex",
    alignItems: "center",
    gap: 0,
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))",
    gap: 8,
    maxWidth: "100%",
    marginBottom: 18,
  },
  tableCard: (status, isMoveMode) => {
    const cfg = TABLE_STATUSES[status] || TABLE_STATUSES.available;
    const occupied = status !== "available";
    return {
      position: "relative",
      width: "100%",
      aspectRatio: "1 / 1",
      minHeight: 72,
      maxWidth: 90,
      background: cfg.bg,
      border: cfg.border,
      borderRadius: 8,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: occupied ? "space-between" : "center",
      padding: occupied ? "5px 4px 4px" : "8px 4px",
      cursor: "pointer",
      boxSizing: "border-box",
      transition: "transform 0.12s ease, box-shadow 0.12s ease",
      outline: isMoveMode ? "2px dashed #c0392b" : "none",
      outlineOffset: isMoveMode ? "1px" : "0",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
      },
    };
  },
  cardTime:   (s) => ({ fontSize: 9,  fontWeight: 700, color: (TABLE_STATUSES[s] || TABLE_STATUSES.available).text, lineHeight: 1.2, textAlign: "center", width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }),
  cardNumber: (s) => ({ fontSize: 20, fontWeight: 800, color: (TABLE_STATUSES[s] || TABLE_STATUSES.available).text, lineHeight: 1,   textAlign: "center" }),
  cardPrice:  (s) => ({ fontSize: 9,  fontWeight: 700, color: (TABLE_STATUSES[s] || TABLE_STATUSES.available).text, lineHeight: 1.2, textAlign: "center", width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }),
  cardSaveIcon: { display: "flex", alignItems: "center", justifyContent: "center", marginTop: -2 },
  vacantBadge: {
    marginLeft: 8,
    background: "#ECFDF5",
    border: "1px solid #A7F3D0",
    color: "#047857",
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  noTablesMsg: {
    padding: "40px 0",
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 13,
  },
};

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const sortTables = (list) =>
  [...list].sort((a, b) => {
    const na = parseInt(a.table_number, 10);
    const nb = parseInt(b.table_number, 10);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
    return String(a.table_number).localeCompare(String(b.table_number), undefined, { numeric: true });
  });

/* ─── Component ───────────────────────────────────────────────────────────── */
const BillingTableView = () => {
  const navigate = useNavigate();

  const [areas,  setAreas]  = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [moveKOT, setMoveKOT] = useState(false);
  const [statusFilter,   setStatusFilter]   = useState(null);
  const [selectedAreaId, setSelectedAreaId] = useState("all");
  const [tick, setTick] = useState(0);

  const [detailsDialogOpen,    setDetailsDialogOpen]    = useState(false);
  const [selectedTable,        setSelectedTable]        = useState(null);
  const [selectedTableInvoice, setSelectedTableInvoice] = useState(null);
  const [dialogLoading,        setDialogLoading]        = useState(false);
  const [overrideStatus,       setOverrideStatus]       = useState("available");

  /* auto-refresh every 5 s */
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    const token = localStorage.getItem("authToken");
    if (!token) { if (!silent) setLoading(false); return; }
    try {
      const [areasRes, tablesRes] = await Promise.all([getAreasList(), getTablesList()]);
      if (areasRes?.success)  setAreas(areasRes.data   || []);
      if (tablesRes?.success) setTables(tablesRes.data || []);
    } catch (e) {
      console.error("Error loading Table View data:", e);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); },               [fetchData]);
  useEffect(() => { if (tick > 0) fetchData(true); }, [tick, fetchData]);

  /* status counts for legend badges */
  const statusCounts = useMemo(() => {
    const counts = { all: tables.length };
    Object.keys(TABLE_STATUSES).forEach((k) => {
      counts[k] = tables.filter((t) => t.status === k).length;
    });
    return counts;
  }, [tables]);

  /* ── KEY FIX: only show areas that actually have tables after filtering ── */
  const groupedTables = useMemo(() => {
    let filtered = [...tables];
    if (statusFilter) filtered = filtered.filter((t) => t.status === statusFilter);
    if (selectedAreaId !== "all") filtered = filtered.filter((t) => Number(t.area_id) === Number(selectedAreaId));

    const activeAreas = areas.filter((a) => a.status !== "inactive");

    return activeAreas
      .map((area) => {
        const areaTables      = sortTables(filtered.filter((t) => Number(t.area_id) === Number(area.id)));
        const totalAreaTables = sortTables(tables.filter((t)  => Number(t.area_id) === Number(area.id)));
        const freeCount       = totalAreaTables.filter((t) => t.status === "available").length;
        return {
          id:         area.id,
          area_name:  area.area_name,
          tables:     areaTables,
          totalCount: totalAreaTables.length,
          freeCount,
        };
      })
      /* ✅ Hide any area with zero tables after filter is applied */
      .filter((g) => g.tables.length > 0);
  }, [tables, areas, statusFilter, selectedAreaId]);

  /* ── Helpers ── */
  const getElapsedMinutes = (timestamp) => {
    if (!timestamp) return "";
    const diffMins = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
    return `${diffMins} Min`;
  };

  const isOccupied = (table) => table.status !== "available";

  /* ── Handlers ── */
  const handleTableClick = async (table) => {
    if (moveKOT) {
      alert("Move KOT / Items mode: Select source and target table to transfer.");
      return;
    }
    setSelectedTable(table);
    setOverrideStatus(table.status);
    setDetailsDialogOpen(true);

    if (table.active_invoice_number) {
      setDialogLoading(true);
      try {
        const json = await axiosInstance.get(`/invoices/details/${table.active_invoice_number}`);
        if (json?.success) setSelectedTableInvoice(json.data);
        else setSelectedTableInvoice(null);
      } catch (err) {
        console.error("Error fetching invoice details:", err);
        setSelectedTableInvoice(null);
      } finally {
        setDialogLoading(false);
      }
    } else {
      setSelectedTableInvoice(null);
    }
  };

  const handleStatusOverride = async (newStatus) => {
    setOverrideStatus(newStatus);
    if (!selectedTable) return;
    try {
      if (selectedTableInvoice && newStatus !== "available") {
        await axiosInstance.put(`/invoices/update-status/${selectedTableInvoice.invoice_number}`, { status: newStatus });
      } else {
        await updateTable(selectedTable.id, {
          area_id:      selectedTable.area_id,
          table_number: selectedTable.table_number,
          table_name:   selectedTable.table_name,
          capacity:     selectedTable.capacity,
          status:       newStatus,
          notes:        selectedTable.notes,
        });
      }
      setDetailsDialogOpen(false);
      fetchData(true);
    } catch (e) {
      console.error("Error overriding table status:", e);
      alert("Failed to update status.");
    }
  };

  const handlePrintBill = async () => {
    if (!selectedTableInvoice) return;
    try {
      const json = await axiosInstance.put(`/invoices/update-status/${selectedTableInvoice.invoice_number}`, { status: "printed" });
      if (json?.success) { setDetailsDialogOpen(false); fetchData(true); }
    } catch (err) { console.error(err); }
  };

  const handleSettlePayment = async () => {
    if (!selectedTableInvoice) return;
    try {
      const json = await axiosInstance.put(`/invoices/update-status/${selectedTableInvoice.invoice_number}`, { status: "paid" });
      if (json?.success) {
        alert(`Table #${selectedTable.table_number} marked as Paid. Clear table when guests leave.`);
        setDetailsDialogOpen(false);
        fetchData(true);
      }
    } catch (err) { console.error(err); }
  };

  const handleClearTable = async () => {
    if (!selectedTable) return;
    try {
      await updateTable(selectedTable.id, {
        area_id:      selectedTable.area_id,
        table_number: selectedTable.table_number,
        table_name:   selectedTable.table_name,
        capacity:     selectedTable.capacity,
        status:       "available",
        notes:        selectedTable.notes,
      });
      setDetailsDialogOpen(false);
      fetchData(true);
    } catch (e) {
      console.error(e);
      alert("Failed to clear table.");
    }
  };

  const handleNewOrder = () => {
    setDetailsDialogOpen(false);
    navigate(`/billing/items?table_id=${selectedTable.id}&table_number=${selectedTable.table_number}&order_type=Dine In`);
  };

  const handleEditOrder = () => {
    setDetailsDialogOpen(false);
    navigate(`/billing/items?table_id=${selectedTable.id}&table_number=${selectedTable.table_number}&order_type=Dine In`);
  };

  /* ── Card renderer ── */
  const renderTableCard = (table) => {
    const occupied    = isOccupied(table);
    const elapsed     = getElapsedMinutes(table.active_invoice_created_at);
    const amount      = Number(table.active_invoice_amount || 0);
    const showSaveIcon = table.status === "printed" || table.status === "paid";

    return (
      <Box
        key={table.id}
        sx={S.tableCard(table.status, moveKOT)}
        onClick={() => handleTableClick(table)}
        title={`${table.table_name || `Table ${table.table_number}`} — ${TABLE_STATUSES[table.status]?.label || table.status}`}
      >
        {occupied && <Typography sx={S.cardTime(table.status)}>{elapsed || "0 Min"}</Typography>}
        <Typography sx={S.cardNumber(table.status)}>{table.table_number}</Typography>
        {occupied && (
          <>
            <Typography sx={S.cardPrice(table.status)}>₹ {amount.toFixed(2)}</Typography>
            {showSaveIcon && (
              <Box sx={S.cardSaveIcon}>
                <SaveIcon sx={{ fontSize: 13, color: TABLE_STATUSES[table.status].text, opacity: 0.7 }} />
              </Box>
            )}
          </>
        )}
      </Box>
    );
  };

  /* ─────────────────────────────── RENDER ─────────────────────────────── */
  return (
    <div style={S.root}>

      {/* TOP BAR */}
      <div style={S.topBar}>
        <div style={S.titleArea}>
          <Typography style={S.title}>Table View</Typography>
          <IconButton
            onClick={() => fetchData()}
            size="small"
            sx={{ color: "#64748B", border: "0.5px solid #E2E8F0", borderRadius: "6px", padding: "4px 6px" }}
          >
            <RefreshIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <div style={S.vacantBadge}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
            Khali: {statusCounts.available} / {statusCounts.all}
          </div>
        </div>

        <div style={S.btnGroup}>
          <Button variant="contained" sx={S.actionBtn("#c0392b")} startIcon={<AddIcon sx={{ fontSize: 16 }} />} onClick={() => navigate("/billing/tables")}>
            Add Table
          </Button>
          <Button variant="contained" sx={S.actionBtn("#1e3a8a")} onClick={() => navigate("/billing/items?order_type=Delivery")}>
            Delivery
          </Button>
          <Button variant="contained" sx={S.actionBtn("#1e3a8a")} onClick={() => navigate("/billing/items?order_type=Pick Up")}>
            Pick Up
          </Button>
        </div>
      </div>

      {/* LEGEND + FILTERS */}
      <div style={S.legendRow}>
        <FormControlLabel
          control={<Switch checked={moveKOT} onChange={(e) => setMoveKOT(e.target.checked)} color="error" size="small" />}
          label={<span style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>Move KOT / Items</span>}
        />
        <div style={S.legends}>
          {STATUS_FILTERS.map(({ key, label, legend }) => {
            const count  = key ? statusCounts[key] : statusCounts.all;
            const active = statusFilter === key;
            return (
              <div key={key ?? "all"} style={S.legendItem(active)} onClick={() => setStatusFilter(active ? null : key)}>
                <div style={S.legendCircle(legend)} />
                <span>{label} ({count})</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* AREA TABS */}
      {areas.filter((a) => a.status !== "inactive").length > 0 && (
        <div style={S.areaTabBar}>
          <div style={S.areaTab(selectedAreaId === "all")} onClick={() => setSelectedAreaId("all")}>
            All Sections ({tables.length})
          </div>
          {areas.filter((a) => a.status !== "inactive").map((area) => {
            const count = tables.filter((t) => Number(t.area_id) === Number(area.id)).length;
            return (
              <div key={area.id} style={S.areaTab(selectedAreaId === area.id)} onClick={() => setSelectedAreaId(area.id)}>
                {area.area_name} ({count})
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE GRIDS */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress color="error" />
        </Box>
      ) : groupedTables.length === 0 ? (
        /* ✅ Single clean message when nothing to show */
        <Box sx={S.noTablesMsg}>
          {statusFilter
            ? `No "${TABLE_STATUSES[statusFilter]?.label || statusFilter}" tables found.`
            : selectedAreaId !== "all"
              ? "No tables in this section."
              : 'No tables configured. Go to "Table Configuration" to add tables.'}
        </Box>
      ) : (
        groupedTables.map((group) => (
          <Box key={group.id} mb={3}>
            {/* Section heading */}
            <Typography sx={S.sectionHeading}>
              {group.area_name}
              <span style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", marginLeft: 6 }}>
                ({group.freeCount} vacant / {group.totalCount} total)
              </span>
            </Typography>

            {/* Cards */}
            <div style={S.cardGrid}>
              {group.tables.map(renderTableCard)}
            </div>
          </Box>
        ))
      )}

      {/* TABLE DETAILS DIALOG */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 800, fontSize: 15, py: 1.5, px: 2.5 }}>
          <span>
            Table #{selectedTable?.table_number} —{" "}
            {TABLE_STATUSES[selectedTable?.status]?.label || selectedTable?.status}
          </span>
          <IconButton onClick={() => setDetailsDialogOpen(false)} size="small">
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ px: 2.5, py: 2 }}>
          {dialogLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress color="error" />
            </Box>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography color="text.secondary" fontSize={10} fontWeight={700} letterSpacing={0.5}>TABLE NAME</Typography>
                <Typography fontWeight={700} fontSize={14}>{selectedTable?.table_name || `Table ${selectedTable?.table_number}`}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary" fontSize={10} fontWeight={700} letterSpacing={0.5}>SECTION / AREA</Typography>
                <Typography fontWeight={700} fontSize={14}>{selectedTable?.area_name}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary" fontSize={10} fontWeight={700} letterSpacing={0.5}>CAPACITY</Typography>
                <Typography fontWeight={700} fontSize={14}>{selectedTable?.capacity} Persons</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary" fontSize={10} fontWeight={700} letterSpacing={0.5}>ELAPSED TIME</Typography>
                <Typography fontWeight={700} fontSize={14}>
                  {selectedTable?.active_invoice_created_at ? getElapsedMinutes(selectedTable.active_invoice_created_at) : "—"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary" fontSize={10} fontWeight={700} letterSpacing={0.5}>BILL AMOUNT</Typography>
                <Typography fontWeight={700} fontSize={14} color="error">
                  ₹ {Number(selectedTable?.active_invoice_amount || 0).toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary" fontSize={10} fontWeight={700} letterSpacing={0.5}>CHANGE STATUS</Typography>
                <Box mt={0.5}>
                  <FormControl size="small" fullWidth>
                    <Select value={overrideStatus} onChange={(e) => handleStatusOverride(e.target.value)} sx={{ fontWeight: 700, fontSize: 12 }}>
                      <MenuItem value="available">Available (Blank)</MenuItem>
                      <MenuItem value="running">Running Table</MenuItem>
                      <MenuItem value="running_kot">Running KOT Table</MenuItem>
                      <MenuItem value="printed">Printed Table</MenuItem>
                      <MenuItem value="paid">Paid Table</MenuItem>
                      <MenuItem value="reserved">Reserved</MenuItem>
                      <MenuItem value="cleaning">Cleaning</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              {selectedTableInvoice && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle1" fontWeight={800} fontSize={14} mb={1}>Active Bill Details</Typography>
                  <Box bgcolor="#F8FAFC" p={1.5} borderRadius={2} border="1px solid #E2E8F0">
                    <Grid container spacing={1} mb={1.5}>
                      <Grid item xs={4}>
                        <Typography fontSize={10} color="text.secondary">INVOICE</Typography>
                        <Typography fontWeight={700} fontSize={12}>{selectedTableInvoice.invoice_number}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography fontSize={10} color="text.secondary">KOT / TOKEN</Typography>
                        <Typography fontWeight={700} fontSize={12}>{selectedTableInvoice.kot_number}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography fontSize={10} color="text.secondary">CLIENT</Typography>
                        <Typography fontWeight={700} fontSize={12}>{selectedTableInvoice.customer_name || "Walk-in"}</Typography>
                      </Grid>
                    </Grid>
                    <Typography fontWeight={800} fontSize={11} color="#475569" mb={0.5} letterSpacing={0.5}>ITEMS</Typography>
                    <List disablePadding>
                      {selectedTableInvoice.items?.map((item, idx) => (
                        <ListItem key={idx} disableGutters sx={{ py: 0.4, display: "flex", justifyContent: "space-between", borderBottom: "0.5px solid #E2E8F0" }}>
                          <ListItemText
                            primary={
                              <Typography fontSize={12} fontWeight={600}>
                                {item.name} <span style={{ color: "#64748B" }}>x {item.quantity}</span>
                              </Typography>
                            }
                          />
                          <Typography fontSize={12} fontWeight={700}>₹ {Number(item.subtotal).toFixed(2)}</Typography>
                        </ListItem>
                      ))}
                    </List>
                    <Divider sx={{ my: 1, borderColor: "#E2E8F0" }} />
                    <Box display="flex" justifyContent="space-between" mt={0.5}>
                      <Typography fontSize={13} fontWeight={800}>Total Amount:</Typography>
                      <Typography fontSize={13} fontWeight={900} color="error">
                        ₹ {Number(selectedTableInvoice.total_amount || 0).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 1.5, px: 2.5, flexWrap: "wrap", gap: 1 }}>
          {selectedTableInvoice ? (
            <>
              {selectedTable?.status !== "printed" && selectedTable?.status !== "paid" && (
                <Button variant="outlined" color="primary" size="small" onClick={handlePrintBill} disabled={dialogLoading}
                  sx={{ textTransform: "none", fontWeight: 700, fontSize: 12 }}>
                  Print Bill
                </Button>
              )}
              {selectedTable?.status !== "paid" && (
                <Button variant="contained" color="success" size="small" onClick={handleSettlePayment} disabled={dialogLoading}
                  sx={{ textTransform: "none", fontWeight: 700, fontSize: 12 }}>
                  Settle Payment
                </Button>
              )}
              <Button variant="outlined" color="warning" size="small" onClick={handleEditOrder} disabled={dialogLoading}
                sx={{ textTransform: "none", fontWeight: 700, fontSize: 12 }}>
                Edit Order
              </Button>
            </>
          ) : (
            <Button variant="contained" color="primary" size="small" onClick={handleNewOrder} disabled={dialogLoading}
              sx={{ textTransform: "none", fontWeight: 700, fontSize: 12 }}>
              New Order
            </Button>
          )}
          {(selectedTable?.status === "paid" || selectedTable?.status === "printed") && (
            <Button variant="contained" color="error" size="small" onClick={handleClearTable} disabled={dialogLoading}
              sx={{ textTransform: "none", fontWeight: 700, fontSize: 12 }}>
              Clear Table
            </Button>
          )}
          {selectedTable?.status === "available" && selectedTableInvoice && (
            <Button variant="outlined" color="error" size="small" onClick={handleClearTable} disabled={dialogLoading}
              sx={{ textTransform: "none", fontWeight: 700, fontSize: 12 }}>
              Clear Table
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BillingTableView;