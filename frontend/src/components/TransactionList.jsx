import React, { useState, useMemo } from 'react';
import TransactionItem from './TransactionItem';

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const TransactionList = ({ transactions = [], categories = [], onDeleteTransaction }) => {
    // Current date helpers
    const now = new Date();
    const currentYear = now.getFullYear().toString();
    const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');

    // Filter states
    const [periodMode, setPeriodMode] = useState('ALL'); // 'ALL' | 'THIS_MONTH' | 'THIS_YEAR' | 'CUSTOM'
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth); // '01' to '12' or 'ALL'
    const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'INCOME' | 'EXPENSE'
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    // Extract unique available years from transactions
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

    // Map categories by ID for quick name lookup
    const categoryMap = useMemo(() => {
        const map = {};
        categories.forEach((cat) => {
            map[cat.id] = cat.name;
        });
        return map;
    }, [categories]);

    // Filter transactions by period, type, category, and search query
    const filteredTransactions = useMemo(() => {
        return transactions.filter((t) => {
            if (!t.transactionDate) return false;
            const [tYear, tMonth] = t.transactionDate.split('-');

            // 1. Period filtering
            if (periodMode === 'THIS_MONTH') {
                if (tYear !== currentYear || tMonth !== currentMonth) return false;
            } else if (periodMode === 'THIS_YEAR') {
                if (tYear !== currentYear) return false;
            } else if (periodMode === 'CUSTOM') {
                if (selectedYear !== 'ALL' && tYear !== selectedYear) return false;
                if (selectedMonth !== 'ALL' && tMonth !== selectedMonth) return false;
            }

            // 2. Type filtering
            if (filterType !== 'ALL' && t.type !== filterType) {
                return false;
            }

            // 3. Category filtering
            if (selectedCategory !== 'ALL' && t.categoryId !== Number(selectedCategory)) {
                return false;
            }

            // 4. Search query filtering
            if (searchQuery.trim() !== '') {
                const query = searchQuery.toLowerCase();
                const desc = (t.description || '').toLowerCase();
                const catName = (categoryMap[t.categoryId] || '').toLowerCase();
                return desc.includes(query) || catName.includes(query);
            }

            return true;
        });
    }, [
        transactions,
        periodMode,
        currentYear,
        currentMonth,
        selectedYear,
        selectedMonth,
        filterType,
        selectedCategory,
        searchQuery,
        categoryMap,
    ]);

    // Summary calculation for the filtered results
    const summary = useMemo(() => {
        let income = 0;
        let expense = 0;
        filteredTransactions.forEach((t) => {
            const amt = parseFloat(t.amount) || 0;
            if (t.type === 'INCOME') income += amt;
            else if (t.type === 'EXPENSE') expense += amt;
        });
        return {
            income,
            expense,
            net: income - expense,
            count: filteredTransactions.length,
        };
    }, [filteredTransactions]);

    const formatCurrency = (val) =>
        Number(val).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    return (
        <div className="space-y-4">
            {/* Period Filter Bar */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Time Period
                    </span>

                    {/* Quick Preset Buttons */}
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
                            Month & Year...
                        </button>
                    </div>
                </div>

                {/* Custom Month and Year Selectors */}
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

            {/* Filter, Type & Search Controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                {/* Search Input */}
                <div className="relative flex-1">
                    <svg
                        className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search description or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-900/90 border border-slate-800 text-white rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-slate-600 transition placeholder:text-slate-500"
                    />
                </div>

                {/* Filter Controls */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                    {/* Type Pills */}
                    <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
                        {['ALL', 'INCOME', 'EXPENSE'].map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setFilterType(t)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                                    filterType === t
                                        ? 'bg-slate-800 text-white font-semibold'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                {t === 'ALL' ? 'All' : t === 'INCOME' ? 'Income' : 'Expense'}
                            </button>
                        ))}
                    </div>

                    {/* Category Dropdown */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-slate-600 transition cursor-pointer"
                    >
                        <option value="ALL">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name} ({cat.type})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Filtered Period Statistics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs">
                <div>
                    <span className="text-slate-500 block">Filtered Records</span>
                    <span className="font-semibold text-white text-sm">{summary.count} items</span>
                </div>
                <div>
                    <span className="text-slate-500 block">Period Income</span>
                    <span className="font-semibold text-emerald-400 text-sm">
                        ₹{formatCurrency(summary.income)}
                    </span>
                </div>
                <div>
                    <span className="text-slate-500 block">Period Expense</span>
                    <span className="font-semibold text-rose-400 text-sm">
                        ₹{formatCurrency(summary.expense)}
                    </span>
                </div>
                <div>
                    <span className="text-slate-500 block">Net for Period</span>
                    <span
                        className={`font-semibold text-sm ${
                            summary.net >= 0 ? 'text-slate-200' : 'text-rose-400'
                        }`}
                    >
                        ₹{formatCurrency(summary.net)}
                    </span>
                </div>
            </div>

            {/* Transactions Rendering */}
            {filteredTransactions.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80">
                    <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/80 text-slate-500 flex items-center justify-center mb-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-white">No transactions found</h4>
                    <p className="text-xs text-slate-400 mt-1">
                        {transactions.length === 0
                            ? 'You have not added any transactions yet.'
                            : 'No records match the selected month, year, or search filters.'}
                    </p>
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
                                {filteredTransactions.map((transaction) => (
                                    <TransactionItem
                                        key={transaction.id}
                                        transaction={transaction}
                                        categoryName={categoryMap[transaction.categoryId]}
                                        onDelete={onDeleteTransaction}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card Stack */}
                    <div className="md:hidden space-y-2.5">
                        {filteredTransactions.map((transaction) => (
                            <TransactionItem
                                key={transaction.id}
                                transaction={transaction}
                                categoryName={categoryMap[transaction.categoryId]}
                                onDelete={onDeleteTransaction}
                            />
                        ))}
                    </div>

                    {/* Footer count */}
                    <div className="text-xs text-slate-500 px-1 pt-1">
                        Showing {filteredTransactions.length} of {transactions.length} total transactions
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionList;
