
import axios from 'axios';

// Point to backend URL - In production this comes from env vars
// For local dev, assuming backend runs on port 5000
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Helper to handle API errors smoothly in this demo environment
// If backend is not running, we might want to return mock data for specific endpoints to keep the UI preview functional
export const safeRequest = async <T>(request: Promise<any>, fallbackData?: T): Promise<T> => {
    try {
        const response = await request;
        return response.data;
    } catch (error) {
        console.warn("API Request Failed (Backend might be offline):", error);
        if (fallbackData !== undefined) return fallbackData;
        throw error;
    }
};

export default api;
