// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   Select,
//   MenuItem,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Paper,
//   IconButton
// } from "@mui/material";
// import { Add, StarBorder } from "@mui/icons-material";
// import AddStock from "./AddStock";

// const mockData = [
//   {
//     category: "Dry Fruit",
//     name: "Aam Papad",
//     available: "5 Kg",
//     units: ["Kg", "GM"]
//   },
//   {
//     category: "Dairy Products",
//     name: "Amul Cream",
//     available: "6 Kg",
//     units: ["Kg", "GM"]
//   },
//   {
//     category: "Grocery",
//     name: "Apple Green Powder",
//     available: "100 GM",
//     units: ["GM"]
//   }
// ];
// const [openAddStock, setOpenAddStock] = useState(false);

// const AvailableStock = () => {
//   return (
//     <Box p={3}>
//       {/* HEADER */}
//       <Box display="flex" justifyContent="space-between" mb={2}>
//         <Typography variant="h6" fontWeight={700}>
//           Available Stock
//         </Typography>

//         {/* <Button
//           variant="contained"
//           color="error"
//           startIcon={<Add />}
//         >
//           Add Stock
//         </Button> */}
//         <Button
//   variant="contained"
//   color="error"
//   startIcon={<Add />}
//   onClick={() => setOpenAddStock(true)}
// >
//   Add Stock
// </Button>
//         {openAddStock && <AddStock onClose={() => setOpenAddStock(false)} />}

//       </Box>

//       {/* FILTER BAR */}
//       <Paper sx={{ p: 2, mb: 2 }}>
//         <Box display="flex" gap={2} flexWrap="wrap">
//           <TextField label="Raw Material" size="small" />
//           <Select size="small" defaultValue="All">
//             <MenuItem value="All">All</MenuItem>
//           </Select>
//           <TextField type="date" size="small" />
//           <Select size="small" defaultValue="Daily">
//             <MenuItem value="Daily">Daily</MenuItem>
//             <MenuItem value="Monthly">Monthly</MenuItem>
//           </Select>

//           <Button variant="outlined" color="error">
//             Load
//           </Button>
//           <Button variant="outlined">
//             Clear
//           </Button>
//         </Box>
//       </Paper>

//       {/* TABLE */}
//       <Paper>
//         <Table>
//           <TableHead>
//             <TableRow sx={{ background: "#f5f7fa" }}>
//               <TableCell>Category</TableCell>
//               <TableCell>Raw Material</TableCell>
//               <TableCell>Available Stock</TableCell>
//               <TableCell sx={{ background: "#e8f9fd" }}>
//                 Update Your Available Stock
//               </TableCell>
//               <TableCell>Comments</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {mockData.map((row, i) => (
//               <TableRow key={i}>
//                 <TableCell>
//                   <IconButton size="small">
//                     <StarBorder />
//                   </IconButton>
//                   {row.category}
//                 </TableCell>

//                 <TableCell>{row.name}</TableCell>

//                 <TableCell>{row.available}</TableCell>

//                 <TableCell sx={{ background: "#e8f9fd" }}>
//                   <Box display="flex" gap={1}>
//                     {row.units.map((u, idx) => (
//                       <TextField
//                         key={idx}
//                         size="small"
//                         placeholder="Available Stock"
//                         InputProps={{
//                           endAdornment: `/${u}`
//                         }}
//                       />
//                     ))}
//                   </Box>
//                 </TableCell>

//                 <TableCell>
//                   <TextField
//                     size="small"
//                     placeholder="Comments"
//                     fullWidth
//                   />
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </Paper>

//       {/* SAVE BUTTON */}
//       <Box display="flex" justifyContent="flex-end" mt={2}>
//         <Button variant="contained" color="error">
//           Save
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default AvailableStock;

// import { useState } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   Select,
//   MenuItem,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Paper,
//   IconButton
// } from "@mui/material";
// import { Add, StarBorder } from "@mui/icons-material";
// import AddStock from "./AddStock";
// import { Dialog } from "@mui/material";

// const mockData = [
//   {
//     category: "Dry Fruit",
//     name: "Aam Papad",
//     available: "5 Kg",
//     units: ["Kg", "GM"]
//   },
//   {
//     category: "Dairy Products",
//     name: "Amul Cream",
//     available: "6 Kg",
//     units: ["Kg", "GM"]
//   },
//   {
//     category: "Grocery",
//     name: "Apple Green Powder",
//     available: "100 GM",
//     units: ["GM"]
//   }
// ];

// const AvailableStock = () => {
//   // ✅ yahin hona chahiye
//   const [openAddStock, setOpenAddStock] = useState(false);

//   return (
//     <Box p={3}>
//       {/* HEADER */}
//       <Box display="flex" justifyContent="space-between" mb={2}>
//         <Typography variant="h6" fontWeight={700}>
//           Available Stock
//         </Typography>

//         {/* <Button
//           variant="contained"
//           color="error"
//           startIcon={<Add />}
//           onClick={() => setOpenAddStock(true)}
//         >
//           Add Stock
//         </Button> */}
//         <Button
//   variant="contained"
//   color="error"
//   startIcon={<Add />}
//   onClick={() => setOpenAddStock(true)}
// >
//   Add Stock
// </Button>

// <Dialog
//   open={openAddStock}
//   onClose={() => setOpenAddStock(false)}
//   maxWidth="lg"
//   fullWidth
// >
//   <AddStock onClose={() => setOpenAddStock(false)} />
// </Dialog>

//         {openAddStock && (
//           <AddStock onClose={() => setOpenAddStock(false)} />
//         )}
//       </Box>

//       {/* FILTER BAR */}
//       <Paper sx={{ p: 2, mb: 2 }}>
//         <Box display="flex" gap={2} flexWrap="wrap">
//           <TextField label="Raw Material" size="small" />
//           <Select size="small" defaultValue="All">
//             <MenuItem value="All">All</MenuItem>
//           </Select>
//           <TextField type="date" size="small" />
//           <Select size="small" defaultValue="Daily">
//             <MenuItem value="Daily">Daily</MenuItem>
//             <MenuItem value="Monthly">Monthly</MenuItem>
//           </Select>

//           <Button variant="outlined" color="error">
//             Load
//           </Button>
//           <Button variant="outlined">
//             Clear
//           </Button>
//         </Box>
//       </Paper>

//       {/* TABLE */}
//       <Paper>
//         <Table>
//           <TableHead>
//             <TableRow sx={{ background: "#f5f7fa" }}>
//               <TableCell>Category</TableCell>
//               <TableCell>Raw Material</TableCell>
//               <TableCell>Available Stock</TableCell>
//               <TableCell sx={{ background: "#e8f9fd" }}>
//                 Update Your Available Stock
//               </TableCell>
//               <TableCell>Comments</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {mockData.map((row, i) => (
//               <TableRow key={i}>
//                 <TableCell>
//                   <IconButton size="small">
//                     <StarBorder />
//                   </IconButton>
//                   {row.category}
//                 </TableCell>

//                 <TableCell>{row.name}</TableCell>
//                 <TableCell>{row.available}</TableCell>

//                 <TableCell sx={{ background: "#e8f9fd" }}>
//                   <Box display="flex" gap={1}>
//                     {row.units.map((u, idx) => (
//                       <TextField
//                         key={idx}
//                         size="small"
//                         placeholder="Available Stock"
//                         InputProps={{
//                           endAdornment: `/${u}`
//                         }}
//                       />
//                     ))}
//                   </Box>
//                 </TableCell>

//                 <TableCell>
//                   <TextField
//                     size="small"
//                     placeholder="Comments"
//                     fullWidth
//                   />
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </Paper>

//       {/* SAVE BUTTON */}
//       <Box display="flex" justifyContent="flex-end" mt={2}>
//         <Button variant="contained" color="error">
//           Save
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default AvailableStock;










import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Dialog,
} from "@mui/material";
import { Add, StarBorder } from "@mui/icons-material";
import AddStock from "./AddStock";

const AvailableStock = () => {
  const [openAddStock, setOpenAddStock] = useState(false);
  const [stockData, setStockData] = useState([]);

  // 🔹 API CALL (GET AVAILABLE STOCK)
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("❌ Token missing");
      return;
    }

    fetch("http://localhost:5000/api/stock/stockAvailable", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setStockData(res.data);
        }
      })
      .catch((err) => console.error("API Error:", err.message));
  }, []);

  const formatQty = (value) => {
  if (value === null || value === undefined) return 0;

  const num = Number(value);

  // agar decimal . ke baad 0 hi hain → integer dikhao
  return Number.isInteger(num) ? num : num.toFixed(2);
};


  return (
    <Box p={3}>
      {/* ================= HEADER ================= */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight={700}>
          Available Stock
        </Typography>

        <Button
          variant="contained"
          color="error"
          startIcon={<Add />}
          onClick={() => setOpenAddStock(true)}
        >
          Add Stock
        </Button>

        {/* CENTER MODAL (RAW MATERIAL STYLE) */}
        <Dialog
          open={openAddStock}
          onClose={() => setOpenAddStock(false)}
          maxWidth="lg"
          fullWidth
        >
          <AddStock onClose={() => setOpenAddStock(false)} />
        </Dialog>
      </Box>

      {/* ================= FILTER BAR ================= */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField label="Raw Material" size="small" />
          <Select size="small" defaultValue="All">
            <MenuItem value="All">All</MenuItem>
          </Select>
          <TextField type="date" size="small" />
          <Select size="small" defaultValue="Daily">
            <MenuItem value="Daily">Daily</MenuItem>
            <MenuItem value="Monthly">Monthly</MenuItem>
          </Select>

          <Button variant="outlined" color="error">
            Load
          </Button>
          <Button variant="outlined">Clear</Button>
        </Box>
      </Paper>

      {/* ================= TABLE ================= */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow sx={{ background: "#f5f7fa" }}>
              <TableCell>Category</TableCell>
              <TableCell>Raw Material</TableCell>
              <TableCell>Available Stock</TableCell>
              <TableCell sx={{ background: "#e8f9fd" }}>
                Update Your Available Stock
              </TableCell>
              <TableCell>Comments</TableCell>
            </TableRow>
          </TableHead>
{/* 
          <TableBody>
            {stockData.map((row) => (
              <TableRow key={row.raw_material_id}>
                <TableCell>
                  <IconButton size="small">
                    <StarBorder />
                  </IconButton>
                  {row.category}
                </TableCell>

                <TableCell>{row.raw_material_name}</TableCell>

                <TableCell>
                  {row.available_quantity_purchase} {row.purchase_unit_symbol}
                </TableCell>

                <TableCell sx={{ background: "#e8f9fd" }}>
                  <Box display="flex" gap={1}>
                    <TextField
                      size="small"
                      placeholder="Available Stock"
                      InputProps={{
                        endAdornment: `/${row.consume_unit_symbol}`,
                      }}
                    />
                  </Box>
                </TableCell>

                <TableCell>
                  <TextField size="small" placeholder="Comments" fullWidth />
                </TableCell>
              </TableRow>
            ))}
          </TableBody> */}

          <TableBody>
  {stockData.map((row) => (
    <TableRow key={row.raw_material_id}>
      {/* CATEGORY */}
      <TableCell>
        <IconButton size="small">
          <StarBorder />
        </IconButton>
        {row.category}
      </TableCell>

      {/* NAME */}
      <TableCell>{row.raw_material_name}</TableCell>

      {/* AVAILABLE STOCK (PURCHASE UNIT) */}
      <TableCell>
        {/* {row.available_quantity_purchase} {row.purchase_unit_symbol} */}
        {formatQty(row.available_quantity_purchase)} {row.purchase_unit_symbol}
      </TableCell>

      {/* AVAILABLE STOCK (CONSUME UNIT) */}
      <TableCell sx={{ background: "#e8f9fd" }}>
        <Box display="flex" flexDirection="column" gap={0.5}>
          {/* show existing consume quantity */}
          <Typography variant="caption" color="text.secondary">
            Current: {formatQty(row.available_quantity_consume)} {row.consume_unit_symbol}
          </Typography>

          {/* input to update */}
          {/* <TextField
            size="small"
            placeholder="Add / Update Stock"
            InputProps={{
              endAdornment: `/${row.consume_unit_symbol}`,
            }}
          /> */}
        </Box>
      </TableCell>

      {/* COMMENTS */}
      <TableCell>
        <TextField size="small" placeholder="Comments" fullWidth />
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </Paper>

      {/* ================= SAVE BUTTON ================= */}
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button variant="contained" color="error">
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default AvailableStock;
