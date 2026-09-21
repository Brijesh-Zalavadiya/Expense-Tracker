import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import CategoryList from '../components/CategoryList';
import CategoryForm from '../components/CategoryForm';
import { getAllCategories, deleteCategory } from '../services/categoryService';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await getAllCategories();
            setCategories(data || []);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to load categories. Please check backend connection.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleDeleteCategory = async (id) => {
        await deleteCategory(id);
        setCategories((prev) => prev.filter((c) => c.id !== id));
    };

    const handleCategoryAdded = (newCat) => {
        setCategories((prev) => [...prev, newCat]);
        setShowAddModal(false);
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            Categories
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">
                            Organize your transactions with Income and Expense categories.
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
                        <span>Add Category</span>
                    </button>
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-rose-400 text-sm flex items-center justify-between">
                        <span>{error}</span>
                        <button
                            type="button"
                            onClick={fetchCategories}
                            className="underline font-semibold ml-2 cursor-pointer hover:text-rose-300"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {isLoading ? (
                    <div className="p-12 text-center text-slate-500 text-xs">
                        <div className="inline-block animate-spin w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full mb-2"></div>
                        <p>Loading categories...</p>
                    </div>
                ) : (
                    <CategoryList
                        categories={categories}
                        onDeleteCategory={handleDeleteCategory}
                    />
                )}
            </div>

            {/* Add Category Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
                    <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl">
                        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                            <h3 className="text-lg font-bold text-white">Add New Category</h3>
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

                        <CategoryForm
                            onSuccess={handleCategoryAdded}
                            onCancel={() => setShowAddModal(false)}
                        />
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Categories;
