import { useState, createContext } from "react";


const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const [userInfo, setUserInfo] = useState(
        {username: localStorage.getItem('username'),
                   scope: localStorage.getItem('scope'),
                   
                  }
        );

    return (
        <AuthContext.Provider value={{userInfo, setUserInfo}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;