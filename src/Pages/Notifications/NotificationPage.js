// import { useEffect, useState } from "react";
// import { getEvents, deleteEvent, updateEvent } from "../../Services/apIServices"; // Add `updateEvent` function
// import { toast } from "react-toastify";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Pagination,
//   Button,
//   TextField,
// } from "@mui/material";

// export function NotificationTemplate() {
//   const [events, setEvents] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [editingRow, setEditingRow] = useState(null); // Track row being edited
//   const [editedData, setEditedData] = useState({}); // Store temporary edited data
//   const rowsPerPage = 10;

//   // Fetch Events
//   const fetchEvents = async () => {
//     try {
//       const res = await getEvents();
//       setEvents(res.data);
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // Handle Delete
//   const handleDelete = async (id) => {
//     try {
//     //   await deleteEvent(id);
//       toast.success("Event deleted successfully");
//       fetchEvents();
//     } catch (error) {
//       toast.error("Failed to delete event");
//     }
//   };

//   // Handle Pagination Change
//   const handleChangePage = (event, value) => {
//     setCurrentPage(value);
//   };

//   // Start Editing
//   const handleEdit = (event) => {
//     setEditingRow(event.id);
//     setEditedData(event); // Initialize edited data with current row's data
//   };

  
//   const handleInputChange = (field, value) => {
//     setEditedData((prev) => ({ ...prev, [field]: value }));
//   };

//   // Save Edited Data
//   const handleSave = async () => {
//     try {
//     //   await updateEvent(editingRow, editedData); // Call API to update event
//       toast.success("Event updated successfully");
//       setEditingRow(null); // Exit editing mode
//       fetchEvents(); // Refresh data
//     } catch (error) {
//       toast.error("Failed to update event");
//     }
//   };

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   // Paginated Data
//   const paginatedEvents = events.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <header className="bg-[#2C8E71] text-white p-4 shadow">
//         <h1 className="text-2xl font-bold">Notifications Management</h1>
//       </header>

//       <main className="mt-6">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-lg font-semibold">Event List</h2>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => toast.info("Add Event modal coming soon!")}
//           >
//             Add Event
//           </Button>
//         </div>

//         <TableContainer component={Paper} elevation={3}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell><strong>No.</strong></TableCell>
//                 <TableCell><strong>Event Name</strong></TableCell>
//                 <TableCell><strong>Description</strong></TableCell>
//                 <TableCell><strong>Status</strong></TableCell>
//                 <TableCell><strong>Schedule</strong></TableCell>
//                 <TableCell><strong>Actions</strong></TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {paginatedEvents.map((event, index) => (
//                 <TableRow key={event.id}>
//                   <TableCell>{(currentPage - 1) * rowsPerPage + index + 1}</TableCell>
//                   <TableCell>
//                     {editingRow === event.id ? (
//                       <TextField
//                         value={editedData.event_name || ""}
//                         onChange={(e) =>
//                           handleInputChange("event_name", e.target.value)
//                         }
//                         size="small"
//                       />
//                     ) : (
//                       event.event_name
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     {editingRow === event.id ? (
//                       <TextField
//                         value={editedData.description || ""}
//                         onChange={(e) =>
//                           handleInputChange("description", e.target.value)
//                         }
//                         size="small"
//                       />
//                     ) : (
//                       event.description
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                         event.status === "active"
//                           ? "bg-green-100 text-green-700"
//                           : "bg-red-100 text-red-700"
//                       }`}
//                     >
//                       {event.status}
//                     </span>
//                   </TableCell>
//                   <TableCell>
//                     {editingRow === event.id ? (
//                       <TextField
//                         type="datetime-local"
//                         value={editedData.schedule || ""}
//                         onChange={(e) =>
//                           handleInputChange("schedule", e.target.value)
//                         }
//                         size="small"
//                       />
//                     ) : (
//                       new Date(event.schedule).toLocaleString()
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     {editingRow === event.id ? (
//                       <>
//                         <Button
//                           variant="contained"
//                           color="primary"
//                           size="small"
//                           onClick={handleSave}
//                           style={{ marginRight: "8px" }}
//                         >
//                           Save
//                         </Button>
//                         <Button
//                           variant="contained"
//                           color="secondary"
//                           size="small"
//                           onClick={() => setEditingRow(null)}
//                         >
//                           Cancel
//                         </Button>
//                       </>
//                     ) : (
//                       <>
//                         <Button
//                           variant="contained"
//                           color="secondary"
//                           size="small"
//                           onClick={() => handleEdit(event)}
//                           style={{ marginRight: "8px" }}
//                         >
//                           Edit
//                         </Button>
//                         <Button
//                           variant="contained"
//                           color="error"
//                           size="small"
//                           onClick={() => handleDelete(event.id)}
//                         >
//                           Delete
//                         </Button>
//                       </>
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         <div className="flex justify-center mt-6">
//           <Pagination
//             count={Math.ceil(events.length / rowsPerPage)}
//             page={currentPage}
//             onChange={handleChangePage}
//             color="primary"
//             size="large"
//           />
//         </div>
//       </main>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { getEvents, deleteEvent, updateEvent, saveEvent } from "../../Services/apIServices";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router";

export function NotificationTemplate() {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ event_name: "", description: "", status: "active" });
  const rowsPerPage = 10;
  const navigate = useNavigate();

  // Fetch Events
  const fetchEvents = async () => {
    try {
      const res = await getEvents({user_type:"teacher"});
      setEvents(res.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      toast.success("Event deleted successfully");
      fetchEvents();
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  // Handle Pagination Change
  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  // Start Editing
  const handleEdit = (event) => {
    setEditingRow(event.id);
    setEditedData(event);
  };

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  // Save Edited Data
  const handleSave = async () => {
    try {
      await updateEvent(editingRow, editedData);
      toast.success("Event updated successfully");
      setEditingRow(null);
      fetchEvents();
    } catch (error) {
      toast.error("Failed to update event");
    }
  };

  // Handle Add Event
  const handleAddEvent = async () => {
    try {
      const data = { ...newEvent, user_type: "teacher" };
     const res = await saveEvent(data);
     console.log(res,"res.daa");
     
      toast.success("Event added successfully");
      setIsAddModalOpen(false);
      fetchEvents();
      setNewEvent({ event_name: "", description: "", status: "active" });
    } catch (error) {
      toast.error("Failed to add event");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Paginated Data
  const paginatedEvents = events.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSendNotification = (id) => {
     navigate('/dashboard/notification/template', { state: { id } });           

  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="bg-[#2C8E71] text-white p-4 shadow">
        <h1 className="text-2xl font-bold">Notification Management</h1>
      </header>

      <main className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Event List</h2>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Event
          </Button>
        </div>

        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>No.</strong></TableCell>
                <TableCell><strong>Event Name</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Schedule</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
                <TableCell><strong>Notification Template</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedEvents.map((event, index) => (
                <TableRow key={event.id}>
                  <TableCell>{(currentPage - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    {editingRow === event.id ? (
                      <TextField
                        value={editedData.event_name || ""}
                        onChange={(e) =>
                          handleInputChange("event_name", e.target.value)
                        }
                        size="small"
                      />
                    ) : (
                      event.event_name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingRow === event.id ? (
                      <TextField
                        value={editedData.description || ""}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        size="small"
                      />
                    ) : (
                      event.description
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        event.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {event.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {editingRow === event.id ? (
                      <TextField
                        type="datetime-local"
                        value={editedData.schedule || ""}
                        onChange={(e) =>
                          handleInputChange("schedule", e.target.value)
                        }
                        size="small"
                      />
                    ) : (
                      new Date(event.schedule).toLocaleString()
                    )}
                  </TableCell>
                  <TableCell>
                    {editingRow === event.id ? (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={handleSave}
                          style={{ marginRight: "8px" }}
                        >
                          Save
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => setEditingRow(null)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="flex">
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => handleEdit(event)}
                          style={{ marginRight: "8px" }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(event.id)}
                        >
                          Delete
                        </Button>
                        </div>
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                  <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleSendNotification(event.id)}
                          style={{ marginRight: "8px" }}
                        >
                          Click
                        </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <div className="flex justify-center mt-6">
          <Pagination
            count={Math.ceil(events.length / rowsPerPage)}
            page={currentPage}
            onChange={handleChangePage}
            color="primary"
            size="large"
          />
        </div>

        {/* Add Event Modal */}
        <Dialog open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogContent>
            <TextField
              label="Event Name"
              fullWidth
              margin="dense"
              value={newEvent.event_name}
              onChange={(e) => setNewEvent({ ...newEvent, event_name: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              margin="dense"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />
            {/* <TextField
              label="Schedule"
              type="datetime-local"
              fullWidth
              margin="dense"
              value={newEvent.schedule}
              onChange={(e) => setNewEvent({ ...newEvent, schedule: e.target.value })}
              InputLabelProps={{ shrink: true }}
            /> */}
             <TextField
              label="Active/Inactive"
              type="text"
              fullWidth
              margin="dense"
              value={newEvent.active}
              onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAddModalOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddEvent} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </main>
    </div>
  );
}
