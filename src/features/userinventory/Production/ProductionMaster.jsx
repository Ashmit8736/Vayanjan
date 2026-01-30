import { useNavigate } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Chip,
  IconButton,
  Stack
} from "@mui/material";
import EditOutlined from "@mui/icons-material/EditOutlined";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import Add from "@mui/icons-material/Add";
import { useState } from "react";

const dummyData = [
  { name: "Chandra Kala", output: "Chandra Kala", slot: "-", auto: "No" },
  { name: "Rabdi Barfi", output: "Rabdi Barfi", slot: "-", auto: "No" },
  { name: "Mix Dry Fruit Laddu", output: "Mix Dry Fruit Laddu", slot: "-", auto: "No" },
  { name: "Besan Laddu", output: "Besan Laddu", slot: "-", auto: "No" },
  { name: "Atta Gond Laddu", output: "Atta Gond Laddu", slot: "-", auto: "No" },
  { name: "Jalebi", output: "Jalebi", slot: "-", auto: "No" },
  { name: "Sohan Papdi", output: "Sohan Papdi", slot: "-", auto: "No" },
  { name: "Patisha", output: "Patisha", slot: "-", auto: "No" },
  { name: "Coconut Barfi", output: "Coconut Barfi", slot: "-", auto: "No" }
];

const ProductionMaster = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
const navigate = useNavigate();

  return (
    <Box p={2}>
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography fontSize={20} fontWeight={700}>
          Production List
        </Typography>

        <Stack direction="row" spacing={1}>
         <Button
  variant="contained"
  startIcon={<Add />}
  onClick={() => navigate("/inventory/production/create")}
  sx={{ bgcolor: "#d32f2f", "&:hover": { bgcolor: "#b71c1c" } }}
>
  Create New
</Button>

          <Button variant="outlined">Action</Button>
          <Button variant="outlined">Files</Button>
        </Stack>
      </Stack>

      {/* FILTER BAR */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="flex-end">
          <TextField
            label="Search Production"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Box>
            <Typography fontSize={12} mb={0.5}>
              Category
            </Typography>
            <Select
              size="small"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Sweets">Sweets</MenuItem>
              <MenuItem value="Namkeen">Namkeen</MenuItem>
            </Select>
          </Box>

          <Button variant="outlined" sx={{ borderColor: "#d32f2f", color: "#d32f2f" }}>
            Search
          </Button>
          <Button variant="outlined">Clear</Button>
        </Stack>
      </Paper>

      {/* TABLE */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "#f1f6ff" }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell><b>Production Name</b></TableCell>
              <TableCell><b>Final Output</b></TableCell>
              <TableCell><b>Time Slot</b></TableCell>
              <TableCell><b>Auto Production</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {dummyData.map((row, i) => (
              <TableRow key={i}>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  <Chip label={row.output} size="small" />
                </TableCell>
                <TableCell>{row.slot}</TableCell>
                <TableCell>{row.auto}</TableCell>
                <TableCell>
                   <IconButton
    size="small"
    onClick={() => navigate(`/inventory/production/edit/${i}`)}
  >
    <EditOutlined />
  </IconButton>
                  <IconButton size="small"><DeleteOutline /></IconButton>
                  <IconButton size="small"><DescriptionOutlined /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* FOOTER */}
      <Stack direction="row" justifyContent="space-between" mt={2}>
       { /*<Typography fontSize={13}>Showing 1 to 20 of 21 records</Typography>*/}
        <Stack direction="row" spacing={1}>
          {/* <Button size="small" variant="contained">1</Button>
          <Button size="small" variant="outlined">2</Button> */}
          <Button size="small" variant="outlined">Next</Button>
          <Button size="small" variant="outlined">Last</Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ProductionMaster;