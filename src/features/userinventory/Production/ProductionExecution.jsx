import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Stack,
  Checkbox
} from "@mui/material";
import { useNavigate } from "react-router-dom";

/* ================= AXIOS ================= */
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

/* ================= JWT DECODE (NO LIB) ================= */
const decodeJWT = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

const ProductionExecution = () => {
  const [items, setItems] = useState([]);
  const [checked, setChecked] = useState({});
  const [qty, setQty] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* 🔥 FIX: branch_id & user_id FROM TOKEN */
  const token = localStorage.getItem("authToken");
  const decoded = token ? decodeJWT(token) : null;

  const branch_id = decoded?.branch_id ?? null;
  const created_by = decoded?.id ?? null;

  console.log("🧪 ProductionExecution → branch_id:", branch_id, "user_id:", created_by);

  /* ================= LOAD ITEMS ================= */
  useEffect(() => {
    if (!branch_id) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    api
      .get("/item/list", { params: { branch_id } })
      .then((res) => {
        if (Array.isArray(res.data.data)) {
          setItems(res.data.data);
        } else {
          setItems([]);
        }
      })
      .catch(() => setItems([]));
  }, [branch_id, navigate]);

  /* ================= HANDLE PRODUCTION ================= */
  const handleConvertToProduction = async () => {
    if (!branch_id || !created_by) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    const selectedItems = items.filter(
      (i) => checked[i.id] && Number(qty[i.id]) > 0
    );

    if (selectedItems.length === 0) {
      alert("Select item and valid quantity");
      return;
    }

    setLoading(true);

    try {
      for (const item of selectedItems) {
        const produceQty = Number(qty[item.id]);

        if (!item.recipe_id || !item.item_unit_id) {
          throw new Error(`Recipe not configured for ${item.name}`);
        }

        if (!produceQty || produceQty <= 0 || Number.isNaN(produceQty)) {
          throw new Error(`Invalid quantity for ${item.name}`);
        }

        const payload = {
          branch_id,
          item_id: item.id,
          recipe_id: item.recipe_id,
          produce_quantity: produceQty,
          produce_unit_id: item.item_unit_id,
          created_by
        };

        console.log("✅ PRODUCTION PAYLOAD:", payload);

        await api.post("/production/create", payload);
      }

      alert("Production completed successfully");
      navigate("/inventory/production");

    } catch (error) {
      console.error("PRODUCTION ERROR:", error);
      alert(
        error?.response?.data?.error ||
        error.message ||
        "Production failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={2}>
      <Typography fontSize={20} fontWeight={700} mb={2}>
        Production Execution
      </Typography>

      <Paper>
        <Box p={2}>
          <Typography fontWeight={600} mb={1}>
            Select Items
          </Typography>

          <Divider />

          {items.length === 0 && (
            <Typography align="center" color="text.secondary" mt={2}>
              No items found
            </Typography>
          )}

          {items.map((item) => (
            <Box
              key={item.id}
              display="flex"
              alignItems="center"
              py={1}
            >
              <Checkbox
                checked={!!checked[item.id]}
                onChange={(e) =>
                  setChecked((prev) => ({
                    ...prev,
                    [item.id]: e.target.checked
                  }))
                }
              />

              <Typography flex={1}>{item.name}</Typography>

              <TextField
                size="small"
                type="number"
                placeholder={`Qty (${item.item_unit_symbol || "-"})`}
                value={qty[item.id] ?? ""}
                onChange={(e) =>
                  setQty((prev) => ({
                    ...prev,
                    [item.id]: Number(e.target.value)
                  }))
                }
                sx={{ width: 140 }}
              />
            </Box>
          ))}
        </Box>

        <Divider />

        <Stack direction="row" justifyContent="flex-end" p={2}>
          <Button
            variant="contained"
            color="error"
            disabled={loading}
            onClick={handleConvertToProduction}
          >
            {loading ? "Processing..." : "Convert To Production"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ProductionExecution;