import React, { useState } from 'react';
import { signupUser } from '../services/userService';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage('');
        setError('');

        try {
            const data = await signupUser(formData);

            console.log('Signup successful:', data);

            setMessage('Account created successfully!');

            setFormData({
                name: '',
                email: '',
                password: '',
            });
        } catch (error) {
            console.error(error);

            if (error.response) {
                setError(error.response.data.message || 'Signup failed');
            } else {
                setError('Unable to connect to server');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center text-gray-500">
            <div className="p-8 rounded-lg w-96">
                <h1 className="text-3xl font-bold text-center mb-6 mt-25 text-gray-300">
                    Create Account
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1 text-gray-200">Name</label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className="w-full border rounded-2xl px-3 py-2"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 text-gray-200">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="w-full border rounded-2xl px-3 py-2"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block mb-1 text-gray-200">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="w-full border rounded-2xl px-3 py-2"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gray-900 text-white py-2 rounded-2xl hover:bg-gray-950"
                    >
                        Sign Up
                    </button>
                </form>

                {message && (
                    <p className="text-green-600 text-center mt-4">{message}</p>
                )}

                {error && (
                    <p className="text-red-600 text-center mt-4">{error}</p>
                )}

                <p className="text-center mt-5 text-sm">
                    Already have an account?{' '}
                    <a href="/login" className="font-semibold underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
