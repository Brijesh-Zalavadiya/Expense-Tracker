import React, { useState } from 'react';
import ConfirmModal from './ConfirmModal';

const TransactionItem = ({ transaction, categoryName, onDelete }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isIncome = transaction.type === 'INCOME';
    const formattedAmount = Number(transaction.amount || 0).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete(transaction.id);
            setShowDeleteModal(false);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            {/* Desktop Table Row */}
            <tr className="hidden md:table-row hover:bg-slate-800/30 border-b border-slate-800/70 transition-colors text-sm">
                <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap font-mono text-xs">
                    {transaction.transactionDate}
                </td>
                <td className="py-3.5 px-4 font-medium text-slate-200 max-w-xs truncate">
                    {transaction.description || <span className="text-slate-600 italic">No description</span>}
                </td>
                <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-800/90 text-slate-300 border border-slate-700/60">
                        {categoryName || 'Uncategorized'}
                    </span>
                </td>
                <td className="py-3.5 px-4">
                    <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                            isIncome
                                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
                                : 'bg-rose-950/40 text-rose-300 border-rose-800/40'
                        }`}
                    >
                        {transaction.type}
                    </span>
                </td>
                <td
                    className={`py-3.5 px-4 text-right font-semibold whitespace-nowrap font-mono text-sm ${
                        isIncome ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                >
                    {isIncome ? `+₹${formattedAmount}` : `-₹${formattedAmount}`}
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                        title="Delete transaction"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </td>
            </tr>

            {/* Mobile Card Layout */}
            <div className="md:hidden p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="font-medium text-slate-200 text-sm truncate">
                            {transaction.description || 'No description'}
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                            {transaction.transactionDate}
                        </div>
                    </div>
                    <div
                        className={`text-right font-semibold font-mono text-sm whitespace-nowrap shrink-0 ${
                            isIncome ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                    >
                        {isIncome ? `+₹${formattedAmount}` : `-₹${formattedAmount}`}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60 text-[11px]">
                            {categoryName || 'Uncategorized'}
                        </span>
                        <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                                isIncome
                                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
                                    : 'bg-rose-950/40 text-rose-300 border-rose-800/40'
                            }`}
                        >
                            {transaction.type}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        className="px-2 py-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition cursor-pointer flex items-center gap-1 text-xs"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete</span>
                    </button>
                </div>
            </div>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                title="Delete Transaction"
                message={`Are you sure you want to delete this transaction "${transaction.description || 'entry'}" of ₹${formattedAmount}?`}
                confirmText="Delete"
                confirmColor="red"
                isLoading={isDeleting}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </>
    );
};

export default TransactionItem;
