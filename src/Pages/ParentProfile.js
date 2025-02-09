import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getClientById } from '../Services/apIServices';

export default function ParentProfile() {
    const [tutors, setTutors] = useState([]);
    const [status, setStatus] = useState('');
    const [filteredTutors, setfilteredTutors] = useState([]);
    const [clientData, setClientData] = useState({});
    const [editable, setEditable] = useState(false);
    const token = localStorage.getItem('token') || '';

    useEffect(() => {
        const fetchTutors = async () => {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/get_users`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const filteredTutors = response.data.data.filter(
                    (tutor) => tutor.user_type === 'client'
                );
                setfilteredTutors(filteredTutors);
                setTutors(filteredTutors);
            } catch (error) {
                console.error('Error fetching tutors:', error);
            }
        };
        fetchTutors();
    }, [token]);

    const handleTutorSelect = async (teacherId) => {
        try {
            const response = await getClientById(teacherId);
            setClientData(response?.data);
            console.log(response?.data);

            setEditable(false); // Disable editing initially
        } catch (error) {
            console.error('Error fetching tutor details:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setClientData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUpdateClient = async () => {
        try {
            const formData = new FormData();
            Object.entries(clientData).forEach(([key, value]) => {
                formData.append(key, value ?? ''); // Replace null or undefined with an empty string
            });
            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/update_client_profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success('Client updated successfully!');
            setEditable(false); // Disable editing after update
        } catch (error) {
            toast.error('Failed to update client.');
            console.error('Error updating client:', error);
        }
    };

    return (
        <div className="flex flex-col">
            <header className="bg-[#2C8E71] text-white p-4">
                <h1 className="text-xl font-bold">Client</h1>
            </header>
            <main className="p-4">
                <div className="flex mb-4">
                    <div>
                        <label htmlFor="statusSelect" className="block mb-2">
                            Select Status:
                        </label>
                        <select
                            id="statusSelect"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="border p-2"
                        >
                            <option value="">--Select Status--</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="ml-4">
                        <label htmlFor="tutorSelect" className="block mb-2">
                            Select Client:
                        </label>
                        <select
                            id="tutorSelect"
                            onChange={(e) => handleTutorSelect(e.target.value)}
                            className="border p-2"
                        >
                            <option value="">--Select Client--</option>
                            {filteredTutors.map((tutor) => (
                                <option key={tutor.id} value={tutor.id}>
                                    {tutor.first_name} {tutor.last_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {clientData && clientData.id && (
                    <div className="my-4 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-[#2C8E71] p-8 px-12">
                        <h2 className="text-lg font-bold mb-4">Client Details</h2>
                        <form className="">
                            <div className="flex flex-col gap-5 lg:flex-row">
                                <div className="flex flex-col gap-2 lg:w-[100%]">
                                    <label htmlFor="firstName" className="label-style text-white">First Name</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={clientData.first_name || ''}
                                        onChange={handleInputChange}
                                        className="form-style"
                                        disabled={!editable}
                                    />
                                </div>
                                <div className="flex flex-col gap-2 lg:w-[100%]">
                                    <label htmlFor="lastName" className="label-style text-white">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="last_name"
                                        value={clientData.last_name || ''}
                                        placeholder="Enter last name"
                                        className="form-style"
                                        onChange={handleInputChange}
                                        disabled={!editable}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-5 lg:flex-row">
                                <div className="flex flex-col gap-2 lg:w-[100%]">
                                    <label className="label-style text-white mt-2">Gender</label>
                                    <select
                                        name="gender"
                                        value={clientData.gender || ''}
                                        onChange={handleInputChange}
                                        className="form-style"
                                        disabled={!editable}
                                    >
                                        <option value="">--Select Gender--</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2 lg:w-[100%]">
                                    <label className="label-style mt-2 text-white">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={clientData.address || ''}
                                        onChange={handleInputChange}
                                        className="form-style"
                                        disabled={!editable}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-5 lg:flex-row">
                                <div className="flex flex-col gap-2 lg:w-[100%]">
                                    <label htmlFor="pin_code" className="label-style text-white">Pin Code</label>
                                    <input
                                        type="text"
                                        name="pin_code"
                                        value={clientData.pin_code || ''}
                                        onChange={handleInputChange}
                                        className="form-style"
                                        disabled={!editable}
                                    />
                                </div>
                                <div className="flex flex-col gap-2 lg:w-[100%]">
                                    <label htmlFor="details" className="label-style text-white">Details</label>
                                    <input
                                        type="text"
                                        id="details"
                                        name="details"
                                        value={clientData.details || ''}
                                        placeholder="Enter details"
                                        className="form-style"
                                        onChange={handleInputChange}
                                        disabled={!editable}
                                    />
                                </div>
                            </div>



                            <div className="col-span-2 flex gap-4 mt-4">
                                {!editable ? (
                                    <button
                                        type="button"
                                        className="bg-blue-500 text-white p-2 rounded"
                                        onClick={() => setEditable(true)}
                                    >
                                        Edit
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="bg-green-500 text-white p-2 rounded"
                                        onClick={handleUpdateClient}
                                    >
                                        Save
                                    </button>
                                )}
                                {editable && (
                                    <button
                                        type="button"
                                        className="bg-red-500 text-white p-2 rounded"
                                        onClick={() => setEditable(false)}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}
