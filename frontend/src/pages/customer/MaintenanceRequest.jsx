import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import MapPicker from "../../components/MapPicker";

export default function MaintenanceRequest() {
  const { memberId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    issueDescription: "",
    customerPhone: "",
    customerAddress: "",
    location: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLocationSelect = (loc) => {
    setForm({ ...form, location: loc });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/maintenance/request", {
        maintenanceMember: memberId,
        ...form,
      });
      setMessage("Maintenance request submitted successfully");
      setTimeout(() => navigate("/customer/maintenance"), 1500);
    } catch (error) {
      setMessage(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Raise Maintenance Request</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          name="issueDescription"
          placeholder="Describe the issue"
          value={form.issueDescription}
          onChange={handleChange}
          rows="4"
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="text"
          name="customerPhone"
          placeholder="Your Phone Number"
          value={form.customerPhone}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <textarea
          name="customerAddress"
          placeholder="Your Address"
          value={form.customerAddress}
          onChange={handleChange}
          rows="3"
          className="w-full p-3 border rounded"
          required
        />

        {/* Optional map picker */}
        <MapPicker onSelect={handleLocationSelect} />

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>

        {message && (
          <p className="mt-3 text-sm text-green-600">{message}</p>
        )}
      </form>
    </div>
  );
}
