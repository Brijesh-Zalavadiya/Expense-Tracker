import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/');
        } else {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem('user');
                navigate('/');
            }
        }
    }, [navigate]);

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col">
            <Navbar
                user={user}
                onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
            />

            <div className="flex h-[calc(100vh-80px)]">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    user={user}
                    className="fixed"
                />

                <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-7xl mx-auto"> {children} </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
