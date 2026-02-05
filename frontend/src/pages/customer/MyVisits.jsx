import { useEffect, useState } from "react";
import API from "../../api/api";

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
        <div key={v._id} className="border p-4 mb-3 rounded shadow">
          <p><b>Project:</b> {v.project?.name || "Project not available"}</p>
          <p>{v.date} | {v.time}</p>
          <p>Status: <b>{v.status}</b></p>
        </div>
      ))}
    </div>
  );
}
