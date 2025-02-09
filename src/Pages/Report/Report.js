import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation
import "jspdf-autotable"; // Assuming this is needed for PDF generation

export const Report = () => {
  const [selectedReport, setSelectedReport] = useState("");
  const navigate = useNavigate();

  const handleReportClick = (reportType) => {
    setSelectedReport(reportType);
    if (reportType === "tutor") {
      navigate("/dashboard/tutor/tutor-report");
    } else if (reportType === "session") {
      navigate("/dashboard/tutor/session-report");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#2C8E71] text-white p-4 shadow">
        <h1 className="text-2xl font-bold">Reports</h1>
      </header>

      <div className="p-4">
        <p className="text-xl font-semibold mb-4">Choose Report</p>
        <div className="flex gap-4">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => handleReportClick("tutor")}
            sx={{ width: "200px" }}
          >
            Tutor Report
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => handleReportClick("session")}
            sx={{ width: "200px" }}
          >
            Session Report
          </Button>
        </div>
        
        {/* Optional display of selected report */}
        {selectedReport && (
          <div className="mt-4">
            <p className="text-lg">Selected Report: {selectedReport}</p>
          </div>
        )}
      </div>
    </div>
  );
};