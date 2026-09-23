import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bg_1 from '../assets/bg_1.jpg';
import Navbar from '../components/Navbar';
import Login from './login';
import Signup from './signup';

const Homepage = () => {
    const [auth, setAuth] = useState('Login');
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            navigate('/dashboard');
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
            <Navbar />

            <div className="flex-1 flex flex-col lg:flex-row items-center justify-center relative overflow-hidden">
                <div className="hidden lg:block lg:w-1/2 h-full absolute left-0 top-0 bottom-0 pointer-events-none">
                    <img
                        src={bg_1}
                        alt="Financial analytics background"
                        className="w-full h-full object-cover opacity-20 grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-950/80 to-slate-950" />
                </div>

                {/* Left hero column */}
                <div className="hidden lg:flex lg:w-1/2 z-10 flex-col justify-center px-12 xl:px-16 text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300 text-[11px] font-medium uppercase tracking-wider mb-6 w-fit">
                        Financial Tracking System
                    </div>
                    <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight">
                        Clarity over your income, <br />
                        <span className="text-slate-400 font-normal">
                            expenses, and cash flow.
                        </span>
                    </h1>
                    <p className="mt-4 text-slate-400 text-sm max-w-lg leading-relaxed">
                        A clean, minimalist platform designed to organize
                        financial records by month, year, and category with zero
                        friction.
                    </p>

                    <div className="mt-8 grid grid-cols-3 gap-3.5 max-w-lg">
                        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/90">
                            <div className="text-slate-200 font-semibold text-lg font-mono">
                                100%
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                                Local & Private
                            </div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/90">
                            <div className="text-slate-200 font-semibold text-lg font-mono">
                                Period
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                                Month/Year Analysis
                            </div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/90">
                            <div className="text-slate-200 font-semibold text-lg font-mono">
                                Real-time
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                                Automatic Calculations
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Card Area (Login / Signup) */}
                <div className="w-full lg:w-1/2 z-10 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                    <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden">
                        {/* Tab toggle at the top of form card */}
                        <div className="flex border-b border-slate-800 bg-slate-950/40">
                            <button
                                type="button"
                                onClick={() => setAuth('Login')}
                                className={`flex-1 py-3 text-xs font-semibold tracking-wider uppercase transition cursor-pointer border-b-2 ${
                                    auth === 'Login'
                                        ? 'border-white text-white bg-slate-900/60'
                                        : 'border-transparent text-slate-500 hover:text-slate-300'
                                }`}
                            >
                                Sign In
                            </button>
                            <button
                                type="button"
                                onClick={() => setAuth('Signup')}
                                className={`flex-1 py-3 text-xs font-semibold tracking-wider uppercase transition cursor-pointer border-b-2 ${
                                    auth === 'Signup'
                                        ? 'border-white text-white bg-slate-900/60'
                                        : 'border-transparent text-slate-500 hover:text-slate-300'
                                }`}
                            >
                                Sign Up
                            </button>
                        </div>

                        <div
                            key={auth}
                            className={
                                auth === 'Login' ? 'auth-login' : 'auth-signup'
                            }
                        >
                            {auth === 'Login' ? (
                                <Login setAuth={setAuth} />
                            ) : (
                                <Signup setAuth={setAuth} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
