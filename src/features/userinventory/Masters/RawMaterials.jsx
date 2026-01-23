// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   Select,
//   MenuItem,
//   Checkbox,
//   IconButton,
//   Paper
// } from "@mui/material";
// import {
//   Add,
//   Edit,
//   Description,
//   Visibility
// } from "@mui/icons-material";

// const RawMaterials = () => {
//   return (
//     <Box sx={{ p: 3, background: "#f9fafb", height: "100%" }}>

//       {/* HEADER */}
//       <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//         <Typography variant="h6" fontWeight={700}>
//           Raw Materials Management
//         </Typography>

//         <Box sx={{ display: "flex", gap: 1 }}>
//           <Button variant="contained" startIcon={<Add />}>
//             Create New
//           </Button>
//           <Button variant="outlined">Quick Add</Button>
//           <Button variant="outlined">Action</Button>
//           <Button variant="outlined">Files</Button>
//         </Box>
//       </Box>

//       {/* FILTER */}
//       <Paper sx={{ p: 2, mb: 2 }}>
//         <Box sx={{ display: "flex", gap: 2 }}>
//           <TextField label="Name" size="small" />
//           <Select size="small" value="All" sx={{ minWidth: 180 }}>
//             <MenuItem value="All">All Categories</MenuItem>
//             <MenuItem value="Grocery">Grocery</MenuItem>
//             <MenuItem value="Sweet">Sweet</MenuItem>
//           </Select>

//           <Button variant="outlined">Search</Button>
//           <Button variant="text">Clear</Button>
//           <Button variant="contained">Apply Changes</Button>
//         </Box>
//       </Paper>

//       {/* CATEGORY TABS */}
//       <Paper sx={{ p: 1, mb: 2, display: "flex", gap: 2 }}>
//         {[
//           "All categories (106)",
//           "Grocery (35)",
//           "Dry Fruit (16)",
//           "Sweet (14)",
//           "Dairy Products (7)"
//         ].map((item) => (
//           <Button key={item} variant="outlined">
//             {item}
//           </Button>
//         ))}
//       </Paper>

//       {/* TABLE */}
//       <Paper>
//         <Box sx={{ p: 2, display: "grid", gridTemplateColumns: "40px 2fr 2fr 1fr 1fr 1fr", fontWeight: 600 }}>
//           <Checkbox />
//           <span>Name</span>
//           <span>Category</span>
//           <span>Favourite</span>
//           <span>Active</span>
//           <span>Action</span>
//         </Box>

//         {["Gold Powder", "Rose Gold Barfi", "Kesar Almond Delight"].map((item) => (
//           <Box
//             key={item}
//             sx={{
//               p: 2,
//               display: "grid",
//               gridTemplateColumns: "40px 2fr 2fr 1fr 1fr 1fr",
//               alignItems: "center",
//               borderTop: "1px solid #eee"
//             }}
//           >
//             <Checkbox />
//             <TextField size="small" defaultValue={item} />
//             <Select size="small" defaultValue="Sweet">
//               <MenuItem value="Sweet">Sweet</MenuItem>
//               <MenuItem value="Grocery">Grocery</MenuItem>
//             </Select>
//             <Checkbox />
//             <Checkbox checked />
//             <Box>
//               <IconButton><Visibility /></IconButton>
//               <IconButton><Edit /></IconButton>
//               <IconButton><Description /></IconButton>
//             </Box>
//           </Box>
//         ))}
//       </Paper>
//     </Box>
//   );
// };

// export default RawMaterials;

// import { useState } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   Select,
//   MenuItem,
//   Checkbox,
//   IconButton,
//   Paper
// } from "@mui/material";
// import {
//   Add,
//   Edit,
//   Description,
//   Visibility
// } from "@mui/icons-material";

// // 👉 ye import add kar
// import AddRawMaterialDrawer from "./AddRawMaterialDrawer";

// const RawMaterials = () => {

//   // 👉 ye state add kar
//   const [openForm, setOpenForm] = useState(false);

//   return (
//     <Box sx={{ p: 3, background: "#f9fafb", height: "100%" }}>

//       {/* HEADER */}
//       <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//         <Typography variant="h6" fontWeight={700}>
//           Raw Materials Management
//         </Typography>

//         <Box sx={{ display: "flex", gap: 1 }}>
//           {/* 👉 yahan onClick add hua */}
//           <Button
//             variant="contained"
//             startIcon={<Add />}
//             onClick={() => setOpenForm(true)}
//           >
//             Create New
//           </Button>

//           <Button variant="outlined">Quick Add</Button>
//           <Button variant="outlined">Action</Button>
//           <Button variant="outlined">Files</Button>
//         </Box>
//       </Box>

//       {/* FILTER */}
//       <Paper sx={{ p: 2, mb: 2 }}>
//         <Box sx={{ display: "flex", gap: 2 }}>
//           <TextField label="Name" size="small" />
//           <Select size="small" value="All" sx={{ minWidth: 180 }}>
//             <MenuItem value="All">All Categories</MenuItem>
//             <MenuItem value="Grocery">Grocery</MenuItem>
//             <MenuItem value="Sweet">Sweet</MenuItem>
//           </Select>

//           <Button variant="outlined">Search</Button>
//           <Button variant="text">Clear</Button>
//           <Button variant="contained">Apply Changes</Button>
//         </Box>
//       </Paper>

//       {/* CATEGORY TABS */}
//       <Paper sx={{ p: 1, mb: 2, display: "flex", gap: 2 }}>
//         {[
//           "All categories (106)",
//           "Grocery (35)",
//           "Dry Fruit (16)",
//           "Sweet (14)",
//           "Dairy Products (7)"
//         ].map((item) => (
//           <Button key={item} variant="outlined">
//             {item}
//           </Button>
//         ))}
//       </Paper>

//       {/* TABLE */}
//       <Paper>
//         <Box
//           sx={{
//             p: 2,
//             display: "grid",
//             gridTemplateColumns: "40px 2fr 2fr 1fr 1fr 1fr",
//             fontWeight: 600
//           }}
//         >
//           <Checkbox />
//           <span>Name</span>
//           <span>Category</span>
//           <span>Favourite</span>
//           <span>Active</span>
//           <span>Action</span>
//         </Box>

//         {["Gold Powder", "Rose Gold Barfi", "Kesar Almond Delight"].map((item) => (
//           <Box
//             key={item}
//             sx={{
//               p: 2,
//               display: "grid",
//               gridTemplateColumns: "40px 2fr 2fr 1fr 1fr 1fr",
//               alignItems: "center",
//               borderTop: "1px solid #eee"
//             }}
//           >
//             <Checkbox />
//             <TextField size="small" defaultValue={item} />
//             <Select size="small" defaultValue="Sweet">
//               <MenuItem value="Sweet">Sweet</MenuItem>
//               <MenuItem value="Grocery">Grocery</MenuItem>
//             </Select>
//             <Checkbox />
//             <Checkbox checked />
//             <Box>
//               <IconButton><Visibility /></IconButton>
//               <IconButton><Edit /></IconButton>
//               <IconButton><Description /></IconButton>
//             </Box>
//           </Box>
//         ))}
//       </Paper>

//       {/* 👉 YAHI DRAWER OPEN HOGA */}
//       <AddRawMaterialDrawer
//         open={openForm}
//         onClose={() => setOpenForm(false)}
//       />

//     </Box>
//   );
// };

// export default RawMaterials;

// import { useState } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   Select,
//   MenuItem,
//   Checkbox,
//   IconButton,
//   Paper
// } from "@mui/material";
// import {
//   Add,
//   Edit,
//   Description,
//   Visibility
// } from "@mui/icons-material";

// import AddRawMaterialDrawer from "./AddRawMaterialDrawer";

// const RawMaterials = () => {

//   // 🔹 modal open/close
//   const [openForm, setOpenForm] = useState(false);

//   // 🔹 filter state (FIX)
//   const [category, setCategory] = useState("All");

//   return (
//     <Box sx={{ p: 3, background: "#f9fafb", height: "100%" }}>

//       {/* HEADER */}
//       <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//         <Typography variant="h6" fontWeight={700}>
//           Raw Materials Management
//         </Typography>

//         <Box sx={{ display: "flex", gap: 1 }}>
//           <Button
//             variant="contained"
//             startIcon={<Add />}
//             onClick={() => setOpenForm(true)}
//           >
//             Create New
//           </Button>

//           <Button variant="outlined">Quick Add</Button>
//           <Button variant="outlined">Action</Button>
//           <Button variant="outlined">Files</Button>
//         </Box>
//       </Box>

//       {/* FILTER */}
//       <Paper sx={{ p: 2, mb: 2 }}>
//         <Box sx={{ display: "flex", gap: 2 }}>
//           <TextField label="Name" size="small" />

//           {/* ✅ FIXED SELECT */}
//           <Select
//             size="small"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             sx={{ minWidth: 180 }}
//           >
//             <MenuItem value="All">All Categories</MenuItem>
//             <MenuItem value="Grocery">Grocery</MenuItem>
//             <MenuItem value="Sweet">Sweet</MenuItem>
//           </Select>

//           <Button variant="outlined">Search</Button>
//           <Button variant="text">Clear</Button>
//           <Button variant="contained">Apply Changes</Button>
//         </Box>
//       </Paper>

//       {/* CATEGORY TABS */}
//       <Paper sx={{ p: 1, mb: 2, display: "flex", gap: 2 }}>
//         {[
//           "All categories (106)",
//           "Grocery (35)",
//           "Dry Fruit (16)",
//           "Sweet (14)",
//           "Dairy Products (7)"
//         ].map((item) => (
//           <Button key={item} variant="outlined">
//             {item}
//           </Button>
//         ))}
//       </Paper>

//       {/* TABLE */}
//       <Paper>
//         <Box
//           sx={{
//             p: 2,
//             display: "grid",
//             gridTemplateColumns: "40px 2fr 2fr 1fr 1fr 1fr",
//             fontWeight: 600
//           }}
//         >
//           <Checkbox />
//           <span>Name</span>
//           <span>Category</span>
//           <span>Favourite</span>
//           <span>Active</span>
//           <span>Action</span>
//         </Box>

//         {["Gold Powder", "Rose Gold Barfi", "Kesar Almond Delight"].map((item) => (
//           <Box
//             key={item}
//             sx={{
//               p: 2,
//               display: "grid",
//               gridTemplateColumns: "40px 2fr 2fr 1fr 1fr 1fr",
//               alignItems: "center",
//               borderTop: "1px solid #eee"
//             }}
//           >
//             <Checkbox />
//             <TextField size="small" defaultValue={item} />
//             <Select size="small" defaultValue="Sweet">
//               <MenuItem value="Sweet">Sweet</MenuItem>
//               <MenuItem value="Grocery">Grocery</MenuItem>
//             </Select>
//             <Checkbox />
//             <Checkbox checked />
//             <Box>
//               <IconButton><Visibility /></IconButton>
//               <IconButton><Edit /></IconButton>
//               <IconButton><Description /></IconButton>
//             </Box>
//           </Box>
//         ))}
//       </Paper>

//       {/* ✅ CENTER MODAL */}
//       <AddRawMaterialDrawer
//         open={openForm}
//         onClose={() => setOpenForm(false)}
//       />

//     </Box>
//   );
// };

// export default RawMaterials;

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  IconButton,
  Paper,
} from "@mui/material";

import { Add, Edit, Description, Visibility } from "@mui/icons-material";

import AddRawMaterialDrawer from "./AddRawMaterialDrawer";

const RawMaterials = () => {
  // 🔹 drawer open/close
  const [openForm, setOpenForm] = useState(false);

  // 🔹 filter states
  const [category, setCategory] = useState("All");
  const [searchName, setSearchName] = useState("");

  // 🔹 API data
  const [rawMaterials, setRawMaterials] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("authToken");

if (!token) {
  console.error("❌ Token missing");
  return;
}


    fetch("http://localhost:5000/api/raw/get", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 401) {
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        setRawMaterials(
          Array.isArray(data)
            ? data
            : Array.isArray(data.data)
              ? data.data
              : [],
        );
      })
      .catch((err) => {
        console.error("API Error:", err.message);
      });
  }, []);


  const filteredData = Array.isArray(rawMaterials)
    ? rawMaterials.filter((item) => {
        const matchCategory = category === "All" || item.category === category;

        const matchName = item.name
          ?.toLowerCase()
          .includes(searchName.toLowerCase());

        return matchCategory && matchName;
      })
    : [];

  return (
    <Box sx={{ p: 3, background: "#f9fafb", height: "100%" }}>
      {/* ================= HEADER ================= */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          Raw Materials Management
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenForm(true)}
          >
            Create New
          </Button>

          <Button variant="outlined">Quick Add</Button>
          <Button variant="outlined">Action</Button>
          <Button variant="outlined">Files</Button>
        </Box>
      </Box>

      {/* ================= FILTER ================= */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Name"
            size="small"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />

          <Select
            size="small"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="All">All Categories</MenuItem>
            <MenuItem value="Grocery">Grocery</MenuItem>
            <MenuItem value="Sweet">Sweet</MenuItem>
            <MenuItem value="Dry Fruit">Dry Fruit</MenuItem>
            <MenuItem value="Dairy">Dairy </MenuItem>
          </Select>

          <Button variant="outlined">Search</Button>
          <Button
            variant="text"
            onClick={() => {
              setSearchName("");
              setCategory("All");
            }}
          >
            Clear
          </Button>
        </Box>
      </Paper>

      {/* ================= TABLE ================= */}
      <Paper>
        {/* TABLE HEADER */}
        <Box
          sx={{
            p: 2,
            display: "grid",
            gridTemplateColumns: "40px 2fr 2fr 1fr 2fr 1fr 1fr",
            fontWeight: 600,
          }}
        >
          <Checkbox />
          <span>Name</span>
          <span>Category</span>
          <span>Tax %</span>
          <span>Barcode</span>
          <span>Expiry </span>
          <span>Action</span>
        </Box>

        {/* TABLE BODY */}
        {loading && <Typography sx={{ p: 2 }}>Loading...</Typography>}

        {!loading && filteredData.length === 0 && (
          <Typography sx={{ p: 2 }}>No data found</Typography>
        )}

        {!loading &&
          filteredData.map((item) => (
            <Box
              key={item.id}
              sx={{
                p: 2,
                display: "grid",
                gridTemplateColumns: "40px 2fr 2fr 1fr 2fr 1fr 1fr",
                alignItems: "center",
                borderTop: "1px solid #eee",
              }}
            >
              <Checkbox />

              {/* NAME */}
              <Typography>{item.name}</Typography>

              {/* CATEGORY */}
              <Typography>{item.category}</Typography>

              {/* TAX */}
              <Typography>{item.tax_percentage}%</Typography>

              {/* BARCODE */}
              <Typography>{item.barcode}</Typography>

              {/* EXPIRY */}
              <Typography>{item.expiry_days} Days</Typography>

              {/* ACTION */}
              <Box>
                <IconButton>
                  <Visibility />
                </IconButton>
                <IconButton>
                  <Edit />
                </IconButton>
                <IconButton>
                  <Description />
                </IconButton>
              </Box>
            </Box>
          ))}
      </Paper>

      {/* ================= DRAWER ================= */}
      <AddRawMaterialDrawer
        open={openForm}
        onClose={() => setOpenForm(false)}
      />
    </Box>
  );
};

export default RawMaterials;
