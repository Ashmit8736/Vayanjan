// import React from "react";
// import {
//   Box,
//   Grid,
//   Paper,
//   Typography,
//   LinearProgress,
//   MenuItem,
//   Select
// } from "@mui/material";
// import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// /* ---------- Dummy Data ---------- */
// const pieData = [
//   { name: "Sugar", value: 65 },
//   { name: "Milk", value: 25 },
//   { name: "Ghee", value: 10 }
// ];

// const COLORS = ["#6aa9ff", "#6ad1c8", "#9be7a4"];

// const Dashboard = () => {
//   return (
//     <Box sx={{ p: 3, backgroundColor: "#f7f8fa", minHeight: "100vh" }}>
      
//       {/* ================= Margin Insights ================= */}
//       <Paper sx={{ p: 3, mb: 3 }}>
//         <Typography fontWeight={600}>Margin Insights</Typography>
//         <Typography variant="body2" color="text.secondary" mb={2}>
//           Compare your current margins with industry standards
//         </Typography>

//         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//           <Typography variant="body2">0%</Typography>
//           <Box sx={{ flex: 1 }}>
//             <LinearProgress
//               variant="determinate"
//               value={100}
//               sx={{ height: 10, borderRadius: 5 }}
//             />
//           </Box>
//           <Typography variant="body2">100%</Typography>
//         </Box>

//         <Grid container spacing={2} mt={2}>
//           <Grid item xs={12} md={6}>
//             <Paper sx={{ p: 2 }}>
//               <Typography variant="body2">Your Actual Margin</Typography>
//               <Typography variant="h5" fontWeight={600}>100%</Typography>
//             </Paper>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <Paper sx={{ p: 2 }}>
//               <Typography variant="body2">Estimated Margin</Typography>
//               <Typography variant="h5" fontWeight={600}>94%</Typography>
//             </Paper>
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* ================= Current Inventory ================= */}
//       <Grid container spacing={3}>
        
//         {/* Left Cards */}
//         <Grid item xs={12} md={6}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <Paper sx={{ p: 2 }}>
//                 <Typography variant="body2">Worth of Stocks</Typography>
//                 <Typography variant="h6" fontWeight={600}>₹ 10,069.92</Typography>
//               </Paper>
//             </Grid>

//             <Grid item xs={12}>
//               <Paper sx={{ p: 2 }}>
//                 <Typography variant="body2">
//                   Raw Materials Below Par Level
//                 </Typography>
//                 <Typography variant="h6" fontWeight={600}>1</Typography>
//               </Paper>
//             </Grid>

//             <Grid item xs={12}>
//               <Paper sx={{ p: 2 }}>
//                 <Typography variant="body2">
//                   Raw Materials Below Min. Level
//                 </Typography>
//                 <Typography variant="h6" fontWeight={600}>0</Typography>
//               </Paper>
//             </Grid>
//           </Grid>
//         </Grid>

//         {/* Right Chart */}
//         <Grid item xs={12} md={6}>
//           <Paper sx={{ p: 2, height: "100%" }}>
//             <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//               <Typography fontWeight={600}>Top 10 Raw Materials</Typography>
//               <Select size="small" value="all">
//                 <MenuItem value="all">All Category</MenuItem>
//               </Select>
//             </Box>

//             <ResponsiveContainer width="100%" height={250}>
//               <PieChart>
//                 <Pie
//                   data={pieData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={90}
//                   dataKey="value"
//                 >
//                   {pieData.map((entry, index) => (
//                     <Cell key={index} fill={COLORS[index]} />
//                   ))}
//                 </Pie>
//               </PieChart>
//             </ResponsiveContainer>
//           </Paper>
//         </Grid>

//       </Grid>
//     </Box>
//   );
// };

// export default Dashboard;



import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@mui/material";
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

/* ---------- DATA ---------- */

const cards = [
  {
    title: "Profit",
    value: "₹ 1,25,000",
    icon: "💰",
    bg: "linear-gradient(135deg,#43a047,#2e7d32)"
  },
  {
    title: "Stock ₹",
    value: "₹ 75,000",
    icon: "📦",
    bg: "linear-gradient(135deg,#1e88e5,#1565c0)"
  },
  {
    title: "Low",
    value: "5 Items",
    icon: "⚠️",
    bg: "linear-gradient(135deg,#fb8c00,#ef6c00)"
  },
  {
    title: "Wastage",
    value: "20 Kg",
    icon: "🗑️",
    bg: "linear-gradient(135deg,#e53935,#c62828)"
  }
];

const chartData = [
  { month: "Jan", purchase: 450, consumption: 350 },
  { month: "Feb", purchase: 500, consumption: 420 },
  { month: "Mar", purchase: 420, consumption: 480 },
  { month: "Apr", purchase: 460, consumption: 470 },
  { month: "May", purchase: 480, consumption: 560 },
  { month: "Jun", purchase: 430, consumption: 530 }
];

const pieData = [
  { name: "Rice", value: 30 },
  { name: "Oil", value: 25 },
  { name: "Flour", value: 20 },
  { name: "Sugar", value: 15 }
];

const COLORS = ["#43a047", "#f79b2a", "#f4511e", "#1e88e5"];

const expiryItems = [
  { item: "Cooking Oil", date: "31-May-2024", qty: "12 Bottles" },
  { item: "Wheat Flour", date: "15-Jun-2024", qty: "8 Packs" },
  { item: "Milk", date: "20-Jun-2024", qty: "5 Liters" }
];

const cardStyle = {
  color: "#fff",
  borderRadius: 3,
  boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
};

/* ---------- COMPONENT ---------- */

const Dashboard = () => {
  return (
    <Box p={3} bgcolor="#f2f4f7">
      {/* TOP CARDS */}
      <Grid container spacing={2}>
        {cards.map((c, i) => (
          <Grid item xs={12} md={3} key={i}>
            <Paper sx={{ ...cardStyle, p: 2, background: c.bg }}>
              <Typography fontWeight="bold" sx={{ opacity: 0.9 }}>
                {c.icon} {c.title}
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {c.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* ALERT BAR */}
      <Paper
        sx={{
          mt: 2,
          p: 1.5,
          background: "linear-gradient(90deg,#e53935,#c62828)",
          color: "#fff",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          gap: 3
        }}
      >
        <strong>⚠ Alerts</strong>

        <span>
          <span
            style={{
              width: 10,
              height: 10,
              background: "red",
              borderRadius: "50%",
              display: "inline-block",
              marginRight: 6
            }}
          />
          Rice low
        </span>

        <span>
          <span
            style={{
              width: 10,
              height: 10,
              background: "red",
              borderRadius: "50%",
              display: "inline-block",
              marginRight: 6
            }}
          />
          Oil expiry soon
        </span>
      </Paper>

      {/* MAIN SECTION */}
      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography fontWeight="bold" mb={1}>
              Purchase vs Consumption
            </Typography>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="purchase"
                  fill="#0778a5"
                  radius={[8, 8, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="consumption"
                  stroke="#fb8c00"
                  strokeWidth={3}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* RIGHT SIDE */}
        <Grid item xs={12} md={4}>
          {/* PIE */}
          <Paper sx={{ p: 2, mb: 1, borderRadius: 3 }}>
            <Typography fontWeight="bold">Top Materials</Typography>

            <Grid container>
              <Grid item xs={7}>
                <ResponsiveContainer width="100%" height={200}>
                 <PieChart>
  <Pie
    data={pieData}
    innerRadius={55}
    outerRadius={80}
    dataKey="value"
    nameKey="name"
  >
    {pieData.map((_, i) => (
      <Cell key={i} fill={COLORS[i]} />
    ))}
  </Pie>

  {/* 👇 THIS IS IMPORTANT */}
  <Tooltip
    formatter={(value, name) => [`${value}%`, name]}
  />
</PieChart>

                </ResponsiveContainer>
              </Grid>

              <Grid item xs={5}>
                {pieData.map((p, i) => (
                  <Typography key={i} fontSize={14}>
                    <span style={{ color: COLORS[i] }}>●</span> {p.value}%{" "}
                    {p.name}
                  </Typography>
                ))}
              </Grid>
            </Grid>
          </Paper>

          {/* EXPIRY */}
         <Paper
  sx={{
    p: 2,
    borderRadius: 3,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  }}
>
  <Typography fontWeight="bold" mb={1}>
    ⏳ Expiry Items
  </Typography>

  <Table size="small">
    <TableHead>
      <TableRow sx={{ background: "#e3f2fd" }}>
        <TableCell sx={{ fontWeight: "bold" }}>Item</TableCell>
        <TableCell sx={{ fontWeight: "bold" }}>Expiry</TableCell>
        <TableCell sx={{ fontWeight: "bold" }}>Qty</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {expiryItems.map((e, i) => {
        const isNearExpiry = i === 0; 

        return (
          <TableRow
            key={i}
            hover
            sx={{
              background: isNearExpiry ? "#fff3e0" : "inherit"
            }} >
            <TableCell>
              📦 {e.item}
            </TableCell>

            <TableCell
              sx={{
                color: isNearExpiry ? "#e65100" : "inherit",
                fontWeight: isNearExpiry ? "bold" : "normal"
              }}>
              {e.date}
            </TableCell>

            <TableCell>{e.qty}</TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  </Table>
</Paper>

        </Grid>
      </Grid>

      {/* QUICK ACTIONS */}
      <Paper sx={{ mt: 2, p: 2, borderRadius: 3 }}>
        <Typography fontWeight="bold" mb={2}>
          ⚡ Quick Actions
        </Typography>
    <Grid container spacing={2}>
  <Grid item>
    <Button sx={{ minWidth: 140 }} variant="contained" color="success">
      + Purchase
    </Button>
  </Grid>

  <Grid item>
    <Button sx={{ minWidth: 140 }} variant="contained" color="warning">
      Consume
    </Button>
  </Grid>

  <Grid item>
    <Button sx={{ minWidth: 140 }} variant="contained" color="primary">
      Production
    </Button>
  </Grid>
</Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard;