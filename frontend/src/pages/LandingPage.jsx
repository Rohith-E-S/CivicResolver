import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import AppHeader from "../components/AppHeader";

const LandingPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      setIsLoggedIn(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="ui-page">
      <AppHeader
        brandTo="/"
        brandInitial="C"
        brandLabel="Complaint Register Portal"
        title="Public portal"
        subtitle="Submit and track complaints"
        actions={
          isLoggedIn ? (
            <>
              <Link to="/dashboard" className="ui-btn ui-btn-secondary">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="ui-btn ui-btn-primary">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="ui-btn ui-btn-secondary">
                Sign in
              </Link>
              <Link to="/signup" className="ui-btn ui-btn-primary">
                Create account
              </Link>
            </>
          )
        }
      />

      <main className="ui-container py-10 sm:py-16">
        <section className="ui-card mb-8">
          <h1 className="ui-title">Simple, clear complaint tracking for everyone.</h1>
          <p className="ui-subtitle max-w-3xl">
            Submit complaints, monitor progress, and communicate with the resolution team in one
            place. The interface is designed for clarity, high contrast, and easy navigation.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {isLoggedIn ? (
              <Link to="/dashboard" className="ui-btn ui-btn-primary">
                Open dashboard
              </Link>
            ) : (
              <>
                <Link to="/signup" className="ui-btn ui-btn-primary">
                  Submit a complaint
                </Link>
                <Link to="/login" className="ui-btn ui-btn-secondary">
                  Track existing complaint
                </Link>
              </>
            )}
          </div>
        </section>

        <section className="ui-grid-auto">
          <article className="ui-card">
            <h2 className="text-lg font-semibold">Fast submission</h2>
            <p className="mt-2 text-sm text-[color:var(--ui-text-muted)]">
              Clear forms with location support help you file reports quickly.
            </p>
          </article>
          <article className="ui-card">
            <h2 className="text-lg font-semibold">Transparent status</h2>
            <p className="mt-2 text-sm text-[color:var(--ui-text-muted)]">
              Follow each complaint through new, in progress, and resolved stages.
            </p>
          </article>
          <article className="ui-card">
            <h2 className="text-lg font-semibold">Direct communication</h2>
            <p className="mt-2 text-sm text-[color:var(--ui-text-muted)]">
              Use secure chat for updates and clarifications with administrators.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
