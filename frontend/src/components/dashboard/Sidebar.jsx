const Sidebar = ({ activeTab, setActiveTab, logout }) => {
  const items = [
    { key: "overview", label: "Overview" },
    { key: "new-complaint", label: "New complaint" },
    { key: "chats", label: "Chats" },
    { key: "profile", label: "Profile" },
  ];

  return (
    <aside className="fixed left-0 top-0 hidden h-full w-56 border-r border-[color:var(--ui-border)] bg-[color:var(--ui-surface)] pt-16 md:flex md:flex-col">
      <div className="p-4">
        <p className="text-sm font-semibold">Citizen dashboard</p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`ui-btn w-full justify-start ${
              activeTab === item.key ? "ui-btn-primary" : "ui-btn-secondary"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-3">
        <button onClick={logout} className="ui-btn ui-btn-secondary w-full justify-start">
          Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
