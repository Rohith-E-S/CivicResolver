export const getStatusBadgeClass = (status = "") => {
  const normalized = status.toLowerCase();
  if (normalized === "resolved") return "ui-badge ui-badge-resolved";
  if (normalized === "in progress") return "ui-badge ui-badge-progress";
  return "ui-badge ui-badge-new";
};
