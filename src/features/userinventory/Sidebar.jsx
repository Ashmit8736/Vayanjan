import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import Logout from "@mui/icons-material/Logout";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";

const Sidebar = () => {
  const [open, setOpen] = useState({
    manageStock: false,
    consumption: false,
    production: false,
    reports: false,
    masters: false,
    purchase: false,
    suppliers: false,
    itemRecipe: false,  
  });

  const toggle = (key) => setOpen({ ...open, [key]: !open[key] });

  // ===== LOGOUT (SAME AS OTHER DASHBOARD) =====
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    if (window.electronAPI) {
      window.electronAPI.logout();
    }
    navigate("/login");
  };
  // ===========================================

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        "& .MuiDrawer-paper": {
          width: 260,
          bgcolor: "#0F172A",
          color: "#E5E7EB",
          borderRight: "1px solid #1E293B",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* LOGO / TITLE */}
      <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #1E293B" }}>
        <Typography fontWeight={800} fontSize={18} color="white">
          Inventory Dashboard
        </Typography>
      </Box>

      <List sx={{ px: 1, mt: 1, flexGrow: 1 }}>
       
        <ListItemButton component={NavLink} to="/" sx={menuItemStyle}>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        {/* PURCHASE */}
        <ListItemButton onClick={() => toggle("purchase")} sx={menuItemStyle}>
          <ListItemText primary="Purchase" />
          {open.purchase ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={open.purchase}>
          <List disablePadding>
            <SubItem
              to="/inventory/purchase/stockpurchase"
              label="Stock Purchase"
            />
            <SubItem to="/inventory/purchase/purchaseorderlist" label="Purchase Order List" />
          </List>
        </Collapse>

        {/* MANAGE STOCK */}
        <ListItemButton
          onClick={() => toggle("manageStock")}
          sx={menuItemStyle}
        >
          <ListItemText primary="Manage Stock" />
          {open.manageStock ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open.manageStock}>
          <List disablePadding>
            <SubItem
              to="/inventory/managestock/availablestock"
              label="Available Stock"
            />
            <SubItem
              to="/inventory/managestock/closingstock"
              label="Closing Stock"
            />
          </List>
        </Collapse>

        {/* CONSUMPTION */}
        <ListItemButton
          onClick={() => toggle("consumption")}
          sx={menuItemStyle}
        >
          <ListItemText primary="Consumption" />
          {open.consumption ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open.consumption}>
          <SubItem to="/inventory/wastage" label="Wastage" />
        </Collapse>

        {/* PRODUCTION */}
        <ListItemButton onClick={() => toggle("production")} sx={menuItemStyle}>
          <ListItemText primary="Production" />
          {open.production ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open.production}>
          <List disablePadding>
            <SubItem to="/inventory/production" label="Production Master" />
            <SubItem to="/inventory/production/execution" label="Production Execution" />
            <SubItem to="/inventory/production/barcode-generation" label="Barcode Generation" />
          </List>
        </Collapse>

        {/* REPORTS */}
        <ListItemButton onClick={() => toggle("reports")} sx={menuItemStyle}>
          <ListItemText primary="Reports" />
          {open.reports ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open.reports}>
          <List disablePadding>
            <SubItem to="/inventory/reports/current-stock" label="Current Stock" />
            <SubItem to="/inventory/reports/stock" label="Stock List" />
            <SubItem to="/inventory/reports/summary" label="Stock Summary" />
          </List>
        </Collapse>

        {/* MASTERS */}
        <ListItemButton onClick={() => toggle("masters")} sx={menuItemStyle}>
          <ListItemText primary="Masters" />
          {open.masters ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open.masters}>
          <List disablePadding>
            <SubItem
              to="/inventory/masters/rawmaterials"
              label="Raw Materials"
            />
            {/* <SubItem to="/inventory/masters/itemrecipe" label="Item Recipes" /> */}
            
            <ListItemButton
              onClick={() => toggle("itemRecipe")}
              sx={{
                pl: 5,
                py: 0.75,
                color: "#94A3B8",
                "&:hover": { bgcolor: "#1E293B" },
              }}
            >
              <ListItemText primary="Item recipe" />
              {open.itemRecipe ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={open.itemRecipe}>
              <List disablePadding>
                <SubItem
                  to="/inventory/itemrecipe/itemcreation"
                  label="Item Creation"
                />
                <SubItem
                  to="/inventory/itemrecipe/recipecreation"
                  label="Recipe Creation"
                />
              </List>
            </Collapse>

            {/* <SubItem to="/masters/suppliers" label="Suppliers" /> */}
            {/* SUPPLIERS (NESTED) */}
            <ListItemButton
              onClick={() => toggle("suppliers")}
              sx={{
                pl: 5,
                py: 0.75,
                color: "#94A3B8",
                "&:hover": { bgcolor: "#1E293B" },
              }}
            >
              <ListItemText primary="Suppliers" />
              {open.suppliers ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={open.suppliers}>
              <List disablePadding>
                <SubItem
                  to="/inventory/masters/suppliers/thirdparty"
                  label="Third Party Management"
                />
                <SubItem
                  to="/inventory/masters/suppliers/purchase-bill-payments"
                  label="Purchase Bill Payments"
                />
              </List>
            </Collapse>

            <SubItem to="/inventory/masters/units" label="Units" />
          </List>
        </Collapse>

        <ListItemButton component={NavLink} to="/settings" sx={menuItemStyle}>
          <ListItemText primary="Settings" />
        </ListItemButton>
      </List>

      {/* ===== SIGN OUT (ONLY ADDITION) ===== */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Button
          startIcon={<Logout />}
          onClick={handleLogout}
          fullWidth
          size="medium"
          sx={{
            textTransform: "none",
            color: "#546E7A",
            justifyContent: "flex-start",
            px: 1,
            mt: 1,
            fontWeight: 600,
            "&:hover": {
              bgcolor: "transparent",
              color: "#FF5722",
              "& .MuiSvgIcon-root": { color: "#FF5722" },
            },
          }}
        >
          Sign Out
        </Button>
      </Box>
      {/* =================================== */}
    </Drawer>
  );
};

/* ===== STYLES ===== */

const menuItemStyle = {
  borderRadius: 2,
  mx: 1,
  my: 0.5,
  color: "#CBD5E1",
  "&.active": {
    bgcolor: "#1E40AF",
    color: "#fff",
  },
  "&:hover": {
    bgcolor: "#1E293B",
  },
};

const SubItem = ({ to, label }) => (
  <ListItemButton
    component={NavLink}
    to={to}
    sx={{
      pl: 5,
      py: 0.75,
      color: "#94A3B8",
      "&.active": {
        color: "#fff",
        // bgcolor: "#1E40AF",
      },
      "&:hover": {
        bgcolor: "#1E293B",
      },
    }}
  >
    <ListItemText primary={label} />
  </ListItemButton>
);

export default Sidebar;
