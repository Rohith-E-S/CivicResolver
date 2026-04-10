import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import ComplaintCard from "./ComplaintCard";

const MyComplaints = ({ setActiveTab }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all");

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get(`/complaint/my-list?page=${page}&limit=10&status=${filter}`);
      if (res.data.success) {
        setComplaints(res.data.complaints);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPage(1);
  };

  return (
    <div className="space-y-3">
      <div className="ui-card-muted flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold">My complaints</h3>
        <select value={filter} onChange={handleFilterChange} className="ui-select sm:w-56">
          <option value="all">All status</option>
          <option value="new">New</option>
          <option value="in progress">In progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {loading ? (
        <p className="ui-empty">Loading complaints...</p>
      ) : complaints.length > 0 ? (
        <div className="space-y-2">
          {complaints.map((c) => (
            <Link key={c._id} to={`/complaint-overview/${c._id}`} className="block">
              <ComplaintCard complaint={c} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="ui-card ui-empty">
          <p>No complaints found.</p>
          <button
            onClick={() => setActiveTab("new-complaint")}
            className="ui-btn ui-btn-primary mt-3"
          >
            Create complaint
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="ui-btn ui-btn-secondary"
          >
            Previous
          </button>
          <span className="text-sm text-[color:var(--ui-text-muted)]">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="ui-btn ui-btn-secondary"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
