import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useContext, useState} from "react";
import AuthContext from "../context/auth";
import axios from "../api/backend";
import {EditableField} from "../components/Inputs";

export default function Profile(){
    const [isEditing, setIsEditing] = useState(false);
    const queryClient = useQueryClient();


    const userQuery = useQuery({queryKey: ["current-user"],
            queryFn: () => axios.get('/user/info')
                .then((response) => {console.log(response.data);
                    return response.data;})
        }
    )

    const editUserMutation = useMutation({
        mutationFn: async (data) => {
            const formData = new FormData(data);
            const formJson = Object.fromEntries(formData.entries());
            await axios.post('/user/update', formJson);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries("current-user");
        }
    })

    const onSubmitEdit = event => {
        event.preventDefault();
        editUserMutation.mutateAsync(event.target).then(()=>{setIsEditing(false)});
    }

    return(
        <form method="post" onSubmit={onSubmitEdit}>
        <div className="profile-container" >
            {userQuery.isFetched ?
                <>
            <div className="profile-pic-container">
                <img src={userQuery?.data.photo_url || process.env.REACT_APP_PROFILE_PIC_STUB} alt="profile"/>
            </div>
            <div className="profile-info-container">
                <EditableField label="First name:" isEditing={isEditing}
                               name="first_name" defaultValue={userQuery?.data['first_name']} />
                <EditableField label="Last name:" isEditing={isEditing}
                               name="last_name" defaultValue={userQuery?.data['last_name']} />
                <EditableField label="Email:" isEditing={isEditing}
                               name="email" defaultValue={userQuery?.data['email']} />
                <EditableField label="Username:" isEditing={false}
                               defaultValue={userQuery?.data['username']} />
                <div className="profile-field">
                    {!isEditing ? <button onClick={() => setIsEditing(true)}>Edit</button> :
                        <div>
                            <button type="submit" className="button-half">Save</button> <button type="button" className="button-half" onClick={()=>setIsEditing(false)}>Cancel</button>
                        </div>}
                </div>
                <div>
                    <button type="button">Change Password</button>
                </div>
            </div>
                </>: 'Loading'
            }
                </div>
        </form>
    )
}