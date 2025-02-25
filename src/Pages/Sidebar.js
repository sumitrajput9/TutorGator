import { LoginOutlined, NotificationImportantOutlined, PaymentOutlined, ReportProblemOutlined } from "@mui/icons-material";
import { useState } from "react";
import { VscSignOut, VscAccount } from "react-icons/vsc";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
    const navigate = useNavigate();
    const [role, setRole] = useState("Tutor"); // Default role

    const handleLogOut = (e) => {
        e.preventDefault();
        localStorage.clear();
        navigate('/login');
    };

    const handleRole = (role) => {
        setRole(role);
        navigate(role === "Tutor" ? "/dashboard/profile-approval" : "/dashboard/parent/profile");
    };

    return (
        <div className="fixed top-0 left-0 flex h-[calc(100vh-3.5rem)] bg-[#E8F9F4] min-w-[220px] max-w-[250px] flex-col border-r border-gray-700 py-3 shadow-lg">
            
            {/* Brand */}
            <h2 className="text-3xl font-bold text-center mb-4">
                <span className="text-black">Tutor</span>
                <span className="text-[#2C8E71]">Gator</span>
            </h2>

            {/* Role Toggle */}
            <div className="flex justify-center gap-2 mb-6">
                {["Tutor", "Parent"].map((r) => (
                    <button
                        key={r}
                        onClick={() => handleRole(r)}
                        className={`px-4 py-2 rounded-md transition-all duration-300 ${
                            role === r ? "bg-[#2C8E71] text-white" : "text-black font-bold hover:bg-gray-300"
                        }`}
                    >
                        {r}
                    </button>
                ))}
            </div>

            {/* Sidebar Links */}
            <div className="flex flex-col">
                {role === "Tutor" ? (
                    <>
                        <SidebarLink to="/dashboard/profile-approval" icon={<VscAccount />} label="Profile & Approval" />
                        <SidebarLink to="/dashboard/tutor/payout" icon={<PaymentOutlined />} label="Payout" />
                        <SidebarLink to="/dashboard/notifications" icon={<NotificationImportantOutlined />} label="Notifications" />
                        <SidebarLink to="/dashboard/tutor/report" icon={<ReportProblemOutlined />} label="Reports" />
                        <SidebarLink to="/dashboard/tutor/login-as" icon={<LoginOutlined />} label="Login-as" />
                    </>
                ) : (
                    <>
                        <SidebarLink to="/dashboard/parent/profile" icon={<VscAccount />} label="Profile" />
                        <SidebarLink to="/dashboard/client/invoice" icon={<VscAccount />} label="Invoice" />
                        <SidebarLink to="/dashboard/client/notifications" icon={<NotificationImportantOutlined />} label="Notifications" />
                        <SidebarLink to="/dashboard/client/report" icon={<ReportProblemOutlined />} label="Reports" />
                        <SidebarLink to="/dashboard/client/login-as" icon={<LoginOutlined />} label="Login-as" />
                    </>
                )}
            </div>

            {/* Divider */}
            <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-gray-700" />

            {/* Logout */}
            <button
                onClick={(e) => handleLogOut(e)}
                className="px-8 py-2 text-sm font-medium text-richblack-300 transition-all hover:bg-gray-300 hover:text-black rounded-md"
            >
                <div className="flex items-center gap-x-2">
                    <VscSignOut className="text-lg" />
                    <span>Logout</span>
                </div>
            </button>
        </div>
    );
}

// Sidebar Link Component (Reusable)
const SidebarLink = ({ to, icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `relative px-8 py-2 text-sm font-medium transition-all duration-300 flex items-center gap-x-2 rounded-md ${
                isActive ? "bg-[#2C8E71] text-white shadow-md" : "text-richblack-300 hover:bg-gray-300 hover:text-black"
            }`
        }
    >
        {icon}<span>{label}</span>
    </NavLink>
);
