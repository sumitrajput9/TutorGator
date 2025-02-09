import { useEffect, useState } from "react";
import { getTeacherPendingPayout, getPaymentData } from "../../Services/apIServices";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { toast } from "react-toastify";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Tab } from "bootstrap";
export const TutorPayout = () => {
    const [payouts, setPayouts] = useState([]);
    const [selectedTeachers, setSelectedTeachers] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [payoutData, setPayoutData] = useState([]);


    useEffect(() => {
        const fetchPayouts = async () => {
            try {
                const response = await getTeacherPendingPayout();
                setPayouts(response.data);
            } catch (error) {
                console.error("Error fetching payouts:", error);
            }
        };
        fetchPayouts();
    }, []);

    const handleCheckboxChange = (teacherId) => {
        setSelectedTeachers((prev) =>
            prev.includes(teacherId)
                ? prev.filter((id) => id !== teacherId)
                : [...prev, teacherId]
        );
    };

    const handleSubmit = async () => {
        if (!startDate || !endDate || !startTime || !endTime || selectedTeachers.length === 0) {
            alert("Please fill all fields: teachers, dates, and times.");
            return;
        }

        setLoading(true);

        const requestData = {
            teacher_ids: selectedTeachers.join(","), // Convert array to a comma-separated string
            start_date: startDate,
            end_date: endDate,
            start_time: startTime,
            end_time: endTime,
            api_action: 'list',
        };

        try {
            const response = await getPaymentData(requestData);
            setPayoutData(response.data);
            toast.success(response.message);
        } catch (error) {
            console.error("Error submitting payout data:", error);
            alert("Failed to fetch payout data.");
        } finally {
            setLoading(false);
        }
    };
    // Function to export data as Excel
    const exportToExcel = async () => {
        const ws = XLSX.utils.json_to_sheet(payoutData.map(data => ({
            'Teacher Name': `${data.first_name} ${data.last_name}`,
             'Teacher Email': data.teacher_email,
            'Total Hours': data.session_total_time,
             'Account Name': data.account_name,
             'Account Number': data.account_number,
              'ABN': data.abn,
               'BSB': data.bsb,
            'Booking IDs': data.data.map(d => d.booking_id).join(", "),
            'Amount to be Paid': data.total_amount,
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Payout Data');
      
        XLSX.writeFile(wb, `${payoutData[0].first_name}_${payoutData[0].last_name}_payout_data.xlsx`);
        try {
            const requestData = {
                teacher_ids: selectedTeachers.join(","), // Convert array to a comma-separated string
                start_date: startDate,
                end_date: endDate,
                start_time: startTime,
                end_time: endTime,
                api_action: 'create',
            };
            return
            const res = await getPaymentData(requestData);
            if (res.status === 200) {
                toast.success("Payout data exported successfully!");
                setPayoutData([]);
                setSelectedTeachers([]);
                setStartDate("");
                setEndDate("");
                setStartTime("");
                setEndTime("");
            }
        } catch (error) {

        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const tableColumn = ["Teacher Name","Email", "Total Hours", "Bank Details", "Booking IDs", "Amount to be Paid",'Account Name', 'Account Number', 'ABN', 'BSB'];
        const tableRows = [];

        payoutData.forEach(data => {
            const payoutRow = [
                `${data.first_name} ${data.last_name}`,
                data.email,

                data.session_total_time,
                data.account_name, data.account_number, data.abn, data.bsb,
                `Account Name: ${data.account_name}, Account Number: ${data.account_number}, ABN: ${data.abn}, BSB: ${data.bsb}`,
                data.data.map(d => d.booking_id).join(", "),
                data.total_amount,
            ];
            tableRows.push(payoutRow);
        });

        doc.autoTable(tableColumn, tableRows, { startY: 20 });
        doc.text(`${payoutData[0].first_name}${payoutData[0].last_name}_payout_data`, 14, 15);
        doc.save(`${payoutData[0].first_name}${payoutData[0].last_name}_payout_data.pdf`);
    };
    const cancelPayData = () => {
        setPayoutData([]);
        setSelectedTeachers([]);
        setStartDate("");
        setEndDate("");
        setStartTime("");
        setEndTime("");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-[#2C8E71] text-white p-4 shadow">
                <h1 className="text-2xl font-bold">Tutor Payout</h1>
            </header>
            <div className="flex flex-wrap p-4">
                <div className="mb-4 w-full md:w-1/6 px-2">
                    <label className="block font-medium mb-2">Select Tutors:</label>
                    <div className="relative">
                        <button
                            className="border p-2 w-full text-left bg-white flex justify-between items-center"
                            onClick={() => setDropdownOpen((prev) => !prev)}
                        >
                            {selectedTeachers.length > 0
                                ? `Selected ${selectedTeachers.length} tutor(s)`
                                : "Select Tutors"}
                            <span>{dropdownOpen ? "▲" : "▼"}</span>
                        </button>
                        {dropdownOpen && (
                            <div className="absolute border bg-white shadow mt-2 max-h-40 overflow-y-auto">
                                {payouts.map((tutor) => (
                                    <label
                                        key={tutor.id}
                                        className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            className="cursor-pointer"
                                            value={tutor.id}
                                            checked={selectedTeachers.includes(tutor.id)}
                                            onChange={() => handleCheckboxChange(tutor.id)}
                                        />
                                        <span>
                                            {tutor.first_name} {tutor.last_name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="mb-4 w-full md:w-1/6 px-2">
                    <label className="block font-medium mb-2">Start Date:</label>
                    <input
                        type="date"
                        className="border p-2 w-full"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="mb-4 w-full md:w-1/6 px-2">
                    <label className="block font-medium mb-2">End Date:</label>
                    <input
                        type="date"
                        className="border p-2 w-full"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div className="mb-4 w-full md:w-1/6 px-2">
                    <label className="block font-medium mb-2">Start Time:</label>
                    <input
                        type="time"
                        className="border p-2 w-full"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                </div>
                <div className="mb-4 w-full md:w-1/6 px-2">
                    <label className="block font-medium mb-2">End Time:</label>
                    <input
                        type="time"
                        className="border p-2 w-full"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                </div>
                <div className="flex gap-4 w-full px-2 mt-4">
                    <button
                        className="bg-[#2C8E71] text-white px-4 py-2 rounded"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                    <button
                        className="bg-gray-300 px-4 py-2 rounded"
                        onClick={() => {
                            setSelectedTeachers([]);
                            setStartDate("");
                            setEndDate("");
                            setStartTime("");
                            setEndTime("");
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>

            {/* Display Payout Data */}
            <div className="p-4">
                {payoutData?.length > 0 && (
                    <div className="mt-8">
                        <Typography variant="h6" gutterBottom>
                            Payout Data
                        </Typography>

                        {/* Buttons for downloading CSV or Excel */}
                        <div className="mb-4 flex gap-2">
                            <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={exportToExcel}>
                            Download(Excel)
                            </Button>
                            <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={exportToPDF}>
                                Download(PDF)
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={cancelPayData}>
                                Cancel
                            </Button>
                        </div>

                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="payout data table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Teacher Name</TableCell>
                                        <TableCell>Teacher Email</TableCell>
                                        <TableCell>Total Hours</TableCell>
                                        <TableCell>Bank Details</TableCell>
                                        <TableCell>Booking IDs</TableCell>
                                        <TableCell>Amount to be Paid</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {payoutData.map((data) => (
                                        <TableRow key={data.teacher_id}>
                                            <TableCell>{data.first_name} {data.last_name}</TableCell>
                                            <TableCell>{data.teacher_email}</TableCell>
                                            <TableCell>{data.session_total_time}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2">Account Name: {data.account_name}</Typography>
                                                <Typography variant="body2">Account Number: {data.account_number}</Typography>
                                                <Typography variant="body2">ABN: {data.abn}</Typography>
                                                <Typography variant="body2">BSB: {data.bsb}</Typography>
                                            </TableCell>
                                            <TableCell>{data.data.map((d) => d.booking_id).join(", ")}</TableCell>
                                            <TableCell>{data.total_amount}</TableCell>
                                            {/* <TableCell>
                                                <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={exportToExcel}>
                                                    Create
                                                </Button>
                                                <Button variant="outlined" color="secondary">
                                                    Cancel
                                                </Button>
                                            </TableCell> */}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                )}
            </div>
        </div>
    );
};
