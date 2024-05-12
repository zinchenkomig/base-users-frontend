// import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {useContext} from "react";
import AuthContext from "../context/auth";
// import axios from "../api/backend";

export default function Profile(){
    const {userInfo} = useContext(AuthContext);

    // const userQuery = useQuery({queryKey: ["user"],
    //         queryFn: () => axios.get('/user/info')
    //             .then((response) => {console.log(response.data);
    //                 return response.data;})
    //     }
    // )

    return(
        <div className="profile-container">
            <div className="profile-field">
                Name: {userInfo?.username}
            </div>
            <div className="profile-field">
                Email: {userInfo?.username}
            </div>
            {/*<div className="profile-field">*/}
            {/*    Description: {userQuery.isFetched ? userQuery.data['description']: 'Loading'}*/}
            {/*</div>*/}
            <div className="profile-field">
                <button>Change Password</button>
            </div>
        </div>
    )
}