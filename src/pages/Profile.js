import {useQuery} from "@tanstack/react-query";
import {useContext} from "react";
import AuthContext from "../context/auth";
import axios from "../api/backend";

export default function Profile(){
    const {userInfo} = useContext(AuthContext);

    const userQuery = useQuery({queryKey: ["user"],
            queryFn: () => axios.get('/user/info')
                .then((response) => {console.log(response.data);
                    return response.data;})
        }
    )

    return(
        <div className="profile-container">
            {userQuery.isFetched ?
                <>
            <div className="profile-pic-container">
                <img src={userQuery?.data.photo_url || process.env.REACT_APP_PROFILE_PIC_STUB} alt="profile"/>
            </div>
            <div className="profile-info-container">
                <div className="profile-field">
                    First Name: {userQuery?.data['first_name']}
                </div>
                <div className="profile-field">
                    Last Name: {userQuery?.data['last_name']}
                </div>
                <div className="profile-field">
                    Username: {userQuery?.data['username']}
                </div>
                <div className="profile-field">
                    <button>Change Password</button>
                </div>
            </div>
                </>: 'Loading'
            }
                </div>
    )
}