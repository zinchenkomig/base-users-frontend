import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../api/backend";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../context/auth";
import { useForm } from "react-hook-form";
import { FormatISODate } from "../features/utils";
import { useInView } from "react-intersection-observer";
import ReactTextareaAutosize from "react-textarea-autosize";


function truncateStringByLinesOrWords(str, maxLines, maxWords) {
  const lines = str.split('\n')
  let totalWords = 0
  let totalLines = 0
  for (const line of lines) {
    totalLines += 1
    if (totalLines >= maxLines) {
      return lines.slice(0, totalLines).join('\n')
    }
    const words = line.split(' ')
    let lineWords = 0
    for (const word of words) {
      lineWords += 1
      totalWords += 1
      if (totalWords > maxWords) {
        return lines.slice(0, totalLines - 1).join('\n') + '\n' + words.slice(0, lineWords - 1).join(' ')
      }
    }
  }
  return str


}

function Tweet(tweet) {
  const truncatedTweet = truncateStringByLinesOrWords(tweet.message, 3, 60)
  const [showMore, setShowMore] = useState(truncatedTweet.length === tweet.message.length)

  return (
    <div className="flex flex-row gap-2 sm:gap-6 mt-10 ml-2 mr-2">
        <img src={tweet.created_by?.photo_url || process.env.REACT_APP_PROFILE_PIC_STUB} className="inline-block h-12 w-12 sm:h-20 sm:w-20 rounded-full object-cover flex-none" alt="profile" />

    <div className="bg-gray-600 rounded-xl max-w-lg">
      <div className="flex flex-row justify-between items-center align">
      <div className="text-gray-300 text-md px-6 py-1">
      {tweet.created_by?.first_name + ' ' + tweet.created_by?.last_name}
      </div>
      <div className="text-gray-300 px-4 py-1 text-xs">
      {FormatISODate(tweet.created_at)}
      </div>
      </div>

      <div className="bg-gray-400 text-gray-200 relative top-0 rounded-xl px-6 py-8 whitespace-pre-wrap">
      {showMore ? tweet.message : truncatedTweet}
      {!showMore && <span className="text-gray-300 text-lg  cursor-pointer pl-6" onClick={() => setShowMore(true)}>...&nbsp;show&nbsp;more</span>}      </div>
    </div>
    </div>
  )
}


function DirtyButton(props) {
  const [started, setStarted] = useState(false)
  const [buttonText, setButtonText] = useState("Post")
  const [count, setCount] = useState(0)

  const buttonVariants = [
    "Push me!",
    "Touch me!",
    "Let's go!",
    "Post"
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
      onMouseEnter={() => { setStarted(true) }}
      onMouseLeave={() => setStarted(false)}
      className="p-4 bg-cyan-600 rounded-full sm:max-w-36 w-28 font-bold">
      {buttonText}
    </button>
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
      }).catch((_)=>{})
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
      }).catch(
        (_) => {}
      )

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
          (<div className="flex flex-col gap-5 items-center">
            {userInfo?.user_guid ?
              <div className="w-full max-w-3xl">
                <form method="post" onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex flex-col sm:items-center w-full gap-4 sm:gap-8 rounded-bl-3xl rounded-br-3xl p-4 sm:p-8 bg-gray-500">
                    <div className="flex flex-none justify-center">
                      <img src={userInfo.photo_url !== "null" && userInfo.photo_url ? userInfo.photo_url : process.env.REACT_APP_PROFILE_PIC_STUB}
                        className="rounded-full object-cover object-center w-16 h-16 flex-none" alt="profile" />
                    </div>
                    <div className="w-full">
                      <ReactTextareaAutosize id="message"
                        maxRows={12}
                        placeholder="Tell your story..."
                        className="p-4 w-full min-h-24 sm:p-6 outline-none focus:outline-1 focus:outline focus:outline-gray-300 resize-none flex-1 rounded-lg bg-gray-400 placeholder:text-gray-300 text-lg"
                        required={true}
                        {...register("message")}
                        value={inpValue}
                        onChange={e => setInpValue(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-center">
                      <DirtyButton type="submit" />
                    </div>
                  </div>
                </form>
              </div> : <></>
            }
            {tweetsQuery?.data?.pages?.map((group, i) => {
              return (
                <Fragment key={i}>
                  {group?.map((tweet) => {
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
