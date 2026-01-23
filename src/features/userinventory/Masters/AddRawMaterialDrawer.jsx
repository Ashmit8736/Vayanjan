// import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   Box,
//   Typography,
//   TextField,
//   Select,
//   MenuItem,
//   Button,
//   Paper,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   Grid
// } from "@mui/material";

// const AddRawMaterialDrawer = ({ open, onClose }) => {

//   /* ================= STATE ================= */
//   const [form, setForm] = useState({
//     name: "",
//     category: "",
//     purchase_unit_id: "",
//     consume_unit_id: "",
//     conversion_factor: "",
//     purchase_price: "",
//     tax_type: "GST",
//     tax_percentage: "",
//     minimum_stock_unit_id: "",
//     minimum_stock_level: "",
//     reorder_stock_unit_id: "",
//     reorder_stock_level: "",
//     stock_update_frequency: "DAILY",
//     barcode: "",
//     expiry_days: ""
//   });

//   /* ================= HANDLERS ================= */
//   const handleChange = (key, value) => {
//     setForm(prev => ({ ...prev, [key]: value }));
//   };


// const handleSave = async () => {
//   try {
//     const res = await fetch("http://localhost:5000/api/raw/create", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("authToken")}`
//       },
//       body: JSON.stringify({
//         ...form,
//         purchase_unit_id: Number(form.purchase_unit_id),
//         consume_unit_id: Number(form.consume_unit_id),
//         conversion_factor: Number(form.conversion_factor),
//         purchase_price: Number(form.purchase_price),
//         tax_percentage: Number(form.tax_percentage),
//         minimum_stock_unit_id: Number(form.minimum_stock_unit_id),
//         minimum_stock_level: Number(form.minimum_stock_level),
//         reorder_stock_unit_id: Number(form.reorder_stock_unit_id),
//         reorder_stock_level: Number(form.reorder_stock_level),
//         expiry_days: Number(form.expiry_days)
//       })
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       alert(data.message || "Failed to create raw material");
//       return;
//     }

//     alert("Raw Material created successfully ✅");
//     onClose();
//   } catch (err) {
//     console.error(err);
//     alert("Server error");
//   }
// };


//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogContent sx={{ p: 4, bgcolor: "#f9fafb" }}>

//         <Typography variant="h6" fontWeight={700} mb={3}>
//           Add Raw Material
//         </Typography>

//         {/* BASIC DETAILS */}
//         <Paper sx={section}>
//           <Typography sx={sectionTitle}>Basic Details</Typography>

//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField
//                 label="Name"
//                 required
//                 fullWidth
//                 value={form.name}
//                 onChange={(e) => handleChange("name", e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <TextField
//                 label="Category"
//                 fullWidth
//                 value={form.category}
//                 onChange={(e) => handleChange("category", e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={3}>
//               <TextField
//                 label="Purchase Unit ID"
//                 type="number"
//                 fullWidth
//                 value={form.purchase_unit_id}
//                 onChange={(e) => handleChange("purchase_unit_id", e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={3}>
//               <TextField
//                 label="Consume Unit ID"
//                 type="number"
//                 fullWidth
//                 value={form.consume_unit_id}
//                 onChange={(e) => handleChange("consume_unit_id", e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <TextField
//                 label="Conversion Factor"
//                 helperText="Example: 1 Kg = 1000 gm"
//                 type="number"
//                 fullWidth
//                 value={form.conversion_factor}
//                 onChange={(e) => handleChange("conversion_factor", e.target.value)}
//               />
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* PRICE & TAX */}
//         <Paper sx={section}>
//           <Typography sx={sectionTitle}>Price & Tax</Typography>

//           <Grid container spacing={2}>
//             <Grid item xs={4}>
//               <TextField
//                 label="Purchase Price"
//                 type="number"
//                 fullWidth
//                 value={form.purchase_price}
//                 onChange={(e) => handleChange("purchase_price", e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={4}>
//               <TextField
//                 label="Tax Percentage (%)"
//                 type="number"
//                 fullWidth
//                 value={form.tax_percentage}
//                 onChange={(e) => handleChange("tax_percentage", e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={4}>
//               <Typography fontSize={13} mb={1}>Tax Type</Typography>
//               <RadioGroup
//                 row
//                 value={form.tax_type}
//                 onChange={(e) => handleChange("tax_type", e.target.value)}
//               >
//                 <FormControlLabel value="GST" control={<Radio />} label="GST" />
//                 {/* <FormControlLabel value="VAT" control={<Radio />} label="VAT" /> */}
//               </RadioGroup>
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* STOCK LEVELS */}
//         <Paper sx={section}>
//           <Typography sx={sectionTitle}>Stock Levels</Typography>

//           <Grid container spacing={2}>
//             <Grid item xs={3}>
//               <TextField
//                 label="Minimum Stock Unit ID"
//                 type="number"
//                 fullWidth
//                 value={form.minimum_stock_unit_id}
//                 onChange={(e) => handleChange("minimum_stock_unit_id", e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={3}>
//               <TextField
//                 label="Minimum Stock Level"
//                 type="number"
//                 fullWidth
//                 value={form.minimum_stock_level}
//                 onChange={(e) => handleChange("minimum_stock_level", e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={3}>
//               <TextField
//                 label="Reorder Stock Unit ID"
//                 type="number"
//                 fullWidth
//                 value={form.reorder_stock_unit_id}
//                 onChange={(e) => handleChange("reorder_stock_unit_id", e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={3}>
//               <TextField
//                 label="Reorder Stock Level"
//                 type="number"
//                 fullWidth
//                 value={form.reorder_stock_level}
//                 onChange={(e) => handleChange("reorder_stock_level", e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <Select
//                 fullWidth
//                 value={form.stock_update_frequency}
//                 onChange={(e) => handleChange("stock_update_frequency", e.target.value)}
//               >
//                 <MenuItem value="DAILY">Daily</MenuItem>
//                 <MenuItem value="WEEKLY">Weekly</MenuItem>
//                 <MenuItem value="MONTHLY">Monthly</MenuItem>
//               </Select>
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* OTHER DETAILS */}
//         <Paper sx={section}>
//           <Typography sx={sectionTitle}>Other Details</Typography>

//           <Grid container spacing={2}>
//             <Grid item xs={6}>
//               <TextField
//                 label="Barcode"
//                 fullWidth
//                 value={form.barcode}
//                 onChange={(e) => handleChange("barcode", e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <TextField
//                 label="Expiry Days"
//                 type="number"
//                 fullWidth
//                 value={form.expiry_days}
//                 onChange={(e) => handleChange("expiry_days", e.target.value)}
//               />
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* ACTION */}
//         <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
//           <Button onClick={onClose}>Cancel</Button>
//           <Button variant="contained" onClick={handleSave}>
//             Save
//           </Button>
//         </Box>

//       </DialogContent>
//     </Dialog>
//   );
// };

// /* ================= STYLES ================= */
// const section = { p: 3, mb: 3, borderRadius: 2 };
// const sectionTitle = { fontWeight: 600, mb: 2 };

// export default AddRawMaterialDrawer;


//ansh


// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   Box,
//   Typography,
//   TextField,
//   Select,
//   MenuItem,
//   Button,
//   Paper,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   Grid
// } from "@mui/material";

// const AddRawMaterialDrawer = ({ open, onClose }) => {

//   /* ================= STATE ================= */
//   const [form, setForm] = useState({
//     name: "",
//     category: "",
//     purchase_unit_id: "",
//     consume_unit_id: "",
//     conversion_factor: "",
//     purchase_price: "",
//     tax_type: "GST",
//     tax_percentage: "",
//     minimum_stock_unit_id: "",
//     minimum_stock_level: "",
//     reorder_stock_unit_id: "",
//     reorder_stock_level: "",
//     stock_update_frequency: "DAILY",
//     barcode: "",
//     expiry_days: ""
//   });

//   const [units, setUnits] = useState([]);

//   /* ================= EFFECTS ================= */
//   useEffect(() => {
//     const fetchUnits = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/units/getUnit", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("authToken")}`
//           }
//         });

//         const json = await res.json();
//         if (json.success) {
//           setUnits(json.data);
//         }
//       } catch (err) {
//         console.error("Failed to fetch units", err);
//       }
//     };

//     fetchUnits();
//   }, []);

//   /* ================= HANDLERS ================= */
//   const handleChange = (key, value) => {
//     setForm(prev => ({ ...prev, [key]: value }));
//   };

//   const handleSave = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         alert("Token missing. Please login again.");
//         return;
//       }

//       const res = await fetch("http://localhost:5000/api/raw/create", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           ...form,
//           purchase_unit_id: Number(form.purchase_unit_id),
//           consume_unit_id: Number(form.consume_unit_id),
//           conversion_factor: Number(form.conversion_factor),
//           purchase_price: Number(form.purchase_price),
//           tax_percentage: Number(form.tax_percentage),
//           minimum_stock_unit_id: Number(form.minimum_stock_unit_id),
//           minimum_stock_level: Number(form.minimum_stock_level),
//           reorder_stock_unit_id: Number(form.reorder_stock_unit_id),
//           reorder_stock_level: Number(form.reorder_stock_level),
//           expiry_days: Number(form.expiry_days)
//         })
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.message || "Failed to create raw material");
//         return;
//       }

//       alert("Raw Material created successfully ✅");
//       onClose();
//     } catch (err) {
//       console.error(err);
//       alert("Server error");
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogContent sx={{ p: 4, bgcolor: "#f9fafb" }}>

//         <Typography variant="h6" fontWeight={700} mb={3}>
//           Add Raw Material
//         </Typography>

//         {/* BASIC DETAILS */}
//         <Paper sx={section}>
//           <Typography sx={sectionTitle}>Basic Details</Typography>

//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField
//                 label="Name"
//                 required
//                 fullWidth
//                 value={form.name}
//                 onChange={(e) => handleChange("name", e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <TextField
//                 label="Category"
//                 fullWidth
//                 value={form.category}
//                 onChange={(e) => handleChange("category", e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={3}>
//               <Select
//                 fullWidth
//                 value={form.purchase_unit_id}
//                 displayEmpty
//                 onChange={(e) => handleChange("purchase_unit_id", e.target.value)}
//               >
//                 <MenuItem value="">
//                   <em>Purchase Unit</em>
//                 </MenuItem>
//                 {units.map((unit) => (
//                   <MenuItem key={unit.id} value={unit.id}>
//                     {unit.unit_name} ({unit.unit_symbol})
//                   </MenuItem>
//                 ))}
//               </Select>
//             </Grid>

//             <Grid item xs={3}>
//               <Select
//                 fullWidth
//                 value={form.consume_unit_id}
//                 displayEmpty
//                 onChange={(e) => handleChange("consume_unit_id", e.target.value)}
//               >
//                 <MenuItem value="">
//                   <em>Consume Unit</em>
//                 </MenuItem>
//                 {units.map((unit) => (
//                   <MenuItem key={unit.id} value={unit.id}>
//                     {unit.unit_name} ({unit.unit_symbol})
//                   </MenuItem>
//                 ))}
//               </Select>
//             </Grid>

//             <Grid item xs={6}>
//               <TextField
//                 label="Conversion Factor"
//                 helperText="Example: 1 Kg = 1000 gm"
//                 type="number"
//                 fullWidth
//                 value={form.conversion_factor}
//                 onChange={(e) => handleChange("conversion_factor", e.target.value)}
//               />
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* PRICE & TAX */}
//         <Paper sx={section}>
//           <Typography sx={sectionTitle}>Price & Tax</Typography>

//           <Grid container spacing={2}>
//             <Grid item xs={4}>
//               <TextField
//                 label="Purchase Price"
//                 type="number"
//                 fullWidth
//                 value={form.purchase_price}
//                 onChange={(e) => handleChange("purchase_price", e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={4}>
//               <TextField
//                 label="Tax Percentage (%)"
//                 type="number"
//                 fullWidth
//                 value={form.tax_percentage}
//                 onChange={(e) => handleChange("tax_percentage", e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={4}>
//               <Typography fontSize={13} mb={1}>Tax Type</Typography>
//               <RadioGroup
//                 row
//                 value={form.tax_type}
//                 onChange={(e) => handleChange("tax_type", e.target.value)}
//               >
//                 <FormControlLabel value="GST" control={<Radio />} label="GST" />
//               </RadioGroup>
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* STOCK LEVELS */}
//         <Paper sx={section}>
//           <Typography sx={sectionTitle}>Stock Levels</Typography>

//           <Grid container spacing={2}>
//             <Grid item xs={3}>
//               <TextField
//                 label="Minimum Stock Unit ID"
//                 type="number"
//                 fullWidth
//                 value={form.minimum_stock_unit_id}
//                 onChange={(e) => handleChange("minimum_stock_unit_id", e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={3}>
//               <TextField
//                 label="Minimum Stock Level"
//                 type="number"
//                 fullWidth
//                 value={form.minimum_stock_level}
//                 onChange={(e) => handleChange("minimum_stock_level", e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={3}>
//               <TextField
//                 label="Reorder Stock Unit ID"
//                 type="number"
//                 fullWidth
//                 value={form.reorder_stock_unit_id}
//                 onChange={(e) => handleChange("reorder_stock_unit_id", e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={3}>
//               <TextField
//                 label="Reorder Stock Level"
//                 type="number"
//                 fullWidth
//                 value={form.reorder_stock_level}
//                 onChange={(e) => handleChange("reorder_stock_level", e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <Select
//                 fullWidth
//                 value={form.stock_update_frequency}
//                 onChange={(e) => handleChange("stock_update_frequency", e.target.value)}
//               >
//                 <MenuItem value="DAILY">Daily</MenuItem>
//                 <MenuItem value="WEEKLY">Weekly</MenuItem>
//                 <MenuItem value="MONTHLY">Monthly</MenuItem>
//               </Select>
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* OTHER DETAILS */}
//         <Paper sx={section}>
//           <Typography sx={sectionTitle}>Other Details</Typography>

//           <Grid container spacing={2}>
//             <Grid item xs={6}>
//               <TextField
//                 label="Barcode"
//                 fullWidth
//                 value={form.barcode}
//                 onChange={(e) => handleChange("barcode", e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <TextField
//                 label="Expiry Days"
//                 type="number"
//                 fullWidth
//                 value={form.expiry_days}
//                 onChange={(e) => handleChange("expiry_days", e.target.value)}
//               />
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* ACTION */}
//         <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
//           <Button onClick={onClose}>Cancel</Button>
//           <Button variant="contained" onClick={handleSave}>
//             Save
//           </Button>
//         </Box>

//       </DialogContent>
//     </Dialog>
//   );
// };

// /* ================= STYLES ================= */
// const section = { p: 3, mb: 3, borderRadius: 2 };
// const sectionTitle = { fontWeight: 600, mb: 2 };

// export default AddRawMaterialDrawer;


import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid
} from "@mui/material";

const AddRawMaterialDrawer = ({ open, onClose }) => {

  /* ================= STATE ================= */
  const [form, setForm] = useState({
    name: "",
    category: "",
    purchase_unit_id: "",
    consume_unit_id: "",
    conversion_factor: "",
    purchase_price: "",
    tax_type: "GST",
    tax_percentage: "",
    minimum_stock_unit_id: "",
    minimum_stock_level: "",
    reorder_stock_unit_id: "",
    reorder_stock_level: "",
    stock_update_frequency: "DAILY",
    barcode: "",
    expiry_days: ""
  });

  const [units, setUnits] = useState([]);

  /* ================= EFFECTS ================= */
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/units/getUnit", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
          }
        });

        const json = await res.json();
        if (json.success) {
          setUnits(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch units", err);
      }
    };

    fetchUnits();
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (key, value) => {
    setForm(prev => {
      // 🔥 MAIN LOGIC: consume unit = min & reorder unit
      if (key === "consume_unit_id") {
        return {
          ...prev,
          consume_unit_id: value,
          minimum_stock_unit_id: value,
          reorder_stock_unit_id: value
        };
      }

      return { ...prev, [key]: value };
    });
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Token missing. Please login again.");
        return;
      }

      // 🔥 FINAL GUARANTEE PAYLOAD
      const payload = {
        ...form,
        purchase_unit_id: Number(form.purchase_unit_id),
        consume_unit_id: Number(form.consume_unit_id),

        // 👇 HARD RULE (no escape)
        minimum_stock_unit_id: Number(form.consume_unit_id),
        reorder_stock_unit_id: Number(form.consume_unit_id),

        conversion_factor: Number(form.conversion_factor),
        purchase_price: Number(form.purchase_price),
        tax_percentage: Number(form.tax_percentage),
        minimum_stock_level: Number(form.minimum_stock_level),
        reorder_stock_level: Number(form.reorder_stock_level),
        expiry_days: Number(form.expiry_days)
      };

      console.log("FINAL PAYLOAD 👉", payload);

      const res = await fetch("http://localhost:5000/api/raw/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create raw material");
        return;
      }

      alert("Raw Material created successfully ✅");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ p: 4, bgcolor: "#f9fafb" }}>

        <Typography variant="h6" fontWeight={700} mb={3}>
          Add Raw Material
        </Typography>

        {/* BASIC DETAILS */}
        <Paper sx={section}>
          <Typography sx={sectionTitle}>Basic Details</Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                required
                fullWidth
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Category"
                fullWidth
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
              />
            </Grid>

            <Grid item xs={3}>
              <Select
                fullWidth
                value={form.purchase_unit_id}
                displayEmpty
                onChange={(e) => handleChange("purchase_unit_id", e.target.value)}
              >
                <MenuItem value=""><em>Purchase Unit</em></MenuItem>
                {units.map(unit => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.unit_name} ({unit.unit_symbol})
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={3}>
              <Select
                fullWidth
                value={form.consume_unit_id}
                displayEmpty
                onChange={(e) => handleChange("consume_unit_id", e.target.value)}
              >
                <MenuItem value=""><em>Consume Unit</em></MenuItem>
                {units.map(unit => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.unit_name} ({unit.unit_symbol})
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Conversion Factor"
                type="number"
                helperText="Example: 1 Kg = 1000 gm"
                fullWidth
                value={form.conversion_factor}
                onChange={(e) => handleChange("conversion_factor", e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* PRICE & TAX */}
        <Paper sx={section}>
          <Typography sx={sectionTitle}>Price & Tax</Typography>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                label="Purchase Price"
                type="number"
                fullWidth
                value={form.purchase_price}
                onChange={(e) => handleChange("purchase_price", e.target.value)}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                label="Tax Percentage (%)"
                type="number"
                fullWidth
                value={form.tax_percentage}
                onChange={(e) => handleChange("tax_percentage", e.target.value)}
              />
            </Grid>

            <Grid item xs={4}>
              <Typography fontSize={13} mb={1}>Tax Type</Typography>
              <RadioGroup
                row
                value={form.tax_type}
                onChange={(e) => handleChange("tax_type", e.target.value)}
              >
                <FormControlLabel value="GST" control={<Radio />} label="GST" />
              </RadioGroup>
            </Grid>
          </Grid>
        </Paper>

        {/* STOCK LEVELS */}
        <Paper sx={section}>
          <Typography sx={sectionTitle}>Stock Levels</Typography>

          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField
                label="Minimum Stock Level"
                type="number"
                fullWidth
                value={form.minimum_stock_level}
                onChange={(e) => handleChange("minimum_stock_level", e.target.value)}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                label="Reorder Stock Level"
                type="number"
                fullWidth
                value={form.reorder_stock_level}
                onChange={(e) => handleChange("reorder_stock_level", e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <Select
                fullWidth
                value={form.stock_update_frequency}
                onChange={(e) => handleChange("stock_update_frequency", e.target.value)}
              >
                <MenuItem value="DAILY">Daily</MenuItem>
                <MenuItem value="WEEKLY">Weekly</MenuItem>
                <MenuItem value="MONTHLY">Monthly</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Paper>

        {/* OTHER DETAILS */}
        <Paper sx={section}>
          <Typography sx={sectionTitle}>Other Details</Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Barcode"
                fullWidth 
                value={form.barcode}
                onChange={(e) => handleChange("barcode", e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Expiry Days"
                type="number"
                fullWidth
                value={form.expiry_days}
                onChange={(e) => handleChange("expiry_days", e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* ACTION */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Box>

      </DialogContent>
    </Dialog>
  );
};

/* ================= STYLES ================= */
const section = { p: 3, mb: 3, borderRadius: 2 };
const sectionTitle = { fontWeight: 600, mb: 2 };

export default AddRawMaterialDrawer;
