import api from './api';

export const signupUser = async (userData) => {
    const response = await api.post('/users/signup', userData);
    return response.data;
};

export const loginUser = async (loginData) => {
    const response = await api.post('/users/login', loginData);
    return response.data;
};

export const getUserById = async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
};