import { useEffect, useState } from "react";
import API from "../../api/api";
import { toast } from "react-hot-toast";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BsBookmarkFill } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch wishlist
  const fetchWishlist = async () => {
    try {
      const { data } = await API.get("/projects/my-wishlist");
      setWishlist(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // 🔹 Remove from wishlist
  const removeFromWishlist = async (projectId) => {
    try {
      const { data } = await API.post(
        `/projects/wishlist-toggle/${projectId}`
      );

      // update UI
      setWishlist((prev) =>
        prev.filter((item) => item._id !== projectId)
      );

      toast.success(data.message);
    } catch (err) {
      toast.error(err.message || "Failed to update wishlist");
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading wishlist...</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">
        My Wishlist
      </h2>

      {wishlist.length === 0 ? (
        // 🔹 EMPTY STATE
        <div className="text-center mt-20">
          <h3 className="text-xl font-semibold mb-2">
            No saved projects yet
          </h3>
          <p className="text-gray-500 mb-4">
            Browse projects and save your favorites here
          </p>
          <Link to="/customer/projects">
            <button className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition">
              Explore Projects
            </button>
          </Link>
        </div>
      ) : (
        // 🔹 GRID VIEW
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((project) => (
            <div
              key={project._id}
              className="p-4 border rounded-xl shadow-lg hover:shadow-xl transition relative bg-white dark:bg-gray-800"
            >
              {/* Remove Bookmark */}
              <button
                onClick={() => removeFromWishlist(project._id)}
                className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md hover:scale-110 transition"
              >
                <BsBookmarkFill className="text-blue-600 text-lg" />
              </button>

              {/* Image */}
              {project.image && (
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-48 object-cover mb-4 rounded"
                />
              )}

              {/* Info */}
              <h3 className="text-xl font-bold mb-1">
                {project.name}
              </h3>

              <p>
                <strong>Area:</strong> {project.area}
              </p>

              <p>
                <strong>Status:</strong> {project.status}
              </p>

              <p className="mt-2 font-semibold">
                ₹ {project.price}
              </p>

              {/* Location */}
              {project.location && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    project.location
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 flex items-center gap-1 mt-2"
                >
                  <FaMapMarkerAlt /> View Location
                </a>
              )}

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Link to="/customer/enquery">
                  <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                    Enquire
                  </button>
                </Link>

                <Link to={`/customer/visit/${project._id}`}>
                  <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition">
                    Visit
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