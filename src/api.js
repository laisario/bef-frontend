import axios from 'axios';

const createAxiosInstance = () => {
    const instance = axios.create({
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true,
        baseURL: 'https://rkp2023.pythonanywhere.com/',
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
