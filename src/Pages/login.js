import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import assest1 from "../Images/assest1.jpg"; // Ensure correct path
import { login } from "../Services/apIServices";
import { useNavigate } from "react-router";
export default function AdminLoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleOnChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(formData.email, formData.password);
            console.log('Login successful:', data);

            if (data.success) {
                localStorage.setItem('token', data?.data?.remember_token)
                navigate('/dashboard/profile-approval');
            }
        } catch (error) {
            console.error('Login failed:', error);
            // Handle error feedback to the user if necessary
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#2C8E71] px-4">
            <div className="flex flex-col md:flex-row items-center bg-white shadow-xl rounded-2xl overflow-hidden w-full max-w-4xl border border-gray-200">

                {/* Left Side - Image Section */}
                <div className="hidden md:block w-1/2 bg-[#D6B57F]">
                    <img
                        src={assest1}
                        alt="Admin Illustration"
                        className="w-full h-full object-cover rounded-l-2xl"
                    />
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full md:w-1/2 p-10 bg-[#E0E0E0]">
                    <h2 className="text-3xl font-bold text-center mb-3">
                        <span className="text-black">Tutor</span>
                        <span className="text-[#2C8E71]">Gator</span>
                    </h2>

                    <p className="text-sm text-gray-600 text-center mb-6">
                        Access the admin dashboard
                    </p>

                    <form onSubmit={handleOnSubmit} className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Email Address <sup className="text-red-500">*</sup>
                            </label>
                            <input
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleOnChange}
                                placeholder="Enter admin email"
                                className="w-full px-4 py-3 border border-gray-400 rounded-md shadow-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#2C8E71]"
                            />
                        </div>

                        {/* Password Input with Eye Icon */}
                        <div className="relative">
                            <label className="block text-gray-700 font-medium mb-1">
                                Password <sup className="text-red-500">*</sup>
                            </label>
                            <input
                                required
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleOnChange}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 border border-gray-400 rounded-md shadow-sm text-gray-700 bg-white pr-12 focus:outline-none focus:ring-2 focus:ring-[#2C8E71]"
                            />
                            <span
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-4 top-10 cursor-pointer text-gray-600"
                            >
                                {showPassword ? (
                                    <AiOutlineEyeInvisible size={22} />
                                ) : (
                                    <AiOutlineEye size={22} />
                                )}
                            </span>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            className="w-full py-3 bg-[#2C8E71] text-white font-semibold rounded-md shadow-md hover:bg-[#1f7058] transition duration-300"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
