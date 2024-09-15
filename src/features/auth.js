import { jwtDecode } from "jwt-decode"

export const getLSAccessToken = () => {
    const token = localStorage.getItem("access_token")
    return getAccessTokenInfo(token)
  }
  
export const getAccessTokenInfo = (token) => {
    if (token === null || token === undefined || token === "undefined") {
      return {}
    }
    const decodedToken = jwtDecode(token)
    decodedToken.user_guid = decodedToken.sub
    return decodedToken
  }