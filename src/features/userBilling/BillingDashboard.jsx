import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@mui/material";
import { ReceiptLong, Download } from "@mui/icons-material";

const BillingDashboard = () => {
  return (
    <Box sx={pageStyle}>
      {/* HEADER */}
      <Box sx={headerStyle}>
        <Box>
          <Typography variant="h5" fontWeight={800}>
            Billing & Invoices
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage all your billing, plans & invoices
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Download />}
          sx={downloadBtn}
        >
          Download Report
        </Button>
      </Box>

      {/* SUMMARY CARDS */}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Current Plan"
            value="Premium"
            chip="ACTIVE"
            color="success"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Monthly Usage"
            value="₹2,450"
            chip="THIS MONTH"
            color="info"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Pending Amount"
            value="₹0"
            chip="CLEARED"
            color="success"
          />
        </Grid>
      </Grid>

      {/* INVOICE TABLE */}
      <Card sx={tableCard}>
        <CardContent>
          <Typography fontWeight={700} mb={2}>
            Invoice History
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Invoice No</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {[1, 2, 3].map((row) => (
                <TableRow key={row}>
                  <TableCell>#INV-00{row}</TableCell>
                  <TableCell>10 Sep 2026</TableCell>
                  <TableCell>₹999</TableCell>
                  <TableCell>
                    <Chip
                      label="PAID"
                      size="small"
                      color="success"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      startIcon={<ReceiptLong />}
                      sx={viewBtn}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
};

/* ================= STYLES ================= */

const pageStyle = {
  p: 3,
  bgcolor: "#F8FAFC",
  minHeight: "100vh"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const downloadBtn = {
  borderRadius: 2,
  textTransform: "none",
  fontWeight: 600
};

const tableCard = {
  mt: 3,
  borderRadius: 3,
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)"
};

const viewBtn = {
  textTransform: "none",
  fontWeight: 600
};

/* ================= COMPONENT ================= */

const SummaryCard = ({ title, value, chip, color }) => (
  <Card sx={summaryCard}>
    <CardContent>
      <Typography fontSize={13} color="text.secondary">
        {title}
      </Typography>
      <Typography fontSize={24} fontWeight={800} mt={0.5}>
        {value}
      </Typography>
      <Chip
        label={chip}
        size="small"
        color={color}
        sx={{ mt: 1 }}
      />
    </CardContent>
  </Card>
);

const summaryCard = {
  borderRadius: 3,
  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  transition: "all .3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 30px rgba(0,0,0,0.12)"
  }
};

export default BillingDashboard;
