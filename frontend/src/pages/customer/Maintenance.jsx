import { useState } from "react";
import {
    FaWater,
    FaBolt,
    FaTree,
    FaPaintRoller,
    FaDoorOpen,
    FaBroom,
    FaSnowflake,
    FaShieldAlt,
    FaTools,
    FaBuilding,
} from "react-icons/fa";

const maintenanceData = [
    {
        id: 1,
        icon: <FaWater />,
        category: "Plumber",
        tier: "Tier 1 – Immediate",
        persons: [
            { name: "Ramesh Kumar", cost: "₹500 / visit", phone: "9876511101", email: "ramesh.plumber@gmail.com", address: "Anna Nagar, Chennai" },
            { name: "Suresh B", cost: "₹600 / visit", phone: "9876511102", email: "suresh.plumber@gmail.com", address: "Velachery, Chennai" },
            { name: "Manikandan R", cost: "₹700 / visit", phone: "9876511103", email: "mani.plumber@gmail.com", address: "Tambaram, Chennai" },
        ],
    },
    {
        id: 2,
        icon: <FaBolt />,
        category: "Electrician",
        tier: "Tier 1 – Immediate",
        persons: [
            { name: "Arun V", cost: "₹400 / visit", phone: "9876522201", email: "arun.electric@gmail.com", address: "T Nagar, Chennai" },
            { name: "Prakash M", cost: "₹550 / visit", phone: "9876522202", email: "prakash.electric@gmail.com", address: "Guindy, Chennai" },
            { name: "Senthil K", cost: "₹650 / visit", phone: "9876522203", email: "senthil.electric@gmail.com", address: "Porur, Chennai" },
        ],
    },
    {
        id: 3,
        icon: <FaSnowflake />,
        category: "AC Technician",
        tier: "Tier 2 – Scheduled",
        persons: [
            { name: "Ajith R", cost: "₹800 / service", phone: "9876533301", email: "ajith.ac@gmail.com", address: "OMR, Chennai" },
            { name: "Karthik S", cost: "₹900 / service", phone: "9876533302", email: "karthik.ac@gmail.com", address: "ECR, Chennai" },
            { name: "Vimal P", cost: "₹1000 / service", phone: "9876533303", email: "vimal.ac@gmail.com", address: "Medavakkam, Chennai" },
        ],
    },
    {
        id: 4,
        icon: <FaDoorOpen />,
        category: "Carpenter",
        tier: "Tier 2 – Scheduled",
        persons: [
            { name: "Mohan L", cost: "₹600 / visit", phone: "9876544401", email: "mohan.carp@gmail.com", address: "Ashok Nagar, Chennai" },
            { name: "Gopi N", cost: "₹700 / visit", phone: "9876544402", email: "gopi.carp@gmail.com", address: "Vadapalani, Chennai" },
            { name: "Dinesh R", cost: "₹800 / visit", phone: "9876544403", email: "dinesh.carp@gmail.com", address: "KK Nagar, Chennai" },
        ],
    },
    {
        id: 5,
        icon: <FaPaintRoller />,
        category: "Painter",
        tier: "Tier 3 – On Request",
        persons: [
            { name: "Selvam K", cost: "₹15 / sq.ft", phone: "9876555501", email: "selvam.paint@gmail.com", address: "Avadi, Chennai" },
            { name: "Ravi M", cost: "₹18 / sq.ft", phone: "9876555502", email: "ravi.paint@gmail.com", address: "Ambattur, Chennai" },
            { name: "Nagaraj S", cost: "₹20 / sq.ft", phone: "9876555503", email: "nagaraj.paint@gmail.com", address: "Padi, Chennai" },
        ],
    },
    {
        id: 6,
        icon: <FaTree />,
        category: "Gardener",
        tier: "Tier 3 – Monthly",
        persons: [
            { name: "Ravi Kumar", cost: "₹800 / month", phone: "9876566601", email: "ravi.garden@gmail.com", address: "OMR, Chennai" },
            { name: "Murugan S", cost: "₹1000 / month", phone: "9876566602", email: "murugan.garden@gmail.com", address: "ECR, Chennai" },
            { name: "Vignesh P", cost: "₹1200 / month", phone: "9876566603", email: "vignesh.garden@gmail.com", address: "Medavakkam, Chennai" },
        ],
    },
    {
        id: 7,
        icon: <FaBroom />,
        category: "Housekeeping",
        tier: "Tier 2 – Scheduled",
        persons: [
            { name: "Lakshmi R", cost: "₹900 / month", phone: "9876577701", email: "lakshmi.hk@gmail.com", address: "Mylapore, Chennai" },
            { name: "Uma S", cost: "₹1100 / month", phone: "9876577702", email: "uma.hk@gmail.com", address: "Adyar, Chennai" },
            { name: "Revathi P", cost: "₹1300 / month", phone: "9876577703", email: "revathi.hk@gmail.com", address: "Besant Nagar, Chennai" },
        ],
    },
    {
        id: 8,
        icon: <FaShieldAlt />,
        category: "Security",
        tier: "Tier 1 – Immediate",
        persons: [
            { name: "Raghavan", cost: "₹15000 / month", phone: "9876588801", email: "raghavan.sec@gmail.com", address: "Perungudi, Chennai" },
            { name: "Anand", cost: "₹16000 / month", phone: "9876588802", email: "anand.sec@gmail.com", address: "Sholinganallur, Chennai" },
            { name: "Bala", cost: "₹17000 / month", phone: "9876588803", email: "bala.sec@gmail.com", address: "Thoraipakkam, Chennai" },
        ],
    },
    {
        id: 9,
        icon: <FaTools />,
        category: "General Maintenance",
        tier: "Tier 2 – Scheduled",
        persons: [
            { name: "Sathish", cost: "₹500 / visit", phone: "9876599901", email: "sathish.main@gmail.com", address: "Chromepet, Chennai" },
            { name: "Kannan", cost: "₹600 / visit", phone: "9876599902", email: "kannan.main@gmail.com", address: "Pallavaram, Chennai" },
            { name: "Raju", cost: "₹700 / visit", phone: "9876599903", email: "raju.main@gmail.com", address: "Tambaram, Chennai" },
        ],
    },
    {
        id: 10,
        icon: <FaBuilding />,
        category: "Property Manager",
        tier: "Tier 3 – Escalation",
        persons: [
            { name: "Sridhar Iyer", cost: "₹3000 / request", phone: "9876600001", email: "sridhar.pm@gmail.com", address: "Nungambakkam, Chennai" },
            { name: "Praveen R", cost: "₹3500 / request", phone: "9876600002", email: "praveen.pm@gmail.com", address: "Egmore, Chennai" },
            { name: "Karthikeyan", cost: "₹4000 / request", phone: "9876600003", email: "karthi.pm@gmail.com", address: "Kilpauk, Chennai" },
        ],
    },
];

export default function Maintenance() {
    const [selected, setSelected] = useState(null);
    const [activeId, setActiveId] = useState(null);


    return (
        <div className="max-w-7xl mx-auto px-6 py-16">
            <h1 className="text-4xl font-bold mb-10">Maintenance Services</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {maintenanceData.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => {
                            setSelected(item);
                            setActiveId(item.id);
                        }}
                        className={`p-6 rounded-2xl transition-all duration-300
    ${activeId === item.id
                                ? "bg-indigo-600 text-white shadow-2xl scale-105 ring-4 ring-indigo-300"
                                : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-lg hover:shadow-xl hover:-translate-y-1"
                            }
  `}
                    >


                    <div
  className={`text-3xl mb-2 transition-colors
    ${activeId === item.id ? "text-white" : "text-indigo-600 dark:text-indigo-400"}
  `}
>
  {item.icon}


                        
                        </div>

                        <h3 className="font-semibold">{item.category}</h3>
                        <p className={`text-sm ${activeId === item.id ? "text-indigo-100" : "text-gray-500 dark:text-gray-400"}`}>
                            {item.tier}
                        </p>

                    </button>
                ))}
            </div>

            {selected && (
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {selected.persons.map((p, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
                            <h3 className="text-xl font-bold mb-2">{p.name}</h3>
                            <p><b>Cost:</b> {p.cost}</p>
                            <p><b>Phone:</b> {p.phone}</p>
                            <p><b>Email:</b> {p.email}</p>
                            <p><b>Address:</b> {p.address}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
