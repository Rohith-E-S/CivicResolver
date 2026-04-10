import MyComplaints from "./MyComplaints";

const Overview = ({ stats, setActiveTab, user }) => {
  const { total, newComplaint, inProgressComplaint, resolvedComplaint } = stats;

  return (
    <div className="space-y-4">
      <section className="ui-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="ui-title">Welcome, {user?.fullName?.split(" ")[0] || "Citizen"}</h1>
            <p className="ui-subtitle">
              You currently have {newComplaint + inProgressComplaint} active complaints.
            </p>
          </div>
          <button onClick={() => setActiveTab("new-complaint")} className="ui-btn ui-btn-primary">
            Report a new issue
          </button>
        </div>
      </section>

      <section className="ui-grid-auto">
        <article className="ui-card">
          <p className="text-sm text-[color:var(--ui-text-muted)]">Total submitted</p>
          <p className="mt-1 text-2xl font-bold">{total || 0}</p>
        </article>
        <article className="ui-card">
          <p className="text-sm text-[color:var(--ui-text-muted)]">New</p>
          <p className="mt-1 text-2xl font-bold">{newComplaint || 0}</p>
        </article>
        <article className="ui-card">
          <p className="text-sm text-[color:var(--ui-text-muted)]">In progress</p>
          <p className="mt-1 text-2xl font-bold">{inProgressComplaint || 0}</p>
        </article>
        <article className="ui-card">
          <p className="text-sm text-[color:var(--ui-text-muted)]">Resolved</p>
          <p className="mt-1 text-2xl font-bold">{resolvedComplaint || 0}</p>
        </article>
      </section>

      <MyComplaints setActiveTab={setActiveTab} />
    </div>
  );
};

export default Overview;
