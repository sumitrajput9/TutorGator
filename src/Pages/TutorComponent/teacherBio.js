import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Assuming react-toastify is used for notifications
import { AiOutlineEdit } from "react-icons/ai";

export function TeacherBio({ initialData }) {
    const [teacherBio, setTeacherBio] = useState(initialData || {});
    const [academicAction, setAcademicAction] = useState("");
    const [academicRemark, setAcademicRemark] = useState("");
    const [statusOptions] = useState(['profile incomplete', 'pending activation', 'suspended','active', 'Deactivated']);
    const API_URL = `${process.env.REACT_APP_API_BASE_URL}/teacher_update_bio`;
    const token = localStorage.getItem("token") || "";
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTeacherBio((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAcademicActionChange = (e) => {
        setAcademicAction(e.target.value);
        if (e.target.value !== "Remark") {
            setAcademicRemark("");
        }
    };

    const handleAcademicRemarkChange = (e) => {
        setAcademicRemark(e.target.value);
    };

    const toggleEdit = () => {
        setTeacherBio((prevState) => ({
            ...prevState,
            editable: !prevState.editable,
        }));
    };

    const handleProfileUpdate = async () => {
        try {
            let status = '';
            if (academicAction === 'Approve') {
                status = 'active';
            } else if (academicAction === 'Reject') {
                status = 'inactive';
            }else{
                 status = academicAction;
            }
            const formData = new FormData();
            formData.append('teacher_id', teacherBio?.teacher_id);
            formData.append('tutor_status', status);
            formData.append('remark', academicRemark);
            formData.append('editable', "false");
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cms_tutor_bio`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (response.status === 200) {
                toast.success("Profile updated successfully!");
                console.log("Response Data:", data);
            } else {
                toast.error("Failed to update profile. Please try again.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append("brief_bio", teacherBio.brief_bio || "");
            formData.append("detailed_bio", teacherBio.detailed_bio || "");
            formData.append("tutor_status", teacherBio.tutor_status || "");
            formData.append("remark", teacherBio.remark || "");
            formData.append("academic_action", academicAction || "");
            formData.append("academic_remark", academicRemark || "");
            formData.append("user_id", teacherBio.user_id);
            formData.append("teacher_id", teacherBio.teacher_id);
            const response = await axios.post(API_URL, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                toast.success("Teacher bio updated successfully!");
                console.log("Response:", response.data);
            }
        } catch (error) {
            console.error("Error updating teacher bio:", error);
            toast.error("Failed to update teacher bio. Please try again.");
        }
    };

    return (
        <div className="my-4 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-[#2C8E71] p-8 px-12">
            <h2 className="text-lg font-semibold text-white">Teacher Bio</h2>

            <div className="grid grid-cols-2 gap-6">
                {[{ label: "Brief Bio", name: "brief_bio" }, { label: "Detailed Bio", name: "detailed_bio" }, { label: "Tutor Status", name: "tutor_status" }, { label: "Remark", name: "remark" }].map((field) => (
                    <div key={field.name} className="flex flex-col gap-2">
                        <label className="label-style text-white" style={{ color: "white" }}>{field.label}</label>
                        <input
                            type="text"
                            name={field.name}
                            value={teacherBio[field.name] || ""}
                            className="form-style"
                            onChange={handleInputChange}
                            disabled={!teacherBio.editable}
                        />
                    </div>
                ))}

                <div className="flex flex-col gap-2 col-span-2">
                    <label className="label-style text-white">Academic Action</label>
                    <select
                        value={academicAction}
                        onChange={handleAcademicActionChange}
                        className="form-style"
                        disabled={!teacherBio.editable}
                    >
                        <option value="">--Select Action--</option>
                        {statusOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                {/* {academicAction === "Remark" && ( */}
                    <div className="flex flex-col gap-2 col-span-2">
                        <label className="label-style text-white">Academic Remark</label>
                        <input
                            type="text"
                            value={academicRemark}
                            onChange={handleAcademicRemarkChange}
                            placeholder="Enter remark"
                            className="form-style"
                            disabled={!teacherBio.editable}
                        />
                    </div>
                {/* )} */}

                <div className="flex gap-4 mt-4">

                    {teacherBio.editable ?
                        <button
                            type="button"
                            className="p-2 bg-blue-500 text-white rounded-md w-32"
                            onClick={() => {
                                // Toggle the edit mode first
                                toggleEdit();

                                // Call the handleProfileUpdate when saving
                                if (teacherBio.editable) {
                                    handleProfileUpdate();
                                }
                            }}
                        >
                           Status Update 
                        </button> :
                        <AiOutlineEdit
                            onClick={() => {
                                // Toggle the edit mode first
                                toggleEdit();

                                // Call the handleProfileUpdate when saving
                                if (teacherBio.editable) {
                                    handleProfileUpdate();
                                }
                            }}
                            className="w-9 h-9 rounded-full p-1 cursor-pointer hover:text-red-800 hover:bg-red-300"
                            style={{
                                fill: "blue",
                            }}
                        />
                    }
                    {/* <button
                        type="button"
                        className="p-2 bg-blue-500 text-white rounded-md w-32"
                        onClick={() => {
                            // Toggle the edit mode first
                            toggleEdit();

                            // Call the handleProfileUpdate when saving
                            if (teacherBio.editable) {
                                handleProfileUpdate();
                            }
                        }}
                    >
                       
                    </button> */}

                    {teacherBio.editable && (
                        <button
                            type="button"
                            className="p-2 bg-blue-500 text-white rounded-md w-32"
                            onClick={handleUpdate}
                        >
                          Bio Update 
                        </button>
                    )}

                </div>
            </div>
        </div>
    );
}
