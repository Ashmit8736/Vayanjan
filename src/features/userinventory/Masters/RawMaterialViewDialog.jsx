import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Typography,
  Grid
} from "@mui/material";
import { Close } from "@mui/icons-material";

const RawMaterialViewDialog = ({ open, onClose, item }) => {
  if (!item) return null;

  // Key-value pair styling
  const cellStyle = {
    p: 1.5,
    borderBottom: "1px solid #e0e0e0",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    minHeight: "45px"
  };

  const labelStyle = {
    fontWeight: 600,
    color: "#333333",
    fontSize: "0.875rem",
    mr: 1
  };

  const valueStyle = {
    color: "#555555",
    fontSize: "0.875rem"
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* Title Header */}
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 700,
          borderBottom: "1px solid #e0e0e0",
          fontSize: "1.1rem"
        }}
      >
        Raw Material Details
        <IconButton onClick={onClose} size="small" aria-label="close">
          <Close />
        </IconButton>
      </DialogTitle>

      {/* Content Area */}
      <DialogContent sx={{ p: 3, bgcolor: "#fff" }}>
        <Box
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            overflow: "hidden"
          }}
        >
          {/* Row 1: Name (Full Width) */}
          <Box sx={{ ...cellStyle, borderRight: "none", width: "100%" }}>
            <Typography sx={labelStyle}>Name:</Typography>
            <Typography sx={valueStyle}>{item.name}</Typography>
          </Box>

          <Grid container>
            {/* Row 2 */}
            <Grid item xs={6} sx={{ ...cellStyle, borderRight: "1px solid #e0e0e0" }}>
              <Typography sx={labelStyle}>Barcode/Short Code:</Typography>
              <Typography sx={valueStyle}>{item.barcode || "-"}</Typography>
            </Grid>
            <Grid item xs={6} sx={cellStyle}>
              <Typography sx={labelStyle}>Reconciliation Price:</Typography>
              <Typography sx={valueStyle}>{item.reconciliation_price ?? 0}</Typography>
            </Grid>

            {/* Row 3 */}
            <Grid item xs={6} sx={{ ...cellStyle, borderRight: "1px solid #e0e0e0" }}>
              <Typography sx={labelStyle}>Purchase Price:</Typography>
              <Typography sx={valueStyle}>{item.purchase_price ?? 0}</Typography>
            </Grid>
            <Grid item xs={6} sx={cellStyle}>
              <Typography sx={labelStyle}>Transfer Price:</Typography>
              <Typography sx={valueStyle}>{item.transfer_price ?? 0}</Typography>
            </Grid>

            {/* Row 4 */}
            <Grid item xs={6} sx={{ ...cellStyle, borderRight: "1px solid #e0e0e0" }}>
              <Typography sx={labelStyle}>Tax Type:</Typography>
              <Typography sx={valueStyle}>{item.tax_type || "GST"}</Typography>
            </Grid>
            <Grid item xs={6} sx={cellStyle}>
              <Typography sx={labelStyle}>Tax(%):</Typography>
              <Typography sx={valueStyle}>{item.tax_percentage ?? 0}</Typography>
            </Grid>

            {/* Row 5 */}
            <Grid item xs={6} sx={{ ...cellStyle, borderRight: "1px solid #e0e0e0" }}>
              <Typography sx={labelStyle}>Purchase Unit:</Typography>
              <Typography sx={valueStyle}>{item.purchase_unit || "-"}</Typography>
            </Grid>
            <Grid item xs={6} sx={cellStyle}>
              <Typography sx={labelStyle}>Closing stock calculated on:</Typography>
              <Typography sx={valueStyle}>
                {item.stock_update_frequency ? item.stock_update_frequency.charAt(0) + item.stock_update_frequency.slice(1).toLowerCase() : "Daily"}
              </Typography>
            </Grid>

            {/* Row 6 */}
            <Grid item xs={6} sx={{ ...cellStyle, borderRight: "1px solid #e0e0e0" }}>
              <Typography sx={labelStyle}>Consumption Unit:</Typography>
              <Typography sx={valueStyle}>{item.consume_unit || "-"}</Typography>
            </Grid>
            <Grid item xs={6} sx={cellStyle}>
              <Typography sx={labelStyle}>Conversion Qty.:</Typography>
              <Typography sx={valueStyle}>{item.conversion_factor ?? 1}</Typography>
            </Grid>

            {/* Row 7 */}
            <Grid item xs={6} sx={{ ...cellStyle, borderRight: "1px solid #e0e0e0" }}>
              <Typography sx={labelStyle}>HSN Code:</Typography>
              <Typography sx={valueStyle}>{item.hsn_code || "-"}</Typography>
            </Grid>
            <Grid item xs={6} sx={cellStyle}>
              <Typography sx={labelStyle}>Normal loss (%):</Typography>
              <Typography sx={valueStyle}>{item.normal_loss ?? 0}</Typography>
            </Grid>

            {/* Row 8 */}
            <Grid item xs={6} sx={{ ...cellStyle, borderRight: "1px solid #e0e0e0" }}>
              <Typography sx={labelStyle}>Category:</Typography>
              <Typography sx={valueStyle}>{item.category || "-"}</Typography>
            </Grid>
            <Grid item xs={6} sx={cellStyle}>
              <Typography sx={labelStyle}>Favorite:</Typography>
              <Typography sx={valueStyle}>{item.favorite ? "Yes" : "No"}</Typography>
            </Grid>

            {/* Row 9 */}
            <Grid item xs={6} sx={{ ...cellStyle, borderRight: "1px solid #e0e0e0" }}>
              <Typography sx={labelStyle}>Minimum Stock Level:</Typography>
              <Typography sx={valueStyle}>{item.minimum_stock_level ?? 0}</Typography>
            </Grid>
            <Grid item xs={6} sx={cellStyle}>
              <Typography sx={labelStyle}>Minimum Stock Level Unit:</Typography>
              <Typography sx={valueStyle}>{item.minimum_stock_unit || item.consume_unit || "-"}</Typography>
            </Grid>

            {/* Row 10 */}
            <Grid item xs={6} sx={{ ...cellStyle, borderRight: "1px solid #e0e0e0" }}>
              <Typography sx={labelStyle}>At Par Stock Level:</Typography>
              <Typography sx={valueStyle}>{item.reorder_stock_level ?? 0}</Typography>
            </Grid>
            <Grid item xs={6} sx={cellStyle}>
              <Typography sx={labelStyle}>At Par Stock Level Unit:</Typography>
              <Typography sx={valueStyle}>{item.reorder_stock_unit || item.consume_unit || "-"}</Typography>
            </Grid>

            {/* Row 11 */}
            <Grid item xs={6} sx={{ ...cellStyle, borderRight: "1px solid #e0e0e0" }}>
              <Typography sx={labelStyle}>Maximum Stock Level:</Typography>
              <Typography sx={valueStyle}>{item.maximum_stock_level || "-"}</Typography>
            </Grid>
            <Grid item xs={6} sx={cellStyle}>
              {/* Empty cell to balance layout */}
            </Grid>

            {/* Row 12 */}
            <Grid item xs={6} sx={{ ...cellStyle, borderRight: "1px solid #e0e0e0" }}>
              <Typography sx={labelStyle}>Exclusive to this restaurant:</Typography>
              <Typography sx={valueStyle}>{item.exclusive_to_restaurant ? "Yes" : "No"}</Typography>
            </Grid>
            <Grid item xs={6} sx={cellStyle}>
              <Typography sx={labelStyle}>Is Expiry:</Typography>
              <Typography sx={valueStyle}>{item.expiry_days > 0 ? "Yes" : "No"}</Typography>
            </Grid>

            {/* Row 13 */}
            <Grid item xs={6} sx={{ ...cellStyle, borderRight: "1px solid #e0e0e0" }}>
              <Typography sx={labelStyle}>Description:</Typography>
              <Typography sx={valueStyle}>{item.description || "-"}</Typography>
            </Grid>
            <Grid item xs={6} sx={cellStyle}>
              {/* Empty cell */}
            </Grid>

            {/* Row 14 */}
            <Grid item xs={6} sx={{ ...cellStyle, borderRight: "1px solid #e0e0e0" }}>
              <Typography sx={labelStyle}>Quantity (in gm/ml):</Typography>
              <Typography sx={valueStyle}>{item.quantity ?? 0}</Typography>
            </Grid>
            <Grid item xs={6} sx={cellStyle}>
              <Typography sx={labelStyle}>GTIN:</Typography>
              <Typography sx={valueStyle}>{item.gtin || "-"}</Typography>
            </Grid>

            {/* Row 15 */}
            <Grid item xs={6} sx={{ ...cellStyle, borderRight: "1px solid #e0e0e0", borderBottom: "none" }}>
              <Typography sx={labelStyle}>Sub Category:</Typography>
              <Typography sx={valueStyle}>{item.sub_category || "-"}</Typography>
            </Grid>
            <Grid item xs={6} sx={{ ...cellStyle, borderBottom: "none" }}>
              <Typography sx={labelStyle}>Rank:</Typography>
              <Typography sx={valueStyle}>{item.rank || "-"}</Typography>
            </Grid>

            {/* Row 16 */}
            <Grid item xs={6} sx={{ ...cellStyle, borderRight: "1px solid #e0e0e0", borderBottom: "none" }}>
              <Typography sx={labelStyle}>Brand:</Typography>
              <Typography sx={valueStyle}>{item.brand || "-"}</Typography>
            </Grid>
            <Grid item xs={6} sx={{ ...cellStyle, borderBottom: "none" }}>
              {/* Empty cell */}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RawMaterialViewDialog;
