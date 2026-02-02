import { useEffect, useState } from "react";
import API from "../../api/api";
import { toast } from "react-hot-toast";

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
      toast.success("Status updated");
      fetchVisits();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Visit Requests</h1>

      {visits.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        visits.map((v) => (
          <div key={v._id} className="border p-4 rounded mb-4 shadow">
            <p><b>Customer:</b> {v.customer.name} ({v.customer.email})</p>
            <p><b>Project:</b> {v.project.name}</p>
            <p><b>Date:</b> {v.date}</p>
            <p><b>Time:</b> {v.time}</p>
            <p><b>Status:</b> {v.status}</p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => updateStatus(v._id, "approved")}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => updateStatus(v._id, "completed")}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Completed
              </button>

              <button
                onClick={() => updateStatus(v._id, "cancelled")}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
