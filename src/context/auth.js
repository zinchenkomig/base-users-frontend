import { useState, createContext } from "react";
import { getLSAccessToken } from "../features/auth";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(
    getLSAccessToken()
  );

  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
