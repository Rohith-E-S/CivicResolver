import MyComplaints from "./MyComplaints";

const Overview = ({ stats, setActiveTab, user }) => {
  const { total, newComplaint, inProgressComplaint, resolvedComplaint } = stats;

  return (
    <>
      {/* Hero Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Citizen Oversight</h1>
          <p className="text-lg text-slate-500 max-w-xl font-medium leading-relaxed">
            Welcome back, {user?.fullName?.split(" ")[0] || "Citizen"}. You have <span className="text-blue-700 dark:text-blue-400">{newComplaint + inProgressComplaint} active cases</span> requiring your attention today.
          </p>
        </div>
        <div>
          <button onClick={() => setActiveTab("new-complaint")} className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-xl font-bold text-sm tracking-wide shadow-xl flex items-center gap-3 hover:scale-[0.98] transition-all">
            <span className="material-symbols-outlined">add_circle</span>
            Report an Issue
          </button>
        </div>
      </section>

      {/* Overview Statistics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Stat Card 1 */}
        <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white">
            <span className="material-symbols-outlined">folder_open</span>
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400">Total Submitted</p>
            <p className="text-5xl font-black text-slate-900 dark:text-white mt-1">{total || 0}</p>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-on-tertiary-container flex items-center justify-center">
            <span className="material-symbols-outlined">pending_actions</span>
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400">In Progress</p>
            <p className="text-5xl font-black text-slate-900 dark:text-white mt-1">{inProgressComplaint || 0}</p>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm space-y-4 border-l-4 border-surface-tint">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-surface-tint flex items-center justify-center">
            <span className="material-symbols-outlined">verified</span>
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400">Resolved</p>
            <p className="text-5xl font-black text-slate-900 dark:text-white mt-1">{resolvedComplaint || 0}</p>
          </div>
        </div>
      </section>

      {/* Main Content: Recent Complaints */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Recent Complaints</h2>
        </div>
        <div className="bg-surface-container-low rounded-3xl p-2 space-y-2">
          <MyComplaints setActiveTab={setActiveTab} />
        </div>
      </section>

      {/* Authority Badge Footer */}
      <footer className="pt-12 flex flex-col items-center gap-6 border-t border-slate-200/20 mt-12">
        <div className="backdrop-blur-md bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800 px-6 py-3 rounded-full flex items-center gap-4 shadow-sm">
          <span className="material-symbols-outlined text-surface-tint">verified_user</span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Official Municipal Governance Portal</span>
        </div>
        <p className="text-[10px] text-slate-400 uppercase tracking-tight">© {new Date().getFullYear()} Editorial Governance Systems. All Rights Reserved.</p>
      </footer>
    </>
  );
};

export default Overview;
