import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Sidebar from "../components/dashboard/Sidebar";
import Overview from "../components/dashboard/Overview";
import NewComplaint from "../components/dashboard/NewComplaint";
import Profile from "../components/dashboard/Profile";
import UserChats from "../components/dashboard/UserChats";
import AppHeader from "../components/AppHeader";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(localStorage.getItem("dashboardActiveTab") || "overview");
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
    imageUrl: null,
  });
  const [profileData, setProfileData] = useState({
    fullName: "",
    address: "",
    profilePic: null,
    previewUrl: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("dashboardActiveTab", activeTab);
  }, [activeTab]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await API.get("/complaint/my-stats");
      if (res.data.success) setStats(res.data.stats);
    } finally {
      setLoading(false);
    }
  };

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

  const logout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="ui-page ui-page-dashboard">
      <AppHeader
        brandTo="/dashboard"
        brandInitial="C"
        brandLabel="Complaint Register Portal"
        title="Citizen dashboard"
        subtitle="Case tracking and submissions"
        actions={
          <div className="app-header__user">
            <span className="app-header__user-name">{user?.fullName || "Citizen"}</span>
            <span className="app-header__user-meta">Account portal</span>
          </div>
        }
      />

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} logout={logout} />

      <main className="px-3 py-4 pb-20 md:ml-56 md:px-4 md:pb-6">
        <div className="mx-auto max-w-[1500px] space-y-4">
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
          {activeTab === "chats" && <UserChats setActiveTab={setActiveTab} />}
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

      <nav className="fixed bottom-0 left-0 z-40 flex w-full justify-around border-t border-[color:var(--ui-border)] bg-[color:var(--ui-surface)] p-3 md:hidden">
        <button onClick={() => setActiveTab("overview")} className="ui-btn ui-btn-ghost">
          Home
        </button>
        <button onClick={() => setActiveTab("new-complaint")} className="ui-btn ui-btn-ghost">
          New
        </button>
        <button onClick={() => setActiveTab("chats")} className="ui-btn ui-btn-ghost">
          Chats
        </button>
        <button onClick={() => setActiveTab("profile")} className="ui-btn ui-btn-ghost">
          Profile
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
