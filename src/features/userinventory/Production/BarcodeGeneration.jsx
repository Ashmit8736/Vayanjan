// import { useState } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   Select,
//   MenuItem,
//   TextField,
//   Button,
//   Switch,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   IconButton,
//   Stack,
//   Divider
// } from "@mui/material";
// import DeleteOutline from "@mui/icons-material/DeleteOutline";

// const BarcodeGeneration = () => {
//   const [bulkUpload, setBulkUpload] = useState(false);
//   const [rawMaterial, setRawMaterial] = useState("");
//   const [prints, setPrints] = useState(1);
//   const [barcode, setBarcode] = useState("");
//   const [rows, setRows] = useState([]);

//   const handleAdd = () => {
//     if (!rawMaterial) return;

//     setRows([
//       ...rows,
//       {
//         id: Date.now(),
//         rawMaterial,
//         prints,
//         barcode
//       }
//     ]);

//     setRawMaterial("");
//     setPrints(1);
//     setBarcode("");
//   };

//   const handleDelete = (id) => {
//     setRows(rows.filter((r) => r.id !== id));
//   };

//   return (
//     <Box p={2}>
//       <Typography fontSize={20} fontWeight={700} mb={2}>
//         Barcode Generation
//       </Typography>

//       {/* Select Raw Material */}
//       <Paper sx={{ p: 2, mb: 3 }}>
//         <Stack direction="row" justifyContent="space-between" mb={2}>
//           <Typography fontWeight={600}>Select Raw Materials</Typography>

//           <Stack direction="row" alignItems="center" spacing={1}>
//             <Typography fontSize={14}>Bulk Upload</Typography>
//             <Switch
//               checked={bulkUpload}
//               onChange={(e) => setBulkUpload(e.target.checked)}
//             />
//           </Stack>
//         </Stack>

//         {!bulkUpload && (
//           <Stack direction="row" spacing={2} alignItems="center">
//             <Select
//               value={rawMaterial}
//               onChange={(e) => setRawMaterial(e.target.value)}
//               displayEmpty
//               sx={{ minWidth: 200 }}
//             >
//               <MenuItem value="">
//                 <em>Select Raw Material</em>
//               </MenuItem>
//               <MenuItem value="Sugar">Sugar</MenuItem>
//               <MenuItem value="Ghee">Ghee</MenuItem>
//               <MenuItem value="Flour">Flour</MenuItem>
//             </Select>

//             <TextField
//               type="number"
//               label="Number of prints"
//               value={prints}
//               onChange={(e) => setPrints(e.target.value)}
//               sx={{ width: 160 }}
//             />

//             <TextField
//               label="Raw Materialn Barcode"
//               value={barcode}
//               onChange={(e) => setBarcode(e.target.value)}
//               sx={{ width: 220 }}
//             />

//             <Button variant="outlined" onClick={handleAdd}>
//               Add
//             </Button>
//           </Stack>
//         )}
//       </Paper>

//       {/* Summary Table */}
//       <Paper sx={{ p: 2 }}>
//         <Stack direction="row" justifyContent="space-between" mb={2}>
//           <Typography fontWeight={600}>
//             Selected Raw Material Summary
//           </Typography>

//           <Button size="small" onClick={() => setRows([])}>
//             Clear All
//           </Button>
//         </Stack>

//         <Divider />

//         {rows.length === 0 ? (
//           <Box textAlign="center" py={6} color="gray">
//             No Record Found
//           </Box>
//         ) : (
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Raw Material</TableCell>
//                 <TableCell>Number Of Prints</TableCell>
//                 <TableCell>Raw Material Barcode</TableCell>
//                 <TableCell>Action</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {rows.map((row) => (
//                 <TableRow key={row.id}>
//                   <TableCell>{row.rawMaterial}</TableCell>
//                   <TableCell>{row.prints}</TableCell>
//                   <TableCell>{row.barcode || "-"}</TableCell>
//                   <TableCell>
//                     <IconButton onClick={() => handleDelete(row.id)}>
//                       <DeleteOutline color="error" />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         )}
//       </Paper>
//     </Box>
//   );
// };

// export default BarcodeGeneration;













import { useState, useEffect } from "react";
import axios from "axios";
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
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteOutline from "@mui/icons-material/DeleteOutline";

const BarcodeGeneration = () => {
  const [bulkUpload, setBulkUpload] = useState(false);
  const [rawMaterial, setRawMaterial] = useState("");
  const [prints, setPrints] = useState(1);
  const [barcode, setBarcode] = useState("");
  const [rows, setRows] = useState([]);

  const [rawMaterials, setRawMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // ✅ Same API as RawMaterials.jsx — http://localhost:5000/api/raw/get
  useEffect(() => {
    const fetchRawMaterials = async () => {
      try {
        setLoadingMaterials(true);
        const token = localStorage.getItem("authToken");
        const res = await axios.get("http://localhost:5000/api/raw/get", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Same response shape handling as RawMaterials.jsx
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
        setRawMaterials(list);
      } catch (error) {
        console.error("Error fetching raw materials:", error);
        setSnackbar({ open: true, message: "Failed to load raw materials", severity: "error" });
      } finally {
        setLoadingMaterials(false);
      }
    };
    fetchRawMaterials();
  }, []);

  // ✅ When raw material selected → auto-fill its barcode from DB
  const handleRawMaterialChange = (e) => {
    const selectedId = e.target.value;
    setRawMaterial(selectedId);
    const found = rawMaterials.find((m) => m.id === selectedId);
    setBarcode(found?.barcode || "");
  };

  const handleAdd = () => {
    if (!rawMaterial) {
      setSnackbar({ open: true, message: "Please select a raw material", severity: "warning" });
      return;
    }
    const found = rawMaterials.find((m) => m.id === rawMaterial);
    setRows([
      ...rows,
      {
        id: Date.now(),
        rawMaterialId: rawMaterial,
        rawMaterial: found?.name || rawMaterial,
        prints: Number(prints) || 1,
        barcode: barcode || found?.barcode || "-",
      },
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
            <Switch checked={bulkUpload} onChange={(e) => setBulkUpload(e.target.checked)} />
          </Stack>
        </Stack>

        {!bulkUpload && (
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
            {/* ✅ Dropdown from API - all raw materials show here */}
            <Select
              value={rawMaterial}
              onChange={handleRawMaterialChange}
              displayEmpty
              sx={{ minWidth: 220 }}
              disabled={loadingMaterials}
            >
              <MenuItem value="">
                {loadingMaterials ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={14} />
                    <em>Loading...</em>
                  </Stack>
                ) : (
                  <em>Select Raw Material</em>
                )}
              </MenuItem>
              {rawMaterials.map((mat) => (
                <MenuItem key={mat.id} value={mat.id}>
                  {mat.name}
                </MenuItem>
              ))}
            </Select>

            <TextField
              type="number"
              label="Number of prints"
              value={prints}
              onChange={(e) => setPrints(e.target.value)}
              inputProps={{ min: 1 }}
              sx={{ width: 160 }}
            />

            {/* ✅ Barcode auto-fills when material selected, can also edit manually */}
            <TextField
              label="Raw Material Barcode"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              sx={{ width: 220 }}
            />

            <Button
              variant="outlined"
              onClick={handleAdd}
              disabled={!rawMaterial || loadingMaterials}
            >
              Add
            </Button>
          </Stack>
        )}
      </Paper>

      {/* Summary Table */}
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Typography fontWeight={600}>Selected Raw Material Summary</Typography>
          <Button size="small" onClick={() => setRows([])} disabled={rows.length === 0}>
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
              <TableRow sx={{ bgcolor: "#F1F5F9" }}>
                <TableCell><b>Raw Material</b></TableCell>
                <TableCell><b>Number Of Prints</b></TableCell>
                <TableCell><b>Raw Material Barcode</b></TableCell>
                <TableCell><b>Action</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.rawMaterial}</TableCell>
                  <TableCell>{row.prints}</TableCell>
                  <TableCell>{row.barcode}</TableCell>
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

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BarcodeGeneration;