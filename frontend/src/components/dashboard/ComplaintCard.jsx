const ComplaintCard = ({ complaint }) => {
  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case "resolved":
        return "bg-surface-tint/10 text-surface-tint";
      case "in progress":
        return "bg-tertiary-fixed text-on-tertiary-container";
      case "new":
      default:
        return "bg-secondary-container text-on-secondary-container";
    }
  };

  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:translate-y-[-2px] hover:shadow-md cursor-pointer">
      <div className="flex items-start gap-5">
        <div className="hidden sm:block w-14 h-14 rounded-xl overflow-hidden bg-surface-container-high shrink-0">
          {complaint.beforeImageUrl ? (
            <img 
              src={complaint.beforeImageUrl} 
              alt="Issue evidence" 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-outline">
              <span className="material-symbols-outlined">image</span>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-on-surface leading-tight line-clamp-1">
            {complaint.description || "Reported Issue"}
          </h3>
          <p className="text-xs text-on-surface-variant font-medium">
            Submitted {new Date(complaint.createdAt).toLocaleDateString()} • Ref ID: #{complaint._id.slice(-6).toUpperCase()}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="material-symbols-outlined text-[14px] text-outline">location_on</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-outline">
              {complaint.landmark ? `${complaint.landmark}, ` : ""}{complaint.city || "Unknown Location"}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
        {complaint.status === "resolved" && complaint.rating > 0 && (
          <span className="text-surface-tint font-bold text-xs flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> {complaint.rating}
          </span>
        )}
        <div className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${getStatusStyles(complaint.status)}`}>
          {complaint.status}
        </div>
        <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
      </div>
    </div>
  );
};

export default ComplaintCard;
