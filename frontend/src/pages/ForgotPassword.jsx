import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const sendPasswordResetOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await API.post("/auth/sendPasswordResetOtp", { email });
      if (res.data.success) {
        setIsOtpSent(true);
        setMessage("OTP sent via email. Please check your inbox.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
      console.error("Send OTP error:", err);
    } finally {
      setLoading(false);
    }
  };

  const verifyPasswordResetOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/verifyPasswordResetOtp", { email, otp });
      const { resetToken } = res.data;
      navigate(`/reset-password/${resetToken}`);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
      console.error("Verify OTP error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ui-page">
      <main className="ui-container py-10 sm:py-16">
        <div className="mx-auto max-w-xl ui-card">
          <h1 className="ui-title">Reset password</h1>
          <p className="ui-subtitle">
            {isOtpSent
              ? "Enter the OTP from your email to continue."
              : "Enter your email and we will send a one-time password."}
          </p>

          {error && <div className="ui-alert ui-alert-error mt-5">{error}</div>}
          {message && <div className="ui-alert ui-alert-success mt-5">{message}</div>}

          {!isOtpSent ? (
            <form onSubmit={sendPasswordResetOtp} className="mt-6 space-y-4">
              <div>
                <label className="ui-label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="ui-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="ui-btn ui-btn-primary w-full">
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyPasswordResetOtp} className="mt-6 space-y-4">
              <div>
                <label className="ui-label" htmlFor="otp">
                  One-time password
                </label>
                <input
                  id="otp"
                  type="text"
                  className="ui-input"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="ui-btn ui-btn-primary w-full">
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm font-medium text-[color:var(--ui-accent)] hover:underline">
              Back to sign in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
