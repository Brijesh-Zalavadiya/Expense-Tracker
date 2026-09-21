import api from './api';

export const getAllCategories = async () => {
    const response = await api.get('/categories');
    return response.data;
};

export const getCategoriesByType = async (type) => {
    const response = await api.get(`/categories/type_${type}`);
    return response.data;
};

export const getCategoryById = async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
};

export const addCategory = async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
};
