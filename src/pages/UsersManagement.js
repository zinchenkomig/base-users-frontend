import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "../api/backend";
import {CancelButton, CheckButton, DeleteButton, EditButton} from "../components/Buttons";
import {useContext, useState} from "react";
import AuthContext from "../context/auth";
import Select from 'react-select'



function UserRecordField({fieldName, children}){
    return (
        <div className="user-record-info-field">
            <div className="user-record-info-field-name">
                {fieldName}
            </div>
            <div className="user-record-info-value">
                {children}
            </div>
        </div>
    )
}


const options = [
    { value: 'reader', label: 'reader' },
    { value: 'admin', label: 'admin' },
]


function UserRecord(user){
    console.log(typeof options)
    const [isEditing, setIsEditing] = useState(false);
    const {userInfo} = useContext(AuthContext);
    const queryClient = useQueryClient();
    const deleteUserMutation = useMutation({
        mutationFn: (user) => {
            return axios.post('/superuser/users/delete', null, {params: {guid: user.guid}})
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
            formJson["roles"] = formData.getAll("roles")
            await axios.post('/superuser/users/update', formJson, {params: {guid: user.guid}});
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
                    <div className="user-record-info">
                        <span><img src={user.photo_url || process.env.REACT_APP_PROFILE_PIC_STUB} className="user-small-pic" alt="profile"/></span>
                        <UserRecordField fieldName="Username:">
                            {!isEditing ?
                            user.username:
                            <input name="username" type="text" className="in-record-input" defaultValue={user.username}/>}
                        </UserRecordField>
                        <UserRecordField fieldName="Email:" >
                            {!isEditing? user.email :
                                <input name="email" type="text" className="in-record-input" defaultValue={user.email}/>}
                        </UserRecordField>
                        <UserRecordField fieldName="Roles:" >
                            {!isEditing?
                                user.roles.join(", "):
                                <Select name="roles" options={options}
                                        className="multi-select-container"
                                        classNamePrefix="multi-select"
                                        unstyled
                                        isMulti defaultValue={
                                    user.roles.map(
                                    (x)=> {return {"value": x, "label": x}})
                                } />
                            }</UserRecordField>
                    </div>
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