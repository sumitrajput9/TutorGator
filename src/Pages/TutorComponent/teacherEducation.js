import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Assuming you're using react-hot-toast for notifications
import { FcCancel } from "react-icons/fc";
import { AiOutlineEdit } from "react-icons/ai";

export function TeacherEducation({ initialData, teacherId, userId }) {
    const [educationData, setEducationData] = useState(initialData || []);
    const [academicActions, setAcademicActions] = useState('');
    const [editable, setEditable] = useState(false);
    const statusOptions = ["Approve", "Reject",'profile incomplete', 'pending activation', 'suspended'];
    const [remark, setRemark] = useState('');
    const token = localStorage.getItem("token") || "";
    console.log(initialData, "initialData");

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const updatedData = [...educationData];
        updatedData[index] = {
            ...updatedData[index],
            [name]: value,
        };
        setEducationData(updatedData);
    };

    const handleAcademicActionChange = (e, index) => {
        setAcademicActions(e.target.value);
        if (e.target.value !== "Remark") {
            handleInputChange({ target: { name: "remark", value: "" } }, index);
        }
    };

    const handleRemark=(e)=>{
        setRemark(e.target.value)
    }
    const handleUpdate = async () => {
        try {
            const formData = new FormData();

            educationData.forEach((entry) => {
                formData.append("education_id", entry.education_id || entry.id || '');
                formData.append("year_you_are_in", entry.year_you_are_in || entry.id || '');

                Object.keys(entry).forEach((key) => {
                    if (key !== "editable") {
                        const value = entry[key] || '';
                        formData.append(key, value);
                    }
                });
                if (entry.document_image && typeof entry.document_image === "object") {
                    formData.append("document_image", entry.document_image);
                } else {
                    formData.append("document_image", '');
                }
            });
            formData.append("user_id", userId);
            formData.append("teacher_id", teacherId);

            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/teacher_update_education`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            // Handle response
            if (response.status === 200) {
                toast.success("Education data updated successfully!");
                // Update local state or any other actions here
            }
        } catch (error) {
            console.error("Error updating education data:", error);
            toast.error("Failed to update education data. Please try again.");
        }
    };




    const handleActionSave = async () => {
        const formData = new FormData();
        let teacherAction = '';
        if (academicActions === "Approve") {
            teacherAction = "active";
        } else if (academicActions === "Reject") {
            teacherAction = "inactive";
        } else {
            // teacherAction = "Remark";
            teacherAction = academicActions
        }
        formData.append('teacher_id', teacherId);
        formData.append('tutor_status', teacherAction);
        formData.append('remark', academicActions === "Remark" ? '' : '');
        formData.append('editable', "false");
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cms_tutor_education`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.status === 200) {
                toast.success("Teacher academic status updated successfully!");
            } else {
                throw new Error("Unexpected response status");
            }
        } catch (error) {
            toast.error("Failed to update academic data. Please try again.");
            console.error("Error updating academic data:", error);
        }
    };


    const toggleEdit = (index) => {
        const updatedData = [...educationData];
        updatedData[index].editable = !updatedData[index].editable;
        setEducationData(updatedData);
    };

    const toggleEditable = () => {
        setEditable(!editable);
    };

    return (
        <div className="my-4 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-[#2C8E71] p-8 px-12">
            <h2 className="text-lg font-semibold text-white">Teacher Education</h2>

            {educationData?.map((entry, index) => (
                <div key={entry.id} className="border-b-2 border-gray-200 pb-6 mb-6">
                    <div className="grid grid-cols-2 gap-6">
                        {/* Fields for each data point */}
                        {[
                            { label: "Record Type", name: "record_type" },
                            { label: "Attended", name: "attended" },
                            { label: "Year Completed", name: "year_complete" },
                            { label: "Current Year", name: "year_you_are_in" },
                            { label: "Degree Name", name: "name" },
                            { label: "Document ID", name: "document_id" },
                            { label: "Tutor Status", name: "tutor_status" },
                            { label: "Education Level", name: "education_level_name" },
                        ].map((field) => (
                            <div key={field.name} className="flex flex-col gap-2">
                                <label className="label-style text-white">{field.label}</label>
                                <input
                                    type="text"
                                    name={field.name}
                                    value={entry[field.name] || ""}
                                    className="form-style"
                                    onChange={(e) => handleInputChange(e, index)}
                                    disabled={!entry.editable}
                                />
                            </div>
                        ))}

                        {/* Display document image */}
                        <div className="flex flex-col gap-2 col-span-2">
                            <label className="label-style text-white">Document Image</label>
                            <img
                                src={entry.document_image}
                                alt="Document"
                                className="w-32 h-32 rounded-md"
                            />
                        </div>

                        {/* Dropdown for actions */}
                        <div className="flex flex-col gap-2 col-span-2">
                            <label className="label-style text-white">Academic Action</label>
                            <select
                                value={academicActions}
                                onChange={(e) => handleAcademicActionChange(e, index)}
                                className="form-style"
                                disabled={!entry.editable}
                            >
                                <option value="">--Select Action--</option>
                                {statusOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>

                            {/* Remark field, displayed only when "Remark" is selected */}
                            {/* {academicActions[index] === "Remark" && ( */}
                                <div className="flex flex-col gap-2 col-span-2">
                                    <label className="label-style text-white">Academic Remark</label>
                                    <input
                                        type="text"
                                        name="remark"
                                        value={entry.remark || ""}
                                        onChange={(e) => handleRemark(e, index)}
                                        placeholder="Enter remark"
                                        className="form-style"
                                        disabled={!entry.editable}
                                    />
                                </div>
                            {/* )} */}
                        </div>

                        {/* Toggle edit and update buttons */}
                        <div className="flex gap-4 mt-4 col-span-2">
                            {entry.editable ? <FcCancel
                                onClick={() => toggleEdit(index)}
                                className="w-9 h-9 rounded-full p-1 cursor-pointer hover:text-red-800 hover:bg-red-300"
                                style={{
                                    fill: "red",
                                }}
                            /> : <AiOutlineEdit
                                onClick={() => toggleEdit(index)}
                                className="w-9 h-9 rounded-full p-1 cursor-pointer hover:text-red-800 hover:bg-red-300"
                                style={{
                                    fill: "blue",
                                }}
                            />}
                            {entry.editable && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => handleUpdate(index)}
                                        className="p-2 bg-blue-500 text-white rounded-md w-32"
                                    >
                                       Education Update
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleActionSave()}
                                        className="p-2 bg-blue-500 text-white rounded-md w-32"
                                    >
                                      Status  Update 
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
