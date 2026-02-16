import { useEffect, useState } from "react";
import API from "../../api/api";
import { toast } from "react-hot-toast";

const statusStyle = {
  requested: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function Visits() {
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    const { data } = await API.get("/visits/admin");
    setVisits(data);
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/visits/${id}`, { status });
      toast.success(`Visit ${status}`);
      fetchVisits();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Visit Management</h1>

      {visits.length === 0 ? (
        <p>No visit requests yet.</p>
      ) : (
        <div className="grid gap-4">
          {visits.map((v) => (
            <div
              key={v._id}
              className="bg-white p-5 rounded-xl shadow border"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg">
                  {v.project?.name}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    statusStyle[v.status]
                  }`}
                >
                  {v.status.toUpperCase()}
                </span>
              </div>

              {/* Details */}
              <p className="text-sm text-gray-700">
                <b>Customer:</b> {v.customer?.name} ({v.customer?.email})
              </p>
              <p className="text-sm text-gray-700">
                <b>Date:</b> {v.date} | <b>Time:</b> {v.time}
              </p>

              {/* Actions */}
              <div className="flex gap-3 mt-4">
                {v.status === "requested" && (
                  <button
                    onClick={() => updateStatus(v._id, "approved")}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                )}

                {v.status === "approved" && (
                  <button
                    onClick={() => updateStatus(v._id, "completed")}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Mark Completed
                  </button>
                )}

                {v.status !== "completed" && v.status !== "cancelled" && (
                  <button
                    onClick={() => updateStatus(v._id, "cancelled")}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
