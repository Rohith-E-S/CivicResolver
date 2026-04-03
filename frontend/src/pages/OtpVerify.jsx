import React, { useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

const OtpVerify = () => {
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const { state } = useLocation();
  const navigate = useNavigate();

  const email = state?.email;

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.substring(value.length - 1);
    setOtpValues(newOtpValues);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otp = otpValues.join("");
    if (otp.length < 6) return;

    try {
      const res = await API.post("/auth/verify-otp", { email, otp });

      if (res.data.success) {
        const pending = JSON.parse(localStorage.getItem("pendingSignup"));

        if (!pending) {
          alert("Signup expired. Please register again.");
          return navigate("/signup");
        }

        const account = await API.post("/auth/create-account", pending);

        localStorage.setItem("token", account.data.token);
        localStorage.setItem("userData", JSON.stringify(account.data.user));
        localStorage.removeItem("pendingSignup");

        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="bg-background text-on-background font-body min-h-screen flex flex-col relative z-0">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-lg font-bold tracking-tighter text-slate-900">
          Editorial Governance
        </Link>
        <div className="hidden md:flex gap-8">
          <span className="text-slate-500 font-medium text-sm">Security Portal</span>
          <span className="text-slate-500 font-medium text-sm">Resolution Engine</span>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 pt-20 pb-12">
        <div className="w-full max-w-md bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-[0_4px_24px_rgba(25,28,30,0.04)]">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-surface-tint text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield_lock</span>
            </div>
            <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-on-surface mb-3">
              Verify Your Email
            </h1>
            <p className="text-base text-on-surface-variant leading-relaxed max-w-xs">
              We've sent a 6-digit verification code to your email. Please enter it below.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-8">
            <div className="flex justify-between gap-2 md:gap-3" id="otp-container">
              {otpValues.map((val, index) => (
                <React.Fragment key={index}>
                  <input
                    ref={(el) => (inputRefs.current[index] = el)}
                    value={val}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-full aspect-square text-center text-xl md:text-2xl font-bold bg-surface-container-highest rounded-lg border-none focus:ring-2 focus:ring-surface-tint transition-all outline-none text-on-surface"
                    maxLength={1}
                    type="text"
                    required
                  />
                  {index === 2 && (
                    <div className="flex items-center text-outline-variant font-light px-1">-</div>
                  )}
                </React.Fragment>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-md font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity focus:ring-2 focus:ring-surface-tint focus:ring-offset-2"
            >
              Verify Account
            </button>
          </form>

          <div className="mt-10 space-y-4 text-center">
            <div className="flex flex-col gap-3">
              <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">
                Didn't receive the code?
                <button className="text-on-primary-fixed-variant hover:underline ml-1">Resend</button>
              </p>
              <div className="h-px w-12 bg-surface-container-high mx-auto"></div>
              <Link to="/signup" className="text-xs text-on-surface-variant hover:text-on-surface transition-colors inline-flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">alternate_email</span>
                Change email address
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden lg:block fixed bottom-12 right-12 max-w-xs text-right opacity-20 pointer-events-none">
          <span className="font-headline text-5xl md:text-6xl font-black block leading-none text-surface-tint">01</span>
          <p className="text-xs uppercase tracking-[0.2em] font-bold mt-2">Security Handshake</p>
        </div>
      </main>

      <footer className="p-6 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4">
            <span className="text-xs text-on-surface-variant uppercase tracking-widest">Trust Protocol 2.4.0</span>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full">
            <span className="material-symbols-outlined text-sm text-surface-tint" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            <span className="text-xs text-on-surface font-bold uppercase tracking-tighter">Authorized Resolution Engine</span>
          </div>
        </div>
      </footer>

      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-surface-tint opacity-[0.03] blur-[120px] rounded-full"></div>
        <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] bg-secondary-container opacity-[0.05] blur-[150px] rounded-full"></div>
      </div>
    </div>
  );
};

export default OtpVerify;
