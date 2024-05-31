import { useContext } from 'react';
import AuthContext from "../context/auth";
import {Outlet, Navigate, useLocation} from "react-router-dom";


const RequireSuperuser = () => {
    const location = useLocation();
    const { userInfo } = useContext(AuthContext);

    return (
        userInfo?.roles?.includes('admin')
            ? <Outlet/>
            : <Navigate to="/" state={{from: location}} replace/>
    );
};

export default RequireSuperuser;