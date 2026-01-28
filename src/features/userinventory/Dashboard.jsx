import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  LinearProgress,
  MenuItem,
  Select
} from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

/* ---------- Dummy Data ---------- */
const pieData = [
  { name: "Sugar", value: 65 },
  { name: "Milk", value: 25 },
  { name: "Ghee", value: 10 }
];

const COLORS = ["#6aa9ff", "#6ad1c8", "#9be7a4"];

const Dashboard = () => {
  return (
    <Box sx={{ p: 3, backgroundColor: "#f7f8fa", minHeight: "100vh" }}>
      
      {/* ================= Margin Insights ================= */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography fontWeight={600}>Margin Insights</Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Compare your current margins with industry standards
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2">0%</Typography>
          <Box sx={{ flex: 1 }}>
            <LinearProgress
              variant="determinate"
              value={100}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
          <Typography variant="body2">100%</Typography>
        </Box>

        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="body2">Your Actual Margin</Typography>
              <Typography variant="h5" fontWeight={600}>100%</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="body2">Estimated Margin</Typography>
              <Typography variant="h5" fontWeight={600}>94%</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* ================= Current Inventory ================= */}
      <Grid container spacing={3}>
        
        {/* Left Cards */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="body2">Worth of Stocks</Typography>
                <Typography variant="h6" fontWeight={600}>₹ 10,069.92</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="body2">
                  Raw Materials Below Par Level
                </Typography>
                <Typography variant="h6" fontWeight={600}>1</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="body2">
                  Raw Materials Below Min. Level
                </Typography>
                <Typography variant="h6" fontWeight={600}>0</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography fontWeight={600}>Top 10 Raw Materials</Typography>
              <Select size="small" value="all">
                <MenuItem value="all">All Category</MenuItem>
              </Select>
            </Box>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
};

export default Dashboard;
