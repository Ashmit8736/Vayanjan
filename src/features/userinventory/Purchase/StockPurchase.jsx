import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Paper,
  Stack,
  Divider
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const StockPurchase = () => {
  return (
    <Box sx={{ p: 3, bgcolor: "#F8FAFC", minHeight: "100vh" }}>

      {/* ===== HEADER ===== */}
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography fontSize={20} fontWeight={700}>
          Purchase List
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ bgcolor: "#DC2626" }}
          >
            Create New
          </Button>

          <Button
            variant="outlined"
            startIcon={<QrCodeScannerIcon />}
            sx={{ borderColor: "#DC2626", color: "#DC2626" }}
          >
            Scan & Purchase
          </Button>

          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
          >
            Export
          </Button>
        </Stack>
      </Stack>

      {/* ===== FILTER BAR ===== */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">

          <TextField
            size="small"
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            InputProps={{ startAdornment: <CalendarMonthIcon /> }}
          />

          <TextField
            size="small"
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            InputProps={{ startAdornment: <CalendarMonthIcon /> }}
          />

          <TextField
            select
            size="small"
            label="From"
            defaultValue="All"
            sx={{ width: 140 }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Supplier">Supplier</MenuItem>
          </TextField>

          <TextField
            size="small"
            label="Invoice No."
            sx={{ width: 160 }}
          />

          <Button
            startIcon={<FilterAltOutlinedIcon />}
            variant="outlined"
          >
            More Filters
          </Button>

          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            sx={{ bgcolor: "#DC2626" }}
          >
            Search
          </Button>

          <Button variant="text">Clear</Button>
        </Stack>
      </Paper>

      {/* ===== EMPTY STATE ===== */}
      <Paper
        sx={{
          height: 380,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Stack alignItems="center" spacing={1}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png"
            width={90}
            alt="No data"
          />
          <Typography fontWeight={600} color="text.secondary">
            No Purchase Found
          </Typography>
        </Stack>
      </Paper>

    </Box>
  );
};

export default StockPurchase;
