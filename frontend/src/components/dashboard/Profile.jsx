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
  const handleChange = (e) => {
    setProfileData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData((prev) => ({
        ...prev,
        profilePic: file,
        previewUrl: URL.createObjectURL(file),
      }));
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const data = new FormData();
    data.append("fullName", profileData.fullName);
    data.append("address", profileData.address);
    if (profileData.profilePic) data.append("profilePic", profileData.profilePic);

    try {
      const res = await API.post("/auth/update", data);
      if (res.data.success) {
        setMessage({ type: "success", text: "Profile updated." });
        setUser(res.data.user);
        localStorage.setItem("userData", JSON.stringify(res.data.user));
      }
    } catch {
      setMessage({ type: "error", text: "Update failed." });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="ui-card max-w-3xl">
      <h1 className="ui-title">Profile</h1>
      <p className="ui-subtitle">Keep your personal information up to date.</p>

      {message.text && (
        <div className={`mt-5 ui-alert ${message.type === "success" ? "ui-alert-success" : "ui-alert-error"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={updateProfile} className="mt-4 space-y-3">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-[color:var(--ui-border)] bg-[color:var(--ui-surface-muted)] text-xl font-semibold">
            {profileData.previewUrl ? (
              <img src={profileData.previewUrl} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              user?.fullName?.charAt(0).toUpperCase()
            )}
          </div>
          <label className="ui-btn ui-btn-secondary cursor-pointer">
            Change photo
            <input type="file" className="hidden" onChange={handleFile} />
          </label>
        </div>

        <div>
          <label className="ui-label" htmlFor="fullName">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            value={profileData.fullName}
            onChange={handleChange}
            className="ui-input"
            required
          />
        </div>

        <div>
          <label className="ui-label" htmlFor="address">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={profileData.address}
            onChange={handleChange}
            className="ui-textarea"
            required
          />
        </div>

        <button disabled={submitLoading} className="ui-btn ui-btn-primary">
          {submitLoading ? "Updating..." : "Update profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
