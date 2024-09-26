import axios from "axios";
import globalRouter from "../hooks/globalRouter";
import {getAccessTokenInfo} from "../features/auth"
import toast from 'react-hot-toast';


const backend_base = process.env.REACT_APP_BACKEND_URL

const refresher_api = axios.create({
    baseURL: backend_base,
    withCredentials: true,
});

refresher_api.interceptors.response.use(
    function (response) {
        return response;
    }, 
        async function (error) {
            toast("Error: " + error.response.data?.detail)
            return Promise.reject(error)
        }
)

const api = axios.create({
    baseURL: backend_base,
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem('access_token'); // get stored access token
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`; // set in header
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

api.interceptors.response.use(
    function (response) {
    return response;
}, 
    async function (error) {
    const originalRequest = error.config;
    if (error?.response?.status === 401 && !originalRequest._retry){
        originalRequest._retry = true;
        if (localStorage.getItem("access_token") == null){
            globalRouter.navigate('/login')
        }
        try{
            const response = await refresher_api.post('/auth/access_token')
            localStorage.setItem('access_token', response.data.access_token)
            const userInfo = getAccessTokenInfo(response.data.access_token)
            originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
            globalRouter.setUserInfo(userInfo)
            return api(originalRequest)
        } catch (err) {
            globalRouter.queryClient.removeQueries()
            globalRouter.setUserInfo({})
            localStorage.removeItem('access_token')
            globalRouter.navigate('/login')
            return Promise.reject(err);
        }
    } else{
        if (error?.message === "Network Error"){
            toast("Sorry! Server is not available. Try again later...");
        } else{
            toast('Error: ' + (error?.response?.data?.detail || error))
        }
    }
    return Promise.reject(error);
});

export default api



