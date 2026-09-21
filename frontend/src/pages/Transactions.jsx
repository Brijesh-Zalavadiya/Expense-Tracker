import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Layout from '../components/Layout';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import { getAllTransactions, deleteTransaction } from '../services/transactionService';
import { getAllCategories } from '../services/categoryService';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    const user = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch {
            return null;
        }
    }, []);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const [txData, catData] = await Promise.all([
                getAllTransactions(),
                getAllCategories(),
            ]);

            const userTx = (txData || []).filter(
                (t) => !user || t.userId === user.id
            );
            // Sort by transactionDate descending
            userTx.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
            setTransactions(userTx);
            setCategories(catData || []);
        } catch (err) {
            console.error('Error fetching transactions:', err);
            setError('Failed to load transactions. Please check backend connection.');
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDeleteTransaction = async (id) => {
        await deleteTransaction(id);
        setTransactions((prev) => prev.filter((t) => t.id !== id));
    };

    const handleTransactionAdded = (newTx) => {
        setTransactions((prev) => [newTx, ...prev]);
        setShowAddModal(false);
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            Transactions
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">
                            Review, search, and manage all your income and expense records.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-semibold text-xs sm:text-sm transition shadow-sm cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add Transaction</span>
                    </button>
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-rose-400 text-sm flex items-center justify-between">
                        <span>{error}</span>
                        <button
                            type="button"
                            onClick={fetchData}
                            className="underline font-semibold ml-2 cursor-pointer hover:text-rose-300"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {isLoading ? (
                    <div className="p-12 text-center text-slate-500 text-xs">
                        <div className="inline-block animate-spin w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full mb-2"></div>
                        <p>Loading transactions...</p>
                    </div>
                ) : (
                    <TransactionList
                        transactions={transactions}
                        categories={categories}
                        onDeleteTransaction={handleDeleteTransaction}
                    />
                )}
            </div>

            {/* Add Transaction Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
                    <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl">
                        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                            <h3 className="text-lg font-bold text-white">Add New Transaction</h3>
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <TransactionForm
                            categories={categories}
                            userId={user?.id}
                            onSuccess={handleTransactionAdded}
                            onCancel={() => setShowAddModal(false)}
                        />
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Transactions;
