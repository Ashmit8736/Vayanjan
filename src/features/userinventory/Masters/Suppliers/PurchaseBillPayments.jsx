import { Box, Typography, Paper } from "@mui/material";

const PurchaseBillPayments = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography fontSize={18} fontWeight={700} mb={2}>
        Purchase Bill Payments
      </Typography>
      <Paper sx={{ p: 3, textAlign: "center", color: "gray" }}>
        <Typography>This module is under development.</Typography>
      </Paper>
    </Box>
  );
};

export default PurchaseBillPayments;
