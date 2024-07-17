import axios from "axios";
import globalRouter from "../hooks/globalRouter";

const backend_base = process.env.REACT_APP_BACKEND_URL

const api = axios.create({
    baseURL: backend_base,
    withCredentials: true,
});

api.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (error.response.status === 401){
        localStorage.removeItem('photo_url')
        localStorage.removeItem('username');
        localStorage.removeItem('roles')
        localStorage.removeItem('user_guid')
        globalRouter.navigate('/login')
        globalRouter.setUserInfo({})
    }

    return Promise.reject(error);
});

export default api



