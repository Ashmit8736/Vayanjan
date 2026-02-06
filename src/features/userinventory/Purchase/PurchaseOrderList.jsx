import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect, useState } from "react";
import AddPurchaseOrder from "./AddPurchaseOrder";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PurchaseOrderList = () => {
  const [openForm, setOpenForm] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPurchaseOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      const res = await axios.get(
        "http://localhost:5000/api/purchaseOrders/get",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch purchase orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {/* ===== HEADER ===== */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography fontSize={18} fontWeight={700}>
          Purchase Order List
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenForm(true)}
            sx={{
              bgcolor: "#C62828",
              textTransform: "none",
              "&:hover": { bgcolor: "#B71C1C" },
            }}
          >
            Create New
          </Button>

          <Button
            variant="outlined"
            startIcon={<FileDownloadOutlinedIcon />}
            sx={{ textTransform: "none" }}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* ===== TABLE ===== */}
      <Paper>
        {loading ? (
          <Box
            sx={{
              height: "40vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : orders.length === 0 ? (
          <Box
            sx={{
              height: "40vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#6B7280",
            }}
          >
            <Typography fontWeight={600}>No Purchase Found</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "#F9FAFB" }}>
                <TableRow>
                  <TableCell>
                    <b>Purchase Order No</b>
                  </TableCell>
                  <TableCell>
                    <b>Purchase Date</b>
                  </TableCell>
                  <TableCell>
                    <b>Supplier Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Company Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Grand Total</b>
                  </TableCell>
                  <TableCell>
                    <b>Payment Status</b>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {orders.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.po_number}</TableCell>

                    <TableCell>
                      {new Date(row.purchase_date).toLocaleDateString()}
                    </TableCell>
                    {/* <TableCell>{row.supplier_name}</TableCell> */}
                    <TableCell
                      sx={{
                        color: "#1E40AF",
                        cursor: "pointer",
                        fontWeight: 600,
                        "&:hover": { textDecoration: "underline" },
                      }}
                      onClick={() =>
                        navigate(`/inventory/reports/purchase-orders/${row.id}`)
                      }
                    >
                      {row.supplier_name}
                    </TableCell>
                    <TableCell>{row.company_name}</TableCell>
                    <TableCell>₹ {row.grand_total}</TableCell>
                    <TableCell
                      sx={{
                        color:
                          row.payment_status === "pending" ? "orange" : "green",
                        fontWeight: 600,
                      }}
                    >
                      {row.payment_status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* ===== ADD PURCHASE ORDER MODAL ===== */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="xl"
        fullWidth
      >
        <DialogContent dividers>
          {/* <AddPurchaseOrder onClose={() => setOpenForm(false)} /> */}
          <AddPurchaseOrder
            onClose={() => {
              setOpenForm(false);
              fetchPurchaseOrders(); // 👈 refresh list
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PurchaseOrderList;