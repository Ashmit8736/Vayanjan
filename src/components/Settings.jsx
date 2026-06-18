import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      <Button 
        variant="outlined" 
        onClick={() => navigate(-1)} 
        sx={{ mb: 3 }}
      >
        ← Go Back
      </Button>

      <Typography fontSize={24} fontWeight={800} mb={3}>
        Settings
      </Typography>

      <Paper sx={{ p: 5, textAlign: "center", color: "gray", borderRadius: 3 }}>
        <Typography variant="h6">This module is under development.</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          The settings configuration will be available in a future update.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Settings;
