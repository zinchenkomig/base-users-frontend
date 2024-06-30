import {Link} from "react-router-dom";

export default function VerificationEmailSent(){
    return (
        <div className="center">
        <div className="message-frame">
            <h3>Email Sent</h3>
            <div>We sent a verification message on your email. Check your inbox.</div>
            <Link to="/login" className="indent-top">To Login Page</Link>
        </div>
        </div>
    )
}