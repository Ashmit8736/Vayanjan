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
import { Add, Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import AddItemCreation from "./AddItemCreation";
import { updateItem } from "@services/api/itemAPI";

const ItemCreation = () => {
  const [items, setItems] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const sortItems = (list) =>
    [...list].sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0) || (b.id || 0) - (a.id || 0));

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

      const listItems = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.data?.items)
        ? result.data.items
        : [];

      setItems(sortItems(listItems));
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
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Item Management
          </Typography>
          <Typography color="text.secondary" variant="body2">
            This page shows the item list for your branch. Use Add Item to create or edit existing items.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          sx={createBtn}
          onClick={() => {
            setSelectedItem(null);
            setOpenForm(true);
          }}
        >
          Add Item
        </Button>
      </Box>

      {/* TABLE */}
      <Paper sx={tableWrap}>
        <Table>
              <TableHead>
            <TableRow sx={thead}>
              <TableCell>S.No</TableCell>
              <TableCell>Item Name</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Short Code</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No items found. Click Add Item to create a new item.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => (
                <TableRow key={item.id || item.item_id || index} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.selling_price || "-"}</TableCell>
                  <TableCell>{item.short_code || "-"}</TableCell>
                  <TableCell>
                    {item.item_unit_name || "-"}
                    {item.item_unit_symbol ? ` (${item.item_unit_symbol})` : ""}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      sx={iconBtn}
                      onClick={() => {
                        setSelectedItem(item);
                        setOpenForm(true);
                      }}
                    >
                      <Edit fontSize="small" />
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
        onClose={() => {
          setOpenForm(false);
          setSelectedItem(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedItem ? "Edit Item" : "Add Item"}</DialogTitle>

        <DialogContent dividers>
          <AddItemCreation
            item={selectedItem}
            onClose={() => {
              setOpenForm(false);
              setSelectedItem(null);
            }}
            onSuccess={(itemData) => {
              if (selectedItem && selectedItem.id) {
                setItems((prev) => sortItems(
                  prev.map((row) =>
                    row.id === itemData.id ? { ...row, ...itemData } : row
                  )
                ));
              } else {
                setItems((prev) => sortItems([...prev, itemData]));
              }
              setOpenForm(false);
              setSelectedItem(null);
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