import API from "../../api/axios";
import { useRef } from "react";

const NewComplaint = ({
  formData,
  setFormData,
  submitLoading,
  setSubmitLoading,
  message,
  setMessage,
  fetchComplaints,
  setActiveTab
}) => {
  const fileInputRef = useRef(null);

  // Handle text input
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle image input
  const handleFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, imageUrl: e.target.files[0] });
    }
  };

  // Fetch GPS and Reverse Geocode
  const getLocation = () => {
    if (!navigator.geolocation)
      return setMessage({ type: "error", text: "Geolocation not supported" });

    setMessage({ type: "success", text: "Fetching location..." });

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toString();
        const lng = pos.coords.longitude.toString();

        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();

          if (data && data.address) {
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.municipality ||
              "";
            const state = data.address.state || "";

            setFormData((prev) => ({
              ...prev,
              city,
              state,
            }));
            setMessage({ type: "success", text: "Location & Address fetched!" });
          } else {
            setMessage({ type: "success", text: "Location fetched (Address unavailable)" });
          }
        } catch (error) {
          console.error("Geocoding error:", error);
          setMessage({ type: "success", text: "Location fetched (Address failed)" });
        }
      },
      () => setMessage({ type: "error", text: "Unable to fetch location" })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setMessage({ type: "", text: "" });

    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val) data.append(key, val);
    });

    try {
      const res = await API.post("/complaint/create-complaint", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setMessage({ type: "success", text: "Complaint submitted successfully!" });

        setFormData({
          description: "",
          city: "",
          state: "",
          landmark: "",
          latitude: "",
          longitude: "",
          imageUrl: null,
        });

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        fetchComplaints();
        setTimeout(() => setActiveTab("overview"), 2000);
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Submission failed. Please try again." });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <header className="mb-12 text-center md:text-left">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-on-primary-fixed-variant opacity-70 mb-4 block">Resolution Engine</span>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-primary mb-4">Report an Issue</h1>
        <p className="text-lg text-on-surface-variant max-w-2xl font-light leading-relaxed">
          Provide precise details to help our dispatchers categorize and resolve your civic concern with editorial accuracy.
        </p>
      </header>

      {message.text && (
        <div className={`p-4 mb-6 rounded-xl border font-medium text-sm ${message.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-error-container/50 border-error/20 text-error"}`}>
          {message.text}
        </div>
      )}

      {/* Form Container */}
      <section className="bg-surface-container-low rounded-xl p-1 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Core Information Section */}
          <div className="bg-surface-container-lowest rounded-xl p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Capture Location Button (acting as a general action, original had Category, keeping Description) */}
              <div className="flex flex-col justify-end">
                <button
                  type="button"
                  onClick={getLocation}
                  className="group flex items-center justify-center gap-3 bg-secondary-container text-on-secondary-container py-4 px-6 rounded-md font-bold text-sm tracking-tight hover:bg-secondary-fixed transition-all"
                >
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                  Capture Current Location
                </button>
                {formData.latitude && formData.longitude && (
                  <p className="text-xs text-on-surface-variant mt-2 font-mono text-center">
                    {formData.latitude}, {formData.longitude}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2 space-y-3">
                <label className="block text-[0.75rem] uppercase tracking-widest font-bold text-on-surface-variant" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full bg-surface-container-highest border-none rounded-md py-4 px-4 text-on-surface focus:ring-2 focus:ring-surface-tint resize-none outline-none transition-all placeholder:text-outline/60"
                  placeholder="Please describe the issue in detail, including its impact on the surroundings..."
                  rows="5"
                />
              </div>
            </div>
          </div>

          {/* Location Data Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-surface-container-low p-6 rounded-xl">
            <div className="space-y-3">
              <label className="block text-[0.75rem] uppercase tracking-widest font-bold text-on-surface-variant" htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full bg-surface-container-lowest border-none rounded-md py-3 px-4 text-on-surface focus:ring-2 focus:ring-surface-tint outline-none transition-all placeholder:text-outline/60"
                placeholder="e.g. Metropolis"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-[0.75rem] uppercase tracking-widest font-bold text-on-surface-variant" htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full bg-surface-container-lowest border-none rounded-md py-3 px-4 text-on-surface focus:ring-2 focus:ring-surface-tint outline-none transition-all placeholder:text-outline/60"
                placeholder="e.g. New York"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-[0.75rem] uppercase tracking-widest font-bold text-on-surface-variant" htmlFor="landmark">Landmark</label>
              <input
                type="text"
                id="landmark"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                className="w-full bg-surface-container-lowest border-none rounded-md py-3 px-4 text-on-surface focus:ring-2 focus:ring-surface-tint outline-none transition-all placeholder:text-outline/60"
                placeholder="e.g. Opposite Central Park"
              />
            </div>
          </div>

          {/* Image Upload Zone */}
          <div className="space-y-4">
            <label className="block text-[0.75rem] uppercase tracking-widest font-bold text-on-surface-variant">Visual Evidence</label>
            <div className="group relative border-2 border-dashed border-outline-variant/30 rounded-xl bg-surface-container-lowest p-12 text-center transition-all hover:border-surface-tint/50 hover:bg-white">
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                ref={fileInputRef}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center pointer-events-none">
                <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-surface-tint text-3xl">cloud_upload</span>
                </div>
                <h3 className="text-base font-bold text-on-surface mb-1">
                  {formData.imageUrl ? formData.imageUrl.name : "Drag and drop images here"}
                </h3>
                <p className="text-sm text-outline mb-6">Support for JPG, PNG up to 10MB</p>
                <span className="text-on-primary-fixed-variant text-sm font-bold underline decoration-2 underline-offset-4">Browse Files</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row-reverse gap-4 pt-8">
            <button
              type="submit"
              disabled={submitLoading}
              className="w-full md:w-auto px-10 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-md font-bold text-sm tracking-widest uppercase shadow-lg shadow-primary/10 active:opacity-80 active:scale-95 transition-all disabled:opacity-50"
            >
              {submitLoading ? "Submitting..." : "Submit Report"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className="w-full md:w-auto px-10 py-4 bg-surface-container-highest text-on-surface rounded-md font-bold text-sm tracking-widest uppercase hover:bg-outline-variant/20 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>

      {/* Bottom Note */}
      <footer className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-tint/5 rounded-full">
          <span className="w-2 h-2 bg-surface-tint rounded-full"></span>
          <p className="text-[0.75rem] font-bold tracking-wider text-surface-tint uppercase">All submissions are logged with cryptographic timestamps.</p>
        </div>
      </footer>
    </div>
  );
};

export default NewComplaint;
