import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box
} from "@mui/material";
import { Close } from "@mui/icons-material";

const RawMaterialLogDialog = ({ open, onClose, item }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && item) {
      fetchLogs();
    }
  }, [open, item]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`http://localhost:5000/api/raw/logs/${item.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success) {
        setLogs(json.data || []);
      } else {
        console.error("Failed to fetch logs:", json.message);
      }
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  const getQtyColor = (qty) => {
    if (qty === null || qty === undefined) return "text.primary";
    return qty > 0 ? "success.main" : "error.main";
  };

  const getQtyText = (qty) => {
    if (qty === null || qty === undefined) return "-";
    return qty > 0 ? `+${qty}` : qty;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 700,
          borderBottom: "1px solid #e0e0e0"
        }}
      >
        Stock Logs: {item?.name}
        <IconButton onClick={onClose} size="small" aria-label="close">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, minHeight: "200px" }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={5}>
            <CircularProgress />
          </Box>
        ) : logs.length === 0 ? (
          <Box py={5} textAlign="center">
            <Typography color="text.secondary">No activity logs found for this item.</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Qty Change</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Unit</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{formatDate(log.date)}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          display: "inline-block",
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontWeight: 500,
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                          bgcolor:
                            log.type === "Creation"
                              ? "#e3f2fd"
                              : log.type === "Purchase"
                              ? "#e8f5e9"
                              : "#ffebee",
                          color:
                            log.type === "Creation"
                              ? "#1e88e5"
                              : log.type === "Purchase"
                              ? "#43a047"
                              : "#e53935"
                        }}
                      >
                        {log.type}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: getQtyColor(log.quantity), fontWeight: 600 }}>
                      {getQtyText(log.quantity)}
                    </TableCell>
                    <TableCell>{log.unit_symbol || "-"}</TableCell>
                    <TableCell>{log.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RawMaterialLogDialog;
