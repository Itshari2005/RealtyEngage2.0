import { useEffect, useState } from "react";
import API from "../../api/api";
import { FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem("token");
                const { data } = await API.get("/projects", {
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
    }, []);

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


    if (loading) return <p className="text-center mt-10">Loading projects...</p>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Projects</h2>

            {projects.length === 0 ? (
                <p>No projects available.</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
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
                            <p className="mt-4"><strong>Price:</strong> {project.priceRange}</p>
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
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
