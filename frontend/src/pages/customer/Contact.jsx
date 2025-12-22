import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 
                    dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 
                    px-6 py-24 transition-colors duration-500">

            {/* HEADER */}
            <div className="max-w-5xl mx-auto text-center mb-16">
                <span className="inline-block px-4 py-2 mb-4 rounded-full 
                         bg-indigo-100 dark:bg-indigo-900/40 
                         text-indigo-700 dark:text-indigo-300 text-sm font-medium">
                    Get in Touch
                </span>

                <h1 className="text-5xl font-bold mb-6 
                       bg-gradient-to-r from-gray-900 to-gray-700 
                       dark:from-white dark:to-gray-300 
                       bg-clip-text text-transparent">
                    Contact RealtyEngage
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    We’re here to help you with property services, support requests,
                    and platform-related queries.
                </p>
            </div>

            {/* CONTACT CARDS */}
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">

                {/* PHONE */}
                <div className="group p-8 rounded-3xl bg-white dark:bg-gray-800 shadow-lg 
                        hover:shadow-2xl hover:-translate-y-1 transition-all text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl 
                          bg-indigo-100 dark:bg-indigo-900/40 
                          flex items-center justify-center 
                          text-indigo-600 dark:text-indigo-400 
                          text-2xl group-hover:scale-110 transition-transform">
                        <FaPhoneAlt />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        +91 93859 94200
                    </p>
                </div>

                {/* EMAIL */}
                <div className="group p-8 rounded-3xl bg-white dark:bg-gray-800 shadow-lg 
                        hover:shadow-2xl hover:-translate-y-1 transition-all text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl 
                          bg-indigo-100 dark:bg-indigo-900/40 
                          flex items-center justify-center 
                          text-indigo-600 dark:text-indigo-400 
                          text-2xl group-hover:scale-110 transition-transform">
                        <FaEnvelope />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        itsjonsnow2004@gmail.com
                    </p>
                </div>

                {/* LOCATION */}
                <div className="group p-8 rounded-3xl bg-white dark:bg-gray-800 shadow-lg 
                        hover:shadow-2xl hover:-translate-y-1 transition-all text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl 
                          bg-indigo-100 dark:bg-indigo-900/40 
                          flex items-center justify-center 
                          text-indigo-600 dark:text-indigo-400 
                          text-2xl group-hover:scale-110 transition-transform">
                        <FaMapMarkerAlt />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Coimbatore, Tamil Nadu
                    </p>
                </div>
            </div>

            {/* FOOTER CTA */}
            <div className="max-w-5xl mx-auto text-center mt-20">
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Our support team is available during business hours and responds
                    promptly to all inquiries.
                </p>
            </div>
        </div>
    );
}
