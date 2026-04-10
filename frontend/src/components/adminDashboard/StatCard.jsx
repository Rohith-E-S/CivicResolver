const StatCard = ({ title, value }) => {
  return (
    <div className="ui-card">
      <p className="text-sm text-[color:var(--ui-text-muted)]">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
};

export default StatCard;
