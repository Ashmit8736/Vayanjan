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
import { useState } from "react";

const rawMaterials = [
  "Aam Papad",
  "Amul Cream",
  "Apple Green Powder",
  "Atta",
  "Besan"
];

const units = ["Kg", "GM", "Milligram", "Ltr", "ML"];

const AddStock = () => {
  const [rows, setRows] = useState([
    { material: "", qty: "", unit: "", comment: "" }
  ]);

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
        <TextField
          type="date"
          size="small"
          defaultValue="2026-01-23"
        />
      </Paper>

      {/* TABLE HEADER */}
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

        {/* ROWS */}
        {rows.map((row, index) => (
          <Box
            key={index}
            display="grid"
            gridTemplateColumns="3fr 2fr 2fr 3fr 40px"
            gap={2}
            alignItems="center"
            mt={2}
          >
            <Select
              size="small"
              displayEmpty
              value={row.material}
              onChange={(e) =>
                handleChange(index, "material", e.target.value)
              }
            >
              <MenuItem value="">Select Raw Material</MenuItem>
              {rawMaterials.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
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

            <Select
              size="small"
              displayEmpty
              value={row.unit}
              onChange={(e) =>
                handleChange(index, "unit", e.target.value)
              }
            >
              <MenuItem value="">Unit</MenuItem>
              {units.map((u) => (
                <MenuItem key={u} value={u}>
                  {u}
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
          <Button variant="contained" color="error">
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddStock;
