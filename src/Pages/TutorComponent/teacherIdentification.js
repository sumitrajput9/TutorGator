import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export function TeacherIdentifications({ initialData,teacherId, editable }) {
    const [teacherIdentifications, setTeacherIdentifications] = useState(initialData || {});
    const [academicAction, setAcademicAction] = useState("");
    const [academicRemark, setAcademicRemark] = useState("");
    const [statusOptionss] = useState(["Approve", "Reject", "Remark",'profile incomplete', 'pending activation', 'suspended']);
    const [profileAction, setProfileAction] = useState('');
    const [profileRemark, setProfileRemark] = useState('');
    const token = localStorage.getItem('token') || '';
    const handleFileChange = (e, field) => {
        const files = Array.from(e.target.files);
        setTeacherIdentifications(prevState => ({
            ...prevState,
            [field]: files 
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTeacherIdentifications(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const toggleEdit = () => {
        setTeacherIdentifications(prevState => ({ ...prevState, editable: !prevState.editable }));
    };



      const handleUpdate = async () => {
            const formData = new FormData();
            let teacherAction = '';
            if (profileAction === "Approve") {
                teacherAction = "active";
            } else if (profileAction === "Reject") {
                teacherAction = "inactive";
            } else {
                // teacherAction = "Remark";
                teacherAction = profileAction
            }
            formData.append('teacher_id', teacherId);
            formData.append('tutor_status', teacherAction);
            formData.append('remark',  profileRemark ? profileRemark : '');
            formData.append('editable', "false");
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cms_tutor_identification`, {
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


        const handleEdit = async () => {
            try {
                const formData = new FormData();
    
                Object.entries(teacherIdentifications).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        value.forEach((file, index) => {
                            formData.append(`${key}[${index}]`, file);
                        });
                    } else {
                        formData.append(key, value);
                    }
                });
    
                formData.append("editable", "true");
                formData.append("teacher_id", teacherId);
    
                const response = await axios.post(
                    `${process.env.REACT_APP_API_BASE_URL}/teacher_update_identification`,
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


    const handleProfileActionChange = (e) => {
        const action = e.target.value;
        setProfileAction(action);

        if (action === "Remark") {
        } else if (action === "Approved") {
            setProfileAction("active");
        } else if (action === "Rejected") {
            setProfileAction("inactive");
        }else{
             setProfileAction(action);
        }

        // Clear profileRemark if action is not "Remark"
        if (action !== "Remark") {
            setProfileRemark('');
        }
    };
    const handleProfileRemarkChange = (e) => {
        setProfileRemark(e.target.value);
    };
    return (
        <div className="my-4 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-[#2C8E71] p-8 px-12">
            <h2 className="text-lg font-semibold text-white">Teacher Identifications</h2>

            <div className="flex flex-col gap-4">
                {["wwcc", "license", "passport", "covid_certificate", "nsq_photo_id"].map((field) => (
                    <div key={field} className="flex flex-col gap-2">
                        <label className="label-style text-white">{field.replace('_', ' ').toUpperCase()}</label>
                        <input
                            type="file"
                            name={field}
                            className="form-style"
                            onChange={(e) => handleFileChange(e, field)}
                            disabled={!teacherIdentifications.editable}
                        />
                        {teacherIdentifications[field] && (
                            <img
                                src={typeof teacherIdentifications[field] === 'string' ? teacherIdentifications[field] : URL.createObjectURL(teacherIdentifications[field][0])}
                                alt={`${field} preview`}
                                className="w-[250px] h-[250px] object-cover mt-2"
                            />
                        )}
                    </div>
                ))}

                <div className="flex flex-col gap-2">
                    <label className="label-style text-white">LinkedIn</label>
                    <input
                        type="url"
                        name="linkedin"
                        value={teacherIdentifications.linkedin || ""}
                        className="form-style"
                        onChange={handleInputChange}
                        disabled={!teacherIdentifications.editable}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="label-style text-white">Bank Details</label>
                    <input
                        type="text"
                        name="bank_details"
                        value={teacherIdentifications.bank_details || ""}
                        className="form-style"
                        onChange={handleInputChange}
                        disabled={!teacherIdentifications.editable}
                    />
                </div>

                {/* Additional fields here... */}

                <div className="flex flex-col lg:flex-row gap-5 lg:mt-5">
                    <div className="flex flex-col gap-2 lg:w-[100%]">
                        <label htmlFor="actionSelect" className="label-style text-white">Action</label>
                        <select
                            id="profileAction"
                            value={profileAction}
                            onChange={handleProfileActionChange}
                            className="form-style"
                        >
                            <option value="">--Select Action--</option>
                            {statusOptionss.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* {profileAction === "Remark" && ( */}
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="profileRemark" className="label-style text-white">Remark</label>
                            <input
                                type="text"
                                id="profileRemark"
                                value={profileRemark}
                                onChange={handleProfileRemarkChange}
                                placeholder="Enter your remark"
                                className="form-style"
                            />
                        </div>
                    {/* )} */}
                </div>
                <div className="flex gap-4 mt-4">
                    <div>
                        <button
                            type="button"
                            onClick={handleUpdate}
                            className="p-2 bg-blue-500 text-white rounded-md w-32"
                        // disabled={!editable}
                        >
                         Status Update
                        </button>
                    </div>
                    <div>
                        {teacherIdentifications.editable ? (
                            <button
                                type="button"
                                onClick={handleEdit}
                                className="p-2 bg-blue-500 text-white rounded-md w-32"
                            >
                               Identifications Update
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={toggleEdit}
                                className="p-2 bg-blue-500 text-white rounded-md w-32"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
