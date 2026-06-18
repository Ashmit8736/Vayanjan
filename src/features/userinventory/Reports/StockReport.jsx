import { useEffect, useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Divider,
    Button,
} from "@mui/material";
import { useParams } from "react-router-dom";

const StockReport = () => {
    const { poNumber } = useParams();


    const [header, setHeader] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // Pagination State
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {

        fetch(
            `http://localhost:5000/api/stockPurchaseItems/stock-report/${poNumber}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            }
        )
            .then(async (res) => {
                const data = await res.json();

                setHeader(data.header);
                setItems(data.items || []);
            })
            .catch((err) => {
                console.error("Stock report error:", err);
            })
            .finally(() => setLoading(false));
    }, [poNumber]);


    if (loading) return <Typography>Loading...</Typography>;
    if (!header) return null;


    const calculateTotal = (row) => {
        const qty = Number(row.qty || 0);
        const price = Number(row.price || 0);
        const cgst = Number(row.cgst || 0);
        const sgst = Number(row.sgst || 0);
        const igst = Number(row.igst || 0);
        const discount = Number(row.discount || 0);

        const base = qty * price;
        const gstPercent = cgst + sgst + igst;
        const gstAmount = (base * gstPercent) / 100;

        return base + gstAmount - discount;
    };

    const grandTotal = items.reduce(
        (sum, row) => sum + calculateTotal(row),
        0
    );

    const safeItems = Array.isArray(items) ? items : [];
    const totalPages = Math.ceil(safeItems.length / itemsPerPage);
    const paginatedItems = safeItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <Box>
            {/* ===== TITLE ===== */}
            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                    Stock Report
                </Typography>
            </Paper>

            {/* ===== SUPPLIER DETAILS ===== */}
            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography fontWeight={700} mb={1}>
                    Supplier Details
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box display="flex" justifyContent="space-between">
                    <Box>
                        <Typography>
                            <b>PO Number:</b> {header.po_number}
                        </Typography>
                        <Typography>
                            <b>Supplier Name:</b> {header.supplier_name}
                        </Typography>
                    </Box>

                    <Box>

                        <Typography>
                            <b>Invoice Date:</b>{" "}
                            {new Date(header.invoice_date).toLocaleDateString("en-GB")}
                        </Typography>
                        <Typography>
                            <b>Invoice Number:</b> {header.invoice_number}
                        </Typography>



                    </Box>
                </Box>
            </Paper>

            {/* ===== ITEMS ===== */}
            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography fontWeight={700} mb={1}>
                    Purchase Items
                </Typography>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Raw Material</TableCell>
                            <TableCell>Qty</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>CGST %</TableCell>
                            <TableCell>SGST %</TableCell>
                            <TableCell>IGST %</TableCell>
                            <TableCell>Discount</TableCell>
                            <TableCell>Total</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginatedItems.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell>{row.rawMaterial}</TableCell>
                                <TableCell>{row.qty} {row.unit}</TableCell>
                                <TableCell>{row.price}</TableCell>
                                <TableCell>{row.cgst}</TableCell>
                                <TableCell>{row.sgst}</TableCell>
                                <TableCell>{row.igst}</TableCell>
                                <TableCell>{row.discount}</TableCell>
                                <TableCell>
                                    ₹ {calculateTotal(row).toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* ================= PAGINATION ================= */}
                {totalPages > 0 && (
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} px={1}>
                        <Typography variant="body2" color="text.secondary">
                            Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, safeItems.length)} of {safeItems.length} records
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Button
                                size="small"
                                variant="outlined"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                sx={{ textTransform: "none", minWidth: "60px", color: "#64748B", borderColor: "#CBD5E1" }}
                            >
                                Prev
                            </Button>
                            <Box
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    bgcolor: "#1976d2",
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: "bold",
                                    fontSize: "14px",
                                }}
                            >
                                {page}
                            </Box>
                            <Button
                                size="small"
                                variant="outlined"
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                                sx={{ textTransform: "none", minWidth: "60px", color: "#64748B", borderColor: "#CBD5E1" }}
                            >
                                Next
                            </Button>
                        </Box>
                    </Box>
                )}
            </Paper>

            {/* ===== GRAND TOTAL ===== */}
            <Paper sx={{ p: 2 }}>
                <Box display="flex" justifyContent="space-between">
                    <Typography fontWeight={700}>Grand Total</Typography>
                    <Typography fontWeight={700} fontSize={18}>
                        ₹ {grandTotal.toFixed(2)}
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default StockReport;