import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const PurchaseOrderList = () => {
  return (
    <Box sx={{ p: 3 }}>
      {/* ===== HEADER ===== */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography fontSize={18} fontWeight={700}>
          Purchase Order List
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: "#C62828",
              textTransform: "none",
              "&:hover": { bgcolor: "#B71C1C" },
            }}
          >
            Create New
          </Button>

          <Button
            variant="outlined"
            startIcon={<FileDownloadOutlinedIcon />}
            sx={{ textTransform: "none" }}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* ===== FILTER BAR ===== */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
          }}
        >
          <TextField
            label="Start Date"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="End Date"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            select
            label="To"
            size="small"
            defaultValue="All"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Supplier">Supplier</MenuItem>
            <MenuItem value="Vendor">Vendor</MenuItem>
          </TextField>

          <TextField
            label="PO Number"
            size="small"
          />

          <Button variant="outlined" sx={{ textTransform: "none" }}>
            More Filters
          </Button>

          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            sx={{
              bgcolor: "#C62828",
              textTransform: "none",
              "&:hover": { bgcolor: "#B71C1C" },
            }}
          >
            Search
          </Button>

          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            sx={{ textTransform: "none" }}
          >
            Clear
          </Button>
        </Box>
      </Paper>

      {/* ===== EMPTY STATE ===== */}
      <Paper
        sx={{
          height: "55vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "#6B7280",
        }}
      >
        <Box
          component="img"
          src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
          alt="No Purchase"
          sx={{ width: 120, mb: 2, opacity: 0.7 }}
        />
        <Typography fontWeight={600}>
          No Purchase Found
        </Typography>
      </Paper>
    </Box>
  );
};

export default PurchaseOrderList;
