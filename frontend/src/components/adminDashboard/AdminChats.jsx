import { useState, useEffect } from "react";
import AdminComplaintCard from "./AdminComplaintCard";
import { Link } from "react-router-dom";
import API from "../../api/axios";

const AdminChats = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState("all");

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const res = await API.get(
                `/complaint/admin/active-chats?page=${page}&limit=10&status=${filter}`
            );
            if (res.data.success) {
                setComplaints(res.data.complaints);
                setTotalPages(res.data.pagination.totalPages);
            }
        } catch (error) {
            console.error("Error fetching complaints:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, [page, filter]);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        setPage(1); // Reset to page 1 on filter change
    };

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
    };

    if (loading && page === 1 && complaints.length === 0)
        return <p className="text-slate-500 dark:text-slate-400 text-center py-8">Loading...</p>;

    return (
        <div className="space-y-6">
            {/* FILTER HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">All Chats</h2>

                <select
                    value={filter}
                    onChange={handleFilterChange}
                    className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-colors"
                >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="in progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                </select>
            </div>

            {/* LIST */}
            <div className="flex flex-col gap-3">
                {loading ? (
                    <p className="text-slate-500 dark:text-slate-400 text-center py-8">Loading...</p>
                ) : complaints.length > 0 ? (
                    complaints.map((complaint) => (
                        <Link
                            to={`/complaint/${complaint._id}/chat`}
                            key={complaint._id}
                        >
                            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-all flex justify-between items-center group">
                                <div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        Complaint ID: <span className="font-mono text-slate-500 dark:text-slate-400">{complaint._id}</span>
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        {new Date(complaint.createdAt).toLocaleDateString()} • {complaint.user?.fullName}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold
                                            ${complaint.status === "resolved"
                                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                : complaint.status === "in progress"
                                                    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                                                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                            }`}
                                    >
                                        {complaint.status.toUpperCase()}
                                    </span>
                                    <span className="text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">→</span>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                        <p className="text-slate-500 dark:text-slate-400">No chats found for this filter.</p>
                    </div>
                )}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                        onClick={handlePrev}
                        disabled={page === 1}
                        className={`px-4 py-2 rounded-lg border transition-colors ${page === 1
                            ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-700 cursor-not-allowed"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                            }`}
                    >
                        Previous
                    </button>
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={handleNext}
                        disabled={page === totalPages}
                        className={`px-4 py-2 rounded-lg border transition-colors ${page === totalPages
                            ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-700 cursor-not-allowed"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                            }`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminChats;
