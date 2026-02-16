import { useEffect, useState } from "react";
import API from "../../api/api";
import { FaBuilding, FaRupeeSign } from "react-icons/fa";
import { toast } from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function MyPayments() {
  const [payments, setPayments] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [showTimelineId, setShowTimelineId] = useState(null);

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

  const settlePayment = async (paymentId) => {
    try {
      await API.put("/payments/settle", { paymentId });

      toast.success("Full payment completed");
      fetchPayments();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  const generateSchedule = (payment) => {
    const rows = [];

    if (!payment.months || !payment.monthlyAmount) return rows;

    const paidMonths = Math.floor(payment.paidAmount / payment.monthlyAmount);

    for (let i = 1; i <= payment.months; i++) {
      rows.push({
        month: i,
        amount: payment.monthlyAmount,
        status: i <= paidMonths ? "Paid" : "Pending",
      });
    }

    return rows;
  };

  const generateTimeline = (payment) => {
    const items = [];

    // Down payment
    items.push({
      label: "Down Payment",
      amount:
        payment.paidAmount -
        payment.monthlyAmount *
          Math.floor((payment.paidAmount - payment.downPayment) / payment.monthlyAmount),
      status: "Paid",
    });

    const emiPaidCount = Math.floor(
      (payment.paidAmount - payment.downPayment) / payment.monthlyAmount
    );

    for (let i = 1; i <= payment.months; i++) {
      items.push({
        label: `EMI Month ${i}`,
        amount: payment.monthlyAmount,
        status: i <= emiPaidCount ? "Paid" : "Pending",
      });
    }

    return items;
  };

  const downloadReceipt = (payment) => {
    const rawUser = localStorage.getItem("user");
    const currentUser = rawUser ? JSON.parse(rawUser) : null;
    
    console.log("PDF User Data:", currentUser);

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("RealtyEngage – Payment Receipt", 14, 20);

    doc.setFontSize(11);
    doc.text(`Receipt ID: ${payment._id}`, 14, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 36);

    autoTable(doc, {
      startY: 45,
      head: [["Field", "Details"]],
      body: [
        ["Customer Name", currentUser?.name || "N/A"],
        ["Email", currentUser?.email || "N/A"],
        ["Project", payment.project?.name || "N/A"],
        ["Total Amount", `Rs. ${payment.totalAmount || 0}`],
        ["Paid Amount", `Rs. ${payment.paidAmount || 0}`],
        ["Pending Amount", `Rs. ${payment.pendingAmount || 0}`],
        ["Status", payment.status],
      ],
    });

    doc.text(
      "This is a system-generated receipt. No signature required.",
      14,
      doc.lastAutoTable.finalY + 10
    );

    doc.save(`Receipt_${payment._id}.pdf`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Payments</h1>

      {payments.length === 0 ? (
        <p>No payments yet.</p>
      ) : (
        <div className="grid gap-4">
          {payments.map((p) => (
            <div key={p._id} className="bg-white p-5 rounded-xl shadow border">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <FaBuilding /> {p.project?.name}
              </h3>

              <p className="mt-2">Total: ₹{p.totalAmount || 0}</p>

              <p className="text-green-700">Paid: ₹{p.paidAmount || 0}</p>

              <p className="text-yellow-700">Pending: ₹{p.pendingAmount || 0}</p>

              <p className="mt-2">
                Status: <b>{p.status}</b>
              </p>

              {/* ✅ EMI Schedule Table */}
              {p.months && p.monthlyAmount && (
                <div className="mt-4 border-t pt-3">
                  <h4 className="font-semibold mb-2">EMI Schedule</h4>

                  <table className="w-full text-sm border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-1">Month</th>
                        <th className="border p-1">Amount</th>
                        <th className="border p-1">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {(expandedId === p._id
                        ? generateSchedule(p)
                        : generateSchedule(p).slice(0, 6)
                      ).map((row) => (
                        <tr key={row.month}>
                          <td className="border p-1 text-center">{row.month}</td>
                          <td className="border p-1 text-center">₹{row.amount}</td>
                          <td
                            className={`border p-1 text-center font-semibold ${
                              row.status === "Paid" ? "text-green-600" : "text-orange-500"
                            }`}
                          >
                            {row.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {generateSchedule(p).length > 6 && (
                    <button
                      onClick={() => setExpandedId(expandedId === p._id ? null : p._id)}
                      className="text-blue-600 text-sm mt-2 hover:underline"
                    >
                      {expandedId === p._id ? "Show Less ▲" : "Show More ▼"}
                    </button>
                  )}
                </div>
              )}

              <button
                onClick={() => setShowTimelineId(showTimelineId === p._id ? null : p._id)}
                className="text-indigo-600 text-sm mt-2 hover:underline"
              >
                {showTimelineId === p._id ? "Hide Timeline ▲" : "Show Timeline ▼"}
              </button>

              {/* ✅ Payment Timeline */}
              {p.months && p.monthlyAmount && showTimelineId === p._id && (
                <div className="mt-6 border-t pt-4">
                  <h4 className="font-semibold mb-3">Payment Timeline</h4>

                  <div className="relative border-l-2 border-gray-300 ml-3">
                    {generateTimeline(p).map((item, index) => (
                      <div key={index} className="ml-4 mb-4 flex items-center gap-3">
                        {/* Dot */}
                        <div
                          className={`w-4 h-4 rounded-full ${
                            item.status === "Paid" ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />

                        {/* Text */}
                        <div>
                          <p className="font-medium">
                            {item.label} — ₹{item.amount}
                          </p>
                          <p
                            className={`text-xs ${
                              item.status === "Paid" ? "text-green-600" : "text-orange-500"
                            }`}
                          >
                            {item.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ✅ ACTION BUTTONS SECTION */}
<div className="mt-5 space-y-4">

  {/* EMI ACTIONS */}
  {p.pendingAmount > 0 && (
    <div className="flex flex-col gap-2 max-w-md">
      <button
        onClick={() => requestEMI(p._id, p.monthlyAmount)}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Mark EMI Paid (₹{p.monthlyAmount})
      </button>

      {/* EMI request status directly under EMI button */}
      {p.paymentRequests?.map((r, i) => (
        <p key={i} className="text-sm text-gray-500">
          Request ₹{r.amount} → {r.status}
        </p>
      ))}
    </div>
  )}

  {/* OTHER PAYMENT ACTIONS */}
  <div className="flex flex-wrap gap-3">
    {p.pendingAmount > 0 && (
      <button
        onClick={() => settlePayment(p._id)}
        className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
      >
        Settle Full Payment (₹{p.pendingAmount})
      </button>
    )}

    {p.paidAmount > 0 && (
      <button
        onClick={() => downloadReceipt(p)}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Download Receipt
      </button>
    )}
  </div>

</div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
