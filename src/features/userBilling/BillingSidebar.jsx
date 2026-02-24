// import {
//   Drawer,
//   List,
//   ListItemButton,
//   ListItemText,
//   Box,
//   Typography,
//   Button,
// } from "@mui/material";
// import Logout from "@mui/icons-material/Logout";
// import ReceiptLong from "@mui/icons-material/ReceiptLong";
// import Payments from "@mui/icons-material/Payments";
// import Assessment from "@mui/icons-material/Assessment";
// import Dashboard from "@mui/icons-material/Dashboard";

// import { NavLink, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { logout } from "../../store/slices/authSlice";

// export const BillingSidebar = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     dispatch(logout());
//     if (window.electronAPI) {
//       window.electronAPI.logout();
//     }
//     navigate("/login");
//   };

//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
//         width: 260,
//         "& .MuiDrawer-paper": {
//           width: 260,
//           bgcolor: "#0F172A", // SAME AS INVENTORY
//           color: "#E5E7EB",
//           borderRight: "1px solid #1E293B",
//           display: "flex",
//           flexDirection: "column",
//         },
//       }}
//     >
//       {/* TITLE */}
//       <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #1E293B" }}>
//         <Typography fontWeight={800} fontSize={18} color="white">
//           Billing Dashboard
//         </Typography>
//       </Box>

//       {/* MENU */}
//       <List sx={{ px: 1, mt: 1, flexGrow: 1 }}>
//         {/* DASHBOARD */}
//         <ListItemButton
//           component={NavLink}
//           to="/billing"
//           end
//           sx={menuItemStyle}
//         >
//           <Dashboard sx={{ mr: 1 }} />
//           <ListItemText primary="Dashboard" />
//         </ListItemButton>

//         {/* INVOICES */}
//         <ListItemButton
//           component={NavLink}
//           to="/billing/invoices"
//           sx={menuItemStyle}
//         >
//           <ReceiptLong sx={{ mr: 1 }} />
//           <ListItemText primary="Invoices" />
//         </ListItemButton>

//         {/* PAYMENTS */}
//         <ListItemButton
//           component={NavLink}
//           to="/billing/payments"
//           sx={menuItemStyle}
//         >
//           <Payments sx={{ mr: 1 }} />
//           <ListItemText primary="Payments" />
//         </ListItemButton>

//         {/* REPORTS */}
//         <ListItemButton
//           component={NavLink}
//           to="/billing/reports"
//           sx={menuItemStyle}
//         >
//           <Assessment sx={{ mr: 1 }} />
//           <ListItemText primary="Reports" />
//         </ListItemButton>
//       </List>

//       {/* LOGOUT (SAME AS INVENTORY) */}
//       <Box sx={{ px: 2, pb: 2 }}>
//         <Button
//           startIcon={<Logout />}
//           onClick={handleLogout}
//           fullWidth
//           size="medium"
//           sx={{
//             textTransform: "none",
//             color: "#94A3B8",
//             justifyContent: "flex-start",
//             px: 1,
//             mt: 1,
//             fontWeight: 600,
//             "&:hover": {
//               bgcolor: "transparent",
//               color: "#FF5722",
//               "& .MuiSvgIcon-root": { color: "#FF5722" },
//             },
//           }}
//         >
//           Sign Out
//         </Button>
//       </Box>
//     </Drawer>
//   );
// };

// const menuItemStyle = {
//   borderRadius: 2,
//   mx: 1,
//   my: 0.5,
//   color: "#CBD5E1",
//   "&.active": {
//     bgcolor: "#1E40AF",
//     color: "#fff",
//   },
//   "&:hover": {
//     bgcolor: "#1E293B",
//   },
// };




import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
  Button,
  Divider,
} from "@mui/material";

import Logout from "@mui/icons-material/Logout";
import ReceiptLong from "@mui/icons-material/ReceiptLong";
import PaymentsIcon from "@mui/icons-material/Payments";
import Assessment from "@mui/icons-material/Assessment";
import Dashboard from "@mui/icons-material/Dashboard";
import AddShoppingCart from "@mui/icons-material/AddShoppingCart";
import People from "@mui/icons-material/People";
import AccountBalanceWallet from "@mui/icons-material/AccountBalanceWallet";
import Receipt from "@mui/icons-material/Receipt";
import Settings from "@mui/icons-material/Settings";

import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";

export const BillingSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    if (window.electronAPI) {
      window.electronAPI.logout();
    }
    navigate("/login");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 260,
          bgcolor: "#0F172A",
          color: "#E5E7EB",
          borderRight: "1px solid #1E293B",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        },
      }}
    >
      {/* TITLE */}
      <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #1E293B" }}>
        <Typography fontWeight={800} fontSize={18} color="white">
          💳 Billing Dashboard
        </Typography>
        <Typography fontSize={12} color="#94A3B8">
          Billing Management System
        </Typography>
      </Box>

      {/* MENU */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", mt: 1 }}>
        <List sx={{ px: 1 }}>
          {/* DASHBOARD */}
          <ListItemButton
            component={NavLink}
            to="/billing"
            end
            sx={menuItemStyle}
          >
            <Dashboard sx={{ mr: 1.5 }} />
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          {/* CREATE INVOICE */}
          <ListItemButton
            component={NavLink}
            to="/billing/create-invoice"
            sx={menuItemStyle}
          >
            <AddShoppingCart sx={{ mr: 1.5 }} />
            <ListItemText primary="Create Invoice" />
          </ListItemButton>

          {/* INVOICES */}
          <ListItemButton
            component={NavLink}
            to="/billing/invoices"
            sx={menuItemStyle}
          >
            <ReceiptLong sx={{ mr: 1.5 }} />
            <ListItemText primary="Invoices" />
          </ListItemButton>

          {/* PAYMENTS */}
          <ListItemButton
            component={NavLink}
            to="/billing/payments"
            sx={menuItemStyle}
          >
            <PaymentsIcon sx={{ mr: 1.5 }} />
            <ListItemText primary="Payments" />
          </ListItemButton>

          {/* TRANSACTIONS */}
          <ListItemButton
            component={NavLink}
            to="/billing/transactions"
            sx={menuItemStyle}
          >
            <AccountBalanceWallet sx={{ mr: 1.5 }} />
            <ListItemText primary="Transactions" />
          </ListItemButton>

          {/* CUSTOMERS */}
          <ListItemButton
            component={NavLink}
            to="/billing/customers"
            sx={menuItemStyle}
          >
            <People sx={{ mr: 1.5 }} />
            <ListItemText primary="Customers" />
          </ListItemButton>

          {/* EXPENSES */}
          <ListItemButton
            component={NavLink}
            to="/billing/expenses"
            sx={menuItemStyle}
          >
            <Receipt sx={{ mr: 1.5 }} />
            <ListItemText primary="Expenses" />
          </ListItemButton>

          <Divider sx={{ borderColor: "#1E293B", my: 1 }} />

          {/* REPORTS */}
          <ListItemButton
            component={NavLink}
            to="/billing/reports"
            sx={menuItemStyle}
          >
            <Assessment sx={{ mr: 1.5 }} />
            <ListItemText primary="Reports & Analytics" />
          </ListItemButton>

          {/* SETTINGS */}
          <ListItemButton
            component={NavLink}
            to="/billing/settings"
            sx={menuItemStyle}
          >
            <Settings sx={{ mr: 1.5 }} />
            <ListItemText primary="Settings" />
          </ListItemButton>
        </List>
      </Box>

      {/* LOGOUT */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Button
          startIcon={<Logout />}
          onClick={handleLogout}
          fullWidth
          size="medium"
          sx={{
            textTransform: "none",
            color: "#94A3B8",
            justifyContent: "flex-start",
            px: 1,
            mt: 1,
            fontWeight: 600,
            borderRadius: 2,
            "&:hover": {
              bgcolor: "#1E293B",
              color: "#FF5722",
              "& .MuiSvgIcon-root": { color: "#FF5722" },
            },
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Drawer>
  );
};

const menuItemStyle = {
  borderRadius: 2,
  mx: 1,
  my: 0.5,
  py: 1.1,
  color: "#CBD5E1",
  "&.active": {
    bgcolor: "#1E40AF",
    color: "#fff",
    fontWeight: 700,
  },
  "&:hover": {
    bgcolor: "#1E293B",
  },
};