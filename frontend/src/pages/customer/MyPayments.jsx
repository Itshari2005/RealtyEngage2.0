import { useEffect, useState } from "react";
import API from "../../api/api";
import { FaBuilding, FaRupeeSign } from "react-icons/fa";

export default function MyPayments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    const { data } = await API.get("/payments/my");
    setPayments(data);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Reservations</h1>

      {payments.length === 0 ? (
        <p>No reservations yet.</p>
      ) : (
        <div className="grid gap-4">
          {payments.map((p) => (
            <div
              key={p._id}
              className="bg-white p-5 rounded-xl shadow border"
            >
              <h3 className="text-xl font-bold flex items-center gap-2">
                <FaBuilding /> {p.project?.name}
              </h3>

              <p className="mt-2 flex items-center gap-2 text-green-700">
                <FaRupeeSign /> Token Paid: ₹{p.tokenAmount}
              </p>

              <p className="mt-2">
                Status: <b>{p.status}</b>
              </p>

              <p className="text-sm text-gray-500">
                {new Date(p.paidAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
