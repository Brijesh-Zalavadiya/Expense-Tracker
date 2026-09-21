import React, { useState } from 'react';
import ConfirmModal from './ConfirmModal';

const CategoryList = ({ categories = [], onDeleteCategory }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'INCOME' | 'EXPENSE'

    const incomeCategories = categories.filter((c) => c.type === 'INCOME');
    const expenseCategories = categories.filter((c) => c.type === 'EXPENSE');

    const displayedCategories =
        activeTab === 'INCOME'
            ? incomeCategories
            : activeTab === 'EXPENSE'
            ? expenseCategories
            : categories;

    const handleDelete = async () => {
        if (!selectedCategory) return;
        setIsDeleting(true);
        setDeleteError('');
        try {
            await onDeleteCategory(selectedCategory.id);
            setSelectedCategory(null);
        } catch (err) {
            console.error('Error deleting category:', err);
            const msg =
                err.response?.data?.message ||
                'Cannot delete category. It might be in use by existing transactions.';
            setDeleteError(msg);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Filter Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
                    <button
                        type="button"
                        onClick={() => setActiveTab('ALL')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                            activeTab === 'ALL'
                                ? 'bg-slate-200 text-slate-950 font-semibold shadow-xs'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        All ({categories.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('INCOME')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                            activeTab === 'INCOME'
                                ? 'bg-slate-200 text-slate-950 font-semibold shadow-xs'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Income ({incomeCategories.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('EXPENSE')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                            activeTab === 'EXPENSE'
                                ? 'bg-slate-200 text-slate-950 font-semibold shadow-xs'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Expense ({expenseCategories.length})
                    </button>
                </div>
            </div>

            {/* Empty state */}
            {displayedCategories.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
                    <p className="text-sm font-medium text-slate-300">No categories found</p>
                    <p className="text-xs text-slate-500 mt-1">
                        Use the "Add Category" button to create one.
                    </p>
                </div>
            ) : (
                /* Category Cards Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {displayedCategories.map((cat) => {
                        const isIncome = cat.type === 'INCOME';
                        return (
                            <div
                                key={cat.id}
                                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 transition"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div
                                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 font-mono ${
                                            isIncome
                                                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                                                : 'bg-rose-950/60 text-rose-300 border border-rose-800/50'
                                        }`}
                                    >
                                        {cat.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="truncate">
                                        <h4 className="text-sm font-medium text-slate-200 truncate">{cat.name}</h4>
                                        <span
                                            className={`inline-block text-[10px] font-medium uppercase tracking-wider ${
                                                isIncome ? 'text-emerald-400' : 'text-rose-400'
                                            }`}
                                        >
                                            {cat.type}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setDeleteError('');
                                        setSelectedCategory(cat);
                                    }}
                                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer shrink-0"
                                    title="Delete category"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Confirm Delete Category Modal */}
            <ConfirmModal
                isOpen={!!selectedCategory}
                title="Delete Category"
                message={
                    deleteError
                        ? deleteError
                        : `Are you sure you want to delete the category "${selectedCategory?.name}"?`
                }
                confirmText={isDeleting ? 'Deleting...' : 'Delete Category'}
                confirmColor="red"
                isLoading={isDeleting}
                onConfirm={handleDelete}
                onCancel={() => {
                    setSelectedCategory(null);
                    setDeleteError('');
                }}
            />
        </div>
    );
};

export default CategoryList;
