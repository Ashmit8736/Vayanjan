import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useEffect, useState } from "react";
import AddRecipeCreation from "./AddRecipeCreation";

const RecipeCreation = () => {
  const [items, setItems] = useState([]);
  const [openForm, setOpenForm] = useState(false);

  const [openView, setOpenView] = useState(false);
  const [materials, setMaterials] = useState([]);

  const token = localStorage.getItem("authToken");

  /* ================= GET ITEMS (SOURCE OF RECIPES) ================= */
  const fetchItems = async () => {
    if (!token) {
      alert("Token missing. Please login again.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/item/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Failed to load items");
        return;
      }

      setItems(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Fetch items error:", error);
      alert("Server error");
    }
  };

  /* ================= GET RECIPE BY ITEM ================= */
  // const fetchRecipeItems = async (itemId) => {
  //   try {
  //     const res = await fetch(
  //       `http://localhost:5000/api/recipe/item/${itemId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     const result = await res.json();
  //     setMaterials(Array.isArray(result.data) ? result.data : []);
  //     setOpenView(true);
  //   } catch (error) {
  //     console.error("Fetch recipe items error:", error);
  //   }
  // };

  const fetchRecipeItems = async (itemId) => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/recipe/item/${itemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await res.json();
    console.log("RECIPE ITEM RESPONSE:", result);

    setMaterials(Array.isArray(result.data) ? result.data : []);
    setOpenView(true);
  } catch (error) {
    console.error("Fetch recipe items error:", error);
  }
};

  useEffect(() => {
    fetchItems(); // 👈 ITEM LIST LOAD
  }, []);

  return (
    <Box p={3}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight={700}>
          Recipe Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenForm(true)}
        >
          Create New Recipe
        </Button>
      </Box>

      {/* ITEM TABLE */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Item Name</TableCell>
              <TableCell>Selling Price</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No items found
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, i) => (
                <TableRow key={item.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.selling_price}</TableCell>
                  <TableCell align="center">
                    {/* <Button
                      size="small"
                      variant="outlined"
                      // onClick={() => fetchRecipeItems(item.id)}
                      onClick={() => fetchRecipeItems(item.item_id || item.id)}
                    >
                      View Recipe
                    </Button> */}
                    <Button
  size="small"
  variant="outlined"
  onClick={() => fetchRecipeItems(item.item_id || item.id)}
>
  View Recipe
</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* ===== CREATE RECIPE ===== */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create Recipe</DialogTitle>
        <DialogContent dividers>
          <AddRecipeCreation
            onSuccess={() => {
              setOpenForm(false);
              fetchItems(); // refresh
            }}
          />
        </DialogContent>
      </Dialog>

      {/* ===== VIEW RECIPE MATERIALS ===== */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Recipe Raw Materials</DialogTitle>
        <DialogContent dividers>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Raw Material</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No recipe found for this item
                  </TableCell>
                </TableRow>
              ) : (
                materials.map((m, i) => (
                  <TableRow key={i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{m.raw_material_name}</TableCell>
                    <TableCell>
                      {m.quantity} {m.consume_unit_symbol}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default RecipeCreation;