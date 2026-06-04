import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  IconButton,
  Paper,
} from "@mui/material";

import { Add, Edit, Description, Visibility } from "@mui/icons-material";

import AddRawMaterialDrawer from "./AddRawMaterialDrawer";
import QuickAddRawMaterial from "./QuickAddRawMaterial";
import RawMaterialViewDialog from "./RawMaterialViewDialog";
import RawMaterialLogDialog from "./RawMaterialLogDialog";

const RawMaterials = () => {
  // 🔹 drawer open/close
  const [openForm, setOpenForm] = useState(false);
  const [openQuickAdd, setOpenQuickAdd] = useState(false);

  // 🔹 edit, view, log states
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [logItem, setLogItem] = useState(null);

  // 🔹 filter states
  const [category, setCategory] = useState("All");
  const [searchName, setSearchName] = useState("");

  // 🔹 API data
  const [rawMaterials, setRawMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRawMaterials = () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("❌ Token missing");
      return;
    }

    setLoading(true);
    fetch("http://localhost:5000/api/raw/get", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 401) {
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        setRawMaterials(
          Array.isArray(data)
            ? data
            : Array.isArray(data.data)
              ? data.data
              : [],
        );
      })
      .catch((err) => {
        console.error("API Error:", err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRawMaterials();
  }, []);

  const filteredData = Array.isArray(rawMaterials)
    ? rawMaterials.filter((item) => {
        const matchCategory = category === "All" || item.category === category;

        const matchName = item.name
          ?.toLowerCase()
          .includes(searchName.toLowerCase());

        return matchCategory && matchName;
      })
    : [];

  const uniqueCategories = [
    "All",
    ...new Set(rawMaterials.map((item) => item.category).filter(Boolean)),
  ];

  return (
    <Box sx={{ p: 3, background: "#f9fafb", height: "100%" }}>
      {/* ================= HEADER ================= */}
      <Box sx={{ display: "flex", justifycontent: "space-between", mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          Raw Materials Management
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setEditItem(null);
              setOpenForm(true);
            }}
          >
            Create New
          </Button>

          <Button
            variant="outlined"
            onClick={() => setOpenQuickAdd(true)}
          >
            Quick Add
          </Button>
          <Button variant="outlined">Action</Button>
          <Button variant="outlined">Files</Button>
        </Box>
      </Box>

      {/* ================= FILTER ================= */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Name"
            size="small"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />

          <Select
            size="small"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            {uniqueCategories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat === "All" ? "All Categories" : cat}
              </MenuItem>
            ))}
          </Select>

          <Button variant="outlined">Search</Button>
          <Button
            variant="text"
            onClick={() => {
              setSearchName("");
              setCategory("All");
            }}
          >
            Clear
          </Button>
        </Box>
      </Paper>

      {/* ================= TABLE ================= */}
      <Paper>
        {/* TABLE HEADER */}
        <Box
          sx={{
            p: 2,
            display: "grid",
            gridTemplateColumns: "40px 2fr 2fr 1fr 2fr 1fr 1fr",
            fontWeight: 600,
          }}
        >
          <Checkbox />
          <span>Name</span>
          <span>Category</span>
          <span>Tax %</span>
          <span>Barcode</span>
          <span>Expiry </span>
          <span>Action</span>
        </Box>

        {/* TABLE BODY */}
        {loading && <Typography sx={{ p: 2 }}>Loading...</Typography>}

        {!loading && filteredData.length === 0 && (
          <Typography sx={{ p: 2 }}>No data found</Typography>
        )}

        {!loading &&
          filteredData.map((item) => (
            <Box
              key={item.id}
              sx={{
                p: 2,
                display: "grid",
                gridTemplateColumns: "40px 2fr 2fr 1fr 2fr 1fr 1fr",
                alignItems: "center",
                borderTop: "1px solid #eee",
              }}
            >
              <Checkbox />

              {/* NAME */}
              <Typography>{item.name}</Typography>

              {/* CATEGORY */}
              <Typography>{item.category}</Typography>

              {/* TAX */}
              <Typography>{item.tax_percentage}%</Typography>

              {/* BARCODE */}
              <Typography>{item.barcode}</Typography>

              {/* EXPIRY */}
              <Typography>{item.expiry_days} Days</Typography>

              {/* ACTION */}
              <Box>
                <IconButton onClick={() => setViewItem(item)}>
                  <Visibility />
                </IconButton>
                <IconButton onClick={() => { setEditItem(item); setOpenForm(true); }}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => setLogItem(item)}>
                  <Description />
                </IconButton>
              </Box>
            </Box>
          ))}
      </Paper>

      {/* ================= DRAWER ================= */}
      <AddRawMaterialDrawer
        open={openForm}
        editItem={editItem}
        onClose={() => {
          setOpenForm(false);
          setEditItem(null);
          fetchRawMaterials(); // Refresh list to fetch new items & categories
        }}
      />

      <QuickAddRawMaterial
        open={openQuickAdd}
        onClose={() => setOpenQuickAdd(false)}
        onSuccess={fetchRawMaterials}
      />

      {/* ================= VIEW DIALOG ================= */}
      <RawMaterialViewDialog
        open={Boolean(viewItem)}
        item={viewItem}
        onClose={() => setViewItem(null)}
      />

      {/* ================= LOG DIALOG ================= */}
      <RawMaterialLogDialog
        open={Boolean(logItem)}
        item={logItem}
        onClose={() => setLogItem(null)}
      />
    </Box>
  );
};

export default RawMaterials;
