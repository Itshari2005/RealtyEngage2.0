import { useEffect, useState } from "react";
import API from "../../api/api";
import { FaBuilding, FaRupeeSign } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function MyPayments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    const { data } = await API.get("/payments/my");
    setPayments(data);
  };

  // ✅ NEW — request EMI paid (Option B)
  const requestEMI = async (paymentId, amount) => {
    try {
      await API.post("/payments/request", {
        paymentId,
        amount,
      });

      toast.success("Marked as paid. Waiting for admin approval");
      fetchPayments();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Payments</h1>

      {payments.length === 0 ? (
        <p>No payments yet.</p>
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

              <p className="mt-2">
                Total: ₹{p.totalAmount || 0}
              </p>

              <p className="text-green-700">
                Paid: ₹{p.paidAmount || 0}
              </p>

              <p className="text-yellow-700">
                Pending: ₹{p.pendingAmount || 0}
              </p>

              <p className="mt-2">
                Status: <b>{p.status}</b>
              </p>

              {/* ✅ Show EMI button only if pending */}
              {p.pendingAmount > 0 && (
                <button
                  onClick={() => requestEMI(p._id, p.monthlyAmount)}
                  className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded"
                >
                  Mark EMI Paid (₹{p.monthlyAmount})
                </button>
              )}

              {/* show request status */}
              {p.paymentRequests?.map((r, i) => (
                <p key={i} className="text-sm text-gray-500">
                  Request ₹{r.amount} → {r.status}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
