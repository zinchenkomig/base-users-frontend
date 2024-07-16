import {keepPreviousData, useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "../api/backend";
import {useContext, useEffect, useState} from "react";
import AuthContext from "../context/auth";
import {useForm} from "react-hook-form";
import {FormatISODate} from "../features/utils";
import {flushSync} from "react-dom";


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


function DirtyButton(props){
    const [started, setStarted] = useState(false)
    const [buttonText, setButtonText] = useState("Go!")
    const [count, setCount] = useState(0)

    const buttonVariants = [
        "Push me!",
        "Touch me!",
        "Let's go!",
        "Come on, baby!",
        "Go!"
    ]

    useEffect(() => {
        const timer = setTimeout(() =>
        {
            if (started === true){
                setCount(() => count + 1)
                setButtonText(buttonVariants[count % buttonVariants.length])
            }
        }, 1e3)
        return () => clearTimeout(timer)
    }, [count, started])

    return (
        <button {...props}
        onClick={()=> {
            setStarted(false);
            setButtonText("MMMM, YEESS!!!");
            setTimeout(() => {
                setButtonText("Go!")
            }, 1.5e3)
        }}
                onMouseEnter={()=>{setStarted(true)}}
                onMouseLeave={()=>setStarted(false)} className="go-button">{buttonText}</button>
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
                                            <DirtyButton type="submit"/>
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