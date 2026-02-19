import { useEffect, useState } from "react";
import API from "../../api/api";
import { FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");


    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem("token");
                const { data } = await API.get("/projects", {
                    params: { searchTerm, status: statusFilter, minPrice, maxPrice },
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProjects(data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch projects");
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [searchTerm, statusFilter, minPrice, maxPrice]);

    const handleReserve = async (project) => {
        try {
            const token = localStorage.getItem("token");

            await API.post(
                "/payments/reserve",
                {
                    projectId: project._id,
                    tokenAmount: 25000, // fixed token
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast.success("Unit reserved successfully (Token ₹25,000)");
        } catch (err) {
            console.error(err);
            toast.error("Reservation failed");
        }
    };

    // ✅ NEW — EMI plan creator
  const handleEMI = async (project) => {
  try {
    const token = localStorage.getItem("token");

    await API.post(
      "/payments/emi",
      {
        projectId: project._id,
        totalAmount: project.price,
        months: project.emiMonths,
        downPayment: project.minDownPayment,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    toast.success("EMI plan created");
  } catch (err) {
        console.error(err.response?.data || err.message);
        toast.error("EMI creation failed");
  }
};


    if (loading) return <p className="text-center mt-10">Loading projects...</p>;
    const filteredProjects = projects.filter((project) => {
    const matchesSearch =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.area.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
        statusFilter === "" || project.status === statusFilter;

    const matchesMin =
        minPrice === "" || project.price >= Number(minPrice);

    const matchesMax =
        maxPrice === "" || project.price <= Number(maxPrice);

    return matchesSearch && matchesStatus && matchesMin && matchesMax;
});

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Projects</h2>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
  <input
    type="text"
    placeholder="Search by name or area"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="border p-2 rounded"
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="border p-2 rounded"
  >
    <option value="">All Status</option>
    <option value="upcoming">Upcoming</option>
    <option value="in-progress">In Progress</option>
    <option value="completed">Completed</option>
  </select>

  <input
    type="number"
    placeholder="Min Price"
    value={minPrice}
    onChange={(e) => setMinPrice(e.target.value)}
    className="border p-2 rounded"
  />

  <input
    type="number"
    placeholder="Max Price"
    value={maxPrice}
    onChange={(e) => setMaxPrice(e.target.value)}
    className="border p-2 rounded"
  />
</div>

            {projects.length === 0 ? (
                <p>No projects available.</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <div
                            key={project._id}
                            className="p-4 border rounded-xl shadow-lg hover:shadow-xl transition relative"
                        >
                            {project.image && (
                                <img
                                    src={project.image}
                                    alt={project.name}
                                    className="w-full h-48 object-cover mb-4 rounded"
                                />
                            )}
                            <h3 className="text-xl font-bold mb-1">{project.name}</h3>
                            <p><strong>Area:</strong> {project.area}</p>
                            <p><strong>Status:</strong> {project.status}</p>
                            <p className="mt-4"><strong>Price:</strong> {project.price}</p>
                            <p className="mt-2">
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(project.location)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1"
                                >
                                    <FaMapMarkerAlt size={20} /> Location
                                </a>
                            </p>

                            <div className="flex gap-3 mt-4">
                                <Link to="/customer/enquery" className="flex-1">
                                    <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                                        Enquire
                                    </button>
                                </Link>

                                <button
                                    onClick={() => handleReserve(project)}
                                    className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                                >
                                    Reserve Unit
                                </button>

                                <Link to={`/customer/visit/${project._id}`}>
                                    <button className="bg-purple-600 text-white py-2 rounded">
                                        Schedule Visit
                                    </button>
                                </Link>

                                {/* ✅ EMI BUTTON */}
                                <button
                                    onClick={() => handleEMI(project)}
                                    className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                                >
                                    EMI Plan
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
