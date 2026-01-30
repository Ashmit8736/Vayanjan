
// import {
//   Box,
//   Typography,
//   TextField,
//   Paper,
//   Grid,
//   Button,
//   MenuItem,
// } from "@mui/material";

// const AddSupplier = () => {
//   return (
//     <Box sx={{ p: 3 }}>
//       {/* ===== PAGE TITLE ===== */}
//       <Typography fontSize={18} fontWeight={700} mb={2}>
//         Add Supplier / Third Party
//       </Typography>

//       {/* ===== BASIC DETAILS ===== */}
//       <Paper sx={{ p: 3, mb: 3 }}>
//         <Typography fontWeight={600} mb={2}>
//           Basic Details
//         </Typography>

//         <Grid container spacing={2}>
//           <Grid item xs={12} md={4}>
//             <TextField
//               label="Name"
//               required
//               fullWidth
//               size="small"
//             />
//           </Grid>

//           <Grid item xs={12} md={4}>
//             <TextField
//               label="Company"
//               required
//               fullWidth
//               size="small"
//             />
//           </Grid>

//           <Grid item xs={12} md={4}>
//             <TextField
//               label="Email"
//               fullWidth
//               size="small"
//             />
//           </Grid>

//           <Grid item xs={12} md={4}>
//             <TextField
//               label="Phone"
//               fullWidth
//               size="small"
//             />
//           </Grid>

//           <Grid item xs={12} md={4}>
//             <TextField
//               label="GST No"
//               fullWidth
//               size="small"
//             />
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* ===== ADDRESS ===== */}
//       <Paper sx={{ p: 3, mb: 3 }}>
//         <Typography fontWeight={600} mb={2}>
//           Address
//         </Typography>

//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <TextField
//               label="Register Address"
//               fullWidth
//               multiline
//               rows={3}
//             />
//           </Grid>

//           <Grid item xs={12} md={4}>
//             <TextField
//               select
//               label="State"
//               fullWidth
//               size="small"
//               defaultValue="Uttar Pradesh"
//             >
//               <MenuItem value="Uttar Pradesh">Uttar Pradesh</MenuItem>
//               <MenuItem value="Delhi">Delhi</MenuItem>
//               <MenuItem value="Maharashtra">Maharashtra</MenuItem>
//             </TextField>
//           </Grid>

//           <Grid item xs={12} md={4}>
//             <TextField
//               select
//               label="City"
//               fullWidth
//               size="small"
//               defaultValue="Kanpur"
//             >
//               <MenuItem value="Kanpur">Kanpur</MenuItem>
//               <MenuItem value="Lucknow">Lucknow</MenuItem>
//               <MenuItem value="Delhi">Delhi</MenuItem>
//             </TextField>
//           </Grid>

//           <Grid item xs={12} md={4}>
//             <TextField
//               label="Pin Code"
//               fullWidth
//               size="small"
//             />
//           </Grid>

//           <Grid item xs={12}>
//             <TextField
//               label="Shipping Address"
//               fullWidth
//               multiline
//               rows={3}
//             />
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* ===== ACTION BUTTONS ===== */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "flex-end",
//           gap: 2,
//         }}
//       >
//         <Button variant="outlined">Cancel</Button>
//         <Button
//           variant="contained"
//           sx={{
//             bgcolor: "#C62828",
//             textTransform: "none",
//             "&:hover": { bgcolor: "#B71C1C" },
//           }}
//         >
//           Save Changes
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default AddSupplier;










// import {
//   Box,
//   Typography,
//   TextField,
//   Paper,
//   Grid,
//   Button,
//   MenuItem,
// } from "@mui/material";
// import { useState } from "react";
// import axios from "axios";

// const AddSupplier = ({ onClose }) => {
//   const [form, setForm] = useState({
//     name: "",
//     company_name: "",
//     email: "",
//     phone: "",
//     gst_number: "",
//     pan: "",
//     fssai_license: "",
//     msme_number: "",
//     tan: "",
//     cin: "",

//     billing_address: "",
//     billing_state: "Uttar Pradesh",
//     billing_city: "",
//     billing_pincode: "",

//     shipping_address: "",
//     shipping_state: "Uttar Pradesh",
//     shipping_city: "",
//     shipping_pincode: "",

//     tcs_applicable: 1,
//     tcs_type: "purchase",
//     tcs_percentage: 0.1,
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     try {
//       const token = localStorage.getItem("authToken");

//       await axios.post(
//         "http://localhost:5000/api/suppliers/create",
//         form,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       onClose(); // close modal + refresh list
//     } catch (error) {
//       console.error("Failed to create supplier", error);
//       alert("Failed to add supplier");
//     }
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography fontSize={18} fontWeight={700} mb={2}>
//         Add Supplier / Third Party
//       </Typography>

//       {/* ===== BASIC DETAILS ===== */}
//       <Paper sx={{ p: 3, mb: 3 }}>
//         <Typography fontWeight={600} mb={2}>
//           Basic Details
//         </Typography>

//         <Grid container spacing={2}>
//           <Grid item xs={12} md={4}>
//             <TextField
//               label="Name"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               required
//               fullWidth
//               size="small"
//             />
//           </Grid>

//           <Grid item xs={12} md={4}>
//             <TextField
//               label="Company"
//               name="company_name"
//               value={form.company_name}
//               onChange={handleChange}
//               required
//               fullWidth
//               size="small"
//             />
//           </Grid>

//           <Grid item xs={12} md={4}>
//             <TextField
//               label="Email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               fullWidth
//               size="small"
//             />
//           </Grid>

//           <Grid item xs={12} md={4}>
//             <TextField
//               label="Phone"
//               name="phone"
//               value={form.phone}
//               onChange={handleChange}
//               fullWidth
//               size="small"
//             />
//           </Grid>

//           <Grid item xs={12} md={4}>
//             <TextField
//               label="GST No"
//               name="gst_number"
//               value={form.gst_number}
//               onChange={handleChange}
//               fullWidth
//               size="small"
//             />
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* ===== ADDRESS ===== */}
//       <Paper sx={{ p: 3, mb: 3 }}>
//         <Typography fontWeight={600} mb={2}>
//           Address
//         </Typography>

//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <TextField
//               label="Billing Address"
//               name="billing_address"
//               value={form.billing_address}
//               onChange={handleChange}
//               fullWidth
//               multiline
//               rows={3}
//             />
//           </Grid>

//           <Grid item xs={12} md={4}>
//             <TextField
//               select
//               label="State"
//               name="billing_state"
//               value={form.billing_state}
//               onChange={handleChange}
//               fullWidth
//               size="small"
//             >
//               <MenuItem value="Uttar Pradesh">Uttar Pradesh</MenuItem>
//               <MenuItem value="Delhi">Delhi</MenuItem>
//             </TextField>
//           </Grid>

//           <Grid item xs={12} md={4}>
//             <TextField
//               label="City"
//               name="billing_city"
//               value={form.billing_city}
//               onChange={handleChange}
//               fullWidth
//               size="small"
//             />
//           </Grid>

//           <Grid item xs={12} md={4}>
//             <TextField
//               label="Pin Code"
//               name="billing_pincode"
//               value={form.billing_pincode}
//               onChange={handleChange}
//               fullWidth
//               size="small"
//             />
//           </Grid>

//           <Grid item xs={12}>
//             <TextField
//               label="Shipping Address"
//               name="shipping_address"
//               value={form.shipping_address}
//               onChange={handleChange}
//               fullWidth
//               multiline
//               rows={3}
//             />
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* ===== ACTION BUTTONS ===== */}
//       <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
//         <Button variant="outlined" onClick={onClose}>
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           sx={{
//             bgcolor: "#C62828",
//             textTransform: "none",
//             "&:hover": { bgcolor: "#B71C1C" },
//           }}
//         >
//           Save Changes
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default AddSupplier;





















import {
  Box,
  Typography,
  TextField,
  Paper,
  Grid,
  Button,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";

const AddSupplier = ({ onClose }) => {
  const [form, setForm] = useState({
    name: "",
    company_name: "",
    email: "",
    phone: "",

    gst_number: "",
    pan: "",
    fssai_license: "",
    msme_number: "",
    tan: "",
    cin: "",

    billing_address: "",
    billing_state: "Uttar Pradesh",
    billing_city: "",
    billing_pincode: "",

    shipping_address: "",
    shipping_state: "Uttar Pradesh",
    shipping_city: "",
    shipping_pincode: "",

    tcs_applicable: 1,
    tcs_type: "purchase",
    tcs_percentage: 0.1,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { name, company_name, phone, billing_address } = form;

    if (!name || !company_name || !phone || !billing_address) {
      alert("Name, Company Name, Phone and Billing Address are mandatory");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      await axios.post(
        "http://localhost:5000/api/suppliers/create",
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to add supplier");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography fontSize={18} fontWeight={700} mb={2}>
        Add Supplier / Third Party
      </Typography>

      {/* ================= BASIC DETAILS ================= */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography fontWeight={600} mb={2}>Basic Details</Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth size="small" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="Company Name" name="company_name" value={form.company_name} onChange={handleChange} fullWidth size="small" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth size="small" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth size="small" />
          </Grid>
        </Grid>
      </Paper>


      {/* ================= BILLING ADDRESS ================= */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography fontWeight={600} mb={2}>Billing Address</Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Billing Address" name="billing_address" value={form.billing_address} onChange={handleChange} fullWidth multiline rows={3} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="State" name="billing_state" value={form.billing_state} onChange={handleChange} fullWidth size="small" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="City" name="billing_city" value={form.billing_city} onChange={handleChange} fullWidth size="small" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="Pincode" name="billing_pincode" value={form.billing_pincode} onChange={handleChange} fullWidth size="small" />
          </Grid>
        </Grid>
      </Paper>

      {/* ================= SHIPPING ADDRESS ================= */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography fontWeight={600} mb={2}>Shipping Address</Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Shipping Address" name="shipping_address" value={form.shipping_address} onChange={handleChange} fullWidth multiline rows={3} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="State" name="shipping_state" value={form.shipping_state} onChange={handleChange} fullWidth size="small" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="City" name="shipping_city" value={form.shipping_city} onChange={handleChange} fullWidth size="small" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="Pincode" name="shipping_pincode" value={form.shipping_pincode} onChange={handleChange} fullWidth size="small" />
          </Grid>
        </Grid>
      </Paper>

      
      {/* ================= TAX & LEGAL ================= */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography fontWeight={600} mb={2}>Tax & Legal Details</Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField label="GST Number" name="gst_number" value={form.gst_number} onChange={handleChange} fullWidth size="small" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="PAN Number" name="pan" value={form.pan} onChange={handleChange} fullWidth size="small" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="FSSAI License" name="fssai_license" value={form.fssai_license} onChange={handleChange} fullWidth size="small" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="MSME Number" name="msme_number" value={form.msme_number} onChange={handleChange} fullWidth size="small" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="TAN" name="tan" value={form.tan} onChange={handleChange} fullWidth size="small" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="CIN" name="cin" value={form.cin} onChange={handleChange} fullWidth size="small" />
          </Grid>
        </Grid>
      </Paper>

      {/* ================= ACTION ================= */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ bgcolor: "#C62828", textTransform: "none", "&:hover": { bgcolor: "#B71C1C" } }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default AddSupplier;
