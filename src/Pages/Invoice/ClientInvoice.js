import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Box, TextField } from '@mui/material';
import axios from 'axios';
import { getClientById, getInvoice, getInvoiceData, getUserLoginDetails } from '../../Services/apIServices';
import { toast } from 'react-toastify';

export function ClientInvoice() {
    const [tutors, setTutors] = useState([]);
    const [page, setPage] = useState(0);
    const [open, setOpen] = useState(false);
    const [selectedTutor, setSelectedTutor] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const token = localStorage.getItem('token');
     const [searchQuery, setSearchQuery] = useState('');
      const [originalTutors, setOriginalTutors] = useState([]);
    useEffect(() => {
        const fetchTutors = async () => {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/get_users`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const filteredTutors = response.data.data.filter(
                    (tutor) => tutor.user_type === 'client'
                );
                // setfilteredTutors(filteredTutors);
                setOriginalTutors(filteredTutors);
                setTutors(filteredTutors);
            } catch (error) {
                console.error('Error fetching tutors:', error);
            }
        };
        fetchTutors();
    }, [token]);


    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        const filtered = originalTutors.filter(tutor =>
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

    const  downloadPDF = (url, fileName) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

    const handleClickOpen = async (tutor) => {
        try {
          const response = await getInvoiceData(tutor.email ? tutor.email : tutor.mobile);
          console.log(response.data, "response");
      
          if (response.data && response.data.rows) {
            const invoicePromises = response.data.rows.map(async (row) => {
              try {
                const invoice = await getInvoice(row.booking_id);
                if (invoice.success && invoice.data) {
                    console.log(invoice.data, "invoice");
                  downloadPDF(invoice.data, `Invoice_${row.booking_id}.pdf`);
                }

              } catch (error) {
                console.error(`Failed to fetch invoice for Booking ID: ${row.booking_id}`, error);
              }
            });
            await Promise.all(invoicePromises);
          }
        } catch (error) {
          console.error("Error fetching invoice data:", error);
        }
      };
      
    const handleClose = () => {
        setOpen(false);
        setSelectedTutor(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <header className="bg-[#2C8E71] text-white p-4 shadow">
                <h1 className="text-2xl font-bold">Client Invoice Generate</h1>
            </header>
            <div className='mt-3 mb-0'>
                <h2 className="text-lg font-semibold">Client List</h2>
            </div>
            <Box sx={{ width: '30%', display: 'flex', justifyContent: 'start', mt: 2 }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search by name, email, or mobile number"
                    sx={{
                        width: '100%',
                        maxWidth: '600px',
                        borderRadius: '40px',
                        boxShadow: '0 3px 5px rgba(0, 0, 0, 0.1)',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '50px',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ccc',
                        },
                    }}
                />
            </Box>
            <TableContainer component={Paper} elevation={3} className='mt-2'>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>No.</strong> </TableCell>
                            <TableCell><strong>First Name</strong> </TableCell>
                            <TableCell><strong>Last Name</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
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
                                <TableCell>{tutor.status}</TableCell>
                                <TableCell>{tutor.email}</TableCell>
                                <TableCell>{tutor.mobile}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => handleClickOpen(tutor)}>Invoice Generate</Button>
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
        </div>
    );
};

