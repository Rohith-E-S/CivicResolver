import { getStatusBadgeClass } from "../../utils/ui";

const AdminComplaintCard = ({ complaint }) => {
  const c = complaint;

  return (
    <article className="ui-card">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{c.category?.replace("_", " ").toUpperCase()}</h3>
          <p className="text-sm text-[color:var(--ui-text-muted)]">{c.description}</p>
          <p className="text-sm text-[color:var(--ui-text-muted)]">
            {c.city}, {c.state} • {c.landmark}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-[color:var(--ui-text-muted)]">
            {new Date(c.createdAt).toLocaleDateString()}
          </p>
          <span className={getStatusBadgeClass(c.status)}>{c.status}</span>
          {c.status === "resolved" && c.rating > 0 && (
            <p className="text-sm font-semibold text-[color:var(--ui-success)]">★ {c.rating}/5</p>
          )}
        </div>
      </div>
    </article>
  );
};

export default AdminComplaintCard;
