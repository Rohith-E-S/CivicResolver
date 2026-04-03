import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";

const ResetPasswordPage = () => {
  const { id } = useParams(); // This is the token
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/reset-password", {
        password,
        token: id,
      });

      if (res.data.success) {
        setMessage("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Error resetting password. Link may be expired."
      );
      console.error("Reset password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex items-center justify-center p-6 relative z-0">
      <div className="w-full max-w-xl z-10">
        <div className="flex flex-col items-center mb-12">
          <div className="mb-8 p-4 bg-surface-container-low rounded-full">
            <span className="material-symbols-outlined text-4xl text-surface-tint">lock_reset</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-4 font-headline">
            Reset Your Password
          </h1>
          <p className="text-on-surface-variant text-center max-w-sm font-body">
            Choose a strong password to secure your account.
          </p>
        </div>

        <div className="bg-surface-container-lowest p-10 rounded-xl shadow-sm space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-container"></div>
          
          {message && (
            <div className="flex items-center gap-3 p-4 bg-surface-tint/10 rounded-lg text-on-primary-fixed-variant mb-6">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 bg-error-container/50 border border-error/20 rounded-lg text-error mb-6">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[0.75rem] uppercase tracking-widest font-bold text-on-surface-variant" htmlFor="new-password">
                New Password
              </label>
              <div className="relative group">
                <input
                  className="w-full px-4 py-4 bg-surface-container-highest rounded-md border-none focus:ring-2 focus:ring-surface-tint/20 transition-all outline-none text-on-surface placeholder:text-outline/50"
                  id="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                  required
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline cursor-pointer hover:text-on-surface transition-colors">visibility</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[0.75rem] uppercase tracking-widest font-bold text-on-surface-variant" htmlFor="confirm-password">
                Confirm Password
              </label>
              <div className="relative group">
                <input
                  className="w-full px-4 py-4 bg-surface-container-highest rounded-md border-none focus:ring-2 focus:ring-surface-tint/20 transition-all outline-none text-on-surface placeholder:text-outline/50"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                  required
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline cursor-pointer hover:text-on-surface transition-colors">visibility</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-md hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary-container/20 disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>

          <div className="pt-6 text-center">
            <Link to="/login" className="text-sm font-semibold text-on-primary-fixed-variant hover:underline decoration-surface-tint underline-offset-4 transition-all">
              Return to login
            </Link>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between text-[0.7rem] uppercase tracking-widest font-bold text-outline">
          <div className="flex items-center gap-2">
            <div className="w-8 h-[2px] bg-outline-variant/30"></div>
            <span>Editorial Governance</span>
          </div>
          <span>v2.4.0 — Resolution Engine</span>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full h-1/3 -z-10 bg-gradient-to-t from-surface-container-low/50 to-transparent pointer-events-none"></div>
      <div className="fixed top-0 right-0 w-64 h-64 -z-10 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 -z-10 bg-surface-tint/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
    </div>
  );
};

export default ResetPasswordPage;
