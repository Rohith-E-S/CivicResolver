import API from "../../api/axios";

const Profile = ({
  profileData,
  setProfileData,
  message,
  setMessage,
  submitLoading,
  setSubmitLoading,
  user,
  setUser,
}) => {
  const handleChange = (e) =>
    setProfileData({ ...profileData, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({
        ...profileData,
        profilePic: file,
        previewUrl: URL.createObjectURL(file),
      });
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const data = new FormData();
    data.append("fullName", profileData.fullName);
    data.append("address", profileData.address);
    if (profileData.profilePic)
      data.append("profilePic", profileData.profilePic);

    try {
      const res = await API.post("/auth/update", data);
      if (res.data.success) {
        setMessage({ type: "success", text: "Profile Updated!" });
        setUser(res.data.user);
        localStorage.setItem("userData", JSON.stringify(res.data.user));
      }
    } catch {
      setMessage({ type: "error", text: "Update failed" });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-slate-900 dark:text-white text-2xl font-bold mb-6">Edit Profile</h1>

      {message.text && (
        <div
          className={`p-4 mb-6 rounded-lg border ${message.type === "success"
            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-300"
            : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-300"
            }`}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={updateProfile}
        className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 transition-colors"
      >
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900/50 border-4 border-white dark:border-slate-700 shadow-md flex items-center justify-center text-blue-700 dark:text-blue-300 text-3xl font-bold transition-all">
            {profileData.previewUrl ? (
              <img
                src={profileData.previewUrl}
                className="w-full h-full object-cover"
                alt="Profile"
              />
            ) : (
              user?.fullName?.charAt(0).toUpperCase()
            )}
          </div>

          <label className="cursor-pointer mt-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium shadow-sm">
            Change Photo
            <input type="file" className="hidden" onChange={handleFile} />
          </label>
        </div>

        <Input
          label="Full Name"
          name="fullName"
          value={profileData.fullName}
          onChange={handleChange}
          placeholder="Enter full name"
        />

        <TextArea
          label="Address"
          name="address"
          value={profileData.address}
          onChange={handleChange}
          placeholder="Enter address"
        />

        <button
          disabled={submitLoading}
          className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50"
        >
          {submitLoading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium text-sm">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    />
  </div>
);

const TextArea = ({ label, ...props }) => (
  <div>
    <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium text-sm">{label}</label>
    <textarea
      {...props}
      rows="3"
      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
    />
  </div>
);

export default Profile;
