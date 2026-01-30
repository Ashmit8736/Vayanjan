

import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Stack,
  Divider
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProductionCreate = () => {
  const navigate = useNavigate();

  return (
    <Box p={2}>
      <Typography fontSize={20} fontWeight={700}>
        Add Production Process
      </Typography>

      <Typography fontSize={13} color="text.secondary" mb={2}>
        Create or modify production process you just need to add from and to raw material here
      </Typography>

      <Paper sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between">
          <Box>
            <Typography fontWeight={600}>To Raw Material</Typography>
            <Typography fontSize={12} color="text.secondary">
              This refers to the process where the raw material is the final output.
            </Typography>
          </Box>

          <Button size="small" variant="outlined">
            More Option
          </Button>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" spacing={2}>
          <TextField label="Production Name" size="small" fullWidth />

          <Select size="small" displayEmpty fullWidth>
            <MenuItem value="">Select Raw Material</MenuItem>
            <MenuItem value="Sugar">Sugar</MenuItem>
            <MenuItem value="Milk">Milk</MenuItem>
          </Select>

          <TextField label="Quantity" size="small" fullWidth />

          <Select size="small" displayEmpty fullWidth>
            <MenuItem value="">Select Unit</MenuItem>
            <MenuItem value="Kg">Kg</MenuItem>
            <MenuItem value="Liter">Liter</MenuItem>
          </Select>

          <Button
            variant="outlined"
            sx={{ borderColor: "#d32f2f", color: "#d32f2f" }}
          >
            Add
          </Button>
        </Stack>
      </Paper>

      {/* FOOTER */}
      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={1}
        mt={2}
        sx={{ background: "#fdeaea", p: 2, borderRadius: 1 }}
      >
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Cancel
        </Button>

        <Button
          variant="contained"
          sx={{ bgcolor: "#d32f2f", "&:hover": { bgcolor: "#b71c1c" } }}
        >
          Save Changes
        </Button>
      </Stack>
    </Box>
  );
};

export default ProductionCreate;