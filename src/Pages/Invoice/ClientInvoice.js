import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TablePagination,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
    TextField,
    Typography,
    IconButton
} from "@mui/material";
import { Download as DownloadIcon, Close as CloseIcon } from "@mui/icons-material";
import axios from "axios";
import { getInvoiceData, getInvoice } from "../../Services/apIServices";
import { toast } from "react-toastify";

export function ClientInvoice() {
    const [tutors, setTutors] = useState([]);
    const [originalTutors, setOriginalTutors] = useState([]);
    const [teachers, setTeacher] = useState([]);
    const [teacherFullname, setTeacherFullname] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedTutor, setSelectedTutor] = useState(null);
    const [bookingDetails, setBookingDetails] = useState([]);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchTutors = async () => {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_BASE_URL}/get_users`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const filteredTutors = response.data.data.filter(
                    (tutor) => tutor.user_type === "client"
                );
                const filterteacher = response.data.data.filter(
                    (tutor) => tutor.user_type === "teacher"
                );
                setTeacher(response.data.data);
                setOriginalTutors(filteredTutors);
                setTutors(filteredTutors);
            } catch (error) {
                console.error("Error fetching tutors:", error);
            }
        };
        fetchTutors();
    }, [token]);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        const filtered = originalTutors.filter((tutor) =>
            tutor.first_name?.toLowerCase().includes(event.target.value.toLowerCase()) ||
            tutor.last_name?.toLowerCase().includes(event.target.value.toLowerCase()) ||
            tutor.email?.toLowerCase().includes(event.target.value.toLowerCase()) ||
            tutor.mobile?.includes(event.target.value)
        );
        setTutors(filtered);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleClickOpen = async (tutor) => {
        setSelectedTutor(tutor);
        setOpen(true);
        try {
            const response = await getInvoiceData(tutor.email || tutor.mobile);
            if (response.data && response.data.rows) {
                setBookingDetails(response.data.rows);
            }
        } catch (error) {
            console.error("Error fetching invoice data:", error);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedTutor(null);
        setBookingDetails([]);
    };

    const downloadPDF = async (bookingId) => {
        try {
            const response = await getInvoice(bookingId);
            if (response.success && response.data) {
                const link = document.createElement("a");
                link.href = response.data;
                link.download = `Invoice_${bookingId}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success("Invoice downloaded successfully!");
            }
        } catch (error) {
            toast.error("Failed to download invoice.");
            console.error(`Error fetching invoice for Booking ID: ${bookingId}`, error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <header className="bg-[#2C8E71] text-white p-4 shadow-md rounded-lg">
                <h1 className="text-2xl font-bold">Client Invoice Generate</h1>
            </header>

            <div className="mt-3 mb-0">
                <Typography variant="h6" fontWeight="bold">
                    Client List
                </Typography>
            </div>

            <Box sx={{ width: "30%", display: "flex", justifyContent: "start", mt: 2 }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search by name, email, or mobile number"
                    sx={{
                        width: "100%",
                        maxWidth: "600px",
                        borderRadius: "50px",
                        boxShadow: "0 3px 5px rgba(0, 0, 0, 0.1)",
                        "& .MuiOutlinedInput-root": { borderRadius: "50px" },
                    }}
                />
            </Box>

            <TableContainer component={Paper} elevation={3} className="mt-2">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>No.</strong></TableCell>
                            <TableCell><strong>First Name</strong></TableCell>
                            <TableCell><strong>Last Name</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Mobile</strong></TableCell>
                            <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tutors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((tutor, index) => (
                            <TableRow key={tutor.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{tutor.first_name}</TableCell>
                                <TableCell>{tutor.last_name}</TableCell>
                                <TableCell>{tutor.email}</TableCell>
                                <TableCell>{tutor.mobile}</TableCell>
                                <TableCell>
                                    <Button
                                        sx={{ backgroundColor: "#2C8E71", color: "white", '&:hover': { backgroundColor: "#e0e0e0" } }}
                                        onClick={() => handleClickOpen(tutor)}
                                    >
                                        Click
                                    </Button>

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={tutors.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {/* Popup for Booking Details */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', backgroundColor: '#2C8E71', color: 'white', padding: 2 }}>
                    Booking Details for {selectedTutor?.first_name} {selectedTutor?.last_name}
                </DialogTitle>
                <DialogContent sx={{ padding: 3 }}>
                    {bookingDetails.length > 0 ? (
                        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                        <TableCell><strong>Booking ID</strong></TableCell>
                                        <TableCell><strong>Mobile</strong></TableCell>
                                        <TableCell><strong>Teacher</strong></TableCell>
                                        <TableCell><strong>Location</strong></TableCell>
                                        <TableCell><strong>Sessions</strong></TableCell>
                                        <TableCell><strong>Amount</strong></TableCell>
                                        <TableCell><strong>Invoice</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {bookingDetails.map((row, index) => (
                                        <TableRow key={index} sx={{ '&:nth-of-type(even)': { backgroundColor: '#fafafa' } }}>
                                            <TableCell>{row.booking_id}</TableCell>
                                            <TableCell>{row.mobile}</TableCell>
                                            <TableCell>
                                                {(() => {
                                                    const teacher = teachers?.find((t) => Number(t.id) === Number(row.teacher_id));
                                                    return teacher ? `${teacher.first_name} ${teacher.last_name}` : "N/A";
                                                })()}
                                            </TableCell>
                                            <TableCell>{row.tutoring_location}</TableCell>
                                            <TableCell>{row.no_sesssion} ({row.session_duration} min)</TableCell>
                                            <TableCell>${row.total_amount}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => getInvoice(row.booking_id)}
                                                >
                                                    Download
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography variant="h6" align="center" sx={{ color: 'gray', padding: 2 }}>
                            No booking details available.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', padding: 2 }}>
                    <Button onClick={handleClose} variant="outlined" color="secondary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
