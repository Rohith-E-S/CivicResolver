import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ComplaintCard from "./ComplaintCard";
import API from "../../api/axios";

const MyComplaints = ({ setActiveTab }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all");

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await API.get(
        `/complaint/my-list?page=${page}&limit=10&status=${filter}`
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

  return (
    <div className="space-y-6 w-full">
      {/* FILTER HEADER */}
      <div className="flex justify-between items-center bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/10">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-sm">filter_list</span>
          <span className="text-xs font-bold uppercase tracking-widest">Filter</span>
        </div>

        <select
          value={filter}
          onChange={handleFilterChange}
          className="bg-surface-container-high border-none text-on-surface text-xs font-bold px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-surface-tint shadow-sm transition-colors cursor-pointer appearance-none"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="in progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* LIST */}
      <div className="space-y-2">
        {loading ? (
          <p className="text-on-surface-variant text-center py-8 text-sm">Loading reports...</p>
        ) : complaints.length > 0 ? (
          complaints.map((c) => (
            <Link to={`/complaint-overview/${c._id}`} key={c._id} className="block">
              <ComplaintCard complaint={c} />
            </Link>
          ))
        ) : (
          <div className="text-center py-12 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm transition-colors">
            <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-outline text-3xl">edit_document</span>
            </div>
            <p className="text-on-surface-variant mb-6 text-sm">No complaints found. Your voice matters.</p>
            <button
              onClick={() => setActiveTab("new-complaint")}
              className="px-6 py-3 bg-gradient-to-br from-primary to-primary-container hover:opacity-90 rounded-xl text-on-primary font-bold text-xs uppercase tracking-widest transition-all shadow-md"
            >
              Report an Issue
            </button>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${page === 1
              ? "bg-surface-container-low text-outline cursor-not-allowed"
              : "bg-surface-container-lowest shadow-sm hover:bg-white text-on-surface"
              }`}
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <span className="text-on-surface-variant font-medium text-xs">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${page === totalPages
              ? "bg-surface-container-low text-outline cursor-not-allowed"
              : "bg-surface-container-lowest shadow-sm hover:bg-white text-on-surface"
              }`}
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
