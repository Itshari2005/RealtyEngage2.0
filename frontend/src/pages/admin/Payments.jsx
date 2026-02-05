import { useEffect, useState } from "react";
import API from "../../api/api";
import { FaRupeeSign, FaUser } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPayments();
    fetchAnalytics();
  }, []);

  const fetchPayments = async () => {
    const { data } = await API.get("/payments/admin");
    setPayments([...data].reverse());
  };

  const fetchAnalytics = async () => {
  const { data } = await API.get("/payments/analytics", {
    headers: { Authorization: `Bearer ${token}` },
  });
  setAnalytics(data);
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
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Payments Dashboard</h1>

      {/* ✅ Analytics Cards */}
{analytics && (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

    <div className="bg-green-100 p-4 rounded-xl text-center">
      <p className="text-sm text-gray-600">Total Collected</p>
      <p className="text-xl font-bold text-green-700">
        ₹{analytics.totalRevenue?.toLocaleString("en-IN")}
      </p>
    </div>

    <div className="bg-yellow-100 p-4 rounded-xl text-center">
      <p className="text-sm text-gray-600">Pending</p>
      <p className="text-xl font-bold text-yellow-700">
        ₹{analytics.totalPending?.toLocaleString("en-IN")}
      </p>
    </div>

    <div className="bg-blue-100 p-4 rounded-xl text-center">
      <p className="text-sm text-gray-600">Active EMI</p>
      <p className="text-xl font-bold text-blue-700">
        {analytics.emiActive}
      </p>
    </div>

    <div className="bg-purple-100 p-4 rounded-xl text-center">
      <p className="text-sm text-gray-600">Completed</p>
      <p className="text-xl font-bold text-purple-700">
        {analytics.completed}
      </p>
    </div>

  </div>
)}


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
              Paid: ₹{p.paidAmount?.toLocaleString()}
            </p>

            <p className="text-yellow-700">
              Pending: ₹{p.pendingAmount?.toLocaleString()}
            </p>

            <p className="mt-1">
  Status:
  <span
    className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
      p.status === "paid"
        ? "bg-green-100 text-green-700"
        : p.status === "partial"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-gray-100 text-gray-700"
    }`}
  >
    {p.status}
  </span>
</p>


            {/* ✅ Show pending requests */}
            {p.paymentRequests?.map((r, i) =>
              r.status === "pending" ? (
                <button
                  key={i}
                  onClick={() => approvePayment(p._id, i)}
                  className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve ₹{r.amount?.toLocaleString()}
                </button>
              ) : (
                <p key={i} className="text-sm text-gray-500">
                  ₹{r.amount?.toLocaleString()} → {r.status}
                </p>
              )
            )}
          </div>
        ))
      )}
    </div>
  );
}
