import React, { useEffect, useMemo, useState, useRef } from "react";
import { getItemsList } from "@services/api/itemAPI";
import { getTablesList } from "@services/api/diningAPI";
import axiosInstance from "@services/api/axios-config";
import { printInvoiceWithIframe } from "./printHelper";
import { useSearchParams } from "react-router-dom";

// Icon imports from MUI
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import TableRestaurantOutlinedIcon from "@mui/icons-material/TableRestaurantOutlined";
import PersonIcon from "@mui/icons-material/Person";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import GroupIcon from "@mui/icons-material/Group";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import EditNoteIcon from "@mui/icons-material/EditNote";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import HistoryIcon from "@mui/icons-material/History";
import ReceiptIcon from "@mui/icons-material/Receipt";
import StarIcon from "@mui/icons-material/Star";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import TapAndPlayIcon from "@mui/icons-material/TapAndPlay";

// ─── Utility ────────────────────────────────────────────────────────────────
const generateInvoiceNumber = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `INV-${date}-${time}-${rand}`;
};

const generateTokenNumber = () => {
  return `TKN-${Math.floor(1000 + Math.random() * 9000)}`;
};

const getStockLabel = (stock_status) => {
  if (!stock_status) return "Stock";
  const text = String(stock_status).trim().toLowerCase();
  if (text.includes("out")) return "Out of Stock";
  if (text.includes("in")) return "Stock";
  if (text.includes("track")) return "Stock";
  return stock_status;
};

const isOutOfStock = (item) => 
  getStockLabel(item?.stock_status) === "Out of Stock" || 
  (item?.remaining_qty !== undefined && Number(item.remaining_qty) <= 0 && item?.stock_status !== "Do Not Track");

const getUnitDisplay = (item) => {
  if (item?.item_unit_name) {
    return item.item_unit_symbol
      ? `${item.item_unit_name} (${item.item_unit_symbol})`
      : item.item_unit_name;
  }
  if (item?.item_unit_symbol) return item.item_unit_symbol;
  return "-";
};

// ─── Print Invoice (Replaced by printInvoiceWithIframe from printHelper) ───

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
  itemCard: (inCart, outOfStock) => ({
    background: "#fff",
    border: inCart ? "2px solid #16a34a" : "1px solid #e5e7eb",
    borderRadius: 8,
    padding: "10px 10px 8px",
    cursor: outOfStock ? "not-allowed" : "pointer",
    transition: "box-shadow 0.15s, border 0.15s",
    position: "relative",
    opacity: outOfStock ? 0.75 : 1,
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
  orderTypeTabsContainer: {
    display: "flex",
    width: "100%",
    background: "#374151",
    height: 40,
  },
  orderTypeTab: (active) => ({
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    background: active ? "#c0392b" : "#374151",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    borderRight: "1px solid #4b5563",
    userSelect: "none",
    transition: "background 0.2s",
  }),
  subHeaderBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: 46,
    borderBottom: "1px solid #cbd5e1",
    background: "#fff",
  },
  subHeaderIcons: {
    display: "flex",
    gap: 2,
    alignItems: "center",
    paddingLeft: 8,
  },
  subHeaderIconButton: (active) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: active ? "#c0392b" : "#64748b",
    width: 44,
    height: 40,
    borderRight: "1px solid #e2e8f0",
  }),
  iconLabel: (active) => ({
    fontSize: 9,
    fontWeight: 700,
    marginTop: 1,
    color: active ? "#c0392b" : "#64748b",
  }),
  yellowBadge: {
    background: "#ffb300",
    color: "#000",
    fontWeight: 700,
    fontSize: 13,
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  customerFormContainer: {
    padding: "10px 12px",
    borderBottom: "1px solid #cbd5e1",
    background: "#fff",
    display: "flex",
    gap: 10,
  },
  customerInputsGrid: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  customerInputRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  customerLabel: {
    width: 55,
    fontSize: 11,
    fontWeight: 700,
    color: "#475569",
    textAlign: "left",
  },
  customerInput: {
    flex: 1,
    padding: "5px 8px",
    fontSize: 12,
    border: "1px solid #cbd5e1",
    borderRadius: 4,
    outline: "none",
    background: "#f8fafc",
    color: "#1e293b",
    height: 26,
  },
  customerActionCol: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    justifyContent: "center",
  },
  customerActionBtn: {
    width: 26,
    height: 26,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #cbd5e1",
    borderRadius: 4,
    background: "#fff",
    cursor: "pointer",
    color: "#64748b",
  },
  cartTableHeader: {
    display: "flex",
    background: "#e2e8f0",
    padding: "6px 12px",
    fontSize: 10,
    fontWeight: 700,
    color: "#475569",
    borderBottom: "1px solid #cbd5e1",
    userSelect: "none",
  },
  plateIcon: {
    fontSize: 48,
    opacity: 0.6,
    marginBottom: 8,
  },
  emptyCartTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#374151",
    marginBottom: 4,
  },
  emptyCartSubtitle: {
    fontSize: 11,
    color: "#9ca3af",
  },
  paymentSelectorContainer: {
    padding: "8px 12px",
    borderTop: "1px solid #cbd5e1",
    background: "#f8fafc",
  },
  paymentTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#475569",
    marginBottom: 6,
  },
  paymentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 4,
  },
  paymentModeBtn: (active) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px 2px",
    border: active ? "2px solid #c0392b" : "1px solid #cbd5e1",
    borderRadius: 5,
    background: active ? "#fef2f2" : "#fff",
    color: active ? "#c0392b" : "#475569",
    cursor: "pointer",
    fontSize: 10,
    fontWeight: 700,
    transition: "all 0.15s",
  }),
  qrContainer: {
    marginTop: 6,
    padding: 8,
    border: "1px dashed #ffb300",
    borderRadius: 6,
    background: "#fffdf5",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  qrHeader: {
    fontSize: 11,
    fontWeight: 700,
    color: "#b45309",
    marginBottom: 6,
  },
  qrWrapper: {
    position: "relative",
    padding: 6,
    border: "1px solid #e2e8f0",
    background: "#fff",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  qrScannerLine: {
    position: "absolute",
    left: 6,
    right: 6,
    height: 2,
    background: "#ef4444",
    boxShadow: "0 0 8px #ef4444",
    animation: "scan 2s linear infinite",
  },
  qrFooter: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 6,
    fontStyle: "italic",
  },
  footerFlexRow: {
    display: "flex",
    gap: 4,
    marginTop: 8,
  },
  actionBtnSavePrint: {
    flex: 1.2,
    padding: "8px 0",
    background: "#c0392b",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
    textAlign: "center",
  },
  actionBtnSaveEBill: {
    flex: 1.2,
    padding: "8px 0",
    background: "#c0392b",
    color: "#fff",
    border: "2px solid #2563eb",
    borderRadius: 5,
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
    textAlign: "center",
  },
  actionBtnKotPrint: {
    flex: 1,
    padding: "8px 0",
    background: "#374151",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
    textAlign: "center",
  },
  actionBtnHold: {
    flex: 0.8,
    padding: "8px 0",
    background: "#fff",
    color: "#475569",
    border: "1px solid #cbd5e1",
    borderRadius: 5,
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
    textAlign: "center",
  },
};

// ─── Main Component ──────────────────────────────────────────────────────────
const BillingItems = () => {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [tokenNumber, setTokenNumber] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  // POS States
  const [orderType, setOrderType] = useState("Dine In");
  const [showCustomer, setShowCustomer] = useState(true);
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerLocality, setCustomerLocality] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [tableNumber, setTableNumber] = useState("");
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [tablesList, setTablesList] = useState([]);
  const [tableModalOpen, setTableModalOpen] = useState(false);

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

  const fetchTables = async () => {
    try {
      const res = await getTablesList();
      if (res) {
        const list = res.data || res || [];
        setTablesList(list);
      }
    } catch (e) {
      console.error("Error fetching tables:", e);
    }
  };

  useEffect(() => { 
    fetchItems(); 
    fetchTables();
  }, []);

  // Sync selected table search parameter once items and tablesList are ready
  const hasSyncedQuery = useRef(false);
  
  const loadInvoiceDetails = async (invoiceNum) => {
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(`http://localhost:5000/api/invoices/details/${invoiceNum}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        const inv = json.data;
        setInvoiceNumber(inv.invoice_number);
        setTokenNumber(inv.token_number || inv.kot_number);
        setIsSaved(true);
        setCustomerMobile(inv.mobile_number || "");
        setCustomerName(inv.customer_name || "");
        setCustomerAddress(inv.customer_location || "");
        setCustomerLocality("");
        setPaymentMode(inv.payment_mode || "Cash");
        
        if (inv.items) {
          const mapped = inv.items.map((item) => {
            const itemPrice = Number(item.price || (Number(item.subtotal) / Number(item.quantity || 1)));
            const matchedItem = items.find((i) => i.name === item.name);
            return {
              id: matchedItem ? matchedItem.id : item.item_id,
              name: item.name,
              category: item.category || "",
              selling_price: itemPrice,
              quantity: Number(item.quantity)
            };
          });
          setCartItems(mapped);
        }
      }
    } catch (err) {
      console.error("Error loading table invoice details:", err);
    }
  };

  useEffect(() => {
    if (items.length > 0 && tablesList.length > 0 && !hasSyncedQuery.current) {
      const qTableNum = searchParams.get("table_number");
      const qOrderType = searchParams.get("order_type");
      if (qOrderType && ["Dine In", "Delivery", "Pick Up"].includes(qOrderType)) {
        setOrderType(qOrderType);
      }
      if (qTableNum) {
        hasSyncedQuery.current = true;
        setTableNumber(qTableNum);
        const selected = tablesList.find(t => String(t.table_number) === String(qTableNum));
        if (selected) {
          setSelectedTableId(selected.id);
          if (selected.active_invoice_number) {
            loadInvoiceDetails(selected.active_invoice_number);
          }
        }
      } else if (qOrderType) {
        hasSyncedQuery.current = true;
      }
    }
  }, [items, tablesList, searchParams]);

  // Handle Table selection/change and loading running order
  const handleTableSelection = async (val, list = tablesList) => {
    setTableNumber(val);
    const selected = list.find(t => String(t.table_number) === String(val));
    if (selected) {
      setSelectedTableId(selected.id);
      if (selected.active_invoice_number) {
        await loadInvoiceDetails(selected.active_invoice_number);
      } else {
        // Clear order state since selected table is vacant
        setCartItems([]);
        setInvoiceNumber("");
        setTokenNumber("");
        setIsSaved(false);
        setCustomerMobile("");
        setCustomerName("");
        setCustomerAddress("");
        setCustomerLocality("");
        setPaymentMode("Cash");
      }
    } else {
      setSelectedTableId(null);
      setCartItems([]);
      setInvoiceNumber("");
      setTokenNumber("");
      setIsSaved(false);
      setCustomerMobile("");
      setCustomerName("");
      setCustomerAddress("");
      setCustomerLocality("");
      setPaymentMode("Cash");
    }
  };

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
    if (isOutOfStock(item)) {
      alert(`"${item.name}" is out of stock and cannot be added to cart.`);
      return;
    }
    setSelectedItem(item);
    const existing = cartItems.find((c) => c.id === item.id);
    const itemMax = item.stock_status === "Do Not Track" ? Infinity : Number(item.remaining_qty || 0);
    setQuantity(existing ? Math.min(itemMax, existing.quantity) : Math.min(itemMax, 1));
    setDialogOpen(true);
  };

  const closeModal = () => { setDialogOpen(false); setSelectedItem(null); };

  const addToCart = () => {
    if (!selectedItem) return;
    const itemMax = selectedItem.stock_status === "Do Not Track" ? Infinity : Number(selectedItem.remaining_qty || 0);
    const finalQty = Math.min(itemMax, Number(quantity));

    if (finalQty <= 0 && selectedItem.stock_status !== "Do Not Track") {
      alert("This item is out of stock!");
      return;
    }

    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === selectedItem.id);
      if (exists) return prev.map((i) =>
        i.id === selectedItem.id ? { ...i, quantity: finalQty } : i
      );
      return [...prev, { ...selectedItem, quantity: finalQty }];
    });
    if (!invoiceNumber) setInvoiceNumber(generateInvoiceNumber());
    if (!tokenNumber) setTokenNumber(generateTokenNumber());
    setIsSaved(false);
    closeModal();
  };

  const updateQty = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const itemMax = i.stock_status === "Do Not Track" ? Infinity : Number(i.remaining_qty || 0);
            const newQty = Math.max(1, i.quantity + delta);
            if (delta > 0 && newQty > itemMax) {
              alert(`Cannot add more. Only ${itemMax} units remaining in stock.`);
              return { ...i, quantity: itemMax };
            }
            return { ...i, quantity: newQty };
          }
          return i;
        })
        .filter((i) => i.quantity > 0)
    );
    setIsSaved(false);
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
    setIsSaved(false);
  };

  const clearCart = () => { 
    setCartItems([]); 
    setInvoiceNumber(""); 
    setTokenNumber(""); 
    setIsSaved(false); 
    setSavedMsg(false); 
  };

  const handleSave = async (options = {}) => {
    if (!cartItems.length) return null;
    setIsSaving(true);
    try {
      const subtotalAmt = Number((cartTotal / 1.18).toFixed(2));
      const gstAmt = Number((cartTotal - subtotalAmt).toFixed(2));
      const cgstAmt = Number((gstAmt / 2).toFixed(2));
      const sgstAmt = Number((gstAmt / 2).toFixed(2));

      const payload = {
        invoice_number: invoiceNumber || generateInvoiceNumber(),
        token_number: tokenNumber || generateTokenNumber(),
        kot_number: tokenNumber || generateTokenNumber(),
        total_amount: Number(cartTotal.toFixed(2)),
        subtotal: subtotalAmt,
        gst: gstAmt,
        cgst: cgstAmt,
        sgst: sgstAmt,
        client_name: customerName || "Walk-In Customer",
        customer_mobile: customerMobile || "",
        customer_location: customerAddress + (customerLocality ? `, ${customerLocality}` : ""),
        payment_mode: options.paymentMode || paymentMode,
        whatsapp_enabled: options.sendWhatsapp ? 1 : 0,
        notification_method: options.notificationMethod || (options.sendWhatsapp ? "WhatsApp" : "None"),
        table_id: orderType === "Dine In" ? selectedTableId : null,
        table_number: orderType === "Dine In" ? tableNumber : null,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          qty: item.quantity,
          price: item.selling_price
        }))
      };

      let res;
      if (isSaved && invoiceNumber) {
        res = await axiosInstance.put(`/invoices/update/${invoiceNumber}`, {
          ...payload,
          status: options.status || (orderType === "Dine In" ? "running" : "paid")
        });
      } else {
        res = await axiosInstance.post("/invoices/create", {
          ...payload,
          status: options.status || (orderType === "Dine In" ? "running" : "paid")
        });
      }
      if (res?.success) {
        const savedData = res.data || {};
        const finalInv = savedData.invoice_number || payload.invoice_number;
        const finalTkn = savedData.token_number || payload.token_number;
        setInvoiceNumber(finalInv);
        setTokenNumber(finalTkn);
        setIsSaved(true);
        setSavedMsg(true);
        fetchItems();
        setTimeout(() => setSavedMsg(false), 3000);
        return {
          invoice_number: finalInv,
          token_number: finalTkn,
          customer_name: payload.client_name,
          customer_mobile: payload.customer_mobile,
          customer_location: payload.customer_location,
          payment_mode: payload.payment_mode,
          total_amount: payload.total_amount,
          subtotal: payload.subtotal,
          gst: payload.gst,
          cgst: payload.cgst,
          sgst: payload.sgst,
          table_number: payload.table_number,
          items: payload.items
        };
      } else {
        alert(res?.message || "Failed to save invoice");
        return null;
      }
    } catch (e) {
      console.error("Save invoice error:", e);
      const isDuplicate = e?.message?.toLowerCase().includes("exists") || e?.message?.toLowerCase().includes("duplicate");
      if (isDuplicate) {
        const newInv = generateInvoiceNumber();
        const newTkn = generateTokenNumber();
        setInvoiceNumber(newInv);
        setTokenNumber(newTkn);
        alert(`Duplicate entry detected in database! Regenerated new Invoice (${newInv}) and Token (${newTkn}). Please try saving again.`);
      } else {
        alert(e?.message || "Error saving invoice to database");
      }
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const openCustomerMessage = (invoiceNumberVal, customerNameVal, mobileVal, totalAmtVal) => {
    const cleanMobile = String(mobileVal || "").replace(/\D/g, "");
    const safeName = customerNameVal || "Customer";
    const formattedDate = new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).replace(",", "");
    const billLink = `${window.location.origin}/#/public/invoice/${invoiceNumberVal}`;
    
    // Updated to use "Vyanjan"
    const message = `Dear ${safeName},\n\nThank you for your recent order at Vyanjan!\nYour invoice is now available. 🌟\n\n💰 Amount : Rs.${Number(totalAmtVal).toFixed(2)}\n📅 Date : ${formattedDate}\n🔗 View Invoice : ${billLink}\n\nHow was your experience with your order at Vyanjan today?`;

    if (cleanMobile.length >= 10) {
      const whatsappUrl = `https://wa.me/${cleanMobile}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    } else {
      alert("Please enter a valid 10-digit customer mobile number.");
    }
  };

  const handleSaveAndEBill = async () => {
    if (!customerMobile) {
      alert("Customer mobile number is required to send E-Bill!");
      return;
    }
    const savedData = await handleSave({ sendWhatsapp: true });
    if (savedData) {
      openCustomerMessage(savedData.invoice_number, savedData.customer_name, savedData.customer_mobile, savedData.total_amount);
    }
  };

  const printKOT = (cartItemsVal, tokenNumberVal, orderTypeVal, tableNumberVal) => {
    if (!cartItemsVal.length) return;
    
    const formattedDate = new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });

    const rows = cartItemsVal
      .map(
        (item) => `<tr>
          <td style="font-size: 14px; font-weight: bold; padding: 6px 0;">${item.name}</td>
          <td style="font-size: 14px; font-weight: bold; text-align: right; padding: 6px 0;">${item.quantity}</td>
        </tr>`
      )
      .join("");

    const html = `<!DOCTYPE html><html><head><title>KOT ${tokenNumberVal}</title>
      <style>
        body {
          font-family: 'Courier New', Courier, monospace;
          width: 76mm;
          margin: 0;
          padding: 5px;
          color: #000;
          background-color: #fff;
        }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .dashed { border-top: 1px dashed #000; margin: 8px 0; }
        table { width: 100%; border-collapse: collapse; }
        th, td { text-align: left; font-size: 12px; }
        .right { text-align: right; }
      </style></head>
      <body>
        <div class="center bold" style="font-size: 16px;">KITCHEN ORDER TICKET (KOT)</div>
        <div class="dashed"></div>
        <div><span class="bold">Token No:</span> ${tokenNumberVal || "NA"}</div>
        <div style="margin-top: 4px;"><span class="bold">Order Type:</span> ${orderTypeVal}</div>
        ${orderTypeVal === "Dine In" && tableNumberVal ? `<div style="margin-top: 4px;"><span class="bold">Table No:</span> ${tableNumberVal}</div>` : ""}
        <div style="margin-top: 4px;"><span class="bold">Date/Time:</span> ${formattedDate}</div>
        <div class="dashed"></div>
        <table>
          <thead>
            <tr style="font-weight: bold; border-bottom: 1px dotted #000;">
              <th style="padding-bottom: 4px;">Item Name</th>
              <th class="right" style="padding-bottom: 4px;">Qty</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody></table>
        <div class="dashed"></div>
        <div class="center bold" style="font-size: 11px; margin-top: 8px;">*** KITCHEN COPY ***</div>
      </body></html>`;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.write(html);
    doc.close();
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };

  const handleKOTPrint = async () => {
    if (!cartItems.length) return;
    
    let currentTokenNo = tokenNumber;
    if (!isSaved) {
      const savedData = await handleSave();
      if (!savedData) return;
      currentTokenNo = savedData.token_number;
    }
    
    printKOT(cartItems, currentTokenNo, orderType, tableNumber);
  };

  const handleHold = () => {
    if (!cartItems.length) {
      alert("Cart is empty. Nothing to hold!");
      return;
    }
    const holdItem = {
      id: `HOLD-${Date.now()}`,
      orderType,
      tableNumber,
      customerName,
      customerMobile,
      customerAddress,
      customerLocality,
      paymentMode,
      cartItems,
      cartTotal,
      time: new Date().toLocaleTimeString()
    };
    const currentHeld = JSON.parse(localStorage.getItem("vyanjan_held_orders") || "[]");
    localStorage.setItem("vyanjan_held_orders", JSON.stringify([...currentHeld, holdItem]));
    
    alert(`Order placed on hold! ⏸️ (Total held: ${currentHeld.length + 1})`);
    clearCart();
    
    // Clear customer inputs
    setCustomerMobile("");
    setCustomerName("");
    setCustomerAddress("");
    setCustomerLocality("");
    setPaymentMode("Cash");
  };

  const handlePrint = async () => {
    if (!cartItems.length) return;
    
    let savedData;
    if (!isSaved) {
      savedData = await handleSave();
      if (!savedData) {
        return;
      }
    } else {
      savedData = {
        invoice_number: invoiceNumber,
        token_number: tokenNumber,
        total_amount: cartTotal,
        subtotal: cartTotal / 1.18,
        gst: cartTotal - (cartTotal / 1.18),
        cgst: (cartTotal - (cartTotal / 1.18)) / 2,
        sgst: (cartTotal - (cartTotal / 1.18)) / 2,
        payment_mode: paymentMode,
        customer_name: customerName,
        customer_mobile: customerMobile,
        customer_location: customerAddress + (customerLocality ? `, ${customerLocality}` : ""),
        table_number: orderType === "Dine In" ? tableNumber : null,
        items: cartItems.map(item => ({
          name: item.name,
          qty: item.quantity,
          price: item.selling_price
        }))
      };
    }

    printInvoiceWithIframe(savedData);
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
                const itemStatus = getStockLabel(item.stock_status);
                const outOfStock = isOutOfStock(item);
                return (
                  <div
                    key={item.id}
                    style={S.itemCard(!!inCart, outOfStock)}
                    onClick={() => openModal(item)}
                    onMouseEnter={(e) => { if (!outOfStock) e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.10)"; }}
                    onMouseLeave={(e) => { if (!outOfStock) e.currentTarget.style.boxShadow = "none"; }}
                  >
                    {inCart && <span style={S.inCartBadge}>×{inCart.quantity}</span>}
                    {outOfStock && (
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(255, 255, 255, 0.82)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 8,
                        zIndex: 10,
                      }}>
                        <span style={{
                          background: "#ef4444",
                          color: "#fff",
                          fontSize: 10,
                          fontWeight: 800,
                          textTransform: "uppercase",
                          padding: "4px 8px",
                          borderRadius: 4,
                          boxShadow: "0 2px 4px rgba(239, 68, 68, 0.3)",
                        }}>
                          Out of Stock
                        </span>
                      </div>
                    )}
                    <div style={S.itemName}>{item.name}</div>
                    <div style={S.itemPrice}>₹{item.selling_price || 0}</div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 6, padding: "6px 0 2px", borderTop: "1px dashed #f1f3f6" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#64748b" }}>
                        <span>Orig Qty:</span>
                        <span style={{ fontWeight: 600 }}>{item.original_qty ?? 0}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#64748b" }}>
                        <span>Remaining:</span>
                        <span style={{ fontWeight: 700, color: outOfStock ? "#ef4444" : "#16a34a" }}>
                          {item.remaining_qty ?? 0}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4, gap: 8, fontSize: 11 }}>
                      <span style={{ color: "#6b7280" }}>{getUnitDisplay(item)}</span>
                      <span style={{
                        borderRadius: 999,
                        padding: "2px 8px",
                        background: outOfStock ? "#fee2e2" : "#dcfce7",
                        color: outOfStock ? "#b91c1c" : "#166534",
                        fontWeight: 700,
                      }}>
                        {outOfStock ? "Out of Stock" : itemStatus}
                      </span>
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
        {/* Order Type Tabs */}
        <div style={S.orderTypeTabsContainer}>
          <div style={S.orderTypeTab(orderType === "Dine In")} onClick={() => setOrderType("Dine In")}>Dine In</div>
          <div style={S.orderTypeTab(orderType === "Delivery")} onClick={() => setOrderType("Delivery")}>Delivery</div>
          <div style={S.orderTypeTab(orderType === "Pick Up")} onClick={() => setOrderType("Pick Up")}>Pick Up</div>
        </div>

        {/* Sub-Header bar */}
        <div style={S.subHeaderBar}>
          <div style={S.subHeaderIcons}>
            {/* Table Selection Icon Box */}
            <div 
              style={S.subHeaderIconButton(orderType === "Dine In" && tableNumber)} 
              onClick={() => {
                if (orderType === "Dine In") {
                  setTableModalOpen(true);
                } else {
                  alert("Table selection is only available for Dine In orders.");
                }
              }}
            >
              <TableRestaurantOutlinedIcon sx={{ fontSize: 18, color: (orderType === "Dine In" && tableNumber) ? "#c0392b" : "#64748b" }} />
              <span style={S.iconLabel(orderType === "Dine In" && tableNumber)}>
                {tableNumber || "Table"}
              </span>
            </div>

            {/* Customer Toggle Icon */}
            <div style={S.subHeaderIconButton(showCustomer)} onClick={() => setShowCustomer(!showCustomer)}>
              <PersonOutlinedIcon sx={{ fontSize: 18 }} />
            </div>

            {/* Group Split Icon */}
            <div style={S.subHeaderIconButton(false)} onClick={() => alert("Group split billing feature is loading...")}>
              <PeopleOutlinedIcon sx={{ fontSize: 18 }} />
            </div>

            {/* Edit Order Note Icon */}
            <div style={S.subHeaderIconButton(false)} onClick={() => alert("KOT/Order notes feature is loading...")}>
              <EditOutlinedIcon sx={{ fontSize: 18 }} />
            </div>
          </div>

          {/* Active Order Type badge */}
          <div style={S.yellowBadge}>
            {orderType}
          </div>
        </div>

        {/* Table Number Input Row - Matching Screenshot 1 */}
        {orderType === "Dine In" && (
          <div style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 14px",
            borderBottom: "1px solid #cbd5e1",
            background: "#fdfdfd",
            gap: 12
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#111827", fontFamily: "sans-serif" }}>
              Please Enter Table No.
            </span>
            <input 
              type="text"
              value={tableNumber}
              onChange={(e) => {
                handleTableSelection(e.target.value);
              }}
              style={{
                width: 50,
                height: 28,
                borderRadius: 8,
                border: "1.5px solid #3b82f6", // blue border as in screenshot
                outline: "none",
                textAlign: "center",
                fontSize: 14,
                fontWeight: 700,
                color: "#111827",
                padding: "0 4px",
              }}
            />
          </div>
        )}

        {/* Collapsible Customer Details Form */}
        {showCustomer && (
          <div style={S.customerFormContainer}>
            <div style={S.customerInputsGrid}>
              <div style={S.customerInputRow}>
                <span style={S.customerLabel}>Mobile:</span>
                <input 
                  style={S.customerInput}
                  type="tel"
                  placeholder="e.g. 7088038656"
                  value={customerMobile}
                  onChange={(e) => setCustomerMobile(e.target.value)}
                />
              </div>
              <div style={S.customerInputRow}>
                <span style={S.customerLabel}>Name:</span>
                <input 
                  style={S.customerInput}
                  placeholder="e.g. JAGRITI"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div style={S.customerInputRow}>
                <span style={S.customerLabel}>Add:</span>
                <input 
                  style={S.customerInput}
                  placeholder="e.g. Noida"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                />
              </div>
              <div style={S.customerInputRow}>
                <span style={S.customerLabel}>Locality:</span>
                <input 
                  style={S.customerInput}
                  placeholder="e.g. Locality"
                  value={customerLocality}
                  onChange={(e) => setCustomerLocality(e.target.value)}
                />
              </div>
            </div>

            {/* Right Action Icons Column */}
            <div style={S.customerActionCol}>
              <button style={S.customerActionBtn} title="Past Orders" onClick={() => alert("No past orders found for this customer.")}>
                <HistoryIcon sx={{ fontSize: 14 }} />
              </button>
              <button style={S.customerActionBtn} title="Tax Invoice" onClick={() => alert("Tax invoice enabled for this transaction.")}>
                <ReceiptIcon sx={{ fontSize: 14 }} />
              </button>
              <button style={S.customerActionBtn} title="Favorite Customer" onClick={() => alert("Regular customer status toggled.")}>
                <StarIcon sx={{ fontSize: 14 }} />
              </button>
              <button style={S.customerActionBtn} title="Settings" onClick={() => alert("Customer role set to Regular B2C Customer.")}>
                <ManageAccountsIcon sx={{ fontSize: 14 }} />
              </button>
              <button 
                style={S.customerActionBtn} 
                title="Clear Details" 
                onClick={() => {
                  setCustomerMobile("");
                  setCustomerName("");
                  setCustomerAddress("");
                  setCustomerLocality("");
                }}
              >
                <DeleteIcon sx={{ fontSize: 14, color: "#ef4444" }} />
              </button>
            </div>
          </div>
        )}

        {/* ITEMS table header */}
        <div style={S.cartTableHeader}>
          <span style={{ flex: 2, textAlign: "left" }}>ITEMS</span>
          <span style={{ flex: 1.5, textAlign: "center" }}>CHECK ITEMS</span>
          <span style={{ flex: 1, textAlign: "center" }}>QTY.</span>
          <span style={{ flex: 1, textAlign: "right" }}>PRICE</span>
        </div>

        {/* Cart items or placeholder plate */}
        {cartItems.length === 0 ? (
          <div style={S.emptyCart}>
            <div style={S.plateIcon}>🍽️</div>
            <div style={S.emptyCartTitle}>No Item Selected</div>
            <div style={S.emptyCartSubtitle}>Please Select Item from Left Menu Item</div>
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

        {/* Cart details & actions footer (only when items are present) */}
        {cartItems.length > 0 && (
          <>
            {/* Payment Mode Selector */}
            <div style={S.paymentSelectorContainer}>
              <div style={S.paymentTitle}>Select Payment Mode</div>
              <div style={S.paymentGrid}>
                <button 
                  style={S.paymentModeBtn(paymentMode === "Cash")} 
                  onClick={() => setPaymentMode("Cash")}
                >
                  <LocalAtmIcon sx={{ fontSize: 16, mb: 0.2 }} />
                  <span>Cash</span>
                </button>
                
                <button 
                  style={S.paymentModeBtn(paymentMode === "Paytm")} 
                  onClick={() => setPaymentMode("Paytm")}
                >
                  <QrCodeScannerIcon sx={{ fontSize: 16, mb: 0.2 }} />
                  <span>Paytm</span>
                </button>
                
                <button 
                  style={S.paymentModeBtn(paymentMode === "UPI")} 
                  onClick={() => setPaymentMode("UPI")}
                >
                  <TapAndPlayIcon sx={{ fontSize: 16, mb: 0.2 }} />
                  <span>UPI</span>
                </button>
                
                <button 
                  style={S.paymentModeBtn(paymentMode === "Card")} 
                  onClick={() => setPaymentMode("Card")}
                >
                  <CreditCardIcon sx={{ fontSize: 16, mb: 0.2 }} />
                  <span>Card</span>
                </button>
              </div>
              
              {/* Visual scanner for Paytm/UPI */}
              {(paymentMode === "Paytm" || paymentMode === "UPI") && (
                <div style={S.qrContainer}>
                  <style>{`
                    @keyframes scan {
                      0% { top: 0%; }
                      50% { top: 100%; }
                      100% { top: 0%; }
                    }
                  `}</style>
                  <div style={S.qrHeader}>Scan QR via {paymentMode} Scanner</div>
                  <div style={S.qrWrapper}>
                    <svg width="60" height="60" viewBox="0 0 100 100" style={{ display: "block" }}>
                      <rect x="5" y="5" width="25" height="25" fill="none" stroke="#000" strokeWidth="4" />
                      <rect x="10" y="10" width="15" height="15" fill="#000" />
                      <rect x="70" y="5" width="25" height="25" fill="none" stroke="#000" strokeWidth="4" />
                      <rect x="75" y="10" width="15" height="15" fill="#000" />
                      <rect x="5" y="70" width="25" height="25" fill="none" stroke="#000" strokeWidth="4" />
                      <rect x="10" y="75" width="15" height="15" fill="#000" />
                      <rect x="35" y="5" width="5" height="10" fill="#000" />
                      <rect x="45" y="15" width="10" height="5" fill="#000" />
                      <rect x="40" y="25" width="5" height="15" fill="#000" />
                      <rect x="55" y="5" width="10" height="10" fill="#000" />
                      <rect x="70" y="35" width="5" height="5" fill="#000" />
                      <rect x="80" y="45" width="15" height="10" fill="#000" />
                      <rect x="35" y="50" width="10" height="5" fill="#000" />
                      <rect x="50" y="60" width="15" height="15" fill="#000" />
                      <rect x="35" y="80" width="20" height="5" fill="#000" />
                      <rect x="75" y="75" width="15" height="15" fill="#000" />
                      <rect x="65" y="85" width="5" height="10" fill="#000" />
                    </svg>
                    <div style={S.qrScannerLine}></div>
                  </div>
                  <div style={S.qrFooter}>Waiting for device scans...</div>
                </div>
              )}
            </div>

            <div style={S.cartFooter}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                {invoiceNumber && (
                  <div style={S.invoiceNo}>📄 Invoice: {invoiceNumber}</div>
                )}
                {tokenNumber && (
                  <div style={{ ...S.invoiceNo, textAlign: "right" }}>🎫 Token: {tokenNumber}</div>
                )}
              </div>
              <div style={S.totalRow}>
                <span style={S.totalLabel}>Grand Total</span>
                <span style={S.totalValue}>₹{cartTotal.toFixed(2)}</span>
              </div>
              {savedMsg && (
                <div style={{ ...S.statusBar, background: "#dcfce7", color: "#16a34a", marginBottom: 6 }}>
                  ✓ Invoice saved to DB! Ready to print.
                </div>
              )}
              <div style={S.footerFlexRow}>
                <button 
                  style={{ ...S.actionBtnSavePrint, opacity: isSaving ? 0.7 : 1, cursor: isSaving ? "not-allowed" : "pointer" }} 
                  onClick={() => handlePrint()}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save & Print"}
                </button>
                <button 
                  style={{ ...S.actionBtnSaveEBill, opacity: isSaving ? 0.7 : 1, cursor: isSaving ? "not-allowed" : "pointer" }} 
                  onClick={handleSaveAndEBill}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save & EBill"}
                </button>
                <button 
                  style={{ ...S.actionBtnKotPrint, opacity: isSaving ? 0.7 : 1, cursor: isSaving ? "not-allowed" : "pointer" }} 
                  onClick={handleKOTPrint}
                  disabled={isSaving}
                >
                  KOT & Print
                </button>
                <button 
                  style={S.actionBtnHold} 
                  onClick={handleHold}
                  disabled={isSaving}
                >
                  Hold
                </button>
              </div>
            </div>
          </>
        )}
      </div>

    {/* Item Detail Modal */}
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
            <div style={S.modalRow}>
              <span>Unit</span>
              <span style={S.modalRowVal}>{getUnitDisplay(selectedItem)}</span>
            </div>
            <div style={S.modalRow}>
              <span>Stock Status</span>
              <span style={{ ...S.modalRowVal, color: isOutOfStock(selectedItem) ? "#b91c1c" : "#15803d" }}>
                {getStockLabel(selectedItem.stock_status)}
              </span>
            </div>
            {isOutOfStock(selectedItem) && (
              <div style={{ ...S.statusBar, background: "#fee2e2", color: "#b91c1c", marginTop: 4, marginBottom: 12 }}>
                This item is currently out of stock and cannot be added.
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
                <button 
                  style={S.modalQtyBtn} 
                  onClick={() => {
                    const itemMax = selectedItem.stock_status === "Do Not Track" ? Infinity : Number(selectedItem.remaining_qty || 0);
                    setQuantity((q) => {
                      if (q >= itemMax) {
                        alert(`Cannot add more. Only ${itemMax} units remaining in stock.`);
                        return q;
                      }
                      return q + 1;
                    });
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <div style={S.modalTotal}>Total: ₹{itemTotal.toFixed(2)}</div>

            <div style={S.modalActions}>
              <button
                style={{
                  ...S.modalAddBtn,
                  opacity: isOutOfStock(selectedItem) ? 0.5 : 1,
                  cursor: isOutOfStock(selectedItem) ? "not-allowed" : "pointer",
                }}
                onClick={addToCart}
                disabled={isOutOfStock(selectedItem)}
              >
                {cartItems.find((c) => c.id === selectedItem.id) ? "Update in Cart" : "Add to Invoice"}
              </button>
              <button style={S.modalCloseBtn} onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Table Selection Modal ── */}
      {tableModalOpen && (
        <div style={S.overlay} onClick={() => setTableModalOpen(false)}>
          <div style={{ ...S.modal, width: 500 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#111827", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Select Dining Table</span>
              <button
                onClick={() => setTableModalOpen(false)}
                style={{ border: "none", background: "none", fontSize: 24, fontWeight: 700, cursor: "pointer", color: "#9ca3af" }}
              >
                ×
              </button>
            </div>

            {tablesList.length === 0 ? (
              <div style={{ textAlign: "center", padding: 20, color: "#9ca3af" }}>
                No tables configured. Please add tables in the "Tables & Areas" settings section.
              </div>
            ) : (
              <div style={{ maxHeight: 350, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
                {Object.values(
                  tablesList.reduce((acc, t) => {
                    const a = t.area_name || "General";
                    if (!acc[a]) acc[a] = { name: a, list: [] };
                    acc[a].list.push(t);
                    return acc;
                  }, {})
                ).map((area) => (
                  <div key={area.name}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#64748B", marginBottom: 8, borderBottom: "1px solid #e2e8f0", paddingBottom: 4 }}>
                      {area.name}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {area.list.map((t) => {
                        const isSelected = tableNumber === t.table_number;
                        const isRunning = t.status === "running";
                        const isPrinted = t.status === "printed";
                        const isPaid = t.status === "paid";
                        const isRunningKOT = t.status === "running_kot";

                        let statusText = "Vacant";
                        let statusColor = "#16a34a";

                        if (isRunning) {
                          statusText = "Running";
                          statusColor = "#2563eb";
                        } else if (isPrinted) {
                          statusText = "Printed";
                          statusColor = "#9333ea";
                        } else if (isPaid) {
                          statusText = "Paid";
                          statusColor = "#d97706";
                        } else if (isRunningKOT) {
                          statusText = "Running KOT";
                          statusColor = "#ca8a04";
                        }

                        return (
                          <div
                            key={t.id}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "8px 12px",
                              borderRadius: 6,
                              background: isSelected ? "#fee2e2" : "#f8fafc",
                              border: isSelected ? "1px solid #f87171" : "1px solid #e2e8f0",
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                            }}
                            onClick={() => {
                              handleTableSelection(t.table_number);
                              setTableModalOpen(false);
                            }}
                          >
                            <span style={{ fontSize: 13, fontWeight: 700, color: isSelected ? "#b91c1c" : "#334155" }}>
                              Table #{t.table_number} {t.table_name ? `(${t.table_name})` : ""}
                            </span>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>
                                Cap: {t.capacity}
                              </span>
                              <span style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: statusColor,
                                background: `${statusColor}15`,
                                padding: "2px 8px",
                                borderRadius: 12
                              }}>
                                {statusText}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
              <button
                style={S.modalCloseBtn}
                onClick={() => setTableModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingItems;