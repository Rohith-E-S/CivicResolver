import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import ThemeToggle from "../components/ThemeToggle";
import AdminOverview from "../components/adminDashboard/AdminOverview";
import AllComplaints from "../components/adminDashboard/AllComplaints";
import AdminChats from "../components/adminDashboard/AdminChats";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("adminDashboardActiveTab") || "overview"
  );

  useEffect(() => {
    localStorage.setItem("adminDashboardActiveTab", activeTab);
  }, [activeTab]);
  
  const [stats, setStats] = useState({
    newComplaint: [],
    inProgressComplaint: [],
    resolvedComplaint: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await API.get("/complaint/admin/stats");
      if (res.data.success) setStats(res.data.stats);
    } catch {
      setMessage({ type: "error", text: "Failed to load stats" });
    }
    setLoading(false);
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData"));
    if (!data?.isAdmin) navigate("/dashboard");
    fetchStats();
  }, []);

  const logout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      {/* Top Navigation Shell */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm dark:shadow-none flex justify-between items-center px-6 py-3 max-w-full">
        <div className="flex items-center gap-8">
          <span className="text-lg font-bold tracking-tighter text-slate-900 dark:text-slate-50">Editorial Governance</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <input className="bg-surface-container-low border-none rounded-full py-1.5 pl-10 pr-4 text-xs w-64 focus:ring-1 focus:ring-surface-tint outline-none text-on-surface" placeholder="Search incidents..." type="text"/>
          </div>
          <button className="p-2 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors rounded-full relative">
            <span className="material-symbols-outlined text-slate-900 dark:text-slate-50">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-on-primary-container rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>
          <div className="h-8 w-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs">
            A
          </div>
        </div>
      </nav>

      {/* Side Navigation Shell */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-slate-50 dark:bg-slate-950 border-r border-slate-200/20 z-40 pt-16">
        <div className="px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white leading-none">Admin Portal</h2>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mt-1">Resolution Engine</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-2 space-y-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full text-left p-3 flex items-center gap-3 group transition-transform duration-200 hover:translate-x-1 rounded-lg ${activeTab === "overview" ? "bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"}`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-sans text-sm uppercase tracking-widest font-bold">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab("complaints")}
            className={`w-full text-left p-3 flex items-center gap-3 group transition-transform duration-200 hover:translate-x-1 rounded-lg ${activeTab === "complaints" ? "bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"}`}
          >
            <span className="material-symbols-outlined">list_alt</span>
            <span className="font-sans text-sm uppercase tracking-widest font-bold">Complaints</span>
          </button>
          <button
            onClick={() => setActiveTab("chats")}
            className={`w-full text-left p-3 flex items-center gap-3 group transition-transform duration-200 hover:translate-x-1 rounded-lg ${activeTab === "chats" ? "bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"}`}
          >
            <span className="material-symbols-outlined">chat</span>
            <span className="font-sans text-sm uppercase tracking-widest font-bold">Chats</span>
          </button>
        </nav>
        
        <div className="px-2 pb-6 border-t border-slate-100 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between p-3 text-slate-600 dark:text-slate-400">
            <span className="font-sans text-sm uppercase tracking-widest font-bold">Theme</span>
            <ThemeToggle />
          </div>
          <button onClick={logout} className="w-full text-left text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 rounded-lg p-3 flex items-center gap-3 transition-transform duration-200 hover:translate-x-1">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-sans text-sm uppercase tracking-widest font-bold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="md:ml-64 pt-20 px-6 pb-12 min-h-screen">
        {/* Toast Message */}
        {message.text && (
          <div className={`fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${message.type === "success" ? "bg-green-600" : "bg-red-600"} text-white font-medium`}>
            {message.text}
          </div>
        )}

        {/* TABS */}
        {activeTab === "overview" && (
          <AdminOverview complaints={stats} loading={loading} />
        )}
        {activeTab === "complaints" && (
          <AllComplaints />
        )}
        {activeTab === "chats" && (
          <AdminChats />
        )}
      </main>

      {/* Mobile Navigation Shell */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-6 py-3 flex justify-around items-center z-50">
        <button onClick={() => setActiveTab("overview")} className={`flex flex-col items-center gap-1 ${activeTab === "overview" ? "text-blue-700 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`}>
          <span className="material-symbols-outlined" style={activeTab === "overview" ? { fontVariationSettings: "'FILL' 1" } : {}}>dashboard</span>
          <span className="text-[10px] font-bold uppercase">Home</span>
        </button>
        <button onClick={() => setActiveTab("complaints")} className={`flex flex-col items-center gap-1 ${activeTab === "complaints" ? "text-blue-700 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`}>
          <span className="material-symbols-outlined">list_alt</span>
          <span className="text-[10px] font-bold uppercase">List</span>
        </button>
        <button onClick={() => setActiveTab("chats")} className={`flex flex-col items-center gap-1 ${activeTab === "chats" ? "text-blue-700 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`}>
          <span className="material-symbols-outlined">chat</span>
          <span className="text-[10px] font-bold uppercase">Chats</span>
        </button>
        <button onClick={logout} className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-red-500">
          <span className="material-symbols-outlined">logout</span>
          <span className="text-[10px] font-bold uppercase">Exit</span>
        </button>
      </nav>
    </div>
  );
};

export default AdminDashboard;
