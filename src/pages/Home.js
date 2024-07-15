import {keepPreviousData, useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "../api/backend";
import {useContext, useState} from "react";
import AuthContext from "../context/auth";
import {useForm} from "react-hook-form";
import {FormatISODate} from "../features/utils";


function Tweet(tweet){
    return (
        <div className="tweet-record-container">
            <div className="tweet-user-container">
            <span><img src={tweet.created_by?.photo_url || process.env.REACT_APP_PROFILE_PIC_STUB} className="user-xs-pic" alt="profile"/></span>
            <div><b>{tweet.created_by?.first_name + ' ' + tweet.created_by?.last_name }</b></div>
            </div>
            <div className="tweet-container">
                {tweet.message}
            </div>
            <div className="created-at-label">
                {FormatISODate(tweet.created_at)}
            </div>
        </div>
    )
}

export default function Home(){
    const { userInfo } = useContext(AuthContext);
    const queryClient = useQueryClient()
    const {handleSubmit, register} = useForm()
    const [inpValue, setInpValue] = useState('')

    const tweetsQuery = useQuery({
            queryKey: ["tweets"],

            queryFn: () => axios.get('/tweets/all')
                .then((response) => {
                    return response.data;}),
            placeholderData: keepPreviousData
        }
    )

    const onSubmit = async (data) => {
        console.log(data)
        await axios.post('/tweets/new', data)
            .then((response) =>
            {
                if (response.status === 200){
                    queryClient.invalidateQueries({ queryKey: ['tweets'] })
                    setInpValue('')
                } else {
                    console.log(response)
                }

            })

    }
    
    return (
        <div>
            { (tweetsQuery.isPending || tweetsQuery.isLoading) ?
                <div className="center indent-top">
                    <div className="loader"/>
                </div>
                :
                (!tweetsQuery.isSuccess ?
                        <div className="center indent-top">
                            <div className="fail">Error while loading: {tweetsQuery.error.message}</div>
                        </div>
                        :
                        (<div className="tweets-table">
                                {userInfo?.user_guid?
                                <div>
                                    <form method="post" onSubmit={handleSubmit(onSubmit)}>
                                        <div className="tweet-user-container">
                                            <span><img src={userInfo.photo_url !== "null" && userInfo.photo_url ? userInfo.photo_url : process.env.REACT_APP_PROFILE_PIC_STUB} className="user-xs-pic" alt="profile"/></span>
                                            <textarea id="message"
                                                      placeholder="Tell your story..."
                                                      className="tweet-input"
                                                      required={true}
                                                      {...register("message")}
                                                      value={inpValue}
                                                      onChange={e => setInpValue(e.target.value)}
                                            />
                                            <button type="submit">Go!</button>
                                        </div>
                                    </form>
                                </div>: <></>
                                }
                                {tweetsQuery.data.map((tweet) => (
                                    <Tweet key={tweet.guid} {...tweet}/>
                                ))}
                            </div>
                        )
                )
            }
        </div>
    )
}