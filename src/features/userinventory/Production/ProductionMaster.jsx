import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";

/* 🔹 AXIOS INSTANCE */
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const ProductionMaster = () => {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const branch_id = 1;

  useEffect(() => {
    api
      .get(`/production/list?branch_id=${branch_id}`)
      .then((res) => setRows(res.data))
      .catch((err) => console.error(err));
  }, []);

  const showUTCTime = (date) => {
    const d = new Date(date);

    return d.toLocaleString("en-GB", {
      timeZone: "UTC",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  return (
    <Box p={2}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography fontSize={20} fontWeight={700}>
          Production List
        </Typography>

        <Button
          variant="contained"
          color="error"
          onClick={() => navigate("/production/execute")}
        >
          New Production
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.item_name}</TableCell>
                <TableCell>
                  {r.produce_quantity} {r.unit_symbol}
                </TableCell>
                <TableCell>{r.status}</TableCell>
                {/* <TableCell>
                  {new Date(r.produced_at).toLocaleString()}
                </TableCell> */}
                <TableCell>
                  {showUTCTime(r.produced_at)}
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductionMaster;