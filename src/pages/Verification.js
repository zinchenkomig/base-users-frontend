import axios from "../api/backend";
import {useNavigate, useLoaderData} from "react-router-dom";
import {useEffect, useState} from "react";
import {Sleep} from "../features/utils"

export default function Verification(){
    const navigate = useNavigate()
    const [verificationState, setVerificationState] = useState("verifying")
    const data = useLoaderData();
    useEffect(() => {
        axios.post("/auth/verify", data).then(
            (response) => {
                if (response.status === 200){
                    setVerificationState("verified")
                    Sleep(2000).then(() => navigate('/login'))
                }
            }
        ).catch((error) => {
            setVerificationState(error.response.status)
        })
    })
    return (
        verificationState === "verified" ? <>Successfully verified, redirecting to login page</> :
            (verificationState === "verifying" ? <>Verifying</> : <>Error while verifying: {verificationState}</>)
    )
}