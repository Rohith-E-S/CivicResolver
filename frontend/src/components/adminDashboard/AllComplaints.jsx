import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

const AllComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filter]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await API.get(
        `/complaint/admin/list?page=${page}&limit=10&status=${filter}&search=${debouncedSearch}`
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
  }, [page, debouncedSearch, filter]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case "resolved":
        return "bg-surface-tint/10 text-surface-tint";
      case "in progress":
        return "bg-tertiary-fixed text-on-tertiary-container";
      case "new":
      default:
        return "bg-secondary-container text-on-secondary-container";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-12">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-headline font-black text-on-background tracking-tight mb-2">Editorial Governance</h2>
            <p className="text-on-surface-variant max-w-2xl font-body leading-relaxed">
              Managing public discourse and resolution integrity. All reports are verified through the Resolution Engine protocol.
            </p>
          </div>
        </div>
      </header>

      {/* Search and Filter Bar */}
      <section className="bg-surface-container-low rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              className="w-full bg-surface-container-lowest border-none rounded-lg py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-surface-tint outline-none transition-all placeholder:text-outline-variant text-on-surface"
              placeholder="Search by ID or details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
            />
          </div>
          
          <div className="lg:col-span-3">
            <select
              value={filter}
              onChange={handleFilterChange}
              className="w-full bg-surface-container-lowest border-none rounded-lg py-4 px-4 text-sm focus:ring-2 focus:ring-surface-tint outline-none appearance-none cursor-pointer text-on-surface"
            >
              <option value="all">Status: All Reports</option>
              <option value="new">New</option>
              <option value="in progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </section>

      {/* Data Table Section */}
      <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-6 py-5 text-[10px] uppercase tracking-widest font-black text-outline">Case ID</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-widest font-black text-outline">User</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-widest font-black text-outline">Category</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-widest font-black text-outline">Location</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-widest font-black text-outline">Date Received</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-widest font-black text-outline">Status</th>
                <th className="px-6 py-5 text-right text-[10px] uppercase tracking-widest font-black text-outline">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-on-surface-variant text-sm">
                    Loading reports...
                  </td>
                </tr>
              ) : complaints.length > 0 ? (
                complaints.map((c) => (
                  <tr key={c._id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-5">
                      <span className="font-mono text-xs font-bold text-on-surface">#{c._id.slice(-6).toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center">
                          <span className="text-[10px] font-black text-on-primary-fixed">
                            {c.user?.fullName?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">{c.user?.fullName || "Citizen"}</p>
                          <p className="text-[10px] text-outline truncate max-w-[120px]">{c.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-medium text-on-surface-variant truncate max-w-[150px] block">
                        {c.description}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs text-on-surface-variant truncate max-w-[150px] block">
                        {c.city}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-xs text-on-surface-variant">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyles(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link to={`/admin/complaint-overview/${c._id}`} className="text-surface-tint hover:underline text-xs font-bold">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                      <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-4xl text-outline-variant">search_off</span>
                      </div>
                      <h3 className="text-xl font-bold text-on-surface mb-2">No results found</h3>
                      <p className="text-on-surface-variant text-sm max-w-xs mx-auto">
                        We couldn't find any complaints matching your current filters. Try adjusting your search criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 bg-surface-container-low flex items-center justify-between border-t border-surface-container">
            <p className="text-xs text-outline font-medium">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${page === 1 ? 'bg-surface-container-low text-outline-variant' : 'bg-surface-container-lowest shadow-sm hover:bg-white text-on-surface'}`}
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button
                onClick={handleNext}
                disabled={page === totalPages}
                className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${page === totalPages ? 'bg-surface-container-low text-outline-variant' : 'bg-surface-container-lowest shadow-sm hover:bg-white text-on-surface'}`}
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default AllComplaints;
