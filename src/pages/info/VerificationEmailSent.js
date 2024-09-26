import {Link} from "react-router-dom";

export default function VerificationEmailSent(){
    return (
        <div className="center mt-10">
        <div className="message-frame">
            <div className="text-2xl mb-6">Email Sent</div>
            <div>We sent a verification message on your email. Check your inbox.</div>
            <Link to="/login" className="mt-10 underline text-xl">To Login Page</Link>
        </div>
        </div>
    )
}