import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import axios from "../api/backend";
import {EditableField} from "../components/Inputs";
import { HumanFileSize } from "../features/utils.js";

export default function Profile(){
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();


  const userQuery = useQuery({queryKey: ["current-user"],
    queryFn: () => axios.get('/user/info')
      .then((response) => {console.log(response.data);
        return response.data;}
      ).catch((error) => {
        if (error.response.status === 401){

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
    editUserMutation.mutateAsync(event.target).then(()=>{setIsEditing(false)});
  }

  const [file, setFile] = useState(null);

  const handleFileChange = (e) =>{
    if (e.target.files){
      setFile(e.target.files[0]);
    }
  }

  const handleUpload = async () => {
    if (file) {

      const formData = new FormData();
      formData.append('file', file);

      try {
        const result = await axios.post('/user/upload_photo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        const data = await result.json();

      } catch (error) {
        console.error(error);
      }
    }
  };

  return(
    <div className="profile-container" >
      {
        (userQuery.isPending || userQuery.isLoading) ?
          <div className="center indent-top">
            <div className="loader"/>
          </div>:
          !userQuery.isSuccess ?
            <div className="center indent-top">
              <div className="fail">Error while loading: {userQuery.error.message}</div>
            </div>
            :
            <>
              <div className="center">
                <div className="profile-pic-container">
                  <img src={userQuery?.data?.photo_url || process.env.REACT_APP_PROFILE_PIC_STUB} alt="profile"/>
                </div>
                <div className="center indent-top">
                  <label for="file" className="file-upload">
                    <input id="file" type="file" onChange={handleFileChange} />
                    Choose file</label>
                  { file && <>{file.name} ({HumanFileSize(file.size)}) </>}
                  <div><button onClick={handleUpload} className="button-margin">Upload</button></div>
                </div>

              </div>


              <form method="post" onSubmit={onSubmitEdit}>
                <div>
                  <div className="profile-info-container">
                    <EditableField label="First name:" isEditing={isEditing}
                      name="first_name" defaultValue={userQuery?.data?.first_name} />
                    <div><hr/></div>
                    <EditableField label="Last name:" isEditing={isEditing}
                      name="last_name" defaultValue={userQuery?.data?.last_name} />
                    <div><hr/></div>
                    <EditableField label="Email:" isEditing={isEditing}
                      name="email" defaultValue={userQuery?.data?.email} />
                    <div><hr/></div>
                    <EditableField label="Username:" isEditing={false}
                      defaultValue={userQuery?.data?.username} />
                  </div>
                  <div className="center">
                    {!isEditing ? <button className="button-margin" onClick={() => setIsEditing(true)}>Edit</button> :
                      <div>
                        <button type="submit" className="button-margin">Save</button>
                        <button type="button" className="alt-button" onClick={()=>setIsEditing(false)}>Cancel</button>
                      </div>}
                  </div>
                </div>
              </form>
              </>
        }
      </div>
  )
}
