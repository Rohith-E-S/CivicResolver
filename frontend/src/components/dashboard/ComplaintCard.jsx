import { getStatusBadgeClass } from "../../utils/ui";

const ComplaintCard = ({ complaint }) => {
  return (
    <article className="ui-card hover:border-[color:var(--ui-accent)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">
            {complaint.description || "Reported issue"}
          </h3>
          <p className="mt-1 text-sm text-[color:var(--ui-text-muted)]">
            #{complaint._id.slice(-6).toUpperCase()} •{" "}
            {new Date(complaint.createdAt).toLocaleDateString()} •{" "}
            {complaint.landmark ? `${complaint.landmark}, ` : ""}
            {complaint.city || "Unknown location"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {complaint.status === "resolved" && complaint.rating > 0 && (
            <span className="text-sm font-semibold text-[color:var(--ui-success)]">
              ★ {complaint.rating}/5
            </span>
          )}
          <span className={getStatusBadgeClass(complaint.status)}>{complaint.status}</span>
        </div>
      </div>
    </article>
  );
};

export default ComplaintCard;
