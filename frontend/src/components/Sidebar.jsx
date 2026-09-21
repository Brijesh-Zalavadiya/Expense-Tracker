import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ConfirmModal from './ConfirmModal';
import { deleteUser } from '../services/userService';

const Sidebar = ({ isOpen, onClose, user }) => {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    const navItems = [
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            name: 'Transactions',
            path: '/transactions',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ),
        },
        {
            name: 'Categories',
            path: '/categories',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
            ),
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleDeleteAccount = async () => {
        if (!user || !user.id) return;
        setIsDeleting(true);
        setDeleteError('');
        try {
            await deleteUser(user.id);
            localStorage.removeItem('user');
            setShowDeleteModal(false);
            navigate('/');
        } catch (err) {
            console.error('Failed to delete account:', err);
            const msg = err.response?.data?.message || 'Failed to delete account. Please try again.';
            setDeleteError(msg);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar drawer / desktop panel */}
            <aside
                className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-[calc(100vh-4rem)] ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="p-4 sm:p-5">
                    {/* Header for mobile drawer */}
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 md:hidden">
                        <div className="flex items-center gap-2 text-white">
                            <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center text-xs font-mono font-semibold">
                                ₹
                            </span>
                            <span className="font-semibold text-sm">Expense Tracker</span>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                                        isActive
                                            ? 'bg-slate-800 text-white shadow-xs font-semibold'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                                    }`
                                }
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>

                {/* Bottom Account & Actions */}
                <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 space-y-2">
                    {user && (
                        <div className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800/80 mb-2">
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Account</p>
                            <p className="text-xs font-semibold text-slate-200 truncate mt-0.5">{user.name}</p>
                            <p className="text-[11px] text-slate-500 font-mono truncate">{user.email}</p>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-xl transition cursor-pointer"
                    >
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
                    >
                        <svg className="w-4 h-4 text-rose-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete Account</span>
                    </button>
                </div>
            </aside>

            {/* Confirm Account Deletion Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                title="Delete Account"
                message={deleteError ? deleteError : "Are you sure you want to permanently delete your account? This action cannot be undone."}
                confirmText={isDeleting ? "Deleting..." : "Delete My Account"}
                confirmColor="red"
                isLoading={isDeleting}
                onConfirm={handleDeleteAccount}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setDeleteError('');
                }}
            />
        </>
    );
};

export default Sidebar;
