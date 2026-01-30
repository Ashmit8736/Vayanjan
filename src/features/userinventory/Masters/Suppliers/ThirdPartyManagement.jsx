// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Paper,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Checkbox,
//   IconButton,
//   Dialog,
//   DialogContent,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { useState } from "react";
// import AddSupplier from "./AddSupplier";

// const ThirdPartyManagement = () => {
//   const [openForm, setOpenForm] = useState(false);

//   return (
//     <Box sx={{ p: 3 }}>
//       {/* ===== HEADER ===== */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           mb: 2,
//         }}
//       >
//         <Typography fontSize={18} fontWeight={700}>
//           Supplier / Third Party Management
//         </Typography>

//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={() => setOpenForm(true)}
//           sx={{
//             bgcolor: "#C62828",
//             textTransform: "none",
//             "&:hover": { bgcolor: "#B71C1C" },
//           }}
//         >
//           Add Supplier
//         </Button>
//       </Box>

//       {/* ===== FILTERS ===== */}
//       <Paper sx={{ p: 2, mb: 2 }}>
//         <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
//           <TextField size="small" label="Name" />
//           <TextField size="small" label="Company" />
//           <Button variant="outlined">Search</Button>
//           <Button variant="text">Clear</Button>
//         </Box>
//       </Paper>

//       {/* ===== TABLE ===== */}
//       <Paper>
//         <Table>
//           <TableHead sx={{ bgcolor: "#F1F5F9" }}>
//             <TableRow>
//               <TableCell padding="checkbox">
//                 <Checkbox />
//               </TableCell>
//               <TableCell>Name</TableCell>
//               <TableCell>Type</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>Company</TableCell>
//               <TableCell>Phone</TableCell>
//               <TableCell>GST No</TableCell>
//               <TableCell>FSSAI Lic No.</TableCell>
//               <TableCell>Mapping Status</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell align="center">Action</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {[
//               {
//                 name: "Sundar trading company",
//                 type: "Both",
//                 company: "Sundar trading company",
//               },
//               {
//                 name: "Vijay Gokhle",
//                 type: "Both",
//                 company: "Vijay Parchun Shop",
//               },
//               {
//                 name: "Rahul Rastogi",
//                 type: "Both",
//                 company: "R R General Store",
//               },
//             ].map((row, index) => (
//               <TableRow key={index}>
//                 <TableCell padding="checkbox">
//                   <Checkbox />
//                 </TableCell>
//                 <TableCell>{row.name}</TableCell>
//                 <TableCell>{row.type}</TableCell>
//                 <TableCell>-</TableCell>
//                 <TableCell>{row.company}</TableCell>
//                 <TableCell>-</TableCell>
//                 <TableCell>-</TableCell>
//                 <TableCell>-</TableCell>
//                 <TableCell>Unmapped</TableCell>
//                 <TableCell>Active</TableCell>
//                 <TableCell align="center">
//                   <IconButton size="small">
//                     <EditIcon fontSize="small" />
//                   </IconButton>
//                   <IconButton size="small">
//                     <MoreVertIcon fontSize="small" />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>

//         <Box sx={{ p: 2, fontSize: 13, color: "gray" }}>
//           Showing 1 to 3 of 3 records
//         </Box>
//       </Paper>

//       {/* ===== ADD SUPPLIER MODAL ===== */}
//       <Dialog
//         open={openForm}
//         onClose={() => setOpenForm(false)}
//         maxWidth="lg"
//         fullWidth
//       >
//         <DialogContent dividers>
//           <AddSupplier onClose={() => setOpenForm(false)} />
//         </DialogContent>
//       </Dialog>
//     </Box>
//   );
// };

// export default ThirdPartyManagement;












import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  IconButton,
  Dialog,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect, useState } from "react";
import AddSupplier from "./AddSupplier";
import axios from "axios";

const ThirdPartyManagement = () => {
  const [openForm, setOpenForm] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===== GET SUPPLIERS API =====
//   const fetchSuppliers = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         "http://localhost:5000/api/suppliers/get"
//       );

//       if (res.data.success) {
//         setSuppliers(res.data.data);
//       }
//     } catch (error) {
//       console.error("Failed to fetch suppliers", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSuppliers();
//   }, []);

const fetchSuppliers = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("authToken"); // 👈 IMPORTANT

    const res = await axios.get(
      "http://localhost:5000/api/suppliers/get",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.success) {
      setSuppliers(res.data.data);
    }
  } catch (error) {
    console.error("Failed to fetch suppliers", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
    fetchSuppliers();
  }, []);


  return (
    <Box sx={{ p: 3 }}>
      {/* ===== HEADER ===== */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography fontSize={18} fontWeight={700}>
          Supplier / Third Party Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
          sx={{
            bgcolor: "#C62828",
            textTransform: "none",
            "&:hover": { bgcolor: "#B71C1C" },
          }}
        >
          Add Supplier
        </Button>
      </Box>

      {/* ===== FILTERS (UI only for now) ===== */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField size="small" label="Name" />
          <TextField size="small" label="Company" />
          <Button variant="outlined">Search</Button>
          <Button variant="text">Clear</Button>
        </Box>
      </Paper>

      {/* ===== TABLE ===== */}
      <Paper>
        {loading ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: "#F1F5F9" }}>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Company Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Billing Address</TableCell>
                <TableCell>Shipping Address</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {suppliers.map((row) => (
                <TableRow key={row.id}>

                  <TableCell>{row.name}</TableCell>

                  <TableCell>
                    {row.tcs_type === "purchase" ? "Purchase" : "Both"}
                  </TableCell>

                  <TableCell>{row.email || "-"}</TableCell>

                  <TableCell>{row.company_name}</TableCell>

                  <TableCell>{row.phone}</TableCell>

                  <TableCell>
                    {row.billing_address}, {row.billing_city},{" "}
                    {row.billing_state} - {row.billing_pincode}
                  </TableCell>

                  <TableCell>
                    {row.shipping_address}, {row.shipping_city},{" "}
                    {row.shipping_state} - {row.shipping_pincode}
                  </TableCell>

                  <TableCell>
                    {row.is_active === 1 ? "Active" : "Inactive"}
                  </TableCell>

                  <TableCell align="center">
                    <IconButton size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {suppliers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No suppliers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        <Box sx={{ p: 2, fontSize: 13, color: "gray" }}>
          Showing 1 to {suppliers.length} of {suppliers.length} records
        </Box>
      </Paper>

      {/* ===== ADD SUPPLIER MODAL ===== */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent dividers>
          <AddSupplier
            onClose={() => {
              setOpenForm(false);
              fetchSuppliers(); // refresh list after add
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ThirdPartyManagement;
