// import {
//   Box,
//   TextField,
//   Button,
//   IconButton,
//   MenuItem,
// } from "@mui/material";
// import { Add, Close } from "@mui/icons-material";
// import { useState } from "react";

// const AddRecipeCreation = ({ onSuccess }) => {
//   const token = localStorage.getItem("authoken");

//   const [form, setForm] = useState({
//     item_id: "",
//     item_quantity: "",
//     item_unit_id: "",
//     materials: [
//       { raw_material_id: "", quantity: "", consume_unit_id: "" },
//     ],
//   });

//   /* ================= HANDLE CHANGE ================= */

//   const handleMaterialChange = (index, field, value) => {
//     const updated = [...form.materials];
//     updated[index][field] = value;
//     setForm({ ...form, materials: updated });
//   };

//   const addMaterial = () => {
//     setForm({
//       ...form,
//       materials: [
//         ...form.materials,
//         { raw_material_id: "", quantity: "", consume_unit_id: "" },
//       ],
//     });
//   };

//   const removeMaterial = (index) => {
//     const updated = form.materials.filter((_, i) => i !== index);
//     setForm({ ...form, materials: updated });
//   };

//   /* ================= SAVE RECIPE ================= */

//   const handleSave = async () => {
//     try {
//       const res = await fetch(
//         "http://localhost:5000/api/recipe/create",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             item_id: Number(form.item_id),
//             item_quantity: Number(form.item_quantity),
//             item_unit_id: Number(form.item_unit_id),
//             materials: form.materials.map((m) => ({
//               raw_material_id: Number(m.raw_material_id),
//               quantity: Number(m.quantity),
//               consume_unit_id: Number(m.consume_unit_id),
//             })),
//           }),
//         }
//       );

//       const result = await res.json();

//       if (!res.ok) {
//         alert(result.message || "Recipe create failed");
//         return;
//       }

//       alert("Recipe created successfully ✅");
//       onSuccess();
//     } catch (err) {
//       console.error(err);
//       alert("Server error");
//     }
//   };

//   return (
//     <Box display="flex" flexDirection="column" gap={2}>
//       {/* ITEM INFO */}
//       <TextField
//         label="Item ID"
//         value={form.item_id}
//         onChange={(e) =>
//           setForm({ ...form, item_id: e.target.value })
//         }
//       />

//       <TextField
//         label="Item Quantity"
//         value={form.item_quantity}
//         onChange={(e) =>
//           setForm({ ...form, item_quantity: e.target.value })
//         }
//       />

//       <TextField
//         label="Item Unit ID"
//         value={form.item_unit_id}
//         onChange={(e) =>
//           setForm({ ...form, item_unit_id: e.target.value })
//         }
//       />

//       {/* RAW MATERIALS */}
//       {form.materials.map((m, i) => (
//         <Box
//           key={i}
//           display="flex"
//           gap={1}
//           alignItems="center"
//         >
//           <TextField
//             label="Raw Material ID"
//             value={m.raw_material_id}
//             onChange={(e) =>
//               handleMaterialChange(i, "raw_material_id", e.target.value)
//             }
//           />
//           <TextField
//             label="Quantity"
//             value={m.quantity}
//             onChange={(e) =>
//               handleMaterialChange(i, "quantity", e.target.value)
//             }
//           />
//           <TextField
//             label="Consume Unit ID"
//             value={m.consume_unit_id}
//             onChange={(e) =>
//               handleMaterialChange(i, "consume_unit_id", e.target.value)
//             }
//           />

//           {i > 0 && (
//             <IconButton onClick={() => removeMaterial(i)}>
//               <Close />
//             </IconButton>
//           )}
//         </Box>
//       ))}

//       <Button startIcon={<Add />} onClick={addMaterial}>
//         Add Raw Material
//       </Button>

//       <Box display="flex" justifyContent="flex-end" mt={2}>
//         <Button variant="contained" onClick={handleSave}>
//           Save Recipe
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default AddRecipeCreation;









// import {
//   Box,
//   TextField,
//   Button,
//   IconButton,
// } from "@mui/material";
// import { Add, Close } from "@mui/icons-material";
// import { useState } from "react";

// const AddRecipeCreation = ({ onSuccess }) => {
//   const token = localStorage.getItem("authToken"); // ✅ FIXED

//   const [form, setForm] = useState({
//     item_id: "",
//     item_quantity: "",
//     item_unit_id: "",
//     materials: [
//       { raw_material_id: "", quantity: "", consume_unit_id: "" },
//     ],
//   });

//   /* ================= MATERIAL CHANGE ================= */
//   const handleMaterialChange = (index, field, value) => {
//     const updated = [...form.materials];
//     updated[index][field] = value;
//     setForm({ ...form, materials: updated });
//   };

//   const addMaterial = () => {
//     setForm({
//       ...form,
//       materials: [
//         ...form.materials,
//         { raw_material_id: "", quantity: "", consume_unit_id: "" },
//       ],
//     });
//   };

//   const removeMaterial = (index) => {
//     const updated = form.materials.filter((_, i) => i !== index);
//     setForm({ ...form, materials: updated });
//   };

//   /* ================= VALIDATION ================= */
//   const validateForm = () => {
//     if (!form.item_id || !form.item_quantity || !form.item_unit_id) {
//       alert("Item ID, Quantity & Unit are required");
//       return false;
//     }

//     for (let m of form.materials) {
//       if (!m.raw_material_id || !m.quantity || !m.consume_unit_id) {
//         alert("All raw material fields are required");
//         return false;
//       }
//     }

//     return true;
//   };

//   /* ================= SAVE RECIPE ================= */
//   const handleSave = async () => {
//     if (!validateForm()) return;

//     try {
//       const payload = {
//         item_id: Number(form.item_id),
//         item_quantity: Number(form.item_quantity),
//         item_unit_id: Number(form.item_unit_id),
//         materials: form.materials.map((m) => ({
//           raw_material_id: Number(m.raw_material_id),
//           quantity: Number(m.quantity),
//           consume_unit_id: Number(m.consume_unit_id),
//         })),
//       };

//       console.log("RECIPE CREATE PAYLOAD:", payload);

//       const res = await fetch(
//         "http://localhost:5000/api/recipe/create",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const result = await res.json();
//       console.log("RECIPE CREATE RESPONSE:", result);

//       if (!res.ok) {
//         alert(result.message || "Recipe create failed");
//         return;
//       }

//       alert("Recipe created successfully ✅");
//       onSuccess();
//     } catch (err) {
//       console.error("Create recipe error:", err);
//       alert("Server error");
//     }
//   };

//   return (
//     <Box display="flex" flexDirection="column" gap={2}>
//       {/* ITEM INFO */}
//       <TextField
//         label="Item ID"
//         type="number"
//         value={form.item_id}
//         onChange={(e) =>
//           setForm({ ...form, item_id: e.target.value })
//         }
//       />

//       <TextField
//         label="Item Quantity"
//         type="number"
//         value={form.item_quantity}
//         onChange={(e) =>
//           setForm({ ...form, item_quantity: e.target.value })
//         }
//       />

//       <TextField
//         label="Item Unit ID"
//         type="number"
//         value={form.item_unit_id}
//         onChange={(e) =>
//           setForm({ ...form, item_unit_id: e.target.value })
//         }
//       />

//       {/* RAW MATERIALS */}
//       {form.materials.map((m, i) => (
//         <Box key={i} display="flex" gap={1} alignItems="center">
//           <TextField
//             label="Raw Material ID"
//             type="number"
//             value={m.raw_material_id}
//             onChange={(e) =>
//               handleMaterialChange(i, "raw_material_id", e.target.value)
//             }
//           />

//           <TextField
//             label="Quantity"
//             type="number"
//             value={m.quantity}
//             onChange={(e) =>
//               handleMaterialChange(i, "quantity", e.target.value)
//             }
//           />

//           <TextField
//             label="Consume Unit ID"
//             type="number"
//             value={m.consume_unit_id}
//             onChange={(e) =>
//               handleMaterialChange(i, "consume_unit_id", e.target.value)
//             }
//           />

//           {i > 0 && (
//             <IconButton onClick={() => removeMaterial(i)}>
//               <Close />
//             </IconButton>
//           )}
//         </Box>
//       ))}

//       <Button startIcon={<Add />} onClick={addMaterial}>
//         Add Raw Material
//       </Button>

//       <Box display="flex" justifyContent="flex-end" mt={2}>
//         <Button variant="contained" onClick={handleSave}>
//           Save Recipe
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default AddRecipeCreation;


import {
  Box,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import { useEffect, useState } from "react";

const AddRecipeCreation = ({ onSuccess }) => {
  const token = localStorage.getItem("authToken");

  const [items, setItems] = useState([]);
  const [units, setUnits] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);

  const [form, setForm] = useState({
    item_id: "",
    item_quantity: "",
    item_unit_id: "",
    materials: [
      { raw_material_id: "", quantity: "", consume_unit_id: "" },
    ],
  });

  /* ================= LOAD DROPDOWNS ================= */
  useEffect(() => {
    fetchItems();
    fetchUnits();
    fetchRawMaterials();
  }, []);

  const fetchItems = async () => {
    const res = await fetch("http://localhost:5000/api/item/list", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();
    setItems(Array.isArray(result.data) ? result.data : []);
  };

  const fetchUnits = async () => {
    const res = await fetch("http://localhost:5000/api/units/getUnit");
    const result = await res.json();
    setUnits(Array.isArray(result.data) ? result.data : result);
  };

  const fetchRawMaterials = async () => {
    const res = await fetch("http://localhost:5000/api/raw/get", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();
    setRawMaterials(Array.isArray(result.data) ? result.data : []);
  };

  /* ================= MATERIAL HANDLERS ================= */
  const handleMaterialChange = (index, field, value) => {
    const updated = [...form.materials];
    updated[index][field] = value;
    setForm({ ...form, materials: updated });
  };

  const addMaterial = () => {
    setForm({
      ...form,
      materials: [
        ...form.materials,
        { raw_material_id: "", quantity: "", consume_unit_id: "" },
      ],
    });
  };

  const removeMaterial = (index) => {
    setForm({
      ...form,
      materials: form.materials.filter((_, i) => i !== index),
    });
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    const payload = {
      item_id: Number(form.item_id),
      item_quantity: Number(form.item_quantity),
      item_unit_id: Number(form.item_unit_id),
      materials: form.materials.map((m) => ({
        raw_material_id: Number(m.raw_material_id),
        quantity: Number(m.quantity),
        consume_unit_id: Number(m.consume_unit_id),
      })),
    };

    const res = await fetch("http://localhost:5000/api/recipe/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Recipe create failed");
      return;
    }

    alert("Recipe created successfully ✅");
    onSuccess();
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* ================= ITEM INFO ================= */}
      <Paper sx={{ p: 2 }}>
        <Typography fontWeight={700} mb={2}>
          Item Information
        </Typography>

        <Box display="grid" gridTemplateColumns="2fr 1fr 1fr" gap={2}>
          <TextField
            select
            label="Item Name"
            value={form.item_id}
            onChange={(e) =>
              setForm({ ...form, item_id: e.target.value })
            }
          >
            {items.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Quantity"
            type="number"
            value={form.item_quantity}
            onChange={(e) =>
              setForm({ ...form, item_quantity: e.target.value })
            }
          />

          <TextField
            select
            label="Unit"
            value={form.item_unit_id}
            onChange={(e) =>
              setForm({ ...form, item_unit_id: e.target.value })
            }
          >
            {units.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.unit_name} ({u.unit_symbol})
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Paper>

      {/* ================= RAW MATERIALS ================= */}
      <Paper sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography fontWeight={700}>
            Raw Materials
          </Typography>

          <Button
            size="small"
            startIcon={<Add />}
            onClick={addMaterial}
          >
            Add Material
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {form.materials.map((m, i) => (
          <Box
            key={i}
            display="grid"
            gridTemplateColumns="3fr 1fr 1.5fr auto"
            gap={2}
            alignItems="center"
            mb={2}
          >
            <TextField
              select
              label="Raw Material"
              value={m.raw_material_id}
              onChange={(e) =>
                handleMaterialChange(
                  i,
                  "raw_material_id",
                  e.target.value
                )
              }
            >
              {rawMaterials.map((rm) => (
                <MenuItem key={rm.id} value={rm.id}>
                  {rm.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Qty"
              type="number"
              value={m.quantity}
              onChange={(e) =>
                handleMaterialChange(i, "quantity", e.target.value)
              }
            />

            <TextField
              select
              label="Unit"
              value={m.consume_unit_id}
              onChange={(e) =>
                handleMaterialChange(
                  i,
                  "consume_unit_id",
                  e.target.value
                )
              }
            >
              {units.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.unit_symbol}
                </MenuItem>
              ))}
            </TextField>

            {i > 0 && (
              <IconButton
                color="error"
                onClick={() => removeMaterial(i)}
              >
                <Close />
              </IconButton>
            )}
          </Box>
        ))}
      </Paper>

      {/* ================= ACTION ================= */}
      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" onClick={handleSave}>
          Save Recipe
        </Button>
      </Box>
    </Box>
  );
};

export default AddRecipeCreation;