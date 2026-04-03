import React, { useState } from "react";
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
    <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center p-6 relative z-0">
      <main className="w-full max-w-md flex flex-col items-center z-10">
        <div className="mb-12 flex flex-col items-center">
          <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-outline-variant/15 flex items-center gap-2 mb-8">
            <span className="material-symbols-outlined text-surface-tint text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
            <span className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-on-surface-variant">Editorial Governance</span>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-surface-tint text-3xl">lock_reset</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-primary text-center mb-4">
            Forgot Your Password?
          </h1>
          <p className="text-on-surface-variant text-center text-sm md:text-base leading-relaxed font-normal max-w-[320px]">
            {isOtpSent
              ? "Enter the OTP sent to your email to verify your request."
              : "No worries! Enter your email below and we'll send you an OTP to reset it."}
          </p>
        </div>

        <div className="w-full bg-surface-container-lowest p-8 rounded-xl shadow-[0_24px_48px_-12px_rgba(0,0,0,0.04)]">
          {error && (
            <div className="mb-6 p-4 bg-error-container border border-error/30 rounded-lg">
              <p className="text-on-error-container text-sm font-medium">{error}</p>
            </div>
          )}
          {message && (
            <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-green-800 text-sm font-medium">{message}</p>
            </div>
          )}

          {!isOtpSent ? (
            <form onSubmit={sendPasswordResetOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold tracking-widest uppercase text-on-surface-variant ml-1" htmlFor="email">
                  Email address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline text-lg">mail</span>
                  </div>
                  <input
                    className="block w-full pl-11 pr-4 py-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-surface-tint focus:bg-surface-container-lowest transition-all placeholder:text-outline/60 text-on-surface"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@authority.gov"
                    required
                    type="email"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-lg shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset OTP"}
                {!loading && <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyPasswordResetOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold tracking-widest uppercase text-on-surface-variant ml-1" htmlFor="otp">
                  Enter OTP
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline text-lg">vpn_key</span>
                  </div>
                  <input
                    className="block w-full pl-11 pr-4 py-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-surface-tint focus:bg-surface-container-lowest transition-all placeholder:text-outline/60 text-on-surface tracking-widest font-mono"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="••••••"
                    required
                    type="text"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-lg shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Proceed"}
                {!loading && <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>}
              </button>
            </form>
          )}
        </div>

        <div className="mt-8">
          <Link to="/login" className="flex items-center gap-2 text-on-primary-fixed-variant hover:text-surface-tint font-semibold text-sm transition-colors group">
            <span className="material-symbols-outlined text-lg">keyboard_backspace</span>
            <span>Back to login</span>
          </Link>
        </div>
      </main>

      <footer className="mt-auto pt-12 pb-6 flex flex-col items-center gap-4 z-10">
        <div className="h-px w-12 bg-outline-variant/30"></div>
        <p className="text-[0.65rem] font-medium tracking-widest uppercase text-outline">
          Resolution Engine v2.4.0
        </p>
      </footer>

      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-surface-tint/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary-container/10 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
};

export default ForgotPassword;
