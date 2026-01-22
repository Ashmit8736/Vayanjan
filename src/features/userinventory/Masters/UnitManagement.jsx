import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper
} from "@mui/material";
import {
  Add,
  ContentPaste,
  Edit,
  Close
} from "@mui/icons-material";

const units = [
  "25 kg bag",
  "Qty",
  "Bag",
  "Bun",
  "Can",
  "ML",
  "BOX",
  "BULK",
  "Btls"
];

const UnitManagement = () => {
  return (
    <Box sx={page}>
      {/* HEADER */}
      <Box sx={header}>
        <Typography variant="h6" fontWeight={700}>
          Unit Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          sx={createBtn}
        >
          Create New
        </Button>
      </Box>

      {/* FILTER BAR */}
      <Paper sx={filterBar}>
        <Box>
          <Typography fontSize={13} mb={0.5}>
            Name
          </Typography>
          <TextField size="small" placeholder="Search unit" />
        </Box>

        <Button variant="outlined" color="error">
          Search
        </Button>

        <Button variant="outlined">
          Clear
        </Button>
      </Paper>

      {/* TABLE */}
      <Paper sx={tableWrap}>
        <Table>
          <TableHead>
            <TableRow sx={thead}>
              <TableCell>Name</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Modified</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {units.map((unit, index) => (
              <TableRow key={index} hover>
                <TableCell>{unit}</TableCell>
                <TableCell>16 Aug 2025 15:23:04</TableCell>
                <TableCell>16 Aug 2025 15:23:04</TableCell>
                <TableCell align="center">
                  <IconButton sx={iconBtn}>
                    <ContentPaste fontSize="small" />
                  </IconButton>
                  <IconButton sx={iconBtn}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton sx={deleteBtn}>
                    <Close fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

/* ===================== STYLES ===================== */

const page = {
  p: 3,
  bgcolor: "#F8FAFC",
  minHeight: "100vh"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 2
};

const createBtn = {
  bgcolor: "#C62828",
  textTransform: "none",
  fontWeight: 600,
  "&:hover": {
    bgcolor: "#B71C1C"
  }
};

const filterBar = {
  p: 2,
  mb: 2,
  display: "flex",
  alignItems: "flex-end",
  gap: 2
};

const tableWrap = {
  borderRadius: 2,
  overflow: "hidden"
};

const thead = {
  bgcolor: "#EFF6FF",
  "& th": {
    fontWeight: 700
  }
};

const iconBtn = {
  bgcolor: "#F1F5F9",
  mx: 0.5,
  "&:hover": {
    bgcolor: "#E2E8F0"
  }
};

const deleteBtn = {
  bgcolor: "#FEE2E2",
  mx: 0.5,
  "&:hover": {
    bgcolor: "#FCA5A5"
  }
};

export default UnitManagement;


