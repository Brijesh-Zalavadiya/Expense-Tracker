import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';

// Helper component to guard private routes
const ProtectedRoute = ({ children }) => {
    const user = localStorage.getItem('user');
    if (!user) {
        return <Navigate to="/" replace />;
    }
    return children;
};

// Helper component to redirect authenticated users away from auth pages
const PublicOnlyRoute = ({ children }) => {
    const user = localStorage.getItem('user');
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
};

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public & Landing routes */}
                <Route
                    path="/"
                    element={
                        <PublicOnlyRoute>
                            <Homepage />
                        </PublicOnlyRoute>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <PublicOnlyRoute>
                            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                                <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
                                    <Login />
                                </div>
                            </div>
                        </PublicOnlyRoute>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <PublicOnlyRoute>
                            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                                <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
                                    <Signup />
                                </div>
                            </div>
                        </PublicOnlyRoute>
                    }
                />

                {/* Protected Application routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/transactions"
                    element={
                        <ProtectedRoute>
                            <Transactions />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/categories"
                    element={
                        <ProtectedRoute>
                            <Categories />
                        </ProtectedRoute>
                    }
                />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
