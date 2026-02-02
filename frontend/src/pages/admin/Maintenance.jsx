import { useState } from "react";
import api from "../../api/api";

export default function Maintenance() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    tier: "",
    cost: "",
    phone: "",
    email: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/maintenance/member", form);
      setMessage("Maintenance member added successfully");
      setForm({
        name: "",
        category: "",
        tier: "",
        cost: "",
        phone: "",
        email: "",
        address: "",
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add maintenance member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Add Maintenance Member</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        >
          <option value="">Select Category</option>
          <option>Plumber</option>
          <option>Electrician</option>
          <option>AC Technician</option>
          <option>Carpenter</option>
          <option>Painter</option>
          <option>Gardener</option>
          <option>Housekeeping</option>
          <option>Security</option>
          <option>General Maintenance</option>
          <option>Property Manager</option>
        </select>

        <select
          name="tier"
          value={form.tier}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        >
          <option value="">Select Tier</option>
          <option>Tier 1 – Immediate</option>
          <option>Tier 2 – Scheduled</option>
          <option>Tier 3 – Monthly</option>
          <option>Tier 3 – Escalation</option>
        </select>

        <input
          type="text"
          name="cost"
          placeholder="Cost (₹500 / visit)"
          value={form.cost}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <textarea
          name="address"
          placeholder="Service Area / Address"
          value={form.address}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          rows="3"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700"
        >
          {loading ? "Saving..." : "Add Member"}
        </button>

        {message && (
          <p className="mt-3 text-sm text-green-600">{message}</p>
        )}
      </form>
    </div>
  );
}
