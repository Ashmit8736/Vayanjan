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

  // create form state
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    unit_name: "",
    unit_symbol: "",
  });

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

  /* ===== CREATE FORM HANDLERS ===== */

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
    const res = await fetch(
      "http://localhost:5000/api/units/addUnit",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          unit_name: formData.unit_name,
          unit_symbol: formData.unit_symbol,
        }),
      }
    );

    const result = await res.json();
    console.log("ADD UNIT RESPONSE:", result);

    if (!res.ok) {
      alert(result.message || "Failed to add unit");
      return;
    }

    // ✅ SUCCESS
    setOpenForm(false);
    setFormData({ unit_name: "", unit_symbol: "" });

    // 🔥 MOST IMPORTANT LINE
    fetchUnits(); // ← yahin GET API fir se call hoti hai

  } catch (error) {
    console.error("Add unit error:", error);
    alert("Server error");
  }
};


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
          onClick={() => setOpenForm(true)}
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
          <TextField size="small" placeholder="Search unit" />
        </Box>

        <Button variant="outlined" color="error">
          Search
        </Button>

        <Button variant="outlined">Clear</Button>
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
            ) : units.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              units.map((unit, index) => (
                <TableRow key={unit.id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{unit.unit_name}</TableCell>
                  <TableCell>{unit.unit_symbol}</TableCell>
                  <TableCell>{formatDate(unit.created_at)}</TableCell>
                  <TableCell align="center">
                    <IconButton sx={iconBtn}>
                      <ContentPaste fontSize="small" />
                    </IconButton>
                    <IconButton sx={iconBtn}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton sx={deleteBtn}>
                      <Close fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* ===== CREATE UNIT FORM ===== */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Unit</DialogTitle>

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
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
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
