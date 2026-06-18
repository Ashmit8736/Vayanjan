import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  IconButton,
  Dialog,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect, useState } from "react";
import AddSupplier from "./AddSupplier";
import axios from "axios";

const ThirdPartyManagement = () => {
  const [openForm, setOpenForm] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

const fetchSuppliers = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("authToken"); // 👈 IMPORTANT

    const res = await axios.get(
      "http://localhost:5000/api/suppliers/get",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.success) {
      setSuppliers(res.data.data);
    }
  } catch (error) {
    console.error("Failed to fetch suppliers", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
    fetchSuppliers();
  }, []);

  const safeSuppliers = Array.isArray(suppliers) ? suppliers : [];
  const totalPages = Math.ceil(safeSuppliers.length / itemsPerPage);
  const paginatedSuppliers = safeSuppliers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

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
          Supplier / Third Party Management 
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditSupplier(null);
            setOpenForm(true);
          }}
          sx={{
            bgcolor: "#C62828",
            textTransform: "none",
            "&:hover": { bgcolor: "#B71C1C" },
          }}
        >
          Add Supplier
        </Button>
      </Box>

      {/* ===== FILTERS (UI only for now) ===== */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField size="small" label="Name" />
          <TextField size="small" label="Company" />
          <Button variant="outlined">Search</Button>
          <Button variant="text">Clear</Button>
        </Box>
      </Paper>

      {/* ===== TABLE ===== */}
      <Paper>
        {loading ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: "#F1F5F9" }}>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Company Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Billing Address</TableCell>
                <TableCell>Shipping Address</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedSuppliers.map((row) => (
                <TableRow key={row.id}>

                  <TableCell>{row.name}</TableCell>

                  <TableCell>
                    {row.tcs_type === "purchase" ? "Purchase" : "Both"}
                  </TableCell>

                  <TableCell>{row.email || "-"}</TableCell>

                  <TableCell>{row.company_name}</TableCell>

                  <TableCell>{row.phone}</TableCell>

                  <TableCell>
                    {row.billing_address}, {row.billing_city},{" "}
                    {row.billing_state} - {row.billing_pincode}
                  </TableCell>

                  <TableCell>
                    {row.shipping_address}, {row.shipping_city},{" "}
                    {row.shipping_state} - {row.shipping_pincode}
                  </TableCell>

                  <TableCell>
                    {row.is_active === 1 ? "Active" : "Inactive"}
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditSupplier(row);
                        setOpenForm(true);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {suppliers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No suppliers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        {/* ================= PAGINATION ================= */}
        {totalPages > 0 && (
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} px={2} pb={2}>
            <Typography variant="body2" color="text.secondary">
              Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, safeSuppliers.length)} of {safeSuppliers.length} records
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Button
                size="small"
                variant="outlined"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                sx={{ textTransform: "none", minWidth: "60px", color: "#64748B", borderColor: "#CBD5E1" }}
              >
                Prev
              </Button>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: "#1976d2",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                {page}
              </Box>
              <Button
                size="small"
                variant="outlined"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                sx={{ textTransform: "none", minWidth: "60px", color: "#64748B", borderColor: "#CBD5E1" }}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      {/* ===== ADD SUPPLIER MODAL ===== */}
      <Dialog
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditSupplier(null);
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent dividers>
          <AddSupplier
            editSupplier={editSupplier}
            onClose={() => {
              setOpenForm(false);
              setEditSupplier(null);
              fetchSuppliers(); // refresh list after add/edit
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ThirdPartyManagement;














