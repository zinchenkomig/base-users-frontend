import { useState, createContext } from "react";


const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const [userInfo, setUserInfo] = useState(
        {
            user_guid: localStorage.getItem('user_guid'),
            username: localStorage.getItem('username'),
            roles: localStorage.getItem('roles')?.split(','),
                  }
        );

    return (
        <AuthContext.Provider value={{userInfo, setUserInfo}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;