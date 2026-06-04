import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Paper,
  Divider
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";

// ✅ BASE URL
const BASE_URL = "http://localhost:5000/api";

const AddStock = () => {
  const [rows, setRows] = useState([
    { material: "", qty: "", unit: "", comment: "" }
  ]);

  // ✅ API DATA STATES
  const [rawMaterials, setRawMaterials] = useState([]);
  const [units, setUnits] = useState([]);

  // ✅ CALL APIs
  useEffect(() => {
    fetchRawMaterials();
    fetchUnits();
  }, []);

 
const token = localStorage.getItem("authToken");


const fetchRawMaterials = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/raw/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setRawMaterials(res.data.data);
  } catch (err) {
    console.error("Raw material error", err.response);
  }
};



  const fetchUnits = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/units/getUnit`);
      setUnits(res.data.data); // 🔥 sirf data
    } catch (err) {
      console.error(err);
    }
  };

  const addRow = () => {
    setRows([...rows, { material: "", qty: "", unit: "", comment: "" }]);
  };

  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const handleMaterialChange = (index, materialId) => {
    const updated = [...rows];
    updated[index].material = materialId;
    const selectedMat = rawMaterials.find((rm) => rm.id === Number(materialId));
    if (selectedMat) {
      updated[index].unit = selectedMat.purchase_unit_id || "";
    } else {
      updated[index].unit = "";
    }
    setRows(updated);
  };

const handleSave = async () => {
  try {
    const token = localStorage.getItem("authToken");

    const items = rows
      .filter(
        (r) =>
          r.material !== "" &&
          r.unit !== "" &&
          r.qty !== "" &&
          Number(r.qty) > 0
      )
      .map((r) => ({
        raw_material_id: Number(r.material),
        entered_quantity: Number(r.qty),
        entered_unit_id: Number(r.unit),
      }));

    if (items.length === 0) {
      alert("Please add stock");
      return;
    }

    // 🔥 MULTI SAVE USING LOOP
    await Promise.all(
      items.map((item) =>
        axios.post(
          "http://localhost:5000/api/stock/stockAdd",
          item, // 👈 SINGLE OBJECT (backend friendly)
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      )
    );

    alert("✅ All stock saved successfully");

    setRows([{ material: "", qty: "", unit: "" }]);

  } catch (error) {
    console.error(error.response || error);
    alert("❌ Error saving stock");
  }
};


  return (
    <Box p={3}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Add Available Stock
      </Typography>

      {/* DATE */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography fontWeight={600} mb={1}>
          Date <span style={{ color: "red" }}>*</span>
        </Typography>
        <TextField type="date" size="small" defaultValue="2026-01-23" />
      </Paper>

      {/* TABLE */}
      <Paper sx={{ p: 2 }}>
        <Box
          display="grid"
          gridTemplateColumns="3fr 2fr 2fr 3fr 40px"
          gap={2}
          fontWeight={600}
          mb={1}
        >
          <Typography>Raw Material</Typography>
          <Typography>Available Stock</Typography>
          <Typography>Unit</Typography>
          <Typography>Comments</Typography>
          <Box />
        </Box>

      <Divider />

        {rows.map((row, index) => (
          <Box
            key={index}
            display="grid"
            gridTemplateColumns="3fr 2fr 2fr 3fr 40px"
            gap={2}
            alignItems="center"
            mt={2}
          >
            {/* ✅ RAW MATERIAL NAME */}
            <Select
              size="small"
              displayEmpty
              value={row.material}
              onChange={(e) =>
                handleMaterialChange(index, e.target.value)
              }
            >
              <MenuItem value="">Select Raw Material</MenuItem>
              {rawMaterials.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.name}
                </MenuItem>
              ))}
            </Select>

            <TextField
              size="small"
              placeholder="Available Stock"
              value={row.qty}
              onChange={(e) =>
                handleChange(index, "qty", e.target.value)
              }
            />

            {/* ✅ UNIT NAME (DISABLED & PRE-FILLED) */}
            <Select
              size="small"
              displayEmpty
              value={row.unit}
              disabled
              onChange={(e) =>
                handleChange(index, "unit", e.target.value)
              }
            >
              <MenuItem value="">Unit</MenuItem>
              {units.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.unit_name}
                </MenuItem>
              ))}
            </Select>

            <TextField
              size="small"
              placeholder="Comments"
              value={row.comment}
              onChange={(e) =>
                handleChange(index, "comment", e.target.value)
              }
            />

            <IconButton
              color="error"
              onClick={() => removeRow(index)}
              disabled={rows.length === 1}
            >
              <Delete />
            </IconButton>
          </Box>
        ))}
      </Paper>

      {/* ACTION BAR */}
      <Paper
        sx={{
          p: 2,
          mt: 3,
          background: "#fdecec",
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <Button
          variant="outlined"
          color="error"
          startIcon={<Add />}
          onClick={addRow}
        >
          Add New
        </Button>

        <Box>
          <Button variant="outlined" sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddStock;