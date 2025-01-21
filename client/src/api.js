import axios from 'axios';

const API_URL = "http://localhost:8080/api";

export const registerUser = async (username, email, password) => {
    return axios.post(`${API_URL}/register`, { username, email, password });
};

export const loginUser = async (username, password) => {
    return axios.post(`${API_URL}/login`, { username, password });
};

export const verifyToken = async (token) => {
    return axios.get(`${API_URL}/verify`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
