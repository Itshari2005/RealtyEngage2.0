import { Link } from "react-router-dom";
import { FaEnvelope, FaInfoCircle, FaFileContract, FaUserShield, FaBriefcase, FaHeart, FaInstagram, FaTwitter, FaLinkedin, FaMapMarkerAlt, FaPhone } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-gray-900 to-black text-gray-300 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl"></div>

            <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

                    {/* BRAND SECTION */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-xl">RE</span>
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                RealtyEngage
                            </h2>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            Smart Real Estate Customer Portal revolutionizing property management and client engagement.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-indigo-600 transition-all duration-300 flex items-center justify-center hover:scale-110">
                                <FaInstagram className="text-lg" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-500 transition-all duration-300 flex items-center justify-center hover:scale-110">
                                <FaTwitter className="text-lg" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-700 transition-all duration-300 flex items-center justify-center hover:scale-110">
                                <FaLinkedin className="text-lg" />
                            </a>
                        </div>
                    </div>

                    {/* QUICK LINKS */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6 pb-2 border-b border-gray-800">Quick Links</h3>
                        <ul className="space-y-4">
                            {[
                                { icon: <FaInfoCircle />, text: "About", to: "/customer/about" },
                                { icon: <FaEnvelope />, text: "Contact", to: "/customer/contact" },
                                { icon: <FaBriefcase />, text: "Careers", to: "/customer/careers" },
                            ].map((item, index) => (
                                <li key={index}>
                                    <Link
                                        to={item.to}
                                        className="flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 group hover:translate-x-2"
                                    >
                                        <span className="text-indigo-400 group-hover:text-indigo-300 group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </span>
                                        <span>{item.text}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6 pb-2 border-b border-gray-800">Legal</h3>
                        <ul className="space-y-4">
                            {[
                                { icon: <FaFileContract />, text: "Terms & Conditions", to: "/customer/terms" },
                                { icon: <FaUserShield />, text: "Privacy Policy", to: "/customer/privacy" },
                            ].map((item, index) => (
                                <li key={index}>
                                    <Link
                                        to={item.to}
                                        className="flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 group hover:translate-x-2"
                                    >
                                        <span className="text-indigo-400 group-hover:text-indigo-300 group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </span>
                                        <span>{item.text}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CONTACT INFO */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6 pb-2 border-b border-gray-800">Contact Info</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400">
                                <FaMapMarkerAlt className="text-indigo-400 mt-1" />
                                <span>123 Business Ave, Coimbatore, <br />Tamil Nadu</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <FaPhone className="text-indigo-400" />
                                <span>+91 93859 94200</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <FaEnvelope className="text-indigo-400" />
                                <span>itsjonsnow2004@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* DIVIDER */}
                <div className="border-t border-gray-800 pt-8 mt-8">
                    <div className="flex flex-col  items-center gap-6">
                        <div className="text-center md:text-left">
                            <p className="text-white-500">
                                &copy; {new Date().getFullYear()} RealtyEngage. All rights reserved.
                            </p>
                            
                        </div>

                        
                    </div>
                </div>
            </div>
        </footer>
    );
}