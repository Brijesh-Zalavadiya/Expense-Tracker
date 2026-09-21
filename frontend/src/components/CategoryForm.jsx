import React, { useState } from 'react';
import { addCategory } from '../services/categoryService';

const CategoryForm = ({ onSuccess, onCancel }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('EXPENSE');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Please enter a category name');
            return;
        }

        setIsLoading(true);
        try {
            const newCat = await addCategory({
                name: name.trim(),
                type: type,
            });
            setName('');
            if (onSuccess) {
                onSuccess(newCat);
            }
        } catch (err) {
            console.error('Error adding category:', err);
            const msg = err.response?.data?.message || 'Failed to add category. Category may already exist.';
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

            {/* Category Name */}
            <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                    Category Name
                </label>
                <input
                    type="text"
                    required
                    placeholder="e.g. Freelance, Groceries, Utilities"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-2.5 outline-none text-xs focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition placeholder:text-slate-600"
                />
            </div>

            {/* Type: Expense vs Income */}
            <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                    Type
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
                    disabled={isLoading}
                    className="flex-1 sm:flex-none px-6 py-2.5 text-xs font-semibold text-slate-950 bg-white hover:bg-slate-100 rounded-xl transition cursor-pointer disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
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
                        'Save Category'
                    )}
                </button>
            </div>
        </form>
    );
};

export default CategoryForm;
