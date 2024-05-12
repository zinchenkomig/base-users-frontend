import axios from "axios";

const backend_base = process.env.REACT_APP_BACKEND_URL


export default axios.create({
    baseURL: backend_base,
    withCredentials: true,
});
