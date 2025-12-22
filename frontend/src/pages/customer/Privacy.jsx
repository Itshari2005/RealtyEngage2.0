import {
    FaUserShield,
    FaDatabase,
    FaLock,
    FaShareAlt,
    FaClock,
    FaEnvelope,
} from "react-icons/fa";

export default function Privacy() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50
                    dark:from-gray-950 dark:via-gray-900 dark:to-gray-800
                    px-6 py-24 transition-colors duration-500">

            <div className="max-w-5xl mx-auto">

                {/* HEADER */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 mb-4 rounded-full
                           bg-indigo-100 dark:bg-indigo-900/40
                           text-indigo-700 dark:text-indigo-300 text-sm font-medium">
                        Legal
                    </span>

                    <h1 className="text-5xl font-bold mb-6
                         bg-gradient-to-r from-gray-900 to-gray-700
                         dark:from-white dark:to-gray-300
                         bg-clip-text text-transparent">
                        Privacy Policy
                    </h1>

                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Your privacy matters to us. This policy explains how RealtyEngage
                        collects, uses, and protects your information.
                    </p>
                </div>

                {/* SECTION */}
                <Section
                    icon={<FaDatabase />}
                    title="Information We Collect"
                    content={[
                        "Personal identification details such as name, email address, and contact number.",
                        "Property-related information including project details, enquiries, and service requests.",
                        "Payment and transaction data processed through secure third-party gateways.",
                    ]}
                />

                <Section
                    icon={<FaUserShield />}
                    title="How We Use Your Information"
                    content={[
                        "To provide and manage real estate services efficiently.",
                        "To process transactions and maintain accurate payment records.",
                        "To communicate updates, support responses, and service notifications.",
                    ]}
                />

                <Section
                    icon={<FaShareAlt />}
                    title="Data Sharing & Disclosure"
                    content={[
                        "We do not sell or trade your personal information to third parties.",
                        "Data may be shared only with verified service providers for service fulfillment.",
                        "Legal disclosure may occur if required by law or government authorities.",
                    ]}
                />

                <Section
                    icon={<FaLock />}
                    title="Data Security"
                    content={[
                        "We implement industry-standard encryption and access controls.",
                        "Regular monitoring and security audits are conducted.",
                        "Sensitive data is accessible only to authorized personnel.",
                    ]}
                />

                <Section
                    icon={<FaClock />}
                    title="Data Retention"
                    content={[
                        "Your information is retained only as long as necessary for business operations.",
                        "Data may be retained longer to comply with legal and regulatory obligations.",
                    ]}
                />

                {/* CONTACT */}
                <div className="mt-20 p-8 rounded-3xl bg-white dark:bg-gray-800 shadow-lg text-center">
                    <h3 className="text-2xl font-semibold mb-4">
                        Questions or Concerns?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        If you have any questions about this Privacy Policy, please contact us.
                    </p>
                    <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium">
                        <FaEnvelope /> itsjonsnow2004@gmail.com
                    </div>
                </div>

            </div>
        </div>
    );
}

/* ------------------ REUSABLE SECTION COMPONENT ------------------ */
function Section({ icon, title, content }) {
    return (
        <div className="mb-12 p-8 rounded-3xl bg-white dark:bg-gray-800 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40
                        flex items-center justify-center
                        text-indigo-600 dark:text-indigo-400 text-xl">
                    {icon}
                </div>
                <h2 className="text-2xl font-semibold">{title}</h2>
            </div>

            <ul className="list-disc ml-6 space-y-2 text-gray-600 dark:text-gray-400">
                {content.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>
        </div>
    );
}
