import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineEdit } from "react-icons/ai";

export function TeacherEmployment({ initialData, editable }) {
    const [teacherEmployment, setTeacherEmployment] = useState(initialData || {});
    const [employmentAction, setEmploymentAction] = useState("");
    const [employmentRemark, setEmploymentRemark] = useState("");
    const [statusOptions] = useState(["Approve", "Reject",'profile incomplete', 'pending activation', 'suspended']);
    const token = localStorage.getItem("token") || "";

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTeacherEmployment((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleEmploymentActionChange = async (e) => {
        setEmploymentAction(e.target.value);
        if (e.target.value !== "Remark") {
            setEmploymentRemark("");
        }
    };



    const handleActionSave = async () => {
        const formData = new FormData();
        let teacherAction = '';

        // Set `teacherAction` based on the selected `academicAction`
        if (employmentAction === "Approve") {
            teacherAction = "active";
        } else if (employmentAction === "Reject") {
            teacherAction = "inactive";
        } else {
            // teacherAction = "Remark";
            teacherAction = employmentAction
        }

        // Add data to FormData
        formData.append('teacher_id', teacherEmployment.teacher_id);
        formData.append('tutor_status', teacherAction);
        formData.append('remark', employmentRemark === "Remark" ? employmentRemark : '');
        formData.append('editable', "false");

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cms_tutor_employment`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.status === 200) {
                toast.success("Teacher employment status updated successfully!");
            } else {
                throw new Error("Unexpected response status");
            }
        } catch (error) {
            toast.error("Failed to update academic data. Please try again.");
            console.error("Error updating academic data:", error);
        }
    };



    const handleEmploymentRemarkChange = (e) => {
        setEmploymentRemark(e.target.value);
    };

    const toggleEdit = () => {
        setTeacherEmployment((prevState) => ({
            ...prevState,
            editable: !prevState.editable,
        }));
    };

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append("capable_working_students", teacherEmployment.capable_working_students || "");
            formData.append("commitment_for_year", teacherEmployment.commitment_for_year || "");
            formData.append("experienced", teacherEmployment.experienced || "");
            formData.append("hours_taught_total", teacherEmployment.hours_taught_total || "");
            formData.append("area_special", teacherEmployment.area_special || "");
            formData.append("subject_name", teacherEmployment.subject_name || "");
            formData.append("class_ids", teacherEmployment.class_ids || "");
            formData.append("teacher_id", teacherEmployment.teacher_id); // Add teacher_id dynamically if available
            formData.append("class_group", teacherEmployment.class_group || "");
            formData.append("remark", employmentRemark || "");
            formData.append("user_id", teacherEmployment.user_id);

            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/teacher_update_employment`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                toast.success("Employment data updated successfully!");
                toggleEdit(); // Disable editing after success
            }
        } catch (error) {
            console.error("Error updating employment data:", error);
            toast.error("Failed to update employment data!");
        }
    };

    return (
        <div className="my-4 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-[#2C8E71]  p-8 px-12">
            <ToastContainer />
            <h2 className="text-lg font-semibold text-white">Teacher Employment</h2>

            <div className="grid grid-cols-2 gap-6">
                {[ // Fields for each data point
                    { label: "Capable Working with Students", name: "capable_working_students" },
                    { label: "Commitment for Year", name: "commitment_for_year" },
                    { label: "Experienced", name: "experienced" },
                    // { label: "Total Hours Taught", name: "hours_taught_total" },
                    { label: "Class Group", name: "class_group" },
                    { label: "Tutor Status", name: "tutor_status" }
                ].map((field) => (
                    <div key={field.name} className="flex flex-col gap-2">
                        <label className="label-style text-whte" style={{ color: "white" }}>{field.label}</label>
                        <input
                            type="text"
                            name={field.name}
                            value={teacherEmployment[field.name] || ""}
                            className="form-style"
                            onChange={handleInputChange}
                            disabled={!teacherEmployment.editable}
                        />
                    </div>
                ))}

                {/* Additional fields */}
                <div className="flex flex-col gap-2">
                    <label className="label-style text-whte" style={{ color: "white" }}>Class Names</label>
                    <input
                        type="text"
                        name="class_names"
                        value={teacherEmployment.class_names || ""}
                        className="form-style"
                        onChange={handleInputChange}
                        disabled={!teacherEmployment.editable}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="label-style text-whte" style={{ color: "white" }}>Subject Names</label>
                    <input
                        type="text"
                        name="subject_names"
                        value={teacherEmployment.subject_names || ""}
                        className="form-style"
                        onChange={handleInputChange}
                        disabled={!teacherEmployment.editable}
                    />
                </div>

                {/* Dropdown for actions */}
                <div className="flex flex-col gap-2 col-span-2">
                    <label className="label-style text-whte" style={{ color: "white" }}>Employment Action</label>
                    <select
                        value={employmentAction}
                        onChange={handleEmploymentActionChange}
                        className="form-style"
                        disabled={!teacherEmployment.editable}
                    >
                        <option value="">--Select Action--</option>
                        {statusOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Remark field */}
                {/* {employmentAction === "Remark" && ( */}
                    <div className="flex flex-col gap-2 col-span-2">
                        <label className="label-style text-whte" style={{ color: "white" }}>Employment Remark</label>
                        <input
                            type="text"
                            value={employmentRemark}
                            onChange={handleEmploymentRemarkChange}
                            placeholder="Enter remark"
                            className="form-style"
                        />
                    </div>
                {/* )} */}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-4">
                {teacherEmployment.editable ? (
                    <>
                        <button
                            type="button"
                            onClick={handleUpdate}
                            className="p-2 bg-blue-500 text-white rounded-md w-32"
                        >
                           Employment Update
                        </button>
                        <button
                            type="button"
                            onClick={handleActionSave}
                            className="p-2 bg-blue-500 text-white rounded-md w-32"
                        >
                            Status Update
                        </button>
                    </>
                ) : (

                    <AiOutlineEdit
                        onClick={toggleEdit}
                        className="w-9 h-9 rounded-full p-1 cursor-pointer hover:text-red-800 hover:bg-red-300"
                        style={{
                            fill: "blue",
                        }}
                    />

                )}
            </div>
        </div>
    );
}
