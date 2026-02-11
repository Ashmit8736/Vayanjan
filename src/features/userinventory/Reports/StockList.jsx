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

/* 🔹 Date formatter */
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB"); // DD/MM/YYYY
};

const StockList = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

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
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (mounted) {
          setRows(res.data?.data || []);
        }
      } catch (err) {
        console.error("❌ Stock list API error", err);
        if (mounted) setRows([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchStockList();

    return () => {
      mounted = false;
    };
  }, []);

//   const handleRowClick = (poNumber) => {
//     navigate(`/reports/stock-report/${poNumber}`);
//   };
const handleRowClick = (poNumber) => {
  navigate(`/inventory/reports/stock-report/${poNumber}`);
};

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Stock List
      </Typography>

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
              <TableCell colSpan={4} align="center">
                Loading...
              </TableCell>
            </TableRow>
          )}

          {!loading &&
            rows.map((row) => (
              <TableRow
                key={row.po_number}
                hover
                sx={{ cursor: "pointer" }}
                // onClick={() => handleRowClick(row.id)}
                onClick={() => handleRowClick(row.po_number)}

              >
                <TableCell sx={{ color: "#2563EB", fontWeight: 600 }}>
                  {row.po_number}
                </TableCell>

                <TableCell>
                  {formatDate(row.invoice_date)}
                </TableCell>

                <TableCell>{row.supplier_name}</TableCell>

                <TableCell align="right">
                  ₹ {Number(row.grand_total || 0).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}

          {!loading && rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default StockList;