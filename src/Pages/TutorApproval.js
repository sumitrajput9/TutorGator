import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TeacherIdentifications } from './TutorComponent/teacherIdentification';
import { TeacherAcademic } from './TutorComponent/teacherAcademic';
import { TeacherEmployment } from './TutorComponent/teacherEmp';
import { TeacherBio } from './TutorComponent/teacherBio';
import { TeacherEducation } from './TutorComponent/teacherEducation';
import { TeacherAvailability } from './TutorComponent/teacherAvailability';
import { toast } from 'react-toastify';
import { AiOutlineEdit } from 'react-icons/ai';
import { Button } from 'bootstrap';

export default function TutorApproval() {
    const [tutors, setTutors] = useState([]);
    const [selectedTutor, setSelectedTutor] = useState(null);
    const [tutorDetails, setTutorDetails] = useState({});
    const [tutorProfile, setTutorProfile] = useState([]);
    const [status, setStatus] = useState('');
    const [remark, setRemark] = useState('');
    const [filteredTutors, setfilteredTutors] = useState([]);
    const token = localStorage.getItem('token') || '';
    // Separate states for each section
    const [teacherInfo, setTeacherInfo] = useState([]);
    const [teacherIdentifications, setTeacherIdentifications] = useState([]);
    const [teacherAcademic, setTeacherAcademic] = useState([]);
    const [teacherEmp, setTeacherEmp] = useState([]);
    const [teacherBio, setTeacherBio] = useState([]);
    const [teacherEdu, setTeacherEdu] = useState([]);
    const [teacherAvail, setTeacherAvail] = useState([]);
    const [statusOptionss] = useState(["Approve", "Reject", 'profile incomplete', 'pending activation', 'suspended']);

    const [profileAction, setProfileAction] = useState('');
    const [profileRemark, setProfileRemark] = useState('');
    const [tutorstatus, setTutorStatus] = useState('');
    // State for academic section action and remark
    const [academicAction, setAcademicAction] = useState('');
    const [academicRemark, setAcademicRemark] = useState('');
    const [teacherId, setTeacherId] = useState('');
    // State for selected action and remark input
    const [selectedAction, setSelectedAction] = useState("");
    const [editable, setEditable] = useState(false);
    const [initialTeacherInfo, setIntialTeacherInfo] = useState([]);
    const [userId, setUserId] = useState('');

    const [showButtons, setShowButtons] = useState(false);
    const [price, setPrice] = useState(null);
    const [tutorType, setTutorType] = useState([]);
    const [priceData, setPriceData] = useState([]);
    const [priceOptions, setPriceOptions] = useState([]);
    const [selectedPriceOptions, setSelectedPriceOptions] = useState([]);
    const [isIdentification, setIsIdentification] = useState(false);
    const [isAcademic, setIsAcademic] = useState(false);
    const [isEmp, setIsEmp] = useState(false);
    const [isBio, setIsBio] = useState(false);
    const [isEdu, setIsEdu] = useState(false);
    const [isAvail, setIsAvail] = useState(false);
    useEffect(() => {
        const fetchTutors = async () => {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/get_users`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });

                const filteredTutors = response.data.data.filter(tutor => tutor.user_type === 'teacher');
                setfilteredTutors(filteredTutors);
                setTutors(filteredTutors);
            } catch (error) {
                console.error('Error fetching tutors:', error);
            }
        };
        fetchTutors();
    }, [token]);

    const fetchTutorType = async () => {
        try {
            const tutorTypeData = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/get_tutor_type`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })
            setTutorType(tutorTypeData?.data?.data);
        } catch (error) {
            console.error('Error fetching tutors:', error);
        }

    }
    useEffect(() => {
        fetchTutorType();
    }, [token])

    // Fetch tutor details when a tutor is selected
    const handleTutorSelect = async (teacherId) => {
        try {
            setShowButtons(false);
            setTeacherId(teacherId);
            const data = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/get_teacher_info_by_user_id`, { user_id: teacherId }, // Data payload
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            if (data?.data?.success === true) {
                setTeacherIdentifications(data?.data?.data?.teacher_identification);
                setTeacherAcademic({
                    ...data?.data?.data?.teacher_academic,
                    user_id: teacherId
                });
                setTeacherEmp({
                    ...data?.data?.data?.teacher_employment,
                    user_id: teacherId
                });
                setTeacherEdu(data?.data?.data?.teachers_education);

                setUserId(data?.data?.data?.teacher_bio?.teacher_id)
                setTeacherBio({
                    ...data?.data?.data?.teacher_bio,
                    user_id: teacherId
                });
                setTeacherInfo(data?.data?.data?.teacher_info);
                setIntialTeacherInfo(data?.data?.data?.teacher_info)
                setTeacherAvail(data?.data?.data?.teachers_availability)
                if (data?.data?.data?.teacher_info?.price) {
                    const priceData = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/get_price_slab_by_id/${data.data.data.teacher_info.price}`, {}, { // Third parameter for config
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setPrice(priceData?.data?.data?.price)
                }

            }

            // }
            // setTutorDetails(response?.data?.data);
            setSelectedTutor(teacherId);
        } catch (error) {
            console.error('Error fetching tutor details:', error);
        }
    };

    // Handle approval/rejection
    const handleApproval = async (action, event) => {
        event.preventDefault();
        console.log(action);
        console.log(remark);
        const formData = new FormData();
        formData.append("teacher_id", selectedTutor);
        formData.append("status", action);
        formData.append("remark", remark);
        formData.append("editable", "false");
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/cms_tutor_profile`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            alert(response.data.message);
            setStatus(''); // Reset status
            setRemark(''); // Reset remark
        } catch (error) {
            console.error('Error updating tutor status:', error);
        }
    };

    const statusOptions = ['profile incomplete', 'pending activation', 'suspended', 'active', 'Deactivated'];
    // let filteredTutorss = tutors.filter(tutor => tutor.status === status);
    // setfilteredTutors(filteredTutorss);
    useEffect(() => {
        if (status) {
            const filteredByStatus = tutors.filter(tutor => tutor.status === status);
            setfilteredTutors(filteredByStatus);
        } else {
            setfilteredTutors(tutors);
        }
    }, [tutors, status]);

    const handleActionChange = (event) => {
        const action = event.target.value;
        setSelectedAction(action);
        if (action !== "Remark") {
            setRemark(""); // Clear remark if action is not "Remark"
        }
    };

    const handleProfileActionChange = (e) => {
        const action = e.target.value;
        setProfileAction(action);

        if (action === "Remark") {
            // setProfileAction(""); // Reset tutor status if "Remark" is selected
        } else if (action === "Approved") {
            setProfileAction("Active");
        } else if (action === "Rejected") {
            setProfileAction("Deactivated");
        }

        // Clear profileRemark if action is not "Remark"
        if (action !== "Remark") {
            setProfileRemark('');
        }
    };

    const handleProfileRemarkChange = (e) => {
        setProfileRemark(e.target.value);
    };

    const handleAcademicRemarkChange = (e) => {
        setAcademicRemark(e.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Selected Action:", selectedAction);
        if (selectedAction === "Remark") {
            console.log("Remark:", remark);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTeacherInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };
    // profileSaved
    const handleProfile = async () => {
        const formData = new FormData();
        console.log(profileAction);
        let status = '';
        if (profileAction === 'Approve') {
            status = 'active'
        } else if (profileAction === 'Reject') {
            status = 'inactive'
        } else {
            status = profileAction
        }

        formData.append('teacher_id', teacherInfo?.id);
        formData.append('tutor_status', status);
        formData.append('remark', profileRemark);
        formData.append('editable', "false"); // Set editable to "false" as required

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cms_tutor_profile`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                toast.success('Profile updated successfully');
                if (data.data === null) {
                    const updatedProfile = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/get_teacher_info_by_user_id`, { user_id: teacherId }, // Data payload
                        { // Third parameter for config
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                    // const profileData = await updatedProfile.json();
                    // console.log('Updated profile data:', profileData);
                }

            } else {
                console.error('Error updating profile:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const toggleEdit = () => {
        setEditable(!editable);
    };

    const handleUpdate = async () => {
        const formData = new FormData();

        formData.append("user_id", teacherInfo.user_id);
        // formData.append("first_name", "sumit");
        formData.append('email', teacherInfo.email);
        formData.append('mobile', teacherInfo.mobile);
        Object.entries(teacherInfo).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== initialTeacherInfo[key]) {
                formData.append(key, value);
            }
        });
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/teacher_update_profile`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            toast.success("Profile updated successfully!");
            setEditable(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error("Failed to update profile. Please try again.");
        }
    };



    const handleTutorSubmit = async (e) => {
        e.preventDefault();
        try {
            if (tutorstatus === 'active') {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_BASE_URL}/cms_tutor_approval`,
                    { teacher_id: userId, status: tutorstatus },
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            } else {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_BASE_URL}/cms_tutor_status_change`,
                    { teacher_id: userId, status: tutorstatus },
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            }
            alert("Tutor status updated successfully!");
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update tutor status.");
        }
    };

    const handleSelct = (e) => {
        setStatus(e.target.value)
        setTutorStatus(e.target.value);
        setShowButtons(true);
    }
    const getTutorTypeName = (price) => {
        const tutorTypes = tutorType.find(item => item.price_slab === price);
        return tutorTypes ? tutorTypes.name : "";
    };


    return (
        <div className="flex flex-col">
            {/* Header */}
            <header className="bg-[#2C8E71] text-white p-4 m-0">
                <h1 className="text-xl font-bold text-White">Tutor Approval</h1>
            </header>
            {/* Main Content */}
            <main className="p-4">
                <h2 className='text-xl font-bold text-[#2C8E71]'>Welcome to the Tutor Profile</h2>
                <div className='flex'>
                    <div>
                        <label htmlFor="statusSelect" className="block mb-2">Select Status:</label>
                        <select
                            id="statusSelect"
                            value={status}
                            onChange={handleSelct}
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
                    <div>
                        <div className="ms-2">
                            <label htmlFor="tutorSelect" className="block mb-2">Select Tutor:</label>
                            <select
                                id="tutorSelect"
                                onChange={(e) => handleTutorSelect(e.target.value)}
                                className="border p-2"
                            >
                                <option value="">--Select Tutor--</option>
                                {filteredTutors.map((tutor) => (
                                    <option key={tutor.id} value={tutor.id}>
                                        {tutor.first_name} {tutor.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                </div>
                <div className='flex'>
                    {showButtons && (
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            {filteredTutors.map((tutor) => (
                                <button
                                    key={tutor.id}
                                    className="p-3 bg-[#2C8E71] text-white rounded-md shadow hover:bg-blue-600 transition"
                                    onClick={() => handleTutorSelect(tutor.id)}
                                >
                                    {tutor.first_name} {tutor.last_name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                {selectedTutor && (
                    <div className="mt-4">
                        <h3 className="font-bold">Tutor Details</h3>
                        <form onSubmit={handleSubmit}>
                            {/* Profile Information */}
                            <div className="my-4 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-[#2C8E71] p-8 px-12">
                                <h2 className="text-lg font-semibold text-white me-2">Profile Information</h2>
                                <div className="flex flex-col gap-5 lg:flex-row">
                                    <div className="flex flex-col gap-2 lg:w-[48%]">
                                        <label htmlFor="firstName" className="label-style text-white">First Name</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="first_name"
                                            value={teacherInfo.first_name}
                                            placeholder="Enter first name"
                                            className="form-style"
                                            onChange={handleInputChange}
                                            disabled={!editable}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 lg:w-[48%]">
                                        <label htmlFor="lastName" className="label-style text-white">Last Name</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="last_name"
                                            value={teacherInfo.last_name}
                                            placeholder="Enter last name"
                                            className="form-style"
                                            onChange={handleInputChange}
                                            disabled={!editable}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-5 lg:flex-row">
                                    <div className="flex flex-col gap-2 lg:w-[48%]">
                                        <label htmlFor="address" className="label-style text-white">Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            id="address"
                                            value={teacherInfo.address}
                                            placeholder="Enter address"
                                            className="form-style"
                                            onChange={handleInputChange}
                                            disabled={!editable}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 lg:w-[48%]">
                                        <label htmlFor="price" className="label-style text-white">Price Paid by Client</label>
                                        <input
                                            type="text"
                                            name="price"
                                            id="price"
                                            value={price}
                                            placeholder="Enter price"
                                            className="form-style"
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </div>
                                </div>
                                {/* Additional fields */}
                                <div className="flex flex-col gap-5 lg:flex-row">
                                    <div className="flex flex-col gap-2 lg:w-[48%]">
                                        <label htmlFor="tutoringPrice" className="label-style text-white">Tutoring Price</label>
                                        <input
                                            type="text"
                                            name="tutoring_price"
                                            id="tutoringPrice"
                                            value={teacherInfo.tutoring_price}
                                            placeholder="Enter tutoring price"
                                            className="form-style"
                                            onChange={handleInputChange}
                                            disabled={!editable}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 lg:w-[48%]">
                                        <label htmlFor="dob" className="label-style text-white">Date of Birth</label>
                                        <input
                                            type="date"
                                            name="dob"
                                            id="dob"
                                            value={teacherInfo.dob}
                                            className="form-style"
                                            onChange={handleInputChange}
                                            disabled={!editable}
                                        />
                                    </div>
                                </div>

                                {/* Transport Mode, Location, Status */}
                                <div className="flex flex-col gap-5 lg:flex-row">
                                    <div className="flex flex-col gap-2 lg:w-[48%]">
                                        <label htmlFor="transportMode" className="label-style text-white">Transport Mode</label>
                                        <input
                                            type="text"
                                            name="transport_mode"
                                            id="transportMode"
                                            value={teacherInfo.transport_mode}
                                            placeholder="Enter transport mode"
                                            className="form-style"
                                            onChange={handleInputChange}
                                            disabled={!editable}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 lg:w-[48%]">
                                        <label htmlFor="location" className="label-style text-white">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            id="location"
                                            value={teacherInfo.location}
                                            placeholder="Enter location"
                                            className="form-style"
                                            onChange={handleInputChange}
                                            disabled={!editable}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-5 lg:flex-row">
                                    <div className="flex flex-col gap-2 lg:w-[48%]">
                                        <label htmlFor="pinCode" className="label-style text-white">Pin Code</label>
                                        <input
                                            type="text"
                                            name="pin_code"
                                            id="pinCode"
                                            value={teacherInfo.pin_code}
                                            placeholder="Enter pin code"
                                            className="form-style"
                                            onChange={handleInputChange}
                                            disabled={!editable}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 lg:w-[48%]">
                                        <label htmlFor="status" className="label-style text-white">Status</label>
                                        <input
                                            type="text"
                                            name="status"
                                            id="status"
                                            // disabled
                                            value={teacherInfo.tutor_status}
                                            placeholder="Enter status"
                                            className="form-style"
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </div>
                                </div>


                                <div className="flex flex-col gap-5 lg:flex-row">
                                    <div className="flex flex-col gap-2 lg:w-[48%]">
                                        <label htmlFor="signupType" className="label-style text-white">Signup Type</label>
                                        <input
                                            type="text"
                                            name="signup_type"
                                            id="signupType"
                                            value={teacherInfo.signup_type}
                                            placeholder="Enter signup type"
                                            className="form-style"
                                            onChange={handleInputChange}
                                            disabled={!editable}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 lg:w-[48%]">
                                        <label htmlFor="mobileType" className="label-style text-white">Mobile Type</label>
                                        <input
                                            type="text"
                                            name="mobile_type"
                                            id="mobileType"
                                            value={teacherInfo.mobile_type}
                                            placeholder="Enter mobile type"
                                            className="form-style"
                                            onChange={handleInputChange}
                                            disabled={!editable}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-5 lg:flex-row">
                                    <div className="flex flex-col gap-2 lg:w-[48%]">
                                        <label htmlFor="tutorTypeName" className="label-style text-white">Tutor Type Name</label>
                                        <select
                                            name="tutor_type_name"
                                            id="tutorTypeName"
                                            value={teacherInfo.price} // Assuming price corresponds to price_slab
                                            className="form-style"
                                            onChange={handleInputChange}
                                            disabled
                                        >
                                            <option value="">Select Tutor Type</option>
                                            {tutorType.map((type) => (
                                                <option key={type.id} value={type.price_slab}>
                                                    {type.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2 lg:w-[48%]">
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

                                </div>


                                {/* Remark */}
                                <div className="flex flex-col lg:flex-row gap-5">
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
                                </div>

                                {/* Action buttons */}
                                <div className="flex gap-4 mt-4">
                                    <div>
                                        <button
                                            type="button"
                                            onClick={handleProfile}
                                            className="p-2 bg-blue-500 text-white rounded-md w-32"
                                        // disabled={!editable}
                                        >
                                            Status Update
                                        </button>
                                    </div>
                                    <div>
                                        {editable ? (
                                            <button
                                                type="button"
                                                onClick={handleUpdate}
                                                className="p-2 bg-blue-500 text-white rounded-md w-32"
                                            >
                                                Update
                                            </button>
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
                            </div>

                            <button
                                type='button'
                                className="p-2 bg-blue-500 text-white rounded-md w-32"
                                onClick={() => setIsIdentification(!isIdentification)}
                            >
                                Teacher Identifications
                            </button>

                            {isIdentification && (
                                <TeacherIdentifications
                                    initialData={teacherIdentifications}
                                    teacherId={userId}
                                    editable={false}
                                />
                            )}
                            <button
                                type='button'
                                className="p-2 ms-2 bg-blue-500 text-white rounded-md w-32"
                                onClick={() => setIsAcademic(!isAcademic)}
                            >
                                Teacher Academic
                            </button>

                            {isAcademic && (
                                <TeacherAcademic
                                    initialData={teacherAcademic}
                                    editable={false}
                                />
                            )
                            }
                            <button
                                type='button'
                                className="p-2 ms-2 bg-blue-500 text-white rounded-md w-32"
                                onClick={() => setIsEmp(!isEmp)}
                            >
                                Teacher Employment
                            </button>

                            {isEmp && (
                                <TeacherEmployment
                                    initialData={teacherEmp}
                                    editable={false}
                                />
                            )}
                            <button
                                type='button'
                                className="p-2 ms-2 bg-blue-500 text-white rounded-md w-32"
                                onClick={() => setIsBio(!isBio)}
                            >
                                Teacher Biodata
                            </button>
                            {isBio && (
                                <TeacherBio
                                    initialData={teacherBio}
                                    editable={false}
                                />
                            )}
                            <button
                                type='button'
                                className="p-2 ms-2 bg-blue-500 text-white rounded-md w-32"
                                onClick={() => setIsEdu(!isEdu)}
                            >
                                Teacher Education
                            </button>
                            {isEdu && (
                                <TeacherEducation
                                    initialData={teacherEdu}
                                    editable={false}
                                    userId={teacherId}
                                    teacherId={userId}
                                />
                            )}
                            <button
                                type='button'
                                className="p-2 ms-2 bg-blue-500 text-white rounded-md w-32"
                                onClick={() => setIsAvail(!isAvail)}
                            >
                                Teacher Availability
                            </button>
                            {isAvail && (
                                <TeacherAvailability
                                    initialData={teacherAvail}
                                    teacherId={userId}
                                />
                            )}
                        </form>
                        <div className="mt-4 p-6 bg-gray-100 rounded-md">
                            <h2 className="text-lg font-semibold mb-4">Change Tutor Status</h2>
                            <form
                                onSubmit={handleTutorSubmit}
                                className="flex justify-between items-center gap-4"
                            >
                                <div className="flex flex-col">
                                    <label className="block font-medium">Status</label>
                                    <select
                                        value={tutorstatus}
                                        onChange={(e) => setTutorStatus(e.target.value)}
                                        className="form-style p-2 border rounded-md"
                                        required
                                    >
                                        <option value="">--Select Status--</option>
                                        <option value="profile incomplete">Profile Incomplete</option>
                                        <option value="pending activation">Pending Activation</option>
                                        <option value="active">Active</option>
                                        <option value="suspended">Suspended</option>
                                        <option value="inactive">Inactive</option>
                                    </select>

                                </div>
                                <div><button
                                    type="submit"
                                    className="p-2 bg-blue-500 text-white rounded-md"
                                >
                                    Submit
                                </button></div>

                            </form>
                        </div>
                    </div>
                )}


            </main>
        </div>
    );
}
