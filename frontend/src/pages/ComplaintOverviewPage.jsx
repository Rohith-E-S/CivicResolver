import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/axios";
import { getStatusBadgeClass } from "../utils/ui";
import MapLeaflet from "../components/dashboard/MapLeaflet";
import AppHeader from "../components/AppHeader";

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
        setComplaint((prev) => ({ ...prev, rating: value }));
        setRating(value);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const fetchComplaint = useCallback(async () => {
    try {
      const res = await API.get(`/complaint/get-complaint-data/${id}`);
      setComplaint(res.data.complaint);
      setIsAdmin(res.data.isAdmin);
    } catch (error) {
      console.error("Error fetching complaint:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchComplaint();
  }, [fetchComplaint]);

  if (loading) return <div className="ui-page ui-empty">Loading complaint details...</div>;
  if (!complaint) return <div className="ui-page ui-empty">Complaint not found.</div>;

  return (
    <div className="ui-page">
      <AppHeader
        brandTo={isAdmin ? "/admin-dashboard" : "/dashboard"}
        brandInitial="C"
        brandLabel="Complaint Register Portal"
        title="Complaint details"
        subtitle={`ID #${complaint._id.slice(-8).toUpperCase()}`}
        actions={
          <>
            <Link to={isAdmin ? "/admin-dashboard" : "/dashboard"} className="ui-btn ui-btn-secondary">
              Dashboard
            </Link>
            <Link to={`/complaint/${id}/chat`} className="ui-btn ui-btn-primary">
              Chat
            </Link>
          </>
        }
      />

      <main className="ui-container py-6">
        <section className="ui-card mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <span className={getStatusBadgeClass(complaint.status)}>{complaint.status}</span>
              <h1 className="ui-title mt-3">{complaint.description || "Reported issue"}</h1>
              <p className="ui-subtitle">
                #{complaint._id.slice(-8).toUpperCase()} • {new Date(complaint.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Link to={`/complaint/${id}/chat`} className="ui-btn ui-btn-primary">
              Open chat
            </Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <article className="ui-card">
              <h2 className="text-lg font-semibold">Complaint information</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-[color:var(--ui-text-muted)]">Category</p>
                  <p className="mt-1 font-medium capitalize">
                    {complaint.category?.replace(/_/g, " ") || "Other"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[color:var(--ui-text-muted)]">Location</p>
                  <p className="mt-1 font-medium">{complaint.landmark || complaint.city || "Unknown"}</p>
                </div>
              </div>
              <div className="mt-4">
                <MapLeaflet lat={complaint.latitude} lng={complaint.longitude} />
              </div>
            </article>

            <article className="ui-card">
              <h2 className="text-lg font-semibold">Before and after</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[color:var(--ui-text-muted)]">Before</p>
                  <div className="overflow-hidden rounded-lg border border-[color:var(--ui-border)] bg-[color:var(--ui-surface-muted)]">
                    {complaint.beforeImageUrl ? (
                      <img src={complaint.beforeImageUrl} alt="Before evidence" className="h-64 w-full object-cover" />
                    ) : (
                      <p className="ui-empty">No image</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[color:var(--ui-text-muted)]">After</p>
                  <div className="overflow-hidden rounded-lg border border-[color:var(--ui-border)] bg-[color:var(--ui-surface-muted)]">
                    {complaint.afterImageUrl ? (
                      <img src={complaint.afterImageUrl} alt="After evidence" className="h-64 w-full object-cover" />
                    ) : (
                      <p className="ui-empty">Pending resolution image</p>
                    )}
                  </div>
                </div>
              </div>
            </article>
          </div>

          <aside className="space-y-6">
            {complaint.status === "resolved" && !isAdmin && (
              <article className="ui-card">
                <h2 className="text-base font-semibold">Rate resolution</h2>
                <div className="mt-3 flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className={`ui-btn ui-btn-secondary !min-h-9 !px-2 ${
                        star <= (hoverRating || complaint.rating || rating) ? "font-bold" : ""
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </article>
            )}

            <article className="ui-card">
              <h2 className="text-base font-semibold">Timeline</h2>
              <ul className="mt-3 space-y-3 text-sm">
                <li>
                  <strong>Created:</strong>{" "}
                  <span className="text-[color:var(--ui-text-muted)]">
                    {new Date(complaint.createdAt).toLocaleString()}
                  </span>
                </li>
                <li>
                  <strong>Last updated:</strong>{" "}
                  <span className="text-[color:var(--ui-text-muted)]">
                    {new Date(complaint.updatedAt).toLocaleString()}
                  </span>
                </li>
              </ul>
            </article>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default ComplaintOverviewPage;
