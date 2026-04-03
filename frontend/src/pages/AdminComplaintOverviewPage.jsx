import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const AdminComplaintOverviewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const fetchComplaint = async () => {
        try {
            const res = await API.get(`/complaint/get-complaint-data/${id}`);
            setComplaint(res.data.complaint);
            if (!res.data.isAdmin) {
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Error fetching complaint:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaint();
    }, [id]);

    const updateComplaint = async (status, file) => {
        const formData = new FormData();
        if (status) formData.append("status", status);
        if (file) formData.append("imageUrl", file);

        setUpdating(true);

        try {
            const res = await API.post(
                `/complaint/update-complaint-status-upload-image/${id}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (res.data.success) {
                setMessage({ type: "success", text: "Complaint updated successfully!" });
                fetchComplaint(); // Refresh data
            }
        } catch (error) {
            console.error("Error updating:", error);
            setMessage({ type: "error", text: "Update failed. Please try again." });
        } finally {
            setUpdating(false);
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        }
    };

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant">Loading...</div>;
    if (!complaint) return <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant">Complaint not found.</div>;

    const getStatusStyles = (status) => {
      switch (status?.toLowerCase()) {
        case "resolved": return "bg-surface-tint/10 text-surface-tint";
        case "in progress": return "bg-tertiary-fixed text-on-tertiary-container";
        case "new": default: return "bg-secondary-container text-on-secondary-container";
      }
    };

    return (
        <div className="bg-background text-on-background min-h-screen pb-12">
            {/* Top Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm flex justify-between items-center px-6 py-3 max-w-full">
                <div className="flex items-center gap-8">
                    <span className="text-lg font-bold tracking-tighter text-slate-900 dark:text-slate-50">Editorial Governance</span>
                    <div className="hidden md:flex gap-6 items-center">
                        <Link to="/admin-dashboard" className="text-blue-700 dark:text-blue-400 font-sans text-sm tracking-tight font-medium hover:underline">
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="pt-24 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyles(complaint.status)}`}>
                                    {complaint.status}
                                </span>
                                <span className="text-[10px] uppercase tracking-widest font-medium text-on-surface-variant opacity-60">
                                    Ticket #{complaint._id.slice(-8).toUpperCase()}
                                </span>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-4">{complaint.description || "Reported Issue"}</h1>
                            <p className="text-lg text-slate-500 max-w-2xl font-light leading-relaxed">
                                {complaint.category ? complaint.category.replace(/_/g, " ").toUpperCase() + " • " : ""}{complaint.city}, {complaint.state}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <select 
                                    className="bg-surface-container-lowest border border-outline-variant/30 px-4 py-2 rounded-md text-sm font-bold tracking-tight hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-on-surface appearance-none outline-none focus:ring-2 focus:ring-surface-tint cursor-pointer"
                                    value={complaint.status}
                                    onChange={(e) => {
                                        const newStatus = e.target.value;
                                        if (newStatus === "resolved" && !complaint.afterImageUrl) {
                                            alert("Please upload an AFTER image before marking as resolved.");
                                            return;
                                        }
                                        updateComplaint(newStatus, null);
                                    }}
                                    disabled={updating}
                                >
                                    <option value="new">New</option>
                                    <option value="in progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>
                            {updating && <span className="text-sm font-bold text-surface-tint animate-pulse">Updating...</span>}
                        </div>
                    </header>

                    {message.text && (
                        <div className={`mb-8 p-4 rounded-xl font-medium text-sm ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                            {message.text}
                        </div>
                    )}

                    {/* Layout Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column: Details (8 cols) */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Detail Bento Card */}
                            <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-outline block mb-1">Reporter</label>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-container font-bold">
                                                    {complaint.user?.fullName?.charAt(0).toUpperCase() || "U"}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-on-surface">{complaint.user?.fullName || "Citizen"}</p>
                                                    <p className="text-xs text-on-surface-variant">{complaint.user?.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-outline block mb-1">Location</label>
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-surface-tint">location_on</span>
                                                <p className="font-medium text-on-surface">{complaint.landmark || "N/A"}</p>
                                            </div>
                                            <p className="text-xs text-on-surface-variant ml-7 mt-1">{complaint.latitude}, {complaint.longitude}</p>
                                        </div>
                                        {complaint.rating > 0 && (
                                            <div>
                                                <label className="text-[10px] uppercase tracking-widest font-bold text-outline block mb-1">User Rating</label>
                                                <div className="flex items-center gap-2 text-surface-tint text-lg">
                                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                    <span className="font-bold">{complaint.rating} / 5</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="relative rounded-xl overflow-hidden aspect-video group bg-surface-container-high flex items-center justify-center">
                                        {complaint.beforeImageUrl ? (
                                          <img src={complaint.beforeImageUrl} alt="Issue evidence" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        ) : (
                                          <span className="material-symbols-outlined text-4xl text-outline">image</span>
                                        )}
                                        <div className="absolute bottom-4 left-4">
                                            <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-on-surface">Initial Report</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Resolution Upload (Contextual UI) */}
                            {complaint.status !== "resolved" && (
                                <section className="bg-surface-container-low border-2 border-dashed border-outline-variant/30 rounded-xl p-12 transition-all hover:border-surface-tint/50">
                                    <div className="text-center">
                                        <div className="mb-4 inline-flex w-16 h-16 rounded-full bg-primary-fixed text-on-primary-fixed items-center justify-center">
                                            <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-on-surface mb-2">Resolution Evidence Required</h3>
                                        <p className="text-sm text-on-surface-variant max-w-sm mx-auto mb-6 leading-relaxed">To mark this complaint as <span className="text-surface-tint font-bold">Resolved</span>, please upload a photo of the completed repairs.</p>
                                        <input className="hidden" id="resolution-upload" type="file" accept="image/*" onChange={(e) => updateComplaint(null, e.target.files[0])} disabled={updating}/>
                                        <label className="cursor-pointer bg-surface-container-lowest border border-outline-variant/30 shadow-sm px-8 py-3 rounded-md font-bold text-sm tracking-tight hover:bg-surface-container-high transition-all inline-block text-on-surface" htmlFor="resolution-upload">
                                            {updating ? "Uploading..." : "Select File to Upload"}
                                        </label>
                                    </div>
                                </section>
                            )}

                            {complaint.afterImageUrl && (
                                <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
                                    <h3 className="text-xl font-bold text-on-surface mb-6">Resolution Evidence</h3>
                                    <div className="relative rounded-xl overflow-hidden aspect-video bg-surface-container-high">
                                        <img src={complaint.afterImageUrl} alt="Resolution" className="w-full h-full object-cover" />
                                        <div className="absolute bottom-4 left-4">
                                            <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-on-surface">After Repair</span>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Right Column: Admin Chat (4 cols) */}
                        <div className="lg:col-span-4 h-full">
                            <div className="sticky top-24 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/15 p-6 flex flex-col items-center justify-center text-center py-16">
                                <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined text-3xl text-surface-tint">chat</span>
                                </div>
                                <h3 className="text-lg font-bold text-on-surface mb-2">Direct Communication</h3>
                                <p className="text-sm text-on-surface-variant mb-6">Open a secure channel with the citizen to discuss details or provide updates.</p>
                                <Link to={`/complaint/${id}/chat`} className="w-full py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-lg shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-sm">forum</span>
                                    Open Chat
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminComplaintOverviewPage;
