const AdminComplaintCard = ({ complaint }) => {
  const c = complaint;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all relative">

      <div className="flex flex-col md:flex-row gap-6">
        {/* IMAGES */}
        <div className="md:w-1/4 space-y-4">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">Before Image:</p>
            <img
              src={c.beforeImageUrl}
              className="w-full h-48 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
              alt="Before"
            />
          </div>

          {c.afterImageUrl && (
            <div>
              <p className="text-xs text-green-600 dark:text-green-400 mb-1 font-medium">After Image:</p>
              <img
                src={c.afterImageUrl}
                className="w-full h-48 object-cover rounded-lg border-2 border-green-200 dark:border-green-800"
                alt="After"
              />
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl text-slate-900 dark:text-white font-bold">
                {c.category?.replace("_", " ").toUpperCase()}
              </h3>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-mono mt-1 select-all">
                ID: {c._id}
              </p>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {new Date(c.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className="text-slate-700 dark:text-slate-300 mt-3 leading-relaxed">{c.description}</p>

          <div className="flex flex-wrap gap-4 my-4 text-slate-500 dark:text-slate-400 text-sm">
            <p className="flex items-center gap-1">
              📍 {c.city}, {c.state}
            </p>
            <p className="flex items-center gap-1">🏢 {c.landmark}</p>
          </div>

          {/* STATUS */}
          <div className="mt-6 flex flex-wrap items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800 transition-colors">
            {/* STATUS BADGE */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${c.status === "resolved"
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : c.status === "in progress"
                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                  : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                }`}
            >
              {c.status}
            </span>

            {c.status === "resolved" && c.rating > 0 && (
              <span className="text-yellow-600 dark:text-yellow-400 font-bold text-xs flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full border border-yellow-200 dark:border-yellow-900/30">
                ★ {c.rating}/5
              </span>
            )}

            <span className="text-sm text-slate-500 dark:text-slate-400 ml-auto">
              Click to manage
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaintCard;
