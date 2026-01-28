import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Drawer,
  TextField,
  Grid,
  Select,
  MenuItem,
  Divider
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";

/* ================= DUMMY DATA ================= */
const dummyPurchases = [
  {
    id: 1,
    supplier: "Shree Traders",
    invoice: "INV-1023",
    date: "2026-01-20",
    amount: 2450,
    status: "Completed"
  },
  {
    id: 2,
    supplier: "Agarwal Foods",
    invoice: "INV-1024",
    date: "2026-01-22",
    amount: 1890,
    status: "Pending"
  }
];

const Purchase = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [purchases, setPurchases] = useState(dummyPurchases);

  /* ================= ADD PURCHASE ================= */
  const handleAddPurchase = () => {
    setPurchases([
      ...purchases,
      {
        id: purchases.length + 1,
        supplier: "New Supplier",
        invoice: `INV-${1000 + purchases.length}`,
        date: new Date().toISOString().slice(0, 10),
        amount: 0,
        status: "Pending"
      }
    ]);
    setOpenDrawer(false);
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      {/* ================= HEADER ================= */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2
        }}
      >
        <Typography fontSize={22} fontWeight={700}>
          Purchase
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDrawer(true)}
        >
          Add Purchase
        </Button>
      </Box>

      {/* ================= SUMMARY ================= */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2">Total Purchases</Typography>
            <Typography fontWeight={700} fontSize={18}>
              {purchases.length}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2">Total Amount</Typography>
            <Typography fontWeight={700} fontSize={18}>
              ₹{" "}
              {purchases.reduce(
                (sum, item) => sum + Number(item.amount),
                0
              )}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2">Pending Purchases</Typography>
            <Typography fontWeight={700} fontSize={18}>
              {purchases.filter((p) => p.status === "Pending").length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ================= TABLE ================= */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Supplier</TableCell>
              <TableCell>Invoice No</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount (₹)</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {purchases.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.supplier}</TableCell>
                <TableCell>{row.invoice}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>
                  <Typography
                    fontWeight={600}
                    color={
                      row.status === "Completed"
                        ? "green"
                        : "warning.main"
                    }
                  >
                    {row.status}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}

            {purchases.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No purchases found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* ================= ADD PURCHASE DRAWER ================= */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        PaperProps={{ sx: { width: 420 } }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Typography fontWeight={700} fontSize={18}>
              Add Purchase
            </Typography>
            <IconButton onClick={() => setOpenDrawer(false)}>
              <Close />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Supplier Name" fullWidth />
            </Grid>

            <Grid item xs={12}>
              <TextField label="Invoice Number" fullWidth />
            </Grid>

            <Grid item xs={12}>
              <TextField type="date" fullWidth />
            </Grid>

            <Grid item xs={12}>
              <TextField label="Amount" type="number" fullWidth />
            </Grid>

            <Grid item xs={12}>
              <Select fullWidth defaultValue="Pending">
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handleAddPurchase}
          >
            Save Purchase
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Purchase;
