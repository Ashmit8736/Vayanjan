import { Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import UnitManagement from "./Masters/UnitManagement";
import RawMaterials from "./Masters/RawMaterials";
import AvailableStock from "./ManageStock/AvailableStock";
import Dashboard from "./Dashboard";
import StockPurchase from "./Purchase/StockPurchase";
import PurhaseOrderList from "./Purchase/PurchaseOrderList";  
import ThirdPartyManagement from "./Masters/Suppliers/ThirdPartyManagement";
import AddSupplier from "./Masters/Suppliers/AddSupplier";


const InventoryDashboard = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* RIGHT CONTENT */}
      <Box sx={{ flexGrow: 1 }}>
        <Routes>
          {/* 👇 YAHI SE UNIT PAGE OPEN HOTA HAI */}
          
          <Route index element={<Dashboard />} />
          <Route path="masters/units" element={<UnitManagement />} />
          <Route path="masters/rawmaterials" element={<RawMaterials />} />
          <Route path="managestock/availablestock" element={<AvailableStock />} />
          <Route path="purchase/stockpurchase" element={<StockPurchase />} />
          <Route path="purchase/purchaseorderlist" element={<PurhaseOrderList />} />
          <Route path="masters/suppliers/thirdparty" element={<ThirdPartyManagement />} />
          <Route path="masters/suppliers/addsupplier" element={<AddSupplier />} />

        </Routes>
      </Box>
    </Box>
  );
};

export default InventoryDashboard;
