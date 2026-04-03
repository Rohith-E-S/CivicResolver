import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const AdminOverview = ({ complaints }) => {
  const total =
    complaints.newComplaint.length +
    complaints.inProgressComplaint.length +
    complaints.resolvedComplaint.length;

  const pieData = [
    { name: "New", value: complaints.newComplaint.length, color: "#497cff" }, 
    { name: "In Progress", value: complaints.inProgressComplaint.length, color: "#d0e1fb" },
    { name: "Resolved", value: complaints.resolvedComplaint.length, color: "#0053db" },
  ];

  const all = [
    ...complaints.newComplaint,
    ...complaints.inProgressComplaint,
    ...complaints.resolvedComplaint,
  ];

  const categoryData = Object.values(
    all.reduce((acc, c) => {
      const category = c.category || "other";
      if (!acc[category]) acc[category] = { name: category, count: 0 };
      acc[category].count++;
      return acc;
    }, {})
  ).map((item) => ({
    ...item,
    displayName: item.name.replace(/_/g, " ").toUpperCase(),
  }));

  const colors = ["#00174b", "#0053db", "#54647a", "#76777d", "#b87500"];

  return (
    <>
      <header className="mb-10 mt-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">City Resolution Overview</h1>
            <p className="text-slate-500 dark:text-slate-400 font-sans text-lg mt-2 font-light">Metric tracking and governance for the Metropolitan Area.</p>
          </div>
          <div className="bg-surface-container-low p-1.5 rounded-full flex gap-1 self-start">
            <button className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">Real-time</button>
            <button className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-500 dark:text-slate-400">Historical</button>
          </div>
        </div>
      </header>

      {/* Bento Grid: Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-on-primary-container/10 rounded-lg text-on-primary-container">
              <span className="material-symbols-outlined">analytics</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Issues</span>
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">{total}</div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-tertiary-fixed rounded-lg text-on-tertiary-container">
              <span className="material-symbols-outlined">pending_actions</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Review</span>
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">{complaints.newComplaint.length}</div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-secondary-container rounded-lg text-on-secondary-container">
              <span className="material-symbols-outlined">engineering</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">In Progress</span>
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">{complaints.inProgressComplaint.length}</div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-surface-tint/10 rounded-lg text-surface-tint">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Resolved</span>
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">{complaints.resolvedComplaint.length}</div>
        </div>
      </div>

      {/* Dashboard Body Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Category Chart Section (Left/Center Column) */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-surface-container-low p-8 rounded-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Incidents by Category</h3>
                  <p className="text-sm text-slate-500 mt-1 uppercase tracking-widest font-bold">Distribution Analysis</p>
                </div>
                <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">more_vert</span>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer>
                  <BarChart data={categoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="displayName" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} width={120} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                      {categoryData.map((_, idx) => (
                        <Cell key={idx} fill={colors[idx % colors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Decorative Background Gradient Element */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary-container/5 rounded-full blur-3xl"></div>
          </section>

          {/* Status Pie Chart */}
          <section className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">Status Breakdown</h3>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {pieData.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">{entry.name}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Recent Activity Column (Right Sidebar) */}
        <div className="space-y-6">
          {/* Authority Badge Card */}
          <section className="bg-gradient-to-br from-slate-900 to-primary-container p-6 rounded-2xl text-white relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-white/20">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>assured_workload</span>
              </div>
              <h4 className="text-lg font-bold mb-1">Administrative Authority</h4>
              <p className="text-xs text-white/70 leading-relaxed mb-6 font-light">Your session is authenticated under the Provincial Governance Framework. Ensure all actions follow the Resolution Protocol.</p>
            </div>
            {/* Decorative Glass Circles */}
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-surface-tint/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
          </section>

          {/* Stats Summary */}
          <section className="bg-surface-container-high p-6 rounded-2xl">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-4">System Health</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Database Uptime</span>
                <span className="text-xs font-bold text-surface-tint">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Dispatch Latency</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">12ms</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default AdminOverview;
