// import { useEffect, useState } from "react";
// import { Button } from "@mui/material";
// import * as XLSX from "xlsx";
// import { toast } from "react-toastify";
// import { jsPDF } from "jspdf";
// import "jspdf-autotable";
// import axios from "axios";

// export const ClientReport = () => {
//   const [payouts, setPayouts] = useState([]);
//   const [selectedTeachers, setSelectedTeachers] = useState([]);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [payoutData, setPayoutData] = useState([]);
//   const token = localStorage.getItem("token");

//   // Fetch initial data
//   useEffect(() => {
//     const fetchPayouts = async () => {
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_BASE_URL}/get_users`,
//           {},
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         const filteredTutors = response.data.data.filter(
//           (tutor) => tutor.user_type === "client"
//         );
//         setPayouts(filteredTutors);
//       } catch (error) {
//         console.error("Error fetching payouts:", error);
//       }
//     };
//     fetchPayouts();
//   }, [token]);

//   // Handle tutor selection
//   const handleCheckboxChange = (teacherId) => {
//     setSelectedTeachers((prev) =>
//       prev.includes(teacherId)
//         ? prev.filter((id) => id !== teacherId)
//         : [...prev, teacherId]
//     );
//   };

//   // Submit and fetch report data
//   // const handleSubmit = async () => {
//   //   setLoading(true);

//   //   const start = new Date(startDate);
//   //   const end = new Date(endDate);

//   //   const requestData = {
//   //     Tutors:  selectedTeachers.length > 0 ? selectedTeachers : " ",
//   //     start_date: {
//   //       year: start.getFullYear(),
//   //       month: start.getMonth() + 1,
//   //       day: start.getDate(),
//   //     },
//   //     end_date: {
//   //       year: end.getFullYear(),
//   //       month: end.getMonth() + 1,
//   //       day: end.getDate(),
//   //     },
//   //   };

//   //   try {
//   //     const response = await axios.post(
//   //       `${process.env.REACT_APP_API_BASE_URL}/get_student_report`,
//   //       requestData,
//   //       {
//   //         headers: {
//   //           Authorization: `Bearer ${token}`,
//   //         },
//   //       }
//   //     );
//   //     setPayoutData(response.data);
//   //     generateExcel(response.data); // Generate Excel
//   //     generatePDF(response.data); // Generate PDF
//   //   } catch (error) {
//   //     console.error("Error submitting payout data:", error);
//   //     toast.error("Failed to fetch payout data.");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleSubmit = async () => {
//     setLoading(true);
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//    let isAll =  selectedTeachers[0] === "All Clients"?"All Clients":''
//     let tutor = selectedTeachers.length > 0 ? selectedTeachers : "All Clients"
//     const requestData = {
//       Tutors: selectedTeachers.length > 0 ? (selectedTeachers[0] === "All Clients" ? "All Clients" : selectedTeachers) : "All Clients",
//       start_date: {
//         year: start.getFullYear(),
//         month: start.getMonth() + 1,
//         day: start.getDate(),
//       },
//       end_date: {
//         year: end.getFullYear(),
//         month: end.getMonth() + 1,
//         day: end.getDate(),
//       },
//     };

//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_BASE_URL}/get_student_report`,
//         requestData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setPayoutData(response.data);
//       generateExcel(response.data,isAll);
//       // generatePDF(response.data); 
//     } catch (error) {
//       console.error("Error submitting payout data:", error);
//       toast.error("Failed to fetch payout data.");
//     } finally {
//       setLoading(false);
//     }
//   };

  
//   const handleReport= async () => {
//     setLoading(true);

//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     let tutor = selectedTeachers.length > 0 ? selectedTeachers : "All Clients"
//     let isAll =  selectedTeachers[0] === "All Clients"?"All Clients":''
//     const requestData = {
//       Tutors: selectedTeachers.length > 0 ? (selectedTeachers[0] === "All Clients" ? "All Clients" : selectedTeachers) : "All Clients",
//       start_date: {
//         year: start.getFullYear(),
//         month: start.getMonth() + 1,
//         day: start.getDate(),
//       },
//       end_date: {
//         year: end.getFullYear(),
//         month: end.getMonth() + 1,
//         day: end.getDate(),
//       },
//     };

//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_BASE_URL}/get_student_report`,
//         requestData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setPayoutData(response.data);
//       // generateExcel(response.data);
//       generatePDF(response.data,isAll); 
//     } catch (error) {
//       console.error("Error submitting payout data:", error);
//       toast.error("Failed to fetch payout data.");
//     } finally {
//       setLoading(false);
//     }
//   };

 
//     const generateExcel = (data, isAll) => {
//       console.log(data.data.rows, "data");
      
//       const formattedData = data.data.rows.map((item) => {
//         const flatData = { ...item };
    
//         // Dynamically flatten all objects and arrays in the item
//         Object.entries(item).forEach(([key, value]) => {
//           if (Array.isArray(value)) {
//             value.forEach((subItem, index) => {
//               Object.entries(subItem).forEach(([subKey, subValue]) => {
//                 flatData[`${key}_${index + 1}_${subKey}`] = subValue;
//               });
//             });
//           } else if (typeof value === "object" && value !== null) {
//             Object.entries(value).forEach(([subKey, subValue]) => {
//               flatData[`${key}_${subKey}`] = subValue;
//             });
//           }
//         });
    
//         return flatData;
//       });
    
//       // Create Excel workbook and worksheet
//       const worksheet = XLSX.utils.json_to_sheet(formattedData);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Client Reports");
    
//       // Set the file name based on whether "All" or a specific tutor is selected
//       const fileName = isAll ? "All_Client_Reports.xlsx" : `${data.data.rows[0].user_info.first_name+' '+data.data.rows[0].user_info.last_name}_Report.xlsx`;
    
//       // Save the Excel file
//       XLSX.writeFile(workbook, fileName);
//       toast.success("Excel file generated!");
//     };
    
  
   
//     const generatePDF = (data, isAll) => {
//       console.log(isAll, "data");
      
//       const doc = new jsPDF();
//       doc.text("Client Reports", 20, 10);
    
//       data.data.rows.forEach((item, index) => {
//         doc.text(`Report ${index + 1}`, 20, 20 + index * 10);
    
//         // Add general data
//         const generalData = Object.entries(item).filter(([key, value]) => {
//           return typeof value !== "object";
//         });
    
//         doc.autoTable({
//           head: [["Field", "Value"]],
//           body: generalData,
//           startY: doc.autoTable.previous ? doc.autoTable.previous.finalY + 10 : 30,
//         });
    
//         // Add nested sections dynamically
//         Object.entries(item).forEach(([key, value]) => {
//           if (Array.isArray(value)) {
//             value.forEach((subItem, subIndex) => {
//               doc.text(`${key.toUpperCase()} - Entry ${subIndex + 1}`, 20, doc.autoTable.previous.finalY + 10);
//               const subTableData = Object.entries(subItem).map(([subKey, subValue]) => [subKey, subValue]);
//               doc.autoTable({
//                 head: [["Field", "Value"]],
//                 body: subTableData,
//                 startY: doc.autoTable.previous.finalY + 10,
//               });
//             });
//           } else if (typeof value === "object" && value !== null) {
//             doc.text(`${key.toUpperCase()}`, 20, doc.autoTable.previous.finalY + 10);
//             const nestedData = Object.entries(value).map(([subKey, subValue]) => [subKey, subValue]);
//             doc.autoTable({
//               head: [["Field", "Value"]],
//               body: nestedData,
//               startY: doc.autoTable.previous.finalY + 10,
//             });
//           }
//         });
//       });
    
//       // Set the file name based on whether "All" or a specific tutor is selected
//       const fileName = isAll ? "All_Client_Reports.pdf" : `${data.data.rows[0].user_info.first_name +''+data.data.rows[0].user_info.last_name}_Report.pdf`;
//       doc.save(fileName);
//       toast.success("PDF file generated!");
//     };

//   // Reset data
//   const cancelPayData = () => {
//     setPayoutData([]);
//     setSelectedTeachers([]);
//     setStartDate("");
//     setEndDate("");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-[#2C8E71] text-white p-4 shadow">
//         <h1 className="text-2xl font-bold">Client Reports</h1>
//       </header>
//       <div className="flex flex-wrap p-4">
//         <div className="mb-4 w-full md:w-1/6 px-2">
//           <label className="block font-medium mb-2">Select Client:</label>
//           <div className="relative">
//             <button
//               className="border p-2 w-full text-left bg-white flex justify-between items-center"
//               onClick={() => setDropdownOpen((prev) => !prev)}
//             >
//               {selectedTeachers.length > 0
//                 ? `Selected ${selectedTeachers.length} tutor(s)`
//                 : "Select Tutors"}
//               <span>{dropdownOpen ? "▲" : "▼"}</span>
//             </button>
//             {dropdownOpen && (
//               <div className="absolute border bg-white shadow mt-2 max-h-40 overflow-y-auto">
//                 <label
//                     className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
//                   >
//                     <input
//                       type="checkbox"
//                       className="cursor-pointer"
//                       value="All Clients"
//                       // checked={selectedTeachers.includes(tutor.id)}
//                       onChange={() => handleCheckboxChange('All Clients')}
//                     />
//                     <span>
//                        All tutors
//                     </span>
//                   </label>
//                 {payouts.map((tutor) => (
//                   <label
//                     key={tutor.id}
//                     className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
//                   >
//                     <input
//                       type="checkbox"
//                       className="cursor-pointer"
//                       value={tutor.id}
//                       checked={selectedTeachers.includes(tutor.id)}
//                       onChange={() => handleCheckboxChange(tutor.id)}
//                     />
//                     <span>
//                       {tutor.first_name} {tutor.last_name}
//                     </span>
//                   </label>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//         <div className="mb-4 w-full md:w-1/6 px-2">
//           <label className="block font-medium mb-2">Start Date:</label>
//           <input
//             type="date"
//             className="border p-2 w-full"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//           />
//         </div>
//         <div className="mb-4 w-full md:w-1/6 px-2">
//           <label className="block font-medium mb-2">End Date:</label>
//           <input
//             type="date"
//             className="border p-2 w-full"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//           />
//         </div>
//         {/* <div className="flex gap-4 w-full px-2 mt-4">
//           <button
//             className="bg-[#2C8E71] text-white px-4 py-2 rounded"
//             onClick={handleSubmit}
//             disabled={loading}
//           >
//             {loading ? "Submitting..." : "Report"}
//           </button>
//           <button
//             className="bg-gray-300 px-4 py-2 rounded"
//             onClick={cancelPayData}
//           >
//             Cancel
//           </button>
//         </div> */}
//          <div className="flex gap-4 w-full px-2 mt-4">
//           <button
//             className="bg-[#2C8E71] text-white px-4 py-2 rounded"
//             onClick={handleReport}
//             // disabled={loading}
//           >
//            Report(Pdf) Download
//           </button>
//           <button
//             className="bg-[#2C8E71] text-white px-4 py-2 rounded"
//             onClick={handleSubmit}
//             // disabled={loading}
//           >
//             Report(Excel) Download
//           </button>
//           <button
//             className="bg-gray-300 px-4 py-2 rounded"
//             onClick={cancelPayData}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };


import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from "axios";

export const ClientReport = () => {
  const [payouts, setPayouts] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [payoutData, setPayoutData] = useState([]);
  const [tutors, setTutors] = useState([]);
  const token = localStorage.getItem("token");
  const [status, setStatus] = useState('');
  const [report, setReport] = useState('');
  // Fetch initial data
  useEffect(() => {
    const fetchPayouts = async () => {
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
        setTutors(filteredTutors);
        setPayouts(filteredTutors);
      } catch (error) {
        console.error("Error fetching payouts:", error);
      }
    };
    fetchPayouts();
  }, [token]);


  // Handle tutor selection
  const handleCheckboxChange = (teacherId) => {
    setSelectedTeachers((prev) =>
      prev.includes(teacherId)
        ? prev.filter((id) => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  // Submit and fetch report data
  const handleSubmit = async () => {
    setLoading(true);
    if (report === 'Client') {
      const start = new Date(startDate);
      const end = new Date(endDate);
      let isAll = selectedTeachers[0] === "All Clients" ? "All Clients" : ''
      let tutor = selectedTeachers.length > 0 ? selectedTeachers : "All Clients"
      const requestData = {
        Tutors: selectedTeachers.length > 0 ? (selectedTeachers[0] === "All Clients" ? "All Clients" : selectedTeachers) : "All Clients",
        start_date: {
          year: start.getFullYear(),
          month: start.getMonth() + 1,
          day: start.getDate(),
        },
        end_date: {
          year: end.getFullYear(),
          month: end.getMonth() + 1,
          day: end.getDate(),
        },
      };

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/get_student_report`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPayoutData(response.data);
        generateSessionExcel(response.data, isAll);
        // generatePDF(response.data); 
      } catch (error) {
        console.error("Error submitting payout data:", error);
        toast.error("Failed to fetch payout data.");
      } finally {
        setLoading(false);
      }
    } else {
      const start = new Date(startDate);
      const end = new Date(endDate);
      let tutor = selectedTeachers.length > 0 ? selectedTeachers : "All Tutors"
      let isAll = selectedTeachers[0] === "All Tutors" ? "All Tutors" : ''
      const requestData = {
        Tutors: selectedTeachers.length > 0 ? (selectedTeachers[0] === "All Tutors" ? "All Tutors" : selectedTeachers) : "All Tutors",
        start_date: {
          year: start.getFullYear(),
          month: start.getMonth() + 1,
          day: start.getDate(),
        },
        end_date: {
          year: end.getFullYear(),
          month: end.getMonth() + 1,
          day: end.getDate(),
        },
      };

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/get_session_report`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPayoutData(response.data);
        generateSessionExcel(response.data, isAll);
        // generatePDF(response.data); 
      } catch (error) {
        console.error("Error submitting payout data:", error);
        toast.error("Failed to fetch payout data.");
      } finally {
        setLoading(false);
      }
    }
  };


  const handleReport = async () => {

    setLoading(true);
    if (report === 'Client') {
      const start = new Date(startDate);
      const end = new Date(endDate);
      let tutor = selectedTeachers.length > 0 ? selectedTeachers : "All Clients"
      let isAll = selectedTeachers[0] === "All Clients" ? "All Clients" : ''
      const requestData = {
        Tutors: selectedTeachers.length > 0 ? (selectedTeachers[0] === "All Clients" ? "All Clients" : selectedTeachers) : "All Clients",
        start_date: {
          year: start.getFullYear(),
          month: start.getMonth() + 1,
          day: start.getDate(),
        },
        end_date: {
          year: end.getFullYear(),
          month: end.getMonth() + 1,
          day: end.getDate(),
        },
      };

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/get_student_report`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPayoutData(response.data);
        // generateExcel(response.data);
        generatePDF(response.data, isAll);
      } catch (error) {
        console.error("Error submitting payout data:", error);
        toast.error("Failed to fetch payout data.");
      } finally {
        setLoading(false);
      }

    } else {
      const start = new Date(startDate);
      const end = new Date(endDate);
      let tutor = selectedTeachers.length > 0 ? selectedTeachers : "All Clients"
      let isAll = selectedTeachers[0] === "All Clients" ? "All Clients" : ''
      const requestData = {
        Tutors: selectedTeachers.length > 0 ? (selectedTeachers[0] === "All Clients" ? "All Clients" : selectedTeachers) : "All Clients",
        start_date: {
          year: start.getFullYear(),
          month: start.getMonth() + 1,
          day: start.getDate(),
        },
        end_date: {
          year: end.getFullYear(),
          month: end.getMonth() + 1,
          day: end.getDate(),
        },
      };
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/get_session_report`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPayoutData(response.data);
        // generateExcel(response.data);
        generateSessionPDF(response.data, isAll);
      } catch (error) {
        console.error("Error submitting payout data:", error);
        toast.error("Failed to fetch payout data.");
      } finally {
        setLoading(false);
      }


    }


  };

  // Generate Excel dynamically
  // const generateExcel = (data) => {
  //   console.log(data.data.rows, "data");

  //   const formattedData = data.data.rows.map((item) => {
  //     const flatData = { ...item };

  //     // Dynamically flatten all objects and arrays in the item
  //     Object.entries(item).forEach(([key, value]) => {
  //       if (Array.isArray(value)) {
  //         value.forEach((subItem, index) => {
  //           Object.entries(subItem).forEach(([subKey, subValue]) => {
  //             flatData[`${key}_${index + 1}_${subKey}`] = subValue;
  //           });
  //         });
  //       } else if (typeof value === "object" && value !== null) {
  //         Object.entries(value).forEach(([subKey, subValue]) => {
  //           flatData[`${key}_${subKey}`] = subValue;
  //         });
  //       }
  //     });

  //     return flatData;
  //   });

  //   const worksheet = XLSX.utils.json_to_sheet(formattedData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Tutor Reports");
  //   XLSX.writeFile(workbook, "TutorReports.xlsx");
  //   toast.success("Excel file generated!");
  // };
  // Generate PDF dynamically
  // const generatePDF = (data) => {
  //   console.log(data.data.rows, "data");

  //   const doc = new jsPDF();
  //   doc.text("Tutor Reports", 20, 10);

  //   data.data.rows.forEach((item, index) => {
  //     doc.text(`Report ${index + 1}`, 20, 20 + index * 10);

  //     // Add general data
  //     const generalData = Object.entries(item).filter(([key, value]) => {
  //       return typeof value !== "object";
  //     });

  //     doc.autoTable({
  //       head: [["Field", "Value"]],
  //       body: generalData,
  //       startY: doc.autoTable.previous ? doc.autoTable.previous.finalY + 10 : 30,
  //     });

  //     // Add nested sections dynamically
  //     Object.entries(item).forEach(([key, value]) => {
  //       if (Array.isArray(value)) {
  //         value.forEach((subItem, subIndex) => {
  //           doc.text(`${key.toUpperCase()} - Entry ${subIndex + 1}`, 20, doc.autoTable.previous.finalY + 10);
  //           const subTableData = Object.entries(subItem).map(([subKey, subValue]) => [subKey, subValue]);
  //           doc.autoTable({
  //             head: [["Field", "Value"]],
  //             body: subTableData,
  //             startY: doc.autoTable.previous.finalY + 10,
  //           });
  //         });
  //       } else if (typeof value === "object" && value !== null) {
  //         doc.text(`${key.toUpperCase()}`, 20, doc.autoTable.previous.finalY + 10);
  //         const nestedData = Object.entries(value).map(([subKey, subValue]) => [subKey, subValue]);
  //         doc.autoTable({
  //           head: [["Field", "Value"]],
  //           body: nestedData,
  //           startY: doc.autoTable.previous.finalY + 10,
  //         });
  //       }
  //     });
  //   });

  //   doc.save("TutorReports.pdf");
  //   toast.success("PDF file generated!");
  // };


  const generateSessionPDF = (data, isAll) => {
    console.log(isAll, "data");

    const doc = new jsPDF();
    doc.text("Client Session Reports", 20, 10);

    data.data.forEach((item, index) => {
      doc.text(`Report ${index + 1}`, 20, 20 + index * 10);

      // Add general data
      const generalData = Object.entries(item).filter(([key, value]) => {
        return typeof value !== "object";
      });

      doc.autoTable({
        head: [["Field", "Value"]],
        body: generalData,
        startY: doc.autoTable.previous ? doc.autoTable.previous.finalY + 10 : 30,
      });

      // Add nested sections dynamically
      Object.entries(item).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((subItem, subIndex) => {
            doc.text(`${key.toUpperCase()} - Entry ${subIndex + 1}`, 20, doc.autoTable.previous.finalY + 10);
            const subTableData = Object.entries(subItem).map(([subKey, subValue]) => [subKey, subValue]);
            doc.autoTable({
              head: [["Field", "Value"]],
              body: subTableData,
              startY: doc.autoTable.previous.finalY + 10,
            });
          });
        } else if (typeof value === "object" && value !== null) {
          doc.text(`${key.toUpperCase()}`, 20, doc.autoTable.previous.finalY + 10);
          const nestedData = Object.entries(value).map(([subKey, subValue]) => [subKey, subValue]);
          doc.autoTable({
            head: [["Field", "Value"]],
            body: nestedData,
            startY: doc.autoTable.previous.finalY + 10,
          });
        }
      });
    });

    // Set the file name based on whether "All" or a specific tutor is selected
    const fileName = isAll ? "All_Client_Session_Report.pdf" : `${data.data[0].booking_details.first_name + '' + data.data[0].booking_details.last_name}_Session_Report.pdf`;
    doc.save(fileName);
    toast.success("PDF file generated!");
  };


  const generateExcel = (data, isAll) => {
    const formattedData = data.data.map((item) => {
      const flatData = { ...item };

      // Dynamically flatten all objects and arrays in the item
      Object.entries(item).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((subItem, index) => {
            Object.entries(subItem).forEach(([subKey, subValue]) => {
              flatData[`${key}_${index + 1}_${subKey}`] = subValue;
            });
          });
        } else if (typeof value === "object" && value !== null) {
          Object.entries(value).forEach(([subKey, subValue]) => {
            flatData[`${key}_${subKey}`] = subValue;
          });
        }
      });

      return flatData;
    });

    // Create Excel workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Client Reports");

    // Set the file name based on whether "All" or a specific tutor is selected
    const fileName = isAll ? "All_Client_Reports.xlsx" : `${data.data.rows[0].first_name + ' ' + data.data.rows[0].last_name}_Report.xlsx`;

    // Save the Excel file
    XLSX.writeFile(workbook, fileName);
    toast.success("Excel file generated!");
  };



  const generateSessionExcel = (data, isAll) => {
    console.log(data,"data")
    const formattedData = data.data.map((item) => {
      const flatData = { ...item };

      // Dynamically flatten all objects and arrays in the item
      Object.entries(item).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((subItem, index) => {
            Object.entries(subItem).forEach(([subKey, subValue]) => {
              flatData[`${key}_${index + 1}_${subKey}`] = subValue;
            });
          });
        } else if (typeof value === "object" && value !== null) {
          Object.entries(value).forEach(([subKey, subValue]) => {
            flatData[`${key}_${subKey}`] = subValue;
          });
        }
      });

      return flatData;
    });

    // Create Excel workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Client Reports");

    // Set the file name based on whether "All" or a specific tutor is selected
    const fileName = isAll ? "All_Session_Reports.xlsx" : `${data.data[0].booking_details.first_name + ' ' + data.data[0].booking_details.last_name}_Report.xlsx`;

    // Save the Excel file
    XLSX.writeFile(workbook, fileName);
    toast.success("Excel file generated!");
  };



  const generatePDF = (data, isAll) => {

    const doc = new jsPDF();
    doc.text("Client Reports", 20, 10);

    data.data.rows.forEach((item, index) => {
      doc.text(`Report ${index + 1}`, 20, 20 + index * 10);

      // Add general data
      const generalData = Object.entries(item).filter(([key, value]) => {
        return typeof value !== "object";
      });

      doc.autoTable({
        head: [["Field", "Value"]],
        body: generalData,
        startY: doc.autoTable.previous ? doc.autoTable.previous.finalY + 10 : 30,
      });

      // Add nested sections dynamically
      Object.entries(item).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((subItem, subIndex) => {
            doc.text(`${key.toUpperCase()} - Entry ${subIndex + 1}`, 20, doc.autoTable.previous.finalY + 10);
            const subTableData = Object.entries(subItem).map(([subKey, subValue]) => [subKey, subValue]);
            doc.autoTable({
              head: [["Field", "Value"]],
              body: subTableData,
              startY: doc.autoTable.previous.finalY + 10,
            });
          });
        } else if (typeof value === "object" && value !== null) {
          doc.text(`${key.toUpperCase()}`, 20, doc.autoTable.previous.finalY + 10);
          const nestedData = Object.entries(value).map(([subKey, subValue]) => [subKey, subValue]);
          doc.autoTable({
            head: [["Field", "Value"]],
            body: nestedData,
            startY: doc.autoTable.previous.finalY + 10,
          });
        }
      });
    });

    // Set the file name based on whether "All" or a specific tutor is selected
    const fileName = isAll ? "All_Client_Reports.pdf" : `${data.data.rows[0].first_name + '' + data.data.rows[0].last_name}_Report.pdf`;
    doc.save(fileName);
    toast.success("PDF file generated!");
  };



  const handleSelect = (e) => {
    setStatus(e.target.value);
  }
  const statusOptions = ['profile incomplete', 'pending activation', 'suspended', 'active', 'Deactivated'];
  useEffect(() => {
    if (status) {
      const filteredByStatus = tutors.filter(tutor => tutor.status === status);
      setPayouts(filteredByStatus);
    } else {
      setPayouts(tutors);
    }
  }, [payoutData, status]);

  // Reset data
  const cancelPayData = () => {
    setPayoutData([]);
    setSelectedTeachers([]);
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#2C8E71] text-white p-4 shadow">
        <h1 className="text-2xl font-bold">Client Reports</h1>
      </header>
      <div className="flex flex-wrap p-4">
        <div className="mb-4 w-full md:w-1/6 px-2">
          <label htmlFor="statusSelect" className="block mb-2">Select Report:</label>
          <select
            id="statusSelect"
            value={report}
            onChange={(e) => setReport(e.target.value)}
            className="border p-2"
          >
            <option value="">--Select Report--</option>
            <option key='Tutor' value='Tutor'>
              Client Report
            </option>
            <option key='Session' value='Session'>
              Session Report
            </option>
          </select>
        </div>

        <div className="mb-4 w-full md:w-1/6 px-2">
          <label htmlFor="statusSelect" className="block mb-2">Select Status:</label>
          <select
            id="statusSelect"
            value={status}
            onChange={handleSelect}
            className="border p-2"
          >
            <option value="">--Select Status--</option>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 w-full md:w-1/6 px-2">
          <label className="block font-medium mb-2">Select Clients:</label>
          <div className="relative">
            <button
              className="border p-2 w-full text-left bg-white flex justify-between items-center"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              {selectedTeachers.length > 0
                ? `Selected ${selectedTeachers.length} Client(s)`
                : "Select Clients"}
              <span>{dropdownOpen ? "▲" : "▼"}</span>
            </button>
            {dropdownOpen && (
              <div className="absolute border bg-white shadow mt-2 max-h-40 overflow-y-auto">
                <label
                  className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="cursor-pointer"
                    value="All Clients"
                    // checked={selectedTeachers.includes(tutor.id)}
                    onChange={() => handleCheckboxChange('All Clients')}
                  />
                  <span>
                    All Clients
                  </span>
                </label>
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
          <label className="block font-medium mb-2">Session Start Date:</label>
          <input
            type="date"
            className="border p-2 w-full"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="mb-4 w-full md:w-1/6 px-2">
          <label className="block font-medium mb-2">Session End Date:</label>
          <input
            type="date"
            className="border p-2 w-full"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="flex gap-4 w-full px-2 mt-4">
          <button
            className="bg-[#2C8E71] text-white px-4 py-2 rounded"
            onClick={handleReport}
          // disabled={loading}
          >
            Report(Pdf) Download
          </button>
          <button
            className="bg-[#2C8E71] text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          // disabled={loading}
          >
            Report(Excel) Download
          </button>
          <button
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={cancelPayData}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
