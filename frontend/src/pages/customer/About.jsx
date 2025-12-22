import {
    FaBuilding,
    FaUsers,
    FaShieldAlt,
    FaHandshake,
    FaTools,
    FaHome,
    FaPhoneAlt,
    FaChartLine,
} from "react-icons/fa";

export default function About() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-colors duration-500">

            {/* HERO */}
            <section className="max-w-7xl mx-auto px-6 py-24 text-center">
                <span className="inline-block px-4 py-2 mb-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-medium">
                    About Realty Engage
                </span>

                <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    A Smarter Way to Manage Your Property
                </h1>

                <p className="max-w-4xl mx-auto text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                    Realty Engage is an all-in-one real estate customer portal built to simplify
                    property ownership, maintenance coordination, payments, and communication.
                    Everything you need — in one powerful, easy-to-use platform.
                </p>
            </section>

            {/* STATS */}
            <section className="max-w-7xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { icon: <FaHome />, label: "Properties Managed", value: "250+" },
                        { icon: <FaUsers />, label: "Happy Residents", value: "5,000+" },
                        { icon: <FaTools />, label: "Service Providers", value: "150+" },
                        { icon: <FaChartLine />, label: "Tickets Resolved", value: "20K+" },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="p-8 rounded-3xl bg-white dark:bg-gray-800 shadow-lg text-center"
                        >
                            <div className="text-3xl text-indigo-600 dark:text-indigo-400 mb-3">
                                {stat.icon}
                            </div>
                            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
                                {stat.value}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* MISSION & VISION */}
            <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12">
                <div className="p-10 rounded-3xl bg-white dark:bg-gray-800 shadow-xl">
                    <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                        Our Mission
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                        To eliminate chaos in property management by creating a transparent,
                        efficient, and digital-first ecosystem where residents, managers, and
                        service providers collaborate seamlessly.
                    </p>
                </div>

                <div className="p-10 rounded-3xl bg-white dark:bg-gray-800 shadow-xl">
                    <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                        Our Vision
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                        To become the most trusted real estate engagement platform,
                        redefining how communities manage properties and services through
                        technology and trust.
                    </p>
                </div>
            </section>

            {/* CORE VALUES */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <h2 className="text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white">
                    Our Core Values
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        {
                            icon: <FaBuilding />,
                            title: "Real Estate Focused",
                            desc: "Built specifically for residential and commercial communities.",
                        },
                        {
                            icon: <FaUsers />,
                            title: "People First",
                            desc: "Designed around residents, owners, and managers.",
                        },
                        {
                            icon: <FaShieldAlt />,
                            title: "Secure by Design",
                            desc: "Your data, payments, and communication are protected.",
                        },
                        {
                            icon: <FaHandshake />,
                            title: "Trust & Transparency",
                            desc: "Verified vendors, clear pricing, and accountability.",
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="p-8 rounded-3xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all text-center"
                        >
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-2xl">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                                {item.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* WHY CHOOSE US */}
            <section className="max-w-7xl mx-auto px-6 py-24">
                <div className="rounded-3xl  p-16 shadow-2xl">
                    <h2 className="text-4xl font-bold mb-10 text-center">
                        Why Choose Realty Engage?
                    </h2>

                    <div className="grid md:grid-cols-3 gap-10 text-lg">
                        <p>✔ One dashboard for maintenance, payments & communication</p>
                        <p>✔ Verified plumbers, electricians, gardeners & more</p>
                        <p>✔ Faster issue resolution & transparent tracking</p>
                        <p>✔ Secure digital records & payment history</p>
                        <p>✔ Designed for modern gated communities</p>
                        <p>✔ 24/7 access across devices</p>
                    </div>
                </div>
            </section>

            
        </div>
    );
}
