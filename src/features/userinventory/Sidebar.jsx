  import {
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Collapse,
    Box,
    Typography
  } from "@mui/material";
  import { ExpandLess, ExpandMore } from "@mui/icons-material";
  import { useState } from "react";
  import { NavLink } from "react-router-dom";

  const Sidebar = () => {
    const [open, setOpen] = useState({
      manageStock: false,
      consumption: false,
      production: false,
      reports: false,
      masters: false
    });

    const toggle = (key) =>
      setOpen({ ...open, [key]: !open[key] });

    return (
      <Drawer
        variant="permanent"
        sx={{
          width: 260,
          "& .MuiDrawer-paper": {
            width: 260,
            bgcolor: "#0F172A", // dark navy
            color: "#E5E7EB",
            borderRight: "1px solid #1E293B"
          }
        }}
      >
        {/* LOGO / TITLE */}
        <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #1E293B" }}>
          <Typography fontWeight={800} fontSize={18} color="white">
            Inventory Dashboard
          </Typography>
        </Box>

        <List sx={{ px: 1, mt: 1 }}>

          {/* COMMON ITEM STYLE */}
          {[
            { label: "Dashboard", to: "/" },
            { label: "Purchase", to: "/purchase" }
          ].map((item) => (
            <ListItemButton
              key={item.label}
              component={NavLink}
              to={item.to}
              sx={menuItemStyle}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}

          {/* MANAGE STOCK */}
          <ListItemButton onClick={() => toggle("manageStock")} sx={menuItemStyle}>
            <ListItemText primary="Manage Stock" />
            {open.manageStock ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open.manageStock}>
            <List disablePadding>
              <SubItem to="/inventory/managestock/availablestock" label="Available Stock" />
              <SubItem to="/inventory/managestock/closingstock" label="Closing Stock" />
            </List>
          </Collapse>

          {/* CONSUMPTION */}
          <ListItemButton onClick={() => toggle("consumption")} sx={menuItemStyle}>
            <ListItemText primary="Consumption" />
            {open.consumption ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open.consumption}>
            <SubItem to="/wastage" label="Wastage" />
          </Collapse>

          {/* PRODUCTION */}
          <ListItemButton onClick={() => toggle("production")} sx={menuItemStyle}>
            <ListItemText primary="Production" />
            {open.production ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open.production}>
            <List disablePadding>
              <SubItem to="/production/master" label="Production Master" />
              <SubItem to="/production/execution" label="Production Execution" />
              <SubItem to="/production/barcode" label="Barcode Generation" />
            </List>
          </Collapse>

          {/* REPORTS */}
          <ListItemButton onClick={() => toggle("reports")} sx={menuItemStyle}>
            <ListItemText primary="Reports" />
            {open.reports ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open.reports}>
            <List disablePadding>
              <SubItem to="/reports/current-stock" label="Current Stock" />
              <SubItem to="/reports/summary" label="Stock Summary" />
            </List>
          </Collapse>

          {/* MASTERS */}
          <ListItemButton onClick={() => toggle("masters")} sx={menuItemStyle}>
            <ListItemText primary="Masters" />
            {open.masters ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open.masters}>
            <List disablePadding>
              {/* <SubItem to="/masters/rawmaterials" label="Raw Materials" /> */}
              <SubItem to="/inventory/masters/rawmaterials" label="Raw Materials" />

              <SubItem to="/masters/item-recipes" label="Item Recipes" />
              <SubItem to="/masters/suppliers" label="Suppliers" />
              {/* <SubItem to="/masters/units" label="Units" /> */}
              <SubItem to="/inventory/masters/units" label="Units" />

            </List>
          </Collapse>

          <ListItemButton component={NavLink} to="/settings" sx={menuItemStyle}>
            <ListItemText primary="Settings" />
          </ListItemButton>

        </List>
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
      color: "#fff"
    },
    "&:hover": {
      bgcolor: "#1E293B"
    }
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
          bgcolor: "#1E40AF"
        },
        "&:hover": {
          bgcolor: "#1E293B"
        }
      }}
    >
      <ListItemText primary={label} />
    </ListItemButton>
  );

  export default Sidebar;

