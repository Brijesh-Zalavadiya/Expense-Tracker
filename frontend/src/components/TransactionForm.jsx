import React, { useState, useEffect } from 'react';
import { addTransaction } from '../services/transactionService';

const TransactionForm = ({ categories = [], userId, onSuccess, onCancel }) => {
    const today = new Date().toISOString().split('T')[0];

    const [type, setType] = useState('EXPENSE');
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [transactionDate, setTransactionDate] = useState(today);
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Filter categories by the selected transaction type
    const availableCategories = categories.filter((cat) => cat.type === type);

    // Reset category selection when type changes
    useEffect(() => {
        if (availableCategories.length > 0) {
            setCategoryId(availableCategories[0].id.toString());
        } else {
            setCategoryId('');
        }
    }, [type, categories]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            setError('Please enter a valid amount greater than 0');
            return;
        }

        if (!categoryId) {
            setError(`Please select or add an ${type.toLowerCase()} category first`);
            return;
        }

        if (!userId) {
            setError('User session not found. Please log in again.');
            return;
        }

        const payload = {
            amount: numericAmount,
            type: type,
            description: description.trim(),
            transactionDate: transactionDate,
            userId: Number(userId),
            categoryId: Number(categoryId),
        };

        setIsLoading(true);
        try {
            const result = await addTransaction(payload);
            if (onSuccess) {
                onSuccess(result);
            }
            // Reset form
            setAmount('');
            setDescription('');
            setTransactionDate(today);
        } catch (err) {
            console.error('Error adding transaction:', err);
            const msg = err.response?.data?.message || 'Failed to add transaction. Please check your inputs.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-rose-400 text-xs">
                    {error}
                </div>
            )}

            {/* Type selector: Expense vs Income */}
            <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                    Transaction Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => setType('EXPENSE')}
                        className={`py-2 px-4 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                            type === 'EXPENSE'
                                ? 'bg-rose-950/60 border-rose-800/60 text-rose-300 shadow-xs'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                    >
                        Expense
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('INCOME')}
                        className={`py-2 px-4 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                            type === 'INCOME'
                                ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300 shadow-xs'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                    >
                        Income
                    </button>
                </div>
            </div>

            {/* Amount */}
            <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                    Amount (₹)
                </label>
                <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-mono">₹</span>
                    <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        required
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl pl-8 pr-4 py-2.5 outline-none text-sm font-mono focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition placeholder:text-slate-600"
                    />
                </div>
            </div>

            {/* Category */}
            <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                    Category
                </label>
                {availableCategories.length === 0 ? (
                    <div className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl">
                        No {type.toLowerCase()} categories found. Please add one in the Categories section first.
                    </div>
                ) : (
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 outline-none text-xs focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition cursor-pointer"
                        required
                    >
                        {availableCategories.map((cat) => (
                            <option key={cat.id} value={cat.id} className="bg-slate-950 text-white">
                                {cat.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Transaction Date */}
            <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                    Date
                </label>
                <input
                    type="date"
                    required
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 outline-none text-xs font-mono focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition cursor-pointer"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                    Description
                </label>
                <input
                    type="text"
                    placeholder="e.g. Monthly salary, Grocery shopping"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={255}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 outline-none text-xs focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition placeholder:text-slate-600"
                />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isLoading || availableCategories.length === 0}
                    className="flex-1 sm:flex-none px-6 py-2.5 text-xs font-semibold text-slate-950 bg-white hover:bg-slate-100 rounded-xl transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-3.5 w-3.5 text-slate-950" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Adding...</span>
                        </>
                    ) : (
                        'Save Transaction'
                    )}
                </button>
            </div>
        </form>
    );
};

export default TransactionForm;
