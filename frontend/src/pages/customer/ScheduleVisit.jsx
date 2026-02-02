import { useState } from "react";
import API from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function ScheduleVisit() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async () => {
    try {
      await API.post("/visits", {
        projectId,
        date,
        time,
        notes,
      });

      toast.success("Visit scheduled");
      navigate("/customer/home");
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Schedule Visit</h2>

      <input
        type="date"
        className="border p-2 w-full mb-3"
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        type="time"
        className="border p-2 w-full mb-3"
        onChange={(e) => setTime(e.target.value)}
      />

      <textarea
        placeholder="Notes"
        className="border p-2 w-full mb-3"
        onChange={(e) => setNotes(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white w-full py-2 rounded"
      >
        Submit
      </button>
    </div>
  );
}
