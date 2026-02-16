import { useEffect, useState } from "react";
import API from "../../api/api";

const getStatusColor = (status) => {
  switch (status) {
    case "approved":
      return "text-green-600";
    case "completed":
      return "text-blue-600";
    case "cancelled":
      return "text-red-600";
    default:
      return "text-yellow-600"; // requested / pending
  }
};


export default function MyVisits() {
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    const { data } = await API.get("/visits/my");
    setVisits(data);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Visits</h1>

      {visits.map((v) => (
        <div
  key={v._id}
  className="bg-white p-5 mb-4 rounded-xl shadow border"
>
  <h3 className="text-lg font-bold mb-2">
    {v.project?.name || "Project not available"}
  </h3>

  <p className="text-sm text-gray-600 mb-1">
    📅 {v.date} | ⏰ {v.time}
  </p>

  <p className={`font-semibold mb-3 ${getStatusColor(v.status)}`}>
    Status: {v.status?.toUpperCase()}
  </p>

  {/* ✅ Visit Status Timeline */}
  <div className="flex items-center gap-4 text-sm">
    <span className="text-green-600">✔ Requested</span>
    <span className={v.status !== "requested" ? "text-green-600" : "text-gray-400"}>
      ✔ Approved
    </span>
    <span
      className={
        v.status === "completed"
          ? "text-green-600"
          : "text-gray-400"
      }
    >
      ✔ Completed
    </span>
  </div>
</div>

      ))}
    </div>
  );
}
