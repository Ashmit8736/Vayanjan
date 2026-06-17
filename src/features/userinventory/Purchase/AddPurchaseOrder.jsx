// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Grid,
//   TextField,
//   Button,
//   MenuItem,
//   Checkbox,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   FormControl,
//   Select,
//   InputAdornment
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import LocalShippingIcon from "@mui/icons-material/LocalShipping";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import EditNoteIcon from "@mui/icons-material/EditNote";
// import axios from "axios";

// const AddPurchaseOrder = ({ onClose }) => {
//   const token = localStorage.getItem("authToken");

//   /* ================= MASTER DATA ================= */
//   const [suppliers, setSuppliers] = useState([]);
//   const [rawMaterials, setRawMaterials] = useState([]);
//   const [units, setUnits] = useState([]);

//   /* ================= STATE VARIABLES ================= */
//   const [supplierId, setSupplierId] = useState("");
//   const [deliveryDate, setDeliveryDate] = useState(
//     new Date().toISOString().substring(0, 10)
//   );
//   const [deliveryTime, setDeliveryTime] = useState("");
//   const [poNumber, setPoNumber] = useState(
//     `PO-${Math.floor(100000 + Math.random() * 900000)}`
//   );
//   const [recipientCanEdit, setRecipientCanEdit] = useState(true);

//   // Other Details Modal States
//   const [openOtherDetails, setOpenOtherDetails] = useState(false);
//   const [invoiceNumber, setInvoiceNumber] = useState("");
//   const [taxAmount, setTaxAmount] = useState(0);
//   const [discountAmount, setDiscountAmount] = useState(0);
//   const [paymentStatus, setPaymentStatus] = useState("pending");

//   // Delivery Charges Modal States
//   const [openDeliveryCharges, setOpenDeliveryCharges] = useState(false);
//   const [deliveryCharges, setDeliveryCharges] = useState(0);

//   // Table Row State
//   const [rows, setRows] = useState([
//     {
//       checked: false,
//       raw_material_id: "",
//       quantity: "",
//       unit_id: "",
//       unit_price: "",
//       amount: 0
//     }
//   ]);

//   /* ================= FETCH DATA ================= */
//   useEffect(() => {
//     fetchSuppliers();
//     fetchRawMaterials();
//     fetchUnits();
//   }, []);

//   const fetchSuppliers = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/suppliers/get", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (res.data.success) setSuppliers(res.data.data);
//     } catch (err) {
//       console.error("Error fetching suppliers:", err);
//     }
//   };

//   const fetchRawMaterials = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/raw/get", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setRawMaterials(Array.isArray(res.data.data) ? res.data.data : res.data);
//     } catch (err) {
//       console.error("Error fetching raw materials:", err);
//     }
//   };

//   const fetchUnits = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/units/getUnit");
//       setUnits(Array.isArray(res.data.data) ? res.data.data : res.data);
//     } catch (err) {
//       console.error("Error fetching units:", err);
//     }
//   };

//   /* ================= HANDLERS ================= */
//   const handleAddRow = () => {
//     setRows([
//       ...rows,
//       {
//         checked: false,
//         raw_material_id: "",
//         quantity: "",
//         unit_id: "",
//         unit_price: "",
//         amount: 0
//       }
//     ]);
//   };

//   const handleDeleteRow = (index) => {
//     if (rows.length === 1) {
//       setRows([
//         {
//           checked: false,
//           raw_material_id: "",
//           quantity: "",
//           unit_id: "",
//           unit_price: "",
//           amount: 0
//         }
//       ]);
//     } else {
//       setRows(rows.filter((_, i) => i !== index));
//     }
//   };

//   const handleRowCheckbox = (index) => {
//     const updated = [...rows];
//     updated[index].checked = !updated[index].checked;
//     setRows(updated);
//   };

//   const handleSelectAllRows = (e) => {
//     const checked = e.target.checked;
//     setRows(rows.map(r => ({ ...r, checked })));
//   };

//   const handleRowChange = (index, field, value) => {
//     const updated = [...rows];
//     updated[index][field] = value;

//     if (field === "quantity" || field === "unit_price") {
//       const qty = Number(updated[index].quantity || 0);
//       const price = Number(updated[index].unit_price || 0);
//       updated[index].amount = qty * price;
//     }

//     setRows(updated);
//   };

//   const handleMaterialChange = (index, materialId) => {
//     const updated = [...rows];
//     updated[index].raw_material_id = materialId;
//     const mat = rawMaterials.find(rm => rm.id === Number(materialId));
//     if (mat) {
//       updated[index].unit_id = mat.purchase_unit_id || "";
//       updated[index].unit_price = mat.purchase_price !== undefined ? mat.purchase_price : "";
//       const qty = Number(updated[index].quantity || 0);
//       const price = Number(updated[index].unit_price || 0);
//       updated[index].amount = qty * price;
//     }
//     setRows(updated);
//   };

//   /* ================= CALCULATIONS ================= */
//   const subTotal = rows.reduce((sum, r) => sum + r.amount, 0);
//   const grandTotal = subTotal + Number(deliveryCharges) + Number(taxAmount) - Number(discountAmount);

//   /* ================= SAVE ================= */
//   const handleSave = async () => {
//     if (!supplierId) {
//       alert("Supplier is required");
//       return;
//     }
//     if (!deliveryDate) {
//       alert("Delivery Date is required");
//       return;
//     }

//     const payload = {
//       supplier_id: supplierId,
//       purchase_date: deliveryDate,
//       invoice_number: invoiceNumber || null,
//       po_number: poNumber,
//       tax_amount: Number(taxAmount),
//       discount_amount: Number(discountAmount),
//       grand_total: Number(grandTotal),
//       payment_status: paymentStatus,
//       items: rows
//         .filter(r => r.raw_material_id !== "" && r.quantity !== "")
//         .map((r) => ({
//           raw_material_id: Number(r.raw_material_id),
//           quantity: Number(r.quantity),
//           unit_price: Number(r.unit_price)
//         }))
//     };

//     if (payload.items.length === 0) {
//       alert("Please add at least one raw material item");
//       return;
//     }

//     try {
//       await axios.post(
//         "http://localhost:5000/api/purchaseOrders/create",
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json"
//           }
//         }
//       );

//       alert("Purchase Order Created Successfully ✅");
//       onClose();
//     } catch (error) {
//       console.error(error);
//       const errMsg = error.response?.data?.message || "Failed to save Purchase Order";
//       alert(`❌ Save Failed: ${errMsg}`);
//     }
//   };

//   const isAllSelected = rows.length > 0 && rows.every(r => r.checked);

//   return (
//     <Box sx={{ bgcolor: "#fff", minHeight: "80vh", display: "flex", flexDirection: "column" }}>
      
//       {/* ================= HEADER BANNER ================= */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           p: 2,
//           borderBottom: "1px solid #e0e0e0"
//         }}
//       >
//         <Typography fontSize="1.1rem" fontWeight={700} color="#111">
//           Add Purchase Order 
//         </Typography>
//         <IconButton onClick={onClose} size="small">
//           <CloseIcon />
//         </IconButton>
//       </Box>

//       {/* ================= FORM BODY ================= */}
//       <Box sx={{ p: 3, flex: 1 }}>
//         {/* Row 1: From: Supplier Tab */}
//         <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1 }}>
//           <Typography fontSize={13} fontWeight={600} color="#555">
//             From:
//           </Typography>
//           <Button
//             variant="outlined"
//             startIcon={<LocalShippingIcon sx={{ fontSize: "16px !important" }} />}
//             sx={{
//               textTransform: "none",
//               borderRadius: "6px",
//               borderColor: "#2563EB",
//               color: "#2563EB",
//               fontWeight: 600,
//               px: 2,
//               py: 0.5,
//               fontSize: "0.8rem",
//               bgcolor: "#eff6ff",
//               "&:hover": {
//                 borderColor: "#1d4ed8",
//                 bgcolor: "#dbeafe"
//               }
//             }}
//           >
//             Supplier
//           </Button>
//         </Box>

//         {/* Row 2: Inputs Grid */}
//         <Grid container spacing={2} sx={{ mb: 4 }} alignItems="flex-end">
//           <Grid item xs={12} sm={6} md={3}>
//             <Typography fontSize={12} fontWeight={600} mb={0.5} color="#333">
//               Supplier/Third Party <span style={{ color: "red" }}>*</span>
//             </Typography>
//             <TextField
//               select
//               fullWidth
//               size="small"
//               value={supplierId}
//               onChange={(e) => setSupplierId(e.target.value)}
//               SelectProps={{
//                 displayEmpty: true,
//                 renderValue: (selected) => {
//                   if (!selected) {
//                     return <span style={{ color: "#aaa" }}>Select Supplier</span>;
//                   }
//                   const s = suppliers.find(sup => sup.id === selected);
//                   return s ? s.name : "";
//                 }
//               }}
//             >
//               <MenuItem disabled value="">
//                 <em>Select Supplier</em>
//               </MenuItem>
//               {suppliers.map((s) => (
//                 <MenuItem key={s.id} value={s.id}>
//                   {s.name} ({s.company_name})
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Grid>

//           <Grid item xs={12} sm={6} md={2.5}>
//             <Typography fontSize={12} fontWeight={600} mb={0.5} color="#333">
//               Delivery Date <span style={{ color: "red" }}>*</span>
//             </Typography>
//             <TextField
//               type="date"
//               fullWidth
//               size="small"
//               value={deliveryDate}
//               onChange={(e) => setDeliveryDate(e.target.value)}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6} md={2}>
//             <Typography fontSize={12} fontWeight={600} mb={0.5} color="#333">
//               Delivery Time
//             </Typography>
//             <TextField
//               type="time"
//               fullWidth
//               size="small"
//               value={deliveryTime}
//               onChange={(e) => setDeliveryTime(e.target.value)}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6} md={2.5}>
//             <Typography fontSize={12} fontWeight={600} mb={0.5} color="#333">
//               PO Number
//             </Typography>
//             <TextField
//               fullWidth
//               size="small"
//               value={poNumber}
//               disabled
//               placeholder="PO Number"
//             />
//           </Grid>

//           <Grid item xs={12} sm={12} md={2}>
//             <Button
//               variant="outlined"
//               onClick={() => setOpenOtherDetails(true)}
//               fullWidth
//               sx={{
//                 textTransform: "none",
//                 borderColor: "#ccc",
//                 color: "#333",
//                 borderRadius: "6px",
//                 height: "40px",
//                 "&:hover": {
//                   borderColor: "#999",
//                   bgcolor: "#f9fafb"
//                 }
//               }}
//             >
//               Other Details
//             </Button>
//           </Grid>
//         </Grid>

//         {/* ================= TABLE ACTION BUTTONS ================= */}
//         <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mb: 1.5 }}>
//           <Button
//             variant="outlined"
//             startIcon={<AddIcon />}
//             onClick={handleAddRow}
//             sx={{
//               textTransform: "none",
//               borderColor: "#2563EB",
//               color: "#2563EB",
//               borderRadius: "6px",
//               fontWeight: 600,
//               fontSize: "0.85rem",
//               "&:hover": {
//                 borderColor: "#1d4ed8",
//                 bgcolor: "#eff6ff"
//               }
//             }}
//           >
//             Add New
//           </Button>
//           <Button
//             variant="outlined"
//             endIcon={<KeyboardArrowDownIcon />}
//             sx={{
//               textTransform: "none",
//               borderColor: "#ccc",
//               color: "#555",
//               borderRadius: "6px",
//               fontSize: "0.85rem",
//               "&:hover": {
//                 borderColor: "#bbb",
//                 bgcolor: "#f9fafb"
//               }
//             }}
//           >
//             More Actions
//           </Button>
//         </Box>

//         {/* ================= PRODUCTS TABLE ================= */}
//         <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: "6px", mb: 3 }}>
//           <Table size="small">
//             <TableHead sx={{ bgcolor: "#eff4f8" }}>
//               <TableRow>
//                 <TableCell padding="checkbox" sx={{ width: "50px" }}>
//                   <Checkbox
//                     checked={isAllSelected}
//                     indeterminate={rows.some(r => r.checked) && !isAllSelected}
//                     onChange={handleSelectAllRows}
//                   />
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 700, color: "#444" }}>
//                   Raw Material <span style={{ color: "red" }}>*</span>
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 700, color: "#444", width: "120px" }}>
//                   Qty <span style={{ color: "red" }}>*</span>
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 700, color: "#444", width: "180px" }}>
//                   Unit <span style={{ color: "red" }}>*</span>
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 700, color: "#444", width: "150px" }}>
//                   Price
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 700, color: "#444", width: "150px" }}>
//                   Amount
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 700, color: "#444", width: "100px" }}>
//                   Action
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {rows.map((row, index) => (
//                 <TableRow key={index} hover>
//                   {/* Checkbox */}
//                   <TableCell padding="checkbox">
//                     <Checkbox
//                       checked={row.checked}
//                       onChange={() => handleRowCheckbox(index)}
//                     />
//                   </TableCell>

//                   {/* Raw Material Select */}
//                   <TableCell>
//                     <FormControl fullWidth size="small">
//                       <Select
//                         value={row.raw_material_id}
//                         onChange={(e) => handleMaterialChange(index, e.target.value)}
//                         displayEmpty
//                         renderValue={(selected) => {
//                           if (!selected) {
//                             return <span style={{ color: "#aaa" }}>Select/Add Raw Material</span>;
//                           }
//                           const mat = rawMaterials.find(rm => rm.id === selected);
//                           return mat ? mat.name : "";
//                         }}
//                       >
//                         <MenuItem disabled value="">
//                           <em>Select/Add Raw Material</em>
//                         </MenuItem>
//                         {rawMaterials.map((rm) => (
//                           <MenuItem key={rm.id} value={rm.id}>
//                             {rm.name}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </TableCell>

//                   {/* Qty */}
//                   <TableCell>
//                     <TextField
//                       size="small"
//                       type="number"
//                       value={row.quantity}
//                       onChange={(e) => handleRowChange(index, "quantity", e.target.value)}
//                       placeholder="Qty"
//                     />
//                   </TableCell>

//                   {/* Unit Select (disabled or showing selected) */}
//                   <TableCell>
//                     <FormControl fullWidth size="small">
//                       <Select
//                         value={row.unit_id}
//                         disabled
//                         onChange={(e) => handleRowChange(index, "unit_id", e.target.value)}
//                         displayEmpty
//                         renderValue={(selected) => {
//                           const unit = units.find(u => u.id === selected);
//                           return unit ? unit.unit_symbol : "Unit";
//                         }}
//                       >
//                         {units.map((u) => (
//                           <MenuItem key={u.id} value={u.id}>
//                             {u.unit_symbol}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </TableCell>

//                   {/* Price */}
//                   <TableCell>
//                     <TextField
//                       size="small"
//                       type="number"
//                       value={row.unit_price}
//                       onChange={(e) => handleRowChange(index, "unit_price", e.target.value)}
//                       placeholder="Price"
//                     />
//                   </TableCell>

//                   {/* Amount */}
//                   <TableCell>
//                     <Typography fontSize="0.875rem" fontWeight={600} color="#333">
//                       {row.amount.toFixed(3)}
//                     </Typography>
//                   </TableCell>

//                   {/* Actions (Edit/Delete) */}
//                   <TableCell>
//                     <IconButton size="small" sx={{ mr: 0.5, color: "#555" }}>
//                       <EditNoteIcon />
//                     </IconButton>
//                     <IconButton size="small" color="error" onClick={() => handleDeleteRow(index)}>
//                       <DeleteIcon fontSize="small" />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* ================= TOTALS & SUMMARY ================= */}
//         <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
//           <Box sx={{ width: "320px", display: "flex", flexDirection: "column", gap: 1.5 }}>
            
//             {/* Sub Total */}
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//               <Typography fontSize="0.85rem" fontWeight={600} color="#666">
//                 Sub Total :
//               </Typography>
//               <Typography fontSize="0.95rem" fontWeight={700} color="#111">
//                 {subTotal.toFixed(3)}
//               </Typography>
//             </Box>

//             {/* Delivery Charges */}
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//               <Button
//                 variant="outlined"
//                 onClick={() => setOpenDeliveryCharges(true)}
//                 size="small"
//                 sx={{
//                   textTransform: "none",
//                   borderColor: "#ccc",
//                   color: "#555",
//                   borderRadius: "4px",
//                   py: 0.2,
//                   fontSize: "0.75rem",
//                   "&:hover": {
//                     borderColor: "#999",
//                     bgcolor: "#f9fafb"
//                   }
//                 }}
//               >
//                 + Delivery Charges
//               </Button>
//               <Typography fontSize="0.95rem" fontWeight={700} color="#111">
//                 {Number(deliveryCharges).toFixed(3)}
//               </Typography>
//             </Box>

//             {/* Grand Total */}
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 1, borderTop: "1px dashed #ccc" }}>
//               <Typography fontSize="0.9rem" fontWeight={700} color="#333">
//                 Grand Total :
//               </Typography>
//               <Typography fontSize="1.1rem" fontWeight={800} color="#2563EB">
//                 {grandTotal.toFixed(3)}
//               </Typography>
//             </Box>
//           </Box>
//         </Box>
//       </Box>

//       {/* ================= FOOTER CONTROL BAR ================= */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           bgcolor: "#f1f5f9",
//           p: 2,
//           borderTop: "1px solid #e2e8f0"
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           <Checkbox
//             checked={recipientCanEdit}
//             onChange={(e) => setRecipientCanEdit(e.target.checked)}
//             sx={{ p: 0.5 }}
//           />
//           <Typography fontSize="0.8rem" fontWeight={500} color="#444">
//             Recipient can edit the invoice
//           </Typography>
//         </Box>

//         <Box sx={{ display: "flex", gap: 1.5 }}>
//           <Button
//             variant="text"
//             onClick={onClose}
//             sx={{
//               textTransform: "none",
//               color: "#666",
//               fontWeight: 600,
//               fontSize: "0.85rem"
//             }}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleSave}
//             sx={{
//               textTransform: "none",
//               bgcolor: "#2563EB",
//               color: "#fff",
//               fontWeight: 600,
//               borderRadius: "6px",
//               px: 3,
//               fontSize: "0.85rem",
//               "&:hover": {
//                 bgcolor: "#1d4ed8"
//               }
//             }}
//           >
//             Save Changes
//           </Button>
//         </Box>
//       </Box>

//       {/* ================= OTHER DETAILS MODAL ================= */}
//       <Dialog open={openOtherDetails} onClose={() => setOpenOtherDetails(false)}>
//         <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Additional Purchase Order Details</DialogTitle>
//         <DialogContent dividers sx={{ pt: 2 }}>
//           <Grid container spacing={2.5}>
//             <Grid item xs={12}>
//               <TextField
//                 label="Invoice Number"
//                 fullWidth
//                 size="small"
//                 value={invoiceNumber}
//                 onChange={(e) => setInvoiceNumber(e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Tax Amount (GST)"
//                 type="number"
//                 fullWidth
//                 size="small"
//                 value={taxAmount}
//                 onChange={(e) => setTaxAmount(Number(e.target.value))}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Discount"
//                 type="number"
//                 fullWidth
//                 size="small"
//                 value={discountAmount}
//                 onChange={(e) => setDiscountAmount(Number(e.target.value))}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 select
//                 label="Payment Status"
//                 fullWidth
//                 size="small"
//                 value={paymentStatus}
//                 onChange={(e) => setPaymentStatus(e.target.value)}
//               >
//                 <MenuItem value="pending">Pending</MenuItem>
//                 <MenuItem value="paid">Paid</MenuItem>
//                 <MenuItem value="partial">Partial</MenuItem>
//               </TextField>
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions sx={{ p: 2 }}>
//           <Button onClick={() => setOpenOtherDetails(false)} variant="contained" size="small">
//             Done
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* ================= DELIVERY CHARGES MODAL ================= */}
//       <Dialog open={openDeliveryCharges} onClose={() => setOpenDeliveryCharges(false)}>
//         <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Add Delivery Charges</DialogTitle>
//         <DialogContent sx={{ pt: 2, minWidth: "300px" }}>
//           <TextField
//             autoFocus
//             label="Delivery Charges Amount"
//             type="number"
//             fullWidth
//             size="small"
//             value={deliveryCharges}
//             onChange={(e) => setDeliveryCharges(Number(e.target.value))}
//             InputProps={{
//               startAdornment: <InputAdornment position="start">₹</InputAdornment>
//             }}
//           />
//         </DialogContent>
//         <DialogActions sx={{ p: 2 }}>
//           <Button onClick={() => setOpenDeliveryCharges(false)} variant="text" size="small">
//             Cancel
//           </Button>
//           <Button onClick={() => setOpenDeliveryCharges(false)} variant="contained" size="small">
//             Apply
//           </Button>
//         </DialogActions>
//       </Dialog>

//     </Box>
//   );
// };

// export default AddPurchaseOrder;





import React, { useEffect, useState, useRef } from "react";
import {
  Box, Typography, Grid, TextField, Button, MenuItem,
  Checkbox, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Dialog,
  DialogTitle, DialogContent, DialogActions, FormControl,
  Select, InputAdornment
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

/* ============================================================
   SEARCHABLE RAW MATERIAL DROPDOWN - Custom Component
   ============================================================ */
const SearchableRawMaterialSelect = ({ value, rawMaterials, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const searchRef = useRef(null);

  const selected = rawMaterials.find(rm => rm.id === value);

  const filtered = rawMaterials.filter(rm =>
    rm.name.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto focus search input when dropdown opens
  useEffect(() => {
    if (open && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSelect = (rm) => {
    onChange(rm.id);
    setOpen(false);
    setSearch("");
  };

  return (
    <Box ref={containerRef} sx={{ position: "relative", width: "100%" }}>
      {/* Trigger Button */}
      <Box
        onClick={() => setOpen(prev => !prev)}
        sx={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          border: "1px solid #c4c4c4", borderRadius: "4px",
          px: 1.2, py: "6px", cursor: "pointer", bgcolor: "#fff",
          minHeight: "37px",
          "&:hover": { borderColor: "#333" }
        }}
      >
        <Typography
          fontSize="0.875rem"
          color={selected ? "#111" : "#aaa"}
          noWrap
        >
          {selected ? selected.name : "Select/Add Raw Material"}
        </Typography>
        <KeyboardArrowDownIcon
          sx={{
            fontSize: 18, color: "#777", ml: 1, flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s"
          }}
        />
      </Box>

      {/* Dropdown Panel */}
      {open && (
        <Box
          sx={{
            position: "absolute", top: "100%", left: 0, right: 0,
            bgcolor: "#fff", border: "1px solid #ddd",
            borderRadius: "4px", zIndex: 9999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            mt: "2px"
          }}
        >
          {/* Search Input */}
          <Box sx={{ p: 1, borderBottom: "1px solid #eee" }}>
            <TextField
              inputRef={searchRef}
              size="small"
              fullWidth
              placeholder="Search raw material..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 16, color: "#888" }} />
                  </InputAdornment>
                )
              }}
            />
          </Box>

          {/* Options List */}
          <Box sx={{ maxHeight: "220px", overflowY: "auto" }}>
            {filtered.length > 0 ? (
              filtered.map((rm) => (
                <Box
                  key={rm.id}
                  onClick={() => handleSelect(rm)}
                  sx={{
                    px: 2, py: "8px", cursor: "pointer",
                    fontSize: "0.875rem", color: "#222",
                    bgcolor: value === rm.id ? "#eff6ff" : "transparent",
                    "&:hover": { bgcolor: "#f1f5f9" }
                  }}
                >
                  {rm.name}
                </Box>
              ))
            ) : (
              <Box sx={{ px: 2, py: 1.5, fontSize: "0.8rem", color: "#aaa" }}>
                No materials found
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
const AddPurchaseOrder = ({ onClose }) => {
  const token = localStorage.getItem("authToken");

  const [suppliers, setSuppliers] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [units, setUnits] = useState([]);

  const [supplierId, setSupplierId] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [deliveryTime, setDeliveryTime] = useState("");
  const [poNumber, setPoNumber] = useState(
    `PO-${Math.floor(100000 + Math.random() * 900000)}`
  );
  const [recipientCanEdit, setRecipientCanEdit] = useState(true);

  const [openOtherDetails, setOpenOtherDetails] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [taxAmount, setTaxAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("pending");

  const [openDeliveryCharges, setOpenDeliveryCharges] = useState(false);
  const [deliveryCharges, setDeliveryCharges] = useState(0);

  const [rows, setRows] = useState([
    { checked: false, raw_material_id: "", quantity: "", unit_id: "", unit_price: "", amount: 0 }
  ]);

  useEffect(() => {
    fetchSuppliers();
    fetchRawMaterials();
    fetchUnits();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/suppliers/get", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setSuppliers(res.data.data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  const fetchRawMaterials = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/raw/get", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = Array.isArray(res.data.data) ? res.data.data : res.data;
      setRawMaterials(data.map(rm => ({ ...rm, id: Number(rm.id) })));
    } catch (err) {
      console.error("Error fetching raw materials:", err);
    }
  };

  const fetchUnits = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/units/getUnit");
      const data = Array.isArray(res.data.data) ? res.data.data : res.data;
      setUnits(data.map(u => ({ ...u, id: Number(u.id) })));
    } catch (err) {
      console.error("Error fetching units:", err);
    }
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      { checked: false, raw_material_id: "", quantity: "", unit_id: "", unit_price: "", amount: 0 }
    ]);
  };

  const handleDeleteRow = (index) => {
    if (rows.length === 1) {
      setRows([{ checked: false, raw_material_id: "", quantity: "", unit_id: "", unit_price: "", amount: 0 }]);
    } else {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const handleRowCheckbox = (index) => {
    const updated = [...rows];
    updated[index].checked = !updated[index].checked;
    setRows(updated);
  };

  const handleSelectAllRows = (e) => {
    setRows(rows.map(r => ({ ...r, checked: e.target.checked })));
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    if (field === "quantity" || field === "unit_price") {
      const qty = Number(updated[index].quantity || 0);
      const price = Number(updated[index].unit_price || 0);
      updated[index].amount = qty * price;
    }
    setRows(updated);
  };

  const handleMaterialChange = (index, materialId) => {
    const numericId = Number(materialId);
    const updated = [...rows];
    updated[index].raw_material_id = numericId;

    const mat = rawMaterials.find(rm => rm.id === numericId);
    if (mat) {
      updated[index].unit_id = mat.purchase_unit_id ? Number(mat.purchase_unit_id) : "";
      updated[index].unit_price = mat.purchase_price !== undefined ? mat.purchase_price : "";
      const qty = Number(updated[index].quantity || 0);
      const price = Number(updated[index].unit_price || 0);
      updated[index].amount = qty * price;
    }
    setRows(updated);
  };

  const subTotal = rows.reduce((sum, r) => sum + r.amount, 0);
  const grandTotal = subTotal + Number(deliveryCharges) + Number(taxAmount) - Number(discountAmount);

  const handleSave = async () => {
    if (!supplierId) { alert("Supplier is required"); return; }
    if (!deliveryDate) { alert("Delivery Date is required"); return; }

    const payload = {
      supplier_id: supplierId,
      purchase_date: deliveryDate,
      invoice_number: invoiceNumber || null,
      po_number: poNumber,
      tax_amount: Number(taxAmount),
      discount_amount: Number(discountAmount),
      grand_total: Number(grandTotal),
      payment_status: paymentStatus,
      items: rows
        .filter(r => r.raw_material_id !== "" && r.quantity !== "")
        .map((r) => ({
          raw_material_id: Number(r.raw_material_id),
          quantity: Number(r.quantity),
          unit_price: Number(r.unit_price)
        }))
    };

    if (payload.items.length === 0) {
      alert("Please add at least one raw material item");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/purchaseOrders/create", payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });
      alert("Purchase Order Created Successfully ✅");
      onClose();
    } catch (error) {
      console.error(error);
      alert(`❌ Save Failed: ${error.response?.data?.message || "Failed to save Purchase Order"}`);
    }
  };

  const isAllSelected = rows.length > 0 && rows.every(r => r.checked);

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "80vh", display: "flex", flexDirection: "column" }}>

      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderBottom: "1px solid #e0e0e0" }}>
        <Typography fontSize="1.1rem" fontWeight={700} color="#111">Add Purchase Order</Typography>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </Box>

      {/* FORM BODY */}
      <Box sx={{ p: 3, flex: 1 }}>

        {/* Supplier Tag */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1 }}>
          <Typography fontSize={13} fontWeight={600} color="#555">From:</Typography>
          <Button
            variant="outlined"
            startIcon={<LocalShippingIcon sx={{ fontSize: "16px !important" }} />}
            sx={{
              textTransform: "none", borderRadius: "6px", borderColor: "#2563EB",
              color: "#2563EB", fontWeight: 600, px: 2, py: 0.5, fontSize: "0.8rem",
              bgcolor: "#eff6ff", "&:hover": { borderColor: "#1d4ed8", bgcolor: "#dbeafe" }
            }}
          >
            Supplier
          </Button>
        </Box>

        {/* Input Grid */}
        <Grid container spacing={2} sx={{ mb: 4 }} alignItems="flex-end">
          <Grid item xs={12} sm={6} md={3}>
            <Typography fontSize={12} fontWeight={600} mb={0.5} color="#333">
              Supplier/Third Party <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              select fullWidth size="small" value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              SelectProps={{
                displayEmpty: true,
                renderValue: (selected) => {
                  if (!selected) return <span style={{ color: "#aaa" }}>Select Supplier</span>;
                  const s = suppliers.find(sup => sup.id === selected);
                  return s ? s.name : "";
                }
              }}
            >
              <MenuItem disabled value=""><em>Select Supplier</em></MenuItem>
              {suppliers.map((s) => (
                <MenuItem key={s.id} value={s.id}>{s.name} ({s.company_name})</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
            <Typography fontSize={12} fontWeight={600} mb={0.5} color="#333">
              Delivery Date <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField type="date" fullWidth size="small" value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)} />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography fontSize={12} fontWeight={600} mb={0.5} color="#333">Delivery Time</Typography>
            <TextField type="time" fullWidth size="small" value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)} />
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
            <Typography fontSize={12} fontWeight={600} mb={0.5} color="#333">PO Number</Typography>
            <TextField fullWidth size="small" value={poNumber} disabled placeholder="PO Number" />
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Button
              variant="outlined" onClick={() => setOpenOtherDetails(true)} fullWidth
              sx={{
                textTransform: "none", borderColor: "#ccc", color: "#333",
                borderRadius: "6px", height: "40px",
                "&:hover": { borderColor: "#999", bgcolor: "#f9fafb" }
              }}
            >
              Other Details
            </Button>
          </Grid>
        </Grid>

        {/* Table Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mb: 1.5 }}>
          <Button
            variant="outlined" startIcon={<AddIcon />} onClick={handleAddRow}
            sx={{
              textTransform: "none", borderColor: "#2563EB", color: "#2563EB",
              borderRadius: "6px", fontWeight: 600, fontSize: "0.85rem",
              "&:hover": { borderColor: "#1d4ed8", bgcolor: "#eff6ff" }
            }}
          >
            Add New
          </Button>
          <Button
            variant="outlined" endIcon={<KeyboardArrowDownIcon />}
            sx={{
              textTransform: "none", borderColor: "#ccc", color: "#555",
              borderRadius: "6px", fontSize: "0.85rem",
              "&:hover": { borderColor: "#bbb", bgcolor: "#f9fafb" }
            }}
          >
            More Actions
          </Button>
        </Box>

        {/* TABLE */}
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: "6px", mb: 3 }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: "#eff4f8" }}>
              <TableRow>
                <TableCell padding="checkbox" sx={{ width: "50px" }}>
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={rows.some(r => r.checked) && !isAllSelected}
                    onChange={handleSelectAllRows}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#444" }}>Raw Material <span style={{ color: "red" }}>*</span></TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#444", width: "120px" }}>Qty <span style={{ color: "red" }}>*</span></TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#444", width: "180px" }}>Unit <span style={{ color: "red" }}>*</span></TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#444", width: "150px" }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#444", width: "150px" }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#444", width: "100px" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell padding="checkbox">
                    <Checkbox checked={row.checked} onChange={() => handleRowCheckbox(index)} />
                  </TableCell>

                  {/* ✅ Custom Searchable Raw Material Dropdown */}
                  <TableCell>
                    <SearchableRawMaterialSelect
                      value={row.raw_material_id === "" ? null : Number(row.raw_material_id)}
                      rawMaterials={rawMaterials}
                      onChange={(materialId) => handleMaterialChange(index, materialId)}
                    />
                  </TableCell>

                  {/* Qty */}
                  <TableCell>
                    <TextField
                      size="small" type="number" value={row.quantity}
                      onChange={(e) => handleRowChange(index, "quantity", e.target.value)}
                      placeholder="Qty"
                    />
                  </TableCell>

                  {/* Unit */}
                  <TableCell>
                    <FormControl fullWidth size="small">
                      <Select
                        value={row.unit_id === "" ? "" : Number(row.unit_id)}
                        disabled
                        displayEmpty
                        renderValue={(selected) => {
                          if (selected === "" || selected === 0) return <span style={{ color: "#aaa" }}>Unit</span>;
                          const unit = units.find(u => u.id === Number(selected));
                          return unit ? unit.unit_symbol : "Unit";
                        }}
                      >
                        {units.map((u) => (
                          <MenuItem key={u.id} value={u.id}>{u.unit_symbol}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>

                  {/* Price */}
                  <TableCell>
                    <TextField
                      size="small" type="number" value={row.unit_price}
                      onChange={(e) => handleRowChange(index, "unit_price", e.target.value)}
                      placeholder="Price"
                    />
                  </TableCell>

                  {/* Amount */}
                  <TableCell>
                    <Typography fontSize="0.875rem" fontWeight={600} color="#333">
                      {row.amount.toFixed(3)}
                    </Typography>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <IconButton size="small" sx={{ mr: 0.5, color: "#555" }}><EditNoteIcon /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteRow(index)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* TOTALS */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Box sx={{ width: "320px", display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography fontSize="0.85rem" fontWeight={600} color="#666">Sub Total :</Typography>
              <Typography fontSize="0.95rem" fontWeight={700} color="#111">{subTotal.toFixed(3)}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Button
                variant="outlined" onClick={() => setOpenDeliveryCharges(true)} size="small"
                sx={{
                  textTransform: "none", borderColor: "#ccc", color: "#555",
                  borderRadius: "4px", py: 0.2, fontSize: "0.75rem",
                  "&:hover": { borderColor: "#999", bgcolor: "#f9fafb" }
                }}
              >
                + Delivery Charges
              </Button>
              <Typography fontSize="0.95rem" fontWeight={700} color="#111">
                {Number(deliveryCharges).toFixed(3)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 1, borderTop: "1px dashed #ccc" }}>
              <Typography fontSize="0.9rem" fontWeight={700} color="#333">Grand Total :</Typography>
              <Typography fontSize="1.1rem" fontWeight={800} color="#2563EB">{grandTotal.toFixed(3)}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* FOOTER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#f1f5f9", p: 2, borderTop: "1px solid #e2e8f0" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Checkbox checked={recipientCanEdit} onChange={(e) => setRecipientCanEdit(e.target.checked)} sx={{ p: 0.5 }} />
          <Typography fontSize="0.8rem" fontWeight={500} color="#444">Recipient can edit the invoice</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button variant="text" onClick={onClose} sx={{ textTransform: "none", color: "#666", fontWeight: 600, fontSize: "0.85rem" }}>
            Cancel
          </Button>
          <Button
            variant="contained" onClick={handleSave}
            sx={{
              textTransform: "none", bgcolor: "#2563EB", color: "#fff",
              fontWeight: 600, borderRadius: "6px", px: 3, fontSize: "0.85rem",
              "&:hover": { bgcolor: "#1d4ed8" }
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>

      {/* OTHER DETAILS MODAL */}
      <Dialog open={openOtherDetails} onClose={() => setOpenOtherDetails(false)}>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Additional Purchase Order Details</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField label="Invoice Number" fullWidth size="small" value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Tax Amount (GST)" type="number" fullWidth size="small" value={taxAmount}
                onChange={(e) => setTaxAmount(Number(e.target.value))} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Discount" type="number" fullWidth size="small" value={discountAmount}
                onChange={(e) => setDiscountAmount(Number(e.target.value))} />
            </Grid>
            <Grid item xs={12}>
              <TextField select label="Payment Status" fullWidth size="small" value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="partial">Partial</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenOtherDetails(false)} variant="contained" size="small">Done</Button>
        </DialogActions>
      </Dialog>

      {/* DELIVERY CHARGES MODAL */}
      <Dialog open={openDeliveryCharges} onClose={() => setOpenDeliveryCharges(false)}>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Add Delivery Charges</DialogTitle>
        <DialogContent sx={{ pt: 2, minWidth: "300px" }}>
          <TextField
            autoFocus label="Delivery Charges Amount" type="number" fullWidth size="small"
            value={deliveryCharges} onChange={(e) => setDeliveryCharges(Number(e.target.value))}
            InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDeliveryCharges(false)} variant="text" size="small">Cancel</Button>
          <Button onClick={() => setOpenDeliveryCharges(false)} variant="contained" size="small">Apply</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default AddPurchaseOrder;