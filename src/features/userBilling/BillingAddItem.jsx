import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { createItem, getItemsList, updateItem } from "@services/api/itemAPI";
import { useNavigate } from "react-router-dom";

// ─── Inline Styles ────────────────────────────────────────────────────────────
const S = {
  root: {
    display: "flex",
    gap: 20,
    padding: 24,
    background: "#F8FAFC",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    boxSizing: "border-box",
  },
  // LEFT: Add Item Form
  formCard: {
    width: 360,
    minWidth: 320,
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    padding: 24,
    alignSelf: "flex-start",
    position: "sticky",
    top: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: "#111827",
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: "#6b7280",
    marginBottom: 5,
    display: "block",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 7,
    fontSize: 14,
    color: "#111827",
    outline: "none",
    background: "#f9fafb",
    boxSizing: "border-box",
    marginBottom: 14,
    transition: "border 0.15s",
  },
  saveBtn: {
    width: "100%",
    padding: "10px 0",
    background: "#c0392b",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 4,
  },
  saveBtnDisabled: {
    background: "#fca5a5",
    cursor: "not-allowed",
  },
  cancelBtn: {
    width: "100%",
    padding: "10px 0",
    background: "#fff",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 8,
  },
  errorMsg: {
    fontSize: 12,
    color: "#ef4444",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 6,
    padding: "8px 12px",
    marginBottom: 12,
  },
  successMsg: {
    fontSize: 12,
    color: "#16a34a",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: 6,
    padding: "8px 12px",
    marginBottom: 12,
  },
  // Autocomplete dropdown (pure JS, no MUI dep here)
  autocompleteWrap: { position: "relative", marginBottom: 14 },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 7,
    boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
    zIndex: 100,
    maxHeight: 180,
    overflowY: "auto",
  },
  dropdownItem: (hover) => ({
    padding: "8px 12px",
    fontSize: 13,
    color: "#374151",
    cursor: "pointer",
    background: hover ? "#f3f4f6" : "#fff",
  }),

  // RIGHT: Items List
  listSection: {
    flex: 1,
    minWidth: 0,
  },
  listHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: "#111827",
  },
  searchBox: {
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 7,
    fontSize: 13,
    outline: "none",
    background: "#fff",
    width: 220,
  },
  catChips: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 14,
  },
  chip: (active) => ({
    padding: "5px 12px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: active ? 700 : 500,
    color: active ? "#fff" : "#374151",
    background: active ? "#c0392b" : "#fff",
    border: active ? "1px solid #c0392b" : "1px solid #e5e7eb",
    cursor: "pointer",
    userSelect: "none",
  }),
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #e5e7eb",
  },
  th: {
    padding: "10px 14px",
    fontSize: 11,
    fontWeight: 700,
    color: "#6b7280",
    textAlign: "left",
    background: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  td: {
    padding: "10px 14px",
    fontSize: 13,
    color: "#111827",
    borderBottom: "1px solid #f3f4f6",
    verticalAlign: "middle",
  },
  addBtn: {
    padding: "5px 14px",
    background: "#fff",
    color: "#c0392b",
    border: "1.5px solid #c0392b",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    transition: "background 0.12s, color 0.12s",
  },
  emptyRow: {
    padding: "32px 0",
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 13,
  },
  loaderRow: {
    padding: "32px 0",
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 13,
  },
  priceBadge: {
    fontSize: 13,
    fontWeight: 700,
    color: "#c0392b",
  },
  catTag: {
    display: "inline-block",
    padding: "2px 8px",
    background: "#f3f4f6",
    borderRadius: 12,
    fontSize: 11,
    color: "#6b7280",
  },
};

// ─── Simple Autocomplete ──────────────────────────────────────────────────────
const CategoryAutocomplete = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(-1);
  const filtered = options.filter((o) =>
    o.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div style={S.autocompleteWrap}>
      <label style={S.label}>Category</label>
      <input
        style={S.input}
        value={value}
        placeholder="Type or select category…"
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {open && filtered.length > 0 && (
        <div style={S.dropdown}>
          {filtered.map((opt, i) => (
            <div
              key={opt}
              style={S.dropdownItem(hovered === i)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(-1)}
              onMouseDown={() => { onChange(opt); setOpen(false); }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const BillingAddItem = () => {
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Items list state
  const [items, setItems] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");

  const sortItems = (list) =>
    [...list].sort((a, b) =>
      (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0) ||
      (b.id || 0) - (a.id || 0)
    );

  useEffect(() => {
    setFavoriteIds(new Set(items.filter((item) => item.favorite).map((item) => item.id)));
  }, [items]);

  // ── Load items ──
  const loadItems = async () => {
    setListLoading(true);
    setListError("");
    try {
      const res = await getItemsList();
      if (res?.success) {
        setItems(sortItems(Array.isArray(res.data) ? res.data : []));
      } else {
        setListError(res?.message || "Unable to load items");
      }
    } catch (e) {
      setListError(e?.message || "Server error");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => { loadItems(); }, []);

  // ── Derived ──
  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category || "Uncategorized"));
    return ["All", ...Array.from(set)];
  }, [items]);

  const filteredItems = useMemo(() => {
    let list = selectedCat === "All"
      ? items
      : items.filter((i) => (i.category || "Uncategorized") === selectedCat);
    const q = searchTerm.trim().toLowerCase();
    if (q) list = list.filter((i) =>
      i.name?.toLowerCase().includes(q) ||
      i.category?.toLowerCase().includes(q)
    );
    return list;
  }, [items, selectedCat, searchTerm]);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(items.map((i) => i.category).filter(Boolean)));
  }, [items]);

  // ── Handlers ──
  const resetForm = () => {
    setName("");
    setCategory("");
    setSellingPrice("");
    setShortCode("");
    setFormError("");
    setFormSuccess("");
    setEditingItem(null);
  };

  const openAddDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (item) => {
    setEditingItem(item);
    setName(item.name || "");
    setCategory(item.category || "");
    setSellingPrice(item.selling_price || "");
    setShortCode(item.short_code || "");
    setFormError("");
    setFormSuccess("");
    setDialogOpen(true);
  };

  const handleFavoriteToggle = async (item) => {
    const payload = {
      name: item.name,
      category: item.category || null,
      selling_price: item.selling_price || 0,
      short_code: item.short_code || null,
      stock_status: item.stock_status || "Do Not Track",
      item_unit_id: item.item_unit_id || null,
      favorite: item.favorite ? 0 : 1,
    };

    try {
      const res = await updateItem(item.id, payload);
      if (res?.success) {
        setItems((prev) =>
          sortItems(
            prev.map((row) =>
              row.id === item.id ? { ...row, ...payload } : row
            )
          )
        );
      }
    } catch (err) {
      console.error("Failed to update favorite", err);
    }
  };

  const handleFormClose = () => {
    setDialogOpen(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("Item name is required.");
      return;
    }
    setFormLoading(true);
    setFormError("");
    setFormSuccess("");

    const payload = {
      name: name.trim(),
      category: category.trim(),
      selling_price: Number(sellingPrice) || 0,
      short_code: shortCode.trim(),
      stock_status: editingItem?.stock_status || "Do Not Track",
      item_unit_id: editingItem?.item_unit_id || null,
      favorite: editingItem?.favorite ? 1 : 0,
    };

    try {
      if (editingItem) {
        const res = await updateItem(editingItem.id, payload);
        if (res?.success) {
          setItems((prev) =>
            prev.map((item) =>
              item.id === editingItem.id ? { ...item, ...payload } : item
            )
          );
          setFormSuccess(`"${name}" updated successfully!`);
          loadItems();
        } else {
          setFormError(res?.message || "Failed to update item");
          return;
        }
      } else {
        const res = await createItem(payload);
        if (res?.success) {
          setFormSuccess(`"${name}" added successfully!`);
          loadItems();
        } else {
          setFormError(res?.message || "Failed to create item");
          return;
        }
      }

      resetForm();
      setDialogOpen(false);
    } catch (err) {
      setFormError(err?.message || "Server error");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div style={S.root}>
      {/* ── LEFT: Add Item Action ── */}
      <div style={S.formCard}>
        <div style={S.formTitle}>➕ Add Menu Item</div>

        <button
          type="button"
          style={S.saveBtn}
          onClick={openAddDialog}
        >
          Add Item
        </button>

        {formError && <div style={S.errorMsg}>⚠ {formError}</div>}
        {formSuccess && <div style={S.successMsg}>✓ {formSuccess}</div>}
      </div>

      <Dialog open={dialogOpen} onClose={handleFormClose} maxWidth="xs" fullWidth>
        <DialogTitle>{editingItem ? "Edit Item" : "Add Item"}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <label style={S.label}>Item Name *</label>
            <input
              style={S.input}
              placeholder="e.g. Gulab Jamun"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <CategoryAutocomplete
              value={category}
              onChange={setCategory}
              options={uniqueCategories}
            />

            <label style={S.label}>Short Code</label>
            <input
              style={S.input}
              placeholder="e.g. GJ01"
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
            />

            <label style={S.label}>Selling Price (₹)</label>
            <input
              style={S.input}
              type="number"
              placeholder="0"
              min="0"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
            />
            {formError && <div style={S.errorMsg}>⚠ {formError}</div>}
            {formSuccess && <div style={S.successMsg}>✓ {formSuccess}</div>}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleFormClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={formLoading}
          >
            {editingItem ? "Update Item" : "Save Item"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── RIGHT: Items List ── */}
      <div style={S.listSection}>
        <div style={S.listHeader}>
          <div style={S.listTitle}>
            Existing Items
            <span style={{ fontSize: 13, fontWeight: 400, color: "#9ca3af", marginLeft: 8 }}>
              ({filteredItems.length})
            </span>
          </div>
          <input
            style={S.searchBox}
            placeholder="Search items…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category filter chips */}
        <div style={S.catChips}>
          {categories.map((cat) => (
            <span
              key={cat}
              style={S.chip(selectedCat === cat)}
              onClick={() => setSelectedCat(cat)}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Table */}
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>#</th>
              <th style={S.th}>Name</th>
              <th style={S.th}>Category</th>
              <th style={S.th}>Short Code</th>
              <th style={S.th}>Stock Status</th>
              <th style={S.th}>Favorite</th>
              <th style={S.th}>Price</th>
              <th style={S.th}>Unit</th>
              <th style={S.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {listLoading ? (
              <tr><td colSpan={9} style={S.loaderRow}>Loading items…</td></tr>
            ) : listError ? (
              <tr>
                <td colSpan={9} style={{ ...S.emptyRow, color: "#ef4444" }}>
                  {listError}
                  <span
                    style={{ marginLeft: 8, color: "#c0392b", cursor: "pointer", textDecoration: "underline" }}
                    onClick={loadItems}
                  >
                    Retry
                  </span>
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr><td colSpan={9} style={S.emptyRow}>No items found.</td></tr>
            ) : (
              filteredItems.map((item, idx) => (
                <tr
                  key={item.id}
                  style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}
                >
                  <td style={{ ...S.td, color: "#9ca3af", width: 36 }}>{idx + 1}</td>
                  <td style={{ ...S.td, fontWeight: 600 }}>
                    {favoriteIds.has(item.id) ? "★ " : ""}
                    {item.name}
                  </td>
                  <td style={S.td}>
                    <span style={S.catTag}>{item.category || "Uncategorized"}</span>
                  </td>
                  <td style={S.td}>{item.short_code || "-"}</td>
                  <td style={S.td}>{item.stock_status || "Do Not Track"}</td>
                  <td style={S.td}>
                    <input
                      type="checkbox"
                      checked={favoriteIds.has(item.id)}
                      onChange={() => handleFavoriteToggle(item)}
                    />
                  </td>
                  <td style={S.td}>
                    <span style={S.priceBadge}>₹{item.selling_price || 0}</span>
                  </td>
                  <td style={{ ...S.td, color: "#6b7280" }}>
                    {item.item_unit_name || "-"}
                    {item.item_unit_symbol ? ` (${item.item_unit_symbol})` : ""}
                  </td>
                  <td style={S.td}>
                    <button
                      style={S.addBtn}
                      onClick={() => openEditDialog(item)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillingAddItem;