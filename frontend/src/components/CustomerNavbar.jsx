import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaBars, FaUser, FaMoon, FaSun, FaBell } from "react-icons/fa";
import API from "../api/api";

export default function CustomerNavbar() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [notifications, setNotifications] = useState([]);
    const [notifOpen, setNotifOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setProfileOpen(false);
                setNotifOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const fetchNotifications = async () => {
        try {
            const { data } = await API.get("/notifications", {
                headers: {
                    "Cache-Control": "no-cache",
                },
            });
            setNotifications(data);
        } catch (err) {
            console.error(err);
        }
    };

    const markAsRead = async (id) => {
        console.log("Clicked notification:", id);
        try {
            await API.put(`/notifications/${id}/read`);
            await fetchNotifications();
        // update UI instantly
    } catch (err) {
        console.error(err);
    }
};

    return (
        <nav className="bg-blue-900 dark:bg-gray-900 text-white dark:text-gray-200 p-4 flex justify-between items-center relative">
            {/* Brand */}
            <div className="text-xl font-bold md:text-2xl">Realty Engage Customer Portal</div>

            {/* Mobile menu button */}
            <div className="md:hidden">
                <button onClick={() => setOpen(!open)} className="text-2xl">
                    <FaBars />
                </button>
            </div>

            {/* Nav Links */}
            <ul
                className={`md:flex md:items-center md:space-x-6 absolute md:static left-0 w-full md:w-auto bg-blue-900 dark:bg-gray-900 md:bg-transparent transition-all duration-300 ease-in-out ${open ? "top-16" : "-top-96"} md:top-auto`}
            >
                <li><Link to="/customer/home" className="block p-2 hover:text-blue-300 dark:hover:text-blue-400">Home</Link></li>
                <li> <Link to="/customer/maintenance" className="block p-2 hover:text-blue-300 dark:hover:text-blue-400">Maintenance</Link></li>
                <li><Link to="/customer/projects" className="block p-2 hover:text-blue-300 dark:hover:text-blue-400">Projects</Link></li>
                <li><Link to="/customer/enquery" className="block p-2 hover:text-blue-300 dark:hover:text-blue-400">Enquiries</Link></li>
                <li><Link to="/customer/support" className="block p-2 hover:text-blue-300 dark:hover:text-blue-400">Support</Link></li>
                <li><Link to="/customer/my-visits" className="block p-2 hover:text-blue-300 dark:hover:text-blue-400">My Visits</Link></li>

                <li ref={dropdownRef} className="relative">
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-2 p-2 hover:text-blue-300 dark:hover:text-blue-400 focus:outline-none"
                    >
                        <FaUser /> Profile
                        <span>{profileOpen ? "▲" : "▼"}</span>
                    </button>

                    {/* Dropdown menu */}
                    <ul
                        className={`absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden transition-all duration-200 ${profileOpen ? "block opacity-100" : "hidden opacity-0"
                            } z-50`}
                    >
                        <li>
                            <Link
                                to="/customer/enquiries"
                                className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                My Enquiries
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/customer/payments"
                                className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                My Payments
                            </Link>
                        </li>
                        <li>
  <Link
    to="/customer/wishlist"
    className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
  >
    My Wishlist
  </Link>
</li>
                        <li>
                            <Link
                                to="/customer/profile"
                                className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Edit Profile
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/login"
                                onClick={(e) => {
                                    e.preventDefault();
                                    logout();
                                }}
                                className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Logout
                            </Link>
                        </li>

                    </ul>
                </li>

                <li className="relative">
    <button
        onClick={() => {
            const newState = !notifOpen
            setNotifOpen(newState);
            setProfileOpen(false); // close profile dropdown if open

            if(newState){
                fetchNotifications(); // refresh notifications when opening
            }
        }}

        className="relative p-2 hover:text-blue-300"
    >
        <FaBell className="text-xl" />

        {/* 🔴 Unread badge */}
        {notifications.filter(n => !n.read).length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded-full">
                {notifications.filter(n => !n.read).length}
            </span>
        )}
    </button>

    {/* 📜 Dropdown */}
    {notifOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 z-50">
            <h3 className="font-bold mb-2 text-black dark:text-white">
                Notifications
            </h3>

            {notifications.length === 0 ? (
                <p className="text-sm text-gray-500">No notifications</p>
            ) : (
                notifications.map((n) => (
  <div
    key={n._id}
    onClick={() => markAsRead(n._id)}
    className={`p-3 mb-2 rounded-lg text-sm cursor-pointer transition flex justify-between items-center ${
      n.read
        ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        : "bg-blue-600 text-white hover:bg-blue-700"
    }`}
  >
    <span className="font-medium">{n.message}</span>

    {!n.read && (
      <span className="w-2 h-2 bg-white rounded-full"></span>
    )}
  </div>
))
            )}
        </div>
    )}
</li>

                {/* Dark mode toggle */}
                <li>
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="px-3 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition flex items-center gap-2"
                    >
                        {darkMode ? <FaMoon /> : <FaSun />}
                        {darkMode ? "Dark" : "Light"}
                    </button>
                </li>

                {/* Logout */}
                
            </ul>
        </nav>
    );
}
