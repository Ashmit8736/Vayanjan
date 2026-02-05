
// import {
//   Box,
//   TextField,
//   Button,
//   IconButton,
//   MenuItem,
//   Paper,
//   Typography,
//   Divider,
// } from "@mui/material";
// import { Add, Close } from "@mui/icons-material";
// import { useEffect, useState } from "react";

// const AddRecipeCreation = ({ onSuccess }) => {
//   const token = localStorage.getItem("authToken");

//   const [items, setItems] = useState([]);
//   const [units, setUnits] = useState([]);
//   const [rawMaterials, setRawMaterials] = useState([]);

//   const [form, setForm] = useState({
//     item_id: "",
//     item_quantity: "",
//     item_unit_id: "",
//     materials: [
//       { raw_material_id: "", quantity: "", consume_unit_id: "" },
//     ],
//   });

//   /* ================= LOAD DROPDOWNS ================= */
//   useEffect(() => {
//     fetchItems();
//     fetchUnits();
//     fetchRawMaterials();
//   }, []);

//   const fetchItems = async () => {
//     const res = await fetch("http://localhost:5000/api/item/list", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const result = await res.json();
//     setItems(Array.isArray(result.data) ? result.data : []);
//   };

//   const fetchUnits = async () => {
//     const res = await fetch("http://localhost:5000/api/units/getUnit");
//     const result = await res.json();
//     setUnits(Array.isArray(result.data) ? result.data : result);
//   };

//   const fetchRawMaterials = async () => {
//     const res = await fetch("http://localhost:5000/api/raw/get", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const result = await res.json();
//     setRawMaterials(Array.isArray(result.data) ? result.data : []);
//   };

//   /* ================= MATERIAL HANDLERS ================= */
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
//     setForm({
//       ...form,
//       materials: form.materials.filter((_, i) => i !== index),
//     });
//   };

//   /* ================= SAVE ================= */
//   const handleSave = async () => {
//     const payload = {
//       item_id: Number(form.item_id),
//       item_quantity: Number(form.item_quantity),
//       item_unit_id: Number(form.item_unit_id),
//       materials: form.materials.map((m) => ({
//         raw_material_id: Number(m.raw_material_id),
//         quantity: Number(m.quantity),
//         consume_unit_id: Number(m.consume_unit_id),
//       })),
//     };

//     const res = await fetch("http://localhost:5000/api/recipe/create", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) {
//       alert("Recipe create failed");
//       return;
//     }

//     alert("Recipe created successfully ✅");
//     onSuccess();
//   };

//   return (
//     <Box display="flex" flexDirection="column" gap={3}>
//       {/* ================= ITEM INFO ================= */}
//       <Paper sx={{ p: 2 }}>
//         <Typography fontWeight={700} mb={2}>
//           Item Information
//         </Typography>

//         <Box display="grid" gridTemplateColumns="2fr 1fr 1fr" gap={2}>
//           <TextField
//             select
//             label="Item Name"
//             value={form.item_id}
//             onChange={(e) =>
//               setForm({ ...form, item_id: e.target.value })
//             }
//           >
//             {items.map((item) => (
//               <MenuItem key={item.id} value={item.id}>
//                 {item.name}
//               </MenuItem>
//             ))}
//           </TextField>

//           <TextField
//             label="Quantity"
//             type="number"
//             value={form.item_quantity}
//             onChange={(e) =>
//               setForm({ ...form, item_quantity: e.target.value })
//             }
//           />

//           <TextField
//             select
//             label="Unit"
//             value={form.item_unit_id}
//             onChange={(e) =>
//               setForm({ ...form, item_unit_id: e.target.value })
//             }
//           >
//             {units.map((u) => (
//               <MenuItem key={u.id} value={u.id}>
//                 {u.unit_name} ({u.unit_symbol})
//               </MenuItem>
//             ))}
//           </TextField>
//         </Box>
//       </Paper>

//       {/* ================= RAW MATERIALS ================= */}
//       <Paper sx={{ p: 2 }}>
//         <Box display="flex" justifyContent="space-between" mb={1}>
//           <Typography fontWeight={700}>
//             Raw Materials
//           </Typography>

//           <Button
//             size="small"
//             startIcon={<Add />}
//             onClick={addMaterial}
//           >
//             Add Material
//           </Button>
//         </Box>

//         <Divider sx={{ mb: 2 }} />

//         {form.materials.map((m, i) => (
//           <Box
//             key={i}
//             display="grid"
//             gridTemplateColumns="3fr 1fr 1.5fr auto"
//             gap={2}
//             alignItems="center"
//             mb={2}
//           >
//             <TextField
//               select
//               label="Raw Material"
//               value={m.raw_material_id}
//               onChange={(e) =>
//                 handleMaterialChange(
//                   i,
//                   "raw_material_id",
//                   e.target.value
//                 )
//               }
//             >
//               {rawMaterials.map((rm) => (
//                 <MenuItem key={rm.id} value={rm.id}>
//                   {rm.name}
//                 </MenuItem>
//               ))}
//             </TextField>

//             <TextField
//               label="Qty"
//               type="number"
//               value={m.quantity}
//               onChange={(e) =>
//                 handleMaterialChange(i, "quantity", e.target.value)
//               }
//             />

//             <TextField
//               select
//               label="Unit"
//               value={m.consume_unit_id}
//               onChange={(e) =>
//                 handleMaterialChange(
//                   i,
//                   "consume_unit_id",
//                   e.target.value
//                 )
//               }
//             >
//               {units.map((u) => (
//                 <MenuItem key={u.id} value={u.id}>
//                   {u.unit_symbol}
//                 </MenuItem>
//               ))}
//             </TextField>

//             {i > 0 && (
//               <IconButton
//                 color="error"
//                 onClick={() => removeMaterial(i)}
//               >
//                 <Close />
//               </IconButton>
//             )}
//           </Box>
//         ))}
//       </Paper>

//       {/* ================= ACTION ================= */}
//       <Box display="flex" justifyContent="flex-end">
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



const handleSave = async () => {
  if (!form.item_id || !form.item_quantity || !form.item_unit_id) {
  alert("Please fill item details");
  return;
}

for (let i = 0; i < form.materials.length; i++) {
  const m = form.materials[i];

  if (
    !m.raw_material_id ||
    !m.quantity ||
    Number(m.quantity) <= 0 ||
    !m.consume_unit_id
  ) {
    alert(`Please fill valid data for material #${i + 1}`);
    return;
  }
}
  const payload = {
    item_id: Number(form.item_id),
    item_quantity: Number(form.item_quantity),
    item_unit_id: Number(form.item_unit_id),
    materials: form.materials
  .filter(
    (m) =>
      m.raw_material_id &&
      m.quantity &&
      Number(m.quantity) > 0 &&
      m.consume_unit_id
  )
  .map((m) => ({
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

  const result = await res.json(); // 🔴 IMPORTANT

  // ❌ error case
  if (!res.ok) {
    alert(result.message); // 🔥 backend ka exact message
    return;
  }

  // ✅ success
  alert(result.message);
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