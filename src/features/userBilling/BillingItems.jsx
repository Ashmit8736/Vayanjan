import React, { useEffect, useMemo, useState, useRef } from "react";
import { getItemsList } from "@services/api/itemAPI";

// ─── Utility ────────────────────────────────────────────────────────────────
const generateInvoiceNumber = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `INV-${date}-${time}-${rand}`;
};

// ─── Print Invoice ───────────────────────────────────────────────────────────
const printInvoice = (cartItems, invoiceNumber) => {
  if (!cartItems.length) return;
  const total = cartItems
    .reduce((s, i) => s + (Number(i.selling_price) || 0) * Number(i.quantity), 0)
    .toFixed(2);
  const rows = cartItems
    .map(
      (i) => `<tr>
        <td>${i.name}</td>
        <td>${i.category || "Uncategorized"}</td>
        <td>₹${i.selling_price || 0}</td>
        <td>${i.quantity}</td>
        <td>₹${((Number(i.selling_price) || 0) * Number(i.quantity)).toFixed(2)}</td>
      </tr>`
    )
    .join("");
  const html = `<!DOCTYPE html><html><head><title>Invoice ${invoiceNumber}</title>
    <style>
      body{font-family:Arial,sans-serif;margin:32px;color:#111}
      h1{font-size:22px;margin-bottom:4px}
      .meta{font-size:13px;color:#555;margin-bottom:20px}
      table{width:100%;border-collapse:collapse;font-size:13px}
      th{background:#f3f4f6;text-align:left;padding:8px 12px;border-bottom:1px solid #ddd}
      td{padding:8px 12px;border-bottom:1px solid #f0f0f0}
      .total{margin-top:16px;text-align:right;font-size:15px;font-weight:700}
    </style></head><body>
    <h1>Invoice</h1>
    <div class="meta"><div><strong>Invoice No:</strong> ${invoiceNumber}</div>
    <div><strong>Date:</strong> ${new Date().toLocaleDateString("en-IN")}</div></div>
    <table><thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Qty</th><th>Subtotal</th></tr></thead>
    <tbody>${rows}</tbody></table>
    <div class="total">Grand Total: ₹${total}</div>
    </body></html>`;
  const w = window.open("", "_blank");
  if (w) { w.document.write(html); w.document.close(); w.focus(); w.print(); }
};

// ─── Inline styles ──────────────────────────────────────────────────────────
const S = {
  root: {
    display: "flex",
    height: "100vh",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    background: "#f1f3f6",
    overflow: "hidden",
  },
  // LEFT: categories
  sidebar: {
    width: 130,
    minWidth: 130,
    background: "#fff",
    borderRight: "1px solid #e5e7eb",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    paddingTop: 8,
  },
  catItem: (active, label) => ({
    padding: "11px 12px",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: active ? 700 : 400,
    color: active ? "#fff" : label === "Favorite" ? "#2563eb" : "#374151",
    background: active ? (label === "Favorite" ? "#2563eb" : "#c0392b") : "transparent",
    borderLeft: active ? `4px solid ${label === "Favorite" ? "#1d4ed8" : "#8b1a10"}` : "4px solid transparent",
    transition: "background 0.15s",
    userSelect: "none",
    lineHeight: 1.35,
  }),
  // CENTER
  center: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 16px",
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
  },
  searchBox: {
    flex: 1,
    padding: "7px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    fontSize: 13,
    outline: "none",
    background: "#f9fafb",
  },
  reloadBtn: {
    padding: "7px 14px",
    background: "#c0392b",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  itemsGrid: {
    flex: 1,
    overflowY: "auto",
    padding: 12,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: 8,
    alignContent: "start",
  },
  itemCard: (inCart) => ({
    background: "#fff",
    border: inCart ? "2px solid #16a34a" : "1px solid #e5e7eb",
    borderRadius: 8,
    padding: "10px 10px 8px",
    cursor: "pointer",
    transition: "box-shadow 0.15s, border 0.15s",
    position: "relative",
  }),
  itemName: {
    fontSize: 13,
    fontWeight: 600,
    color: "#111827",
    lineHeight: 1.3,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 13,
    color: "#c0392b",
    fontWeight: 700,
  },
  itemUnit: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 2,
  },
  inCartBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    background: "#16a34a",
    color: "#fff",
    fontSize: 10,
    fontWeight: 700,
    borderRadius: 10,
    padding: "1px 6px",
  },
  // RIGHT: cart
  cartPanel: {
    width: 360,
    minWidth: 300,
    background: "#fff",
    borderLeft: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
  },
  cartHeader: {
    padding: "12px 16px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#111827",
  },
  clearBtn: {
    fontSize: 12,
    color: "#ef4444",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },
  cartBody: {
    flex: 1,
    overflowY: "auto",
    padding: "0 0 4px",
  },
  cartRow: {
    display: "flex",
    alignItems: "center",
    padding: "8px 12px",
    borderBottom: "1px solid #f3f4f6",
    gap: 8,
  },
  cartRowName: {
    flex: 1,
    fontSize: 13,
    color: "#111827",
    lineHeight: 1.3,
  },
  qtyBox: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  qtyBtn: {
    width: 22,
    height: 22,
    border: "1px solid #d1d5db",
    borderRadius: 4,
    background: "#f9fafb",
    cursor: "pointer",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#374151",
  },
  qtyNum: {
    fontSize: 13,
    fontWeight: 600,
    minWidth: 20,
    textAlign: "center",
  },
  cartRowPrice: {
    fontSize: 13,
    fontWeight: 700,
    color: "#111827",
    minWidth: 60,
    textAlign: "right",
  },
  removeBtn: {
    background: "none",
    border: "none",
    color: "#ef4444",
    cursor: "pointer",
    fontSize: 16,
    padding: "0 2px",
    lineHeight: 1,
  },
  cartFooter: {
    borderTop: "1px solid #e5e7eb",
    padding: "12px 16px",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  totalLabel: { fontSize: 13, color: "#6b7280" },
  totalValue: { fontSize: 20, fontWeight: 800, color: "#111827" },
  invoiceNo: { fontSize: 11, color: "#9ca3af", marginBottom: 10 },
  footerBtns: { display: "flex", gap: 8 },
  saveBtn: {
    flex: 1,
    padding: "9px 0",
    background: "#c0392b",
    color: "#fff",
    border: "none",
    borderRadius: 7,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  printBtn: {
    flex: 1,
    padding: "9px 0",
    background: "#fff",
    color: "#c0392b",
    border: "1.5px solid #c0392b",
    borderRadius: 7,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  emptyCart: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#9ca3af",
    fontSize: 13,
    gap: 8,
  },
  // Modal
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    borderRadius: 12,
    padding: "24px 28px",
    width: 360,
    maxWidth: "90vw",
    boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 16,
  },
  modalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 8,
  },
  modalRowVal: { color: "#111827", fontWeight: 500 },
  modalQtyRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 16,
  },
  modalQtyLabel: { fontSize: 13, color: "#374151", fontWeight: 600 },
  modalQtyCtrl: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#f3f4f6",
    borderRadius: 8,
    padding: "4px 8px",
  },
  modalQtyBtn: {
    width: 28,
    height: 28,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 700,
    color: "#374151",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalQtyNum: { fontSize: 15, fontWeight: 700, minWidth: 28, textAlign: "center" },
  modalTotal: {
    fontSize: 18,
    fontWeight: 800,
    color: "#c0392b",
    marginBottom: 16,
  },
  modalActions: { display: "flex", gap: 10 },
  modalAddBtn: {
    flex: 1,
    padding: "10px 0",
    background: "#c0392b",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  modalCloseBtn: {
    flex: 1,
    padding: "10px 0",
    background: "#fff",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  // Status
  statusBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px 0",
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 6,
    margin: "0 0 10px",
  },
  loader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    fontSize: 14,
    color: "#9ca3af",
  },
};

// ─── Main Component ──────────────────────────────────────────────────────────
const BillingItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [savedMsg, setSavedMsg] = useState(false);

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const searchRef = useRef(null);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category || "Uncategorized"));
    return ["All", "Favorite", ...Array.from(set)];
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    let list;
    if (q) {
      list = items.filter((i) =>
        i.name?.toLowerCase().includes(q) || i.category?.toLowerCase().includes(q)
      );
    } else if (selectedCategory === "All") {
      list = items;
    } else if (selectedCategory === "Favorite") {
      list = items.filter((i) => Boolean(i.favorite));
    } else {
      list = items.filter((i) => (i.category || "Uncategorized") === selectedCategory);
    }
    return list;
  }, [items, selectedCategory, searchTerm]);

  const cartTotal = cartItems.reduce(
    (s, i) => s + (Number(i.selling_price) || 0) * Number(i.quantity), 0
  );

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getItemsList();
      if (res?.success) setItems(Array.isArray(res.data) ? res.data : []);
      else setError(res?.message || "Unable to load items");
    } catch (e) {
      setError(e?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  // Focus search on '/' key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "/" && document.activeElement !== searchRef.current) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const openModal = (item) => {
    setSelectedItem(item);
    const existing = cartItems.find((c) => c.id === item.id);
    setQuantity(existing ? existing.quantity : 1);
    setDialogOpen(true);
  };

  const closeModal = () => { setDialogOpen(false); setSelectedItem(null); };

  const addToCart = () => {
    if (!selectedItem) return;
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === selectedItem.id);
      if (exists) return prev.map((i) =>
        i.id === selectedItem.id ? { ...i, quantity: Number(quantity) } : i
      );
      return [...prev, { ...selectedItem, quantity: Number(quantity) }];
    });
    if (!invoiceNumber) setInvoiceNumber(generateInvoiceNumber());
    closeModal();
  };

  const updateQty = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((i) => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => { setCartItems([]); setInvoiceNumber(""); setSavedMsg(false); };

  const handleSave = () => {
    if (!cartItems.length) return;
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const handlePrint = () => {
    const inv = invoiceNumber || generateInvoiceNumber();
    if (!invoiceNumber) setInvoiceNumber(inv);
    printInvoice(cartItems, inv);
  };

  const itemInCart = (id) => cartItems.find((c) => c.id === id);

  const itemTotal = selectedItem
    ? (Number(selectedItem.selling_price) || 0) * quantity
    : 0;

  return (
    <div style={S.root}>
      {/* ── LEFT: Category Sidebar ── */}
      <div style={S.sidebar}>
        <div style={{ padding: "10px 12px 8px", fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: 1, textTransform: "uppercase" }}>
          Categories
        </div>
        {categories.map((cat) => (
          <div
            key={cat}
            style={S.catItem(selectedCategory === cat, cat)}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </div>
        ))}
      </div>

      {/* ── CENTER: Items Grid ── */}
      <div style={S.center}>
        {/* Top bar */}
        <div style={S.topBar}>
          <input
            ref={searchRef}
            style={S.searchBox}
            placeholder="Search item… (press /)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button style={S.reloadBtn} onClick={fetchItems}>↺ Reload</button>
        </div>

        {/* Items */}
        {loading ? (
          <div style={S.loader}>Loading items…</div>
        ) : error ? (
          <div style={{ ...S.loader, color: "#ef4444", flexDirection: "column", gap: 8 }}>
            <span>{error}</span>
            <button style={S.reloadBtn} onClick={fetchItems}>Retry</button>
          </div>
        ) : (
          <div style={S.itemsGrid}>
            {filteredItems.length === 0 ? (
              <div style={{ gridColumn: "1/-1", color: "#9ca3af", fontSize: 13, padding: 20 }}>
                No items found.
              </div>
            ) : (
              filteredItems.map((item) => {
                const inCart = itemInCart(item.id);
                return (
                  <div
                    key={item.id}
                    style={S.itemCard(!!inCart)}
                    onClick={() => openModal(item)}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.10)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
                  >
                    {inCart && <span style={S.inCartBadge}>×{inCart.quantity}</span>}
                    <div style={S.itemName}>{item.name}</div>
                    <div style={S.itemPrice}>₹{item.selling_price || 0}</div>
                    <div style={S.itemUnit}>
                      {item.item_unit_name || ""}{item.item_unit_symbol ? ` (${item.item_unit_symbol})` : ""}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Small status bar at bottom */}
        {!loading && !error && (
          <div style={{ padding: "6px 12px", borderTop: "1px solid #e5e7eb", background: "#fff", fontSize: 11, color: "#9ca3af" }}>
            Showing {filteredItems.length} of {items.length} items
            {selectedCategory !== "All" ? ` in "${selectedCategory}"` : ""}
            {searchTerm ? ` for "${searchTerm}"` : ""}
          </div>
        )}
      </div>

      {/* ── RIGHT: Cart Panel ── */}
      <div style={S.cartPanel}>
        <div style={S.cartHeader}>
          <span style={S.cartTitle}>
            Invoice Cart {cartItems.length > 0 ? `(${cartItems.length})` : ""}
          </span>
          {cartItems.length > 0 && (
            <button style={S.clearBtn} onClick={clearCart}>Clear All</button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div style={S.emptyCart}>
            <span style={{ fontSize: 32 }}>🛒</span>
            <span>No items added yet</span>
            <span style={{ fontSize: 11, color: "#d1d5db" }}>Click any item to add</span>
          </div>
        ) : (
          <div style={S.cartBody}>
            {cartItems.map((item) => (
              <div key={item.id} style={S.cartRow}>
                <div style={{ flex: 1 }}>
                  <div style={S.cartRowName}>{item.name}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{item.category || "Uncategorized"}</div>
                </div>
                <div style={S.qtyBox}>
                  <button style={S.qtyBtn} onClick={() => updateQty(item.id, -1)}>−</button>
                  <span style={S.qtyNum}>{item.quantity}</span>
                  <button style={S.qtyBtn} onClick={() => updateQty(item.id, 1)}>+</button>
                </div>
                <div style={S.cartRowPrice}>
                  ₹{((Number(item.selling_price) || 0) * item.quantity).toFixed(2)}
                </div>
                <button style={S.removeBtn} onClick={() => removeItem(item.id)} title="Remove">×</button>
              </div>
            ))}
          </div>
        )}

        {cartItems.length > 0 && (
          <div style={S.cartFooter}>
            {invoiceNumber && (
              <div style={S.invoiceNo}>📄 {invoiceNumber}</div>
            )}
            <div style={S.totalRow}>
              <span style={S.totalLabel}>Grand Total</span>
              <span style={S.totalValue}>₹{cartTotal.toFixed(2)}</span>
            </div>
            {savedMsg && (
              <div style={{ ...S.statusBar, background: "#dcfce7", color: "#16a34a" }}>
                ✓ Invoice saved! You can now print.
              </div>
            )}
            <div style={S.footerBtns}>
              <button style={S.saveBtn} onClick={handleSave}>Save Invoice</button>
              <button style={S.printBtn} onClick={handlePrint}>Print / Download</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Item Detail Modal ── */}
      {dialogOpen && selectedItem && (
        <div style={S.overlay} onClick={closeModal}>
          <div style={S.modal} onClick={(e) => e.stopPropagation()}>
            <div style={S.modalTitle}>{selectedItem.name}</div>

            <div style={S.modalRow}>
              <span>Category</span>
              <span style={S.modalRowVal}>{selectedItem.category || "Uncategorized"}</span>
            </div>
            <div style={S.modalRow}>
              <span>Unit Price</span>
              <span style={{ ...S.modalRowVal, color: "#c0392b" }}>₹{selectedItem.selling_price || 0}</span>
            </div>
            {(selectedItem.item_unit_name || selectedItem.item_unit_symbol) && (
              <div style={S.modalRow}>
                <span>Unit</span>
                <span style={S.modalRowVal}>
                  {selectedItem.item_unit_name || ""}{selectedItem.item_unit_symbol ? ` (${selectedItem.item_unit_symbol})` : ""}
                </span>
              </div>
            )}
            {selectedItem.item_quantity && (
              <div style={S.modalRow}>
                <span>Recipe Qty</span>
                <span style={S.modalRowVal}>{selectedItem.item_quantity}</span>
              </div>
            )}

            <div style={S.modalQtyRow}>
              <span style={S.modalQtyLabel}>Quantity</span>
              <div style={S.modalQtyCtrl}>
                <button style={S.modalQtyBtn} onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                <span style={S.modalQtyNum}>{quantity}</span>
                <button style={S.modalQtyBtn} onClick={() => setQuantity((q) => q + 1)}>+</button>
              </div>
            </div>

            <div style={S.modalTotal}>Total: ₹{itemTotal.toFixed(2)}</div>

            <div style={S.modalActions}>
              <button style={S.modalAddBtn} onClick={addToCart}>
                {cartItems.find((c) => c.id === selectedItem.id) ? "Update in Cart" : "Add to Invoice"}
              </button>
              <button style={S.modalCloseBtn} onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingItems;