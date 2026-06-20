import { Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { BillingSidebar } from "./BillingSidebar";

import BillingHome from "./BillingHome";
import BillingItems from "./BillingItems";
import BillingAddItem from "./BillingAddItem";
import BillingTables from "./BillingTables";
import BillingTableView from "./BillingTableView";
import Invoices from "./Invoices";
import Payments from "./Payments";
import Reports from "./Reports";
import CreateInvoice from "./CreateInvoice";
import Customers from "./Customers";
import Transactions from "./Transactions";
import Expenses from "./Expenses";
import BillingSettings from "./BillingSettings";
import Vouchers from "./Vouchers";
import TokenReports from "../tokens/TokenReports";
import ItemWastage from "../shared/ItemWastage";

const BillingDashboard = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* SAME AS INVENTORY STRUCTURE */}
      <BillingSidebar />

      {/* RIGHT CONTENT */}
      <Box sx={{ flexGrow: 1 }}>
        <Routes>
          <Route index element={<BillingHome />} />
          <Route path="items" element={<BillingItems />} />
          <Route path="add-item" element={<BillingAddItem />} />
          <Route path="tables" element={<BillingTables />} />
          <Route path="table-view" element={<BillingTableView />} />
          <Route path="vouchers" element={<Vouchers />} />
          <Route path="item-wastage" element={<ItemWastage />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="create-invoice" element={<CreateInvoice />} />
          <Route path="customers" element={<Customers />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="settings" element={<BillingSettings />} />
          <Route path="tokens" element={<TokenReports />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default BillingDashboard;