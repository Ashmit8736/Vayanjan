import { Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import UnitManagement from "./Masters/UnitManagement";
import RawMaterials from "./Masters/RawMaterials";
import AvailableStock from "./ManageStock/AvailableStock";

const InventoryDashboard = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* RIGHT CONTENT */}
      <Box sx={{ flexGrow: 1 }}>
        <Routes>
          {/* 👇 YAHI SE UNIT PAGE OPEN HOTA HAI */}
          <Route path="masters/units" element={<UnitManagement />} />
          <Route path="masters/rawmaterials" element={<RawMaterials />} />
          <Route path="managestock/availablestock" element={<AvailableStock />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default InventoryDashboard;
