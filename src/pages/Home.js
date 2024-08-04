import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../api/backend";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../context/auth";
import { useForm } from "react-hook-form";
import { FormatISODate } from "../features/utils";
import { useInView } from "react-intersection-observer";


function Tweet(tweet) {
  return (
    <div className="tweet-record-container">
      <div className="tweet-user-container">
        <img src={tweet.created_by?.photo_url || process.env.REACT_APP_PROFILE_PIC_STUB} className="user-xs-pic" alt="profile" />
        <div><b>{tweet.created_by?.first_name + ' ' + tweet.created_by?.last_name}</b></div>
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


function DirtyButton(props) {
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
    const timer = setTimeout(() => {
      if (started === true) {
        setCount(() => count + 1)
        setButtonText(buttonVariants[count % buttonVariants.length])
      }
    }, 1e3)
    return () => clearTimeout(timer)
  }, [count, started])

  return (
    <button {...props}
      onClick={() => {
        setStarted(false);
        setButtonText("MMMM, YEESS!!!");
        setTimeout(() => {
          setButtonText("Go!")
        }, 1.5e3)
      }}
      onMouseEnter={() => { setStarted(true) }}
      onMouseLeave={() => setStarted(false)} className="p-4 bg-purple-300 max-w-36 font-bold">{buttonText}</button>
  )

}


export default function Home() {

  const { userInfo } = useContext(AuthContext);
  const queryClient = useQueryClient()
  const { handleSubmit, register } = useForm()
  const [inpValue, setInpValue] = useState('')
  const pageSize = 20
  const queryTweets = async ({ pageParam }) => {
    return await axios.get('/tweets', { params: { page: pageParam, limit: pageSize } })
      .then((response) => {
        return response.data;
      })
  }

  const tweetsQuery = useInfiniteQuery({
    queryKey: ["tweets"],
    queryFn: queryTweets,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages, lastPageParam) => lastPageParam + 1,
  }
  )

  const { ref } = useInView({
    onChange:
      async (inView) => {
        if (inView) {
          await tweetsQuery.fetchNextPage()
        }
      }
  });

  const onSubmit = async (data) => {
    await axios.post('/tweets/new', data)
      .then((response) => {
        if (response.status === 200) {
          queryClient.invalidateQueries({ queryKey: ['tweets'] })
          setInpValue('')
          queryClient.setQueryData(['tweets'], (data) => ({
            pages: data.pages.slice(0, 1),
            pageParams: data.pageParams.slice(0, 1),
          }))
        }

      })

  }

  return (
    <div>
      {(tweetsQuery.isPending || tweetsQuery.isLoading) ?
        <div className="center indent-top">
          <div className="loader" />
        </div>
        :
        (!tweetsQuery.isSuccess ?
          <div className="center indent-top">
            <div className="fail">Error while loading: {tweetsQuery.error.message}</div>
          </div>
          :
          (<div className="tweets-table">
            {userInfo?.user_guid ?
              <div>
                <form method="post" onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex flex-row items-center gap-4 sm:gap-8 rounded-xl p-8 bg-gradient-to-t from-gray-700 to-gray-500">
                    <img src={userInfo.photo_url !== "null" && userInfo.photo_url ? userInfo.photo_url : process.env.REACT_APP_PROFILE_PIC_STUB} className="rounded-full object-cover object-center w-14 sm:w-20 h-14 sm:h-20 flex-none" alt="profile" />
                    <textarea id="message"
                      placeholder="Tell your story..."
                      className="p-6 outline-none focus:outline-1 focus:outline focus:outline-gray-300 resize-none flex-1 rounded-lg bg-gray-400 placeholder:text-gray-300 text-lg"
                      required={true}
                      {...register("message")}
                      value={inpValue}
                      onChange={e => setInpValue(e.target.value)}
                    />
                    <DirtyButton type="submit" />
                  </div>
                </form>
              </div> : <></>
            }
            {tweetsQuery.data.pages.map((group, i) => {
              return (
                <Fragment key={i}>
                  {group.map((tweet) => {
                    return (
                      <Tweet key={tweet.guid} {...tweet} />
                    )
                  }
                  )}
                </Fragment>
              )
            })}

            <div ref={ref}>
            </div>

            {tweetsQuery.isFetchingNextPage && <div className="center indent-top"> <div className="loader" /></div>}


          </div>
          )
        )
      }
    </div>
  )
}
