import { useNavigate } from "react-router-dom"

function LandingPage() {
  const navigate = useNavigate()

  const handleNavigation = (role) => {
    if (role === "Tutor") {
      navigate("/dashboard/profile-approval")
    } else if (role === "Parent") {
      navigate("/dashboard/parent/profile")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome</h2>
        <p className="text-lg text-gray-600 mb-6">Choose Your Role</p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleNavigation("Tutor")}
            className="py-3 px-6 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition"
          >
          Tutor
          </button>

          <button
            onClick={() => handleNavigation("Tutor")}
            className="py-3 px-6 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition"
          >
           Client
          </button>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
