import "../App.css";
import Logo from "../assets/Logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// reads the user's details from the JWT token saved at login
function getUser() {
    const token = localStorage.getItem("token");
    const firstName = localStorage.getItem("firstName");

    if (!token) return null;

    return { firstName };
}

function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(getUser());
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("firstName");
        setUser(null);
        setOpen(false);
        navigate("/");
    };

    return (
        <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-20 py-2">
            <img className="h-24" src={Logo} alt="Logo" />

            <ul className="flex gap-8 font-medium text-gray-700">
                <li className="cursor-pointer hover:text-emerald-600">Home</li>
                <li className="cursor-pointer hover:text-emerald-600">Courses</li>
                <li className="cursor-pointer hover:text-emerald-600">About</li>
                <li className="cursor-pointer hover:text-emerald-600">Contact</li>
            </ul>

            {user ? (
                <div className="relative">
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-50 px-5 py-2 font-medium text-emerald-700 transition-all duration-200 hover:bg-emerald-100"
                    >
                        Welcome, {user.firstName} <span className="text-xs">{open ? "▲" : "▼"}</span>
                    </button>

                    {open && (
                        <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    navigate("/profile");
                                }}
                                className="block w-full cursor-pointer px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                            >
                                My Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                className="block w-full cursor-pointer px-4 py-3 text-left text-sm font-medium text-red-500 hover:bg-red-50"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex items-center gap-4">
                    <button onClick={()=>{
                        navigate("/login")
                    }}className="hover:scale-103 transition-all duration-200 cursor-pointer font-medium text-gray-800 hover:text-emerald-600">
                        Sign In
                    </button>
                    <button onClick={()=>{
                        navigate("/signup")
                    }} className="hover:scale-103 transition-all duration-200 cursor-pointer rounded-lg bg-emerald-600 px-5 py-2 font-medium text-white hover:bg-emerald-700">
                        Sign Up
                    </button>
                </div>
            )}
        </nav>
    );
}

export default Navbar;