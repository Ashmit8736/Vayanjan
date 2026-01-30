import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Stack,
  IconButton,
  Divider
} from "@mui/material";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Add from "@mui/icons-material/Add";

const EditProduction = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // To Raw Material
  const [productionName, setProductionName] = useState("Chandra Kala");
  const [toRaw, setToRaw] = useState({
    rawMaterial: "",
    quantity: "",
    unit: "Kg"
  });

  // From Raw Material
  const [fromRawList, setFromRawList] = useState([
    { raw: "Maida", qty: "1.25", unit: "Kg" },
    { raw: "Khova", qty: "1", unit: "Kg" },
    { raw: "Coconut Gola", qty: "0.25", unit: "Kg" },
    { raw: "Badam", qty: "100", unit: "GM" },
    { raw: "Chiroji", qty: "50", unit: "GM" }
  ]);

  const addFromRaw = () => {
    setFromRawList([...fromRawList, { raw: "", qty: "", unit: "Kg" }]);
  };

  const removeFromRaw = (index) => {
    setFromRawList(fromRawList.filter((_, i) => i !== index));
  };

  return (
    <Box p={2}>
      <Typography fontSize={20} fontWeight={700} mb={2}>
        Edit Production
      </Typography>

      {/* ================= TO RAW MATERIAL ================= */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography fontWeight={600} mb={0.5}>
          To Raw Material
        </Typography>
        <Typography fontSize={12} color="text.secondary" mb={2}>
          This refers to the process where the raw material is the final output of
          a production or conversion activity.
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Production Name"
            value={productionName}
            onChange={(e) => setProductionName(e.target.value)}
            fullWidth
          />

          <Select
            displayEmpty
            value={toRaw.rawMaterial}
            onChange={(e) =>
              setToRaw({ ...toRaw, rawMaterial: e.target.value })
            }
            fullWidth
          >
            <MenuItem value="">
              <em>Select Raw Material</em>
            </MenuItem>
            <MenuItem value="Chandra Kala">Chandra Kala</MenuItem>
          </Select>

          <TextField
            label="Quantity"
            value={toRaw.quantity}
            onChange={(e) =>
              setToRaw({ ...toRaw, quantity: e.target.value })
            }
            sx={{ width: 120 }}
          />

          <Select
            value={toRaw.unit}
            onChange={(e) =>
              setToRaw({ ...toRaw, unit: e.target.value })
            }
            sx={{ width: 100 }}
          >
            <MenuItem value="Kg">Kg</MenuItem>
            <MenuItem value="GM">GM</MenuItem>
          </Select>

          <Button variant="outlined" color="error">
            Add
          </Button>
        </Stack>

        <Box
          mt={2}
          p={1.2}
          bgcolor="#fafafa"
          borderLeft="4px solid #d32f2f"
        >
                  </Box>
      </Paper>

      {/* ================= FROM RAW MATERIAL ================= */}
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" mb={1}>
          <Box>
            <Typography fontWeight={600}>From Raw Material</Typography>
            <Typography fontSize={12} color="text.secondary">
              This indicates the raw material used to produce another product.
              These are inputs or consumables consumed in process.
            </Typography>
          </Box>

          <Button
            startIcon={<Add />}
            variant="outlined"
            color="error"
            onClick={addFromRaw}
          >
            Add New
          </Button>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {fromRawList.map((row, i) => (
          <Stack
            key={i}
            direction="row"
            spacing={2}
            alignItems="center"
            mb={1}
          >
            <Select value={row.raw} fullWidth>
              <MenuItem value={row.raw}>{row.raw}</MenuItem>
            </Select>

            <TextField value={row.qty} sx={{ width: 120 }} />

            <Select value={row.unit} sx={{ width: 100 }}>
              <MenuItem value="Kg">Kg</MenuItem>
              <MenuItem value="GM">GM</MenuItem>
            </Select>

            <IconButton color="error" onClick={() => removeFromRaw(i)}>
              <DeleteOutline />
            </IconButton>
          </Stack>
        ))}

        <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button variant="contained" color="error">
            Save Changes
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default EditProduction;