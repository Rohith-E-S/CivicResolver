import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AdminOverview = ({ complaints }) => {
  const total =
    complaints.newComplaint.length +
    complaints.inProgressComplaint.length +
    complaints.resolvedComplaint.length;

  const pieData = [
    { name: "New", value: complaints.newComplaint.length, color: "#2563eb" },
    { name: "In Progress", value: complaints.inProgressComplaint.length, color: "#f59e0b" },
    { name: "Resolved", value: complaints.resolvedComplaint.length, color: "#16a34a" },
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
      acc[category].count += 1;
      return acc;
    }, {})
  ).map((item) => ({
    ...item,
    displayName: item.name.replace(/_/g, " ").toUpperCase(),
  }));

  return (
    <div className="space-y-6">
      <section className="ui-card">
        <h1 className="ui-title">Admin overview</h1>
        <p className="ui-subtitle">Track system load and complaint resolution progress.</p>
      </section>

      <section className="ui-grid-auto">
        <article className="ui-card">
          <p className="text-sm text-[color:var(--ui-text-muted)]">Total complaints</p>
          <p className="mt-2 text-3xl font-bold">{total}</p>
        </article>
        <article className="ui-card">
          <p className="text-sm text-[color:var(--ui-text-muted)]">New</p>
          <p className="mt-2 text-3xl font-bold">{complaints.newComplaint.length}</p>
        </article>
        <article className="ui-card">
          <p className="text-sm text-[color:var(--ui-text-muted)]">In progress</p>
          <p className="mt-2 text-3xl font-bold">{complaints.inProgressComplaint.length}</p>
        </article>
        <article className="ui-card">
          <p className="text-sm text-[color:var(--ui-text-muted)]">Resolved</p>
          <p className="mt-2 text-3xl font-bold">{complaints.resolvedComplaint.length}</p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="ui-card">
          <h2 className="text-lg font-semibold">Complaints by category</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="displayName" width={130} />
                <Tooltip />
                <Bar dataKey="count" barSize={20} fill="#2563eb" radius={6}>
                  {categoryData.map((_, idx) => (
                    <Cell key={idx} fill={idx % 2 === 0 ? "#2563eb" : "#1d4ed8"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="ui-card">
          <h2 className="text-lg font-semibold">Status split</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={60} outerRadius={90}>
                  {pieData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            {pieData.map((item) => (
              <span key={item.name} className="inline-flex items-center gap-2 text-sm">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}
              </span>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default AdminOverview;
