// import {
//   Paper,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Typography,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";

// /* 🔹 Safe JWT decode */
// const getBranchIdFromToken = () => {
//   try {
//     const token = localStorage.getItem("authToken");
//     if (!token) return null;

//     const payload = JSON.parse(atob(token.split(".")[1]));
//     return payload?.branch_id || null;
//   } catch (err) {
//     console.error("❌ JWT decode failed", err);
//     return null;
//   }
// };

// /* 🔹 Date formatter */
// const formatDate = (dateStr) => {
//   if (!dateStr) return "-";
//   const d = new Date(dateStr);
//   return d.toLocaleDateString("en-GB"); // DD/MM/YYYY
// };

// const StockList = () => {
//   const navigate = useNavigate();
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     let mounted = true;

//     const fetchStockList = async () => {
//       try {
//         setLoading(true);

//         const token = localStorage.getItem("authToken");
//         const branchId = getBranchIdFromToken();

//         if (!token || !branchId) {
//           console.error("❌ Token / Branch missing");
//           return;
//         }

//         const res = await axios.get(
//           `http://localhost:5000/api/stockPurchaseItems/stockPurchaseItems/list/${branchId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (mounted) {
//           setRows(res.data?.data || []);
//         }
//       } catch (err) {
//         console.error("❌ Stock list API error", err);
//         if (mounted) setRows([]);
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     fetchStockList();

//     return () => {
//       mounted = false;
//     };
//   }, []);

// //   const handleRowClick = (poNumber) => {
// //     navigate(`/reports/stock-report/${poNumber}`);
// //   };
// const handleRowClick = (poNumber) => {
//   navigate(`/inventory/reports/stock-report/${poNumber}`);
// };

//   return (
//     <Paper sx={{ p: 2 }}>
//       <Typography variant="h6" fontWeight={700} mb={2}>
//         Stock List
//       </Typography>

//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell><b>PO Number</b></TableCell>
//             <TableCell><b>Invoice Date</b></TableCell>
//             <TableCell><b>Supplier Name</b></TableCell>
//             <TableCell align="right"><b>Grand Total</b></TableCell>
//           </TableRow>
//         </TableHead>

//         <TableBody>
//           {loading && (
//             <TableRow>
//               <TableCell colSpan={4} align="center">
//                 Loading...
//               </TableCell>
//             </TableRow>
//           )}

//           {!loading &&
//             rows.map((row) => (
//               <TableRow
//                 key={row.po_number}
//                 hover
//                 sx={{ cursor: "pointer" }}
//                 // onClick={() => handleRowClick(row.id)}
//                 onClick={() => handleRowClick(row.po_number)}

//               >
//                 <TableCell sx={{ color: "#2563EB", fontWeight: 600 }}>
//                   {row.po_number}
//                 </TableCell>

//                 <TableCell>
//                   {formatDate(row.invoice_date)}
//                 </TableCell>

//                 <TableCell>{row.supplier_name}</TableCell>

//                 <TableCell align="right">
//                   ₹ {Number(row.grand_total || 0).toFixed(2)}
//                 </TableCell>
//               </TableRow>
//             ))}

//           {!loading && rows.length === 0 && (
//             <TableRow>
//               <TableCell colSpan={4} align="center">
//                 No records found
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </Paper>
//   );
// };

// export default StockList;




import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box,
  TextField,
  MenuItem,
  Select,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const getBranchIdFromToken = () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.branch_id || null;
  } catch (err) {
    console.error("❌ JWT decode failed", err);
    return null;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB");
};

const StockList = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchMonth, setSearchMonth] = useState("");

  // Pagination State
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    let mounted = true;

    const fetchStockList = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const branchId = getBranchIdFromToken();

        if (!token || !branchId) {
          console.error("❌ Token / Branch missing");
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/stockPurchaseItems/stockPurchaseItems/list/${branchId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (mounted) setRows(res.data?.data || []);
      } catch (err) {
        console.error("❌ Stock list API error", err);
        if (mounted) setRows([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchStockList();
    return () => { mounted = false; };
  }, []);

  const handleRowClick = (poNumber) => {
    navigate(`/inventory/reports/stock-report/${poNumber}`);
  };

  // ✅ FILTER
  const filteredRows = rows.filter((row) => {
    const matchName =
      searchName === "" ||
      row.supplier_name?.toLowerCase().includes(searchName.toLowerCase());

    const matchMonth =
      searchMonth === "" ||
      (row.invoice_date &&
        new Date(row.invoice_date).getMonth() + 1 === Number(searchMonth));

    return matchName && matchMonth;
  });

  useEffect(() => {
    setPage(1);
  }, [searchName, searchMonth, rows]);

  const safeFilteredRows = Array.isArray(filteredRows) ? filteredRows : [];
  const totalPages = Math.ceil(safeFilteredRows.length / itemsPerPage);
  const paginatedRows = safeFilteredRows.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Stock List
      </Typography>

      {/* ✅ SEARCH BAR */}
      <Box display="flex" gap={2} mb={2}>
        <TextField
          size="small"
          placeholder="Search by Supplier Name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          sx={{ width: 250 }}
        />

        <Select
          size="small"
          displayEmpty
          value={searchMonth}
          onChange={(e) => setSearchMonth(e.target.value)}
          sx={{ width: 180 }}
        >
          <MenuItem value="">All Months</MenuItem>
          <MenuItem value="1">January</MenuItem>
          <MenuItem value="2">February</MenuItem>
          <MenuItem value="3">March</MenuItem>
          <MenuItem value="4">April</MenuItem>
          <MenuItem value="5">May</MenuItem>
          <MenuItem value="6">June</MenuItem>
          <MenuItem value="7">July</MenuItem>
          <MenuItem value="8">August</MenuItem>
          <MenuItem value="9">September</MenuItem>
          <MenuItem value="10">October</MenuItem>
          <MenuItem value="11">November</MenuItem>
          <MenuItem value="12">December</MenuItem>
        </Select>
      </Box>

      {/* ✅ TABLE */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>PO Number</b></TableCell>
            <TableCell><b>Invoice Date</b></TableCell>
            <TableCell><b>Supplier Name</b></TableCell>
            <TableCell align="right"><b>Grand Total</b></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={4} align="center">Loading...</TableCell>
            </TableRow>
          )}

          {!loading && paginatedRows.map((row) => (
            <TableRow
              key={row.po_number}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => handleRowClick(row.po_number)}
            >
              <TableCell sx={{ color: "#2563EB", fontWeight: 600 }}>
                {row.po_number}
              </TableCell>
              <TableCell>{formatDate(row.invoice_date)}</TableCell>
              <TableCell>{row.supplier_name}</TableCell>
              <TableCell align="right">
                ₹ {Number(row.grand_total || 0).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}

          {!loading && filteredRows.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">No records found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* ================= PAGINATION ================= */}
      {totalPages > 0 && (
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} px={1}>
          <Typography variant="body2" color="text.secondary">
            Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, safeFilteredRows.length)} of {safeFilteredRows.length} records
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Button
              size="small"
              variant="outlined"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              sx={{ textTransform: "none", minWidth: "60px", color: "#64748B", borderColor: "#CBD5E1" }}
            >
              Prev
            </Button>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: "#1976d2",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              {page}
            </Box>
            <Button
              size="small"
              variant="outlined"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              sx={{ textTransform: "none", minWidth: "60px", color: "#64748B", borderColor: "#CBD5E1" }}
            >
              Next
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default StockList;