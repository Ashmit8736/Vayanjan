import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
} from "@mui/material";

const BillingSettings = () => {
  return (
    <Box p={3} bgcolor="#F1F5F9" minHeight="100vh">
      <Typography variant="h4" fontWeight={900} mb={3}>
        ⚙️ Billing Settings
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={paper}>
            <Typography fontWeight={800} mb={2}>
              Business Details
            </Typography>
            <TextField fullWidth label="Business Name" sx={{ mb: 2 }} />
            <TextField fullWidth label="GST Number" sx={{ mb: 2 }} />
            <TextField fullWidth label="Address" multiline rows={2} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={paper}>
            <Typography fontWeight={800} mb={2}>
              Invoice Settings
            </Typography>
            <TextField fullWidth label="Default Tax (%)" sx={{ mb: 2 }} />
            <TextField fullWidth label="Currency (₹)" sx={{ mb: 2 }} />
            <TextField fullWidth label="Invoice Prefix (INV)" />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={paper}>
            <Typography fontWeight={800} mb={2}>
              Save Configuration
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                borderRadius: 3,
                fontWeight: 800,
                px: 4,
              }}
            >
              Save Settings
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const paper = {
  p: 3,
  borderRadius: 4,
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

export default BillingSettings;