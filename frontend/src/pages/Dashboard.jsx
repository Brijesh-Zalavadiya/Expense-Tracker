import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import TransactionForm from '../components/TransactionForm';
import TransactionItem from '../components/TransactionItem';
import { getAllTransactions, deleteTransaction } from '../services/transactionService';
import { getAllCategories } from '../services/categoryService';

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    // Period filter state for dashboard
    const now = new Date();
    const currentYear = now.getFullYear().toString();
    const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');

    const [periodMode, setPeriodMode] = useState('ALL'); // 'ALL' | 'THIS_MONTH' | 'THIS_YEAR' | 'CUSTOM'
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

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
            setTransactions(userTx);
            setCategories(catData || []);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data. Please check backend connection.');
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

    // Extract available years
    const availableYears = useMemo(() => {
        const yearSet = new Set();
        yearSet.add(currentYear);
        transactions.forEach((t) => {
            if (t.transactionDate) {
                const y = t.transactionDate.split('-')[0];
                if (y && y.length === 4) yearSet.add(y);
            }
        });
        return Array.from(yearSet).sort((a, b) => b.localeCompare(a));
    }, [transactions, currentYear]);

    // Filter transactions by selected period
    const periodTransactions = useMemo(() => {
        return transactions.filter((t) => {
            if (!t.transactionDate) return false;
            const [tYear, tMonth] = t.transactionDate.split('-');

            if (periodMode === 'THIS_MONTH') {
                return tYear === currentYear && tMonth === currentMonth;
            } else if (periodMode === 'THIS_YEAR') {
                return tYear === currentYear;
            } else if (periodMode === 'CUSTOM') {
                if (selectedYear !== 'ALL' && tYear !== selectedYear) return false;
                if (selectedMonth !== 'ALL' && tMonth !== selectedMonth) return false;
                return true;
            }
            return true;
        });
    }, [transactions, periodMode, currentYear, currentMonth, selectedYear, selectedMonth]);

    // Calculate Financial Metrics for the period
    const { totalIncome, totalExpense, balance } = useMemo(() => {
        let inc = 0;
        let exp = 0;

        periodTransactions.forEach((t) => {
            const amount = parseFloat(t.amount) || 0;
            if (t.type === 'INCOME') {
                inc += amount;
            } else if (t.type === 'EXPENSE') {
                exp += amount;
            }
        });

        return {
            totalIncome: inc,
            totalExpense: exp,
            balance: inc - exp,
        };
    }, [periodTransactions]);

    const formatCurrency = (val) => {
        return Number(val).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    // Category mapping for quick name lookup
    const categoryMap = useMemo(() => {
        const map = {};
        categories.forEach((cat) => {
            map[cat.id] = cat.name;
        });
        return map;
    }, [categories]);

    // Recent 5 transactions in this period (or overall if period has few)
    const recentTransactions = useMemo(() => {
        const source = periodTransactions.length > 0 ? periodTransactions : transactions;
        return [...source]
            .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
            .slice(0, 5);
    }, [periodTransactions, transactions]);

    const totalCashFlow = totalIncome + totalExpense;
    const incomePercent = totalCashFlow > 0 ? Math.round((totalIncome / totalCashFlow) * 100) : 50;

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header with Welcome and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            Overview
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">
                            Welcome back, <span className="font-semibold text-slate-200">{user?.name || 'Ajay'}</span>. Here is your financial snapshot.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
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
                        <Link
                            to="/categories"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-xs sm:text-sm transition cursor-pointer"
                        >
                            <span>Categories</span>
                        </Link>
                    </div>
                </div>

                {/* Period Selector Card */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Period Filter
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                                type="button"
                                onClick={() => setPeriodMode('ALL')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                                    periodMode === 'ALL'
                                        ? 'bg-slate-200 text-slate-950 font-semibold shadow-xs'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                                }`}
                            >
                                All Time
                            </button>
                            <button
                                type="button"
                                onClick={() => setPeriodMode('THIS_MONTH')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                                    periodMode === 'THIS_MONTH'
                                        ? 'bg-slate-200 text-slate-950 font-semibold shadow-xs'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                                }`}
                            >
                                This Month
                            </button>
                            <button
                                type="button"
                                onClick={() => setPeriodMode('THIS_YEAR')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                                    periodMode === 'THIS_YEAR'
                                        ? 'bg-slate-200 text-slate-950 font-semibold shadow-xs'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                                }`}
                            >
                                This Year
                            </button>
                            <button
                                type="button"
                                onClick={() => setPeriodMode('CUSTOM')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                                    periodMode === 'CUSTOM'
                                        ? 'bg-slate-200 text-slate-950 font-semibold shadow-xs'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                                }`}
                            >
                                Custom Month & Year
                            </button>
                        </div>
                    </div>

                    {periodMode === 'CUSTOM' && (
                        <div className="pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                                <label className="text-xs text-slate-400 font-medium">Month:</label>
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs outline-none focus:border-slate-500 transition cursor-pointer"
                                >
                                    <option value="ALL">All Months</option>
                                    {MONTH_NAMES.map((name, idx) => {
                                        const val = (idx + 1).toString().padStart(2, '0');
                                        return (
                                            <option key={val} value={val}>
                                                {name}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <label className="text-xs text-slate-400 font-medium">Year:</label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs outline-none focus:border-slate-500 transition cursor-pointer"
                                >
                                    <option value="ALL">All Years</option>
                                    {availableYears.map((yr) => (
                                        <option key={yr} value={yr}>
                                            {yr}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
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

                {/* Metric Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Total Income Card */}
                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Total Income
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl sm:text-3xl font-semibold text-emerald-400 font-mono tracking-tight">
                                ₹{formatCurrency(totalIncome)}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                                {periodTransactions.filter((t) => t.type === 'INCOME').length} income entries in period
                            </div>
                        </div>
                    </div>

                    {/* Total Expense Card */}
                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Total Expense
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-rose-950/60 text-rose-400 border border-rose-800/50 flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl sm:text-3xl font-semibold text-rose-400 font-mono tracking-tight">
                                ₹{formatCurrency(totalExpense)}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                                {periodTransactions.filter((t) => t.type === 'EXPENSE').length} expense entries in period
                            </div>
                        </div>
                    </div>

                    {/* Net Balance Card */}
                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 relative sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Net Period Balance
                            </span>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                                balance >= 0
                                    ? 'bg-slate-800 text-slate-200 border-slate-700'
                                    : 'bg-rose-950/60 text-rose-400 border-rose-800/50'
                            }`}>
                                <span className="font-semibold text-xs font-mono">₹</span>
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className={`text-2xl sm:text-3xl font-semibold font-mono tracking-tight ${
                                balance >= 0 ? 'text-white' : 'text-rose-400'
                            }`}>
                                ₹{formatCurrency(balance)}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                                Total cash flow: ₹{formatCurrency(totalCashFlow)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cash Flow Distribution */}
                {totalCashFlow > 0 && (
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                        <div className="flex justify-between text-xs font-medium text-slate-400">
                            <span className="text-emerald-400">Income: {incomePercent}%</span>
                            <span className="text-rose-400">Expense: {100 - incomePercent}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                            <div
                                style={{ width: `${incomePercent}%` }}
                                className="bg-emerald-500/80 transition-all duration-300"
                            />
                            <div
                                style={{ width: `${100 - incomePercent}%` }}
                                className="bg-rose-500/80 transition-all duration-300"
                            />
                        </div>
                    </div>
                )}

                {/* Recent Activity */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-200 tracking-tight">Recent Activity</h2>
                        <Link
                            to="/transactions"
                            className="text-xs font-medium text-slate-400 hover:text-white transition"
                        >
                            View All Transactions ({transactions.length}) →
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="p-12 text-center text-slate-500 text-xs">
                            <div className="inline-block animate-spin w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full mb-2"></div>
                            <p>Loading overview data...</p>
                        </div>
                    ) : recentTransactions.length === 0 ? (
                        <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
                            <p className="text-sm font-medium text-slate-300">No transactions recorded for this period</p>
                            <p className="text-xs text-slate-500 mt-1 mb-4">
                                Click below to record your first transaction.
                            </p>
                            <button
                                type="button"
                                onClick={() => setShowAddModal(true)}
                                className="px-4 py-2 text-xs font-semibold bg-white text-slate-950 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                            >
                                + Add Transaction
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-800 bg-slate-950/90 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            <th className="py-3 px-4">Date</th>
                                            <th className="py-3 px-4">Description</th>
                                            <th className="py-3 px-4">Category</th>
                                            <th className="py-3 px-4">Type</th>
                                            <th className="py-3 px-4 text-right">Amount</th>
                                            <th className="py-3 px-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentTransactions.map((tx) => (
                                            <TransactionItem
                                                key={tx.id}
                                                transaction={tx}
                                                categoryName={categoryMap[tx.categoryId]}
                                                onDelete={handleDeleteTransaction}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card Stack */}
                            <div className="md:hidden space-y-2.5">
                                {recentTransactions.map((tx) => (
                                    <TransactionItem
                                        key={tx.id}
                                        transaction={tx}
                                        categoryName={categoryMap[tx.categoryId]}
                                        onDelete={handleDeleteTransaction}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Transaction Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
                    <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl">
                        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                            <h3 className="text-base font-semibold text-white">Add New Transaction</h3>
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

export default Dashboard;
