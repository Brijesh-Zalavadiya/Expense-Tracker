import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onToggleSidebar }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3">
                    {user && (
                        <button
                            type="button"
                            onClick={onToggleSidebar}
                            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 focus:outline-none cursor-pointer"
                            aria-label="Toggle navigation menu"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    )}

                    <Link
                        to={user ? '/dashboard' : '/'}
                        className="flex items-center gap-2.5 group"
                    >
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-mono text-sm font-semibold shadow-xs">
                            ₹
                        </span>
                        <div className="flex items-center gap-1.5">
                            <span className="text-base font-semibold tracking-tight text-white">
                                Expense
                            </span>
                            <span className="text-base font-light text-slate-400">
                                Tracker
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex flex-col text-right">
                                <span className="text-xs font-semibold text-slate-200">
                                    {user.name}
                                </span>
                                <span className="text-[11px] text-slate-500 font-mono">
                                    {user.email}
                                </span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center font-semibold text-xs">
                                {user.name
                                    ? user.name.charAt(0).toUpperCase()
                                    : 'U'}
                            </div>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="hidden sm:inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800 transition cursor-pointer"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="text-xs text-slate-500 font-medium">
                            Personal Financial Management
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
