import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  Switch,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Stack,
  Divider
} from "@mui/material";
import DeleteOutline from "@mui/icons-material/DeleteOutline";

const BarcodeGeneration = () => {
  const [bulkUpload, setBulkUpload] = useState(false);
  const [rawMaterial, setRawMaterial] = useState("");
  const [prints, setPrints] = useState(1);
  const [barcode, setBarcode] = useState("");
  const [rows, setRows] = useState([]);

  const handleAdd = () => {
    if (!rawMaterial) return;

    setRows([
      ...rows,
      {
        id: Date.now(),
        rawMaterial,
        prints,
        barcode
      }
    ]);

    setRawMaterial("");
    setPrints(1);
    setBarcode("");
  };

  const handleDelete = (id) => {
    setRows(rows.filter((r) => r.id !== id));
  };

  return (
    <Box p={2}>
      <Typography fontSize={20} fontWeight={700} mb={2}>
        Barcode Generation
      </Typography>

      {/* Select Raw Material */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Typography fontWeight={600}>Select Raw Materials</Typography>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography fontSize={14}>Bulk Upload</Typography>
            <Switch
              checked={bulkUpload}
              onChange={(e) => setBulkUpload(e.target.checked)}
            />
          </Stack>
        </Stack>

        {!bulkUpload && (
          <Stack direction="row" spacing={2} alignItems="center">
            <Select
              value={rawMaterial}
              onChange={(e) => setRawMaterial(e.target.value)}
              displayEmpty
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">
                <em>Select Raw Material</em>
              </MenuItem>
              <MenuItem value="Sugar">Sugar</MenuItem>
              <MenuItem value="Ghee">Ghee</MenuItem>
              <MenuItem value="Flour">Flour</MenuItem>
            </Select>

            <TextField
              type="number"
              label="Number of prints"
              value={prints}
              onChange={(e) => setPrints(e.target.value)}
              sx={{ width: 160 }}
            />

            <TextField
              label="Raw Materialn Barcode"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              sx={{ width: 220 }}
            />

            <Button variant="outlined" onClick={handleAdd}>
              Add
            </Button>
          </Stack>
        )}
      </Paper>

      {/* Summary Table */}
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Typography fontWeight={600}>
            Selected Raw Material Summary
          </Typography>

          <Button size="small" onClick={() => setRows([])}>
            Clear All
          </Button>
        </Stack>

        <Divider />

        {rows.length === 0 ? (
          <Box textAlign="center" py={6} color="gray">
            No Record Found
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Raw Material</TableCell>
                <TableCell>Number Of Prints</TableCell>
                <TableCell>Raw Material Barcode</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.rawMaterial}</TableCell>
                  <TableCell>{row.prints}</TableCell>
                  <TableCell>{row.barcode || "-"}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDelete(row.id)}>
                      <DeleteOutline color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};

export default BarcodeGeneration;