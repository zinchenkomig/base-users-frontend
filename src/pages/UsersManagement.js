import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import axios from "../api/backend";
import { CancelButton, CheckButton, DeleteButton, EditButton } from "../components/Buttons";
import { useContext, useState } from "react";
import AuthContext from "../context/auth";
import { CheckedIcon, UncheckedIcon } from "../components/Icons";
import { MultiSelect } from "../components/Inputs";
import { FaSearch } from "react-icons/fa";



function UserRecordField({ fieldName, children, isSingle }) {
  return (
    <div className="user-record-info-field">
      <div className="user-record-info-field-name">
        {fieldName}
      </div>
      <div className={"user-record-info-value" + (isSingle ? " user-record-info-value-single" : "")}>
        {children}
      </div>
    </div>
  )
}


const options = [
  { value: 'reader', label: 'reader' },
  { value: 'admin', label: 'admin' },
]


function UserRecord(user) {
  const [isEditing, setIsEditing] = useState(false);
  const { userInfo } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const deleteUserMutation = useMutation({
    mutationFn: (user) => {
      return axios.post('/superuser/users/delete', null, { params: { guid: user.guid } })
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
      await axios.post('/superuser/users/update', formJson, { params: { guid: user.guid } });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries("users");
    }
  })

  const onSubmitEdit = event => {
    event.preventDefault();
    editUserMutation.mutateAsync(event.target).then(() => { setIsEditing(false) });
  }

  return (

    <form method="post" onSubmit={onSubmitEdit}>
      <div className="user-record-container">
        <div className="user-record">
          <div className="user-record-info">
            <span><img src={user?.photo_url || process.env.REACT_APP_PROFILE_PIC_STUB} className="user-small-pic" alt="profile" /></span>
            <UserRecordField isSingle={true} fieldName="Username:">
              {!isEditing ?
                user.email :
                <input name="email" type="text" className="in-record-input" defaultValue={user.email} />}
            </UserRecordField>
            <UserRecordField isSingle={true} fieldName="Email:" >
              {!isEditing ? user.email :
                <input name="email" type="text" className="in-record-input" defaultValue={user.email} />}
            </UserRecordField>
            <UserRecordField isSingle={false} fieldName="Roles:" >
              {!isEditing ?
                user.roles.join(", ") :
                <MultiSelect options={options}
                  defaultValue={
                    user.roles.map(
                      (x) => { return { "value": x, "label": x } })
                  } />
              }</UserRecordField>
            <UserRecordField isSingle={true} fieldName="Verified:" >
              {user.is_verified ? <CheckedIcon /> : <UncheckedIcon />}
            </UserRecordField>
          </div>
          <span className="user-record-button">
            {
              isEditing ?
                <>
                  <CheckButton type="submit" />
                  <CancelButton type="button" onClick={() => { setIsEditing(false) }} />
                </>
                :
                <>
                  <EditButton type="button" onClick={() => {
                    setIsEditing(true);
                  }}
                  />
                  <DeleteButton type="button" onClick={() => {
                    deleteUserMutation.mutate(user)
                  }}
                    disabled={userInfo.email === user.email}
                  />
                </>
            }

          </span>
        </div>
        {(editUserMutation.isLoading || deleteUserMutation.isLoading) ?
          <div className="fader" />
          :
          <>
          </>
        }

      </div>
    </form>

  )
}

function SearchInput({ onChange }) {
  return (
    <div className="input-icon-container">
      <FaSearch className="input-icon" />
      <input onChange={onChange} className="full-width search-input" />
    </div>
  )
}

export default function UserManagement() {
  const [searchString, setSearchString] = useState("")
  const usersQuery = useQuery({
    queryKey: ["users", searchString],

    queryFn: () => axios.get('/superuser/users', {
      params: {
        "search": searchString
      }
    })
      .then((response) => {
        return response.data;
      })
      .catch(),
    placeholderData: keepPreviousData
  }
  )
  return (
    <div>
      <div className="search-input-container">
        <SearchInput onChange={(e) => e.target.value.length >= 2 || e.target.value.length === 0 ? setSearchString(e.target.value) : null} />
      </div>
      {(usersQuery.isPending || usersQuery.isLoading) ?
        <div className="center indent-top">
          <div className="loader" />
        </div>
        :
        (!usersQuery.isSuccess ?
          <div className="center indent-top">
            <div className="fail">Error while loading: {usersQuery.error.message}</div>
          </div>
          :
          (<div className="users-table">
            {usersQuery.data.map((user) => (
              <UserRecord key={user.id} {...user} />
            ))}
          </div>
          )
        )
      }

    </div>
  )
}
