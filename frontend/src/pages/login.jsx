import React, { useState } from 'react';
import { loginUser } from '../services/userService';
const Login = (props) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const data = await loginUser(formData);
            console.log(data);
            setMessage('Login successful!');
            localStorage.setItem('user', JSON.stringify(data));
        } catch (error) {
            console.error(error);
            if (error.response) {
                setError(
                    error.response.data.message || 'Invalid email or password',
                );
            } else {
                setError('Unable to connect to server');
            }
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-96 px-8 py-10">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-white">Login</h1>
                    <p className="text-slate-400 mt-2 text-sm">
                        Track your money. Manage your expenses.
                    </p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label className="block mb-2 text-slate-300 ml-1 text-sm font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="w-full bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 outline-none transition duration-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            required
                        />
                    </div>
                    <div className="mb-7">
                        <label className="block mb-2 text-slate-300 ml-1 text-sm font-medium">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="w-full bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 outline-none transition duration-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-emerald-500 text-slate-950 font-semibold py-3 rounded-xl transition duration-200 hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 hover:cursor-pointer active:scale-[0.98]"
                    >
                        Login
                    </button>
                </form>
                {message && (
                    <p className="text-emerald-400 text-center mt-5 text-sm font-medium">
                        {message}
                    </p>
                )}
                {error && (
                    <p className="text-red-400 text-center mt-5 text-sm font-medium">
                        {error}
                    </p>
                )}
                <div className="flex items-center gap-3 my-7">
                    <div className="h-px bg-slate-800 flex-1"></div>
                    <span className="text-slate-600 text-xs">OR</span>
                    <div className="h-px bg-slate-800 flex-1"></div>
                </div>
                <p className="text-center text-sm text-slate-400">
                    Don't have an account?
                    <span
                        onClick={() => props.setAuth('Signup')}
                        className="font-semibold text-emerald-400 hover:text-emerald-300 hover:cursor-pointer transition ml-1"
                    >
                        Sign Up
                    </span>
                </p>
            </div>
        </div>
    );
};
export default Login;
