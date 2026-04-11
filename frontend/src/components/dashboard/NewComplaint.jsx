import { useRef } from "react";
import API from "../../api/axios";

const NewComplaint = ({
  formData,
  setFormData,
  submitLoading,
  setSubmitLoading,
  message,
  setMessage,
  fetchComplaints,
  setActiveTab,
}) => {
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, imageUrl: e.target.files[0] }));
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setMessage({ type: "error", text: "Geolocation not supported" });
      return;
    }

    setMessage({ type: "success", text: "Fetching location..." });

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toString();
        const lng = pos.coords.longitude.toString();
        setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          const city =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.municipality ||
            "";
          const state = data?.address?.state || "";
          setFormData((prev) => ({ ...prev, city, state }));
          setMessage({ type: "success", text: "Location fetched." });
        } catch (error) {
          console.error("Geocoding error:", error);
          setMessage({ type: "success", text: "Coordinates fetched. Add city/state manually." });
        }
      },
      () => setMessage({ type: "error", text: "Unable to fetch location" })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.latitude || !formData.longitude) {
      setMessage({ type: "error", text: "Please fetch your location before submitting." });
      return;
    }
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
        setMessage({ type: "success", text: "Complaint submitted successfully." });
        setFormData({
          description: "",
          city: "",
          state: "",
          landmark: "",
          latitude: "",
          longitude: "",
          imageUrl: null,
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchComplaints();
        setTimeout(() => setActiveTab("overview"), 1000);
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Submission failed. Please try again." });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="ui-card space-y-4">
      <div>
        <h1 className="ui-title">New complaint</h1>
        <p className="ui-subtitle">Provide accurate details for faster resolution.</p>
      </div>

      {message.text && (
        <div className={`ui-alert ${message.type === "success" ? "ui-alert-success" : "ui-alert-error"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="ui-label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="ui-textarea"
            placeholder="Describe the issue clearly."
            required
          />
        </div>

        <div className="ui-card-muted">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[color:var(--ui-text-muted)]">Location helps route your complaint.</p>
            <button type="button" onClick={getLocation} className="ui-btn ui-btn-secondary">
              Use current location
            </button>
          </div>
          {formData.latitude && formData.longitude && (
            <div className="mt-3 space-y-1">
              <p className="text-sm text-[color:var(--ui-text-muted)]">
                Coordinates: {formData.latitude}, {formData.longitude}
              </p>
              {(formData.city || formData.state || formData.landmark) && (
                <p className="text-sm text-[color:var(--ui-text-muted)]">
                  Address: {[formData.landmark, formData.city, formData.state].filter(Boolean).join(", ")}
                </p>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="ui-label" htmlFor="image-upload">
            Evidence image
          </label>
          <input
            id="image-upload"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="ui-input file:mr-3 file:rounded file:border-0 file:bg-[color:var(--ui-surface-muted)] file:px-3 file:py-2 file:text-sm"
          />
          {formData.imageUrl && (
            <p className="mt-2 text-sm text-[color:var(--ui-text-muted)]">Selected: {formData.imageUrl.name}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={submitLoading} className="ui-btn ui-btn-primary">
            {submitLoading ? "Submitting..." : "Submit complaint"}
          </button>
          <button type="button" onClick={() => setActiveTab("overview")} className="ui-btn ui-btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewComplaint;
