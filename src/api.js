import axios from 'axios';

const createAxiosInstance = () => {
    const instance = axios.create({
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true,
        baseURL: process.env.REACT_APP_API_URL,
    });

    instance.interceptors.request.use((config) => {
        const token = window.localStorage.getItem('token')
        config.headers.Authorization = token ? `Bearer ${token}` : '';
        return config
    })

    return instance
}

const axiosInstance = createAxiosInstance()

export default axiosInstance
