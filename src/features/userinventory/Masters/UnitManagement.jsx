import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Add, ContentPaste, Edit, Close } from "@mui/icons-material";
import { useEffect, useState } from "react";

/* ================= COMPONENT ================= */

const UnitManagement = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState("");

  // Edit / Create states
  const [editUnit, setEditUnit] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    unit_name: "",
    unit_symbol: "",
  });

  // View state
  const [viewUnit, setViewUnit] = useState(null);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/units/getUnit");
      const result = await res.json();

      console.log("API RESPONSE:", result);

      if (Array.isArray(result)) {
        setUnits(result);
      } else if (Array.isArray(result.data)) {
        setUnits(result.data);
      } else {
        setUnits([]);
      }
    } catch (error) {
      console.error("Error fetching units:", error);
      setUnits([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toISOString().split("T")[0];
  };

  /* ===== CREATE/EDIT FORM HANDLERS ===== */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!formData.unit_name || !formData.unit_symbol) {
      alert("Please fill all fields");
      return;
    }

    try {
      const url = editUnit
        ? `http://localhost:5000/api/units/updateUnit/${editUnit.id}`
        : "http://localhost:5000/api/units/addUnit";

      const method = editUnit ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          unit_name: formData.unit_name,
          unit_symbol: formData.unit_symbol,
        }),
      });

      const result = await res.json();
      console.log("SAVE UNIT RESPONSE:", result);

      if (!res.ok) {
        alert(result.message || `Failed to ${editUnit ? "update" : "add"} unit`);
        return;
      }

      // ✅ SUCCESS
      setOpenForm(false);
      setEditUnit(null);
      setFormData({ unit_name: "", unit_symbol: "" });

      // 🔥 MOST IMPORTANT LINE
      fetchUnits(); // ← GET API fir se call hoti hai
    } catch (error) {
      console.error("Save unit error:", error);
      alert("Server error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this unit?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/units/deleteUnit/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();
      console.log("DELETE UNIT RESPONSE:", result);

      if (!res.ok) {
        alert(result.message || "Failed to delete unit");
        return;
      }

      // Refresh list
      fetchUnits();
    } catch (error) {
      console.error("Delete unit error:", error);
      alert("Server error");
    }
  };

  const handleSearch = () => {
    setFilterQuery(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery("");
    setFilterQuery("");
  };

  // Client-side filtering
  const filteredUnits = units.filter((unit) => {
    const nameMatch = unit.unit_name?.toLowerCase().includes(filterQuery.toLowerCase());
    const symbolMatch = unit.unit_symbol?.toLowerCase().includes(filterQuery.toLowerCase());
    return nameMatch || symbolMatch;
  });

  return (
    <Box sx={page}>
      {/* HEADER */}
      <Box sx={header}>
        <Typography variant="h6" fontWeight={700}>
          Unit Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          sx={createBtn}
          onClick={() => {
            setEditUnit(null);
            setFormData({ unit_name: "", unit_symbol: "" });
            setOpenForm(true);
          }}
        >
          Create New
        </Button>
      </Box>

      {/* FILTER BAR */}
      <Paper sx={filterBar}>
        <Box>
          <Typography fontSize={13} mb={0.5}>
            Name
          </Typography>
          <TextField
            size="small"
            placeholder="Search unit"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>

        <Button variant="outlined" color="error" onClick={handleSearch}>
          Search
        </Button>

        <Button variant="outlined" onClick={handleClear}>
          Clear
        </Button>
      </Paper>

      {/* TABLE */}
      <Paper sx={tableWrap}>
        <Table>
          <TableHead>
            <TableRow sx={thead}>
              <TableCell>S.No</TableCell>
              <TableCell>Unit Name</TableCell>
              <TableCell>Unit Symbol</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredUnits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              filteredUnits.map((unit, index) => (
                <TableRow key={unit.id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{unit.unit_name}</TableCell>
                  <TableCell>{unit.unit_symbol}</TableCell>
                  <TableCell>{formatDate(unit.created_at)}</TableCell>
                  <TableCell align="center">
                    <IconButton sx={iconBtn} onClick={() => setViewUnit(unit)}>
                      <ContentPaste fontSize="small" />
                    </IconButton>
                    <IconButton
                      sx={iconBtn}
                      onClick={() => {
                        setEditUnit(unit);
                        setFormData({
                          unit_name: unit.unit_name,
                          unit_symbol: unit.unit_symbol,
                        });
                        setOpenForm(true);
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton sx={deleteBtn} onClick={() => handleDelete(unit.id)}>
                      <Close fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* ===== CREATE / EDIT UNIT FORM ===== */}
      <Dialog
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditUnit(null);
          setFormData({ unit_name: "", unit_symbol: "" });
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editUnit ? "Edit Unit" : "Add Unit"}</DialogTitle>

        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Unit Name"
              name="unit_name"
              value={formData.unit_name}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Unit Symbol"
              name="unit_symbol"
              value={formData.unit_symbol}
              onChange={handleChange}
              fullWidth
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setOpenForm(false);
              setEditUnit(null);
              setFormData({ unit_name: "", unit_symbol: "" });
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== VIEW UNIT DETAILS ===== */}
      <Dialog
        open={Boolean(viewUnit)}
        onClose={() => setViewUnit(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Unit Details
          <IconButton onClick={() => setViewUnit(null)} size="small" aria-label="close">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <Box display="flex" justifyContent="space-between" borderBottom="1px solid #e2e8f0" pb={1}>
              <Typography fontWeight={600}>Unit Name:</Typography>
              <Typography>{viewUnit?.unit_name}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" borderBottom="1px solid #e2e8f0" pb={1}>
              <Typography fontWeight={600}>Unit Symbol:</Typography>
              <Typography>{viewUnit?.unit_symbol}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" pb={1}>
              <Typography fontWeight={600}>Created Date:</Typography>
              <Typography>{formatDate(viewUnit?.created_at)}</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewUnit(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

/* ===================== STYLES ===================== */

const page = {
  p: 3,
  bgcolor: "#F8FAFC",
  minHeight: "100vh",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 2,
};

const createBtn = {
  bgcolor: "#C62828",
  textTransform: "none",
  fontWeight: 600,
  "&:hover": {
    bgcolor: "#B71C1C",
  },
};

const filterBar = {
  p: 2,
  mb: 2,
  display: "flex",
  alignItems: "flex-end",
  gap: 2,
};

const tableWrap = {
  borderRadius: 2,
  overflow: "hidden",
};

const thead = {
  bgcolor: "#EFF6FF",
  "& th": {
    fontWeight: 700,
  },
};

const iconBtn = {
  bgcolor: "#F1F5F9",
  mx: 0.5,
  "&:hover": {
    bgcolor: "#E2E8F0",
  },
};

const deleteBtn = {
  bgcolor: "#FEE2E2",
  mx: 0.5,
  "&:hover": {
    bgcolor: "#FCA5A5",
  },
};

export default UnitManagement;
