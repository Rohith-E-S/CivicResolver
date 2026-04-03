import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";

const ComplaintOverviewPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRating = async (value) => {
    try {
      const res = await API.post(`/complaint/rate/${id}`, { rating: value });
      if (res.data.success) {
        setComplaint({ ...complaint, rating: value });
        setRating(value);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const fetchComplaint = async () => {
    try {
      const res = await API.get(`/complaint/get-complaint-data/${id}`);
      setComplaint(res.data.complaint);
      setIsAdmin(res.data.isAdmin);
    } catch (error) {
      console.error("Error fetching complaint:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant">Loading complaint details...</div>;
  if (!complaint) return <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant">Complaint not found.</div>;

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved": return "bg-surface-tint/10 text-surface-tint";
      case "in progress": return "bg-tertiary-fixed text-on-tertiary-container";
      case "new": default: return "bg-secondary-container text-on-secondary-container";
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm dark:shadow-none">
        <div className="flex justify-between items-center w-full px-6 py-3 max-w-full">
          <div className="flex items-center gap-8">
            <span className="text-lg font-bold tracking-tighter text-slate-900 dark:text-slate-50">Editorial Governance</span>
            <div className="hidden md:flex gap-6 items-center">
              <Link to={isAdmin ? "/admin-dashboard" : "/dashboard"} className="font-sans text-sm tracking-tight font-medium text-blue-700 dark:text-blue-400 font-semibold hover:underline">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${getStatusStyles(complaint.status)}`}>
                {complaint.status}
              </span>
              <span className="text-xs font-medium uppercase tracking-widest text-on-surface-variant opacity-60">ID: #{complaint._id.slice(-8).toUpperCase()}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-primary leading-tight">{complaint.description || "Reported Issue"}</h1>
          </div>

          {/* CTA: Rate our Resolution */}
          {complaint.status === "resolved" && !isAdmin && (
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col items-center text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-on-surface mb-3">Rate our Resolution</p>
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-2xl transition-colors cursor-pointer hover:scale-110"
                  >
                    <span className="material-symbols-outlined text-surface-tint" style={star <= (hoverRating || complaint.rating || rating) ? { fontVariationSettings: "'FILL' 1" } : {}}>star</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-on-surface-variant italic">Share your feedback</p>
            </div>
          )}
        </div>

        {/* Main Content Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Details & Evidence */}
          <div className="lg:col-span-8 space-y-8">
            {/* Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-surface-container-low p-6 rounded-xl">
                <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">Category</p>
                <p className="text-base font-semibold text-on-surface capitalize">{complaint.category?.replace(/_/g, " ") || "Other"}</p>
              </div>
              <div className="bg-surface-container-low p-6 rounded-xl">
                <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">Location</p>
                <p className="text-base font-semibold text-on-surface truncate">{complaint.landmark || complaint.city || "Unknown"}</p>
              </div>
              <div className="bg-surface-container-low p-6 rounded-xl">
                <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">Filed Date</p>
                <p className="text-base font-semibold text-on-surface">{new Date(complaint.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Visual Evidence */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold tracking-tight">Resolution Evidence</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group relative overflow-hidden rounded-xl bg-surface-container-highest aspect-[4/3] flex items-center justify-center">
                  {complaint.beforeImageUrl ? (
                    <img src={complaint.beforeImageUrl} className="object-cover w-full h-full" alt="Before" />
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-outline">image</span>
                  )}
                  <div className="absolute top-4 left-4 bg-primary/80 backdrop-blur-md text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full">Before</div>
                </div>
                <div className="group relative overflow-hidden rounded-xl bg-surface-container-highest aspect-[4/3] flex items-center justify-center">
                  {complaint.afterImageUrl ? (
                    <img src={complaint.afterImageUrl} className="object-cover w-full h-full" alt="After" />
                  ) : (
                    <div className="flex flex-col items-center text-outline">
                      <span className="material-symbols-outlined text-4xl mb-2">pending</span>
                      <span className="text-xs uppercase font-bold tracking-widest">Pending Resolution</span>
                    </div>
                  )}
                  {complaint.afterImageUrl && (
                    <div className="absolute top-4 left-4 bg-surface-tint text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full">After (Resolved)</div>
                  )}
                </div>
              </div>
            </div>

            {/* Resolution Timeline */}
            <div className="bg-surface-container-low p-8 rounded-2xl">
              <h3 className="text-xl font-bold tracking-tight mb-8">Resolution Timeline</h3>
              <div className="space-y-8 relative">
                {/* Connecting Line */}
                <div className="absolute left-4 top-1 bottom-1 w-[2px] bg-surface-container-highest"></div>
                
                {complaint.status === "resolved" && (
                  <div className="relative pl-12">
                    <div className="absolute left-[10px] top-1.5 w-3 h-3 rounded-full bg-surface-tint shadow-[0_0_0_4px_rgba(0,83,219,0.1)]"></div>
                    <p className="text-sm font-bold text-on-surface">Issue Resolved</p>
                    <p className="text-xs text-on-surface-variant mb-1">{new Date(complaint.updatedAt).toLocaleString()}</p>
                    <p className="text-sm text-on-surface-variant">The reported issue has been verified and successfully resolved by the municipal team.</p>
                  </div>
                )}
                
                {(complaint.status === "in progress" || complaint.status === "resolved") && (
                  <div className={`relative pl-12 ${complaint.status === "resolved" ? "opacity-60" : ""}`}>
                    <div className={`absolute left-[10px] top-1.5 w-3 h-3 rounded-full ${complaint.status === "resolved" ? "bg-outline" : "bg-tertiary-fixed shadow-[0_0_0_4px_rgba(255,221,184,0.3)]"}`}></div>
                    <p className="text-sm font-bold text-on-surface">Assigned & In Progress</p>
                    <p className="text-sm text-on-surface-variant mt-1">Our field team is actively working on resolving the issue.</p>
                  </div>
                )}

                <div className={`relative pl-12 ${complaint.status !== "new" ? "opacity-60" : ""}`}>
                  <div className={`absolute left-[10px] top-1.5 w-3 h-3 rounded-full ${complaint.status !== "new" ? "bg-outline" : "bg-secondary-container shadow-[0_0_0_4px_rgba(208,225,251,0.5)]"}`}></div>
                  <p className="text-sm font-bold text-on-surface">Report Logged & Validated</p>
                  <p className="text-xs text-on-surface-variant">{new Date(complaint.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Chat Interface Placeholder */}
          <div className="lg:col-span-4 h-full">
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/15 flex flex-col items-center justify-center p-8 sticky top-24 text-center">
              <div className="w-16 h-16 rounded-full bg-surface-tint/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-surface-tint text-3xl">support_agent</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-2">Gov Resolution Team</h3>
              <p className="text-sm text-on-surface-variant mb-8">Need updates or have questions? Open a direct chat with the resolution team.</p>
              <Link to={`/complaint/${id}/chat`} className="w-full bg-primary hover:bg-primary-container text-white py-3 rounded-md font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">chat</span>
                Open Secure Chat
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComplaintOverviewPage;
