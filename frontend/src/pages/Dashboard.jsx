import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

import Sidebar from "../components/dashboard/Sidebar";
import Overview from "../components/dashboard/Overview";
import NewComplaint from "../components/dashboard/NewComplaint";
import Profile from "../components/dashboard/Profile";
import UserChats from "../components/dashboard/UserChats";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("dashboardActiveTab") || "overview"
  );

  useEffect(() => {
    localStorage.setItem("dashboardActiveTab", activeTab);
  }, [activeTab]);

  const [stats, setStats] = useState({
    total: 0,
    newComplaint: 0,
    inProgressComplaint: 0,
    resolvedComplaint: 0,
  });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [submitLoading, setSubmitLoading] = useState(false);

  const [formData, setFormData] = useState({
    description: "",
    city: "",
    state: "",
    landmark: "",
    latitude: "",
    longitude: "",
    image: null,
  });

  const [profileData, setProfileData] = useState({
    fullName: "",
    address: "",
    profilePic: null,
    previewUrl: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (data) {
      const parsed = JSON.parse(data);
      setUser(parsed);
      setProfileData({
        fullName: parsed.fullName,
        address: parsed.address,
        previewUrl: parsed.profilePic || null,
      });
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await API.get("/complaint/my-stats");
      if (res.data.success) setStats(res.data.stats);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="bg-background text-on-background antialiased min-h-screen">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm dark:shadow-none flex justify-between items-center px-6 py-3 max-w-full">
        <div className="flex items-center gap-8">
          <span className="text-lg font-bold tracking-tighter text-slate-900 dark:text-slate-50">Editorial Governance</span>
          <div className="hidden md:flex gap-6 items-center font-sans text-sm tracking-tight font-medium">
            <button onClick={() => setActiveTab("overview")} className={`${activeTab === "overview" ? "text-blue-700 dark:text-blue-400 font-semibold border-b-2 border-blue-700 dark:border-blue-400 pb-1" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"}`}>My Reports</button>
            <button onClick={() => setActiveTab("new-complaint")} className={`${activeTab === "new-complaint" ? "text-blue-700 dark:text-blue-400 font-semibold border-b-2 border-blue-700 dark:border-blue-400 pb-1" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"}`}>Report Issue</button>
            <button onClick={() => setActiveTab("chats")} className={`${activeTab === "chats" ? "text-blue-700 dark:text-blue-400 font-semibold border-b-2 border-blue-700 dark:border-blue-400 pb-1" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"}`}>Chats</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
            <span className="material-symbols-outlined text-slate-900 dark:text-slate-50">notifications</span>
          </button>
          <div className="flex items-center gap-3 pl-2 cursor-pointer" onClick={() => setActiveTab("profile")}>
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-900">{user?.fullName || "Citizen"}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-tight">Citizen Advocate</p>
            </div>
            {user?.profilePic ? (
              <img alt="User profile avatar" className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm" src={user.profilePic} />
            ) : (
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 ring-2 ring-white shadow-sm">
                {user?.fullName?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* SideNavBar (Desktop) */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} logout={logout} />

      {/* Main Content Canvas */}
      <main className="md:pl-64 pt-24 pb-12 px-6 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-12">
          {activeTab === "overview" && (
            <Overview stats={stats} loading={loading} setActiveTab={setActiveTab} user={user} />
          )}
          {activeTab === "new-complaint" && (
            <NewComplaint
              formData={formData}
              setFormData={setFormData}
              submitLoading={submitLoading}
              setSubmitLoading={setSubmitLoading}
              message={message}
              setMessage={setMessage}
              fetchComplaints={fetchStats}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === "chats" && (
            <UserChats setActiveTab={setActiveTab} />
          )}
          {activeTab === "profile" && (
            <Profile
              profileData={profileData}
              setProfileData={setProfileData}
              message={message}
              setMessage={setMessage}
              submitLoading={submitLoading}
              setSubmitLoading={setSubmitLoading}
              user={user}
              setUser={setUser}
            />
          )}
        </div>
      </main>

      {/* Mobile Bottom NavBar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-lg border-t-0 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] px-6 py-4 flex justify-around items-center z-50">
        <button onClick={() => setActiveTab("overview")} className={`flex flex-col items-center gap-1 ${activeTab === "overview" ? "text-blue-700" : "text-slate-400"}`}>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[9px] font-bold uppercase tracking-tighter">Home</span>
        </button>
        <button onClick={() => setActiveTab("new-complaint")} className={`flex flex-col items-center gap-1 ${activeTab === "new-complaint" ? "text-blue-700" : "text-slate-400"}`}>
          <span className="material-symbols-outlined">add_circle</span>
          <span className="text-[9px] font-bold uppercase tracking-tighter">New</span>
        </button>
        <button onClick={() => setActiveTab("chats")} className={`flex flex-col items-center gap-1 ${activeTab === "chats" ? "text-blue-700" : "text-slate-400"}`}>
          <span className="material-symbols-outlined">chat</span>
          <span className="text-[9px] font-bold uppercase tracking-tighter">Chats</span>
        </button>
        <button onClick={() => setActiveTab("profile")} className={`flex flex-col items-center gap-1 ${activeTab === "profile" ? "text-blue-700" : "text-slate-400"}`}>
          <span className="material-symbols-outlined">person</span>
          <span className="text-[9px] font-bold uppercase tracking-tighter">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
