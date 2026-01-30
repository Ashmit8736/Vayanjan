
import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Stack,
  Select,
  MenuItem,
  Checkbox,
  Switch,
  InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const data = [
  "Chandra Kala",
  "Rabdi Barfi",
  "Mix Dry Fruit Laddu",
  "Besan Laddu",
  "Atta Gond Laddu",
  "Jalebi",
  "Sohan Papdi"
];

const ProductionExecution = () => {
  const [qty, setQty] = useState({});
  const [checked, setChecked] = useState({});
  const [search, setSearch] = useState("");
  const [productionItems, setProductionItems] = useState([]);

  // 🔍 SEARCH FILTER
  const filteredData = data.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  // 📤 SEND TO PRODUCTION
  const handleSendToProduction = () => {
    const selected = Object.keys(checked)
      .filter((item) => checked[item])
      .map((item) => ({
        name: item,
        qty: qty[item] || 0
      }));

    setProductionItems(selected);
  };
    // ✅ ADD THIS
  const handleCancel = () => {
    setChecked({});
    setQty({});
    setSearch("");
    setProductionItems([]);
  };

  return (
    <Box p={2} bgcolor="#fafafa">
      {/* TOP BAR */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between">
          <Box display="flex" gap={1}>
            <Select size="small" value="Direct Product">
              <MenuItem value="Direct Product">Direct Product</MenuItem>
            </Select>

            <Button size="small" variant="outlined">
              More Filters
            </Button>

            <Button size="small" variant="outlined" color="error">
              Search
            </Button>
          </Box>

          <Box display="flex" gap={1}>
            <Button size="small" variant="outlined">
              Production Via Excel
            </Button>
            <Button size="small" variant="outlined">
              Generate Production Plan
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* MAIN */}
      <Paper>
        <Box display="flex">
          {/* LEFT PANEL */}
          <Box width="55%" p={2} borderRight="1px solid #eee">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography fontWeight={600}>
                Select Production Processes
              </Typography>

              <TextField
                size="small"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <Divider />

            {/* HEADER */}
            <Box display="flex" alignItems="center" py={1}>
              <Checkbox disabled />
              <Typography flex={1} fontSize={13}>
                Production Process Name
              </Typography>
              <Typography fontSize={13}>Quantity</Typography>
            </Box>

            <Divider />

            {/* LIST */}
            <Box sx={{ maxHeight: 360, overflowY: "auto" }}>
              {filteredData.map((item) => (
                <Box
                  key={item}
                  display="flex"
                  alignItems="center"
                  py={1}
                >
                  <Checkbox
                    checked={checked[item] || false}
                    onChange={(e) =>
                      setChecked({
                        ...checked,
                        [item]: e.target.checked
                      })
                    }
                  />

                  <Typography flex={1} fontSize={14}>
                    {item}
                  </Typography>

                  <TextField
                    size="small"
                    placeholder="0"
                    value={qty[item] || ""}
                    onChange={(e) =>
                      setQty({
                        ...qty,
                        [item]: e.target.value
                      })
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          / Kg <ChevronRightIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                    sx={{ width: 140 }}
                  />
                </Box>
              ))}

              {filteredData.length === 0 && (
                <Typography
                  fontSize={13}
                  color="text.secondary"
                  align="center"
                  mt={2}
                >
                  No Product Found
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={handleSendToProduction}
            >
              Send Selected To Production
            </Button>
          </Box>

          {/* RIGHT PANEL */}
          <Box width="45%" p={2}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography fontWeight={600}>
                Ready For Production
              </Typography>

              <Box display="flex" alignItems="center" gap={1}>
                <Typography fontSize={13}>With Price</Typography>
                <Switch />
              </Box>
            </Box>

            <Divider />

            {productionItems.length === 0 ? (
              <Box
                height={400}
                display="flex"
                justifyContent="center"
                alignItems="center"
                color="text.secondary"
              >
                <Typography>No Data Available</Typography>
              </Box>
            ) : (
              <Box mt={2}>
                {productionItems.map((item) => (
                  <Paper
                    key={item.name}
                    variant="outlined"
                    sx={{ p: 1.5, mb: 1 }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Typography fontWeight={500}>
                        {item.name}
                      </Typography>
                      <Typography color="text.secondary">
                        {item.qty} Kg
                      </Typography>
                    </Stack>
                  </Paper>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        {/* FOOTER */}
        <Divider />

        <Box
          display="flex"
          justifyContent="flex-end"
          gap={1}
          p={2}
        >
         <Button variant="outlined" onClick={handleCancel}>
  Cancel
</Button>

          <Button variant="contained" color="error">
            Convert To Production
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProductionExecution;

