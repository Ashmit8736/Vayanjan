// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   MenuItem,
//   Paper,
//   Stack
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import SearchIcon from "@mui/icons-material/Search";
// import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import { useState } from "react";
// import AddPurchase from "./AddPurchase";

// const StockPurchase = () => {
//   const [openPurchase, setOpenPurchase] = useState(false);

//   return (
//     <Box sx={{ p: 3, bgcolor: "#F8FAFC", minHeight: "100vh" }}>

//       {/* ===== HEADER ===== */}
//       <Stack direction="row" justifyContent="space-between" mb={2}>
//         <Typography fontSize={20} fontWeight={700}>
//           Purchase List
//         </Typography>

//         <Stack direction="row" spacing={1}>
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             sx={{ bgcolor: "#DC2626" }}
//             onClick={() => setOpenPurchase(true)}
//           >
//             Create New
//           </Button>

//           <Button
//             variant="outlined"
//             startIcon={<QrCodeScannerIcon />}
//             sx={{ borderColor: "#DC2626", color: "#DC2626" }}
//           >
//             Scan & Purchase
//           </Button>

//           <Button variant="outlined" startIcon={<FileDownloadIcon />}>
//             Export
//           </Button>
//         </Stack>
//       </Stack>

//       {/* ===== FILTER BAR ===== */}
//       <Paper sx={{ p: 2, mb: 3 }}>
//         <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">

//           <TextField
//             size="small"
//             label="Start Date"
//             type="date"
//             InputLabelProps={{ shrink: true }}
//           />

//           <TextField
//             size="small"
//             label="End Date"
//             type="date"
//             InputLabelProps={{ shrink: true }}
//           />

//           <TextField select size="small" label="From" defaultValue="All">
//             <MenuItem value="All">All</MenuItem>
//             <MenuItem value="Supplier">Supplier</MenuItem>
//           </TextField>

//           <TextField size="small" label="Invoice No." />

//           <Button startIcon={<FilterAltOutlinedIcon />} variant="outlined">
//             More Filters
//           </Button>

//           <Button
//             variant="contained"
//             startIcon={<SearchIcon />}
//             sx={{ bgcolor: "#DC2626" }}
//           >
//             Search
//           </Button>

//           <Button variant="text">Clear</Button>
//         </Stack>
//       </Paper>

//       {/* EMPTY STATE */}
//       <Paper
//         sx={{
//           height: 380,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center"
//         }}
//       >
//         <Typography color="text.secondary">
//           No Purchase Found
//         </Typography>
//       </Paper>

//       {/* ===== ADD PURCHASE MODAL ===== */}
//       <AddPurchase
//         open={openPurchase}
//         onClose={() => setOpenPurchase(false)}
//       />

//     </Box>
//   );
// };

// export default StockPurchase;






import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { useEffect, useState } from "react";
import AddPurchase from "./AddPurchase";
import axios from "axios";

const StockPurchase = () => {
  const [openPurchase, setOpenPurchase] = useState(false);
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= GET STOCK PURCHASE ================= */

  const fetchStock = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("authToken");

      const res = await axios.get(
        "http://localhost:5000/api/stockPurchaseItems/stock",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setStockData(res.data.data);
      } else {
        setStockData([]);
      }
    } catch (error) {
      console.error("❌ Stock fetch error:", error);
      setStockData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  return (
    <Box sx={{ p: 3, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      {/* ===== HEADER ===== */}
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography fontSize={20} fontWeight={700}>
          Purchase Stock
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ bgcolor: "#DC2626" }}
            onClick={() => setOpenPurchase(true)}
          >
            Create New
          </Button>

          <Button
            variant="outlined"
            startIcon={<QrCodeScannerIcon />}
            sx={{ borderColor: "#DC2626", color: "#DC2626" }}
          >
            Scan & Purchase
          </Button>

          <Button variant="outlined" startIcon={<FileDownloadIcon />}>
            Export
          </Button>
        </Stack>
      </Stack>

      {/* ===== FILTER BAR (UI ONLY) ===== */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <TextField
            size="small"
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            size="small"
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
          />

          <TextField select size="small" label="From" defaultValue="All">
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Supplier">Supplier</MenuItem>
          </TextField>

          <TextField size="small" label="Invoice No." />

          <Button startIcon={<FilterAltOutlinedIcon />} variant="outlined">
            More Filters
          </Button>

          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            sx={{ bgcolor: "#DC2626" }}
          >
            Search
          </Button>

          <Button variant="text">Clear</Button>
        </Stack>
      </Paper>

      {/* ===== TABLE ===== */}
      <Paper>
        {loading ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        ) : stockData.length === 0 ? (
          <Box
            sx={{
              height: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography color="text.secondary">
              No Purchase Found
            </Typography>
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: "#F1F5F9" }}>
              <TableRow>
                <TableCell>Raw Material</TableCell>
                <TableCell>Purchase Qty</TableCell>
                {/* <TableCell>Purchase Unit</TableCell> */}
                <TableCell>Consume Qty</TableCell>
                {/* <TableCell>Consume Unit</TableCell> */}
                <TableCell>Conversion Factor</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {stockData.map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell>{row.raw_material_name}</TableCell>

                  <TableCell>
                    {Number(row.purchase_quantity).toLocaleString()} {row.purchase_unit_symbol}
                  </TableCell>

                  {/* <TableCell>
                    {row.purchase_unit} ({row.purchase_unit_symbol})
                  </TableCell> */}

                  <TableCell>
                    {Number(row.consume_quantity).toLocaleString()} {row.consume_unit_symbol}
                  </TableCell>

                  {/* <TableCell>
                    {row.consume_unit} ({row.consume_unit_symbol})
                  </TableCell> */}
  
                  <TableCell>{row.conversion_factor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* ===== ADD PURCHASE MODAL ===== */}
      <AddPurchase
        open={openPurchase}
        onClose={() => {
          setOpenPurchase(false);
          fetchStock(); // 🔥 refresh after add
        }}
      />
    </Box>
  );
};

export default StockPurchase;