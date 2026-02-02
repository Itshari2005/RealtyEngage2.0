import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
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

const iconMap = {
  Plumber: <FaWater />,
  Electrician: <FaBolt />,
  "AC Technician": <FaSnowflake />,
  Carpenter: <FaDoorOpen />,
  Painter: <FaPaintRoller />,
  Gardener: <FaTree />,
  Housekeeping: <FaBroom />,
  Security: <FaShieldAlt />,
  "General Maintenance": <FaTools />,
  "Property Manager": <FaBuilding />,
};

export default function Maintenance() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    fetchMaintenanceMembers();
  }, []);

  const fetchMaintenanceMembers = async () => {
    try {
      const { data } = await api.get("/maintenance/members");

      // Group by category
      const grouped = data.reduce((acc, member) => {
        acc[member.category] = acc[member.category] || {
          category: member.category,
          tier: member.tier,
          icon: iconMap[member.category],
          persons: [],
        };

        acc[member.category].persons.push(member);
        return acc;
      }, {});

      setCategories(Object.values(grouped));
    } catch (error) {
      console.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-10">Maintenance Services</h1>

      {/* Category grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {categories.map((item) => (
          <button
            key={item.category}
            onClick={() => {
              setSelected(item);
              setActiveCategory(item.category);
            }}
            className={`p-6 rounded-2xl transition-all duration-300
              ${
                activeCategory === item.category
                  ? "bg-indigo-600 text-white shadow-2xl scale-105 ring-4 ring-indigo-300"
                  : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-lg hover:shadow-xl hover:-translate-y-1"
              }`}
          >
            <div
              className={`text-3xl mb-2 ${
                activeCategory === item.category
                  ? "text-white"
                  : "text-indigo-600 dark:text-indigo-400"
              }`}
            >
              {item.icon}
            </div>

            <h3 className="font-semibold">{item.category}</h3>
            <p
              className={`text-sm ${
                activeCategory === item.category
                  ? "text-indigo-100"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {item.tier}
            </p>
          </button>
        ))}
      </div>

      {/* Members */}
      {selected && (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {selected.persons.map((p) => (
            <div
              key={p._id}
              className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white"
            >
              <h3 className="text-xl font-bold mb-2">{p.name}</h3>
              <p><b>Cost:</b> {p.cost}</p>
              <p>
                <b>Phone:</b>{" "}
                <a href={`tel:${p.phone}`} className="underline">
                  {p.phone}
                </a>
              </p>
              <p>
                <b>Email:</b>{" "}
                <a href={`mailto:${p.email}`} className="underline">
                  {p.email}
                </a>
              </p>
              <p><b>Address:</b> {p.address}</p>

              <div className="mt-4 flex gap-3">
                <a
                  href={`https://wa.me/91${p.phone}`}
                  target="_blank"
                  className="bg-green-500 px-3 py-1 rounded text-sm"
                >
                  WhatsApp
                </a>

                <button
                    onClick={() =>
                        navigate(`/customer/maintenance/request/${p._id}`)
                    }
                    className="bg-white text-indigo-700 px-3 py-1 rounded text-sm"
                >
                    Raise Request
                </button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
