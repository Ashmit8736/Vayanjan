import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Switch,
  IconButton,
  Select,
  MenuItem,
  Checkbox,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SearchIcon from "@mui/icons-material/Search";
import {
  getAreasList,
  createArea,
  updateArea,
  deleteArea,
  getTablesList,
  createTable,
  updateTable,
  deleteTable,
} from "@services/api/diningAPI";

// Styles matching Petpooja Table Configuration — refined typography + spacing pass
const S = {
  root: {
    padding: "20px 28px",
    background: "#F4F6F9",
    minHeight: "100vh",
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    color: "#1E293B",
    boxSizing: "border-box",
  },
  breadcrumbRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  breadcrumbs: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    fontWeight: 500,
    color: "#64748B",
  },
  breadcrumbHome: {
    color: "#64748B",
    textDecoration: "none",
    fontWeight: 500,
  },
  breadcrumbActive: {
    color: "#2563eb",
    fontWeight: 700,
  },
  backBtn: {
    border: "1px solid #CBD5E1",
    background: "#fff",
    color: "#0F172A",
    textTransform: "none",
    fontWeight: 700,
    borderRadius: 6,
    padding: "5px 16px",
    fontSize: 13,
    "&:hover": { background: "#F1F5F9", borderColor: "#94A3B8" },
  },
  configHeaderBar: {
    display: "flex",
    background: "#fff",
    border: "1px solid #E2E8F0",
    borderRadius: 10,
    marginBottom: 22,
    overflowX: "auto",
    boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
  },
  configTab: (active) => ({
    padding: "15px 22px",
    fontSize: 14,
    fontWeight: 800,
    color: active ? "#2563eb" : "#475569",
    borderBottom: active ? "3px solid #2563eb" : "3px solid transparent",
    cursor: "pointer",
    whiteSpace: "nowrap",
    letterSpacing: "0.01em",
    transition: "all 0.15s ease",
    "&:hover": { color: "#2563eb", background: "#F8FAFC" },
  }),
  actionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
    flexWrap: "wrap",
    gap: 12,
  },
  subTabBar: {
    display: "flex",
    gap: 24,
    borderBottom: "2px solid #E2E8F0",
    paddingBottom: 0,
    marginBottom: 18,
  },
  subTab: (active) => ({
    padding: "8px 4px 12px",
    fontSize: 14.5,
    fontWeight: 800,
    color: active ? "#0F172A" : "#64748B",
    borderBottom: active ? "3px solid #2563eb" : "3px solid transparent",
    marginBottom: -2,
    cursor: "pointer",
    transition: "all 0.15s ease",
  }),
  blueBtn: {
    background: "#2563eb",
    color: "#fff",
    textTransform: "none",
    fontWeight: 700,
    borderRadius: 7,
    padding: "8px 20px",
    fontSize: 13.5,
    boxShadow: "0 1px 2px rgba(37,99,235,0.25)",
    "&:hover": { background: "#1d4ed8" },
  },
  greyBtn: {
    background: "#fff",
    border: "1px solid #CBD5E1",
    color: "#475569",
    textTransform: "none",
    fontWeight: 700,
    borderRadius: 7,
    padding: "8px 20px",
    fontSize: 13.5,
    "&:hover": { background: "#F1F5F9", borderColor: "#94A3B8" },
  },
  searchPanel: {
    background: "#fff",
    border: "1px solid #E2E8F0",
    borderRadius: 10,
    padding: "16px 18px",
    marginBottom: 18,
    display: "flex",
    alignItems: "center",
    gap: 14,
    flexWrap: "wrap",
    boxShadow: "0 1px 2px rgba(15,23,42,0.03)",
  },
  filterInput: {
    padding: "9px 13px",
    border: "1px solid #CBD5E1",
    borderRadius: 7,
    fontSize: 13.5,
    fontFamily: "inherit",
    outline: "none",
    width: 220,
    boxSizing: "border-box",
  },
  filterSelect: {
    padding: "9px 13px",
    border: "1px solid #CBD5E1",
    borderRadius: 7,
    fontSize: 13.5,
    fontFamily: "inherit",
    background: "#fff",
    outline: "none",
    width: 220,
    boxSizing: "border-box",
  },
  searchBtn: {
    background: "#fff",
    border: "1.5px solid #2563eb",
    color: "#2563eb",
    fontWeight: 700,
    fontSize: 13.5,
    textTransform: "none",
    borderRadius: 7,
    padding: "8px 22px",
    "&:hover": { background: "#eff6ff" },
  },
  showAllBtn: {
    background: "#fff",
    border: "1px solid #CBD5E1",
    color: "#475569",
    fontWeight: 700,
    fontSize: 13.5,
    textTransform: "none",
    borderRadius: 7,
    padding: "8px 22px",
    "&:hover": { background: "#F1F5F9" },
  },
  tableWrapper: {
    background: "#fff",
    border: "1px solid #E2E8F0",
    borderRadius: 10,
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
  },
  th: {
    background: "#EEF1FD",
    padding: "14px 18px",
    fontSize: 13.5,
    fontWeight: 700,
    color: "#0F172A",
    textAlign: "left",
    borderBottom: "1px solid #E2E8F0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  td: {
    padding: "14px 18px",
    fontSize: 13.5,
    fontWeight: 500,
    color: "#1E293B",
    borderBottom: "1px solid #F1F5F9",
    verticalAlign: "middle",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  statusToggle: {
    color: "#2563eb",
  },
  // Pill / badge styles (matches the rounded colored-tag look)
  pillBase: {
    display: "inline-block",
    padding: "4px 14px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    color: "#fff",
    lineHeight: 1.6,
    whiteSpace: "nowrap",
  },
  pillBlue: { background: "#2563eb" },
  pillGreen: { background: "#16A34A" },
  pillOrange: { background: "#F59E0B" },
  pillRed: { background: "#DC2626" },
  actionIconBtn: {
    padding: 6,
    color: "#64748B",
    "&:hover": { color: "#0F172A", background: "#F1F5F9" },
  },
  paginationRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    background: "#fff",
    borderTop: "1px solid #E2E8F0",
  },
  formLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#475569",
    marginBottom: 6,
    display: "block",
  },
  formInput: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #CBD5E1",
    borderRadius: 7,
    fontSize: 14,
    fontFamily: "inherit",
    color: "#0F172A",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: 16,
    "&:focus": {
      borderColor: "#2563eb",
    },
  },
  alertError: {
    padding: "10px 14px",
    background: "#FEF2F2",
    border: "1px solid #FCA5A5",
    borderRadius: 7,
    color: "#B91C1C",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 16,
  },
};

const BillingTables = () => {
  // Navigation sub-tab state (Tables / Areas)
  const [subTab, setSubTab] = useState("tables"); // "tables" or "areas"

  // Data List States
  const [areas, setAreas] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search State
  const [searchTableNo, setSearchTableNo] = useState("");
  const [searchAreaId, setSearchAreaId] = useState("");
  const [filterQuery, setFilterQuery] = useState({ tableNo: "", areaId: "" });

  // Dialog State
  const [areaDialogOpen, setAreaDialogOpen] = useState(false);
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogError, setDialogError] = useState("");

  // Form Fields - Area
  const [editingArea, setEditingArea] = useState(null);
  const [areaName, setAreaName] = useState("");
  const [areaDesc, setAreaDesc] = useState("");
  const [areaStatus, setAreaStatus] = useState("active");

  // Form Fields - Table
  const [editingTable, setEditingTable] = useState(null);
  const [tableAreaId, setTableAreaId] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [tableName, setTableName] = useState("");
  const [tableCapacity, setTableCapacity] = useState(4);
  const [tableStatus, setTableStatus] = useState("available");
  const [tableNotes, setTableNotes] = useState("");

  // Maps a status value to a pill style + display label (visual only, matches the badge-style status design)
  const getStatusPill = (status) => {
    if (status === "inactive") return { style: S.pillRed, label: "Inactive" };
    if (status === "active" || status === "available") return { style: S.pillGreen, label: status === "active" ? "Active" : "Available" };
    if (status === "reserved" || status === "cleaning") return { style: S.pillOrange, label: status.charAt(0).toUpperCase() + status.slice(1) };
    return { style: S.pillGreen, label: status ? status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Active" };
  };

  // Load both areas and tables
  const loadData = async () => {
    setLoading(true);
    try {
      const [areasRes, tablesRes] = await Promise.all([
        getAreasList(),
        getTablesList(),
      ]);

      if (areasRes?.success) setAreas(areasRes.data || []);
      if (tablesRes?.success) setTables(tablesRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Tables list
  const filteredTables = useMemo(() => {
    return tables.filter((t) => {
      const matchesTableNo = filterQuery.tableNo
        ? t.table_number.toLowerCase().includes(filterQuery.tableNo.toLowerCase())
        : true;
      const matchesArea = filterQuery.areaId
        ? Number(t.area_id) === Number(filterQuery.areaId)
        : true;
      return matchesTableNo && matchesArea;
    });
  }, [tables, filterQuery]);

  // Toggle Table status (Active -> Toggle available/inactive)
  const handleTableToggle = async (table) => {
    const nextStatus = table.status === "inactive" ? "available" : "inactive";
    try {
      await updateTable(table.id, {
        area_id: table.area_id,
        table_number: table.table_number,
        table_name: table.table_name,
        capacity: table.capacity,
        status: nextStatus,
        notes: table.notes,
      });
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle Area status (Active -> Toggle active/inactive)
  const handleAreaToggle = async (area) => {
    const nextStatus = area.status === "inactive" ? "active" : "inactive";
    try {
      await updateArea(area.id, {
        area_name: area.area_name,
        description: area.description,
        status: nextStatus,
      });
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  // Search Submit
  const handleSearchSubmit = () => {
    setFilterQuery({
      tableNo: searchTableNo,
      areaId: searchAreaId,
    });
  };

  // Show All / Reset Search
  const handleResetSearch = () => {
    setSearchTableNo("");
    setSearchAreaId("");
    setFilterQuery({ tableNo: "", areaId: "" });
  };

  // ─── AREA DIALOG HANDLERS ───
  const openAddArea = () => {
    setEditingArea(null);
    setAreaName("");
    setAreaDesc("");
    setAreaStatus("active");
    setDialogError("");
    setAreaDialogOpen(true);
  };

  const openEditArea = (area) => {
    setEditingArea(area);
    setAreaName(area.area_name || "");
    setAreaDesc(area.description || "");
    setAreaStatus(area.status || "active");
    setDialogError("");
    setAreaDialogOpen(true);
  };

  const handleAreaSubmit = async (e) => {
    e.preventDefault();
    if (!areaName.trim()) {
      setDialogError("Area name is required.");
      return;
    }

    setDialogLoading(true);
    setDialogError("");
    const payload = {
      area_name: areaName.trim(),
      description: areaDesc.trim() || null,
      status: areaStatus,
    };

    try {
      let res;
      if (editingArea) {
        res = await updateArea(editingArea.id, payload);
      } else {
        res = await createArea(payload);
      }
      if (res?.success) {
        setAreaDialogOpen(false);
        loadData();
      } else {
        setDialogError(res?.message || "Failed to save area.");
      }
    } catch (err) {
      setDialogError(err?.message || "Connection error.");
    } finally {
      setDialogLoading(false);
    }
  };

  const handleAreaDelete = async (areaId, areaName) => {
    if (!window.confirm(`Are you sure you want to delete Area "${areaName}"?`)) return;
    try {
      const res = await deleteArea(areaId);
      if (res?.success) {
        loadData();
      } else {
        alert(res?.message || "Failed to delete area.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ─── TABLE DIALOG HANDLERS ───
  const openAddTable = () => {
    if (areas.length === 0) {
      alert("Please add at least one Dining Area first.");
      return;
    }
    setEditingTable(null);
    setTableAreaId(areas[0].id);
    setTableNumber("");
    setTableName("");
    setTableCapacity(4);
    setTableStatus("available");
    setTableNotes("");
    setDialogError("");
    setTableDialogOpen(true);
  };

  const openEditTable = (table) => {
    setEditingTable(table);
    setTableAreaId(table.area_id);
    setTableNumber(table.table_number || "");
    setTableName(table.table_name || "");
    setTableCapacity(table.capacity || 4);
    setTableStatus(table.status || "available");
    setTableNotes(table.notes || "");
    setDialogError("");
    setTableDialogOpen(true);
  };

  const handleTableSubmit = async (e) => {
    e.preventDefault();
    if (!tableNumber.trim()) {
      setDialogError("Table number is required.");
      return;
    }

    setDialogLoading(true);
    setDialogError("");
    const payload = {
      area_id: tableAreaId,
      table_number: tableNumber.trim(),
      table_name: tableName.trim() || `Table ${tableNumber.trim()}`,
      capacity: Number(tableCapacity) || 4,
      status: tableStatus,
      notes: tableNotes.trim() || null,
    };

    try {
      let res;
      if (editingTable) {
        res = await updateTable(editingTable.id, payload);
      } else {
        res = await createTable(payload);
      }
      if (res?.success) {
        setTableDialogOpen(false);
        loadData();
      } else {
        setDialogError(res?.message || "Failed to save table.");
      }
    } catch (err) {
      setDialogError(err?.message || "Connection error.");
    } finally {
      setDialogLoading(false);
    }
  };

  const handleTableDelete = async (tableId, tableNum) => {
    if (!window.confirm(`Are you sure you want to delete Table "${tableNum}"?`)) return;
    try {
      const res = await deleteTable(tableId);
      if (res?.success) {
        loadData();
      } else {
        alert(res?.message || "Failed to delete table.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={S.root}>
      {/* Font import + small interaction styles that can't be done with inline style objects */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .pp-row:hover { background: #EEF2FF !important; }
        .pp-row td { transition: background 0.1s ease; }
      `}</style>

      {/* ─── BREADCRUMBS ROW ─── */}
      <div style={S.breadcrumbRow}>
        <div style={S.breadcrumbs}>
          <a href="#/" style={S.breadcrumbHome}>Home</a>
          <ArrowForwardIosIcon sx={{ fontSize: 10 }} />
          <span>Menu</span>
          <ArrowForwardIosIcon sx={{ fontSize: 10 }} />
          <span style={S.breadcrumbActive}>Table Configuration</span>
        </div>
        <Button variant="outlined" sx={S.backBtn}>
          &lt; Back
        </Button>
      </div>

      {/* ─── CONFIG HEADER BAR (TABS) ─── */}
      <div style={S.configHeaderBar}>
        <div style={S.configTab(false)}>Items</div>
        <div style={S.configTab(false)}>Categories</div>
        <div style={S.configTab(false)}>Variants</div>
        <div style={S.configTab(false)}>Addons</div>
        <div style={S.configTab(true)}>Tables/Areas</div>
        <div style={S.configTab(false)}>Taxes</div>
        <div style={S.configTab(false)}>Discounts</div>
      </div>

      {/* ─── ACTION ROW ─── */}
      <div style={S.actionRow}>
        <div style={{ display: "flex", gap: 10 }}>
          <Button
            variant="contained"
            sx={S.blueBtn}
            onClick={subTab === "tables" ? openAddTable : openAddArea}
          >
            {subTab === "tables" ? "Add New Table" : "Add New Area"}
          </Button>
          <Button variant="contained" sx={S.blueBtn}>
            Add Discount
          </Button>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="outlined" sx={S.greyBtn}>
            Action
          </Button>
          <Button variant="outlined" sx={S.greyBtn}>
            Export/Import
          </Button>
        </div>
      </div>

      {/* ─── SUB-TABS (TABLES / AREAS) ─── */}
      <div style={S.subTabBar}>
        <div style={S.subTab(subTab === "tables")} onClick={() => setSubTab("tables")}>
          Tables
        </div>
        <div style={S.subTab(subTab === "areas")} onClick={() => setSubTab("areas")}>
          Areas
        </div>
      </div>

      {/* ─── SEARCH/FILTER PANEL ─── */}
      {subTab === "tables" && (
        <div style={S.searchPanel}>
          <input
            style={S.filterInput}
            placeholder="Table No"
            value={searchTableNo}
            onChange={(e) => setSearchTableNo(e.target.value)}
          />

          <select
            style={S.filterSelect}
            value={searchAreaId}
            onChange={(e) => setSearchAreaId(e.target.value)}
          >
            <option value="">Select Area</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.area_name}
              </option>
            ))}
          </select>

          <Button variant="outlined" sx={S.searchBtn} onClick={handleSearchSubmit}>
            Search
          </Button>
          <Button variant="outlined" sx={S.showAllBtn} onClick={handleResetSearch}>
            Show All
          </Button>
        </div>
      )}

      {/* ─── DATA TABLE Wrapper ─── */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress color="error" />
        </Box>
      ) : subTab === "tables" ? (
        /* ─── TABLES LIST ─── */
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <colgroup>
              <col style={{ width: "4%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>
            <thead>
              <tr>
                <th style={{ ...S.th, textAlign: "center" }}>
                  <Checkbox size="small" />
                </th>
                <th style={S.th}>Table No</th>
                <th style={S.th}>No. Of Persons</th>
                <th style={S.th}>Extra Information</th>
                <th style={S.th}>Area Name</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Discount (%)</th>
                <th style={S.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTables.length === 0 ? (
                <tr>
                  <td colSpan={8} align="center" style={{ ...S.td, padding: "32px 16px", color: "#94A3B8", whiteSpace: "normal" }}>
                    No tables found.
                  </td>
                </tr>
              ) : (
                filteredTables.map((table, idx) => (
                  <tr
                    key={table.id}
                    className="pp-row"
                    style={{ background: idx % 2 === 1 ? "#F8FAFC" : "#fff" }}
                  >
                    <td style={{ ...S.td, textAlign: "center" }}>
                      <Checkbox size="small" />
                    </td>
                    <td style={{ ...S.td, fontWeight: 800, color: "#0F172A" }}>{table.table_number}</td>
                    <td style={S.td}>{table.capacity || "4"}</td>
                    <td style={S.td} title={table.notes || "-"}>{table.notes || "-"}</td>
                    <td style={S.td}>
                      <span style={{ ...S.pillBase, ...S.pillBlue }}>{table.area_name || "Garden"}</span>
                    </td>
                    <td style={S.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Switch
                          checked={table.status !== "inactive"}
                          onChange={() => handleTableToggle(table)}
                          color="primary"
                          size="small"
                        />
                        <span style={{ ...S.pillBase, ...getStatusPill(table.status).style }}>
                          {getStatusPill(table.status).label}
                        </span>
                      </div>
                    </td>
                    <td style={S.td}>-</td>
                    <td style={S.td}>
                      <div style={{ display: "flex", gap: 2 }}>
                        <IconButton
                          sx={S.actionIconBtn}
                          title="Edit"
                          onClick={() => openEditTable(table)}
                        >
                          <EditIcon sx={{ fontSize: 17 }} />
                        </IconButton>
                        <IconButton
                          sx={S.actionIconBtn}
                          title="Delete"
                          onClick={() => handleTableDelete(table.id, table.table_number)}
                        >
                          <DeleteIcon sx={{ fontSize: 17 }} />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div style={S.paginationRow}>
            <Typography fontSize={12.5} fontWeight={600} color="text.secondary">
              Showing 1 to {filteredTables.length} of {filteredTables.length} records
            </Typography>
            <div style={{ display: "flex", gap: 4 }}>
              <Button size="small" variant="outlined" sx={S.backBtn} disabled>
                1
              </Button>
              <Button size="small" variant="outlined" sx={S.backBtn} disabled>
                Next
              </Button>
              <Button size="small" variant="outlined" sx={S.backBtn} disabled>
                Last
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* ─── AREAS LIST ─── */
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <colgroup>
              <col style={{ width: "5%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "45%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>
            <thead>
              <tr>
                <th style={{ ...S.th, textAlign: "center" }}>
                  <Checkbox size="small" />
                </th>
                <th style={S.th}>Area Name</th>
                <th style={S.th}>Description</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {areas.length === 0 ? (
                <tr>
                  <td colSpan={5} align="center" style={{ ...S.td, padding: "32px 16px", color: "#94A3B8", whiteSpace: "normal" }}>
                    No areas found.
                  </td>
                </tr>
              ) : (
                areas.map((area, idx) => (
                  <tr
                    key={area.id}
                    className="pp-row"
                    style={{ background: idx % 2 === 1 ? "#F8FAFC" : "#fff" }}
                  >
                    <td style={{ ...S.td, textAlign: "center" }}>
                      <Checkbox size="small" />
                    </td>
                    <td style={{ ...S.td, fontWeight: 800, color: "#0F172A" }}>{area.area_name}</td>
                    <td style={S.td} title={area.description || "-"}>{area.description || "-"}</td>
                    <td style={S.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Switch
                          checked={area.status !== "inactive"}
                          onChange={() => handleAreaToggle(area)}
                          color="primary"
                          size="small"
                        />
                        <span style={{ ...S.pillBase, ...getStatusPill(area.status).style }}>
                          {getStatusPill(area.status).label}
                        </span>
                      </div>
                    </td>
                    <td style={S.td}>
                      <div style={{ display: "flex", gap: 2 }}>
                        <IconButton
                          sx={S.actionIconBtn}
                          title="Edit"
                          onClick={() => openEditArea(area)}
                        >
                          <EditIcon sx={{ fontSize: 17 }} />
                        </IconButton>
                        <IconButton
                          sx={S.actionIconBtn}
                          title="Delete"
                          onClick={() => handleAreaDelete(area.id, area.area_name)}
                        >
                          <DeleteIcon sx={{ fontSize: 17 }} />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── ADD/EDIT AREA DIALOG ─── */}
      <Dialog open={areaDialogOpen} onClose={() => setAreaDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>{editingArea ? "Update Dining Area" : "Add Dining Area"}</DialogTitle>
        <form onSubmit={handleAreaSubmit}>
          <DialogContent>
            {dialogError && <div style={S.alertError}>{dialogError}</div>}

            <label style={S.formLabel}>Area Name *</label>
            <input
              style={S.formInput}
              placeholder="e.g. Ground Floor, AC Hall, Garden"
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
              required
              disabled={dialogLoading}
            />

            <label style={S.formLabel}>Description</label>
            <input
              style={S.formInput}
              placeholder="e.g. Inside family dining room"
              value={areaDesc}
              onChange={(e) => setAreaDesc(e.target.value)}
              disabled={dialogLoading}
            />

            <label style={S.formLabel}>Status</label>
            <select
              style={{ ...S.filterSelect, width: "100%", marginBottom: 16 }}
              value={areaStatus}
              onChange={(e) => setAreaStatus(e.target.value)}
              disabled={dialogLoading}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAreaDialogOpen(false)} disabled={dialogLoading} sx={{ textTransform: "none", fontWeight: 700 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={dialogLoading} sx={{ textTransform: "none", fontWeight: 700 }}>
              {dialogLoading ? "Saving..." : "Save Area"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ─── ADD/EDIT TABLE DIALOG ─── */}
      <Dialog open={tableDialogOpen} onClose={() => setTableDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>{editingTable ? "Update Dining Table" : "Add Dining Table"}</DialogTitle>
        <form onSubmit={handleTableSubmit}>
          <DialogContent>
            {dialogError && <div style={S.alertError}>{dialogError}</div>}

            <label style={S.formLabel}>Dining Area *</label>
            <select
              style={{ ...S.filterSelect, width: "100%", marginBottom: 16 }}
              value={tableAreaId}
              onChange={(e) => setTableAreaId(e.target.value)}
              required
              disabled={dialogLoading}
            >
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.area_name}
                </option>
              ))}
            </select>

            <label style={S.formLabel}>Table Number / Code *</label>
            <input
              style={S.formInput}
              placeholder="e.g. 10, 11, T-5"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              required
              disabled={dialogLoading}
            />

            <label style={S.formLabel}>Display Name</label>
            <input
              style={S.formInput}
              placeholder="e.g. Corner Table, AC Table 1"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              disabled={dialogLoading}
            />

            <label style={S.formLabel}>Capacity (Persons)</label>
            <input
              type="number"
              style={S.formInput}
              value={tableCapacity}
              onChange={(e) => setTableCapacity(e.target.value)}
              min="1"
              required
              disabled={dialogLoading}
            />

            <label style={S.formLabel}>Initial Status</label>
            <select
              style={{ ...S.filterSelect, width: "100%", marginBottom: 16 }}
              value={tableStatus}
              onChange={(e) => setTableStatus(e.target.value)}
              disabled={dialogLoading}
            >
              <option value="available">Available (Blank)</option>
              <option value="running">Running Table</option>
              <option value="printed">Printed Table</option>
              <option value="paid">Paid Table</option>
              <option value="running_kot">Running KOT Table</option>
              <option value="reserved">Reserved</option>
              <option value="cleaning">Cleaning</option>
              <option value="inactive">Inactive</option>
            </select>

            <label style={S.formLabel}>Extra Information / Notes</label>
            <input
              style={S.formInput}
              placeholder="e.g. Near Window, best view"
              value={tableNotes}
              onChange={(e) => setTableNotes(e.target.value)}
              disabled={dialogLoading}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTableDialogOpen(false)} disabled={dialogLoading} sx={{ textTransform: "none", fontWeight: 700 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={dialogLoading} sx={{ textTransform: "none", fontWeight: 700 }}>
              {dialogLoading ? "Saving..." : "Save Table"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default BillingTables;