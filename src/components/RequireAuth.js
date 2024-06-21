import { useContext } from 'react';
import AuthContext from "../context/auth";
import {Outlet, Navigate, useLocation} from "react-router-dom";


const RequireAuth = () => {
    const location = useLocation();
    const { userInfo } = useContext(AuthContext);

    return (
    userInfo?.user_guid
        ? <Outlet/>
        : <Navigate to="/login" state={{from: location}} replace/>
    );
};

export default RequireAuth;