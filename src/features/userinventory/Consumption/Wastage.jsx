import { useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Grid,
  Card,
  CardContent,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

const wastageDataMock = [
  {
    id: 1,                                                  
    date: "04-02-2026",
    category: "Dry Fruit",
    material: "Badam",
    qty: 0.5,
    unit: "Kg",
    price: 650,
    reason: "Expired",
    type: "WASTAGE",
  },
  {
    id: 2,
    date: "04-02-2026",
    category: "Grocery",
    material: "Besan",
    qty: 1,
    unit: "Kg",
    price: 60,
    reason: "Damaged",
    type: "WASTAGE",
  },
];

const Wastage = () => {
  const [rows, setRows] = useState(wastageDataMock);

  // 🔹 SUMMARY (sirf WASTAGE)
  const summary = useMemo(() => {
    let todayValue = 0;
    let totalQty = 0;
    let map = {};

    rows.forEach((r) => {
      const value = r.qty * r.price;
      totalQty += r.qty;

      if (r.date === "04-02-2026") {
        todayValue += value;
      }

      map[r.material] = (map[r.material] || 0) + value;
    });

    const highest =
      Object.entries(map).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    return { todayValue, totalQty, highest };
  }, [rows]);

  // 🔹DELETE (permission based later)
  const handleDelete = (id) => {
    if (!window.confirm("Delete this wastage entry?")) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} mb={2}>
         Wastage
      </Typography>

      {/*  SUMMARY CARDS */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="error">Today’s Wastage (₹)</Typography>
              <Typography variant="h6">
                ₹ {summary.todayValue.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography>Total Wastage Qty</Typography>
              <Typography variant="h6">
                {summary.totalQty} Kg
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography>Highest Wastage Item</Typography>
              <Typography variant="h6">{summary.highest}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/*  TABLE */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Raw Material</TableCell>
              <TableCell>Wastage Qty</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Value (₹)</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.material}</TableCell>
                <TableCell sx={{ color: "red", fontWeight: 600 }}>
                  {row.qty}
                </TableCell>
                <TableCell>{row.unit}</TableCell>
                <TableCell>{row.reason}</TableCell>
                <TableCell>
                  {(row.qty * row.price).toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View">
                    <IconButton color="primary">
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(row.id)}
                    >
                      <DeleteIcon />
                    </IconButton>                                                   
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {rows.length === 0 && (
              <TableRow>               
                <TableCell colSpan={8} align="center">
                  No wastage records
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default Wastage;