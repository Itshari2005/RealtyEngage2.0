import { useEffect, useState } from "react";
import API from "../../api/api";
import { FaRupeeSign, FaUser } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    const { data } = await API.get("/payments/admin");
    setPayments(data);
  };

  // ✅ approve EMI request
  const approvePayment = async (paymentId, index) => {
    try {
      await API.put("/payments/approve", {
        paymentId,
        requestIndex: index,
      });

      toast.success("Payment approved");
      fetchPayments();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Payments Dashboard</h1>

      {payments.length === 0 ? (
        <p>No payments recorded yet.</p>
      ) : (
        payments.map((p) => (
          <div
            key={p._id}
            className="bg-white p-6 rounded-xl shadow border mb-4"
          >
            <h3 className="font-bold text-lg">
              {p.customer?.name}
            </h3>

            <p className="text-sm flex items-center gap-2">
              <FaUser /> {p.customer?.email}
            </p>

            <p>Project: {p.project?.name}</p>

            <p className="text-green-700">
              Paid: ₹{p.paidAmount}
            </p>

            <p className="text-yellow-700">
              Pending: ₹{p.pendingAmount}
            </p>

            <p>Status: {p.status}</p>

            {/* ✅ Show pending requests */}
            {p.paymentRequests?.map((r, i) =>
              r.status === "pending" ? (
                <button
                  key={i}
                  onClick={() => approvePayment(p._id, i)}
                  className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve ₹{r.amount}
                </button>
              ) : (
                <p key={i} className="text-sm text-gray-500">
                  ₹{r.amount} → {r.status}
                </p>
              )
            )}
          </div>
        ))
      )}
    </div>
  );
}
