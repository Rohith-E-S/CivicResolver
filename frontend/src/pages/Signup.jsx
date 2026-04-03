import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const decoded = jwtDecode(response.credential);

      const res = await API.post("/auth/google-login", {
        email: decoded.email,
        fullName: decoded.name,
        profilePic: decoded.picture,
        googleId: decoded.sub,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userData", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Google Login failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/send-otp", { email: formData.email });

      if (res.data.success) {
        localStorage.setItem("pendingSignup", JSON.stringify(formData));
        navigate("/otp-verify", { state: { email: formData.email } });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background relative z-0">
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface/80 backdrop-blur-md rounded-full shadow-sm border border-outline-variant/15">
              <span className="material-symbols-outlined text-surface-tint" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Resolution Engine Authority</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-8 md:p-12 shadow-[0_8px_24px_rgba(25,28,30,0.04)] relative overflow-hidden">
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-primary mb-4 leading-tight">
                Join CivicTrust
              </h1>
              <p className="text-body-lg text-on-surface-variant max-w-sm">
                Empower your community by reporting local issues.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-error-container border border-error/30 rounded-lg">
                <p className="text-on-error-container text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">Full Name</label>
                  <div className="relative">
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-body-lg focus:ring-2 focus:ring-surface-tint/20 transition-all outline-none placeholder:text-outline/60 text-on-surface"
                      placeholder="Jane Doe"
                      type="text"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">Email</label>
                  <div className="relative">
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-body-lg focus:ring-2 focus:ring-surface-tint/20 transition-all outline-none placeholder:text-outline/60 text-on-surface"
                      placeholder="jane@example.com"
                      type="email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">Password</label>
                  <div className="relative">
                    <input
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-body-lg focus:ring-2 focus:ring-surface-tint/20 transition-all outline-none placeholder:text-outline/60 text-on-surface"
                      placeholder="••••••••"
                      type="password"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">Address</label>
                  <div className="relative">
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-body-lg focus:ring-2 focus:ring-surface-tint/20 transition-all outline-none placeholder:text-outline/60 text-on-surface resize-none"
                      placeholder="123 Main Street, City, State"
                      rows="3"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-br from-primary to-primary-container rounded-lg text-on-primary font-bold text-sm tracking-wide shadow-lg hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Sending OTP..." : "Create Account"}
              </button>
            </form>

            <div className="relative flex items-center my-10">
              <div className="flex-grow h-[1px] bg-outline-variant/20"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-widest text-outline">or continue with</span>
              <div className="flex-grow h-[1px] bg-outline-variant/20"></div>
            </div>

            <div className="flex justify-center w-full [&>div]:w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google Login failed")}
                theme="filled_black"
                shape="rectangular"
                text="signup_with"
                size="large"
                width="100%"
              />
            </div>

            <div className="mt-10 pt-8 border-t border-outline-variant/10 text-center">
              <p className="text-sm text-on-surface-variant">
                Already have an account?
                <Link to="/login" className="text-on-primary-fixed-variant font-bold hover:underline ml-1">Sign in</Link>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center px-6">
            <p className="text-[10px] text-outline leading-relaxed uppercase tracking-widest">
              By joining, you agree to the Editorial Governance <br />
              <span className="underline hover:text-on-surface cursor-pointer">Terms of Engagement</span> &amp; <span className="underline hover:text-on-surface cursor-pointer">Privacy Protocols</span>
            </p>
          </div>
        </div>
      </main>

      <div className="fixed top-0 right-0 -z-10 w-1/3 h-screen bg-surface-container-low" style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}></div>
      <div className="fixed bottom-0 left-0 -z-10 w-64 h-64 bg-surface-tint/5 rounded-full blur-3xl"></div>
    </div>
  );
};

export default Signup;
