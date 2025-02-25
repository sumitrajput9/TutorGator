import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { addTemplate, deleteTemplate, getTeacher, getTemplateById, getUserId, pushNotification, pushNotificationAll, updateTemplate } from "../../Services/apIServices";
import { toast } from "react-toastify";

export const NotificationTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [tutors, setTutors] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("add"); // "add" or "edit"
    const [currentTemplate, setCurrentTemplate] = useState(null);
    const location = useLocation();
    const { id } = location.state;
    const [dropdownVisible, setDropdownVisible] = useState(null);
    const [selectedTutors, setSelectedTutors] = useState([]);
    console.log(process.env.REACT_APP_API_BASE_URL);

    const handleTutorSelection = async (e, tutorId) => {
        if (e.target.checked) {
            // const data = await getUserId(tutorId);
            setSelectedTutors((prev) => [...prev, tutorId]);
        } else {
            setSelectedTutors((prev) => prev.filter((id) => id !== tutorId));
        }
    };
    const toggleDropdown = (templateId) => {
        setDropdownVisible((prev) => (prev === templateId ? null : templateId));
    };

    const sendNotification = async (templateId) => {
        if (selectedTutors.length < 1) {
            const formData = {
                event_id: id,
                user_ids: selectedTutors[0]
            }

            try {
                const data = await pushNotification(formData);
                console.log(data.response.data,"hi");
                
                if (data.success === true) {
                    toast.success("Notification sent successfully");
                }else{
                    toast.error(data.message);
                }
                return;
            } catch (error) {
                    toast.error("Event is either missing or inactive");
            }
        } else {
            const formData = {
                event_id: id,
                user_ids: selectedTutors
            }
            try {
                const data = await pushNotificationAll(formData);
                if (data.success === true) {
                    toast.success("Notification sent successfully");
                }else{
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error("Event is either missing or inactive");
            }

        }

        // Send notification logic
        // console.log('Sending notification for template:', templateId);
        // console.log('Selected tutors:', selectedTutors);

        // Reset state
        setDropdownVisible(null);
        setSelectedTutors([]);
    };
    // Fetch templates
    const fetchTemplates = async () => {
        try {
            const res = await getTemplateById(id);
            setTemplates(res.data);
        } catch (error) {
            console.error("Error fetching templates:", error);
            toast.error("Failed to fetch templates");
        }
    };

    const fetchTutor = async () => {
        try {
            const response = await getTeacher();
            const filteredTutors = response.data.filter(tutor => tutor.user_type === 'teacher' && tutor.status === 'active');
            console.log(filteredTutors);

            setTutors(filteredTutors);
        } catch (error) {
            console.log(error);

        }
    }
    useEffect(() => {
        fetchTutor();
    }, [])

    // Delete template
    const handleDelete = async (templateId) => {
        try {
            await deleteTemplate(templateId);
            setTemplates((prev) => prev.filter((template) => template.id !== templateId));
            toast.success("Template deleted successfully");
        } catch (error) {
            console.error("Error deleting template:", error);
            toast.error("Failed to delete template");
        }
    };

    // Open modal for editing a template
    const handleEdit = (templateId, template) => {
        setModalType("edit");
        setCurrentTemplate({ ...template, template_id: templateId });
        setIsModalOpen(true);
    };

    // Open modal for adding a new template
    const handleAdd = () => {
        setModalType("add");
        setCurrentTemplate(null);
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentTemplate(null);
    };

    // Save template (add or edit)
    const handleSave = async (formData) => {
        try {
            if (modalType === "edit") {
                await updateTemplate(currentTemplate.id, { ...formData, event_id: id });
                toast.success("Template updated successfully");
            } else {
                const res = await addTemplate({ ...formData, event_id: id });
                setTemplates((prev) => [...prev, res.data]);
                toast.success("Template added successfully");
            }
            closeModal();
            fetchTemplates();
        } catch (error) {
            console.error("Error saving template:", error);
            toast.error("Failed to save template");
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, [id]);

    return (
        <>
            <div className="bg-[#2C8E71]">
                <div className="flex justify-between items-center p-2">
                    <h1 className="text-xl font-semibold text-white">Notification Templates</h1>
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        style={{ backgroundColor: "#2C8E71" }}
                        onClick={handleAdd}
                    >
                        Add Template
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-3 ms-2">
                {/* {templates.map((template) => (
                    <div key={template.id} className="bg-[#2C8E71] shadow-lg rounded-lg p-4">
                        <h2 className="text-lg font-semibold mb-2">{template.title}</h2>
                        <p className="text-sm text-gray-600">Type: {template.template_type}</p>
                        <p className="text-sm text-gray-600">Content: {template.content}</p>
                        <div className="mt-4 flex justify-between">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={() => handleEdit(template)}
                            >
                                Edit
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            // onClick={() => handleSend()}
                            >
                                Send Notification
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                onClick={() => handleDelete(template.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))} */}
                {templates.map((template) => (
                    <div key={template.id} className="bg-[#2C8E71] shadow-lg rounded-lg p-4">
                        <h2 className="text-lg font-semibold mb-2">{template.title}</h2>
                        <p className="text-sm text-gray-600">Type: {template.template_type}</p>
                        <p className="text-sm text-gray-600">Content: {template.content}</p>
                        <div className="mt-4 flex justify-between">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600"
                                onClick={() => handleEdit(template.id, template)}
                            >
                                Edit
                            </button>
                            <div className="relative mt-2">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    onClick={() => toggleDropdown(template.id)}
                                >
                                    Send Notification
                                </button>
                                {dropdownVisible === template.id && (
                                    <div className="absolute bg-white border shadow-lg rounded-lg mt-2 w-full h-[450px] z-10 overflow-y-scroll">
                                        <div className="p-4">
                                            {/* <div className="flex items-center gap-2 mb-4">
                                                <input
                                                    type="checkbox"
                                                    id="select-all"
                                                    checked={selectedTutors.length === tutors.length}
                                                    onChange={(e) => handleSelectAll(e)}
                                                />
                                                <label htmlFor="select-all">Select All</label>
                                            </div> */}
                                            {tutors.map((tutor) => (
                                                <div key={tutor.id} className="flex items-center gap-2 mb-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`tutor-${tutor.id}`}
                                                        value={tutor.id}
                                                        // checked={selectedTutors.includes(tutor.id)}
                                                        onChange={(e) => handleTutorSelection(e, tutor.id)}
                                                    />
                                                    <label htmlFor={`tutor-${tutor.id}`}>
                                                        {tutor.first_name} {tutor.last_name}
                                                    </label>
                                                </div>
                                            ))}
                                            <button
                                                className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-600"
                                                style={{ backgroundColor: "#2C8E71" }}
                                                onClick={() => sendNotification(template.id)}
                                            >
                                                Send
                                            </button>

                                        </div>
                                    </div>
                                )}
                            </div>


                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-2"
                                onClick={() => handleDelete(template.id)}
                                style={{ backgroundColor: "#D6B57F" }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}


            </div>
            {isModalOpen && (
                <TemplateModal
                    modalType={modalType}
                    template={currentTemplate}
                    onClose={closeModal}
                    onSave={handleSave}
                />
            )}
        </>
    );
};




export const TemplateModal = ({ modalType, template, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: template?.title || "",
        content: template?.content || "",
        category: template?.category || "",
        template_type: template?.template_type || "",
        slug_code: template?.slug_code || "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h2 className="text-xl font-semibold mb-4">
                    {modalType === "edit" ? "Edit Template" : "Add Template"}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border px-4 py-2 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium">Content</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            className="w-full border px-4 py-2 rounded"
                            required
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium">Category</label>
                        <textarea
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full border px-4 py-2 rounded"
                            required
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium">Template Type</label>
                        <select
                            name="template_type"
                            value={formData.template_type}
                            onChange={handleChange}
                            className="w-full border px-4 py-2 rounded"
                            required
                        >
                            <option value="" disabled>Select Template Type</option>
                            <option value="push_notification">Push Notification</option>
                            <option value="sms">SMS</option>
                            <option value="mail">Mail</option>
                            <option value="in_app">Real Time</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium">Slug Code</label>
                        <textarea
                            name="slug_code"
                            value={formData.slug_code}
                            onChange={handleChange}
                            className="w-full border px-4 py-2 rounded"
                            required
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
