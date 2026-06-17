// import {
//   Box,
//   Paper,
//   Typography,
//   Select,
//   MenuItem,
//   Button,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TextField,
//   ListSubheader,
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import { useState } from "react";
// import {
//   // ...existing imports...
//   Menu,
//   ListItemText,
// } from "@mui/material";



// const [exportAnchor, setExportAnchor] = useState(null);
// /* ===== DATA ===== */
// const categoryList = [
//   "All",
//   "Dry Fruit",
//   "Grocery",
//   "Dairy Products",
//   "Sweet",
//   "Gujiya",
//   "Khova",
// ];

// const stockLevelList = [
//   "All",
//   "At-par stock",
//   "Minimum stock",
//   "Negative stock",
// ];

// const stockData = [
//   {
//     category: "Dry Fruit",
//     rawMaterial: "Aam Papad",
//     stock: "5 Kg (5000 GM)",
//     price: 100,
//     unit: "Kg",
//     total: 500,
//   },
//   {
//     category: "Dairy Products",
//     rawMaterial: "Amul Cream",
//     stock: "6 Kg (6000 GM)",
//     price: 30,
//     unit: "Kg",
//     total: 180,
//   },
//   {
//     category: "Sweet",
//     rawMaterial: "Aata Gajak",
//     stock: "6 Kg (6000 GM)",
//     price: 30,
//     unit: "Kg",
//     total: 180,
//   },
//   {
//     category: "Grocery",
//     rawMaterial: "Apple Green Powder",
//     stock: "100 GM",
//     price: 0,
//     unit: "GM",
//     total: 0,
//   },
//   {
//     category: "Dry Fruit",
//     rawMaterial: "Badam",
//     stock: "5 Kg",
//     price: 100,
//     unit: "Kg",
//     total: 500,
//   },
//   {
//     category: "Dry Fruit",
//     rawMaterial: "kaju",
//     stock: "5 Kg",
//     price: 100,
//     unit: "Kg",
//     total: 500,
//   },
//   {
//     category: "Sweet",
//     rawMaterial: "Atta Gajak",
//     stock: "3 Kg",
//     price: 100,
//     unit: "Kg",
//     total: 300,
//   },
// ];

// const CurrentStock = () => {
//   const [category, setCategory] = useState("All");
//   const [categorySearch, setCategorySearch] = useState("");

//   const [stockLevel, setStockLevel] = useState("All");
//   const [stockSearch, setStockSearch] = useState("");

//   const [rawMaterial, setRawMaterial] = useState("");

//   /* ===== FILTER ===== */
//   const filteredData = stockData.filter((item) => {
//     const matchCategory =
//       category === "All" || item.category === category;

//     const matchRaw =
//       rawMaterial === "" ||
//       item.rawMaterial
//         .toLowerCase()
//         .includes(rawMaterial.toLowerCase());

//     return matchCategory && matchRaw;
//   });



  

// const handleExportCurrentPage = () => {
//   const headers = ["Category", "Raw Material", "Current Stock", "Price", "Total"];
//   const csvRows = [
//     headers.join(","),
//     ...filteredData.map((row) =>
//       [row.category, row.rawMaterial, row.stock, row.price, row.total].join(",")
//     ),
//   ];
//   downloadCSV(csvRows.join("\n"), "current_page_stock.csv");
// };

// const handleExportAll = () => {
//   const headers = ["Category", "Raw Material", "Current Stock", "Price", "Total"];
//   const csvRows = [
//     headers.join(","),
//     ...stockData.map((row) =>
//       [row.category, row.rawMaterial, row.stock, row.price, row.total].join(",")
//     ),
//   ];
//   downloadCSV(csvRows.join("\n"), "all_stock.csv");
// };

// const downloadCSV = (csv, filename) => {
//   const blob = new Blob([csv], { type: "text/csv" });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = filename;
//   a.click();
//   URL.revokeObjectURL(url);
// };
  


  

//   return (
//     <Box p={2}>
//       <Typography fontSize={18} mb={0.7}>
//         Current Stock  
//       </Typography>




// {/* EXPORT BUTTON */}

// {/* EXPORT BUTTON */}





//       {/* ================= FILTER BAR ================= */}
//       <Paper sx={{ p: 2, mb: 2 }}>
//         <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
//           {/* Raw Material */}
//           <Box>
//             <Typography fontSize={14} mb={0.5}>
//               Raw Material
//             </Typography>
//             <TextField
//               size="small"
//               sx={{ width: 160 }}
//               value={rawMaterial}
//               onChange={(e) => setRawMaterial(e.target.value)}
//             />
//           </Box>

//           {/* Category */}
//           <Box>
//             <Typography fontSize={14} mb={0.5}>
//               Category
//             </Typography>
//             <Select
//               size="small"
//               value={category}
//               sx={{ width: 140 }}
//               onChange={(e) => setCategory(e.target.value)}
//             >
//               <ListSubheader>
//                 <TextField
//                   size="small"
//                   autoFocus
//                   fullWidth
//                   value={categorySearch}
//                   onChange={(e) =>
//                     setCategorySearch(e.target.value)
//                   }
//                   InputProps={{
//                     startAdornment: (
//                       <SearchIcon fontSize="small" sx={{ mr: 1 }} />
//                     ),
//                   }}
//                 />
//               </ListSubheader>

//               {categoryList
//                 .filter((c) =>
//                   c
//                     .toLowerCase()
//                     .includes(categorySearch.toLowerCase())
//                 )
//                 .map((c) => (
//                   <MenuItem key={c} value={c}>
//                     {c}
//                   </MenuItem>
//                 ))}
//             </Select>
//           </Box>

//           {/* Stock Level */}
//           <Box>
//             <Typography fontSize={14} mb={0.5}>
//               Stock Level
//             </Typography>
//             <Select
//               size="small"
//               value={stockLevel}
//               sx={{ width: 150 }}
//               onChange={(e) => setStockLevel(e.target.value)}
//             >
//               <ListSubheader>
//                 <TextField
//                   size="small"
//                   autoFocus
//                   fullWidth
//                   value={stockSearch}
//                   onChange={(e) =>
//                     setStockSearch(e.target.value)
//                   }
//                   InputProps={{
//                     startAdornment: (
//                       <SearchIcon fontSize="small" sx={{ mr: 1 }} />
//                     ),
//                   }}
//                 />
//               </ListSubheader>

//               {stockLevelList
//                 .filter((s) =>
//                   s
//                     .toLowerCase()
//                     .includes(stockSearch.toLowerCase())
//                 )
//                 .map((s) => (
//                   <MenuItem key={s} value={s}>
//                     {s}
//                   </MenuItem>
//                 ))}
//             </Select>
//           </Box>

//           <Button
//             variant="contained"
//             sx={{
//               bgcolor: "#8B1D1D",
//               "&:hover": { bgcolor: "#6F1616" },
//               height: 40,
//               px: 3,
//             }}
//           >
//             Search 
//           </Button>





          
//         </Box>
//       </Paper>







//       {/* EXPORT BUTTON */}
// <Button
//   variant="outlined"
//   endIcon={<span>▾</span>}
//   onClick={(e) => setExportAnchor(e.currentTarget)}
//   sx={{ height: 40 }}
// >
//   Export
// </Button>

// <Menu
//   anchorEl={exportAnchor}
//   open={Boolean(exportAnchor)}
//   onClose={() => setExportAnchor(null)}
// >
//   <MenuItem onClick={() => {
//     setExportAnchor(null);
//     handleExportCurrentPage();
//   }}>
//     <ListItemText>Export Current Page</ListItemText>
//   </MenuItem>
//   <MenuItem onClick={() => {
//     setExportAnchor(null);
//     handleExportAll();
//   }}>
//     <ListItemText>Export All</ListItemText>
//   </MenuItem>
// </Menu>

//       {/* ================= TABLE ================= */}
//       <Paper>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Category</TableCell>
//               <TableCell>Raw Material</TableCell>
//               <TableCell>Current Stock</TableCell>
//               <TableCell>Average Purchase Price (₹)</TableCell>
//               <TableCell align="right">Total</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {filteredData.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={5} align="center">
//                   No data found
//                 </TableCell>
//               </TableRow>
//             ) : (
//               filteredData.map((row, i) => (
//                 <TableRow key={i}>
//                   <TableCell>{row.category}</TableCell>
//                   <TableCell>{row.rawMaterial}</TableCell>
//                   <TableCell>{row.stock}</TableCell>
//                   <TableCell>
//                     <Box display="flex" gap={1}>
//                       <TextField
//                         size="small"
//                         value={row.price}
//                         sx={{ width: 100 }}
//                       />
//                       / {row.unit}
//                     </Box>
//                   </TableCell>
//                   <TableCell align="right">
//                     {row.total.toFixed(3)}
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </Paper>
//     </Box>
//   );
// };

// export default CurrentStock;



// import {
//   Box,
//   Paper,
//   Typography,
//   Select,
//   MenuItem,
//   Button,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TextField,
//   ListSubheader,
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import { useState, useEffect } from "react";
// import axios from "axios";

// /* ===== DROPDOWNS ===== */
// const categoryList = [
//   "All",
//   "Grocery",
//   "Dry Fruit",
//   "Dairy Products",
//   "Sweet",
//   "Gujiya",
//   "Khova",
// ];

// const stockLevelList = [
//   "All",
//   "At-par stock",
//   "Minimum stock",
//   "Negative stock",
// ];

// const CurrentStock = () => {
//   const [category, setCategory] = useState("All");
//   const [categorySearch, setCategorySearch] = useState("");

//   const [stockLevel, setStockLevel] = useState("All");
//   const [stockSearch, setStockSearch] = useState("");

//   const [rawMaterial, setRawMaterial] = useState("");

//   const [stockData, setStockData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   /* ===== FETCH STOCK ===== */
//   const fetchStockReport = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("authToken");

//       const res = await axios.get(
//         "http://localhost:5000/api/stock/report-currentStock",
//         {
//           params: {
//             category,
//             rawMaterial,
//             stockLevel,
//           },
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setStockData(res.data.data || []);
//     } catch (error) {
//       console.error("❌ Stock fetch error", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ===== AUTO LOAD ===== */
//   useEffect(() => {
//     fetchStockReport();
//   }, []);

//   return (
//     <Box p={2}>
//       <Typography fontSize={18} mb={1}>
//         Current Stock
//       </Typography>

//       {/* ================= FILTER BAR ================= */}
//       <Paper sx={{ p: 2, mb: 2 }}>
//         <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
//           {/* Raw Material */}
//           <Box>
//             <Typography fontSize={14} mb={0.5}>
//               Raw Material
//             </Typography>
//             <TextField
//               size="small"
//               sx={{ width: 180 }}
//               value={rawMaterial}
//               onChange={(e) => setRawMaterial(e.target.value)}
//             />
//           </Box>

//           {/* Category */}
//           <Box>
//             <Typography fontSize={14} mb={0.5}>
//               Category
//             </Typography>
//             <Select
//               size="small"
//               value={category}
//               sx={{ width: 160 }}
//               onChange={(e) => setCategory(e.target.value)}
//             >
//               <ListSubheader>
//                 <TextField
//                   size="small"
//                   autoFocus
//                   fullWidth
//                   value={categorySearch}
//                   onChange={(e) =>
//                     setCategorySearch(e.target.value)
//                   }
//                   InputProps={{
//                     startAdornment: (
//                       <SearchIcon fontSize="small" sx={{ mr: 1 }} />
//                     ),
//                   }}
//                 />
//               </ListSubheader>

//               {categoryList
//                 .filter((c) =>
//                   c
//                     .toLowerCase()
//                     .includes(categorySearch.toLowerCase())
//                 )
//                 .map((c) => (
//                   <MenuItem key={c} value={c}>
//                     {c}
//                   </MenuItem>
//                 ))}
//             </Select>
//           </Box>

//           {/* Stock Level (future use) */}
//           <Box>
//             <Typography fontSize={14} mb={0.5}>
//               Stock Level
//             </Typography>
//             <Select
//               size="small"
//               value={stockLevel}
//               sx={{ width: 160 }}
//               onChange={(e) => setStockLevel(e.target.value)}
//             >
//               {stockLevelList.map((s) => (
//                 <MenuItem key={s} value={s}>
//                   {s}
//                 </MenuItem>
//               ))}
//             </Select>
//           </Box>

//           <Button
//             variant="contained"
//             sx={{
//               bgcolor: "#8B1D1D",
//               "&:hover": { bgcolor: "#6F1616" },
//               height: 40,
//               px: 3,
//             }}
//             onClick={fetchStockReport}
//           >
//             Search
//           </Button>
//         </Box>
//       </Paper>

//       {/* ================= TABLE ================= */}
//       <Paper>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Category</TableCell>
//               <TableCell>Raw Material</TableCell>
//               <TableCell>Current Stock</TableCell>
//               <TableCell>Avg Purchase Price (₹)</TableCell>
//               <TableCell align="right">Total Value</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={5} align="center">
//                   Loading...
//                 </TableCell>
//               </TableRow>
//             ) : stockData.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={5} align="center">
//                   No data found
//                 </TableCell>
//               </TableRow>
//             ) : (
//               stockData.map((row, i) => (
//                 <TableRow key={i}>
//                   <TableCell>{row.category}</TableCell>
//                   <TableCell>{row.rawMaterial}</TableCell>

//                   <TableCell>
//                     {Number(row.quantity).toFixed(2)} {row.unit}
//                   </TableCell>

//                   <TableCell>
//                     <Box display="flex" gap={1}>
//                       <TextField
//                         size="small"
//                         value={Number(row.price).toFixed(2)}
//                         sx={{ width: 120 }}
//                         InputProps={{ readOnly: true }}
//                       />
//                       / {row.unit}
//                     </Box>
//                   </TableCell>

//                   <TableCell align="right">
//                     ₹ {Number(row.total).toFixed(2)}
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </Paper>
//     </Box>
//   );
// };

// export default CurrentStock;





import {
  Box, Paper, Typography, Select, MenuItem, Button,
  Table, TableHead, TableRow, TableCell, TableBody,
  TextField, ListSubheader, Menu, ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useState } from "react";

/* ===== DATA ===== */
const categoryList = ["All", "Dry Fruit", "Grocery", "Dairy Products", "Sweet", "Gujiya", "Khova"];
const stockLevelList = ["All", "At-par stock", "Minimum stock", "Negative stock"];

const stockData = [
  { category: "Dry Fruit", rawMaterial: "Aam Papad", stock: "5 Kg (5000 GM)", price: 100, unit: "Kg", total: 500 },
  { category: "Dairy Products", rawMaterial: "Amul Cream", stock: "6 Kg (6000 GM)", price: 30, unit: "Kg", total: 180 },
  { category: "Sweet", rawMaterial: "Aata Gajak", stock: "6 Kg (6000 GM)", price: 30, unit: "Kg", total: 180 },
  { category: "Grocery", rawMaterial: "Apple Green Powder", stock: "100 GM", price: 0, unit: "GM", total: 0 },
  { category: "Dry Fruit", rawMaterial: "Badam", stock: "5 Kg", price: 100, unit: "Kg", total: 500 },
  { category: "Dry Fruit", rawMaterial: "kaju", stock: "5 Kg", price: 100, unit: "Kg", total: 500 },
  { category: "Sweet", rawMaterial: "Atta Gajak", stock: "3 Kg", price: 100, unit: "Kg", total: 300 },
];

const CurrentStock = () => {
  const [category, setCategory] = useState("All");
  const [categorySearch, setCategorySearch] = useState("");
  const [stockLevel, setStockLevel] = useState("All");
  const [stockSearch, setStockSearch] = useState("");
  const [rawMaterial, setRawMaterial] = useState("");

  // ✅ EXPORT STATE - ANDAR
  const [exportAnchor, setExportAnchor] = useState(null);

  /* ===== FILTER ===== */
  const filteredData = stockData.filter((item) => {
    const matchCategory = category === "All" || item.category === category;
    const matchRaw = rawMaterial === "" || item.rawMaterial.toLowerCase().includes(rawMaterial.toLowerCase());
    return matchCategory && matchRaw;
  });

  /* ===== EXPORT FUNCTIONS ===== */
  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCurrentPage = () => {
    const headers = ["Category", "Raw Material", "Current Stock", "Price", "Total"];
    const csvRows = [
      headers.join(","),
      ...filteredData.map((row) =>
        [row.category, row.rawMaterial, row.stock, row.price, row.total].join(",")
      ),
    ];
    downloadCSV(csvRows.join("\n"), "current_page_stock.csv");
  };

  const handleExportAll = () => {
    const headers = ["Category", "Raw Material", "Current Stock", "Price", "Total"];
    const csvRows = [
      headers.join(","),
      ...stockData.map((row) =>
        [row.category, row.rawMaterial, row.stock, row.price, row.total].join(",")
      ),
    ];
    downloadCSV(csvRows.join("\n"), "all_stock.csv");
  };

  return (
    <Box p={2}>

      {/* ✅ HEADER ROW - Title + Export Button saath mein */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.7}>
        <Typography fontSize={18}>Current Stock</Typography>

        {/* ✅ EXPORT BUTTON */}
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          endIcon={<span>▾</span>}
          onClick={(e) => setExportAnchor(e.currentTarget)}
          sx={{ height: 36 }}
        >
          Export
        </Button>

        {/* ✅ DROPDOWN MENU */}
        <Menu
          anchorEl={exportAnchor}
          open={Boolean(exportAnchor)}
          onClose={() => setExportAnchor(null)}
        >
          <MenuItem onClick={() => { setExportAnchor(null); handleExportCurrentPage(); }}>
            <ListItemText>Export Current Page</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { setExportAnchor(null); handleExportAll(); }}>
            <ListItemText>Export All</ListItemText>
          </MenuItem>
        </Menu>
      </Box>

      {/* ================= FILTER BAR ================= */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
          <Box>
            <Typography fontSize={14} mb={0.5}>Raw Material</Typography>
            <TextField size="small" sx={{ width: 160 }} value={rawMaterial} onChange={(e) => setRawMaterial(e.target.value)} />
          </Box>

          <Box>
            <Typography fontSize={14} mb={0.5}>Category</Typography>
            <Select size="small" value={category} sx={{ width: 140 }} onChange={(e) => setCategory(e.target.value)}>
              <ListSubheader>
                <TextField size="small" autoFocus fullWidth value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  InputProps={{ startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} /> }}
                />
              </ListSubheader>
              {categoryList.filter((c) => c.toLowerCase().includes(categorySearch.toLowerCase())).map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </Box>

          <Box>
            <Typography fontSize={14} mb={0.5}>Stock Level</Typography>
            <Select size="small" value={stockLevel} sx={{ width: 150 }} onChange={(e) => setStockLevel(e.target.value)}>
              <ListSubheader>
                <TextField size="small" autoFocus fullWidth value={stockSearch}
                  onChange={(e) => setStockSearch(e.target.value)}
                  InputProps={{ startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} /> }}
                />
              </ListSubheader>
              {stockLevelList.filter((s) => s.toLowerCase().includes(stockSearch.toLowerCase())).map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </Box>

          <Button variant="contained" sx={{ bgcolor: "#8B1D1D", "&:hover": { bgcolor: "#6F1616" }, height: 40, px: 3 }}>
            Search
          </Button>
        </Box>
      </Paper>

      {/* ================= TABLE ================= */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Raw Material</TableCell>
              <TableCell>Current Stock</TableCell>
              <TableCell>Average Purchase Price (₹)</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No data found</TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.rawMaterial}</TableCell>
                  <TableCell>{row.stock}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <TextField size="small" value={row.price} sx={{ width: 100 }} />
                      / {row.unit}
                    </Box>
                  </TableCell>
                  <TableCell align="right">{row.total.toFixed(3)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default CurrentStock;





