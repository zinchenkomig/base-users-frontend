import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useContext } from "react";
import { flushSync } from "react-dom";
import axios from "../api/backend";
import { EditableField } from "../components/Inputs";
import AuthContext from "../context/auth";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const { setUserInfo } = useContext(AuthContext)

  const userQuery = useQuery({
    queryKey: ["current-user"],
    queryFn: () => axios.get('/user/info')
      .then((response) => {
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('roles', response.data.roles)
        localStorage.setItem('photo_url', response.data.photo_url)
        localStorage.setItem('user_guid', response.data.guid)
        flushSync(() => {
          setUserInfo({
            username: response.data.username,
            roles: response.data.roles,
            user_guid: response.data.guid,
            photo_url: response.data.photo_url,
          })
        });
        return response.data;
      }
      ).catch((error) => {
        console.log(error)
        if (error.response.status === 401) {

        }
      })
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
    editUserMutation.mutateAsync(event.target).then(() => { setIsEditing(false) });
  }

  const handleFileChange = async (e) => {
    if (e.target.files) {

      const formData = new FormData();
      formData.append('file', e.target.files[0]);

      try {
        await axios.post('/user/upload_photo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        await queryClient.invalidateQueries("current-user");
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div className="profile-container" >
      {
        (userQuery.isPending || userQuery.isLoading) ?
          <div className="center indent-top">
            <div className="loader" />
          </div> :
          !userQuery.isSuccess ?
            <div className="center indent-top">
              <div className="fail">Error while loading: {userQuery.error.message}</div>
            </div>
            :
            <>
              <div className="flex flex-col justify-center items-center">
                <div>
                  <img src={userQuery?.data?.photo_url || process.env.REACT_APP_PROFILE_PIC_STUB} alt="profile" className="object-cover rounded-md h-64 w-64" />
                </div>
                <div>
                  <label for="file" className="block mt-4 rounded-lg cursor-pointer hover:bg-gray-300 hover:text-gray-700 border border-gray-300 p-2">
                    <input id="file" accept=".png,.jpeg,image/jpeg,image/png" type="file" onChange={handleFileChange} />
                    Change profile picture</label>
                </div>

              </div>


              <form method="post" onSubmit={onSubmitEdit}>
                <div>
                  <div className="flex flex-col py-6 px-6 sm:px-12 border-gray-300 border rounded-lg">
                    <EditableField label="First name:" isEditing={isEditing}
                      name="first_name" defaultValue={userQuery?.data?.first_name} />
                    <div><hr /></div>
                    <EditableField label="Last name:" isEditing={isEditing}
                      name="last_name" defaultValue={userQuery?.data?.last_name} />
                    <div><hr /></div>
                    <EditableField label="Email:" isEditing={isEditing}
                      name="email" defaultValue={userQuery?.data?.email} />
                    <div><hr /></div>
                    <EditableField label="Username:" isEditing={false}
                      defaultValue={userQuery?.data?.username} />
                  </div>
                  <div className="center">
                    {!isEditing ? <button className="button-margin" onClick={() => setIsEditing(true)}>Edit</button> :
                      <div>
                        <button type="submit" className="button-margin">Save</button>
                        <button type="button" className="alt-button" onClick={() => setIsEditing(false)}>Cancel</button>
                      </div>}
                  </div>
                </div>
              </form>
            </>
      }
    </div>
  )
}
