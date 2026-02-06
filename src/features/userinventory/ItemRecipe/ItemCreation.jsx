import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { Add, Edit, Close, ContentPaste } from "@mui/icons-material";
import { useEffect, useState } from "react";
import AddItemCreation from "./AddItemCreation";

const ItemCreation = () => {
  const [items, setItems] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= GET ITEM LIST ================= */
  const fetchItems = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("Token missing. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/item/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      console.log("GET ITEM LIST RESPONSE:", result);

      if (!res.ok) {
        alert(result.message || "Failed to load items");
        return;
      }

      setItems(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Fetch items error:", error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ON LOAD ================= */
  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <Box sx={page}>
      {/* HEADER */}
      <Box sx={header}>
        <Typography variant="h6" fontWeight={700}>
          Recipe Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          sx={createBtn}
          onClick={() => setOpenForm(true)}
        >
          Create New
        </Button>
      </Box>

      {/* TABLE */}
      <Paper sx={tableWrap}>
        <Table>
          <TableHead>
            <TableRow sx={thead}>
              <TableCell>S.No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Selling Price</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => (
                <TableRow key={item.id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.selling_price}</TableCell>
                  <TableCell align="center">
                    <IconButton sx={iconBtn}>
                      <ContentPaste fontSize="small" />
                    </IconButton>
                    <IconButton sx={iconBtn}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton sx={deleteBtn}>
                      <Close fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* ===== ADD ITEM POPUP ===== */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Item Recipe</DialogTitle>

        <DialogContent dividers>
          <AddItemCreation
            onSuccess={() => {
              setOpenForm(false);
              fetchItems(); // 🔥 LIST REFRESH AFTER ADD
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

/* ================= STYLES ================= */

const page = {
  p: 3,
  bgcolor: "#F8FAFC",
  minHeight: "100vh",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 2,
};

const createBtn = {
  bgcolor: "#C62828",
  textTransform: "none",
  fontWeight: 600,
  "&:hover": { bgcolor: "#B71C1C" },
};

const tableWrap = {
  borderRadius: 2,
  overflow: "hidden",
};

const thead = {
  bgcolor: "#EFF6FF",
  "& th": { fontWeight: 700 },
};

const iconBtn = {
  bgcolor: "#F1F5F9",
  mx: 0.5,
  "&:hover": { bgcolor: "#E2E8F0" },
};

const deleteBtn = {
  bgcolor: "#FEE2E2",
  mx: 0.5,
  "&:hover": { bgcolor: "#FCA5A5" },
};

export default ItemCreation;