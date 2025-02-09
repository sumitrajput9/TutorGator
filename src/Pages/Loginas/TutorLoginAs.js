import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField, Box } from '@mui/material';
import axios from 'axios';
import { getUserLoginDetails } from '../../Services/apIServices';

export function TutorLoginAs() {
  const [tutors, setTutors] = useState([]);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [originalTutors, setOriginalTutors] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const token = localStorage.getItem('token');
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/get_users`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const filteredTutors = response.data.data.filter(
          (tutor) => tutor.user_type === 'teacher'
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

  const handleClickOpen = async (tutor) => {
    try {
     
        const res = await getUserLoginDetails(tutor.id);
        setSelectedTutor(res);
        setOpen(true);

    } catch (error) {
      console.log(error, "error");

    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTutor(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="bg-[#2C8E71] text-white p-4 shadow">
        <h1 className="text-2xl font-bold">Tutor Login Details</h1>
      </header>
      <div className='mt-3 mb-0'>
        <h2 className="text-lg font-semibold">Login List</h2>
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
                  <Button variant="contained" color="primary" onClick={() => handleClickOpen(tutor)}>Login Details</Button>
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Login Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedTutor && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <p><strong>First Name:</strong> {selectedTutor.firstName}</p>
                  </Grid>
                  <Grid item xs={6}>
                    <p><strong>Last Name:</strong> {selectedTutor.lastName}</p>
                  </Grid>
                  <Grid item xs={6}>
                    <p><strong>Email:</strong> {selectedTutor.email}</p>
                  </Grid>
                  <Grid item xs={6}>
                    <p><strong>Phone Number:</strong> {selectedTutor.mobile}</p>
                  </Grid>
                  <Grid item xs={6}>
                    <p><strong>Status:</strong> {selectedTutor.status}</p>
                  </Grid>
                  <Grid item xs={6}>
                    <p><strong>Country ID:</strong> {selectedTutor.countryId}</p>
                  </Grid>

                  <Grid item xs={6}>
                    <p><strong>Mobile Token:</strong> {selectedTutor.mobileToken}</p>
                  </Grid>

                  <Grid item xs={6}>
                    <p><strong>Mobile Type:</strong> {selectedTutor.mobileType}</p>
                  </Grid>

                  <Grid item xs={6}>
                    <p><strong>OTP :</strong> {selectedTutor.otp}</p>
                  </Grid>

                  <Grid item xs={6}>
                    <p><strong>Signup Type:</strong> {selectedTutor.signupType}</p>
                  </Grid>

                  <Grid item xs={12}>
                    <p style={{ wordBreak: 'break-all' }}><strong>Remember Token:</strong> {selectedTutor.rememberToken}</p>
                  </Grid>

                </Grid>
              </>

            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

