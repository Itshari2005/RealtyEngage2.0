import { useEffect, useState } from "react";
import API from "../../api/api";
import DashboardCard from "../../components/DashboardCard";

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalCustomers: 0,
        totalProjects: 0,
        totalEnquiries: 0,
        totalPayments: 0,
        totalRevenue: 0,
        totalSupport: 0,
    });
    const [loading, setLoading] = useState(true);
    const [showRevenueModal, setShowRevenueModal] = useState(false);


    useEffect(() => {
        async function fetchStats() {
            try {
                const token = localStorage.getItem("token");
                const { data } = await API.get("/admin/dashboard", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStats(data);
            } catch (err) {
                console.error("Error fetching dashboard stats:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[80vh] bg-gradient-to-br from-slate-900 via-blue-950 to-black text-white text-xl font-semibold animate-pulse">
                Loading Dashboard...
            </div>
        );
    }

    const formatToLakh = (amount) => {
  if (!amount) return "₹0";
  return `₹${(amount / 100000).toFixed(1)} L`;
};


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white p-8">
            <h1 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text animate-gradient">
                Admin Dashboard Overview
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard title="Total Customers" value={stats.totalCustomers} color="from-cyan-400 to-blue-500" />
                <DashboardCard title="Total Projects" value={stats.totalProjects} color="from-green-400 to-emerald-500" />
                <DashboardCard title="Total Enquiries" value={stats.totalEnquiries} color="from-purple-400 to-indigo-500" />
                <DashboardCard title="Total Payments" value={stats.totalPayments} color="from-pink-400 to-rose-500" />
                <div onClick={() => setShowRevenueModal(true)} className="cursor-pointer">
  <DashboardCard
    title="Total Revenue"
    value={formatToLakh(stats.totalRevenue)}
    color="from-yellow-400 to-orange-500"
  />
</div>

                <DashboardCard title="Total Support Requests" value={stats.totalSupport} color="from-red-400 to-pink-500" />
            </div>

            {showRevenueModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-80 text-center text-gray-900">
      <h3 className="text-lg font-semibold mb-3">
        Total Revenue (Exact)
      </h3>

      <p className="text-2xl font-bold text-green-700">
        ₹{stats.totalRevenue.toLocaleString("en-IN")}
      </p>

      <button
        onClick={() => setShowRevenueModal(false)}
        className="mt-5 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Close
      </button>
    </div>
  </div>
)}

        </div>
    );
}
