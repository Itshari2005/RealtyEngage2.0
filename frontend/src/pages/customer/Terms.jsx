import {
    FaFileContract,
    FaUserCheck,
    FaCreditCard,
    FaExclamationTriangle,
    FaSyncAlt,
    FaGavel,
} from "react-icons/fa";

export default function Terms() {
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
                        Terms & Conditions
                    </h1>

                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Please read these terms carefully before using the RealtyEngage platform.
                    </p>
                </div>

                {/* SECTIONS */}
                <Section
                    icon={<FaUserCheck />}
                    title="User Eligibility & Responsibilities"
                    content={[
                        "Users must provide accurate, complete, and up-to-date information.",
                        "You are responsible for maintaining the confidentiality of your account credentials.",
                        "Any misuse or unauthorized access may result in account suspension.",
                    ]}
                />

                <Section
                    icon={<FaFileContract />}
                    title="Platform Usage"
                    content={[
                        "RealtyEngage is intended solely for property management and related services.",
                        "Users must not misuse the platform for fraudulent or illegal activities.",
                        "We reserve the right to restrict access if misuse is detected.",
                    ]}
                />

                <Section
                    icon={<FaCreditCard />}
                    title="Payments & Transactions"
                    content={[
                        "All payments are subject to verification and confirmation.",
                        "Service charges, fees, and pricing may vary based on service providers.",
                        "Refunds, if applicable, will be processed according to our refund policy.",
                    ]}
                />

                <Section
                    icon={<FaExclamationTriangle />}
                    title="Limitation of Liability"
                    content={[
                        "RealtyEngage acts as a platform connecting users and service providers.",
                        "We are not liable for delays, damages, or service quality issues caused by third parties.",
                        "Users engage service providers at their own discretion and risk.",
                    ]}
                />

                <Section
                    icon={<FaSyncAlt />}
                    title="Changes to Terms"
                    content={[
                        "We may update these Terms & Conditions from time to time.",
                        "Changes will be effective immediately upon posting on the platform.",
                        "Continued use of the platform constitutes acceptance of revised terms.",
                    ]}
                />

                <Section
                    icon={<FaGavel />}
                    title="Governing Law"
                    content={[
                        "These terms shall be governed by and construed in accordance with Indian laws.",
                        "Any disputes shall be subject to the exclusive jurisdiction of courts in Chennai.",
                    ]}
                />

                {/* FOOTER NOTE */}
                <div className="mt-20 p-8 rounded-3xl bg-white dark:bg-gray-800 shadow-lg text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        By continuing to use RealtyEngage, you acknowledge that you have read,
                        understood, and agreed to these Terms & Conditions.
                    </p>
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
