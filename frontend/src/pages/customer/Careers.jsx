import {
    FaBriefcase,
    FaUsers,
    FaChartLine,
    FaEnvelope,
    FaMapMarkerAlt,
    FaClock,
    FaPhoneAlt,
} from "react-icons/fa";

export default function Careers() {
    return (
        <div className="min-h-screen px-6 py-20 max-w-7xl mx-auto text-gray-800 dark:text-gray-200">

            {/* HEADER */}
            <h1 className="text-5xl font-bold mb-6 text-center">
                Careers at RealtyEngage
            </h1>
            <p className="text-xl text-center max-w-3xl mx-auto mb-16 text-gray-600 dark:text-gray-400">
                Be part of a fast-growing real estate technology platform focused on
                simplifying property management and customer experience.
            </p>

            {/* WHY WORK WITH US */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
                <div className="p-8 rounded-2xl bg-white dark:bg-gray-800 shadow">
                    <FaBriefcase className="text-3xl text-indigo-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Meaningful Work</h3>
                    <p>
                        Build real-world solutions that impact property owners, residents,
                        and service providers every day.
                    </p>
                </div>

                <div className="p-8 rounded-2xl bg-white dark:bg-gray-800 shadow">
                    <FaUsers className="text-3xl text-indigo-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">People First Culture</h3>
                    <p>
                        We value collaboration, ownership, and transparency across all
                        teams.
                    </p>
                </div>

                <div className="p-8 rounded-2xl bg-white dark:bg-gray-800 shadow">
                    <FaChartLine className="text-3xl text-indigo-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Growth & Learning</h3>
                    <p>
                        Continuous learning, mentorship, and clear career progression.
                    </p>
                </div>
            </div>

            {/* OPEN POSITIONS */}
            <h2 className="text-4xl font-bold mb-10 text-center">
                Current Openings
            </h2>

            <div className="grid gap-6 mb-20">

                {/* JOB CARD */}
                <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow flex flex-col md:flex-row justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-semibold mb-2">
                            Frontend Developer (React)
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                            Build modern, responsive dashboards and customer-facing
                            experiences.
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <span className="flex items-center gap-2">
                                <FaMapMarkerAlt /> Chennai
                            </span>
                            <span className="flex items-center gap-2">
                                <FaClock /> Full Time
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Experience</p>
                        <p className="font-semibold">1 – 3 Years</p>
                    </div>
                </div>

                {/* JOB CARD */}
                <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow flex flex-col md:flex-row justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-semibold mb-2">
                            Backend Developer (Node.js)
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                            Develop scalable APIs and services for real estate workflows.
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <span className="flex items-center gap-2">
                                <FaMapMarkerAlt /> Remote
                            </span>
                            <span className="flex items-center gap-2">
                                <FaClock /> Full Time
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Experience</p>
                        <p className="font-semibold">2 – 5 Years</p>
                    </div>
                </div>

                {/* JOB CARD */}
                <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow flex flex-col md:flex-row justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-semibold mb-2">
                            Property Operations Executive
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                            Coordinate property services, vendors, and client communication.
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <span className="flex items-center gap-2">
                                <FaMapMarkerAlt /> Bangalore
                            </span>
                            <span className="flex items-center gap-2">
                                <FaClock /> On-site
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Experience</p>
                        <p className="font-semibold">0 – 2 Years</p>
                    </div>
                </div>

            </div>

            {/* CONTACT CTA */}
            <div className="text-center space-y-4">
                <p className="text-lg">
                    Interested candidates can reach out directly:
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-6 text-indigo-600 dark:text-indigo-400 font-medium">
                    <span className="flex items-center gap-2">
                        <FaEnvelope /> itsjonsnow2004@gmail.com
                    </span>
                    <span className="flex items-center gap-2">
                        <FaPhoneAlt /> +91 93859 94200
                    </span>
                </div>
            </div>

        </div>
    );
}
