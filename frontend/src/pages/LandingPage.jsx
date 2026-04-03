import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const LandingPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await API.post('/auth/logout');
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            setIsLoggedIn(false);
            navigate('/');
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <div className="min-h-screen bg-background text-on-background font-sans selection:bg-surface-tint/20 selection:text-on-primary-fixed overflow-x-hidden">
            
            {/* Top Navigation - Glassmorphic */}
            <nav className="fixed w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/15 transition-all">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex-shrink-0 flex items-center gap-3">
                            <div className="w-10 h-10 bg-surface-tint text-on-primary rounded-xl flex items-center justify-center font-black text-xl shadow-sm">
                                R
                            </div>
                            <span className="text-xl font-bold tracking-tight text-on-surface">
                                Resolution<span className="font-light">Engine</span>
                            </span>
                        </div>
                        <div className="flex items-center space-x-6">
                            {isLoggedIn ? (
                                <>
                                    <Link to="/dashboard" className="hidden sm:block text-on-surface-variant hover:text-surface-tint font-bold text-xs uppercase tracking-widest transition-colors">
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-xs uppercase tracking-widest font-bold border border-outline-variant/30 bg-surface-container-highest hover:bg-surface-container-high text-on-surface px-5 py-2.5 rounded-lg transition-all"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="hidden sm:block text-on-surface-variant hover:text-surface-tint font-bold text-xs uppercase tracking-widest transition-colors">
                                        Sign In
                                    </Link>
                                    <Link to="/signup" className="text-xs uppercase tracking-widest bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-3 rounded-lg font-bold shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-transform hover:-translate-y-0.5">
                                        File a Report
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 pt-40 pb-20 sm:pt-48 sm:pb-32 lg:pb-40">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        
                        {/* Text Content */}
                        <div className="flex-1 text-left z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/20 mb-10">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-surface-tint opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-surface-tint"></span>
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant">
                                    Official Public Portal
                                </span>
                            </div>

                            <h1 className="text-5xl sm:text-7xl xl:text-[5rem] font-black tracking-tighter text-on-surface mb-8 leading-[1.05]">
                                The Standard for <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-surface-tint to-on-primary-container">
                                    Civic Redressal.
                                </span>
                            </h1>

                            <p className="text-xl sm:text-2xl text-on-surface-variant font-light leading-relaxed max-w-2xl mb-12">
                                Direct, transparent access to administration. Submit grievances securely and track their resolution with authoritative oversight.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5">
                                {isLoggedIn ? (
                                    <Link to="/dashboard" className="px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary text-sm uppercase tracking-widest font-bold rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-transform hover:scale-[1.02] flex items-center justify-center gap-3">
                                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>dashboard</span>
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link to="/signup" className="px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary text-sm uppercase tracking-widest font-bold rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-transform hover:scale-[1.02] flex items-center justify-center gap-3">
                                            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>edit_document</span>
                                            Submit Grievance
                                        </Link>
                                        <Link to="/login" className="px-8 py-4 bg-surface-container-highest text-on-surface text-sm uppercase tracking-widest font-bold rounded-xl hover:bg-surface-container-high transition-colors flex items-center justify-center gap-3">
                                            <span className="material-symbols-outlined">search</span>
                                            Track Status
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Visual Content (Editorial Mockup) */}
                        <div className="flex-1 w-full relative hidden lg:block">
                            <div className="relative bg-surface-container-lowest border border-outline-variant/15 rounded-[2rem] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.05)]">
                                {/* Mockup Header */}
                                <div className="flex items-center justify-between mb-10 pb-6 border-b border-outline-variant/15">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-on-surface-variant">person</span>
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-on-surface">Reference #ID-9482</div>
                                            <div className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mt-1">Status: Under Review</div>
                                        </div>
                                    </div>
                                    <div className="px-4 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-container text-[10px] font-black uppercase tracking-widest">
                                        In Progress
                                    </div>
                                </div>
                                
                                {/* Mockup Content */}
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="h-3 w-3/4 bg-surface-container-high rounded-sm"></div>
                                        <div className="h-3 w-full bg-surface-container-low rounded-sm"></div>
                                        <div className="h-3 w-5/6 bg-surface-container-low rounded-sm"></div>
                                    </div>
                                    
                                    <div className="pt-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="material-symbols-outlined text-surface-tint">update</span>
                                            <span className="text-xs font-bold uppercase tracking-widest text-on-surface">Timeline</span>
                                        </div>
                                        <div className="relative pl-4 border-l-2 border-surface-container-high space-y-6">
                                            <div className="relative">
                                                <div className="absolute -left-[21px] w-3 h-3 rounded-full bg-surface-tint"></div>
                                                <div className="text-sm font-bold text-on-surface">Assigned to Department</div>
                                                <div className="text-xs text-on-surface-variant mt-1">Today, 09:42 AM</div>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute -left-[21px] w-3 h-3 rounded-full bg-surface-container-high border-2 border-surface-container-lowest"></div>
                                                <div className="text-sm font-bold text-on-surface-variant">Request Received</div>
                                                <div className="text-xs text-on-surface-variant mt-1">Yesterday, 14:30 PM</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Floating Stats */}
                            <div className="absolute -bottom-8 -left-8 bg-surface-container-lowest border border-outline-variant/15 p-6 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] flex items-center gap-5">
                                <div className="w-14 h-14 bg-secondary-container text-on-secondary-container rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-on-surface">94%</div>
                                    <div className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Resolution Rate</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Platform Capabilities (Editorial Tonal Architecture) */}
            <section className="relative z-10 py-32 bg-surface-container-low border-t border-outline-variant/15">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="mb-20">
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-on-surface">System Architecture</h2>
                        <p className="mt-4 text-lg text-on-surface-variant font-light max-w-2xl">Built for absolute transparency and administrative accountability.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-surface-container-lowest p-10 rounded-[2rem] shadow-sm border border-outline-variant/10">
                            <div className="w-14 h-14 bg-surface-container-low rounded-2xl flex items-center justify-center mb-8 text-on-surface">
                                <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'wght' 300"}}>lock</span>
                            </div>
                            <h3 className="text-xl font-bold text-on-surface mb-4">Encrypted Submissions</h3>
                            <p className="text-on-surface-variant leading-relaxed">
                                All grievance data is encrypted at rest and in transit. Your identity is protected by advanced protocols ensuring confidentiality.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-surface-container-lowest p-10 rounded-[2rem] shadow-sm border border-outline-variant/10">
                            <div className="w-14 h-14 bg-surface-container-low rounded-2xl flex items-center justify-center mb-8 text-on-surface">
                                <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'wght' 300"}}>notifications_active</span>
                            </div>
                            <h3 className="text-xl font-bold text-on-surface mb-4">Real-time Tracking</h3>
                            <p className="text-on-surface-variant leading-relaxed">
                                Receive immediate status updates as your complaint moves through administrative stages toward final resolution.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-surface-container-lowest p-10 rounded-[2rem] shadow-sm border border-outline-variant/10">
                            <div className="w-14 h-14 bg-surface-container-low rounded-2xl flex items-center justify-center mb-8 text-on-surface">
                                <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'wght' 300"}}>analytics</span>
                            </div>
                            <h3 className="text-xl font-bold text-on-surface mb-4">Public Accountability</h3>
                            <p className="text-on-surface-variant leading-relaxed">
                                Transparent analytics and reporting metrics ensure that governing bodies remain accountable to the community.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Authority Footer */}
            <footer className="py-16 bg-surface border-t border-outline-variant/15 text-center flex flex-col items-center">
                <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-surface-container-low border border-outline-variant/20 mb-8">
                    <span className="material-symbols-outlined text-on-surface-variant" style={{fontVariationSettings: "'FILL' 1"}}>account_balance</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-on-surface">Official Governance Portal</span>
                </div>
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row justify-between w-full items-center gap-6">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Resolution Engine &copy; {new Date().getFullYear()}
                    </p>
                    <div className="flex gap-8 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                        <a href="#" className="hover:text-surface-tint transition-colors">Privacy</a>
                        <a href="#" className="hover:text-surface-tint transition-colors">Terms</a>
                        <a href="#" className="hover:text-surface-tint transition-colors">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
