import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/userService';

const Login = ({ setAuth }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await loginUser(formData);
            localStorage.setItem('user', JSON.stringify(data));
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            if (err.response) {
                setError(err.response.data.message || 'Invalid email or password');
            } else {
                setError('Unable to connect to server. Please verify backend is running.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm sm:max-w-md mx-auto px-4 py-6 sm:p-8">
            <div className="mb-6 sm:mb-8 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Sign In</h1>
                <p className="text-slate-400 mt-1.5 text-xs sm:text-sm">
                    Enter your credentials to access your financial dashboard.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-rose-400 text-xs">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block mb-1.5 text-slate-300 text-xs font-medium uppercase tracking-wider">
                        Email Address
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@company.com"
                        className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-600 rounded-xl px-4 py-2.5 outline-none text-xs focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1.5 text-slate-300 text-xs font-medium uppercase tracking-wider">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-600 rounded-xl px-4 py-2.5 outline-none text-xs focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 bg-white text-slate-950 font-semibold py-2.5 rounded-xl transition hover:bg-slate-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2 text-xs"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-3.5 w-3.5 text-slate-950" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Signing in...</span>
                        </>
                    ) : (
                        'Sign In'
                    )}
                </button>
            </form>

            <div className="flex items-center gap-3 my-6">
                <div className="h-px bg-slate-800 flex-1"></div>
                <span className="text-slate-600 text-[10px] uppercase tracking-wider">OR</span>
                <div className="h-px bg-slate-800 flex-1"></div>
            </div>

            <p className="text-center text-xs text-slate-400">
                Don't have an account?{' '}
                <button
                    type="button"
                    onClick={() => (setAuth ? setAuth('Signup') : navigate('/signup'))}
                    className="font-semibold text-slate-200 hover:underline cursor-pointer transition ml-1"
                >
                    Create Account
                </button>
            </p>
        </div>
    );
};

export default Login;
