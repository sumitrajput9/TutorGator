import axios from "axios";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import { toast } from "react-toastify";

export function TeacherAvailability({ initialData, teacherId }) {
    const [availabilityData, setAvailabilityData] = useState(initialData || []);
    const [editable, setEditable] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [modifiedData, setModifiedData] = useState([]);
    const [newSlot, setNewSlot] = useState({
        date: "",
        day: "",
        slots: [{ tutor_type: "tutors_pod", start_time: "", end_time: "" }],
    });
    const token = localStorage.getItem("token") || "";
    const [addToggle,setAddToggle] = useState(false);

    const handleInputChange = (e, index, slotIndex = null) => {
        const { name, value } = e.target;
        const updatedData = [...availabilityData];
    
        if (slotIndex !== null) {
            // Update the specific slot field
            updatedData[index].slot[slotIndex][name] = value;
        } else {
            // Update dates or days
            updatedData[index][name] = value;
        }
    
        // Find the modified slot data specifically
        const modifiedSlot = slotIndex !== null ? updatedData[index].slot[slotIndex] : null;
    
        // Prepare the modifiedItem to track only the specific modifications
        const modifiedItem = {
            ...updatedData[index],
            slot: slotIndex !== null
                ? updatedData[index].slot.map((slot, i) =>
                      i === slotIndex ? modifiedSlot : slot // Only update the specific slot
                  )
                : updatedData[index].slot,
        };
        setModifiedData((prev) => {
            const existingIndex = prev.findIndex((item) => item.id === updatedData[index].id);
            if (existingIndex !== -1) {
                const updatedPrev = [...prev];
                updatedPrev[existingIndex] = modifiedItem;
                return updatedPrev;
            } else {
                return [...prev, modifiedItem];
            }
        });
    
        setAvailabilityData(updatedData);
    };
    

    const toggleEdit = () => setEditable(!editable);

    const handleUpdate = async () => {
        try {
            console.log(modifiedData, "modifiedData");
    
            const availability = modifiedData[0].slot[0];
            const formData = new FormData();
            formData.append("teacher_id",teacherId);
            formData.append("date", modifiedData[0].date);
            formData.append("day", modifiedData[0].day);
            formData.append("start_time", availability.start_time);
            formData.append("end_time", availability.end_time);
            formData.append("availability", availability.availability);
            formData.append("tutor_type", availability.tutor_type);
            formData.append("slot_name", availability.slot_name);
            formData.append("status",availability.status);
            formData.append("garbage_time",availability.garbage_time);
            formData.append("id",availability.id);
            formData.append("availability_tutor_type",availability.availability_tutor_type);
            formData.append("createdAt",availability.createdAt);
            formData.append("remaining_time",availability.remaining_time);
            formData.append("updatedAt",availability.updatedAt);
            formData.append("travel_time",availability.travel_time);
    
            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/update_slot`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            console.log("Updated Availability Data:", modifiedData);
            setModifiedData([]);
        } catch (error) {
            console.error("Error updating availability:", error);
        }
    };
    

    const handleSlotChange = (index, field, value) => {
        const updatedSlots = [...newSlot.slots];
        updatedSlots[index][field] = value;
        setNewSlot({ ...newSlot, slots: updatedSlots });
    };

    const addSlotField = () => {
        setNewSlot({
            ...newSlot,
            slots: [...newSlot.slots, { tutor_type: "tutors_pod", start_time: "", end_time: "" }],
        });
    };

    const removeSlotField = (index) => {
        const updatedSlots = [...newSlot.slots];
        updatedSlots.splice(index, 1);
        setNewSlot({ ...newSlot, slots: updatedSlots });
    };

    const handleAddSlot = async () => {
        try {
            const formData = new FormData();
            formData.append("teacher_id", teacherId);
            formData.append(
                "availability",
                JSON.stringify([
                    {
                        date: newSlot.date,
                        day: newSlot.day,
                        slots: newSlot.slots.map((slot) => ({
                            tutor_type: slot.tutor_type,
                            start_time: slot.start_time,
                            end_time: slot.end_time,
                        })),
                    },
                ])
            );
    
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/teacher_update_availability`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        // "Content-Type": "multipart/form-data", 
                    },
                }
            );
            const updatedData = [...availabilityData];
            updatedData.push({
                id: response.data.id, 
                date: newSlot.date,
                day: newSlot.day,
                slots: response.data.slot_ids.map((slotId, index) => ({
                    id: slotId,
                    ...newSlot.slots[index], 
                })),
            });
    
            setAvailabilityData(updatedData);
            setNewSlot({
                date: "",
                day: "",
                slots: [{ tutor_type: "tutors_pod", start_time: "", end_time: "" }],
            });
    
            toast.success("Slot added successfully");
        } catch (error) {
            toast.error("Failed to add slot");
            console.error("Error adding slot:", error);
        }
    };
    
    

    const toggleAddSlot = () => {
           setAddToggle(!addToggle);
    }

    const displayedData = showAll ? availabilityData : availabilityData.slice(0, 2);

    return (
        <div className="my-4 flex flex-col gap-y-6 rounded-md border-[1px] border-gray-300 bg-[#2C8E71] p-6">
            <h2 className="text-lg font-semibold text-white">Teacher Availability</h2>

            {displayedData.map((availability, index) => (
                <div key={availability.id} className="flex flex-col gap-4 p-4 border rounded-md bg-[#2C8E71]">
                    <div className="flex flex-col gap-2">
                        <label className="label-style text-white">Dates</label>
                        <input
                            type="text"
                            name="date"
                            value={availability.date}
                            className="form-style"
                            onChange={(e) => handleInputChange(e, index)}
                            disabled={!editable}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="label-style text-white">Days</label>
                        <input
                            type="text"
                            name="day"
                            value={availability.day}
                            className="form-style"
                            onChange={(e) => handleInputChange(e, index)}
                            disabled={!editable}
                        />
                    </div>

                    {availability.slot.map((slot, slotIndex) => (
                        <div key={slot.id} className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="label-style text-white">Start Time</label>
                                <input
                                    type="time"
                                    name="start_time"
                                    value={slot.start_time}
                                    className="form-style"
                                    onChange={(e) => handleInputChange(e, index, slotIndex)}
                                    disabled={!editable}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="label-style text-white">End Time</label>
                                <input
                                    type="time"
                                    name="end_time"
                                    value={slot.end_time}
                                    className="form-style"
                                    onChange={(e) => handleInputChange(e, index, slotIndex)}
                                    disabled={!editable}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="label-style text-white">Availability</label>
                                <select
                                    name="availability"
                                    value={slot.availability}
                                    className="form-style"
                                    onChange={(e) => handleInputChange(e, index, slotIndex)}
                                    disabled={!editable}
                                >
                                    <option value="1">Available</option>
                                    <option value="0">Unavailable</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            ))}

            {availabilityData.length > 2 && (
                <button
                    type="button"
                    onClick={() => setShowAll(!showAll)}
                    className="self-start mt-4 text-blue-500 hover:underline"
                >
                    {showAll ? "Show Less" : "Show More"}
                </button>
            )}

    {addToggle && (
                <div className="flex flex-col gap-4 mt-6">
                    {/* <h3 className="text-lg font-semibold">Add New Slot</h3> */}
                    <div  className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                        <label className="label-style text-white">Date</label>
                        <input
                            type="date"
                            value={newSlot.date}
                            onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                            className="form-style"
                        />
                          </div>
                  
                    <div className="flex flex-col gap-2">
                        <label className="label-style text-white">Day</label>
                        <input
                            type="text"
                            placeholder="Enter day (e.g., Monday)"
                            value={newSlot.day}
                            onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                            className="form-style"
                        />
                    </div>
                    </div>
                    {newSlot.slots.map((slot, index) => (
                        <div key={index} className="grid grid-cols-2 gap-4 items-center">
                            <input
                                type="time"
                                placeholder="Start Time"
                                value={slot.start_time}
                                onChange={(e) => handleSlotChange(index, "start_time", e.target.value)}
                                className="form-style"
                            />
                            <input
                                type="time"
                                placeholder="End Time"
                                value={slot.end_time}
                                onChange={(e) => handleSlotChange(index, "end_time", e.target.value)}
                                className="form-style"
                            />
                            <div className="flex">
                            <AiOutlineDelete
                            onClick={() => removeSlotField(index)}
                            className="w-9 h-9 rounded-full p-1 cursor-pointer hover:text-red-800 hover:bg-red-300"
                            style={{
                                 fill: "red", 
                                }}
                            />
                             <AiOutlinePlus
                              onClick={addSlotField}
                              className="w-9 h-9 rounded-full p-1 cursor-pointer hover:text-red-800 hover:bg-red-300"
                           style={{
                                fill: "grey", 
                            }}
                            />
                          </div>
                            {/* <button
                                type="button"
                                onClick={() => removeSlotField(index)}
                                className="p-2 bg-blue-500 text-white rounded-md w-32"
                            >
                                Remove
                            </button> */}
                        </div>
                    ))}
                <div className="flex flex-col gap-4">
                <div className=""> 
                     <button
                        type="button"
                        onClick={handleAddSlot}
                        className="p-2 bg-blue-500 text-white rounded-md ms-1"
                    >
                        Save Slot
                    </button>
                    </div>
                    </div>
                </div>
            )}

            <div className="flex gap-4">
                {editable ? (
                    <>
                       <button
                        type="button"
                        onClick={handleUpdate}
                        className="p-2 bg-blue-500 text-white rounded-md w-32"
                    >
                        Update
                    </button>
                    <AiOutlinePlus
                    onClick={toggleAddSlot}
                    className="w-9 h-9 rounded-full p-1 cursor-pointer hover:text-red-800 hover:bg-red-300"
                    style={{
                              fill: "grey", 
                          }}
              /></>
                ) : (
                    <>
                    <AiOutlineEdit
                      onClick={toggleEdit}
                      className="w-9 h-9 rounded-full p-1 cursor-pointer hover:text-red-800 hover:bg-red-300"
                      style={{
                                fill: "blue", 
                            }}
                        />

                <AiOutlinePlus
                      onClick={toggleAddSlot}
                      className="w-9 h-9 rounded-full p-1 cursor-pointer hover:text-red-800 hover:bg-red-300"
                      style={{
                                fill: "grey", 
                            }}
                />
                    
                    </>
                    
                )}
            </div>
        </div>
    );
}