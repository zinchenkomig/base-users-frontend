import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "../api/backend";
import {CancelButton, CheckButton, DeleteButton, EditButton} from "../components/Buttons";
import {useContext, useState} from "react";
import AuthContext from "../context/auth";


function UserRecord(user){
    const [isEditing, setIsEditing] = useState(false);
    const {userInfo} = useContext(AuthContext);
    const queryClient = useQueryClient();
    const deleteUserMutation = useMutation({
        mutationFn: (user) => {
            return axios.post('/superuser/users/delete', null, {params: {user_id: user.id}})
                .then(response => response.data)
        },
        onSuccess: async () => {
            queryClient.invalidateQueries("users");
        }
    })

    const editUserMutation = useMutation({
        mutationFn: async (data) => {
            const formData = new FormData(data);
            const formJson = Object.fromEntries(formData.entries());
            await axios.post('/superuser/users/update', formJson, {params: {user_id: user.id}});
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries("users");
        }
    })

    const onSubmitEdit = event => {
        event.preventDefault();
        editUserMutation.mutateAsync(event.target).then(()=>{setIsEditing(false)});
    }

    return (

        <form method="post" onSubmit={onSubmitEdit}>
        <div className="user-record-container">
            <div className="user-record">
                {isEditing ?
                    <>
                        <input name="username" type="text" className="in-record-input" defaultValue={user.username}/>
                        <input name="email" type="text" className="in-record-input" defaultValue={user.email}/>
                    </>
                    :
                    <>
                        <span> {user.username} </span>
                        <span> {user.email} </span>
                    </>
                }

                <span className="user-record-button">
                    {
                        isEditing ?
                            <>
                                <CheckButton type="submit"/>
                                <CancelButton type="button" onClick={()=>{setIsEditing(false)}}/>
                            </>
                            :
                            <>
                                <EditButton type="button" onClick={()=>{
                                    setIsEditing(true);
                                    console.log(`Editing ${user.username}`)} }
                                />
                                <DeleteButton type="button" onClick={() => {
                                    deleteUserMutation.mutate(user)
                                }}
                                disabled={userInfo.username === user.username}
                                />
                            </>
                    }

                </span>
            </div>
            {(editUserMutation.isLoading || deleteUserMutation.isLoading)?
                <div className="fader"/>
            :
            <>
            </>
            }

        </div>
        </form>

    )
}

export default function UserManagement(){
    const usersQuery = useQuery({queryKey: ["users"],
                                         queryFn: () => axios.get('/superuser/users/all')
                                             .then((response) => {console.log(response.data);
                                                 return response.data;})
                                        }
                               )
    if (usersQuery.status === 'loading') return (<div>Loading...</div>)
        else if (usersQuery.isError) return (<div>Error. Cannot load users.</div>)
            else {
                return (
                    <div className="users-table">
                        {usersQuery.data.map((user) => (
                            <UserRecord key={user.id} {...user}/>
                        ))}
                    </div>
                )
    }

}