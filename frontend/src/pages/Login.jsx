import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", formData);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userData", JSON.stringify(res.data.user));

        navigate(res.data.user.isAdmin ? "/admin-dashboard" : "/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
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

      navigate(res.data.user.isAdmin ? "/admin-dashboard" : "/dashboard");
    } catch (err) {
      console.error(err);
      setError("Google Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-lg">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-8 bg-surface-container-low px-4 py-2 rounded-full shadow-sm">
            <span className="material-symbols-outlined text-surface-tint" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            <span className="text-xs font-bold tracking-widest uppercase text-on-surface-variant">Editorial Governance</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-primary mb-3">Welcome Back to CivicTrust</h1>
          <p className="text-on-surface-variant text-lg font-medium leading-relaxed max-w-sm mx-auto">Login to your account to report and track issues.</p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-primary-container"></div>
          
          {error && (
            <div className="mb-6 p-4 bg-error-container border border-error/30 rounded-lg">
              <p className="text-on-error-container text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="email">Email</label>
              <div className="relative">
                <input
                  className="w-full px-4 py-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-surface-tint transition-all placeholder:text-outline/60 text-on-surface"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  type="email"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-end ml-1">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant" htmlFor="password">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-on-primary-fixed-variant hover:underline decoration-2 underline-offset-4">Forgot Password?</Link>
              </div>
              <div className="relative">
                <input
                  className="w-full px-4 py-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-surface-tint transition-all placeholder:text-outline/60 text-on-surface"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  type="password"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-lg shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </>
              )}
            </button>
          </form>
          
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/30"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span className="bg-surface-container-lowest px-4 text-outline">or continue with</span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google Login failed")}
              theme="filled_black"
              shape="rectangular"
              text="signin_with"
              size="large"
              width="100%"
            />
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-on-surface-variant text-sm font-medium">
            New to CivicTrust?
            <Link to="/signup" className="text-on-primary-fixed-variant font-bold hover:underline decoration-2 underline-offset-4 ml-1">Create an account</Link>
          </p>
        </div>
        
        <div className="mt-16 pt-8 border-t border-outline-variant/10 flex flex-wrap justify-center gap-x-8 gap-y-4">
          <Link to="/" className="text-[10px] uppercase tracking-widest font-black text-outline hover:text-primary transition-colors">Home</Link>
          <span className="text-[10px] uppercase tracking-widest font-black text-outline transition-colors">Privacy Policy</span>
          <span className="text-[10px] uppercase tracking-widest font-black text-outline transition-colors">Terms of Service</span>
        </div>
      </div>
      
      <div className="fixed bottom-10 right-10 hidden lg:block">
        <div className="bg-surface-container-low p-4 rounded-xl max-w-[240px] shadow-sm border border-outline-variant/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-surface-tint animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface">Authority Status</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">System operational. <span className="font-bold text-primary">Secure Connection</span> established.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
