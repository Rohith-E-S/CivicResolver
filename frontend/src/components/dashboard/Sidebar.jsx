import ThemeToggle from "../ThemeToggle";

const Sidebar = ({ activeTab, setActiveTab, logout }) => {
  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full border-r border-slate-200/20 bg-slate-50 dark:bg-slate-950 w-64 z-40 pt-20">
      <div className="px-6 py-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-700 rounded-xl text-white">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          </div>
          <div>
            <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Resolution Engine</h2>
            <p className="text-[10px] text-slate-500">Citizen Access Portal</p>
          </div>
        </div>
        
        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 shadow-sm rounded-lg p-3 font-sans text-xs uppercase tracking-widest font-bold hover:translate-x-1 transition-transform duration-200 ${
              activeTab === "overview" 
                ? "bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
            }`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </button>
          
          <button
            onClick={() => setActiveTab("new-complaint")}
            className={`w-full flex items-center gap-3 rounded-lg p-3 font-sans text-xs uppercase tracking-widest font-bold hover:translate-x-1 transition-transform duration-200 ${
              activeTab === "new-complaint" 
                ? "bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
            }`}
          >
            <span className="material-symbols-outlined">add_circle</span>
            Report Issue
          </button>

          <button
            onClick={() => setActiveTab("chats")}
            className={`w-full flex items-center gap-3 rounded-lg p-3 font-sans text-xs uppercase tracking-widest font-bold hover:translate-x-1 transition-transform duration-200 ${
              activeTab === "chats" 
                ? "bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
            }`}
          >
            <span className="material-symbols-outlined">chat</span>
            Chats
          </button>
        </nav>
      </div>
      
      <div className="mt-auto px-6 py-8 border-t border-slate-200/20">
        <div className="space-y-1">
          <div className="flex items-center justify-between p-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Theme</span>
            <ThemeToggle />
          </div>
          <button 
            onClick={() => setActiveTab("profile")}
            className="w-full flex items-center gap-3 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 p-2 text-xs font-bold uppercase tracking-widest"
          >
            <span className="material-symbols-outlined">person</span> Profile
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 text-slate-500 hover:text-error p-2 text-xs font-bold uppercase tracking-widest"
          >
            <span className="material-symbols-outlined">logout</span> Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
